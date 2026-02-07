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
  ClipboardCheck,
  BookX,
  History,
} from "lucide-react";
import Link from "next/link";
import { getDifficultyLabel, getJudgeStatusLabel } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { PreventionRuleAlert } from "@/components/prevention-rule-alert";

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
  id?: string;
  status: string;
  score: number;
  testResults: TestResult[];
  xpEarned?: number;
}

interface SubmissionRecord {
  id: string;
  status: string;
  score: number;
  language: string;
  code: string;
  testResults: TestResult[] | null;
  createdAt: string;
  problem: { id: string; title: string };
  errorCase: { id: string } | null;
}

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "刚刚";
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`;
  return new Date(dateStr).toLocaleDateString("zh-CN");
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
  const [running, setRunning] = useState(false);
  const [judgeResult, setJudgeResult] = useState<JudgeResult | null>(null);
  const [runResult, setRunResult] = useState<JudgeResult | null>(null);
  const [activeResultType, setActiveResultType] = useState<"run" | "submit">("submit");
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionRecord | null>(null);
  const [activeTab, setActiveTab] = useState("description");

  // AI调试助手状态
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiConversations, setAiConversations] = useState<AIConversation[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiHelpCount, setAiHelpCount] = useState(0);

  // 错题记录状态
  const [recordingError, setRecordingError] = useState(false);

  // 防错规则检查状态
  const [ruleAlertOpen, setRuleAlertOpen] = useState(false);
  const [triggeredRules, setTriggeredRules] = useState<Array<{
    id: string;
    errorType: string;
    rule: string;
    hitCount: number;
  }>>([]);
  const [ruleWarnings, setRuleWarnings] = useState<Array<{
    ruleIndex: number;
    issue: string;
    suggestion: string;
    rule: string;
  }>>([]);
  const [skipRuleCheck, setSkipRuleCheck] = useState(false);

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

  const fetchSubmissions = useCallback(async () => {
    try {
      const response = await fetch(`/api/judge?problemId=${id}&limit=20`);
      const data = await response.json();
      if (response.ok) {
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error("Fetch submissions error:", error);
    }
  }, [id]);

  const handleRun = async () => {
    if (!code.trim()) {
      toast({
        variant: "destructive",
        title: "运行失败",
        description: "代码不能为空",
      });
      return;
    }

    setRunning(true);
    setRunResult(null);

    try {
      const response = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: id,
          code,
          language: "cpp",
          mode: "run",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRunResult(data);
        setActiveResultType("run");
        setActiveTab("result");

        if (data.status === "accepted") {
          toast({
            title: "样例测试通过！",
            description: "所有样例均通过，可以尝试提交",
          });
        } else {
          toast({
            variant: "destructive",
            title: "样例测试未通过",
            description: `得分：${data.score}/100`,
          });
        }
      } else {
        throw new Error(data.error || "运行失败");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "运行失败",
        description: error instanceof Error ? error.message : "请稍后重试",
      });
    } finally {
      setRunning(false);
    }
  };

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
          role: "ai",
          content: data.aiResponse,
          promptLevel: data.promptLevel,
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

  // AI调试助手 - 自由对话
  const handleSendDebugMessage = async (message: string) => {
    if (!judgeResult?.id) return;

    // 先把用户消息加入对话列表
    const userConv: AIConversation = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };
    setAiConversations((prev) => [...prev, userConv]);

    try {
      const response = await fetch("/api/ai/debug-help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: judgeResult.id,
          userMessage: message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiConv: AIConversation = {
          role: "ai",
          content: data.aiResponse,
          timestamp: new Date().toISOString(),
        };
        setAiConversations((prev) => [...prev, aiConv]);
      } else {
        toast({
          variant: "destructive",
          title: "AI回复失败",
          description: data.error || "请稍后重试",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI回复失败",
        description: error instanceof Error ? error.message : "网络错误",
      });
    }
  };

  // 检查防错规则
  const checkPreventionRules = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/prevention-rules/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          problemId: id,
          problemDescription: problem?.description,
        }),
      });

      const data = await response.json();

      if (response.ok && data.triggered && data.triggeredRules?.length > 0) {
        setTriggeredRules(data.triggeredRules);
        setRuleWarnings(data.warnings || []);
        setRuleAlertOpen(true);
        return true; // 触发了规则
      }
    } catch (error) {
      console.error("Check prevention rules error:", error);
      // 检查失败不阻止提交
    }
    return false; // 没有触发规则
  };

  // 实际执行提交的函数
  const executeSubmit = async () => {
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
          mode: "submit",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setJudgeResult(data);
        setActiveResultType("submit");
        setActiveTab("result");
        fetchSubmissions();
        // 提交后重置跳过检查状态
        setSkipRuleCheck(false);

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

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast({
        variant: "destructive",
        title: "提交失败",
        description: "代码不能为空",
      });
      return;
    }

    // 如果已经确认过跳过检查，直接提交
    if (skipRuleCheck) {
      await executeSubmit();
      return;
    }

    // 先检查防错规则
    setSubmitting(true);
    const hasTriggeredRules = await checkPreventionRules();

    if (hasTriggeredRules) {
      // 触发了规则，显示对话框，等待用户确认
      setSubmitting(false);
      return;
    }

    // 没有触发规则，直接提交
    await executeSubmit();
  };

  // 用户确认继续提交
  const handleConfirmSubmit = async () => {
    setRuleAlertOpen(false);
    setSkipRuleCheck(true);
    await executeSubmit();
  };

  // 用户取消提交
  const handleCancelSubmit = () => {
    setRuleAlertOpen(false);
    setSubmitting(false);
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
    <div className="h-full flex flex-col">
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
          <Button variant="outline" onClick={handleRun} disabled={running || submitting}>
            {running ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                运行中...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                运行
              </>
            )}
          </Button>
          <Button onClick={handleSubmit} disabled={running || submitting}>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
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
              <TabsTrigger value="checklist">
                <ClipboardCheck className="h-4 w-4 mr-2" />
                检查清单
              </TabsTrigger>
              {(judgeResult || runResult) && (
                <TabsTrigger value="result">
                  {(activeResultType === "submit" ? judgeResult?.status : runResult?.status) === "accepted" ? (
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                  )}
                  结果
                </TabsTrigger>
              )}
              <TabsTrigger value="history" onClick={() => fetchSubmissions()}>
                <History className="h-4 w-4 mr-2" />
                提交历史
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="flex-1 overflow-auto p-4">
              <div className="space-y-6">
                {/* 题目描述 */}
                <section>
                  <h3 className="text-base font-bold mb-3 pb-1 border-b">题目描述</h3>
                  <MarkdownRenderer content={problem.description} />
                </section>

                {/* 输入格式 */}
                {problem.inputFormat && (
                  <section>
                    <h3 className="text-base font-bold mb-3 pb-1 border-b">输入格式</h3>
                    <MarkdownRenderer content={problem.inputFormat} />
                  </section>
                )}

                {/* 输出格式 */}
                {problem.outputFormat && (
                  <section>
                    <h3 className="text-base font-bold mb-3 pb-1 border-b">输出格式</h3>
                    <MarkdownRenderer content={problem.outputFormat} />
                  </section>
                )}

                {/* 样例 */}
                <section>
                  <h3 className="text-base font-bold mb-3 pb-1 border-b">样例</h3>
                  {problem.samples.map((sample, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 my-4">
                      <div>
                        <p className="font-medium text-sm mb-1">输入 #{index + 1}</p>
                        <pre className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
                          {sample.input}
                        </pre>
                      </div>
                      <div>
                        <p className="font-medium text-sm mb-1">输出 #{index + 1}</p>
                        <pre className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
                          {sample.output}
                        </pre>
                      </div>
                    </div>
                  ))}
                </section>

                {/* 提示 */}
                {problem.hint && (
                  <section>
                    <h3 className="text-base font-bold mb-3 pb-1 border-b">提示</h3>
                    <MarkdownRenderer content={problem.hint} />
                  </section>
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

            <TabsContent value="checklist" className="flex-1 overflow-auto p-4">
              <div className="prose prose-sm max-w-none">
                <h3 className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  提交前 60 秒检查清单
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  每道编程题提交前过一遍，避免低级错误
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-5 h-5 rounded bg-blue-100 text-blue-600 text-center text-sm font-medium flex-shrink-0">1</span>
                    <span><strong>输出格式</strong>：空格/换行/小数位是否正确？</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-5 h-5 rounded bg-blue-100 text-blue-600 text-center text-sm font-medium flex-shrink-0">2</span>
                    <span><strong>变量初始化</strong>：是否所有变量都已正确初始化？</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-5 h-5 rounded bg-blue-100 text-blue-600 text-center text-sm font-medium flex-shrink-0">3</span>
                    <span><strong>越界检查</strong>：数组、字符串、vector 下标是否可能越界？</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-5 h-5 rounded bg-blue-100 text-blue-600 text-center text-sm font-medium flex-shrink-0">4</span>
                    <span><strong>除零错误</strong>：是否可能出现除以 0 或取模 0 的情况？</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-5 h-5 rounded bg-blue-100 text-blue-600 text-center text-sm font-medium flex-shrink-0">5</span>
                    <span><strong>整数溢出</strong>：int 是否会溢出？是否需要用 long long？</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-5 h-5 rounded bg-blue-100 text-blue-600 text-center text-sm font-medium flex-shrink-0">6</span>
                    <span><strong>复杂度匹配</strong>：算法复杂度是否与数据范围匹配？</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-5 h-5 rounded bg-blue-100 text-blue-600 text-center text-sm font-medium flex-shrink-0">7</span>
                    <span><strong>边界测试</strong>：最小值/最大值/空值/重复值这四类边界是否已在脑中过了一遍？</span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            {(judgeResult || runResult) && (
              <TabsContent value="result" className="flex-1 overflow-auto p-4">
                {/* 运行/提交结果切换 */}
                {runResult && judgeResult && (
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant={activeResultType === "run" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveResultType("run")}
                    >
                      样例运行结果
                    </Button>
                    <Button
                      variant={activeResultType === "submit" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveResultType("submit")}
                    >
                      提交结果
                    </Button>
                  </div>
                )}

                {(() => {
                  const currentResult = activeResultType === "run" ? runResult : judgeResult;
                  const isRunMode = activeResultType === "run";
                  if (!currentResult) return null;

                  return (
                    <div className="space-y-4">
                      {/* 标题 */}
                      <h4 className="font-medium text-sm text-muted-foreground">
                        {isRunMode ? "样例运行结果" : "提交结果"}
                      </h4>

                      {/* 总体结果 */}
                      <div
                        className={`p-4 rounded-lg ${
                          currentResult.status === "accepted"
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {currentResult.status === "accepted" ? (
                              <CheckCircle className="h-6 w-6 text-green-500" />
                            ) : (
                              <XCircle className="h-6 w-6 text-red-500" />
                            )}
                            <span className="font-bold text-lg">
                              {getJudgeStatusLabel(currentResult.status).label}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">{currentResult.score}/100</p>
                            {currentResult.xpEarned && (
                              <p className="text-sm text-green-600">+{currentResult.xpEarned} XP</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* AI帮助按钮和错题记录按钮 - 仅在提交结果且错误时显示 */}
                      {!isRunMode && currentResult.status !== "accepted" && currentResult.id && (
                        <div className="flex gap-2">
                          <Button
                            onClick={handleAIHelp}
                            disabled={aiLoading}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                          >
                            {aiLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                AI分析中...
                              </>
                            ) : (
                              <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                AI帮我看看
                                {aiHelpCount > 0 && ` (${aiHelpCount})`}
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={async () => {
                              setRecordingError(true);
                              try {
                                const response = await fetch("/api/error-case", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ submissionId: currentResult.id }),
                                });
                                const data = await response.json();
                                if (response.ok) {
                                  toast({
                                    title: "已记录到错题本",
                                    description: "可以去错题本进行复盘",
                                  });
                                  window.location.href = `/error-book/${data.errorCase.id}`;
                                } else {
                                  toast({
                                    variant: "destructive",
                                    title: "记录失败",
                                    description: data.error || "请重试",
                                  });
                                }
                              } catch (error) {
                                toast({
                                  variant: "destructive",
                                  title: "记录失败",
                                  description: "网络错误",
                                });
                              } finally {
                                setRecordingError(false);
                              }
                            }}
                            disabled={recordingError}
                          >
                            <BookX className="mr-2 h-4 w-4" />
                            {recordingError ? "记录中..." : "记录错题"}
                          </Button>
                        </div>
                      )}

                      {/* 测试点详情 */}
                      <h4 className="font-medium">测试点详情</h4>
                      <div className="space-y-2">
                        {currentResult.testResults.map((result, index) => (
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
                                <span className="font-medium">
                                  {isRunMode ? "样例" : "测试点"} #{index + 1}
                                </span>
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
                  );
                })()}
              </TabsContent>
            )}

            <TabsContent value="history" className="flex-1 overflow-auto p-4">
              <div className="space-y-3">
                {submissions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">暂无提交记录</p>
                ) : (
                  submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedSubmission?.id === sub.id ? "border-primary bg-muted/30" : ""
                      }`}
                      onClick={() =>
                        setSelectedSubmission(
                          selectedSubmission?.id === sub.id ? null : sub
                        )
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {sub.status === "accepted" ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <Badge
                            variant={sub.status === "accepted" ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {getJudgeStatusLabel(sub.status).label}
                          </Badge>
                          <span className="font-medium text-sm">{sub.score}/100</span>
                          {sub.errorCase && (
                            <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                              <BookX className="h-3 w-3 mr-1" />
                              已记错题
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(sub.createdAt)}
                        </span>
                      </div>

                      {/* 展开详情 */}
                      {selectedSubmission?.id === sub.id && (
                        <div className="mt-3 space-y-3">
                          {/* 错题操作按钮 - 仅非 AC 提交显示 */}
                          {sub.status !== "accepted" && (
                            <div>
                              {sub.errorCase ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full text-orange-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.location.href = `/error-book/${sub.errorCase!.id}`;
                                  }}
                                >
                                  <BookX className="mr-2 h-4 w-4" />
                                  查看错题复盘
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  disabled={recordingError}
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    setRecordingError(true);
                                    try {
                                      const response = await fetch("/api/error-case", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ submissionId: sub.id }),
                                      });
                                      const data = await response.json();
                                      if (response.ok) {
                                        toast({
                                          title: "已记录到错题本",
                                          description: "可以去错题本进行复盘",
                                        });
                                        fetchSubmissions();
                                        window.location.href = `/error-book/${data.errorCase.id}`;
                                      } else {
                                        toast({
                                          variant: "destructive",
                                          title: "记录失败",
                                          description: data.error || "请重试",
                                        });
                                      }
                                    } catch {
                                      toast({
                                        variant: "destructive",
                                        title: "记录失败",
                                        description: "网络错误",
                                      });
                                    } finally {
                                      setRecordingError(false);
                                    }
                                  }}
                                >
                                  <BookX className="mr-2 h-4 w-4" />
                                  {recordingError ? "记录中..." : "记录错题"}
                                </Button>
                              )}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium mb-1">提交代码</p>
                            <div className="max-h-[200px] overflow-auto rounded border">
                              <CodeEditor
                                value={sub.code}
                                onChange={() => {}}
                                language={sub.language || "cpp"}
                                readOnly
                              />
                            </div>
                          </div>
                          {sub.testResults && sub.testResults.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-1">测试结果</p>
                              <div className="space-y-1">
                                {sub.testResults.map((tr, idx) => (
                                  <div
                                    key={idx}
                                    className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                                      tr.passed
                                        ? "bg-green-50 text-green-700"
                                        : "bg-red-50 text-red-700"
                                    }`}
                                  >
                                    {tr.passed ? (
                                      <CheckCircle className="h-3 w-3" />
                                    ) : (
                                      <XCircle className="h-3 w-3" />
                                    )}
                                    测试点 #{idx + 1}
                                    {tr.time !== null && ` · ${tr.time.toFixed(0)}ms`}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
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
        onSendMessage={handleSendDebugMessage}
        helpCount={aiHelpCount}
      />

      {/* 防错规则提醒对话框 */}
      <PreventionRuleAlert
        open={ruleAlertOpen}
        onOpenChange={setRuleAlertOpen}
        triggeredRules={triggeredRules}
        warnings={ruleWarnings}
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
      />
    </div>
  );
}
