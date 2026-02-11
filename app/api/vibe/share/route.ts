import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/db";

const SHARE_XP_REWARD = 10;

const SHARE_BADGES: { code: string; threshold: number; name: string }[] = [
  { code: "share-first", threshold: 1, name: "初次分享" },
  { code: "share-5", threshold: 5, name: "分享达人" },
  { code: "share-10", threshold: 10, name: "分享大师" },
];

export async function POST(request: Request) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { postId } = await request.json();
    if (!postId) {
      return NextResponse.json({ error: "缺少 postId" }, { status: 400 });
    }

    const post = await prisma.vibePost.findUnique({ where: { id: postId } });
    if (!post || post.userId !== authResult.user.id) {
      return NextResponse.json({ error: "帖子不存在" }, { status: 404 });
    }

    // 标记为已分享 + 首次分享给 XP
    let xpEarned = 0;
    const newBadges: string[] = [];

    if (!post.xpAwarded) {
      await prisma.$transaction([
        prisma.vibePost.update({
          where: { id: postId },
          data: { shared: true, xpAwarded: true },
        }),
        prisma.user.update({
          where: { id: authResult.user.id },
          data: { totalXp: { increment: SHARE_XP_REWARD } },
        }),
      ]);
      xpEarned = SHARE_XP_REWARD;
    } else {
      await prisma.vibePost.update({
        where: { id: postId },
        data: { shared: true },
      });
    }

    // 检查分享徽章
    const shareCount = await prisma.vibePost.count({
      where: { userId: authResult.user.id, shared: true },
    });

    const user = await prisma.user.findUnique({
      where: { id: authResult.user.id },
      select: { badges: true },
    });

    const currentBadges = user?.badges || [];
    const badgesToAdd: string[] = [];

    for (const badge of SHARE_BADGES) {
      if (shareCount >= badge.threshold && !currentBadges.includes(badge.code)) {
        badgesToAdd.push(badge.code);
        newBadges.push(badge.name);
      }
    }

    if (badgesToAdd.length > 0) {
      await prisma.user.update({
        where: { id: authResult.user.id },
        data: { badges: { push: badgesToAdd } },
      });
    }

    return NextResponse.json({ success: true, xpEarned, newBadges });
  } catch (error) {
    console.error("Vibe share error:", error);
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }
}
