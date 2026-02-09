import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { chat } from "@/lib/claude";
import { getSystemPrompt } from "@/lib/prompts/get-system-prompt";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: "请提供代码" }, { status: 400 });
    }

    // 调用 AI 分析代码
    const systemPrompt = await getSystemPrompt("review-import");

    const response = await chat(
      [
        {
          role: "user",
          content: `请分析以下代码：\n\n\`\`\`cpp\n${code}\n\`\`\``,
        },
      ],
      systemPrompt,
      1024
    );

    // 尝试解析 JSON
    let analysis;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        analysis = { rawAnalysis: response };
      }
    } catch {
      analysis = { rawAnalysis: response };
    }

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Code analysis error:", error);
    return NextResponse.json(
      { error: "分析失败，请稍后重试" },
      { status: 500 }
    );
  }
}
