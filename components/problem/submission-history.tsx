"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, BookX } from "lucide-react";
import { CodeEditor } from "@/components/editor/code-editor";
import { getJudgeStatusLabel } from "@/lib/utils";
import type { SubmissionRecord } from "@/stores/problem-store";

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

interface SubmissionHistoryProps {
  submissions: SubmissionRecord[];
  selectedSubmission: SubmissionRecord | null;
  onSelectSubmission: (sub: SubmissionRecord | null) => void;
  onRecordError: (submissionId: string) => void;
  recordingError: boolean;
}

export function SubmissionHistory({
  submissions,
  selectedSubmission,
  onSelectSubmission,
  onRecordError,
  recordingError,
}: SubmissionHistoryProps) {
  if (submissions.length === 0) {
    return <p className="text-center text-muted-foreground py-8">暂无提交记录</p>;
  }

  return (
    <div className="space-y-3">
      {submissions.map((sub) => (
        <div
          key={sub.id}
          className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
            selectedSubmission?.id === sub.id ? "border-primary bg-muted/30" : ""
          }`}
          onClick={() =>
            onSelectSubmission(selectedSubmission?.id === sub.id ? null : sub)
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
              {/* 错题操作按钮 */}
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
                        await onRecordError(sub.id);
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
      ))}
    </div>
  );
}
