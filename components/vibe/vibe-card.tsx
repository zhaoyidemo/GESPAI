"use client";

import { forwardRef } from "react";
import type { CardStyle, VibeResult } from "@/stores/vibe-store";

interface VibeCardProps {
  result: VibeResult;
  style: CardStyle;
}

export const VibeCard = forwardRef<HTMLDivElement, VibeCardProps>(
  function VibeCard({ result, style }, ref) {
    if (style === "dark") return <DarkCodeCard ref={ref} result={result} />;
    if (style === "gradient") return <GradientWaveCard ref={ref} result={result} />;
    return <MinimalLightCard ref={ref} result={result} />;
  }
);

// 风格 A — Dark Code（深色代码风）
const DarkCodeCard = forwardRef<HTMLDivElement, { result: VibeResult }>(
  function DarkCodeCard({ result }, ref) {
    return (
      <div
        ref={ref}
        className="relative w-[360px] h-[480px] overflow-hidden rounded-2xl"
        style={{ backgroundColor: "#0a0a1a" }}
      >
        {/* 网格纹理背景 */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* 顶部模糊代码装饰 */}
        <div className="absolute top-4 left-4 right-4 opacity-[0.08] font-mono text-xs text-white leading-relaxed select-none">
          <div>{"import { chat } from '@/lib/claude';"}</div>
          <div>{"const response = await chat(messages);"}</div>
          <div>{"return NextResponse.json(result);"}</div>
        </div>

        {/* 主内容 */}
        <div className="relative z-10 flex flex-col h-full px-6 pt-20 pb-6">
          {/* 标题 */}
          <h2 className="text-2xl font-bold text-white leading-tight mb-4">
            {result.title}
          </h2>

          {/* 正文 */}
          <p className="text-sm text-white/70 leading-relaxed flex-1 whitespace-pre-line overflow-hidden">
            {result.body}
          </p>

          {/* 代码片段 */}
          {result.codeSnippet && (
            <div className="my-3 px-3 py-2 rounded-lg bg-white/5 border border-purple-500/30 font-mono text-xs text-purple-300 overflow-hidden">
              {result.codeSnippet}
            </div>
          )}

          {/* 标签 */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {result.hashtags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/20 text-purple-300 border border-purple-500/20"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 底部署名 */}
          <div className="flex items-center gap-2 pt-3 border-t border-white/10">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              赵
            </div>
            <span className="text-xs text-white/50">赵知行 · GESP.AI</span>
          </div>
        </div>
      </div>
    );
  }
);

// 风格 B — Gradient Wave（渐变风）
const GradientWaveCard = forwardRef<HTMLDivElement, { result: VibeResult }>(
  function GradientWaveCard({ result }, ref) {
    return (
      <div
        ref={ref}
        className="relative w-[360px] h-[480px] overflow-hidden rounded-2xl"
        style={{
          background: "linear-gradient(135deg, #5b6af0 0%, #8b5cf6 100%)",
        }}
      >
        {/* 右上角几何光斑 */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-20 -right-5 w-24 h-24 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
          }}
        />

        {/* 主内容 */}
        <div className="relative z-10 flex flex-col h-full px-6 pt-10 pb-6">
          {/* 标题 */}
          <h2 className="text-2xl font-bold text-white leading-tight mb-4">
            {result.title}
          </h2>

          {/* 正文 */}
          <p className="text-sm text-white/85 leading-relaxed flex-1 whitespace-pre-line overflow-hidden">
            {result.body}
          </p>

          {/* 代码片段 */}
          {result.codeSnippet && (
            <div className="my-3 px-3 py-2 rounded-lg bg-black/15 font-mono text-xs text-white/90 overflow-hidden">
              {result.codeSnippet}
            </div>
          )}

          {/* 标签 */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {result.hashtags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/15 text-white/90 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 底部署名 */}
          <div className="flex items-center gap-2 pt-3 border-t border-white/20">
            <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold">
              赵
            </div>
            <span className="text-xs text-white/70">赵知行 · GESP.AI</span>
          </div>
        </div>
      </div>
    );
  }
);

// 风格 C — Minimal Light（简约亮色风）
const MinimalLightCard = forwardRef<HTMLDivElement, { result: VibeResult }>(
  function MinimalLightCard({ result }, ref) {
    return (
      <div
        ref={ref}
        className="relative w-[360px] h-[480px] overflow-hidden rounded-2xl bg-white"
      >
        {/* 极淡紫色渐变底 */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #f5f3ff 100%)",
          }}
        />

        {/* 左侧渐变色竖条装饰 */}
        <div
          className="absolute left-0 top-8 bottom-8 w-1"
          style={{
            background: "linear-gradient(180deg, #5b6af0, #8b5cf6)",
            borderRadius: "0 2px 2px 0",
          }}
        />

        {/* 主内容 */}
        <div className="relative z-10 flex flex-col h-full px-6 pl-8 pt-10 pb-6">
          {/* 标题 */}
          <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-4">
            {result.title}
          </h2>

          {/* 正文 */}
          <p className="text-sm text-gray-600 leading-relaxed flex-1 whitespace-pre-line overflow-hidden">
            {result.body}
          </p>

          {/* 代码片段 */}
          {result.codeSnippet && (
            <div className="my-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 font-mono text-xs text-gray-700 overflow-hidden">
              {result.codeSnippet}
            </div>
          )}

          {/* 标签 */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {result.hashtags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-600 border border-purple-100"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 底部署名 */}
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              赵
            </div>
            <span className="text-xs text-gray-400">赵知行 · GESP.AI</span>
          </div>
        </div>
      </div>
    );
  }
);
