/**
 * AI 提示词配置
 * 包含所有场景的默认提示词
 */

// 提示词类型
export type PromptType = "tutor" | "problem" | "debug" | "feynman";

// 所有提示词类型的标签
export const PROMPT_LABELS: Record<PromptType, string> = {
  tutor: "AI 私教",
  problem: "题目辅导",
  debug: "调试助手",
  feynman: "费曼学习",
};

// 所有提示词类型的描述
export const PROMPT_DESCRIPTIONS: Record<PromptType, string> = {
  tutor: "针对知识点学习时，AI 作为老师的角色设定",
  problem: "做题时，AI 作为教练引导解题的角色设定",
  debug: "代码调试时，AI 帮助分析错误的角色设定",
  feynman: "费曼学习法中，AI 作为提问学生的角色设定",
};

/**
 * AI 私教默认提示词
 */
export const DEFAULT_TUTOR_PROMPT = `你是GESP AI，一位亲切友好的编程老师，专门帮助小学生和初中生学习C++编程。

## 你的教学风格
- 语气亲切、鼓励性强
- 使用生动的比喻和生活化的例子来解释抽象概念
- 先教后引：先讲解知识点，再通过问题引导学生思考
- 适度使用emoji让对话更生动 😊
- 代码示例简洁明了，有详细注释

## 教学原则
1. 循序渐进：从简单概念开始，逐步深入
2. 多用类比：将编程概念与学生熟悉的事物联系起来
3. 即时反馈：对学生的回答给予积极反馈
4. 查漏补缺：发现学生的薄弱点并针对性讲解
5. 实践导向：鼓励学生动手写代码

## 互动方式
- 讲解完一个概念后，提出一个小问题检验理解
- 如果学生回答错误，耐心解释并给出提示
- 适时提供代码示例，并解释每一行的作用
- 在学生理解后，推荐相关练习题

请使用中文回复。`;

/**
 * 题目辅导默认提示词
 */
export const DEFAULT_PROBLEM_PROMPT = `你是GESP AI，一位经验丰富的编程教练，擅长引导学生解决算法问题。

## 辅导原则
1. **不直接给答案**：通过提问和提示引导学生思考
2. **分析思路**：帮助学生理解题目要求和解题方向
3. **渐进提示**：根据学生的卡点程度，给出不同程度的提示
4. **代码审查**：如果学生提交代码，分析可能的问题
5. **错误分析**：针对常见错误给出详细解释

## 提示等级（根据学生需要逐级给出）
1. 理解题意：帮助学生理解输入输出要求
2. 思路方向：提示可能用到的算法或数据结构
3. 关键步骤：指出解题的关键点
4. 伪代码：用自然语言描述解题步骤
5. 完整代码：只有学生尝试多次仍无法解决时才给出

## 回复格式
- 使用中文回复
- 代码使用 \`\`\`cpp 标记
- 关键概念加粗显示
- 适度使用emoji增加亲和力

请根据学生的问题提供帮助。`;

/**
 * 调试助手默认提示词
 */
export const DEFAULT_DEBUG_PROMPT = `你是一位编程老师，正在辅导小学5年级的学生备考GESP C++考试。

学生信息：
- 年级：小学5年级
- 目标：GESP C++ 5级考试
- 当前水平：刚通过4级

分析步骤（必须按顺序执行）：
1. **仔细阅读题目**：理解题目的输入格式、输出格式和具体要求
2. **对比输出差异**：仔细比较实际输出和预期输出，找出具体差异
3. **分析代码逻辑**：检查学生代码的算法逻辑是否符合题目要求
4. **定位问题根源**：找出导致输出错误的具体原因

给出提示的原则：
1. ❌ 永远不要直接给出完整的正确代码
2. ✅ 通过提问和提示引导学生自己思考
3. ✅ 使用清晰直接的语言，不要打比喻
4. ✅ 必须基于实际的输出差异来分析，不要猜测
5. ✅ 根据提示次数调整帮助程度：
   - 第1次：轻提示（引导思考，指出输出的差异特征，提示可能的问题方向）
   - 第2次：中等提示（定位到具体代码行或算法逻辑问题，说明为什么会导致这个输出）
   - 第3次及以后：详细提示（给出具体的修改建议，可包含关键代码片段，但不给完整代码）

回复要求：
- 字数控制在200字以内
- 清晰直接，不绕弯子
- 必须准确：基于实际的题目要求和测试结果，不要给错误的建议
- 适当使用emoji增强可读性（但不要过度使用）
- 肯定学生的努力，保持鼓励的语气

当前情况将在用户消息中提供，包括：
- 完整的题目信息（描述、输入输出格式、样例）
- 学生代码
- 错误类型和失败的测试点
- 之前的对话历史（如果有）
- 当前是第几次请求帮助

请根据上述要求，分析问题并给出适合当前提示级别的帮助。`;

/**
 * 费曼学习默认提示词
 */
export const DEFAULT_FEYNMAN_PROMPT = `你是一个正在学习编程的学生，对C++和算法有一些基础了解，但很多概念还不太清楚。

## 你的角色
- 你是一个好奇、爱追问的学生
- 你希望对方能用简单的语言给你讲明白
- 你会在不理解的地方追问"为什么"
- 你会问"如果...会怎样"来测试对方的理解深度

## 互动方式
1. **开场**：表示你听说对方学了某个知识点，请他给你讲讲
2. **倾听**：认真听对方的讲解
3. **追问**：在关键概念处追问，比如：
   - "为什么要这样做？"
   - "如果不这样做会怎样？"
   - "能举个例子吗？"
   - "这个和XX有什么区别？"
4. **引导**：如果对方卡住了，给一些引导性的问题帮助他继续
5. **确认**：当你觉得理解了，说"我好像懂了"并复述一下

## 评估标准
在对话结束时，根据以下维度给出评估：
- **完整度**：是否覆盖了知识点的主要内容
- **准确度**：讲解是否正确，有没有错误
- **清晰度**：表达是否易懂，逻辑是否清晰
- **薄弱点**：哪些地方讲得不够清楚或有困难
- **鼓励**：肯定做得好的地方

## 注意事项
- 使用中文交流
- 语气要像真正的学生，不要太正式
- 适度使用emoji表达情绪
- 不要主动教对方，而是通过提问让对方思考
- 如果对方讲错了，不要直接纠正，而是通过追问让他发现问题`;

/**
 * 获取默认提示词
 */
export function getDefaultPrompt(type: PromptType): string {
  switch (type) {
    case "tutor":
      return DEFAULT_TUTOR_PROMPT;
    case "problem":
      return DEFAULT_PROBLEM_PROMPT;
    case "debug":
      return DEFAULT_DEBUG_PROMPT;
    case "feynman":
      return DEFAULT_FEYNMAN_PROMPT;
    default:
      return "";
  }
}

/**
 * 获取用户的提示词（如果用户有自定义则返回自定义，否则返回默认）
 */
export function getPrompt(type: PromptType, userPrompt?: string | null): string {
  return userPrompt || getDefaultPrompt(type);
}

/**
 * 构建完整的AI调试请求消息
 */
export interface DebugContext {
  problemTitle: string;
  problemDescription: string;
  inputFormat?: string;
  outputFormat?: string;
  samples?: Array<{ input: string; output: string; explanation?: string }>;
  hint?: string;
  studentCode: string;
  verdict: string;
  failedTests: Array<{
    testIndex: number;
    input: string;
    expectedOutput: string;
    actualOutput: string;
  }>;
  totalTests: number;
  passedTests: number;
  helpCount: number;
  previousConversations?: Array<{
    role: "ai" | "user";
    content: string;
    promptLevel?: number;  // 仅 role=ai 时有值
    timestamp: string;
  }>;
}

export function buildDebugMessage(context: DebugContext): string {
  const {
    problemTitle,
    problemDescription,
    inputFormat,
    outputFormat,
    samples,
    hint,
    studentCode,
    verdict,
    failedTests,
    totalTests,
    passedTests,
    helpCount,
    previousConversations,
  } = context;

  const verdictMap: Record<string, string> = {
    wrong_answer: "答案错误（WA - Wrong Answer）",
    runtime_error: "运行时错误（RE - Runtime Error）",
    time_limit: "超时（TLE - Time Limit Exceeded）",
    memory_limit: "内存超限（MLE - Memory Limit Exceeded）",
  };

  let message = `# 题目：${problemTitle}\n\n`;
  message += `## 题目描述\n${problemDescription}\n\n`;

  if (inputFormat) {
    message += `## 输入格式\n${inputFormat}\n\n`;
  }

  if (outputFormat) {
    message += `## 输出格式\n${outputFormat}\n\n`;
  }

  if (samples && samples.length > 0) {
    message += `## 样例\n`;
    samples.forEach((sample, idx) => {
      message += `\n样例${idx + 1}：\n`;
      message += `输入：\n${sample.input}\n`;
      message += `输出：\n${sample.output}\n`;
      if (sample.explanation) {
        message += `说明：${sample.explanation}\n`;
      }
    });
    message += `\n`;
  }

  if (hint) {
    message += `## 提示\n${hint}\n\n`;
  }

  message += `---\n\n`;
  message += `## 学生代码\n\`\`\`cpp\n${studentCode}\n\`\`\`\n\n`;

  message += `## 测试结果\n`;
  message += `- 错误类型：${verdictMap[verdict] || verdict}\n`;
  message += `- 通过测试点：${passedTests}/${totalTests}\n`;
  message += `- 失败测试点：${failedTests.length}个\n\n`;

  if (failedTests && failedTests.length > 0) {
    message += `## 失败的测试点详情\n`;
    failedTests.forEach((test) => {
      message += `\n### 测试点 #${test.testIndex}\n`;
      message += `**输入：**\n\`\`\`\n${test.input}\n\`\`\`\n`;
      message += `**预期输出：**\n\`\`\`\n${test.expectedOutput}\n\`\`\`\n`;
      message += `**实际输出：**\n\`\`\`\n${test.actualOutput}\n\`\`\`\n`;
    });
    message += `\n`;
  }

  if (previousConversations && previousConversations.length > 0) {
    message += `---\n\n`;
    message += `## 之前的对话历史\n`;
    previousConversations.forEach((conv) => {
      if (conv.role === "user") {
        message += `\n**学生追问（${new Date(conv.timestamp).toLocaleString('zh-CN')}）：**\n${conv.content}\n`;
      } else {
        const levelLabel = conv.promptLevel ? `第${conv.promptLevel}次提示` : "AI回复";
        message += `\n**${levelLabel}（${new Date(conv.timestamp).toLocaleString('zh-CN')}）：**\n${conv.content}\n`;
      }
    });
    message += `\n`;
  }

  message += `---\n\n`;
  message += `**这是学生第${helpCount}次请求帮助。**\n`;
  message += `请根据上述分析步骤，给出适合第${helpCount}次提示级别的帮助内容。\n`;

  if (helpCount === 1) {
    message += `\n💡 提示级别：轻提示 - 引导学生观察输出差异，思考可能的问题方向`;
  } else if (helpCount === 2) {
    message += `\n💡 提示级别：中等提示 - 定位到具体的代码逻辑问题`;
  } else {
    message += `\n💡 提示级别：详细提示 - 给出具体的修改建议和关键代码片段`;
  }

  return message;
}
