const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { pool, initializeDatabase } = require('./db');
const config = require('./config');

// 路由导入
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const planRoutes = require('./routes/plan');
const weightRoutes = require('./routes/weight');

const app = express();

// 中间件
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// 静态文件
app.use(express.static('../frontend'));

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/plan', planRoutes);
app.use('/api/weight', weightRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 启动服务器
const PORT = config.server.port;

async function start() {
  try {
    console.log('🚀 Initializing database...');
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
      console.log(`📁 Frontend available at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

start();
