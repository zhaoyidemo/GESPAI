"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, CalendarDays } from "lucide-react";
import {
  useVibeStore,
  type ContentType,
  type TonePreset,
} from "@/stores/vibe-store";

const TABS: { value: ContentType; label: string; placeholder: string }[] = [
  {
    value: "build",
    label: "Build",
    placeholder:
      "粘贴你的开发活动素材...\n\n例如：\n- commit message\n- 功能上线描述\n- Bug 修复记录\n- 技术决策说明\n\n示例：\nfeat: 实现错题三问诊断流程，AI 引导学生自主定位→分析→总结防错规则",
  },
  {
    value: "learn",
    label: "Learn",
    placeholder:
      "粘贴你的学习活动素材...\n\n例如：\n- 做题记录和错题分析\n- 知识点突破心得\n- 模考成绩和反思\n- 学习过程中的感悟\n\n示例：\nGESP 四级模考 72 分，指针和结构体那道大题没做出来，回去看了费曼验证才发现自己根本没搞懂指针的解引用",
  },
  {
    value: "weekly",
    label: "周报",
    placeholder:
      "点击「一键生成周报素材」自动填充本周学习数据，或手动输入你的一周总结...\n\n例如：\n- 本周做了哪些题\n- 学到了什么新知识点\n- 模考表现如何\n- 学习心得和下周计划",
  },
];

const VARIANT_OPTIONS = [1, 2, 3] as const;

const TONE_OPTIONS: { value: TonePreset; label: string; emoji: string }[] = [
  { value: "inspirational", label: "励志", emoji: "💪" },
  { value: "technical", label: "干货", emoji: "🔧" },
  { value: "humble-brag", label: "凡尔赛", emoji: "😏" },
  { value: "casual", label: "日常", emoji: "☀️" },
];

export function VibeInputForm() {
  const {
    contentType,
    rawInput,
    generating,
    tone,
    setContentType,
    setRawInput,
    setGenerating,
    setTone,
    setResults,
    setError,
  } = useVibeStore();

  const [variants, setVariants] = useState(1);
  const [weeklyLoading, setWeeklyLoading] = useState(false);
  const currentTab = TABS.find((t) => t.value === contentType) || TABS[0];

  const handleFetchWeekly = useCallback(async () => {
    setWeeklyLoading(true);
    try {
      const res = await fetch("/api/vibe/weekly");
      const data = await res.json();
      if (data.rawInput) {
        setRawInput(data.rawInput);
      } else {
        setError("本周暂无学习活动数据");
      }
    } catch {
      setError("获取周报数据失败");
    } finally {
      setWeeklyLoading(false);
    }
  }, [setRawInput, setError]);

  const handleGenerate = useCallback(async () => {
    if (!rawInput.trim() || generating) return;

    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/vibe/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, rawInput, variants, tone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "生成失败");
        return;
      }

      setResults(data.results || []);
    } catch {
      setError("网络错误，请重试");
    } finally {
      setGenerating(false);
    }
  }, [rawInput, generating, contentType, variants, tone, setGenerating, setError, setResults]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold mb-1">素材输入</h2>
        <p className="text-sm text-muted-foreground">
          选择内容方向，粘贴素材，AI 一键生成小红书帖子
        </p>
      </div>

      {/* Build / Learn 切换 */}
      <div className="flex gap-1 p-1 bg-secondary rounded-lg">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setContentType(tab.value)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              contentType === tab.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 文案风格 */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">文案风格</span>
        <div className="flex gap-1 flex-wrap">
          {TONE_OPTIONS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTone(t.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                tone === t.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 变体数量选择 */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">生成方案数</span>
        <div className="flex gap-1">
          {VARIANT_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => setVariants(n)}
              className={`w-8 h-8 rounded-md text-sm font-medium transition-all ${
                variants === n
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        {variants > 1 && (
          <span className="text-xs text-muted-foreground">
            AI 将从不同角度生成 {variants} 个文案
          </span>
        )}
      </div>

      {/* 周报一键填充 */}
      {contentType === "weekly" && (
        <Button
          variant="outline"
          onClick={handleFetchWeekly}
          disabled={weeklyLoading}
          className="w-full"
        >
          {weeklyLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              获取本周数据中...
            </>
          ) : (
            <>
              <CalendarDays className="h-4 w-4 mr-2" />
              一键生成周报素材
            </>
          )}
        </Button>
      )}

      {/* 文本输入 */}
      <textarea
        value={rawInput}
        onChange={(e) => setRawInput(e.target.value)}
        placeholder={currentTab.placeholder}
        className="w-full h-64 px-4 py-3 rounded-xl border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/60"
      />

      {/* 生成按钮 */}
      <Button
        onClick={handleGenerate}
        disabled={!rawInput.trim() || generating}
        className="w-full"
        size="lg"
      >
        {generating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            AI 生成中...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            生成文案{variants > 1 ? ` (${variants} 个方案)` : ""}
          </>
        )}
      </Button>
    </div>
  );
}
