"use client";

import { useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatInterface } from "@/components/chat/chat-interface";
import { CodeEditor } from "@/components/editor/code-editor";
import { useToast } from "@/components/ui/use-toast";
import { AIDebugDrawer } from "@/components/ai-debug-drawer";
import {
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  FileText,
  ClipboardCheck,
  History,
  Play,
} from "lucide-react";
import Link from "next/link";
import { PreventionRuleAlert } from "@/components/prevention-rule-alert";
import { ProblemHeader } from "@/components/problem/problem-header";
import { ProblemDescription } from "@/components/problem/problem-description";
import { JudgeResultPanel } from "@/components/problem/judge-result-panel";
import { SubmissionHistory } from "@/components/problem/submission-history";

import { useProblemStore } from "@/stores/problem-store";
import { useAIDebugStore } from "@/stores/ai-debug-store";
import { usePreventionStore } from "@/stores/prevention-store";
import { useProblemActions } from "@/hooks/use-problem-actions";

export default function ProblemPage() {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  // Stores
  const {
    problem,
    code,
    loading,
    submitting,
    running,
    judgeResult,
    runResult,
    activeResultType,
    submissions,
    runHistory,
    selectedSubmission,
    activeTab,
    recordingError,
    setProblem,
    setCode,
    setLoading,
    setActiveResultType,
    setSelectedSubmission,
    setActiveTab,
  } = useProblemStore();

  const aiDebug = useAIDebugStore();
  const prevention = usePreventionStore();

  // Actions
  const {
    fetchSubmissions,
    fetchRunHistory,
    handleRun,
    handleSubmit,
    handleConfirmSubmit,
    handleCancelSubmit,
    handleAIHelp,
    handleSendDebugMessage,
    handleRecordError,
  } = useProblemActions(id);

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
  }, [id, toast, setProblem, setCode, setLoading]);

  useEffect(() => {
    // Reset stores on mount
    useProblemStore.getState().reset();
    useAIDebugStore.getState().reset();
    usePreventionStore.getState().reset();
    fetchProblem();
  }, [fetchProblem]);

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

  return (
    <div className="h-full flex flex-col">
      {/* 顶部导航 + 进度条 */}
      <ProblemHeader
        problem={problem}
        running={running}
        submitting={submitting}
        onRun={handleRun}
        onSubmit={handleSubmit}
      />

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
              <TabsTrigger value="run-history" onClick={() => fetchRunHistory()}>
                <Play className="h-4 w-4 mr-2" />
                运行记录
              </TabsTrigger>
              <TabsTrigger value="history" onClick={() => fetchSubmissions()}>
                <History className="h-4 w-4 mr-2" />
                提交历史
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="flex-1 overflow-auto p-4">
              <ProblemDescription problem={problem} />
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
                <JudgeResultPanel
                  judgeResult={judgeResult}
                  runResult={runResult}
                  activeResultType={activeResultType}
                  onSetActiveResultType={setActiveResultType}
                  onAIHelp={handleAIHelp}
                  onRecordError={handleRecordError}
                  aiLoading={aiDebug.loading}
                  helpCount={aiDebug.helpCount}
                  recordingError={recordingError}
                  problemTitle={problem?.title}
                />
              </TabsContent>
            )}

            <TabsContent value="run-history" className="flex-1 overflow-auto p-4">
              <SubmissionHistory
                submissions={runHistory}
                selectedSubmission={selectedSubmission}
                onSelectSubmission={setSelectedSubmission}
                mode="run"
              />
            </TabsContent>

            <TabsContent value="history" className="flex-1 overflow-auto p-4">
              <SubmissionHistory
                submissions={submissions}
                selectedSubmission={selectedSubmission}
                onSelectSubmission={setSelectedSubmission}
                onRecordError={handleRecordError}
                recordingError={recordingError}
              />
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
        isOpen={aiDebug.drawerOpen}
        onClose={() => aiDebug.setDrawerOpen(false)}
        submissionId={judgeResult?.id || ""}
        conversations={aiDebug.conversations}
        isLoading={aiDebug.loading}
        onRequestHelp={handleAIHelp}
        onSendMessage={handleSendDebugMessage}
        helpCount={aiDebug.helpCount}
      />

      {/* 防错规则提醒对话框 */}
      <PreventionRuleAlert
        open={prevention.alertOpen}
        onOpenChange={prevention.setAlertOpen}
        triggeredRules={prevention.triggeredRules}
        warnings={prevention.warnings}
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
      />

    </div>
  );
}
