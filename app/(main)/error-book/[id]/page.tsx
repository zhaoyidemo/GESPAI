"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThreeQuestions, ErrorTypeInfo } from "@/components/error-case";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Code, FileText, Sparkles, CheckCircle, XCircle } from "lucide-react";

interface TestResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  time?: number;
  memory?: number;
}

interface ErrorCaseDetail {
  id: string;
  status: string;
  errorType: string | null;
  q1Answer: string | null;
  q2Answer: string | null;
  q3Answer: string | null;
  aiAnalysis: {
    type: string;
    confidence: number;
    evidence: string;
    summary: string;
  } | null;
  preventionRuleId: string | null;
  createdAt: string;
  problem: {
    id: string;
    title: string;
    level: number;
    difficulty: string;
    knowledgePoints: string[];
    description: string;
    inputFormat: string | null;
    outputFormat: string | null;
    samples: Array<{ input: string; output: string }>;
  };
  submission: {
    id: string;
    status: string;
    code: string;
    testResults: TestResult[] | null;
    compileOutput: string | null;
    errorMessage: string | null;
    createdAt: string;
  };
  preventionRule: {
    id: string;
    rule: string;
  } | null;
}

export default function ErrorCaseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();
  const { toast } = useToast();
  const [errorCase, setErrorCase] = useState<ErrorCaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchErrorCase();
  }, [id]);

  const fetchErrorCase = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/error-case/${id}`);
      const data = await response.json();

      if (response.ok) {
        setErrorCase(data.errorCase);
      } else {
        toast({
          title: "获取失败",
          description: data.error || "无法获取错题详情",
          variant: "destructive",
        });
        router.push("/error-book");
      }
    } catch (error) {
      console.error("Failed to fetch error case:", error);
      toast({
        title: "获取失败",
        description: "网络错误，请重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch(`/api/error-case/${id}/analyze`, {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok) {
        setErrorCase(data.errorCase);
        toast({
          title: "分析完成",
          description: `错误类型：${data.analysis?.summary || "已识别"}`,
        });
      } else {
        toast({
          title: "分析失败",
          description: data.error || "AI 分析出错",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to analyze:", error);
      toast({
        title: "分析失败",
        description: "网络错误，请重试",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleUpdate = async (data: {
    q1Answer?: string;
    q2Answer?: string;
    q3Answer?: string;
    status?: string;
  }) => {
    try {
      const response = await fetch(`/api/error-case/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (response.ok) {
        setErrorCase(result.errorCase);
        toast({
          title: "保存成功",
          description: "回答已保存",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Failed to update:", error);
      toast({
        title: "保存失败",
        description: "请重试",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleGetHint = async (
    questionNumber: number,
    currentAnswer?: string
  ): Promise<string> => {
    try {
      const response = await fetch(`/api/error-case/${id}/hint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionNumber, currentAnswer }),
      });
      const data = await response.json();

      if (response.ok) {
        return data.hint;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Failed to get hint:", error);
      toast({
        title: "获取提示失败",
        description: "请重试",
        variant: "destructive",
      });
      return "抱歉，暂时无法获取提示，请稍后重试。";
    }
  };

  const handleGenerateRule = async () => {
    try {
      const response = await fetch("/api/prevention-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          errorCaseId: id,
          errorType: errorCase?.errorType || "implementation",
          autoGenerate: true,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        toast({
          title: "规则已生成",
          description: data.preventionRule.rule,
        });
        fetchErrorCase(); // 刷新数据
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Failed to generate rule:", error);
      toast({
        title: "生成失败",
        description: "请重试",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!errorCase) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">错题记录不存在</p>
        <Link href="/error-book">
          <Button variant="link">返回错题本</Button>
        </Link>
      </div>
    );
  }

  const { problem, submission } = errorCase;
  const testResults = submission.testResults || [];
  const failedTests = testResults.filter((t) => !t.passed);
  const passedTests = testResults.filter((t) => t.passed);

  return (
    <div className="space-y-6">
      {/* 顶部导航 */}
      <div className="flex items-center gap-4">
        <Link href="/error-book">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回错题本
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold line-clamp-1">{problem.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">Lv.{problem.level}</Badge>
            <Badge variant="outline">{problem.difficulty}</Badge>
            <Badge
              variant={
                errorCase.status === "completed"
                  ? "default"
                  : errorCase.status === "in_progress"
                  ? "secondary"
                  : "outline"
              }
            >
              {errorCase.status === "completed"
                ? "已完成"
                : errorCase.status === "in_progress"
                ? "复盘中"
                : "待复盘"}
            </Badge>
          </div>
        </div>
      </div>

      {/* 错误类型分析 */}
      {!errorCase.errorType ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Sparkles className="h-12 w-12 mx-auto text-primary" />
              <div>
                <h3 className="font-semibold">AI 错误分析</h3>
                <p className="text-sm text-muted-foreground">
                  让 AI 帮你分析这次错误的类型
                </p>
              </div>
              <Button onClick={handleAnalyze} disabled={analyzing}>
                {analyzing ? "分析中..." : "开始分析"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <ErrorTypeInfo type={errorCase.errorType} />
      )}

      {/* 主要内容区 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 左侧：题目和代码 */}
        <div className="space-y-4">
          <Tabs defaultValue="code">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="code">
                <Code className="h-4 w-4 mr-2" />
                代码
              </TabsTrigger>
              <TabsTrigger value="problem">
                <FileText className="h-4 w-4 mr-2" />
                题目
              </TabsTrigger>
              <TabsTrigger value="results">
                测试结果
              </TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span>提交代码</span>
                    <Badge variant="destructive">{submission.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <pre className="text-sm font-mono bg-muted p-4 rounded-lg overflow-x-auto">
                      <code>{submission.code}</code>
                    </pre>
                  </ScrollArea>
                  {submission.compileOutput && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm font-medium text-red-800 mb-1">
                        编译错误
                      </p>
                      <pre className="text-xs text-red-700 whitespace-pre-wrap">
                        {submission.compileOutput}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="problem" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">题目描述</h4>
                        <div className="text-sm whitespace-pre-wrap">
                          {problem.description}
                        </div>
                      </div>
                      {problem.inputFormat && (
                        <div>
                          <h4 className="font-medium mb-2">输入格式</h4>
                          <div className="text-sm whitespace-pre-wrap">
                            {problem.inputFormat}
                          </div>
                        </div>
                      )}
                      {problem.outputFormat && (
                        <div>
                          <h4 className="font-medium mb-2">输出格式</h4>
                          <div className="text-sm whitespace-pre-wrap">
                            {problem.outputFormat}
                          </div>
                        </div>
                      )}
                      {problem.samples.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">样例</h4>
                          {problem.samples.map((sample, i) => (
                            <div
                              key={i}
                              className="grid grid-cols-2 gap-4 mb-2"
                            >
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  输入
                                </p>
                                <pre className="text-sm bg-muted p-2 rounded">
                                  {sample.input}
                                </pre>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  输出
                                </p>
                                <pre className="text-sm bg-muted p-2 rounded">
                                  {sample.output}
                                </pre>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    测试结果
                    <Badge variant="outline">
                      {passedTests.length}/{testResults.length} 通过
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {testResults.map((test, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg border ${
                            test.passed
                              ? "bg-green-50 border-green-200"
                              : "bg-red-50 border-red-200"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {test.passed ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="font-medium text-sm">
                              测试点 #{i + 1}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                            <div>
                              <p className="text-muted-foreground mb-1">输入</p>
                              <pre className="bg-white p-2 rounded border overflow-x-auto">
                                {test.input}
                              </pre>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">
                                预期输出
                              </p>
                              <pre className="bg-white p-2 rounded border overflow-x-auto">
                                {test.expectedOutput}
                              </pre>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">
                                实际输出
                              </p>
                              <pre
                                className={`p-2 rounded border overflow-x-auto ${
                                  test.passed ? "bg-white" : "bg-red-100"
                                }`}
                              >
                                {test.actualOutput || "(无输出)"}
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))}
                      {testResults.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          暂无测试结果数据
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* 右侧：三问 */}
        <div>
          <ThreeQuestions
            errorCaseId={errorCase.id}
            q1Answer={errorCase.q1Answer}
            q2Answer={errorCase.q2Answer}
            q3Answer={errorCase.q3Answer}
            status={errorCase.status}
            onUpdate={handleUpdate}
            onGetHint={handleGetHint}
            onGenerateRule={handleGenerateRule}
          />

          {/* 已生成的防错规则 */}
          {errorCase.preventionRule && (
            <Card className="mt-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  🛡️ 防错规则
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{errorCase.preventionRule.rule}</p>
                <Link
                  href="/error-book/rules"
                  className="text-xs text-primary hover:underline mt-2 inline-block"
                >
                  查看所有规则 →
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
