const { pool } = require('../db');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const connection = await pool.getConnection();
    
    const [rows] = await connection.query(
      'SELECT * FROM health_profiles WHERE user_id = ?',
      [userId]
    );
    
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

exports.createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { age, gender, height, weight, activity_level, dietary_preference, health_goal } = req.body;

    if (!age || !gender || !height || !weight) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();

    // 检查档案是否存在
    const [rows] = await connection.query(
      'SELECT id FROM health_profiles WHERE user_id = ?',
      [userId]
    );

    if (rows.length > 0) {
      // 更新
      await connection.query(
        `UPDATE health_profiles 
         SET age = ?, gender = ?, height = ?, weight = ?, activity_level = ?, dietary_preference = ?, health_goal = ?
         WHERE user_id = ?`,
        [age, gender, height, weight, activity_level, dietary_preference, health_goal, userId]
      );
    } else {
      // 创建
      await connection.query(
        `INSERT INTO health_profiles (user_id, age, gender, height, weight, activity_level, dietary_preference, health_goal)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, age, gender, height, weight, activity_level, dietary_preference, health_goal]
      );
    }

    connection.release();

    res.json({ message: 'Profile saved successfully' });
  } catch (error) {
    console.error('Create/update profile error:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
};
