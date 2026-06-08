# 🌟 智能健康助手 - 个性化饮食与运动规划系统

一个 AI 驱动的 Web 应用，用户输入个人基本信息，系统调用 DeepSeek LLM 生成个性化的饮食和运动计划，并通过"记忆"机制跟踪体重变化，动态调整后续推荐。

## 📋 功能特性

✅ **用户认证系统**
- 注册/登录（用户名/密码）
- JWT 令牌认证
- 用户数据隔离

✅ **健康档案管理**
- 年龄、性别、身高、体重
- 活动水平（低/中/高）
- 饮食偏好（素食/均衡/高蛋白等）
- 健康目标（减肥/增肌/保持健康）

✅ **AI 计划生成**
- 集成 DeepSeek API
- 生成一周饮食计划
- 生成一周运动计划
- 实时友好展示

✅ **体重追踪**
- 每周记录体重
- 保存历史记录
- 自动计算变化趋势
- 根据趋势动态调整计划

✅ **历史记录查看**
- 查看所有体重记录
- 查看历史生成的计划
- 数据统计分析

## 🛠 技术栈

**前端**
- HTML5
- CSS3（响应式设计）
- JavaScript（原生 DOM 操作）

**后端**
- Node.js + Express
- MySQL 数据库
- JWT 认证
- bcryptjs 密码加密

**API 集成**
- DeepSeek Chat API

## 📦 项目结构

```
health-assistant/
├── backend/
│   ├── server.js                 # 主服务器
│   ├── config.js                 # 配置文件
│   ├── db.js                     # 数据库连接
│   ├── routes/
│   │   ├── auth.js              # 认证路由
│   │   ├── profile.js           # 档案路由
│   │   ├── plan.js              # 计划路由
│   │   └── weight.js            # 体重路由
│   ├── controllers/              # 业务逻辑
│   ├── middleware/
│   │   └── auth.js              # JWT 中间件
│   ├── services/
│   │   └── deepseekService.js   # DeepSeek 集成
│   └── sql/
│       └── schema.sql           # 数据库设计
├── frontend/
│   ├── index.html
│   ├── register.html
│   ├── login.html
│   ├── dashboard.html
│   ├── profile.html
│   ├── plan.html
│   ├── history.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── main.js
│       ├── auth.js
│       ├── api.js
│       └── utils.js
├── package.json
├── .env.example
└── README.md
```

## 🚀 快速开始

### 前置条件

- Node.js >= 14
- MySQL >= 5.7
- DeepSeek API Key（[获取](https://platform.deepseek.com)）

### 安装步骤

#### 1. 克隆或下载项目

```bash
cd health-assistant
```

#### 2. 安装依赖

```bash
npm install
```

#### 3. 配置环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的配置：

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的数据库密码
DB_NAME=health_assistant

# JWT 配置
JWT_SECRET=你的密钥（生产环境建议复杂密码）

# DeepSeek API
DEEPSEEK_API_KEY=你的DeepSeek API Key
DEEPSEEK_API_URL=https://api.deepseek.com/v1

# 服务器配置
PORT=3000
NODE_ENV=development
```

#### 4. 初始化数据库

```bash
npm run db:init
```

这会自动创建数据库和所有表。

#### 5. 启动服务器

```bash
npm start
```

或者开发模式（支持热重载）：

```bash
npm run dev
```

#### 6. 访问应用

打开浏览器访问：**http://localhost:3000**

## 📖 使用流程

1. **注册/登录** → 创建账户或登录
2. **完成健康档案** → 填写个人信息
3. **生成计划** → AI 生成一周方案
4. **记录体重** → 每周更新体重数据
5. **查看历史** → 查看所有记录和历史计划

## 🔌 API 端点

### 认证
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录

### 档案
- `GET /api/profile` - 获取档案
- `POST /api/profile` - 创建/更新档案

### 计划
- `POST /api/plan/generate` - 生成计划
- `GET /api/plan/history` - 获取历史计划

### 体重
- `POST /api/weight` - 记录体重
- `GET /api/weight/history` - 获取体重历史
- `GET /api/weight/stats` - 获取体重统计

## 📊 数据库设计

### 用户表 (users)
```sql
id, username, password, email, created_at, updated_at
```

### 健康档案表 (health_profiles)
```sql
id, user_id, age, gender, height, weight, activity_level, dietary_preference, health_goal
```

### 体重记录表 (weight_records)
```sql
id, user_id, weight, record_date, notes, created_at
```

### 计划表 (generated_plans)
```sql
id, user_id, plan_type, week_number, diet_plan, exercise_plan, weight_context, created_at
```

## 🔐 安全建议

✅ 在生产环境：
- 修改 JWT_SECRET 为强密码
- 启用 HTTPS
- 设置数据库密码
- 配置 CORS 限制
- 启用请求速率限制
- 定期更新依赖包

## 🐛 故障排查

### 数据库连接失败
- 检查 MySQL 是否运行
- 验证 `.env` 中的数据库配置
- 确保数据库用户有足够权限

### DeepSeek API 错误
- 验证 API Key 是否有效
- 检查 API 调用配额
- 查看错误日志获取详细信息

### 端口被占用
- 修改 `.env` 中的 PORT
- 或: `PORT=3001 npm start`

## 📝 开发说明

### 添加新功能
1. 在相应路由文件中添加端点
2. 在控制器中实现业务逻辑
3. 在前端添加 UI 和 API 调用
4. 测试新功能

### 修改数据库架构
1. 编辑 `backend/sql/schema.sql`
2. 运行 `npm run db:init` 重新初始化

## 📄 许可证

MIT License

## 👨‍💻 贡献

欢迎提交 Issues 和 Pull Requests！

## 📞 支持

如有问题，请提交 GitHub Issue。

---

**祝你使用愉快！** 🎉
