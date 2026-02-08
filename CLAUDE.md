# CLAUDE.md — GESP AI 项目指令

## 通用规则

- 主要交流语言为中文（简体中文）。除非另有说明，否则使用中文进行解释、注释和文档。
- 除非明确要求，否则不要在本地克隆仓库或运行本地依赖安装。假设工作是通过 GitHub/远程部署完成的，除非另有说明。

## 工作流

- 当用户提供 PRD 或需求文档时，在编写任何代码之前完整阅读它。不要开始构建通用项目——等待实际规范。

## 沟通风格

- 当被问及可用功能、工具或选项时，预先呈现全面的列表，而不是提出连续的澄清问题。优先展示选项而不是提问。

## UI / 前端

- 所有 UI 更改必须在所有主题模式（浅色、深色和任何自定义主题）中进行验证。在检查每个模式之前，不要认为颜色/样式修复已完成。

## 构建 & 部署

- 此项目使用 TypeScript 作为主要语言。在提交之前始终确保 `tsc` 构建通过。在多文件更改后运行构建检查。

## 项目简介

GESP AI（gesp.ai）是一个 AI 原生的 GESP C++ 编程等级考试备考平台，面向小学/初中生。AI 作为决策中枢，自动规划学习路径、选题、诊断错误。

## 技术栈

- **框架**：Next.js 14（App Router）+ React 18 + TypeScript
- **样式**：Tailwind CSS + shadcn/ui（Radix UI）
- **数据库**：PostgreSQL + Prisma ORM
- **AI**：Claude API（@anthropic-ai/sdk）
- **代码评测**：Judge0 API
- **认证**：NextAuth.js（JWT + Credentials）
- **编辑器**：Monaco Editor
- **语音**：讯飞实时语音识别（可选）
- **部署**：Railway，域名 gesp.ai

## 目录结构

```
app/
  (auth)/          # 登录、注册页面
  (main)/          # 主功能页面（dashboard, map, learn, problem, error-book, mock-exam, profile, admin）
  api/             # API 路由（chat, judge, problems, error-case, plan, seed, admin 等）
components/        # React 组件（chat/, editor/, error-case/, ui/）
lib/               # 核心逻辑
  claude.ts        # Claude API 封装（generateStudyPlan, AI 对话等）
  judge.ts         # Judge0 评测封装
  auth.ts          # NextAuth 配置
  db.ts            # Prisma Client 单例
  default-prompts.ts  # 默认 AI 提示词
  gesp-knowledge.ts   # GESP 1-8 级知识点数据
  prompts/         # 提示词管理（registry, get-system-prompt, error-diagnosis）
hooks/             # 语音识别 Hooks
prisma/schema.prisma  # 数据模型（13 个表）
types/             # TypeScript 类型定义
```

## 数据模型（Prisma）

User, Problem, Submission, KnowledgePoint, LearningRecord, StudyPlan, DailyTask, ChatHistory, ErrorCase, PreventionRule, SystemPrompt, Badge, MockExamResult

## 常用命令

```bash
npm run dev              # 启动开发服务器
npm run build            # 生产构建（含 prisma generate + db push）
npx tsc --noEmit         # TypeScript 类型检查
npx prisma studio        # 可视化数据库管理
npx prisma db push       # 同步 schema 到数据库
```

## 题库种子数据

- 种子文件位于 `app/api/seed/gesp{1-8}/route.ts`，每级一个文件
- 支持 GET/POST 触发，使用 upsert 模式（按 sourceId 匹配）
- 批量同步：`GET /api/seed` 一次性更新所有级别
- 题目来源：GESP 官方真题（洛谷题号 P*），1-8 级共 184 道
- testCases 格式：`[{ input: string, output: string }]`，存储为 JSON 字段

## 代码规范

- 路径别名：`@/*` 映射到项目根目录
- 组件使用 shadcn/ui，样式使用 Tailwind CSS 工具类
- API 路由统一使用 NextResponse.json() 返回
- 数据库操作统一通过 `lib/db.ts` 导出的 prisma 实例
- AI 提示词优先级：用户自定义 > 管理员数据库设置 > 硬编码默认值（lib/default-prompts.ts）

## 关键设计约束

- GESP 级别范围：1-8 级（当前题库覆盖 1-8 级）
- 目标用户是小学/初中生，AI 对话风格需亲切友好
- 代码评测仅支持 C++
- 提交前有 7 项自检规则（格式、初始化、越界、除零、溢出、复杂度、边界）
- 错题分 10 种类型（syntax, runtime, timeout, misread, boundary, careless, uninit, logic, algorithm, overflow）

## 环境变量

必需：DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, ANTHROPIC_API_KEY, JUDGE0_API_URL, JUDGE0_API_KEY
可选：NEXT_PUBLIC_IFLYTEK_ENABLED, NEXT_PUBLIC_IFLYTEK_APP_ID, IFLYTEK_API_KEY, IFLYTEK_API_SECRET
