import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

// 增加用户XP
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, reason } = body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "请提供有效的XP数量" },
        { status: 400 }
      );
    }

    // 限制单次增加的XP数量
    const safeAmount = Math.min(amount, 100);

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        totalXp: { increment: safeAmount },
        lastActiveDate: new Date(),
      },
      select: {
        totalXp: true,
      },
    });

    console.log(`XP增加: 用户=${session.user.id}, 数量=${safeAmount}, 原因=${reason || "未知"}`);

    return NextResponse.json({
      success: true,
      xpEarned: safeAmount,
      totalXp: user.totalXp,
    });
  } catch (error) {
    console.error("Add XP error:", error);
    return NextResponse.json(
      { error: "增加XP失败" },
      { status: 500 }
    );
  }
}
