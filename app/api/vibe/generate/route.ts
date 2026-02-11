import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getSystemPrompt } from "@/lib/prompts/get-system-prompt";
import { chat } from "@/lib/claude";
import type { VibeResult } from "@/stores/vibe-store";

function parseVibeResult(obj: Record<string, unknown>): VibeResult {
  return {
    title: (obj.title as string) || "",
    body: (obj.body as string) || "",
    hashtags: (obj.hashtags as string[]) || [],
    codeSnippet: (obj.codeSnippet as string) || null,
  };
}

export async function POST(request: Request) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { contentType, rawInput, variants = 1 } = await request.json();

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

    const variantCount = Math.min(Math.max(1, Number(variants) || 1), 3);
    const systemPrompt = await getSystemPrompt("vibe-generate");
    const typeLabel =
      contentType === "build" ? "Build（开发活动）" : "Learn（学习活动）";

    if (variantCount === 1) {
      // 单变体：行为不变
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
            results: [parseVibeResult(parsed)],
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
    }

    // 多变体：要求 AI 返回 JSON 数组
    const userMessage = `内容方向：${typeLabel}

原始素材：
${rawInput.trim()}

请根据以上素材，生成 ${variantCount} 个不同角度的小红书风格图文帖子。每个帖子侧重不同的切入点（比如技术细节、情感成长、实用价值等）。
严格按照 JSON 数组格式输出，每个元素包含 title、body、hashtags、codeSnippet 字段。`;

    const response = await chat(
      [{ role: "user", content: userMessage }],
      systemPrompt,
      4096
    );

    // 尝试解析 JSON 数组
    const arrayMatch = response.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      try {
        const parsed = JSON.parse(arrayMatch[0]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return NextResponse.json({
            results: parsed.slice(0, variantCount).map(parseVibeResult),
          });
        }
      } catch {
        // 数组解析失败，降级尝试单个对象
      }
    }

    // 降级：尝试解析单个 JSON 对象
    const objMatch = response.match(/\{[\s\S]*\}/);
    if (objMatch) {
      try {
        const parsed = JSON.parse(objMatch[0]);
        return NextResponse.json({
          results: [parseVibeResult(parsed)],
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
