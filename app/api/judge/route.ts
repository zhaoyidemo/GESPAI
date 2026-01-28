import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { judgeSubmission } from "@/lib/judge";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { problemId, code, language = "cpp" } = body;

    if (!problemId || !code) {
      return NextResponse.json(
        { error: "请提供题目ID和代码" },
        { status: 400 }
      );
    }

    // 获取题目信息
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return NextResponse.json({ error: "题目不存在" }, { status: 404 });
    }

    // 创建提交记录
    const submission = await prisma.submission.create({
      data: {
        userId: session.user.id,
        problemId,
        code,
        language,
        status: "pending",
        score: 0,
      },
    });

    // 解析测试用例
    const testCases = problem.testCases as Array<{
      input: string;
      output: string;
    }>;

    if (!testCases || testCases.length === 0) {
      await prisma.submission.update({
        where: { id: submission.id },
        data: {
          status: "runtime_error",
          errorMessage: "题目没有测试用例",
        },
      });

      return NextResponse.json({
        id: submission.id,
        status: "runtime_error",
        score: 0,
        errorMessage: "题目没有测试用例",
      });
    }

    // 运行判题
    const result = await judgeSubmission(
      code,
      language,
      testCases,
      problem.timeLimit,
      problem.memoryLimit
    );

    // 更新提交记录
    await prisma.submission.update({
      where: { id: submission.id },
      data: {
        status: result.status,
        score: result.score,
        testResults: JSON.parse(JSON.stringify(result.testResults)),
        compileOutput: result.compileOutput,
      },
    });

    // 如果 AC，增加用户 XP
    if (result.status === "accepted") {
      const xpReward = problem.difficulty === "hard" ? 30 : problem.difficulty === "medium" ? 20 : 10;

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          totalXp: { increment: xpReward },
          lastActiveDate: new Date(),
        },
      });

      return NextResponse.json({
        id: submission.id,
        ...result,
        xpEarned: xpReward,
      });
    }

    return NextResponse.json({
      id: submission.id,
      ...result,
    });
  } catch (error) {
    console.error("Judge error:", error);
    return NextResponse.json(
      { error: "判题失败，请稍后重试" },
      { status: 500 }
    );
  }
}

// 获取提交历史
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get("problemId");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: { userId: string; problemId?: string } = {
      userId: session.user.id,
    };

    if (problemId) {
      where.problemId = problemId;
    }

    const submissions = await prisma.submission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        status: true,
        score: true,
        language: true,
        createdAt: true,
        problem: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Get submissions error:", error);
    return NextResponse.json(
      { error: "获取提交记录失败" },
      { status: 500 }
    );
  }
}
