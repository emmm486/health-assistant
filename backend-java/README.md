# Health Assistant - Java Spring Boot Backend

这是智能健康助手的 Java Spring Boot 后端实现。

## 技术栈

- **Java**: 17
- **框架**: Spring Boot 3.2.0
- **数据库**: MySQL 8.0
- **构建工具**: Maven
- **认证**: JWT (JSON Web Token)
- **LLM**: DeepSeek API

## 前置条件

- Java 17 或更高
- Maven 3.6+
- MySQL 8.0+
- DeepSeek API Key

## 项目结构

```
backend-java/
├── src/
│   └── main/
│       ├── java/com/health/
│       │   ├── HealthAssistantApplication.java       # 主入口
│       │   ├── config/                               # 配置类
│       │   │   ├── SecurityConfig.java               # Spring Security 配置
│       │   │   ├── JwtConfig.java                    # JWT 配置
│       │   │   └── DeepseekConfig.java              # DeepSeek 配置
│       │   ├── controller/                           # 控制器
│       │   │   ├── AuthController.java               # 认证
│       │   │   ├── HealthProfileController.java      # 健康档案
│       │   │   ├── WeightRecordController.java       # 体重记录
│       │   │   ├── PlanController.java               # 计划生成
│       │   │   └── HealthController.java             # 健康检查
│       │   ├── service/                              # 业务逻辑
│       │   │   ├── AuthService.java
│       │   │   ├── HealthProfileService.java
│       │   │   ├── WeightRecordService.java
│       │   │   ├── DeepseekService.java              # DeepSeek 集成
│       │   │   └── PlanService.java
│       │   ├── repository/                           # 数据访问
│       │   ├── entity/                               # JPA 实体
│       │   ├── dto/                                  # 数据转移对象
│       │   └── security/                             # 安全相关
│       └── resources/
│           └── application.yml                       # 配置文件
└── pom.xml                                            # Maven 依赖
```

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/emmm486/health-assistant.git
cd health-assistant/backend-java
```

### 2. 配置数据库

编辑 `src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/health_assistant?useSSL=false&serverTimezone=UTC
    username: root
    password: 你的MySQL密码
```

### 3. 配置 DeepSeek API

在环境变量中设置：

```bash
export DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx
```

或在 `application.yml` 中配置：

```yaml
app:
  deepseek:
    api-key: your_api_key
```

### 4. 初始化数据库

```bash
# 使用之前的 Node.js 脚本初始化
# 或直接导入 ../backend/sql/schema.sql
```

### 5. 构建项目

```bash
mvn clean install
```

### 6. 运行应用

```bash
mvn spring-boot:run
```

或

```bash
java -jar target/health-assistant-1.0.0.jar
```

应用将在 `http://localhost:3000` 启动。

## API 端点

### 认证
- `POST /api/auth/register` - 注册用户
- `POST /api/auth/login` - 登录用户

### 健康档案
- `GET /api/profile` - 获取档案（需认证）
- `POST /api/profile` - 创建/更新档案（需认证）

### 计划生成
- `POST /api/plan/generate` - 生成 AI 计划（需认证）
- `GET /api/plan/history` - 获取计划历史（需认证）

### 体重记录
- `POST /api/weight` - 记录体重（需认证）
- `GET /api/weight/history` - 获取体重历史（需认证）
- `GET /api/weight/stats` - 获取体重统计（需认证）

### 其他
- `GET /api/health` - 健康检查

## 与 Node.js 后端的区别

✅ **优势**
- 更强大的类型系统
- 更好的性能
- 企业级应用常用
- 更丰富的生态

✅ **改进**
- 完整的 JPA 实体映射
- Spring Security 完整集成
- 更好的异常处理
- 数据验证注解

## 常见问题

### MySQL 连接失败

检查 `application.yml` 中的数据库配置，确保 MySQL 服务已启动。

### 编译失败

确保已安装 Java 17：

```bash
java -version
```

### DeepSeek API 错误

检查 API Key 是否正确和有效。

## 开发说明

### 添加新的 API 端点

1. 创建 DTO 类（如需要）
2. 创建 Service 类
3. 创建 Controller 类
4. 在 `application.yml` 中配置路由（如需要）

### 更新数据库架构

在 `application.yml` 中修改：

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update  # 自动更新表
```

## 部署

### Docker 部署

```bash
docker build -t health-assistant .
docker run -p 3000:3000 health-assistant
```

### Linux 服务部署

```bash
mvn clean package
sudo mv target/health-assistant-1.0.0.jar /opt/
sudo systemctl start health-assistant
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
