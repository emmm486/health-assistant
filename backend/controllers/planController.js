const { pool } = require('../db');
const deepseekService = require('../services/deepseekService');

exports.generatePlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const connection = await pool.getConnection();

    // 获取用户健康档案
    const [profileRows] = await connection.query(
      'SELECT * FROM health_profiles WHERE user_id = ?',
      [userId]
    );

    if (profileRows.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'Health profile not found. Please complete your profile first.' });
    }

    const profile = profileRows[0];

    // 获取最近的体重变化趋势
    let weightContext = null;
    const [weightRows] = await connection.query(
      `SELECT weight, record_date FROM weight_records 
       WHERE user_id = ? 
       ORDER BY record_date DESC 
       LIMIT 5`,
      [userId]
    );

    if (weightRows.length > 0) {
      const records = weightRows.reverse();
      const weightTrend = records.map(r => `${r.record_date}: ${r.weight}kg`).join(', ');
      const firstWeight = records[0].weight;
      const lastWeight = records[records.length - 1].weight;
      const change = lastWeight - firstWeight;
      
      weightContext = `最近体重记录: ${weightTrend}。体重变化: ${change > 0 ? '+' : ''}${change.toFixed(1)}kg`;
    }

    // 调用 DeepSeek API 生成计划
    const planData = await deepseekService.generatePlan(profile, weightContext);

    // 获取周数
    const currentWeek = Math.ceil((new Date().getDate()) / 7);

    // 保存计划到数据库
    await connection.query(
      `INSERT INTO generated_plans (user_id, plan_type, week_number, diet_plan, exercise_plan, weight_context)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        'combined',
        currentWeek,
        JSON.stringify(planData.dietPlan || {}),
        JSON.stringify(planData.exercisePlan || {}),
        weightContext || ''
      ]
    );

    connection.release();

    res.json({
      plan: planData,
      weekNumber: currentWeek,
      message: 'Plan generated successfully'
    });
  } catch (error) {
    console.error('Generate plan error:', error);
    res.status(500).json({ error: 'Failed to generate plan: ' + error.message });
  }
};

exports.getPlanHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const connection = await pool.getConnection();

    const [rows] = await connection.query(
      `SELECT id, week_number, created_at, diet_plan, exercise_plan, weight_context
       FROM generated_plans 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 20`,
      [userId]
    );

    connection.release();

    // 解析 JSON 字段
    const plans = rows.map(p => ({
      ...p,
      dietPlan: p.diet_plan ? JSON.parse(p.diet_plan) : {},
      exercisePlan: p.exercise_plan ? JSON.parse(p.exercise_plan) : {}
    }));

    res.json(plans);
  } catch (error) {
    console.error('Get plan history error:', error);
    res.status(500).json({ error: 'Failed to fetch plan history' });
  }
};
