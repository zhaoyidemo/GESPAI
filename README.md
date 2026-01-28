# GESP AI

AI 驱动的 GESP 编程等级考试备考助手。

## 功能特性

- **智能学习规划**：AI 根据你的目标和时间，生成个性化学习计划
- **知识点学习**：互动式 AI 辅导，随时解答疑问
- **在线编程**：Monaco 编辑器 + 在线判题系统
- **进度追踪**：连胜系统、XP 经验值、成就徽章
- **数据导入**：支持洛谷数据导入和代码分析

## 技术栈

- **前端**：Next.js 14 + React + TypeScript
- **样式**：Tailwind CSS + shadcn/ui
- **编辑器**：Monaco Editor
- **后端**：Next.js API Routes
- **数据库**：PostgreSQL + Prisma ORM
- **认证**：NextAuth.js
- **AI**：Claude API (Anthropic)
- **判题**：Judge0 API

## 本地开发

1. 克隆仓库
```bash
git clone https://github.com/YOUR_USERNAME/gespai.git
cd gespai
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填入必要的配置
```

4. 初始化数据库
```bash
npx prisma generate
npx prisma db push
```

5. 启动开发服务器
```bash
npm run dev
```

## 部署

项目配置为部署到 Railway：

1. 在 Railway 创建新项目
2. 添加 PostgreSQL 数据库
3. 连接 GitHub 仓库
4. 配置环境变量
5. 部署

## 环境变量

| 变量名 | 说明 |
|--------|------|
| DATABASE_URL | PostgreSQL 数据库连接字符串 |
| NEXTAUTH_SECRET | NextAuth 密钥 |
| NEXTAUTH_URL | 应用 URL |
| ANTHROPIC_API_KEY | Claude API 密钥 |
| JUDGE0_API_KEY | Judge0 API 密钥 |

## License

MIT
