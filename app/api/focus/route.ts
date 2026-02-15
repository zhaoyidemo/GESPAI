import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import prisma from "@/lib/db";

// POST — 创建新的专注会话
export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    const { pageType, pageId } = await request.json();

    // 关闭该用户所有活跃的旧会话（防崩溃残留）
    await prisma.focusSession.updateMany({
      where: { userId: session.user.id, isActive: true },
      data: {
        isActive: false,
        endedAt: new Date(),
      },
    });

    // 创建新会话
    const focusSession = await prisma.focusSession.create({
      data: {
        userId: session.user.id,
        pageType,
        pageId: pageId || null,
      },
    });

    return NextResponse.json({
      id: focusSession.id,
      startedAt: focusSession.startedAt,
    });
  } catch (error) {
    console.error("Create focus session error:", error);
    return NextResponse.json(
      { error: "创建专注会话失败" },
      { status: 500 }
    );
  }
}

// PATCH — 更新会话（心跳保存 / 结束）
export async function PATCH(request: NextRequest) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    const { sessionId, focusSeconds, blurCount, totalSeconds, end } =
      await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "缺少 sessionId" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {
      focusSeconds,
      blurCount,
      totalSeconds,
    };

    if (end) {
      updateData.isActive = false;
      updateData.endedAt = new Date();
    }

    await prisma.focusSession.updateMany({
      where: {
        id: sessionId,
        userId: session.user.id,
      },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update focus session error:", error);
    return NextResponse.json(
      { error: "更新专注会话失败" },
      { status: 500 }
    );
  }
}

// GET — 获取专注报告
export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "today";

    let startDate: Date;
    const now = new Date();

    switch (range) {
      case "week": {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        break;
      }
      case "month": {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
        break;
      }
      default: {
        // today
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      }
    }

    const sessions = await prisma.focusSession.findMany({
      where: {
        userId: session.user.id,
        startedAt: { gte: startDate },
      },
      orderBy: { startedAt: "desc" },
    });

    const summary = sessions.reduce(
      (acc: { totalSeconds: number; focusSeconds: number; blurCount: number; sessionCount: number; focusScore: number }, s) => {
        acc.totalSeconds += s.totalSeconds;
        acc.focusSeconds += s.focusSeconds;
        acc.blurCount += s.blurCount;
        acc.sessionCount += 1;
        return acc;
      },
      { totalSeconds: 0, focusSeconds: 0, blurCount: 0, sessionCount: 0, focusScore: 0 }
    );

    summary.focusScore =
      summary.totalSeconds > 0
        ? Math.round((summary.focusSeconds / summary.totalSeconds) * 100)
        : 0;

    return NextResponse.json({ sessions, summary });
  } catch (error) {
    console.error("Get focus report error:", error);
    return NextResponse.json(
      { error: "获取专注报告失败" },
      { status: 500 }
    );
  }
}
