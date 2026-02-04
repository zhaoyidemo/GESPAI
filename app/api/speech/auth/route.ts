import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateIflytekAuthUrl } from "@/lib/iflytek";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const url = generateIflytekAuthUrl();
    return NextResponse.json({ url });
  } catch (error) {
    console.error("生成讯飞签名 URL 失败:", error);
    return NextResponse.json(
      { error: "生成签名失败" },
      { status: 500 }
    );
  }
}
