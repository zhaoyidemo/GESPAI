"use client";

import { RefObject, useCallback, useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Download,
  Check,
  Palette,
  Share,
  Pencil,
  RectangleHorizontal,
  Square,
  Images,
} from "lucide-react";
import {
  useVibeStore,
  type CardStyle,
  type CardSize,
} from "@/stores/vibe-store";

interface VibeCardActionsProps {
  cardRef: RefObject<HTMLDivElement | null>;
}

const STYLES: { value: CardStyle; label: string }[] = [
  { value: "dark", label: "暗黑" },
  { value: "gradient", label: "渐变" },
  { value: "light", label: "简约" },
  { value: "campus", label: "校园" },
  { value: "pixel", label: "像素" },
  { value: "journal", label: "手账" },
];

const SIZES: { value: CardSize; label: string; icon: typeof Square }[] = [
  { value: "3:4", label: "3:4", icon: RectangleHorizontal },
  { value: "1:1", label: "1:1", icon: Square },
];

const SIZE_PX: Record<CardSize, { w: number; h: number }> = {
  "3:4": { w: 360, h: 480 },
  "1:1": { w: 360, h: 360 },
};

export function VibeCardActions({ cardRef }: VibeCardActionsProps) {
  const {
    results,
    selectedIndex,
    contentType,
    rawInput,
    tone,
    cardStyle,
    setCardStyle,
    cardSize,
    setCardSize,
    editMode,
    setEditMode,
    setSelectedIndex,
  } = useVibeStore();
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [newBadges, setNewBadges] = useState<string[]>([]);

  const currentResult = results[selectedIndex] ?? null;
  const dim = SIZE_PX[cardSize];

  const handleCopy = useCallback(async () => {
    if (!currentResult) return;
    const text = `${currentResult.title}\n\n${currentResult.body}\n\n${currentResult.hashtags.join(" ")}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentResult]);

  const handleExport = useCallback(async () => {
    if (!cardRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        width: dim.w,
        height: dim.h,
      });
      const link = document.createElement("a");
      link.download = `xiaohongshu-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  }, [cardRef, dim]);

  const handleExportAll = useCallback(async () => {
    if (!cardRef.current || results.length <= 1) return;
    setExporting(true);
    const originalIndex = selectedIndex;
    try {
      for (let i = 0; i < results.length; i++) {
        setSelectedIndex(i);
        // 等待 React 重新渲染
        await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 200)));
        if (cardRef.current) {
          const dataUrl = await toPng(cardRef.current, {
            pixelRatio: 3,
            width: dim.w,
            height: dim.h,
          });
          const link = document.createElement("a");
          link.download = `xiaohongshu-${Date.now()}-方案${["A", "B", "C"][i]}.png`;
          link.href = dataUrl;
          link.click();
        }
      }
      setSelectedIndex(originalIndex);
    } catch (err) {
      console.error("Export all failed:", err);
      setSelectedIndex(originalIndex);
    } finally {
      setExporting(false);
    }
  }, [cardRef, results, selectedIndex, setSelectedIndex, dim]);

  const handlePublish = useCallback(async () => {
    if (!currentResult || !cardRef.current) return;
    setPublishing(true);
    setXpEarned(0);
    setNewBadges([]);
    try {
      const text = `${currentResult.title}\n\n${currentResult.body}\n\n${currentResult.hashtags.join(" ")}`;
      const copyPromise = navigator.clipboard.writeText(text);
      const exportPromise = toPng(cardRef.current, {
        pixelRatio: 3,
        width: dim.w,
        height: dim.h,
      }).then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `xiaohongshu-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      });
      await Promise.all([copyPromise, exportPromise]);

      // 自动保存到历史记录 + 标记分享获取 XP
      try {
        const saveRes = await fetch("/api/vibe/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contentType,
            tone,
            rawInput,
            title: currentResult.title,
            body: currentResult.body,
            hashtags: currentResult.hashtags,
            codeSnippet: currentResult.codeSnippet,
            cardStyle,
            cardSize,
          }),
        });
        const saveData = await saveRes.json();
        if (saveData.id) {
          const shareRes = await fetch("/api/vibe/share", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId: saveData.id }),
          });
          const shareData = await shareRes.json();
          if (shareData.xpEarned) {
            setXpEarned(shareData.xpEarned);
          }
          if (shareData.newBadges?.length > 0) {
            setNewBadges(shareData.newBadges);
          }
        }
      } catch {
        // 保存失败不影响发布体验
      }

      setPublished(true);
      setTimeout(() => {
        setPublished(false);
        setXpEarned(0);
        setNewBadges([]);
      }, 5000);
    } catch (err) {
      console.error("Publish prep failed:", err);
    } finally {
      setPublishing(false);
    }
  }, [currentResult, cardRef, dim, contentType, rawInput, tone, cardStyle, cardSize]);

  return (
    <div className="flex flex-col gap-3 w-full max-w-[360px]">
      {/* 风格切换 */}
      <div className="flex items-center gap-2">
        <Palette className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <div className="flex gap-1 flex-wrap">
          {STYLES.map((s) => (
            <button
              key={s.value}
              onClick={() => setCardStyle(s.value)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                cardStyle === s.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 尺寸 + 编辑按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {SIZES.map((s) => (
            <button
              key={s.value}
              onClick={() => setCardSize(s.value)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                cardSize === s.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              <s.icon className="h-3 w-3" />
              {s.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
            editMode
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80"
          }`}
        >
          <Pencil className="h-3 w-3" />
          编辑文案
        </button>
      </div>

      {/* 一键准备发布 */}
      <Button
        onClick={handlePublish}
        disabled={!currentResult || publishing}
        className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
      >
        {published ? (
          <>
            <Check className="h-4 w-4 mr-1.5 text-white" />
            已准备好！{xpEarned > 0 ? `+${xpEarned} XP ` : ""}
            {newBadges.length > 0 ? `🏅 ${newBadges.join(" ")} ` : ""}
            去小红书粘贴发布吧
          </>
        ) : publishing ? (
          "准备中..."
        ) : (
          <>
            <Share className="h-4 w-4 mr-1.5" />
            一键准备发布
          </>
        )}
      </Button>

      {/* 单独操作按钮 */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={!currentResult}
          className="flex-1"
        >
          {copied ? (
            <Check className="h-4 w-4 mr-1.5 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 mr-1.5" />
          )}
          {copied ? "已复制" : "复制文案"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={!currentResult || exporting}
          className="flex-1"
        >
          <Download className="h-4 w-4 mr-1.5" />
          {exporting ? "导出中..." : "导出图片"}
        </Button>
      </div>

      {/* 多变体导出全部 */}
      {results.length > 1 && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportAll}
          disabled={exporting}
          className="w-full"
        >
          <Images className="h-4 w-4 mr-1.5" />
          {exporting ? "批量导出中..." : `导出全部 ${results.length} 张图片`}
        </Button>
      )}
    </div>
  );
}
