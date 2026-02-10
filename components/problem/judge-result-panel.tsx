"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Sparkles, BookX } from "lucide-react";
import { getJudgeStatusLabel } from "@/lib/utils";
import type { JudgeResult } from "@/stores/problem-store";

interface JudgeResultPanelProps {
  judgeResult: JudgeResult | null;
  runResult: JudgeResult | null;
  activeResultType: "run" | "submit";
  onSetActiveResultType: (type: "run" | "submit") => void;
  onAIHelp: () => void;
  onRecordError: (submissionId: string) => void;
  aiLoading: boolean;
  helpCount: number;
  recordingError: boolean;
}

export function JudgeResultPanel({
  judgeResult,
  runResult,
  activeResultType,
  onSetActiveResultType,
  onAIHelp,
  onRecordError,
  aiLoading,
  helpCount,
  recordingError,
}: JudgeResultPanelProps) {
  const currentResult = activeResultType === "run" ? runResult : judgeResult;
  const isRunMode = activeResultType === "run";

  if (!currentResult) return null;

  return (
    <div className="space-y-4">
      {/* 运行/提交结果切换 */}
      {runResult && judgeResult && (
        <div className="flex gap-2 mb-4">
          <Button
            variant={activeResultType === "run" ? "default" : "outline"}
            size="sm"
            onClick={() => onSetActiveResultType("run")}
          >
            样例运行结果
          </Button>
          <Button
            variant={activeResultType === "submit" ? "default" : "outline"}
            size="sm"
            onClick={() => onSetActiveResultType("submit")}
          >
            提交结果
          </Button>
        </div>
      )}

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

      {/* AI帮助按钮和错题记录按钮 */}
      {!isRunMode && currentResult.status !== "accepted" && currentResult.id && (
        <div className="flex gap-2">
          <Button
            onClick={onAIHelp}
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
                {helpCount > 0 && ` (${helpCount})`}
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => onRecordError(currentResult.id!)}
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
}
