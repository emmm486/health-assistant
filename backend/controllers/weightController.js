const { pool } = require('../db');

exports.recordWeight = async (req, res) => {
  try {
    const userId = req.user.id;
    const { weight, notes } = req.body;

    if (!weight || weight <= 0) {
      return res.status(400).json({ error: 'Valid weight required' });
    }

    const connection = await pool.getConnection();
    const recordDate = new Date().toISOString().split('T')[0];

    await connection.query(
      'INSERT INTO weight_records (user_id, weight, record_date, notes) VALUES (?, ?, ?, ?)',
      [userId, weight, recordDate, notes || null]
    );

    connection.release();

    res.status(201).json({ message: 'Weight recorded successfully' });
  } catch (error) {
    console.error('Record weight error:', error);
    res.status(500).json({ error: 'Failed to record weight' });
  }
};

exports.getWeightHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const connection = await pool.getConnection();

    const [rows] = await connection.query(
      `SELECT id, weight, record_date, notes, created_at
       FROM weight_records 
       WHERE user_id = ? 
       ORDER BY record_date DESC`,
      [userId]
    );

    connection.release();

    res.json(rows);
  } catch (error) {
    console.error('Get weight history error:', error);
    res.status(500).json({ error: 'Failed to fetch weight history' });
  }
};

exports.getWeightStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const connection = await pool.getConnection();

    const [rows] = await connection.query(
      `SELECT weight, record_date
       FROM weight_records 
       WHERE user_id = ? 
       ORDER BY record_date ASC`,
      [userId]
    );

    connection.release();

    if (rows.length === 0) {
      return res.json({
        current: null,
        initial: null,
        change: 0,
        records: []
      });
    }

    const current = rows[rows.length - 1].weight;
    const initial = rows[0].weight;
    const change = current - initial;

    res.json({
      current,
      initial,
      change,
      recordCount: rows.length,
      records: rows
    });
  } catch (error) {
    console.error('Get weight stats error:', error);
    res.status(500).json({ error: 'Failed to fetch weight stats' });
  }
};
