import Anthropic from "@anthropic-ai/sdk";
import { getSystemPrompt } from "@/lib/prompts/get-system-prompt";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface StreamCallbacks {
  onToken?: (token: string) => void;
  onComplete?: (fullResponse: string) => void;
  onError?: (error: Error) => void;
}

// 知识点学习的系统提示词
export function getLearningSystemPrompt(knowledgePoint: string, level: number): string {
  return `你是GESP AI，一位亲切友好的编程老师，专门帮助小学生和初中生学习C++编程。

## 你的教学风格
- 语气亲切、鼓励性强，适合${level <= 4 ? "小学生" : "初中生"}
- 使用生动的比喻和生活化的例子来解释抽象概念
- 先教后引：先讲解知识点，再通过问题引导学生思考
- 适度使用emoji让对话更生动 😊
- 代码示例简洁明了，有详细注释

## 当前教学内容
你正在教授 GESP ${level} 级的知识点：${knowledgePoint}

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

请开始教授这个知识点，使用中文回复。`;
}

// 做题辅导的系统提示词
export function getProblemSystemPrompt(problemTitle: string, problemDescription: string): string {
  return `你是GESP AI，一位经验丰富的编程教练，擅长引导学生解决算法问题。

## 当前题目
**${problemTitle}**

${problemDescription}

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
}

// 通用对话
export async function chat(
  messages: ChatMessage[],
  systemPrompt: string,
  maxTokens: number = 2048
): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const textContent = response.content.find((c) => c.type === "text");
  return textContent?.text || "";
}

// 流式对话
export async function streamChat(
  messages: ChatMessage[],
  systemPrompt: string,
  callbacks: StreamCallbacks,
  maxTokens: number = 2048
): Promise<void> {
  try {
    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    let fullResponse = "";

    for await (const event of stream) {
      if (event.type === "content_block_delta") {
        const delta = event.delta;
        if ("text" in delta) {
          const token = delta.text;
          fullResponse += token;
          callbacks.onToken?.(token);
        }
      }
    }

    callbacks.onComplete?.(fullResponse);
  } catch (error) {
    callbacks.onError?.(error as Error);
  }
}

// 生成学习计划
export async function generateStudyPlan(
  targetLevel: number,
  examDate: Date,
  weeklyHours: number,
  currentProgress?: Record<string, number>
): Promise<object> {
  const daysUntilExam = Math.ceil(
    (examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const systemPrompt = await getSystemPrompt("study-plan");

  const userMessage = `请为我制定GESP ${targetLevel}级考试的学习计划。

**考试信息**
- 目标级别：${targetLevel}级
- 考试日期：${examDate.toLocaleDateString("zh-CN")}
- 距离考试：${daysUntilExam}天
- 每周可用学习时间：${weeklyHours}小时

${currentProgress ? `**当前进度**\n${JSON.stringify(currentProgress, null, 2)}` : "这是新学生，尚无学习记录。"}

请制定合理的学习计划，确保能在考试前完成所有${targetLevel}级知识点的学习和练习。`;

  const response = await chat(
    [{ role: "user", content: userMessage }],
    systemPrompt,
    4096
  );

  // 解析JSON响应
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // 如果解析失败，返回原始文本
  }

  return { rawResponse: response };
}

// 分析代码错误
export async function analyzeCodeError(
  code: string,
  error: string,
  problemDescription: string
): Promise<string> {
  const systemPrompt = await getSystemPrompt("code-error-analysis");

  const userMessage = `**题目描述**
${problemDescription}

**学生代码**
\`\`\`cpp
${code}
\`\`\`

**错误信息**
${error}

请分析这个错误并给出指导。`;

  return chat([{ role: "user", content: userMessage }], systemPrompt);
}

// 费曼验证问题生成
export async function generateFeynmanQuestion(
  knowledgePoint: string,
  code: string
): Promise<{ question: string; expectedKeywords: string[] }> {
  const systemPrompt = await getSystemPrompt("feynman-question");

  const response = await chat(
    [
      {
        role: "user",
        content: `知识点：${knowledgePoint}\n\n学生刚通过的代码：\n\`\`\`cpp\n${code}\n\`\`\`\n\n请生成一个验证理解的问题。`,
      },
    ],
    systemPrompt,
    512
  );

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // 默认问题
  }

  return {
    question: `请用一句话解释一下你是怎么解决这道题的？`,
    expectedKeywords: [],
  };
}

export default anthropic;
