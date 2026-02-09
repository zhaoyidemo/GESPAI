import { useCallback } from "react";
import { useProblemStore } from "@/stores/problem-store";
import { useAIDebugStore } from "@/stores/ai-debug-store";
import { usePreventionStore } from "@/stores/prevention-store";
import { useToast } from "@/components/ui/use-toast";
import { getJudgeStatusLabel } from "@/lib/utils";
import type { AIConversation } from "@/components/ai-debug-drawer";

export function useProblemActions(problemId: string) {
  const { toast } = useToast();

  const {
    code,
    problem,
    setRunning,
    setRunResult,
    setActiveResultType,
    setActiveTab,
    setSubmitting,
    setJudgeResult,
    setSubmissions,
    setRecordingError,
  } = useProblemStore();

  const aiDebug = useAIDebugStore();
  const prevention = usePreventionStore();

  const fetchSubmissions = useCallback(async () => {
    try {
      const response = await fetch(`/api/judge?problemId=${problemId}&limit=20`);
      const data = await response.json();
      if (response.ok) {
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error("Fetch submissions error:", error);
    }
  }, [problemId, setSubmissions]);

  const handleRun = useCallback(async () => {
    if (!code.trim()) {
      toast({ variant: "destructive", title: "运行失败", description: "代码不能为空" });
      return;
    }

    setRunning(true);
    setRunResult(null);

    try {
      const response = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId, code, language: "cpp", mode: "run" }),
      });

      const data = await response.json();

      if (response.ok) {
        setRunResult(data);
        setActiveResultType("run");
        setActiveTab("result");

        if (data.status === "accepted") {
          toast({ title: "样例测试通过！", description: "所有样例均通过，可以尝试提交" });
        } else {
          toast({ variant: "destructive", title: "样例测试未通过", description: `得分：${data.score}/100` });
        }
      } else {
        throw new Error(data.error || "运行失败");
      }
    } catch (error) {
      toast({ variant: "destructive", title: "运行失败", description: error instanceof Error ? error.message : "请稍后重试" });
    } finally {
      setRunning(false);
    }
  }, [code, problemId, setRunning, setRunResult, setActiveResultType, setActiveTab, toast]);

  const executeSubmit = useCallback(async () => {
    setSubmitting(true);
    setJudgeResult(null);
    aiDebug.reset();

    try {
      const response = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId, code, language: "cpp", mode: "submit" }),
      });

      const data = await response.json();

      if (response.ok) {
        setJudgeResult(data);
        setActiveResultType("submit");
        setActiveTab("result");
        fetchSubmissions();
        prevention.setSkipCheck(false);

        if (data.status === "accepted") {
          toast({ title: "通过！", description: `恭喜你！获得 ${data.xpEarned || 0} XP` });
        } else {
          const statusInfo = getJudgeStatusLabel(data.status);
          toast({ variant: "destructive", title: statusInfo.label, description: `得分：${data.score}/100` });
        }
      } else {
        throw new Error(data.error || "提交失败");
      }
    } catch (error) {
      toast({ variant: "destructive", title: "提交失败", description: error instanceof Error ? error.message : "请稍后重试" });
    } finally {
      setSubmitting(false);
    }
  }, [code, problemId, setSubmitting, setJudgeResult, setActiveResultType, setActiveTab, fetchSubmissions, prevention, aiDebug, toast]);

  const checkPreventionRules = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/prevention-rules/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, problemId, problemDescription: problem?.description }),
      });

      const data = await response.json();

      if (response.ok && data.triggered && data.triggeredRules?.length > 0) {
        prevention.setTriggeredRules(data.triggeredRules);
        prevention.setWarnings(data.warnings || []);
        prevention.setAlertOpen(true);
        return true;
      }
    } catch (error) {
      console.error("Check prevention rules error:", error);
    }
    return false;
  }, [code, problemId, problem?.description, prevention]);

  const handleSubmit = useCallback(async () => {
    if (!code.trim()) {
      toast({ variant: "destructive", title: "提交失败", description: "代码不能为空" });
      return;
    }

    if (prevention.skipCheck) {
      await executeSubmit();
      return;
    }

    setSubmitting(true);
    const hasTriggeredRules = await checkPreventionRules();

    if (hasTriggeredRules) {
      setSubmitting(false);
      return;
    }

    await executeSubmit();
  }, [code, prevention.skipCheck, setSubmitting, checkPreventionRules, executeSubmit, toast]);

  const handleConfirmSubmit = useCallback(async () => {
    prevention.setAlertOpen(false);
    prevention.setSkipCheck(true);
    await executeSubmit();
  }, [prevention, executeSubmit]);

  const handleCancelSubmit = useCallback(() => {
    prevention.setAlertOpen(false);
    setSubmitting(false);
  }, [prevention, setSubmitting]);

  const handleAIHelp = useCallback(async () => {
    const judgeResult = useProblemStore.getState().judgeResult;
    if (!judgeResult?.id) {
      toast({ variant: "destructive", title: "无法请求帮助", description: "请先提交代码" });
      return;
    }

    aiDebug.setLoading(true);
    aiDebug.setDrawerOpen(true);

    try {
      const response = await fetch("/api/ai/debug-help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: judgeResult.id }),
      });

      const data = await response.json();

      if (response.ok) {
        const newConversation: AIConversation = {
          role: "ai",
          content: data.aiResponse,
          promptLevel: data.promptLevel,
          timestamp: new Date().toISOString(),
        };
        aiDebug.addConversation(newConversation);
        aiDebug.setHelpCount(data.helpCount);
        toast({ title: "AI分析完成", description: `第${data.helpCount}次提示` });
      } else {
        toast({ variant: "destructive", title: "AI分析失败", description: data.error || "请稍后重试" });
        aiDebug.setDrawerOpen(false);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "AI分析失败", description: error instanceof Error ? error.message : "网络错误" });
      aiDebug.setDrawerOpen(false);
    } finally {
      aiDebug.setLoading(false);
    }
  }, [aiDebug, toast]);

  const handleSendDebugMessage = useCallback(async (message: string) => {
    const judgeResult = useProblemStore.getState().judgeResult;
    if (!judgeResult?.id) return;

    const userConv: AIConversation = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };
    aiDebug.addConversation(userConv);

    try {
      const response = await fetch("/api/ai/debug-help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: judgeResult.id, userMessage: message }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiConv: AIConversation = {
          role: "ai",
          content: data.aiResponse,
          timestamp: new Date().toISOString(),
        };
        aiDebug.addConversation(aiConv);
      } else {
        toast({ variant: "destructive", title: "AI回复失败", description: data.error || "请稍后重试" });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "AI回复失败", description: error instanceof Error ? error.message : "网络错误" });
    }
  }, [aiDebug, toast]);

  const handleRecordError = useCallback(async (submissionId: string) => {
    setRecordingError(true);
    try {
      const response = await fetch("/api/error-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({ title: "已记录到错题本", description: "可以去错题本进行复盘" });
        fetchSubmissions();
      } else {
        toast({ variant: "destructive", title: "记录失败", description: data.error || "请重试" });
      }
    } catch {
      toast({ variant: "destructive", title: "记录失败", description: "网络错误" });
    } finally {
      setRecordingError(false);
    }
  }, [setRecordingError, fetchSubmissions, toast]);

  return {
    fetchSubmissions,
    handleRun,
    handleSubmit,
    handleConfirmSubmit,
    handleCancelSubmit,
    handleAIHelp,
    handleSendDebugMessage,
    handleRecordError,
    executeSubmit,
  };
}
