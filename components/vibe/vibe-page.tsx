"use client";

import { useRef } from "react";
import { VibeInputForm } from "@/components/vibe/vibe-input-form";
import { VibeCard } from "@/components/vibe/vibe-card";
import { VibeCardActions } from "@/components/vibe/vibe-card-actions";
import { useVibeStore } from "@/stores/vibe-store";
import { Megaphone } from "lucide-react";

export function VibePage() {
  const { result, cardStyle, error } = useVibeStore();
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="max-w-6xl mx-auto">
      {/* 页面标题 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Megaphone className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold">Vibe Marketing</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Build in Public, Learn in Public —— 把真实的开发和学习活动，转化为可分享的视觉卡片
        </p>
      </div>

      {/* 左右两栏布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左：输入表单 */}
        <div className="space-y-4">
          <VibeInputForm />
          {error && (
            <div className="px-4 py-3 rounded-xl bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}
        </div>

        {/* 右：卡片预览 + 操作栏 */}
        <div className="flex flex-col items-center gap-4">
          {result ? (
            <>
              <VibeCard ref={cardRef} result={result} style={cardStyle} />
              <VibeCardActions cardRef={cardRef} />
            </>
          ) : (
            <div className="w-[360px] h-[480px] rounded-2xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
              <div className="text-center text-muted-foreground/40">
                <Megaphone className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">输入素材并生成后</p>
                <p className="text-sm">卡片将在这里预览</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
