"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useVibeStore, type ContentType } from "@/stores/vibe-store";

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
];

const VARIANT_OPTIONS = [1, 2, 3] as const;

export function VibeInputForm() {
  const {
    contentType,
    rawInput,
    generating,
    setContentType,
    setRawInput,
    setGenerating,
    setResults,
    setError,
  } = useVibeStore();

  const [variants, setVariants] = useState(1);
  const currentTab = TABS.find((t) => t.value === contentType) || TABS[0];

  const handleGenerate = useCallback(async () => {
    if (!rawInput.trim() || generating) return;

    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/vibe/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, rawInput, variants }),
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
  }, [rawInput, generating, contentType, variants, setGenerating, setError, setResults]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold mb-1">素材输入</h2>
        <p className="text-sm text-muted-foreground">
          选择内容方向，粘贴原始素材，AI 帮你生成小红书文案
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
