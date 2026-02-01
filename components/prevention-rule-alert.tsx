"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, CheckCircle2 } from "lucide-react";
import { ERROR_TYPE_CONFIG } from "@/components/error-case";

interface TriggeredRule {
  id: string;
  errorType: string;
  rule: string;
  hitCount: number;
}

interface Warning {
  ruleIndex: number;
  issue: string;
  suggestion: string;
  rule: string;
}

interface PreventionRuleAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggeredRules: TriggeredRule[];
  warnings: Warning[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function PreventionRuleAlert({
  open,
  onOpenChange,
  triggeredRules,
  warnings,
  onConfirm,
  onCancel,
}: PreventionRuleAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
            检测到可能的错误风险
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 text-left">
              <p className="text-sm text-muted-foreground">
                根据你之前的错题记录，AI 检测到你的代码可能存在以下问题：
              </p>

              {/* 触发的规则列表 */}
              <div className="space-y-3">
                {triggeredRules.map((rule) => {
                  const typeConfig =
                    ERROR_TYPE_CONFIG[
                      rule.errorType as keyof typeof ERROR_TYPE_CONFIG
                    ];
                  return (
                    <div
                      key={rule.id}
                      className="p-3 bg-orange-50 border border-orange-200 rounded-lg"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-orange-600" />
                        <Badge variant="outline" className="text-xs">
                          {typeConfig?.emoji || "❓"} {typeConfig?.label || rule.errorType}
                        </Badge>
                        {rule.hitCount > 1 && (
                          <span className="text-xs text-orange-600">
                            已触发 {rule.hitCount} 次
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-orange-800">
                        {rule.rule}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* 具体问题和建议 */}
              {warnings.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    具体问题：
                  </p>
                  {warnings.map((warning, index) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-50 border rounded text-sm"
                    >
                      <p className="text-gray-700">{warning.issue}</p>
                      {warning.suggestion && (
                        <p className="text-xs text-muted-foreground mt-1">
                          建议：{warning.suggestion}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                  请检查上述问题后再提交。如果你确认代码没问题，可以继续提交。
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            返回修改
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-orange-600 hover:bg-orange-700"
          >
            已检查，继续提交
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
