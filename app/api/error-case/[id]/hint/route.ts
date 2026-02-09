import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import prisma from "@/lib/db";
import { chat } from "@/lib/claude";
import { ERROR_TYPES } from "@/lib/prompts/error-diagnosis";
import { getSystemPrompt } from "@/lib/prompts/get-system-prompt";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// 获取 AI 引导提示
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const { id } = await params;
    const body = await request.json();
    const { questionNumber, currentAnswer } = body;

    if (!questionNumber || ![1, 2, 3].includes(questionNumber)) {
      return NextResponse.json(
        { error: "请提供有效的问题编号 (1, 2, 3)" },
        { status: 400 }
      );
    }

    // 获取错题记录
    const errorCase = await prisma.errorCase.findUnique({
      where: { id },
      include: {
        problem: true,
        submission: true,
      },
    });

    if (!errorCase) {
      return NextResponse.json(
        { error: "错题记录不存在" },
        { status: 404 }
      );
    }

    if (errorCase.userId !== session.user.id) {
      return NextResponse.json(
        { error: "无权操作此错题记录" },
        { status: 403 }
      );
    }

    const { problem, submission } = errorCase;
    const testResults = submission.testResults as Array<{
      passed: boolean;
      input: string;
      expectedOutput: string;
      actualOutput: string;
    }> | null;

    // 获取错误类型描述
    const errorTypeInfo = errorCase.errorType
      ? ERROR_TYPES[errorCase.errorType as keyof typeof ERROR_TYPES]
      : null;

    // 找到失败的测试用例
    const failedTests = testResults?.filter((t) => !t.passed) || [];
    const failedTestInfo = failedTests[0]
      ? `输入：${failedTests[0].input}\n预期输出：${failedTests[0].expectedOutput}\n实际输出：${failedTests[0].actualOutput}`
      : "";

    // 选择对应的引导提示词
    const guidePromptKeyMap: Record<number, string> = {
      1: "error-guide-q1",
      2: "error-guide-q2",
      3: "error-guide-q3",
    };
    const guidePrompt = await getSystemPrompt(guidePromptKeyMap[questionNumber]);
    let contextInfo = "";

    switch (questionNumber) {
      case 1:
        contextInfo = `**题目**: ${problem.title}

**题目描述**:
${problem.description}

**学生代码**:
\`\`\`cpp
${submission.code}
\`\`\`

**提交状态**: ${submission.status}
${errorTypeInfo ? `**AI初步判断的错误类型**: ${errorTypeInfo.label} - ${errorTypeInfo.description}` : ""}

${failedTestInfo ? `**第一个失败的测试用例**:\n${failedTestInfo}` : ""}

${currentAnswer ? `**学生当前的回答**: ${currentAnswer}` : "学生还没有回答。"}

请引导学生思考"这道题错了哪里"。`;
        break;

      case 2:
        contextInfo = `**题目**: ${problem.title}

**学生代码**:
\`\`\`cpp
${submission.code}
\`\`\`

**第一问的回答（错了哪）**: ${errorCase.q1Answer || "未回答"}

${currentAnswer ? `**学生对"为什么会错"的当前回答**: ${currentAnswer}` : "学生还没有回答。"}

请引导学生深入思考"为什么会犯这个错误"。`;
        break;

      case 3:
        contextInfo = `**题目**: ${problem.title}

**错误类型**: ${errorTypeInfo?.label || "未分类"}

**第一问的回答（错了哪）**: ${errorCase.q1Answer || "未回答"}
**第二问的回答（为什么错）**: ${errorCase.q2Answer || "未回答"}

${currentAnswer ? `**学生对"下次怎么避免"的当前回答**: ${currentAnswer}` : "学生还没有回答。"}

请引导学生总结一条可复用的防错规则。`;
        break;
    }

    // 调用 Claude API
    const errorBase = await getSystemPrompt("error-base");
    const response = await chat(
      [{ role: "user", content: contextInfo }],
      `${errorBase}\n\n${guidePrompt}`,
      512
    );

    return NextResponse.json({
      hint: response,
      questionNumber,
    });
  } catch (error) {
    console.error("Get hint error:", error);
    return NextResponse.json(
      { error: "获取引导提示失败" },
      { status: 500 }
    );
  }
}
