/**
 * AI调试助手默认提示词配置
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
 * 获取用户的AI调试提示词
 * @param userPrompt 用户自定义的提示词（可选）
 * @returns 提示词内容
 */
export function getDebugPrompt(userPrompt?: string | null): string {
  return userPrompt || DEFAULT_DEBUG_PROMPT;
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
  verdict: string; // 'WA' | 'RE' | 'TLE' | 'MLE'
  failedTests: Array<{
    testIndex: number;
    input: string;
    expectedOutput: string;
    actualOutput: string;
  }>;
  totalTests: number; // 总测试点数
  passedTests: number; // 通过的测试点数
  helpCount: number; // 第几次请求帮助（1, 2, 3, ...）
  previousConversations?: Array<{
    promptLevel: number;
    aiResponse: string;
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

  // 将数据库状态转换为易读格式
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
      message += `\n**第${conv.promptLevel}次提示（${new Date(conv.timestamp).toLocaleString('zh-CN')}）：**\n${conv.aiResponse}\n`;
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
