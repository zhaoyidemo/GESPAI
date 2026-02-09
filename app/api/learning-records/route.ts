import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import prisma from "@/lib/db";

// 计算综合掌握度
function calculateMasteryLevel(record: {
  tutorCompleted: boolean;
  feynmanCompleted: boolean;
  feynmanScore: number | null;
  practiceCount: number;
  correctCount: number;
}): number {
  let mastery = 0;

  // 学习完成度 (30%)
  if (record.tutorCompleted) {
    mastery += 30;
  }

  // 费曼验证 (30%)
  if (record.feynmanCompleted && record.feynmanScore) {
    mastery += (record.feynmanScore / 100) * 30;
  }

  // 练习正确率 (40%)
  if (record.practiceCount > 0) {
    const accuracy = record.correctCount / record.practiceCount;
    mastery += accuracy * 40;
  }

  return Math.round(mastery);
}

// 获取用户的学习记录
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const { searchParams } = new URL(request.url);
    const level = searchParams.get("level");

    // 获取用户的所有学习记录
    const records = await prisma.learningRecord.findMany({
      where: {
        userId: session.user.id,
        ...(level && {
          knowledgePoint: {
            level: parseInt(level),
          },
        }),
      },
      include: {
        knowledgePoint: {
          select: {
            id: true,
            name: true,
            level: true,
            category: true,
          },
        },
      },
    });

    // 计算每个记录的综合掌握度
    const recordsWithMastery = records.map((record) => ({
      ...record,
      masteryLevel: calculateMasteryLevel({
        tutorCompleted: record.tutorCompleted,
        feynmanCompleted: record.feynmanCompleted,
        feynmanScore: record.feynmanScore,
        practiceCount: record.practiceCount,
        correctCount: record.correctCount,
      }),
      practiceAccuracy:
        record.practiceCount > 0
          ? Math.round((record.correctCount / record.practiceCount) * 100)
          : null,
    }));

    // 转换为按知识点ID索引的Map
    const recordsByKnowledgePoint = recordsWithMastery.reduce(
      (acc, record) => {
        acc[record.knowledgePointId] = record;
        return acc;
      },
      {} as Record<string, (typeof recordsWithMastery)[0]>
    );

    return NextResponse.json({
      records: recordsByKnowledgePoint,
      total: records.length,
    });
  } catch (error) {
    console.error("Get learning records error:", error);
    return NextResponse.json(
      { error: "获取学习记录失败" },
      { status: 500 }
    );
  }
}

// 更新学习记录
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const body = await request.json();
    const { knowledgePointId, tutorCompleted, feynmanCompleted, feynmanScore } = body;

    if (!knowledgePointId) {
      return NextResponse.json(
        { error: "请提供知识点ID" },
        { status: 400 }
      );
    }

    // 更新或创建学习记录
    const record = await prisma.learningRecord.upsert({
      where: {
        userId_knowledgePointId: {
          userId: session.user.id,
          knowledgePointId,
        },
      },
      update: {
        ...(tutorCompleted !== undefined && { tutorCompleted }),
        ...(feynmanCompleted !== undefined && { feynmanCompleted }),
        ...(feynmanScore !== undefined && { feynmanScore }),
        lastStudiedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        knowledgePointId,
        tutorCompleted: tutorCompleted || false,
        feynmanCompleted: feynmanCompleted || false,
        feynmanScore: feynmanScore || null,
        startedAt: new Date(),
        lastStudiedAt: new Date(),
      },
    });

    // 计算综合掌握度
    const masteryLevel = calculateMasteryLevel({
      tutorCompleted: record.tutorCompleted,
      feynmanCompleted: record.feynmanCompleted,
      feynmanScore: record.feynmanScore,
      practiceCount: record.practiceCount,
      correctCount: record.correctCount,
    });

    // 更新掌握度
    await prisma.learningRecord.update({
      where: { id: record.id },
      data: { masteryLevel },
    });

    return NextResponse.json({
      success: true,
      record: { ...record, masteryLevel },
    });
  } catch (error) {
    console.error("Update learning record error:", error);
    return NextResponse.json(
      { error: "更新学习记录失败" },
      { status: 500 }
    );
  }
}
