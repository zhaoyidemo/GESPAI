"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { addPunctuation } from "@/lib/auto-punctuation";


// 音量指示器组件（自带定时器驱动流畅动画）
function VolumeIndicator({ volume }: { volume: number }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 75);
    return () => clearInterval(timer);
  }, []);

  const getHeight = (index: number) => {
    const base = 4;
    const maxExtra = 12;
    const phase = ((index * 0.3 + tick * 0.1) % 1);
    const wave = Math.sin(phase * Math.PI * 2) * 0.3 + 0.7;
    return base + volume * maxExtra * wave;
  };

  return (
    <span className="inline-flex items-center space-x-0.5 mx-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block w-1 bg-red-500 rounded-full transition-all duration-75"
          style={{ height: `${getHeight(i)}px` }}
        />
      ))}
    </span>
  );
}

interface ThreeQuestionsProps {
  errorCaseId: string;
  q1Answer?: string | null;
  q2Answer?: string | null;
  q3Answer?: string | null;
  status: string;
  onUpdate: (data: {
    q1Answer?: string;
    q2Answer?: string;
    q3Answer?: string;
    status?: string;
  }) => Promise<void>;
  onGetHint: (questionNumber: number, currentAnswer?: string) => Promise<string>;
  onGenerateRule: () => Promise<void>;
}

interface QuestionCardProps {
  number: 1 | 2 | 3;
  title: string;
  description: string;
  emoji: string;
  answer: string | null | undefined;
  isActive: boolean;
  isCompleted: boolean;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  onGetHint: () => void;
  isLoading: boolean;
  hint: string | null;
  // 语音相关
  isListening: boolean;
  speechSupported: boolean;
  volume: number;
  onMicToggle: () => void;
  voiceErrorDisplay: string | null;
}

function QuestionCard({
  number,
  title,
  description,
  emoji,
  answer,
  isActive,
  isCompleted,
  onAnswerChange,
  onSubmit,
  onGetHint,
  isLoading,
  hint,
  isListening,
  speechSupported,
  volume,
  onMicToggle,
  voiceErrorDisplay,
}: QuestionCardProps) {
  return (
    <Card
      className={cn(
        "transition-all duration-300",
        isActive && "ring-2 ring-primary shadow-lg",
        isCompleted && "bg-green-50 border-green-200",
        !isActive && !isCompleted && "opacity-60"
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-2xl">{emoji}</span>
          <span>第{number}问：{title}</span>
          {isCompleted && (
            <Badge variant="outline" className="ml-auto bg-green-100 text-green-700">
              已完成
            </Badge>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {isCompleted && answer ? (
          <div className="p-3 bg-card rounded-lg border">
            <p className="text-sm whitespace-pre-wrap">{answer}</p>
          </div>
        ) : isActive ? (
          <>
            <div className="relative">
              <Textarea
                placeholder={isListening ? "正在识别语音..." : "请写下你的思考..."}
                value={answer || ""}
                onChange={(e) => onAnswerChange(e.target.value)}
                className={cn(
                  "min-h-[100px] pr-10",
                  isListening && "border-red-400 ring-1 ring-red-400"
                )}
                disabled={isLoading}
              />
              {/* 麦克风按钮（嵌在 Textarea 右上角） */}
              {speechSupported && (
                <Button
                  type="button"
                  variant={isListening ? "destructive" : "ghost"}
                  size="icon"
                  onClick={onMicToggle}
                  disabled={isLoading}
                  className="absolute top-2 right-2 h-7 w-7"
                  title={isListening ? "停止录音" : "语音输入"}
                >
                  {isListening ? (
                    <MicOff className="h-3.5 w-3.5" />
                  ) : (
                    <Mic className="h-3.5 w-3.5" />
                  )}
                </Button>
              )}
            </div>
            {/* 录音指示器 */}
            {isListening && (
              <div className="flex items-center justify-center gap-1 text-sm text-red-500">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <VolumeIndicator volume={volume} />
                <span>正在录音，点击麦克风或松开空格键停止...</span>
              </div>
            )}
            {/* 语音错误提示 */}
            {voiceErrorDisplay && (
              <div className="text-xs text-red-500 animate-pulse">
                {voiceErrorDisplay}
              </div>
            )}
            {hint && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <span className="whitespace-pre-wrap">{hint}</span>
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onGetHint}
                disabled={isLoading}
              >
                {isLoading ? "🤔 思考中..." : "💡 给点提示"}
              </Button>
              <Button
                size="sm"
                onClick={onSubmit}
                disabled={!answer?.trim() || isLoading}
                className="ml-auto"
              >
                确认回答
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            请先完成上一问
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ThreeQuestions({
  errorCaseId,
  q1Answer,
  q2Answer,
  q3Answer,
  status,
  onUpdate,
  onGetHint,
  onGenerateRule,
}: ThreeQuestionsProps) {
  const [localQ1, setLocalQ1] = useState(q1Answer || "");
  const [localQ2, setLocalQ2] = useState(q2Answer || "");
  const [localQ3, setLocalQ3] = useState(q3Answer || "");
  const [hints, setHints] = useState<{
    q1: string | null;
    q2: string | null;
    q3: string | null;
  }>({ q1: null, q2: null, q3: null });
  const [loadingHint, setLoadingHint] = useState<1 | 2 | 3 | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 语音识别状态
  const [voiceErrorDisplay, setVoiceErrorDisplay] = useState<string | null>(null);
  const [activeVoiceQuestion, setActiveVoiceQuestion] = useState<1 | 2 | 3 | null>(null);
  const inputBeforeVoiceRef = useRef("");

  const {
    isListening,
    isSupported: speechSupported,
    transcript,
    error: voiceError,
    volume,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    lang: "zh-CN",
  });

  // 获取当前录音问题的 setter
  const getActiveAnswerSetter = useCallback(() => {
    switch (activeVoiceQuestion) {
      case 1: return setLocalQ1;
      case 2: return setLocalQ2;
      case 3: return setLocalQ3;
      default: return null;
    }
  }, [activeVoiceQuestion]);

  // 语音识别文本更新时，整体替换对应输入框
  useEffect(() => {
    if (isListening && transcript) {
      const setter = getActiveAnswerSetter();
      if (!setter) return;
      const prefix = inputBeforeVoiceRef.current;
      const text = prefix ? `${prefix} ${transcript}` : transcript;
      setter(addPunctuation(text, false));
    }
  }, [transcript, isListening, getActiveAnswerSetter]);

  // 语音错误 3 秒后自动消失
  useEffect(() => {
    if (voiceError) {
      setVoiceErrorDisplay(voiceError);
      const timer = setTimeout(() => setVoiceErrorDisplay(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [voiceError]);

  // 停止录音并添加结尾标点
  const handleStopListening = useCallback(() => {
    const setter = getActiveAnswerSetter();
    stopListening();
    setTimeout(() => {
      setter?.((prev: string) => {
        if (!prev.trim()) return prev;
        return addPunctuation(prev, true);
      });
    }, 100);
    setActiveVoiceQuestion(null);
  }, [stopListening, getActiveAnswerSetter]);

  // 切换麦克风（指定问题编号）
  const handleMicToggle = useCallback((questionNumber: 1 | 2 | 3) => {
    if (isListening && activeVoiceQuestion === questionNumber) {
      // 停止当前问题的录音
      handleStopListening();
    } else {
      // 如果在另一个问题上录音，先停止
      if (isListening) {
        stopListening();
      }
      // 开始新问题的录音
      const currentAnswer = questionNumber === 1 ? localQ1 : questionNumber === 2 ? localQ2 : localQ3;
      inputBeforeVoiceRef.current = currentAnswer.trim();
      setActiveVoiceQuestion(questionNumber);
      resetTranscript();
      startListening();
    }
  }, [isListening, activeVoiceQuestion, handleStopListening, stopListening, resetTranscript, startListening, localQ1, localQ2, localQ3]);

  // 计算当前活跃问题（空格键快捷录音需要用到，提前计算）
  const isQ1Completed = !!q1Answer;
  const isQ2Completed = !!q2Answer;
  const isQ3Completed = !!q3Answer;
  const allCompleted = isQ1Completed && isQ2Completed && isQ3Completed;

  const currentQuestion = isQ3Completed
    ? null
    : isQ2Completed
    ? 3
    : isQ1Completed
    ? 2
    : 1;

  // 空格键快捷录音：按住空格=录音，松开=停止（仅在 Textarea 未聚焦时生效）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "TEXTAREA") return;
      if (!currentQuestion || !speechSupported) return;
      if (loadingHint || submitting) return;

      if (e.code === "Space" && !e.repeat && !isListening) {
        e.preventDefault();
        const answer = currentQuestion === 1 ? localQ1 : currentQuestion === 2 ? localQ2 : localQ3;
        inputBeforeVoiceRef.current = answer.trim();
        setActiveVoiceQuestion(currentQuestion as 1 | 2 | 3);
        resetTranscript();
        startListening();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" && isListening) {
        e.preventDefault();
        handleStopListening();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [currentQuestion, speechSupported, isListening, loadingHint, submitting, localQ1, localQ2, localQ3, resetTranscript, startListening, handleStopListening]);

  const handleGetHint = async (questionNumber: 1 | 2 | 3) => {
    setLoadingHint(questionNumber);
    try {
      const currentAnswer =
        questionNumber === 1
          ? localQ1
          : questionNumber === 2
          ? localQ2
          : localQ3;
      const hint = await onGetHint(questionNumber, currentAnswer);
      setHints((prev) => ({
        ...prev,
        [`q${questionNumber}`]: hint,
      }));
    } catch (error) {
      console.error("Failed to get hint:", error);
    } finally {
      setLoadingHint(null);
    }
  };

  const handleSubmitAnswer = async (questionNumber: 1 | 2 | 3) => {
    // 提交前停止录音并清理语音状态
    if (isListening && activeVoiceQuestion === questionNumber) {
      stopListening();
      resetTranscript();
      setActiveVoiceQuestion(null);
    }
    inputBeforeVoiceRef.current = "";

    setSubmitting(true);
    try {
      const answer =
        questionNumber === 1
          ? localQ1
          : questionNumber === 2
          ? localQ2
          : localQ3;
      const updateData = {
        [`q${questionNumber}Answer`]: answer,
        status: questionNumber === 1 && status === "pending" ? "in_progress" : undefined,
      };
      await onUpdate(updateData);
      // 清除该问的提示
      setHints((prev) => ({
        ...prev,
        [`q${questionNumber}`]: null,
      }));
    } catch (error) {
      console.error("Failed to submit answer:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          📝 错题三问
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant={allCompleted ? "default" : "secondary"}>
            {isQ1Completed ? 1 : 0} + {isQ2Completed ? 1 : 0} + {isQ3Completed ? 1 : 0} / 3
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <QuestionCard
          number={1}
          title="这道题错了哪？"
          description="仔细看看代码，找出错误的位置和表现"
          emoji="🔍"
          answer={isQ1Completed ? q1Answer : localQ1}
          isActive={currentQuestion === 1}
          isCompleted={isQ1Completed}
          onAnswerChange={setLocalQ1}
          onSubmit={() => handleSubmitAnswer(1)}
          onGetHint={() => handleGetHint(1)}
          isLoading={loadingHint === 1 || submitting}
          hint={hints.q1}
          isListening={isListening && activeVoiceQuestion === 1}
          speechSupported={speechSupported}
          volume={volume}
          onMicToggle={() => handleMicToggle(1)}
          voiceErrorDisplay={activeVoiceQuestion === 1 ? voiceErrorDisplay : null}
        />

        <QuestionCard
          number={2}
          title="为什么会错？"
          description="分析错误的根本原因，是什么导致你这样写"
          emoji="🧠"
          answer={isQ2Completed ? q2Answer : localQ2}
          isActive={currentQuestion === 2}
          isCompleted={isQ2Completed}
          onAnswerChange={setLocalQ2}
          onSubmit={() => handleSubmitAnswer(2)}
          onGetHint={() => handleGetHint(2)}
          isLoading={loadingHint === 2 || submitting}
          hint={hints.q2}
          isListening={isListening && activeVoiceQuestion === 2}
          speechSupported={speechSupported}
          volume={volume}
          onMicToggle={() => handleMicToggle(2)}
          voiceErrorDisplay={activeVoiceQuestion === 2 ? voiceErrorDisplay : null}
        />

        <QuestionCard
          number={3}
          title="下次怎么避免？"
          description="总结一条防错规则，帮助你以后不再犯同样的错"
          emoji="🛡️"
          answer={isQ3Completed ? q3Answer : localQ3}
          isActive={currentQuestion === 3}
          isCompleted={isQ3Completed}
          onAnswerChange={setLocalQ3}
          onSubmit={() => handleSubmitAnswer(3)}
          onGetHint={() => handleGetHint(3)}
          isLoading={loadingHint === 3 || submitting}
          hint={hints.q3}
          isListening={isListening && activeVoiceQuestion === 3}
          speechSupported={speechSupported}
          volume={volume}
          onMicToggle={() => handleMicToggle(3)}
          voiceErrorDisplay={activeVoiceQuestion === 3 ? voiceErrorDisplay : null}
        />
      </div>

      {allCompleted && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-4xl">🎉</div>
              <h4 className="font-semibold text-lg">太棒了！你完成了错题三问</h4>
              <p className="text-sm text-muted-foreground">
                现在可以生成一条防错规则，帮助你以后避免类似错误
              </p>
              <div className="flex items-center gap-2 justify-center">
                <Button onClick={onGenerateRule}>
                  生成防错规则
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
