"use client";

import { forwardRef } from "react";
import type { CardStyle, CardSize, VibeResult } from "@/stores/vibe-store";

interface VibeCardProps {
  result: VibeResult;
  style: CardStyle;
  size?: CardSize;
  username?: string;
}

// C++ 关键字简单语法高亮
function highlightCpp(code: string, colorClass: string) {
  const keywords =
    /\b(int|void|return|if|else|for|while|do|switch|case|break|continue|class|struct|const|static|bool|char|double|float|long|short|unsigned|signed|auto|using|namespace|include|iostream|string|vector|map|set|cin|cout|endl|true|false|nullptr|new|delete|this|public|private|protected|virtual|override|template|typename)\b/g;
  const parts = code.split(keywords);
  return parts.map((part, i) =>
    keywords.test(part) ? (
      <span key={i} className={colorClass}>
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

// 卡片尺寸配置
const SIZE_CONFIG: Record<CardSize, { w: number; h: number }> = {
  "3:4": { w: 360, h: 480 },
  "1:1": { w: 360, h: 360 },
};

// 署名组件
function Signature({
  username,
  avatarClass,
  textClass,
}: {
  username: string;
  avatarClass: string;
  textClass: string;
}) {
  const initial = username[0] || "U";
  return (
    <div className="flex items-center gap-2 pt-3">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${avatarClass}`}
      >
        {initial}
      </div>
      <span className={`text-xs ${textClass}`}>{username} · GESP.AI</span>
    </div>
  );
}

export const VibeCard = forwardRef<HTMLDivElement, VibeCardProps>(
  function VibeCard({ result, style, size = "3:4", username = "User" }, ref) {
    const dim = SIZE_CONFIG[size];
    const props = { result, username, dim };

    switch (style) {
      case "dark":
        return <DarkCodeCard ref={ref} {...props} />;
      case "gradient":
        return <GradientWaveCard ref={ref} {...props} />;
      case "light":
        return <MinimalLightCard ref={ref} {...props} />;
      case "campus":
        return <CampusCard ref={ref} {...props} />;
      case "pixel":
        return <PixelCard ref={ref} {...props} />;
      case "journal":
        return <JournalCard ref={ref} {...props} />;
      default:
        return <DarkCodeCard ref={ref} {...props} />;
    }
  }
);

interface InnerCardProps {
  result: VibeResult;
  username: string;
  dim: { w: number; h: number };
}

// ──────────────────────────────────────────
// 风格 A — Dark Code（深色代码风）
// ──────────────────────────────────────────
const DarkCodeCard = forwardRef<HTMLDivElement, InnerCardProps>(
  function DarkCodeCard({ result, username, dim }, ref) {
    return (
      <div
        ref={ref}
        className="relative overflow-hidden rounded-2xl"
        style={{ width: dim.w, height: dim.h, backgroundColor: "#0a0a1a" }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="absolute top-4 left-4 right-4 opacity-[0.08] font-mono text-xs text-white leading-relaxed select-none">
          <div>{"#include <iostream>"}</div>
          <div>{"using namespace std;"}</div>
          <div>{"int main() { return 0; }"}</div>
        </div>
        <div className="relative z-10 flex flex-col h-full px-6 pt-16 pb-5">
          <h2 className="text-2xl font-bold text-white leading-tight mb-3">
            {result.title}
          </h2>
          <p className="text-sm text-white/70 leading-relaxed flex-1 whitespace-pre-line overflow-hidden">
            {result.body}
          </p>
          {result.codeSnippet && (
            <div className="my-3 px-3 py-2 rounded-lg bg-white/5 border border-purple-500/30 font-mono text-xs text-purple-200 overflow-hidden whitespace-pre-wrap">
              {highlightCpp(result.codeSnippet, "text-pink-400 font-semibold")}
            </div>
          )}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {result.hashtags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/20 text-purple-300 border border-purple-500/20"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="border-t border-white/10">
            <Signature
              username={username}
              avatarClass="bg-gradient-to-br from-purple-500 to-indigo-600 text-white"
              textClass="text-white/50"
            />
          </div>
        </div>
      </div>
    );
  }
);

// ──────────────────────────────────────────
// 风格 B — Gradient Wave（渐变风）
// ──────────────────────────────────────────
const GradientWaveCard = forwardRef<HTMLDivElement, InnerCardProps>(
  function GradientWaveCard({ result, username, dim }, ref) {
    return (
      <div
        ref={ref}
        className="relative overflow-hidden rounded-2xl"
        style={{
          width: dim.w,
          height: dim.h,
          background: "linear-gradient(135deg, #5b6af0 0%, #8b5cf6 100%)",
        }}
      >
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 flex flex-col h-full px-6 pt-10 pb-5">
          <h2 className="text-2xl font-bold text-white leading-tight mb-3">
            {result.title}
          </h2>
          <p className="text-sm text-white/85 leading-relaxed flex-1 whitespace-pre-line overflow-hidden">
            {result.body}
          </p>
          {result.codeSnippet && (
            <div className="my-3 px-3 py-2 rounded-lg bg-black/15 font-mono text-xs text-white/90 overflow-hidden whitespace-pre-wrap">
              {highlightCpp(result.codeSnippet, "text-yellow-200 font-semibold")}
            </div>
          )}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {result.hashtags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/15 text-white/90"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="border-t border-white/20">
            <Signature
              username={username}
              avatarClass="bg-white/20 text-white"
              textClass="text-white/70"
            />
          </div>
        </div>
      </div>
    );
  }
);

// ──────────────────────────────────────────
// 风格 C — Minimal Light（简约亮色风）
// ──────────────────────────────────────────
const MinimalLightCard = forwardRef<HTMLDivElement, InnerCardProps>(
  function MinimalLightCard({ result, username, dim }, ref) {
    return (
      <div
        ref={ref}
        className="relative overflow-hidden rounded-2xl"
        style={{
          width: dim.w,
          height: dim.h,
          background: "linear-gradient(180deg, #ffffff 0%, #f5f3ff 100%)",
        }}
      >
        <div
          className="absolute left-0 top-8 bottom-8 w-1"
          style={{
            background: "linear-gradient(180deg, #5b6af0, #8b5cf6)",
            borderRadius: "0 2px 2px 0",
          }}
        />
        <div className="relative z-10 flex flex-col h-full px-6 pl-8 pt-10 pb-5">
          <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-3">
            {result.title}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed flex-1 whitespace-pre-line overflow-hidden">
            {result.body}
          </p>
          {result.codeSnippet && (
            <div className="my-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 font-mono text-xs text-gray-700 overflow-hidden whitespace-pre-wrap">
              {highlightCpp(result.codeSnippet, "text-indigo-600 font-semibold")}
            </div>
          )}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {result.hashtags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-600 border border-purple-100"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="border-t border-gray-100">
            <Signature
              username={username}
              avatarClass="bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
              textClass="text-gray-400"
            />
          </div>
        </div>
      </div>
    );
  }
);

// ──────────────────────────────────────────
// 风格 D — Campus（校园风）
// ──────────────────────────────────────────
const CampusCard = forwardRef<HTMLDivElement, InnerCardProps>(
  function CampusCard({ result, username, dim }, ref) {
    return (
      <div
        ref={ref}
        className="relative overflow-hidden rounded-2xl"
        style={{
          width: dim.w,
          height: dim.h,
          background: "linear-gradient(160deg, #fef3c7 0%, #fde68a 30%, #fbbf24 100%)",
        }}
      >
        {/* 笔记本线条装饰 */}
        <div className="absolute inset-x-8 inset-y-0 opacity-[0.12]">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="border-b border-amber-800"
              style={{ height: 28, marginTop: i === 0 ? 60 : 0 }}
            />
          ))}
        </div>
        <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-red-400/20" />
        <div className="relative z-10 flex flex-col h-full px-8 pt-10 pb-5">
          <h2 className="text-2xl font-bold text-amber-900 leading-tight mb-3">
            {result.title}
          </h2>
          <p className="text-sm text-amber-800/80 leading-[28px] flex-1 whitespace-pre-line overflow-hidden">
            {result.body}
          </p>
          {result.codeSnippet && (
            <div className="my-3 px-3 py-2 rounded-lg bg-white/50 border border-amber-300 font-mono text-xs text-amber-900 overflow-hidden whitespace-pre-wrap">
              {highlightCpp(result.codeSnippet, "text-red-600 font-semibold")}
            </div>
          )}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {result.hashtags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-700/15 text-amber-800 border border-amber-400/30"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="border-t border-amber-400/30">
            <Signature
              username={username}
              avatarClass="bg-amber-700 text-white"
              textClass="text-amber-700/60"
            />
          </div>
        </div>
      </div>
    );
  }
);

// ──────────────────────────────────────────
// 风格 E — Pixel（像素风）
// ──────────────────────────────────────────
const PixelCard = forwardRef<HTMLDivElement, InnerCardProps>(
  function PixelCard({ result, username, dim }, ref) {
    return (
      <div
        ref={ref}
        className="relative overflow-hidden rounded-2xl"
        style={{
          width: dim.w,
          height: dim.h,
          backgroundColor: "#1a1a2e",
          imageRendering: "pixelated",
        }}
      >
        {/* 像素网格背景 */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,255,136,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.5) 1px, transparent 1px)",
            backgroundSize: "8px 8px",
          }}
        />
        {/* 顶部像素装饰条 */}
        <div className="absolute top-0 left-0 right-0 h-2 flex">
          {["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff"].map((color, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: color }} />
          ))}
        </div>
        <div className="relative z-10 flex flex-col h-full px-6 pt-10 pb-5">
          <h2
            className="text-xl font-bold text-green-400 leading-tight mb-3"
            style={{ fontFamily: "monospace" }}
          >
            {">"} {result.title}
          </h2>
          <p className="text-sm text-green-300/70 leading-relaxed flex-1 whitespace-pre-line overflow-hidden font-mono">
            {result.body}
          </p>
          {result.codeSnippet && (
            <div className="my-3 px-3 py-2 rounded bg-black/30 border border-green-500/30 font-mono text-xs text-green-300 overflow-hidden whitespace-pre-wrap">
              {highlightCpp(result.codeSnippet, "text-cyan-400 font-semibold")}
            </div>
          )}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {result.hashtags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-green-500/15 text-green-400 border border-green-500/25"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="border-t border-green-500/20">
            <Signature
              username={username}
              avatarClass="bg-green-500 text-black"
              textClass="text-green-500/50 font-mono"
            />
          </div>
        </div>
      </div>
    );
  }
);

// ──────────────────────────────────────────
// 风格 F — Journal（手账风）
// ──────────────────────────────────────────
const JournalCard = forwardRef<HTMLDivElement, InnerCardProps>(
  function JournalCard({ result, username, dim }, ref) {
    return (
      <div
        ref={ref}
        className="relative overflow-hidden rounded-2xl"
        style={{
          width: dim.w,
          height: dim.h,
          background: "linear-gradient(180deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)",
        }}
      >
        {/* 胶带装饰 */}
        <div
          className="absolute -top-1 left-8 w-16 h-6 rounded-b-sm opacity-60"
          style={{
            background: "linear-gradient(135deg, #a5f3fc 0%, #67e8f9 100%)",
            transform: "rotate(-3deg)",
          }}
        />
        <div
          className="absolute -top-1 right-12 w-12 h-5 rounded-b-sm opacity-50"
          style={{
            background: "linear-gradient(135deg, #d9f99d 0%, #bef264 100%)",
            transform: "rotate(5deg)",
          }}
        />
        {/* 圆点装饰 */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #ec4899 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative z-10 flex flex-col h-full px-7 pt-12 pb-5">
          <h2 className="text-2xl font-bold text-pink-800 leading-tight mb-3">
            {result.title}
          </h2>
          <p className="text-sm text-pink-700/70 leading-relaxed flex-1 whitespace-pre-line overflow-hidden">
            {result.body}
          </p>
          {result.codeSnippet && (
            <div className="my-3 px-3 py-2 rounded-lg bg-white/60 border border-pink-200 font-mono text-xs text-pink-900 overflow-hidden whitespace-pre-wrap">
              {highlightCpp(result.codeSnippet, "text-purple-600 font-semibold")}
            </div>
          )}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {result.hashtags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-pink-200/50 text-pink-700 border border-pink-200"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="border-t border-pink-200/60">
            <Signature
              username={username}
              avatarClass="bg-gradient-to-br from-pink-400 to-rose-500 text-white"
              textClass="text-pink-400/70"
            />
          </div>
        </div>
      </div>
    );
  }
);
