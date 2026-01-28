import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { chat } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: "请提供代码" }, { status: 400 });
    }

    // 调用 AI 分析代码
    const systemPrompt = `你是一位专业的编程教育专家，请分析学生提供的代码，评估其编程水平。

请以 JSON 格式返回分析结果：
{
  "level": 1-8, // 预估的 GESP 级别
  "knowledgePoints": ["知识点1", "知识点2"], // 代码中体现的知识点
  "strengths": ["优点1", "优点2"], // 代码的优点
  "improvements": ["建议1", "建议2"], // 改进建议
  "summary": "总体评价"
}`;

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
