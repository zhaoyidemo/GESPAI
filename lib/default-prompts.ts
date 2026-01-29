/**
 * AI调试助手默认提示词配置
 */

export const DEFAULT_DEBUG_PROMPT = `你是一位编程老师，正在辅导小学5年级的学生备考GESP C++考试。

学生信息：
- 年级：小学5年级
- 目标：GESP C++ 5级考试
- 当前水平：刚通过4级

你的角色：
1. 永远不要直接给出完整的正确代码
2. 通过提问和提示引导学生自己思考
3. 使用清晰直接的语言，不要打比喻
4. 适当给予正向反馈和鼓励
5. 根据提示次数调整帮助程度：
   - 第1次：轻提示（引导思考，指出问题场景但不指出具体代码位置）
   - 第2次：中等提示（定位到具体代码行，说明为什么有问题）
   - 第3次及以后：详细提示（给出修改建议，可包含代码片段，但不给完整代码）

回复要求：
- 字数控制在150字以内
- 清晰直接，不绕弯子
- 适当使用emoji增强可读性
- 肯定学生的努力和进步

当前情况将在用户消息中提供，包括：
- 题目信息
- 学生代码
- 错误类型和测试结果
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
  studentCode: string;
  verdict: string; // 'WA' | 'RE' | 'TLE' | 'MLE'
  failedTests: Array<{
    testIndex: number;
    input: string;
    expectedOutput: string;
    actualOutput: string;
  }>;
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
    studentCode,
    verdict,
    failedTests,
    helpCount,
    previousConversations,
  } = context;

  let message = `题目：${problemTitle}\n\n`;
  message += `题目描述：\n${problemDescription}\n\n`;
  message += `学生代码：\n\`\`\`cpp\n${studentCode}\n\`\`\`\n\n`;
  message += `错误类型：${verdict}\n\n`;

  if (failedTests && failedTests.length > 0) {
    message += `失败的测试点：\n`;
    failedTests.forEach((test) => {
      message += `\n测试点${test.testIndex}：\n`;
      message += `- 输入：${test.input}\n`;
      message += `- 预期输出：${test.expectedOutput}\n`;
      message += `- 实际输出：${test.actualOutput}\n`;
    });
    message += `\n`;
  }

  if (previousConversations && previousConversations.length > 0) {
    message += `\n之前的对话历史：\n`;
    previousConversations.forEach((conv, idx) => {
      message += `\n第${conv.promptLevel}次提示：\n${conv.aiResponse}\n`;
    });
    message += `\n`;
  }

  message += `\n这是学生第${helpCount}次请求帮助。`;
  message += `\n请给出适合第${helpCount}次提示的帮助内容。`;

  return message;
}
