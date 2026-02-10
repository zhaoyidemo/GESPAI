import Anthropic from "@anthropic-ai/sdk";
import { getSystemPrompt } from "@/lib/prompts/get-system-prompt";
import { DEFAULT_TUTOR_PROMPT, DEFAULT_PROBLEM_PROMPT } from "@/lib/default-prompts";

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

// 知识点学习的系统提示词（复用默认提示词，避免维护两份内容）
export function getLearningSystemPrompt(knowledgePoint: string, level: number): string {
  return `${DEFAULT_TUTOR_PROMPT}

当前正在学习的知识点：${knowledgePoint}
目标级别：GESP ${level}级`;
}

// 做题辅导的系统提示词（复用默认提示词，避免维护两份内容）
export function getProblemSystemPrompt(problemTitle: string, problemDescription: string): string {
  return `${DEFAULT_PROBLEM_PROMPT}

当前题目：${problemTitle}
题目描述：${problemDescription}`;
}

// 通用对话
export async function chat(
  messages: ChatMessage[],
  systemPrompt: string,
  maxTokens: number = 2048
): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-opus-4-6",
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
      model: "claude-opus-4-6",
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

// 做题表现数据接口
export interface PerformanceData {
  knowledgePoints: Record<string, {
    progress: number;
    practiceCount: number;
    correctCount: number;
    accuracy: number;
    masteryLevel: number;
    tutorCompleted: boolean;
    feynmanCompleted: boolean;
    feynmanScore: number | null;
  }>;
  errorPatterns: Record<string, number>;
  weakKnowledgePoints: string[];
  recentAccuracy: number;
}

// 生成学习计划
export async function generateStudyPlan(
  targetLevel: number,
  examDate: Date,
  weeklyHours: number,
  currentProgress?: Record<string, number>,
  performanceData?: PerformanceData
): Promise<object> {
  const daysUntilExam = Math.ceil(
    (examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const systemPrompt = await getSystemPrompt("plan-generate");

  let performanceSection = "";
  if (performanceData) {
    const errorPatternsStr = Object.entries(performanceData.errorPatterns)
      .map(([type, count]) => `${type}(${count}次)`)
      .join("、");

    const weakKPsStr = performanceData.weakKnowledgePoints
      .map((kpId) => {
        const kpData = performanceData.knowledgePoints[kpId];
        return kpData ? `${kpId}(${Math.round(kpData.accuracy * 100)}%)` : kpId;
      })
      .join("、");

    const kpDetailsRows = Object.entries(performanceData.knowledgePoints)
      .map(([kpId, data]) => {
        const accuracy = data.practiceCount > 0
          ? `${Math.round(data.accuracy * 100)}%`
          : "无数据";
        return `| ${kpId} | ${data.practiceCount} | ${accuracy} | ${data.masteryLevel} | ${data.tutorCompleted ? "✓" : "✗"} | ${data.feynmanCompleted ? "✓" : "✗"} |`;
      })
      .join("\n");

    performanceSection = `
**做题表现分析**
- 近30天整体正确率：${Math.round(performanceData.recentAccuracy * 100)}%
- 薄弱知识点（正确率<50%）：${weakKPsStr || "无"}
- 常见错误类型：${errorPatternsStr || "无"}

**各知识点详情**
| 知识点 | 练习数 | 正确率 | 掌握度 | 学习完成 | 验证完成 |
|--------|--------|--------|--------|----------|----------|
${kpDetailsRows}

请根据以上数据，重点安排薄弱知识点的强化练习，对已掌握的知识点降低优先级。`;
  }

  const userMessage = `请为我制定GESP ${targetLevel}级考试的学习计划。

**考试信息**
- 目标级别：${targetLevel}级
- 考试日期：${examDate.toLocaleDateString("zh-CN")}
- 距离考试：${daysUntilExam}天
- 每周可用学习时间：${weeklyHours}小时

${currentProgress ? `**当前进度**\n${JSON.stringify(currentProgress, null, 2)}` : "这是新学生，尚无学习记录。"}
${performanceSection}

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
  const systemPrompt = await getSystemPrompt("problem-error-analysis");

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
