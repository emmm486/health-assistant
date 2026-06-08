const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const config = require('./config');

async function initializeDatabase() {
  try {
    // 连接到 MySQL 服务器
    const connection = await mysql.createConnection({
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      port: config.db.port
    });

    console.log('✅ Connected to MySQL Server');

    // 创建数据库
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${config.db.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✅ Database '${config.db.database}' ready`);

    // 切换到新数据库
    await connection.changeUser({ database: config.db.database });

    // 读取并执行 SQL schema
    const schemaPath = path.join(__dirname, 'sql', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // 按语句分割并执行
    const statements = schema.split(';').filter(s => s.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }
    
    console.log('✅ Database tables created successfully');

    await connection.end();
    console.log('✅ Database initialization complete!');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  }
}

// 创建连接池
const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  port: config.db.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = {
  pool,
  initializeDatabase
};
