import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Anthropic from "@anthropic-ai/sdk"
import { GESP_LEVEL5_SYLLABUS, mapKnowledgePoint, getKnowledgePointConfig } from "@/lib/gesp-syllabus"
import { getSystemPrompt } from "@/lib/prompts/get-system-prompt"

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
    const [submissions, problems, errorCases, preventionRules] = await Promise.all([
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
      }),

      // 获取错题本数据
      prisma.errorCase.findMany({
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
            }
          },
          submission: {
            select: {
              status: true,
              code: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),

      // 获取防错规则
      prisma.preventionRule.findMany({
        where: {
          userId,
          isActive: true,
        },
        orderBy: { hitCount: 'desc' }
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
      errorCases, // 错题本数据
      preventionRules, // 防错规则
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
  // 从数据库获取提示词
  const promptTemplate = await getSystemPrompt('insight_report_generate')
  const systemPrompt = await getSystemPrompt('insight_report_system')

  // 准备变量替换
  const knowledgeStatsText = data.knowledgeStats.map((kp: any) => `
${kp.name}：
- 做题数：${kp.attemptedCount} 题（考纲建议≥${kp.syllabus?.minProblems || 0}题）
- 通过率：${kp.passRate}%
- 考纲权重：${kp.syllabus ? (kp.syllabus.weight * 100).toFixed(0) : 0}%
- 重要程度：${kp.syllabus?.importance || 'unknown'}
`).join('\n')

  const errorSubmissionsText = data.errorSubmissions.slice(0, 5).map((sub: any) => `
题目：${sub.problem.title}
知识点：${sub.problem.knowledgePoints.join(', ')}
错误类型：${sub.status}
代码片段：
\`\`\`cpp
${sub.code?.slice(0, 200) || '无代码'}...
\`\`\`
`).join('\n---\n')

  // 错题本数据
  const errorCasesText = data.errorCases?.slice(0, 10).map((ec: any) => `
题目：${ec.problem.title}
知识点：${ec.problem.knowledgePoints?.join(', ')}
错误类型：${ec.errorType || '未分类'}
状态：${ec.status}

【三问反思】
1. 错了哪？${ec.q1Answer || '未填写'}
2. 为什么错？${ec.q2Answer || '未填写'}
3. 怎么避免？${ec.q3Answer || '未填写'}

AI分析：${ec.aiAnalysis ? JSON.stringify(ec.aiAnalysis) : '无'}
`).join('\n---\n') || '无错题记录'

  // 防错规则
  const preventionRulesText = data.preventionRules?.map((rule: any) => `
规则类型：${rule.errorType}
规则内容：${rule.rule}
触发次数：${rule.hitCount}次
相关题目：${rule.examples.length}道
`).join('\n---\n') || '无防错规则'

  // 替换变量
  const prompt = promptTemplate
    .replace('{{totalProblems}}', data.totalProblems.toString())
    .replace('{{solvedProblems}}', data.solvedProblems.toString())
    .replace('{{overallPassRate}}', data.overallPassRate.toString())
    .replace('{{knowledgeStats}}', knowledgeStatsText)
    .replace('{{errorSubmissions}}', errorSubmissionsText)
    .replace('{{errorCases}}', errorCasesText)
    .replace('{{preventionRules}}', preventionRulesText)

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-20250514',
    max_tokens: 8000,
    temperature: 0.7,
    system: systemPrompt,
    messages: [
      { role: 'user', content: prompt }
    ]
  })

  const firstBlock = response.content[0]
  const content = firstBlock.type === 'text' ? firstBlock.text : ''

  // 尝试解析 JSON
  try {
    // 方法1: 提取 ```json ``` 包裹的 JSON
    const codeBlockMatch = content.match(/```json\s*\n([\s\S]*?)\n```/)
    if (codeBlockMatch) {
      const jsonStr = codeBlockMatch[1]
      const parsed = JSON.parse(jsonStr)
      console.log('✅ 成功解析 JSON (代码块格式)')
      return parsed
    }

    // 方法2: 尝试直接解析整个内容
    const parsed = JSON.parse(content.trim())
    console.log('✅ 成功解析 JSON (直接格式)')
    return parsed
  } catch (e) {
    console.error('❌ JSON 解析失败:', e)
    console.log('原始内容:', content.substring(0, 500))
  }

  // 如果解析失败，返回原始内容
  console.warn('⚠️ 使用原始内容作为报告')
  return {
    studentVersion: content,
    parentVersion: content,
    teacherVersion: content,
    insights: {}
  }
}
