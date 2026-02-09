import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { generateIflytekAuthUrl } from "@/lib/iflytek";

export async function GET() {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

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
