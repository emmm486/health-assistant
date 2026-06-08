# 🌟 智能健康助手 - Health Assistant

一个 AI 驱动的个性化饮食与运动规划系统，使用 Java Spring Boot 后端和现代化前端。

## 📋 功能特性

✅ **用户认证系统**
- 用户注册/登录
- JWT 令牌认证
- 密码加密存储（BCrypt）
- 用户数据隔离

✅ **健康档案管理**
- 年龄、性别、身高、体重
- 活动水平（低/中/高）
- 饮食偏好（素食/均衡/高蛋白等）
- 健康目标（减肥/增肌/保持健康）
- 档案编辑和更新

✅ **AI 计划生成**
- 集成 DeepSeek LLM API
- 基于用户档案生成个性化方案
- 一周饮食计划
- 一周运动计划
- 实时友好的展示方式

✅ **体重追踪**
- 每周记录体重
- 保存历史记录
- 自动计算体重变化
- 智能调整计划

✅ **历史记录查看**
- 查看所有体重记录
- 查看历史生成的计划
- 数据统计分析

## 🛠 技术栈

**后端**
- Java 17
- Spring Boot 3.2.0
- Spring Security
- Spring Data JPA
- MySQL 8.0
- JWT (JSON Web Token)
- Maven

**前端**
- HTML5
- CSS3（响应式设计）
- JavaScript（原生 DOM 操作）

**API 集成**
- DeepSeek Chat API

## 📁 项目结构

```
health-assistant/
├── backend-java/                          # Java Spring Boot 后端
│   ├── pom.xml                           # Maven 配置
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/health/
│   │   │   │   ├── HealthAssistantApplication.java
│   │   │   │   ├── config/              # Spring 配置
│   │   │   │   ├── controller/          # REST 控制器
│   │   │   │   ├── service/             # 业务逻辑
│   │   │   │   ├── repository/          # 数据访问
│   │   │   │   ├── entity/              # JPA 实体
│   │   │   │   ├── dto/                 # 数据转移对象
│   │   │   │   └── security/            # 安全相关
│   │   │   └── resources/
│   │   │       └── application.yml      # 应用配置
│   │   └── test/
│   └── README.md                         # 后端文档
│
├── frontend/                              # 前端应用
│   ├── index.html                        # 首页
│   ├── register.html                     # 注册页
│   ├── login.html                        # 登录页
│   ├── dashboard.html                    # 仪表板
│   ├── profile.html                      # 健康档案
│   ├── plan.html                         # 计划生成
│   ├── history.html                      # 历史记录
│   ├── css/
│   │   └── styles.css                   # 样式表
│   └── js/
│       ├── main.js                      # 主逻辑
│       ├── auth.js                      # 认证处理
│       ├── api.js                       # API 调用
│       └── utils.js                     # 工具函数
│
├── README.md                              # 项目说明
└── .gitignore                             # Git 忽略文件
```

## 🚀 快速开始

### 前置要求

- Java 17 或更高版本
- Maven 3.6+
- MySQL 8.0+
- DeepSeek API Key（[申请地址](https://platform.deepseek.com)）

### 后端启动

#### 1. 进入后端目录

```bash
cd backend-java
```

#### 2. 配置数据库

编辑 `src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/health_assistant?useSSL=false&serverTimezone=UTC&characterEncoding=utf8mb4
    username: root
    password: 你的MySQL密码
    driver-class-name: com.mysql.cj.jdbc.Driver
```

#### 3. 配置 DeepSeek API

编辑 `src/main/resources/application.yml`：

```yaml
app:
  jwt:
    secret: your_jwt_secret_key_change_in_production
  deepseek:
    api-key: sk-xxxxxxxxxxxxxxxx  # 从 https://platform.deepseek.com 获取
    api-url: https://api.deepseek.com/v1
```

#### 4. 初始化数据库

**方式 1：自动创建（Hibernate）**

在 `application.yml` 中设置：
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: create  # 首次运行使用 create，之后改为 validate
```

**方式 2：手动执行 SQL**

```bash
mysql -u root -p health_assistant < schema.sql
```

#### 5. 构建项目

```bash
mvn clean install
```

#### 6. 运行应用

```bash
mvn spring-boot:run
```

或

```bash
mvn clean package
java -jar target/health-assistant-1.0.0.jar
```

#### 7. 验证后端

访问健康检查端点：
```
http://localhost:3000/api/health
```

看到 `{"status":"ok"}` 说明后端运行成功！

### 前端访问

打开浏览器访问：
```
http://localhost:3000
```

前端文件会由后端的 Spring Boot 静态文件服务提供。

## 📝 使用流程

1. **注册/登录**
   - 访问首页，点击【注册】创建账户
   - 或点击【登录】使用已有账户

2. **完成健康档案**
   - 填写个人信息（年龄、身高、体重等）
   - 选择活动水平和饮食偏好
   - 设置健康目标

3. **生成个性化计划**
   - 点击【获取计划】
   - AI 根据档案和体重变化趋势生成方案
   - 查看一周的饮食和运动计划

4. **记录体重和追踪**
   - 每周更新体重记录
   - 系统自动计算变化
   - AI 根据变化动态调整下一周计划

5. **查看历史记录**
   - 查看所有体重记录
   - 查看之前生成的计划
   - 分析进度和趋势

## 🔌 API 端点

### 认证

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | `/api/auth/register` | 注册用户 |
| POST | `/api/auth/login` | 用户登录 |

### 健康档案（需认证）

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/api/profile` | 获取健康档案 |
| POST | `/api/profile` | 创建/更新档案 |

### 计划生成（需认证）

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | `/api/plan/generate` | 生成 AI 计划 |
| GET | `/api/plan/history` | 获取计划历史 |

### 体重记录（需认证）

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | `/api/weight` | 记录体重 |
| GET | `/api/weight/history` | 获取体重历史 |
| GET | `/api/weight/stats` | 获取体重统计 |

### 其他

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |

## 🗄 数据库设计

### users（用户表）
```sql
id, username, password, email, created_at, updated_at
```

### health_profiles（健康档案表）
```sql
id, user_id, age, gender, height, weight, activity_level, 
dietary_preference, health_goal, created_at, updated_at
```

### weight_records（体重记录表）
```sql
id, user_id, weight, record_date, notes, created_at
```

### generated_plans（生成计划表）
```sql
id, user_id, plan_type, week_number, diet_plan, exercise_plan, 
weight_context, created_at
```

## 🔐 安全特性

✅ **认证**
- JWT Token 认证
- Token 过期时间：7 天
- Bearer Token 格式

✅ **密码安全**
- BCrypt 加密存储
- 最少 6 个字符
- 验证密码强度

✅ **授权**
- Spring Security 权限控制
- 用户数据隔离
- 公开端点和受保护端点分离

✅ **CORS 防护**
- 配置允许的源
- 支持跨域请求
- 安全的 cookie 处理

## ⚠️ 生产环境配置

在生产环境中，请修改以下配置：

```yaml
app:
  jwt:
    secret: 使用强密码和复杂的密钥
    expiration: 根据需要调整过期时间
  deepseek:
    api-key: 使用环境变量或密钥管理系统

spring:
  datasource:
    url: 使用 HTTPS 和生产数据库地址
    username: 使用强密码
    password: 从环境变量或密钥管理系统读取

server:
  servlet:
    secure: true
    httpOnly: true
```

## 📊 架构设计

```
┌─────────────────────────────────────────────────────────┐
│                    前端 (HTML/CSS/JS)                  │
│              http://localhost:3000                      │
└────────────────────────┬────────────────────────────────┘
                         │
                      HTTP/JSON
                         │
┌────────────────────────▼────────────────────────────────┐
│           Spring Boot REST API 应用                     │
│                    :3000                                 │
├─────────────────────────────────────────────────────────┤
│ ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│ │ Controllers  │  │  Services    │  │ Repositories  │  │
│ │  (REST)      │  │  (Business)  │  │  (Data JPA)   │  │
│ └──────────────┘  └──────────────┘  └───────────────┘  │
├─────────────────────────────────────────────────────────┤
│              Spring Security (JWT Authentication)       │
└────────────────────────┬────────────────────────────────┘
                         │
            ┌────────────┼────────────┐
            │            │            │
         MySQL      DeepSeek API    日志
      database         API          系统
```

## 🧪 测试

### 注册新用户

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "email": "test@example.com"
  }'
```

### 登录

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### 创建健康档案

```bash
curl -X POST http://localhost:3000/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "age": 25,
    "gender": "male",
    "height": 175,
    "weight": 70,
    "activityLevel": "moderate",
    "dietaryPreference": "balanced",
    "healthGoal": "maintain"
  }'
```

## 📚 开发指南

### 添加新的 API 端点

1. **创建 DTO 类**（如需要）
   ```java
   @Data
   @NoArgsConstructor
   @AllArgsConstructor
   public class NewRequestDto { ... }
   ```

2. **创建 Service 类**
   ```java
   @Service
   @RequiredArgsConstructor
   public class NewService { ... }
   ```

3. **创建 Controller 类**
   ```java
   @RestController
   @RequestMapping("/api/new")
   @RequiredArgsConstructor
   public class NewController { ... }
   ```

### 更新数据库架构

修改 `application.yml` 中的 `ddl-auto`：
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update  # 自动更新表结构
```

### 调试和日志

在 `application.yml` 中调整日志级别：
```yaml
logging:
  level:
    root: INFO
    com.health: DEBUG  # 调试应用代码
    org.springframework.security: DEBUG  # 调试安全问题
```

## 🐛 常见问题

### MySQL 连接失败

检查 MySQL 服务是否启动：
```bash
# Linux/Mac
sudo systemctl status mysql

# Windows
net start MySQL80
```

### DeepSeek API 超时

增加超时时间或检查网络连接。

### 端口被占用

修改 `application.yml`：
```yaml
server:
  port: 3001  # 改为其他端口
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请提交 GitHub Issue。

---

**祝你使用愉快！** 🎉
