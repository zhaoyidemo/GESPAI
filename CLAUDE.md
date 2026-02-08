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
- 题目来源：GESP 官方真题（洛谷题号 B*/P*），1-8 级共 184 道
- testCases 格式：`[{ input: string, output: string }]`，存储为 JSON 字段

### 题库录入规范（强制）

题库是本项目最核心的资产。以下规则具有最高优先级，**任何情况下不得违反**。

#### 一、数据来源

所有题目内容必须 100% 来自洛谷原题页面（`https://www.luogu.com.cn/problem/{sourceId}`）。

**严禁以下行为：**
- 严禁使用 WebFetch 摘要或 AI 改写代替原文
- 严禁修改、删减、合并、润色原文的任何部分
- 严禁"规范化"原文措辞（如把"分解成"改成"表示成"、把"质因数"改成"素数"）
- 严禁删除原文中的句子（如"你能帮帮他们吗？"之类的收尾句）

#### 二、字段要求（逐字段规范）

每道题必须包含以下字段，内容**逐字**复制自洛谷原题：

| 字段 | 来源 | 要求 |
|------|------|------|
| `title` | 洛谷页面标题 | 完整复制，如 `[GESP202309 五级] 因数分解` |
| `description` | 题目描述区域 | 逐字复制，保留原文所有段落、换行（`\n\n`）、标点 |
| `inputFormat` | 输入格式区域 | 逐字复制 |
| `outputFormat` | 输出格式区域 | 逐字复制 |
| `samples` | 样例输入/输出 | 所有样例完整复制，input/output 值精确匹配 |
| `hint` | 说明/提示区域 | 完整复制，包含样例解释、数据范围、子任务表格等全部内容 |
| `knowledgePoints` | 自行标注 | 根据题目考察的实际算法/知识点标注，务必准确 |
| `testCases` | 自行构造 | 包含原始样例 + 自构造的边界测试用例，答案必须经过验证 |

#### 三、LaTeX 格式规范

- 保留原文的 LaTeX 写法，不做"美化"或"统一"
- 如果原文写 `$(111)_2$`，就写 `$(111)_2$`，不要简化为 `$111$`
- 如果原文写 `$6=2\\times 3$`（等号无空格），就保持无空格，不要加空格
- 如果原文写 `…`（Unicode 省略号），就写 `…`，不要替换为 `\\ldots`
- 在 JS 模板字符串中，`\` 需要转义为 `\\`（如 `\\times`、`\\le`、`\\texttt`）
- `\n\n` 表示段落分隔，必须与原文段落结构一致

#### 四、获取原文的正确方法

由于 WebFetch 返回的是 AI 摘要（不可靠），获取洛谷原题必须从页面 HTML 中提取嵌入的 JSON 数据：

```bash
# 第一步：下载页面 HTML（含嵌入的 JSON 数据）
curl -s "https://www.luogu.com.cn/problem/B3871?_contentOnly=1" -o luogu_raw.html

# 第二步：用 node 提取 <script id="lentille-context"> 中的 JSON
```

页面 HTML 中包含 `<script id="lentille-context" type="application/json">` 标签，内含完整的题目数据 JSON。

**JSON 字段映射：**

| 源路径 | → 种子字段 | 说明 |
|--------|-----------|------|
| `data.problem.contenu.name` | `title` | 完整标题，如 `[GESP202309 五级] 因数分解` |
| `data.problem.contenu.description` | `description` | 题目描述原文（Markdown） |
| `data.problem.contenu.formatI` | `inputFormat` | 输入格式原文 |
| `data.problem.contenu.formatO` | `outputFormat` | 输出格式原文 |
| `data.problem.samples` | `samples` | 样例数组，格式 `[[input, output], ...]` |
| `data.problem.contenu.hint` | `hint` | 提示/说明（含样例解释、数据范围） |
| `data.problem.contenu.background` | （忽略） | 选择判断题链接，不录入种子 |

**JS 模板字符串转义注意事项：**
- 原文中的 `\times` → 种子文件中写 `\\times`
- 原文中的 `\le` → 种子文件中写 `\\le`
- 原文中的 `\texttt` → 种子文件中写 `\\texttt`
- 原文中的 `\n` 换行 → 种子文件中写 `\n`（模板字符串原生支持）
- 原文中的反引号 `` ` `` → 种子文件中写 `` \` ``（模板字符串中需转义）

#### 五、验证清单

录入或修改题目后，必须完成以下检查：
1. `npx tsc --noEmit` 类型检查通过
2. 逐字段与洛谷 API 返回的原文对比，确认无差异
3. samples 的 input/output 与洛谷完全一致
4. testCases 中的自构造用例答案经过手动验证或程序验证

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
