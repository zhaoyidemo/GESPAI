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
    const { problemId, code, language = "cpp", mode = "submit" } = body;

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

    // mode=run 时仅使用 samples，不创建记录
    // mode=submit 时使用全部 testCases，创建 Submission 记录
    const isRun = mode === "run";

    // 仅 submit 模式创建提交记录
    let submission: { id: string } | null = null;
    if (!isRun) {
      submission = await prisma.submission.create({
        data: {
          userId: session.user.id,
          problemId,
          code,
          language,
          status: "pending",
          score: 0,
        },
      });
    }

    // 解析测试用例：run 用 samples，submit 用 testCases
    const testCases = (isRun ? problem.samples : problem.testCases) as Array<{
      input: string;
      output: string;
    }>;

    if (!testCases || testCases.length === 0) {
      const errorMsg = isRun ? "题目没有样例数据" : "题目没有测试用例";

      if (submission) {
        await prisma.submission.update({
          where: { id: submission.id },
          data: {
            status: "runtime_error",
            errorMessage: errorMsg,
          },
        });
      }

      return NextResponse.json({
        ...(submission ? { id: submission.id } : {}),
        status: "runtime_error",
        score: 0,
        errorMessage: errorMsg,
      });
    }

    // 运行判题
    console.log(`📝 开始${isRun ? "运行样例" : "判题"}: 用户=${session.user.id}, 题目=${problem.title} (${problemId})`);

    const result = await judgeSubmission(
      code,
      language,
      testCases,
      problem.timeLimit,
      problem.memoryLimit
    );

    console.log(`✅ ${isRun ? "运行" : "判题"}完成: 状态=${result.status}, 分数=${result.score}`);

    // run 模式：直接返回结果，不创建记录、不更新 XP
    if (isRun) {
      return NextResponse.json({
        status: result.status,
        score: result.score,
        testResults: result.testResults,
        compileOutput: result.compileOutput,
      });
    }

    // submit 模式：更新提交记录
    await prisma.submission.update({
      where: { id: submission!.id },
      data: {
        status: result.status,
        score: result.score,
        testResults: JSON.parse(JSON.stringify(result.testResults)),
        compileOutput: result.compileOutput,
      },
    });

    // 如果 AC，增加用户 XP 并更新知识点练习统计
    if (result.status === "accepted") {
      const xpReward = problem.difficulty === "hard" ? 30 : problem.difficulty === "medium" ? 20 : 10;

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          totalXp: { increment: xpReward },
          lastActiveDate: new Date(),
        },
      });

      // 更新相关知识点的练习统计
      const knowledgePointNames = problem.knowledgePoints || [];
      for (const kpName of knowledgePointNames) {
        const kp = await prisma.knowledgePoint.findFirst({
          where: { name: kpName, level: problem.level },
        });

        if (kp) {
          await prisma.learningRecord.upsert({
            where: {
              userId_knowledgePointId: {
                userId: session.user.id,
                knowledgePointId: kp.id,
              },
            },
            create: {
              userId: session.user.id,
              knowledgePointId: kp.id,
              status: "in_progress",
              practiceCount: 1,
              correctCount: 1,
              lastStudiedAt: new Date(),
            },
            update: {
              practiceCount: { increment: 1 },
              correctCount: { increment: 1 },
              lastStudiedAt: new Date(),
            },
          });
        }
      }

      return NextResponse.json({
        id: submission!.id,
        ...result,
        xpEarned: xpReward,
      });
    }

    // 非 AC 的情况也更新练习次数
    const knowledgePointNames = problem.knowledgePoints || [];
    for (const kpName of knowledgePointNames) {
      const kp = await prisma.knowledgePoint.findFirst({
        where: { name: kpName, level: problem.level },
      });

      if (kp) {
        await prisma.learningRecord.upsert({
          where: {
            userId_knowledgePointId: {
              userId: session.user.id,
              knowledgePointId: kp.id,
            },
          },
          create: {
            userId: session.user.id,
            knowledgePointId: kp.id,
            status: "in_progress",
            practiceCount: 1,
            correctCount: 0,
            lastStudiedAt: new Date(),
          },
          update: {
            practiceCount: { increment: 1 },
            lastStudiedAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json({
      id: submission!.id,
      ...result,
    });
  } catch (error) {
    console.error("❌ 判题发生错误:", error);

    // 提供更详细的错误信息
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    console.error("错误详情:", errorMessage);

    // 检查是否是 Judge0 API key 问题
    if (errorMessage.includes("Judge0 API Key")) {
      return NextResponse.json(
        { error: "判题服务配置错误，请联系管理员" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: `判题失败: ${errorMessage}` },
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
        code: true,
        testResults: true,
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
