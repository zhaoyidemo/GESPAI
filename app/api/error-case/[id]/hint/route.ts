import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { chat } from "@/lib/claude";
import {
  baseSystemPrompt,
  guideQ1Prompt,
  guideQ2Prompt,
  guideQ3Prompt,
  ERROR_TYPES,
} from "@/lib/prompts/error-diagnosis";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// 获取 AI 引导提示
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

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
    let guidePrompt = "";
    let contextInfo = "";

    switch (questionNumber) {
      case 1:
        guidePrompt = guideQ1Prompt;
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
        guidePrompt = guideQ2Prompt;
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
        guidePrompt = guideQ3Prompt;
        contextInfo = `**题目**: ${problem.title}

**错误类型**: ${errorTypeInfo?.label || "未分类"}

**第一问的回答（错了哪）**: ${errorCase.q1Answer || "未回答"}
**第二问的回答（为什么错）**: ${errorCase.q2Answer || "未回答"}

${currentAnswer ? `**学生对"下次怎么避免"的当前回答**: ${currentAnswer}` : "学生还没有回答。"}

请引导学生总结一条可复用的防错规则。`;
        break;
    }

    // 调用 Claude API
    const response = await chat(
      [{ role: "user", content: contextInfo }],
      `${baseSystemPrompt}\n\n${guidePrompt}`,
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
