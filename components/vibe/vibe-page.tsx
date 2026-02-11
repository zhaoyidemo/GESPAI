"use client";

import { useRef } from "react";
import { useSession } from "next-auth/react";
import { VibeInputForm } from "@/components/vibe/vibe-input-form";
import { VibeSuggestions } from "@/components/vibe/vibe-suggestions";
import { VibeCard } from "@/components/vibe/vibe-card";
import { VibeCardActions } from "@/components/vibe/vibe-card-actions";
import { VibeHistory } from "@/components/vibe/vibe-history";
import { useVibeStore } from "@/stores/vibe-store";
import { Megaphone } from "lucide-react";

const VARIANT_LABELS = ["A", "B", "C"];

export function VibePage() {
  const { data: session } = useSession();
  const {
    results,
    selectedIndex,
    setSelectedIndex,
    cardStyle,
    cardSize,
    editMode,
    updateCurrentResult,
    error,
  } = useVibeStore();
  const cardRef = useRef<HTMLDivElement>(null);

  const currentResult = results[selectedIndex] ?? null;
  const username = session?.user?.username || "User";

  return (
    <div className="max-w-6xl mx-auto">
      {/* 页面标题 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Megaphone className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold">小红书发帖助手</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          一键生成小红书图文帖 —— AI 把你的学习成就变成好看的卡片，复制粘贴就能发
        </p>
      </div>

      {/* 左右两栏布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左：建议区 + 输入表单 */}
        <div className="space-y-4">
          <VibeSuggestions />
          <VibeInputForm />
          {error && (
            <div className="px-4 py-3 rounded-xl bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}
          <VibeHistory />
        </div>

        {/* 右：多变体导航 + 卡片预览 + 内联编辑 + 操作栏 */}
        <div className="flex flex-col items-center gap-4">
          {/* 多变体导航 */}
          {results.length > 1 && (
            <div className="flex gap-2">
              {results.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedIndex === i
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  方案 {VARIANT_LABELS[i]}
                </button>
              ))}
            </div>
          )}

          {currentResult ? (
            <>
              <VibeCard
                ref={cardRef}
                result={currentResult}
                style={cardStyle}
                size={cardSize}
                username={username}
              />

              {/* 内联编辑区 */}
              {editMode && (
                <div className="w-full max-w-[360px] space-y-2">
                  <input
                    value={currentResult.title}
                    onChange={(e) =>
                      updateCurrentResult({ title: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="标题"
                  />
                  <textarea
                    value={currentResult.body}
                    onChange={(e) =>
                      updateCurrentResult({ body: e.target.value })
                    }
                    className="w-full h-32 px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="正文"
                  />
                  <input
                    value={currentResult.hashtags.join(" ")}
                    onChange={(e) =>
                      updateCurrentResult({
                        hashtags: e.target.value
                          .split(/\s+/)
                          .filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="标签（空格分隔）"
                  />
                </div>
              )}

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
