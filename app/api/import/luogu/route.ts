import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "请提供洛谷主页链接" }, { status: 400 });
    }

    // 验证链接格式
    const luoguPattern = /^https?:\/\/(www\.)?luogu\.com\.cn\/user\/(\d+)/;
    const match = url.match(luoguPattern);

    if (!match) {
      return NextResponse.json(
        { error: "请提供有效的洛谷主页链接" },
        { status: 400 }
      );
    }

    const userId = match[2];

    // TODO: 实际抓取洛谷数据
    // 这里返回模拟数据
    const mockData = {
      userId,
      username: "luogu_user",
      problemCount: 0,
      problems: [],
      message: "洛谷数据导入功能正在开发中",
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error("Luogu import error:", error);
    return NextResponse.json(
      { error: "导入失败，请稍后重试" },
      { status: 500 }
    );
  }
}
