import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Anthropic from "@anthropic-ai/sdk"
import { GESP_LEVEL5_SYLLABUS, mapKnowledgePoint, getKnowledgePointConfig } from "@/lib/gesp-syllabus"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未授权" }, { status: 401 })
  }

  const userId = session.user.id
  const level = 5 // 目前只做5级

  try {
    // 1. 数据收集
    const [submissions, problems] = await Promise.all([
      // 获取用户在5级的所有提交
      prisma.submission.findMany({
        where: {
          userId,
          problem: { level }
        },
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              knowledgePoints: true,
              difficulty: true,
            }
          }
        },
        orderBy: { createdAt: 'asc' }
      }),

      // 获取5级所有题目（用于统计覆盖度）
      prisma.problem.findMany({
        where: { level },
        select: {
          id: true,
          title: true,
          knowledgePoints: true,
          difficulty: true,
        }
      })
    ])

    // 检查题数要求
    const uniqueProblems = new Set(submissions.map(s => s.problemId))
    if (uniqueProblems.size < 20) {
      return NextResponse.json(
        { error: `至少需要完成20道题才能生成报告，当前已完成 ${uniqueProblems.size} 道题` },
        { status: 400 }
      )
    }

    // 2. 知识点统计
    const knowledgeStats = analyzeKnowledgePoints(submissions)

    // 3. 错误分析
    const errorSubmissions = submissions.filter(s => s.status !== 'accepted')

    // 4. 基础统计
    const solvedProblems = new Set(
      submissions.filter(s => s.status === 'accepted').map(s => s.problemId)
    ).size

    const totalProblems = uniqueProblems.size
    const overallPassRate = Math.round((solvedProblems / totalProblems) * 100)

    // 5. 调用 Claude Opus 生成报告
    const report = await generateReportWithAI({
      userId,
      level,
      totalProblems,
      solvedProblems,
      overallPassRate,
      knowledgeStats,
      errorSubmissions: errorSubmissions.slice(0, 10), // 只分析最近10个错误
      submissions: submissions.slice(-20), // 只分析最近20次提交
    })

    // 6. 保存报告
    const savedReport = await prisma.insightReport.create({
      data: {
        userId,
        level,
        totalProblems,
        solvedProblems,
        knowledgePointsCoverage: JSON.parse(JSON.stringify(knowledgeStats)),
        studentVersion: report.studentVersion,
        parentVersion: report.parentVersion,
        teacherVersion: report.teacherVersion,
        insights: JSON.parse(JSON.stringify(report.insights)),
        modelUsed: 'claude-opus-4-6',
        promptVersion: 'v1.0',
      }
    })

    return NextResponse.json({ reportId: savedReport.id })
  } catch (error) {
    console.error('生成报告失败:', error)
    return NextResponse.json(
      { error: '生成报告失败，请稍后重试' },
      { status: 500 }
    )
  }
}

// 知识点统计分析
function analyzeKnowledgePoints(submissions: any[]) {
  const stats: Record<string, any> = {}

  submissions.forEach(sub => {
    sub.problem.knowledgePoints.forEach((kp: string) => {
      const mappedKP = mapKnowledgePoint(kp)

      if (!stats[mappedKP]) {
        stats[mappedKP] = {
          name: mappedKP,
          attempted: new Set(),
          solved: new Set(),
          submissions: []
        }
      }

      stats[mappedKP].attempted.add(sub.problemId)
      if (sub.status === 'accepted') {
        stats[mappedKP].solved.add(sub.problemId)
      }
      stats[mappedKP].submissions.push(sub)
    })
  })

  // 转换为数组格式
  return Object.entries(stats).map(([kp, data]: [string, any]) => {
    const config = getKnowledgePointConfig(kp)
    return {
      name: kp,
      attemptedCount: data.attempted.size,
      solvedCount: data.solved.size,
      passRate: data.attempted.size > 0
        ? Math.round((data.solved.size / data.attempted.size) * 100)
        : 0,
      syllabus: config ? {
        weight: config.weight,
        importance: config.importance,
        minProblems: config.minProblems
      } : null,
      problems: Array.from(data.attempted).slice(0, 5) // 只保留前5道题
    }
  })
}

// AI 生成报告（单次调用，包含三个版本）
async function generateReportWithAI(data: any) {
  const prompt = `你是一位资深的 GESP C++ 竞赛教练，需要为学生生成一份 5级考前洞察报告。

学生数据：
- 完成题目：${data.totalProblems} 道
- 通过题目：${data.solvedProblems} 道
- 整体通过率：${data.overallPassRate}%

知识点掌握情况：
${data.knowledgeStats.map((kp: any) => `
${kp.name}：
- 做题数：${kp.attemptedCount} 题（考纲建议≥${kp.syllabus?.minProblems || 0}题）
- 通过率：${kp.passRate}%
- 考纲权重：${kp.syllabus ? (kp.syllabus.weight * 100).toFixed(0) : 0}%
- 重要程度：${kp.syllabus?.importance || 'unknown'}
`).join('\n')}

最近的错误提交（供分析错误模式）：
${data.errorSubmissions.slice(0, 5).map((sub: any) => `
题目：${sub.problem.title}
知识点：${sub.problem.knowledgePoints.join(', ')}
错误类型：${sub.status}
代码片段：
\`\`\`cpp
${sub.code?.slice(0, 200) || '无代码'}...
\`\`\`
`).join('\n---\n')}

GESP 5级考试信息：
- 考试时间：180分钟
- 题型：单选15题（30分）+ 判断10题（20分）+ 编程2题（50分）
- 编程题重点：贪心、二分查找、递归、分治、数论

请生成三个版本的报告（Markdown格式）：

**1. 小朋友版**（800字）
- 语气：鼓励、轻松、第二人称"你"
- 结构：
  - 🎯 你的考试准备度：X分（0-100）
  - ⭐ 你的三大亮点（具体、鼓励）
  - 💪 考前冲刺建议（3-5条，可操作）
  - ✅ 考前清单（勾选框格式，用 - [ ] 表示）
- 重点：建立信心 + 明确行动

**2. 家长版**（1000字）
- 语气：客观、数据支撑、第三人称"孩子"
- 结构：
  - 📊 学习概况（题数、通过率、知识点覆盖）
  - ✅ 优势领域（哪些知识点掌握好）
  - ⚠️ 需要关注（哪些知识点薄弱）
  - 💡 家长可以做的（2-3条具体建议）
- 重点：让家长了解真实水平

**3. 老师版**（1200字）
- 语气：专业、深度分析
- 结构：
  - 🎓 能力诊断（算法思维、代码实现、问题解决）
  - 📝 知识点详细分析（对照考纲，哪些掌握、哪些欠缺）
  - 🔍 错误模式分析（从错误中发现的问题）
  - 📋 教学建议（个性化辅导方向）
  - 🔮 潜力评估（通过概率、建议考后方向）
- 重点：专业诊断 + 教学指导

请用以下 JSON 格式回复：
\`\`\`json
{
  "studentVersion": "Markdown内容",
  "parentVersion": "Markdown内容",
  "teacherVersion": "Markdown内容",
  "insights": {
    "coverageScore": 82,
    "strengths": ["贪心算法", "前缀和"],
    "weaknesses": ["二分查找", "递归"],
    "passRatePrediction": 85
  }
}
\`\`\`
`

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-20250514',
    max_tokens: 8000,
    temperature: 0.7,
    system: '你是一位资深的 GESP C++ 竞赛教练和教育专家，擅长个性化教学和学生能力诊断。',
    messages: [
      { role: 'user', content: prompt }
    ]
  })

  const firstBlock = response.content[0]
  const content = firstBlock.type === 'text' ? firstBlock.text : ''

  // 尝试解析 JSON
  try {
    // 提取 JSON（可能被包在 ```json ``` 中）
    const jsonMatch = content.match(/```json\s*\n([\s\S]*?)\n```/) ||
                      content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0]
      return JSON.parse(jsonStr)
    }
  } catch (e) {
    console.error('Failed to parse AI response:', e)
  }

  // 如果解析失败，返回原始内容
  return {
    studentVersion: content,
    parentVersion: content,
    teacherVersion: content,
    insights: {}
  }
}
