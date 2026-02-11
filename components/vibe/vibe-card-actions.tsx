"use client";

import { RefObject, useCallback, useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Copy, Download, Check, Palette, Share } from "lucide-react";
import { useVibeStore, type CardStyle } from "@/stores/vibe-store";

interface VibeCardActionsProps {
  cardRef: RefObject<HTMLDivElement | null>;
}

const STYLES: { value: CardStyle; label: string }[] = [
  { value: "dark", label: "Dark Code" },
  { value: "gradient", label: "Gradient" },
  { value: "light", label: "Minimal" },
];

export function VibeCardActions({ cardRef }: VibeCardActionsProps) {
  const { results, selectedIndex, cardStyle, setCardStyle } = useVibeStore();
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const currentResult = results[selectedIndex] ?? null;

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
        width: 360,
        height: 480,
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
  }, [cardRef]);

  const handlePublish = useCallback(async () => {
    if (!currentResult || !cardRef.current) return;
    setPublishing(true);
    try {
      // 同时复制文案 + 下载图片
      const text = `${currentResult.title}\n\n${currentResult.body}\n\n${currentResult.hashtags.join(" ")}`;
      const copyPromise = navigator.clipboard.writeText(text);

      const exportPromise = toPng(cardRef.current, {
        pixelRatio: 3,
        width: 360,
        height: 480,
      }).then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `xiaohongshu-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      });

      await Promise.all([copyPromise, exportPromise]);
      setPublished(true);
      setTimeout(() => setPublished(false), 3000);
    } catch (err) {
      console.error("Publish prep failed:", err);
    } finally {
      setPublishing(false);
    }
  }, [currentResult, cardRef]);

  return (
    <div className="flex flex-col gap-3">
      {/* 风格切换 */}
      <div className="flex items-center gap-2">
        <Palette className="h-4 w-4 text-muted-foreground" />
        <div className="flex gap-1">
          {STYLES.map((s) => (
            <button
              key={s.value}
              onClick={() => setCardStyle(s.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
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

      {/* 一键准备发布 */}
      <Button
        onClick={handlePublish}
        disabled={!currentResult || publishing}
        className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
      >
        {published ? (
          <>
            <Check className="h-4 w-4 mr-1.5 text-white" />
            文案已复制 + 图片已下载，去小红书粘贴发布吧！
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
    </div>
  );
}
