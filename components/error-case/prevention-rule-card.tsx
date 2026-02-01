"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ErrorTypeBadge } from "./error-type-badge";
import { cn } from "@/lib/utils";

interface PreventionRuleCardProps {
  rule: {
    id: string;
    errorType: string;
    rule: string;
    hitCount: number;
    lastHitAt: string | null;
    isActive: boolean;
    createdAt: string;
    relatedCasesCount?: number;
  };
  onToggleActive?: (id: string, isActive: boolean) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  showActions?: boolean;
}

export function PreventionRuleCard({
  rule,
  onToggleActive,
  onDelete,
  showActions = true,
}: PreventionRuleCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    if (!onToggleActive) return;
    setIsUpdating(true);
    try {
      await onToggleActive(rule.id, !rule.isActive);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirm("确定要删除这条规则吗？")) return;
    setIsUpdating(true);
    try {
      await onDelete(rule.id);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card
      className={cn(
        "transition-all",
        !rule.isActive && "opacity-60"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">\ud83d\udee1\ufe0f</span>
            <ErrorTypeBadge type={rule.errorType} size="sm" />
          </div>
          <div className="flex items-center gap-2">
            {rule.hitCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                \u26a0\ufe0f 触发 {rule.hitCount} 次
              </Badge>
            )}
            <Badge
              variant={rule.isActive ? "default" : "secondary"}
              className="text-xs"
            >
              {rule.isActive ? "启用中" : "已停用"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="font-medium">{rule.rule}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            创建于 {new Date(rule.createdAt).toLocaleDateString("zh-CN")}
          </span>
          {rule.lastHitAt && (
            <span>
              最近触发 {new Date(rule.lastHitAt).toLocaleDateString("zh-CN")}
            </span>
          )}
        </div>
        {showActions && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggle}
              disabled={isUpdating}
            >
              {rule.isActive ? "\u23f8\ufe0f 停用" : "\u25b6\ufe0f 启用"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isUpdating}
              className="text-destructive hover:text-destructive"
            >
              \ud83d\uddd1\ufe0f 删除
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function PreventionRuleCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="h-6 bg-muted rounded w-24 animate-pulse" />
          <div className="h-5 bg-muted rounded w-16 animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-5 bg-muted rounded w-full animate-pulse" />
        <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
      </CardContent>
    </Card>
  );
}
