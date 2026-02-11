import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/db";

// 获取历史列表
export async function GET() {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const posts = await prisma.vibePost.findMany({
      where: { userId: authResult.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        title: true,
        contentType: true,
        cardStyle: true,
        shared: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Vibe history error:", error);
    return NextResponse.json({ error: "获取历史失败", posts: [] }, { status: 500 });
  }
}

// 保存帖子
export async function POST(request: Request) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const {
      contentType,
      tone,
      rawInput,
      title,
      body,
      hashtags,
      codeSnippet,
      cardStyle,
      cardSize,
    } = await request.json();

    const post = await prisma.vibePost.create({
      data: {
        userId: authResult.user.id,
        contentType: contentType || "build",
        tone: tone || null,
        rawInput: rawInput || "",
        title: title || "",
        body: body || "",
        hashtags: hashtags || [],
        codeSnippet: codeSnippet || null,
        cardStyle: cardStyle || "dark",
        cardSize: cardSize || "3:4",
      },
    });

    return NextResponse.json({ id: post.id });
  } catch (error) {
    console.error("Vibe save error:", error);
    return NextResponse.json({ error: "保存失败" }, { status: 500 });
  }
}
