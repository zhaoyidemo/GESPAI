"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatInterface } from "@/components/chat/chat-interface";
import { CodeEditor } from "@/components/editor/code-editor";
import { useToast } from "@/components/ui/use-toast";
import { AIDebugDrawer, type AIConversation } from "@/components/ai-debug-drawer";
import {
  ArrowLeft,
  Play,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Cpu,
  MessageSquare,
  FileText,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { getDifficultyLabel, getJudgeStatusLabel } from "@/lib/utils";

interface Problem {
  id: string;
  title: string;
  level: number;
  difficulty: string;
  knowledgePoints: string[];
  description: string;
  inputFormat: string | null;
  outputFormat: string | null;
  samples: Array<{ input: string; output: string; explanation?: string }>;
  timeLimit: number;
  memoryLimit: number;
  hint: string | null;
}

interface TestResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  time: number | null;
  memory: number | null;
  status: string;
}

interface JudgeResult {
  id: string;
  status: string;
  score: number;
  testResults: TestResult[];
  xpEarned?: number;
}

const DEFAULT_CODE = `#include <iostream>
using namespace std;

int main() {
    // 在这里编写你的代码

    return 0;
}
`;

export default function ProblemPage() {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [judgeResult, setJudgeResult] = useState<JudgeResult | null>(null);
  const [activeTab, setActiveTab] = useState("description");

  // AI调试助手状态
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiConversations, setAiConversations] = useState<AIConversation[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiHelpCount, setAiHelpCount] = useState(0);

  const fetchProblem = useCallback(async () => {
    try {
      const response = await fetch(`/api/problems/${id}`);
      const data = await response.json();

      if (response.ok) {
        setProblem(data.problem);
        if (data.bestSubmission?.code) {
          setCode(data.bestSubmission.code);
        }
      } else {
        toast({
          variant: "destructive",
          title: "加载失败",
          description: data.error || "无法加载题目",
        });
      }
    } catch (error) {
      console.error("Fetch problem error:", error);
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchProblem();
  }, [fetchProblem]);

  const handleAIHelp = async () => {
    if (!judgeResult?.id) {
      toast({
        variant: "destructive",
        title: "无法请求帮助",
        description: "请先提交代码",
      });
      return;
    }

    setAiLoading(true);
    setAiDrawerOpen(true);

    try {
      const response = await fetch("/api/ai/debug-help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: judgeResult.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const newConversation: AIConversation = {
          promptLevel: data.promptLevel,
          aiResponse: data.aiResponse,
          timestamp: new Date().toISOString(),
        };

        setAiConversations((prev) => [...prev, newConversation]);
        setAiHelpCount(data.helpCount);

        toast({
          title: "AI分析完成",
          description: `第${data.helpCount}次提示`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "AI分析失败",
          description: data.error || "请稍后重试",
        });
        setAiDrawerOpen(false);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI分析失败",
        description: error instanceof Error ? error.message : "网络错误",
      });
      setAiDrawerOpen(false);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast({
        variant: "destructive",
        title: "提交失败",
        description: "代码不能为空",
      });
      return;
    }

    setSubmitting(true);
    setJudgeResult(null);
    // 重置AI助手状态（新的提交）
    setAiConversations([]);
    setAiHelpCount(0);
    setAiDrawerOpen(false);

    try {
      const response = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: id,
          code,
          language: "cpp",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setJudgeResult(data);
        setActiveTab("result");

        if (data.status === "accepted") {
          toast({
            title: "通过！",
            description: `恭喜你！获得 ${data.xpEarned || 0} XP`,
          });
        } else {
          const statusInfo = getJudgeStatusLabel(data.status);
          toast({
            variant: "destructive",
            title: statusInfo.label,
            description: `得分：${data.score}/100`,
          });
        }
      } else {
        throw new Error(data.error || "提交失败");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "提交失败",
        description: error instanceof Error ? error.message : "请稍后重试",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">题目不存在</p>
        <Button asChild className="mt-4">
          <Link href="/problem">返回题库</Link>
        </Button>
      </div>
    );
  }

  const difficultyInfo = getDifficultyLabel(problem.difficulty);

  return (
    <div className="h-[calc(100vh-8rem)]">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/problem">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold">{problem.title}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline">{problem.level} 级</Badge>
              <Badge variant="outline" className={difficultyInfo.color}>
                {difficultyInfo.label}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {problem.timeLimit}ms
              </span>
              <span className="text-sm text-muted-foreground flex items-center">
                <Cpu className="h-3 w-3 mr-1" />
                {problem.memoryLimit}MB
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleSubmit} disabled={submitting}>
            <Play className="h-4 w-4 mr-2" />
            运行
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                评测中...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                提交
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 主体内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100%-4rem)]">
        {/* 左侧：题目描述 + AI 对话 */}
        <Card className="flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-4">
              <TabsTrigger value="description">
                <FileText className="h-4 w-4 mr-2" />
                题目
              </TabsTrigger>
              <TabsTrigger value="chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                AI 帮助
              </TabsTrigger>
              {judgeResult && (
                <TabsTrigger value="result">
                  {judgeResult.status === "accepted" ? (
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                  )}
                  结果
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="description" className="flex-1 overflow-auto p-4">
              <div className="prose prose-sm max-w-none">
                <h3>题目描述</h3>
                <div className="whitespace-pre-wrap">{problem.description}</div>

                {problem.inputFormat && (
                  <>
                    <h3>输入格式</h3>
                    <div className="whitespace-pre-wrap">{problem.inputFormat}</div>
                  </>
                )}

                {problem.outputFormat && (
                  <>
                    <h3>输出格式</h3>
                    <div className="whitespace-pre-wrap">{problem.outputFormat}</div>
                  </>
                )}

                <h3>样例</h3>
                {problem.samples.map((sample, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 my-4">
                    <div>
                      <p className="font-medium text-sm mb-1">输入 #{index + 1}</p>
                      <pre className="bg-gray-100 p-2 rounded text-sm">
                        {sample.input}
                      </pre>
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-1">输出 #{index + 1}</p>
                      <pre className="bg-gray-100 p-2 rounded text-sm">
                        {sample.output}
                      </pre>
                    </div>
                    {sample.explanation && (
                      <div className="col-span-2 text-sm text-muted-foreground">
                        说明：{sample.explanation}
                      </div>
                    )}
                  </div>
                ))}

                {problem.hint && (
                  <>
                    <h3>提示</h3>
                    <div className="whitespace-pre-wrap text-muted-foreground">
                      {problem.hint}
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="chat" className="flex-1 overflow-hidden p-0">
              <ChatInterface
                context="problem"
                problemId={id}
                placeholder="问我关于这道题的问题..."
              />
            </TabsContent>

            {judgeResult && (
              <TabsContent value="result" className="flex-1 overflow-auto p-4">
                <div className="space-y-4">
                  {/* 总体结果 */}
                  <div
                    className={`p-4 rounded-lg ${
                      judgeResult.status === "accepted"
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {judgeResult.status === "accepted" ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-500" />
                        )}
                        <span className="font-bold text-lg">
                          {getJudgeStatusLabel(judgeResult.status).label}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{judgeResult.score}/100</p>
                        {judgeResult.xpEarned && (
                          <p className="text-sm text-green-600">+{judgeResult.xpEarned} XP</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* AI帮助按钮 - 仅在错误时显示 */}
                  {judgeResult.status !== "accepted" && (
                    <Button
                      onClick={handleAIHelp}
                      disabled={aiLoading}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      {aiLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          AI分析中...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          💡 AI帮我看看
                          {aiHelpCount > 0 && ` (已帮助${aiHelpCount}次)`}
                        </>
                      )}
                    </Button>
                  )}

                  {/* 测试点详情 */}
                  <h4 className="font-medium">测试点详情</h4>
                  <div className="space-y-2">
                    {judgeResult.testResults.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          result.passed
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {result.passed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="font-medium">测试点 #{index + 1}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            {result.time !== null && (
                              <span>{result.time.toFixed(0)}ms</span>
                            )}
                            {result.memory !== null && (
                              <span>{(result.memory / 1024).toFixed(1)}MB</span>
                            )}
                          </div>
                        </div>

                        {!result.passed && (
                          <div className="mt-2 text-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-muted-foreground">期望输出</p>
                                <pre className="bg-white p-2 rounded text-xs mt-1 overflow-x-auto">
                                  {result.expectedOutput}
                                </pre>
                              </div>
                              <div>
                                <p className="text-muted-foreground">实际输出</p>
                                <pre className="bg-white p-2 rounded text-xs mt-1 overflow-x-auto">
                                  {result.actualOutput || "(空)"}
                                </pre>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </Card>

        {/* 右侧：代码编辑器 */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="flex-shrink-0 pb-2">
            <CardTitle className="text-base">代码编辑器</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <CodeEditor
              value={code}
              onChange={setCode}
              language="cpp"
            />
          </CardContent>
        </Card>
      </div>

      {/* AI调试助手侧边栏 */}
      <AIDebugDrawer
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        submissionId={judgeResult?.id || ""}
        conversations={aiConversations}
        isLoading={aiLoading}
        onRequestHelp={handleAIHelp}
        helpCount={aiHelpCount}
      />
    </div>
  );
}
