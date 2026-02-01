"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ErrorTypeBadge } from "./error-type-badge";
import { cn } from "@/lib/utils";

interface ErrorCaseCardProps {
  errorCase: {
    id: string;
    status: string;
    errorType: string | null;
    q1Answer: string | null;
    q2Answer: string | null;
    q3Answer: string | null;
    createdAt: string;
    problem: {
      id: string;
      title: string;
      level: number;
      difficulty: string;
      knowledgePoints: string[];
    };
    submission: {
      status: string;
      createdAt: string;
    };
    preventionRule?: {
      id: string;
      rule: string;
    } | null;
  };
}

export function ErrorCaseCard({ errorCase }: ErrorCaseCardProps) {
  const questionsCompleted = [
    errorCase.q1Answer,
    errorCase.q2Answer,
    errorCase.q3Answer,
  ].filter(Boolean).length;

  const statusConfig = {
    pending: {
      label: "待复盘",
      className: "bg-muted text-muted-foreground",
    },
    in_progress: {
      label: "复盘中",
      className: "bg-blue-100 text-blue-700",
    },
    completed: {
      label: "已完成",
      className: "bg-green-100 text-green-700",
    },
  };

  const status = statusConfig[errorCase.status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <Link href={`/error-book/${errorCase.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-medium line-clamp-1">
              {errorCase.problem.title}
            </CardTitle>
            <Badge variant="outline" className={cn("shrink-0", status.className)}>
              {status.label}
            </Badge>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              Lv.{errorCase.problem.level}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {errorCase.problem.difficulty}
            </Badge>
            <ErrorTypeBadge type={errorCase.errorType} size="sm" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>\ud83d\udcdd</span>
              <span>三问进度: {questionsCompleted}/3</span>
            </div>
            <span>
              {new Date(errorCase.createdAt).toLocaleDateString("zh-CN")}
            </span>
          </div>
          {errorCase.preventionRule && (
            <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
              <span className="text-muted-foreground">\ud83d\udee1\ufe0f 防错规则：</span>
              <span className="line-clamp-1">{errorCase.preventionRule.rule}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export function ErrorCaseCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="h-5 bg-muted rounded w-3/4 animate-pulse" />
          <div className="h-5 bg-muted rounded w-16 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 bg-muted rounded w-12 animate-pulse" />
          <div className="h-4 bg-muted rounded w-16 animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-muted rounded w-24 animate-pulse" />
          <div className="h-4 bg-muted rounded w-20 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
