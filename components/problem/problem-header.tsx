"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Send, Clock, Cpu } from "lucide-react";
import Link from "next/link";
import { getDifficultyLabel } from "@/lib/utils";
import { JudgeProgress } from "./judge-progress";
import type { Problem } from "@/stores/problem-store";

interface ProblemHeaderProps {
  problem: Problem;
  running: boolean;
  submitting: boolean;
  onRun: () => void;
  onSubmit: () => void;
}

export function ProblemHeader({
  problem,
  running,
  submitting,
  onRun,
  onSubmit,
}: ProblemHeaderProps) {
  const difficultyInfo = getDifficultyLabel(problem.difficulty);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/problem">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold">{problem.title}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline">{problem.level} 级</Badge>
              <Badge variant="outline" className={difficultyInfo.color}>
                {difficultyInfo.label}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {problem.timeLimit}ms
              </span>
              <span className="text-sm text-muted-foreground flex items-center">
                <Cpu className="h-3 w-3 mr-1" />
                {problem.memoryLimit}MB
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onRun} disabled={running || submitting}>
            {running ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                运行中...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                运行
              </>
            )}
          </Button>
          <Button onClick={onSubmit} disabled={running || submitting}>
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                评测中...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                提交
              </>
            )}
          </Button>
        </div>
      </div>

      <JudgeProgress active={running || submitting} />
    </div>
  );
}
