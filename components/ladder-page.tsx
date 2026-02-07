"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import {
  BOSSES,
  BRIDGES,
  SIDE_QUESTS,
  LOOT_COLORS,
  BADGE_COLORS,
  type LadderBoss,
  type LadderBridge,
  type LadderSideQuest,
  type FlavorPart,
} from "@/lib/ladder-data";

/* ─── 难度星级 ─── */
function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-[2px] items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="text-[12px] leading-none"
          style={{ color: i < count ? "#fbbf24" : undefined, opacity: i < count ? 1 : 0.3 }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

/* ─── Flavor 文本渲染 ─── */
function FlavorText({ parts }: { parts: FlavorPart[] }) {
  return (
    <>
      {parts.map((p, i) => {
        switch (p.type) {
          case "text":
            return <span key={i}>{p.content}</span>;
          case "bold":
            return <strong key={i} className="text-[#6b7280]">{p.content}</strong>;
          case "highlight":
            return <span key={i} className="font-semibold" style={{ color: p.color }}>{p.content}</span>;
          case "warn":
            return <span key={i} style={{ color: "#fb923c" }}>{p.content}</span>;
          case "br":
            return <br key={i} />;
        }
      })}
    </>
  );
}

/* ─── Boss 卡片 ─── */
function BossCard({ boss, index }: { boss: LadderBoss; index: number }) {
  const { theme } = boss;

  return (
    <div
      className="relative rounded-[10px] border border-white/[0.06] bg-white/[0.025] overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/10 hover:-translate-y-[1px] hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)] mb-[2px]"
      style={{
        animationDelay: `${0.05 + index * 0.03}s`,
      }}
    >
      {/* 顶部渐变线 */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
        style={{ background: theme.topGradient }}
      />

      {/* Boss 头部 */}
      <div className="flex items-start gap-3.5 px-5 pt-4">
        {/* LV 徽章 */}
        <div
          className="shrink-0 w-[52px] h-[52px] rounded-lg flex flex-col items-center justify-center gap-[1px]"
          style={{
            background: theme.lvBadgeBg,
            border: `1px solid ${theme.lvBadgeBorder}`,
            animation: theme.glow ? `pulseGlow 3s ease-in-out infinite` : undefined,
            "--glow-dim": theme.glowDim,
            "--glow-bright": theme.glowBright,
          } as React.CSSProperties}
        >
          <span className="font-mono text-[7px] opacity-60 tracking-[1px]">LV</span>
          <span className="font-mono text-base font-bold leading-none" style={{ color: theme.nameColor }}>
            {boss.level}
          </span>
        </div>

        {/* Boss 信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <span className="font-mono text-xl font-bold" style={{ color: theme.nameColor }}>
              {boss.name}
            </span>
            <span className="text-xs text-[#6b7280] font-light">{boss.subtitle}</span>
          </div>
          <div className="flex gap-1.5 mt-1 flex-wrap">
            {boss.badges.map((badge, i) => {
              const colors = BADGE_COLORS[badge.type];
              return (
                <span
                  key={i}
                  className="text-[10px] px-2 py-[2px] rounded font-semibold tracking-[0.5px] whitespace-nowrap uppercase"
                  style={{
                    background: colors.bg,
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  {badge.text}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* 数据网格 */}
      <div
        className="grid gap-[1px] mx-5 mt-3 rounded-md overflow-hidden"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          background: "rgba(255,255,255,0.06)",
        }}
      >
        {/* 难度星级 */}
        <div className="bg-[#0d1220] px-2.5 py-2 flex flex-col gap-[2px]">
          <span className="text-[10px] text-[#4a5060] uppercase tracking-[0.8px] font-medium">难度</span>
          <StarRating count={boss.difficulty} />
        </div>
        {/* 其他数据 */}
        {boss.stats.map((stat, i) => (
          <div key={i} className="bg-[#0d1220] px-2.5 py-2 flex flex-col gap-[2px]">
            <span className="text-[10px] text-[#4a5060] uppercase tracking-[0.8px] font-medium">{stat.label}</span>
            <span
              className="font-mono text-sm font-semibold"
              style={{
                color: stat.color || "#e2e5ed",
                fontSize: stat.small ? "12px" : undefined,
              }}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* 掉落物品 */}
      <div className="flex gap-1.5 flex-wrap px-5 py-2 pt-2 pb-2.5">
        {boss.loot.map((item, i) => {
          const colors = LOOT_COLORS[item.rarity];
          return (
            <span
              key={i}
              className="text-[11px] px-2 py-[3px] rounded flex items-center gap-1 font-medium"
              style={{
                background: colors.bg,
                color: colors.text,
                border: `1px solid ${colors.border}`,
              }}
            >
              <span className="text-xs">{item.icon}</span>
              {item.text}
            </span>
          );
        })}
      </div>

      {/* 说明文字 */}
      <div className="px-5 py-2.5 pb-3.5 text-[13px] text-[#6b7280] leading-[1.7] border-t border-white/[0.06]">
        <FlavorText parts={boss.flavor} />
      </div>
    </div>
  );
}

/* ─── XP Bridge ─── */
function XpBridgeComponent({ bridge }: { bridge: LadderBridge }) {
  return (
    <div>
      <div className="flex items-center gap-2.5 py-1.5 mx-auto max-w-[480px]">
        <span className="text-[11px] text-[#4a5060] whitespace-nowrap font-mono min-w-[120px] text-right">
          {bridge.label}
        </span>
        <div className="flex-1 h-1.5 bg-white/[0.06] rounded-[3px] overflow-hidden relative">
          <div
            className="h-full rounded-[3px] relative transition-[width] duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: `${bridge.barWidth}%`,
              background: bridge.barGradient,
            }}
          >
            <div
              className="absolute right-0 top-0 w-2 h-full rounded-r-[3px]"
              style={{ background: "inherit", filter: "brightness(1.6)" }}
            />
          </div>
        </div>
        <span className="text-[11px] font-mono font-semibold min-w-[48px]" style={{ color: bridge.rateColor }}>
          {bridge.rate}
        </span>
      </div>
      {bridge.note && (
        <div className="max-w-[480px] mx-auto px-0 pb-1 text-[11px] text-[#4a5060] leading-[1.6] text-center">
          {bridge.note}
        </div>
      )}
    </div>
  );
}

/* ─── Side Quest 节点 ─── */
function SideQuestNode({ quest }: { quest: LadderSideQuest }) {
  return (
    <div className="bg-white/[0.025] border border-white/[0.06] rounded-lg p-3.5 px-4 relative transition-all duration-200 hover:bg-white/[0.05] hover:border-white/10">
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-6 h-6 rounded-[5px] flex items-center justify-center text-[12px] shrink-0"
          style={{ background: quest.iconBg, color: quest.iconColor }}
        >
          {quest.icon}
        </div>
        <span className="font-mono text-[13px] font-bold" style={{ color: quest.nameColor }}>
          {quest.name}
        </span>
        <span className="font-mono text-[10px] text-[#4a5060] ml-auto uppercase tracking-[0.5px]">
          {quest.levelTag}
        </span>
      </div>
      <p className="text-[12.5px] text-[#6b7280] leading-[1.7]">{quest.description}</p>
    </div>
  );
}

/* ══════════════════════════════════════════
   主组件
   ══════════════════════════════════════════ */
export default function LadderPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#080c14] text-[#e2e5ed]" style={{ fontFamily: "'Noto Sans SC', 'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* ═══ NAVBAR ═══ */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#080c14]/80 backdrop-blur-xl border-b border-white/[0.05]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(238,84%,67%)] to-[hsl(263,70%,58%)] flex items-center justify-center shadow-lg shadow-[hsl(238,84%,67%)]/25">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight leading-none text-white">GESP AI</span>
              <span className="text-[9px] text-white/30 leading-tight">智能备考助手</span>
            </div>
          </Link>
          <div className="hidden sm:flex items-center gap-8">
            <Link href="/#features" className="text-sm text-white/40 hover:text-white/80 transition-colors">为什么选我们</Link>
            <Link href="/#pricing" className="text-sm text-white/40 hover:text-white/80 transition-colors">定价</Link>
            <Link href="/ladder" className="text-sm text-white/80 transition-colors">天梯</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-white/50 hover:text-white transition-colors px-3 py-1.5">
              登录
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium px-4 py-2 rounded-lg bg-gradient-to-r from-[hsl(238,84%,67%)] to-[hsl(263,70%,58%)] text-white hover:opacity-90 transition-opacity shadow-lg shadow-[hsl(238,84%,67%)]/20"
            >
              免费试用
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ 内容区 ═══ */}
      <div className="max-w-[900px] mx-auto px-5 pt-28 pb-20 sm:pt-32">
        {/* Header */}
        <header className="text-center mb-14 relative">
          <div className="inline-block font-mono text-[10px] tracking-[2px] text-amber-400/70 mb-3">
            ◆ QUEST MAP ◆
          </div>
          <h1
            className="text-[30px] font-black tracking-[-0.5px] mb-2.5"
            style={{
              background: "linear-gradient(135deg, #fff 0%, #7dd3fc 50%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            信息学奥赛天梯
          </h1>
          <div className="text-[13px] text-[#4a5060] font-light">
            NOI系列赛事 · CCF主办 · <span className="text-[#6b7280]">Lv.1 GESP → Lv.7 IOI</span> · 数据截至2025年
          </div>
        </header>

        {/* Boss 卡片 + XP Bridge 交替 */}
        {BOSSES.map((boss, i) => (
          <div key={boss.id}>
            <BossCard boss={boss} index={i} />
            {i < BRIDGES.length && <XpBridgeComponent bridge={BRIDGES[i]} />}
          </div>
        ))}

        {/* ═══ 支线副本 ═══ */}
        <div className="mt-12 pt-7 border-t border-white/[0.06]">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="text-[16px] opacity-70">🌿</span>
            <span className="text-sm font-bold text-[#6b7280] tracking-[1.5px] uppercase font-mono">
              支线副本 · Side Quests
            </span>
          </div>
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* 中线装饰 */}
            <div
              className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 opacity-[0.15]"
              style={{ background: "linear-gradient(180deg, #a78bfa 0%, #60a5fa 50%, #22d3ee 100%)" }}
            />
            {SIDE_QUESTS.map((quest, i) => (
              <SideQuestNode key={i} quest={quest} />
            ))}
          </div>
        </div>

        {/* ═══ 数据来源 Footer ═══ */}
        <div className="mt-12 pt-5 border-t border-white/[0.06] text-[11.5px] text-[#4a5060] leading-[1.8]">
          <p>
            <strong className="text-[#6b7280]">数据来源：</strong>
            CSP-J/S、NOIP、NOI获奖人数均来自NOI.cn官网2025年获奖名单统计。参赛人数为估算值。IOI奖牌比例为历年惯例。
          </p>
          <p className="mt-1">
            <strong className="text-[#6b7280]">关键区分：</strong>
            {`GESP为"等级认证"、CSP-J/S为"能力认证"，官方定义均非"竞赛"；NOIP为"联赛"（教育部白名单）；NOI为"竞赛"（国赛）。此区分在政策合规和招生口径中有实际意义。`}
          </p>
          <p className="mt-1">
            <strong className="text-[#6b7280]">编程语言：</strong>
            NOI系列赛事自2022年起仅支持C++。GESP另支持Python和图形化编程。
          </p>
        </div>
      </div>

      {/* ═══ 站点 Footer ═══ */}
      <footer className="border-t border-white/[0.04] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-[hsl(238,84%,67%)] to-[hsl(263,70%,58%)] flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-xs text-white/25">© 2025 GESP AI. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/#features" className="text-xs text-white/20 hover:text-white/40 transition-colors">功能</Link>
            <Link href="/#pricing" className="text-xs text-white/20 hover:text-white/40 transition-colors">定价</Link>
            <Link href="/ladder" className="text-xs text-white/40 transition-colors">天梯</Link>
            <Link href="/login" className="text-xs text-white/20 hover:text-white/40 transition-colors">登录</Link>
          </div>
        </div>
      </footer>

      {/* ─── 自定义动画 ─── */}
      <style jsx>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 8px var(--glow-dim, rgba(255,255,255,0.2)); }
          50% { box-shadow: 0 0 16px var(--glow-bright, rgba(255,255,255,0.4)); }
        }
      `}</style>
    </div>
  );
}
