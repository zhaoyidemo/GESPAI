import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { DEFAULT_INSIGHT_REPORT_PROMPT, DEFAULT_INSIGHT_REPORT_SYSTEM } from "@/lib/default-prompts-insight"

export async function POST() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "需要管理员权限" }, { status: 403 })
  }

  try {
    // 洞察报告生成提示词
    await prisma.systemPrompt.upsert({
      where: { key: "insight_report_generate" },
      update: {
        content: DEFAULT_INSIGHT_REPORT_PROMPT,
        updatedBy: session.user.id,
      },
      create: {
        key: "insight_report_generate",
        category: "insight",
        name: "洞察报告生成",
        description: "生成三版本（小朋友/家长/老师）考前洞察报告的主提示词。支持变量：{{totalProblems}}, {{solvedProblems}}, {{overallPassRate}}, {{knowledgeStats}}, {{errorSubmissions}}",
        content: DEFAULT_INSIGHT_REPORT_PROMPT,
        isActive: true,
        updatedBy: session.user.id,
      },
    })

    // 洞察报告系统提示词
    await prisma.systemPrompt.upsert({
      where: { key: "insight_report_system" },
      update: {
        content: DEFAULT_INSIGHT_REPORT_SYSTEM,
        updatedBy: session.user.id,
      },
      create: {
        key: "insight_report_system",
        category: "insight",
        name: "洞察报告系统提示词",
        description: "洞察报告生成时的 system 提示词，定义 AI 的角色和能力",
        content: DEFAULT_INSIGHT_REPORT_SYSTEM,
        isActive: true,
        updatedBy: session.user.id,
      },
    })

    return NextResponse.json({
      message: "洞察报告提示词初始化成功",
      keys: ["insight_report_generate", "insight_report_system"]
    })
  } catch (error) {
    console.error("初始化提示词失败:", error)
    return NextResponse.json({ error: "初始化失败" }, { status: 500 })
  }
}
