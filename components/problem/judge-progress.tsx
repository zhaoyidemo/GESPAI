"use client";

import { useState, useEffect, useRef } from "react";
import { Progress } from "@/components/ui/progress";

function getStageText(elapsed: number): string {
  if (elapsed < 2000) return "正在编译代码...";
  if (elapsed < 5000) return "正在运行测试点...";
  if (elapsed < 8000) return "评测即将完成...";
  return "评测耗时较长，请耐心等待...";
}

function getProgressValue(elapsed: number): number {
  if (elapsed < 2000) return (elapsed / 2000) * 30;
  if (elapsed < 5000) return 30 + ((elapsed - 2000) / 3000) * 30;
  if (elapsed < 8000) return 60 + ((elapsed - 5000) / 3000) * 20;
  // 8s+ 缓慢逼近 95%
  return 80 + (1 - Math.exp(-(elapsed - 8000) / 10000)) * 15;
}

interface JudgeProgressProps {
  active: boolean;
}

export function JudgeProgress({ active }: JudgeProgressProps) {
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState("");
  const [visible, setVisible] = useState(false);
  const startTimeRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (active) {
      startTimeRef.current = Date.now();
      setProgress(0);
      setStageText("正在编译代码...");
      setVisible(true);

      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        setProgress(getProgressValue(elapsed));
        setStageText(getStageText(elapsed));
      }, 100);
    } else if (visible) {
      // 完成动画：跳到 100% 然后淡出
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setProgress(100);
      setStageText("评测完成");

      const fadeTimer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 600);

      return () => clearTimeout(fadeTimer);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [active, visible]);

  if (!visible) return null;

  return (
    <div
      className={`mt-3 transition-opacity duration-500 ${
        !active && progress === 100 ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex items-center gap-3">
        <Progress value={progress} className="flex-1 h-2" />
        <span className="text-xs text-muted-foreground whitespace-nowrap min-w-[160px]">
          {stageText}
        </span>
      </div>
    </div>
  );
}
