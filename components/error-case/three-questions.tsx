"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
              ✅ 已完成
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
            <Textarea
              placeholder="请写下你的思考..."
              value={answer || ""}
              onChange={(e) => onAnswerChange(e.target.value)}
              className="min-h-[100px]"
              disabled={isLoading}
            />
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
                ✅ 确认回答
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
              <Button onClick={onGenerateRule}>
                ✨ 生成防错规则
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
