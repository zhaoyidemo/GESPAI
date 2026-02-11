import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getSystemPrompt } from "@/lib/prompts/get-system-prompt";
import { chat } from "@/lib/claude";

export async function POST(request: Request) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { contentType, rawInput } = await request.json();

    if (!rawInput || !rawInput.trim()) {
      return NextResponse.json(
        { error: "请输入原始素材" },
        { status: 400 }
      );
    }

    if (!["build", "learn"].includes(contentType)) {
      return NextResponse.json(
        { error: "内容类型必须是 build 或 learn" },
        { status: 400 }
      );
    }

    const systemPrompt = await getSystemPrompt("vibe-generate");

    const typeLabel = contentType === "build" ? "Build（开发活动）" : "Learn（学习活动）";
    const userMessage = `内容方向：${typeLabel}

原始素材：
${rawInput.trim()}

请根据以上素材，生成一条小红书风格的图文帖子。严格按照 JSON 格式输出。`;

    const response = await chat(
      [{ role: "user", content: userMessage }],
      systemPrompt,
      2048
    );

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json({
          title: parsed.title || "",
          body: parsed.body || "",
          hashtags: parsed.hashtags || [],
          codeSnippet: parsed.codeSnippet || null,
        });
      } catch {
        return NextResponse.json(
          { error: "AI 返回格式解析失败，请重试" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "AI 未返回有效内容，请重试" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Vibe generate error:", error);
    return NextResponse.json(
      { error: "生成失败，请稍后重试" },
      { status: 500 }
    );
  }
}
