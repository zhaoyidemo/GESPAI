# GESP AI 产品复盘与优化清单

> 生成日期：2026-02-09
> 最后更新：2026-02-10

---

## 待办事项（4 项）

### 功能

- [ ] 创建 `app/(main)/admin/prompts/page.tsx` — 管理员提示词管理页面

### 性能

- [ ] 拆分 `problem/[id]` 为子组件：`ProblemDescription`、`CodeEditor`、`AIChat`、`SubmissionPanel`

### 用户体验

- [ ] AI 对话添加超时友好提示 + 代码提交添加评测进度指示

### 测试

- [ ] 为关键用户流程添加 E2E 测试（注册→做题→提交→查看结果）

---

## 已完成

### 安全（P0）
- [x] 创建 `lib/require-admin.ts` 中间件
- [x] 为 11 个 seed 路由添加鉴权
- [x] 为 6 个 admin 路由添加管理员权限检查
- [x] 为 `admin/prompts` 路由添加管理员权限检查
- [x] 为 `problems` POST 路由添加管理员权限检查
- [x] `admin/sync` 错误处理修复，不再泄露 `String(error)`

### 架构优化
- [x] 抽取通用 `seedProblems` 工厂函数，消除 8 个 seed 路由重复
- [x] 抽取鉴权中间件（`requireAuth()` / `requireAdmin()`）
- [x] 引入 Zustand 状态管理（3 个 Store + actions hook）
- [x] 为核心 API 添加单元测试（vitest + 11 个测试用例）
- [x] 修复 judge/route.ts 和 admin/import/route.ts 的 N+1 查询

### 性能
- [x] Monaco Editor `dynamic import` 懒加载
- [x] Zustand Store + useCallback actions hook 优化重渲染

### 功能
- [x] Profile 页面连接真实 API 数据
- [x] Navbar 从 API 动态获取连胜和 XP
- [x] Navbar 添加模拟考试导航入口
- [x] Tutor 学习模式（经复查：完整可用）
- [x] 错题详情复盘页面（经复查：完整可用）

### 用户体验
- [x] 全局 ErrorBoundary 组件

### 开发流程
- [x] 配置 pre-commit hook（`npx tsc --noEmit`）

---

## PRD 路线图

### V2.1（近期）
- [ ] 错题重做

### V2.2（中期）
- [ ] 浏览器插件（洛谷辅助）
- [ ] 截图识别（OCR 导入题目）
- [ ] AI 自动生成题目
- [ ] 家长数据面板

### V3.0（远期）
- [ ] 排行榜系统
- [ ] 社区功能
- [ ] 视频教程集成
- [ ] 平台合作对接

---

## 代码质量指标

| 维度 | 优化前 | 优化后 |
|------|--------|--------|
| 总 API 路由 | 42 个 | 42 个 |
| 有完整认证 | 25 个（59.5%） | 42 个（100%） |
| 有管理员权限检查 | 0 个（0%） | 18 个 |
| 总页面数 | 17 个（11 完整、4 部分、2 缺失） | 17 个（15 完整、1 缺失） |
| 测试覆盖 | 0% | 11 个测试用例 |
| 做题页面 useState | 21 个 | 0 个（3 个 Zustand Store） |
| 做题页面行数 | 1071 行 | ~663 行 |
| Seed 路由重复代码 | ~320 行 | 0 行 |
| N+1 查询 | 2 处 | 0 处 |
