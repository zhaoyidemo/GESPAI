import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import prisma from "@/lib/db";

// 获取模拟考试历史
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const results = await prisma.mockExamResult.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        targetLevel: true,
        totalScore: true,
        passScore: true,
        passed: true,
        choiceScore: true,
        choiceTotal: true,
        programmingScore: true,
        programmingTotal: true,
        timeTaken: true,
        timeLimit: true,
        createdAt: true,
      },
    });

    // 计算统计数据
    const stats = {
      total: results.length,
      passed: results.filter((r) => r.passed).length,
      avgScore:
        results.length > 0
          ? Math.round(
              results.reduce((sum, r) => sum + r.totalScore, 0) / results.length
            )
          : 0,
      bestScore: results.length > 0 ? Math.max(...results.map((r) => r.totalScore)) : 0,
    };

    return NextResponse.json({ results, stats });
  } catch (error) {
    console.error("Get mock exam results error:", error);
    return NextResponse.json(
      { error: "获取模拟考试记录失败" },
      { status: 500 }
    );
  }
}

// 保存模拟考试结果
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const body = await request.json();
    const {
      targetLevel,
      totalScore,
      choiceScore,
      choiceTotal = 30,
      programmingScore,
      programmingTotal = 70,
      timeTaken,
      timeLimit = 90,
      choiceAnswers,
      programmingResults,
    } = body;

    if (totalScore === undefined || choiceScore === undefined || programmingScore === undefined) {
      return NextResponse.json(
        { error: "缺少必要的成绩数据" },
        { status: 400 }
      );
    }

    const passScore = 60;
    const passed = totalScore >= passScore;

    const result = await prisma.mockExamResult.create({
      data: {
        userId: session.user.id,
        targetLevel: targetLevel || 5,
        totalScore,
        passScore,
        passed,
        choiceScore,
        choiceTotal,
        programmingScore,
        programmingTotal,
        timeTaken: timeTaken || 0,
        timeLimit,
        choiceAnswers: choiceAnswers || null,
        programmingResults: programmingResults || null,
      },
    });

    // 如果通过，增加XP奖励
    if (passed) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          totalXp: { increment: 50 },
        },
      });
    }

    return NextResponse.json({
      success: true,
      result,
      xpEarned: passed ? 50 : 0,
    });
  } catch (error) {
    console.error("Save mock exam result error:", error);
    return NextResponse.json(
      { error: "保存模拟考试记录失败" },
      { status: 500 }
    );
  }
}

// 清空模拟考试记录
export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    await prisma.mockExamResult.deleteMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete mock exam results error:", error);
    return NextResponse.json(
      { error: "清空模拟考试记录失败" },
      { status: 500 }
    );
  }
}
