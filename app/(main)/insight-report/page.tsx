"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactMarkdown from "react-markdown"

export default function InsightReportPage() {
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<any>(null)
  const [view, setView] = useState<'student' | 'parent' | 'teacher'>('student')
  const [historyReports, setHistoryReports] = useState<any[]>([])
  const [showHistory, setShowHistory] = useState(false)

  // 加载历史报告
  useEffect(() => {
    loadHistoryReports()
  }, [])

  const loadHistoryReports = async () => {
    try {
      const res = await fetch('/api/insight-report/list')
      if (res.ok) {
        const data = await res.json()
        setHistoryReports(data)
      }
    } catch (error) {
      console.error('加载历史报告失败:', error)
    }
  }

  const generateReport = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/insight-report/generate', {
        method: 'POST'
      })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || '生成失败')
        return
      }

      const { reportId } = await res.json()

      // 获取报告内容
      const reportRes = await fetch(`/api/insight-report/${reportId}`)
      const reportData = await reportRes.json()
      setReport(reportData)

      // 刷新历史列表
      loadHistoryReports()

    } catch (error) {
      console.error('生成报告失败:', error)
      alert('生成失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const loadReport = async (reportId: string) => {
    try {
      const res = await fetch(`/api/insight-report/${reportId}`)
      if (res.ok) {
        const data = await res.json()
        setReport(data)
        setShowHistory(false)
      }
    } catch (error) {
      console.error('加载报告失败:', error)
      alert('加载失败')
    }
  }

  return (
    <div className="container max-w-4xl py-8">
      {!report && !showHistory ? (
        <div>
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">📊 生成考前洞察报告</h1>
            <p className="text-muted-foreground mb-6">
              基于你的做题数据，AI 将深度分析你的知识点掌握情况，<br />
              并生成个性化的考前建议。
            </p>

            <Button
              onClick={generateReport}
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <>⏳ 正在生成中（预计30-60秒）...</>
              ) : (
                <>生成我的洞察报告</>
              )}
            </Button>

            <p className="text-sm text-muted-foreground mt-4">
              💡 需要至少完成 20 道 5级题目
            </p>
          </Card>

          {historyReports.length > 0 && (
            <Card className="p-6 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">📜 历史报告</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(true)}
                >
                  查看全部
                </Button>
              </div>
              <div className="space-y-2">
                {historyReports.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => loadReport(r.id)}
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {new Date(r.generatedAt).toLocaleString('zh-CN')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        完成 {r.totalProblems} 题 · 通过 {r.solvedProblems} 题
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      查看
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      ) : showHistory ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">历史报告</h1>
            <Button
              variant="outline"
              onClick={() => setShowHistory(false)}
            >
              返回
            </Button>
          </div>

          <div className="space-y-4">
            {historyReports.map((r) => (
              <Card
                key={r.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => loadReport(r.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-lg font-semibold mb-2">
                      {new Date(r.generatedAt).toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>📝 完成 {r.totalProblems} 题</span>
                      <span>✅ 通过 {r.solvedProblems} 题</span>
                      <span>
                        📊 通过率 {Math.round((r.solvedProblems / r.totalProblems) * 100)}%
                      </span>
                    </div>
                    {r.insights?.coverageScore && (
                      <div className="mt-2">
                        <span className="text-sm font-medium">
                          准备度：{r.insights.coverageScore}分
                        </span>
                      </div>
                    )}
                  </div>
                  <Button>查看报告</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">我的洞察报告</h1>
            <p className="text-sm text-muted-foreground">
              生成时间：{new Date(report.generatedAt).toLocaleString('zh-CN')}
            </p>
          </div>

          <Tabs value={view} onValueChange={(v: any) => setView(v)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="student">👦 我的报告</TabsTrigger>
              <TabsTrigger value="parent">👪 家长视角</TabsTrigger>
              <TabsTrigger value="teacher">👨‍🏫 老师视角</TabsTrigger>
            </TabsList>

            <TabsContent value="student" className="mt-6">
              <Card className="p-6 prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown>{report.studentVersion}</ReactMarkdown>
              </Card>
            </TabsContent>

            <TabsContent value="parent" className="mt-6">
              <Card className="p-6 prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown>{report.parentVersion}</ReactMarkdown>
              </Card>
            </TabsContent>

            <TabsContent value="teacher" className="mt-6">
              <Card className="p-6 prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown>{report.teacherVersion}</ReactMarkdown>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex gap-4">
            <Button onClick={generateReport} variant="outline">
              重新生成报告
            </Button>
            {historyReports.length > 1 && (
              <Button
                onClick={() => {
                  setReport(null)
                  setShowHistory(true)
                }}
                variant="outline"
              >
                查看历史报告
              </Button>
            )}
            <Button
              onClick={() => setReport(null)}
              variant="ghost"
            >
              返回
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
