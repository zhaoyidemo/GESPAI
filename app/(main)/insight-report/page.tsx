"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactMarkdown from "react-markdown"

export default function InsightReportPage() {
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<any>(null)
  const [view, setView] = useState<'student' | 'parent' | 'teacher'>('student')

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

    } catch (error) {
      console.error('生成报告失败:', error)
      alert('生成失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl py-8">
      {!report ? (
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
