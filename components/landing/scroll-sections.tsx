"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Check,
  ChevronRight,
  Clock,
  ArrowRight,
} from "lucide-react";

// ══════════════════════════════════════════
// 导航栏
// ══════════════════════════════════════════
export function Navbar({ scrolled }: { scrolled: boolean }) {
  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#06060f]/80 backdrop-blur-xl border-b border-white/[0.05]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5b6af0] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-[#5b6af0]/25 group-hover:shadow-[#5b6af0]/40 transition-shadow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight leading-none text-white">GESP.AI</span>
        </Link>
        <div className="hidden sm:flex items-center gap-8">
          <Link href="/ladder" className="text-sm text-white/40 hover:text-white/80 transition-colors">
            天梯
          </Link>
          <a href="#pricing" className="text-sm text-white/40 hover:text-white/80 transition-colors">
            定价
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-white/50 hover:text-white transition-colors px-3 py-1.5">
            登录
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium px-4 py-2 rounded-lg bg-gradient-to-r from-[#5b6af0] to-[#8b5cf6] text-white hover:opacity-90 transition-opacity shadow-lg shadow-[#5b6af0]/20"
          >
            免费试用
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ══════════════════════════════════════════
// Hero（首屏，3D 背景）
// ══════════════════════════════════════════

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-end pb-28 pt-16">
      <div className="relative z-10 text-center px-4">
        <h1
          className="landing-hero-title text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-none mb-6 bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(135deg, #fff 0%, #c8ceff 50%, #a5b4fc 100%)",
          }}
        >
          GESP AI私教
        </h1>

        <Link
          href="/register"
          className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#5b6af0] to-[#8b5cf6] text-white font-medium hover:opacity-90 transition-all shadow-xl shadow-[#5b6af0]/25 hover:shadow-[#5b6af0]/40"
        >
          免费体验
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-white/20 animate-bounce" style={{ animationDuration: "1.5s" }} />
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════
// 场景区（一屏一个场景）
// ══════════════════════════════════════════
const SCENARIOS = [
  {
    title: "晚上十点，孩子卡住了，你帮不了",
    scene: "孩子在刷 GESP 四级真题，卡在一道链表题上。离考试还有 3 周，他急得快哭了。你坐过去看——满屏的指针和地址，你一个字也看不懂。",
    response: "凌晨两点也能问。AI 先问「你卡在哪一步？」，再用「火车车厢挂钩」类比讲链表操作，一步步引导。你不用懂 C++，孩子不用等天亮。",
  },
  {
    title: "用了 ChatGPT，反而更糟了",
    scene: "你让孩子用 ChatGPT 辅导。它给了一段代码，用了 STL 的 reverse——那是六级内容。孩子照抄，AC 了，以为自己会了。但四级考试不让用 STL，他根本不会手写。",
    response: "AI 知道你孩子目标是几级。四级的孩子问到六级内容，AI 会说「这个是六级的，等你过了四级我们再学」。而且永远不给完整代码，逼孩子自己写。",
  },
  {
    title: "「会了」——考场上一个字写不出来",
    scene: "看完 DFS 的讲解视频，孩子说「懂了」。你让他关掉视频自己写一遍。20 分钟，一行代码没敲出来。GESP 考试要求从空白编辑器手写，看懂和写出来之间差了十万八千里。",
    response: "AI 不信「懂了」两个字。它装成不会 DFS 的同学：「你能给我讲讲 vis 数组什么时候标记吗？如果要找所有路径呢？」——讲不出来的地方，就是上考场会卡住的地方。",
  },
  {
    title: "数组越界，上周错了，这周又错了",
    scene: "洛谷真题，数据范围 n ≤ 1000，孩子开了 a[100]。Runtime Error。你说「上次不是讲过了吗？」他说「我忘了」。你很崩溃。",
    response: "第三次犯同样的错时，系统里已经有了一条规则：「数组大小要比数据范围多开 1」。以后每次提交前自动扫描，踩到就弹窗拦住。错得越多，铠甲越厚。",
  },
  {
    title: "报了冲刺班，进度不是你家的进度",
    scene: "GESP 冲刺班，8 个孩子一个班，800 块一节。老师讲到图论了，你家孩子排序还没搞明白。但课不能停，停了就跟不上了。",
    response: "AI 看的是你孩子自己的数据：哪些知识点正确率低、哪种错误犯得多、费曼验证哪里卡住了。每天自动推任务，只补他的短板。每天不到 2 块钱。",
  },
];

function ScenarioVisual({ index }: { index: number }) {
  if (index === 0) return (
    <div className="relative">
      <div className="absolute -inset-16 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="relative rounded-2xl border border-white/[0.06] bg-[#0a0a1a] overflow-hidden shadow-2xl shadow-black/40">
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.04] bg-white/[0.02]">
          <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/60" /><div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/60" /><div className="w-2.5 h-2.5 rounded-full bg-[#28c840]/60" /></div>
          <span className="text-[10px] text-white/15 ml-2 font-mono">linked_list.cpp</span>
          <span className="text-[10px] text-amber-400/40 ml-auto font-mono">22:47</span>
        </div>
        <div className="p-4 font-mono text-[11px] sm:text-xs leading-6">
          <div><span className="text-purple-400/50">struct</span> <span className="text-blue-300/50">Node</span> <span className="text-white/20">{"{"}</span></div>
          <div className="pl-4"><span className="text-blue-300/50">int</span> <span className="text-white/25">data;</span></div>
          <div className="pl-4"><span className="text-blue-300/50">Node</span><span className="text-white/15">*</span> <span className="text-white/25">next;</span></div>
          <div><span className="text-white/20">{"};"}</span></div>
          <div className="h-3" />
          <div><span className="text-white/25">p</span><span className="text-white/15">{"->"}</span><span className="text-white/25">next</span> <span className="text-white/15">=</span> <span className="text-white/25">q</span><span className="text-white/15">{"->"}</span><span className="text-white/25">next</span><span className="text-white/15">;</span></div>
          <div><span className="text-white/25">q</span><span className="text-white/15">{"->"}</span><span className="text-white/25">next</span> <span className="text-white/15">=</span> <span className="text-white/25">p</span><span className="text-white/15">;</span></div>
          <div className="mt-1"><span className="text-red-400/50">{"// 为什么输出还是错的？？"}</span></div>
          <div className="mt-1 inline-block w-1.5 h-4 bg-white/25 animate-pulse" />
        </div>
      </div>
    </div>
  );

  if (index === 1) return (
    <div className="relative">
      <div className="absolute -inset-16 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="relative space-y-3">
        <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a1a] p-4 shadow-2xl shadow-black/40">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-[#10a37f]/20 flex items-center justify-center"><span className="text-[9px] text-[#10a37f]/80">G</span></div>
            <span className="text-[10px] text-white/20">ChatGPT</span>
          </div>
          <div className="font-mono text-[11px] leading-5">
            <div className="text-green-400/30">#include &lt;algorithm&gt;</div>
            <div className="text-white/20 mt-0.5">reverse(a, a + n);</div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
            <span className="text-red-400 text-xs">&#9888;</span>
            <span className="text-[11px] text-red-400/80 font-medium">超纲：六级内容</span>
          </div>
        </div>
        <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03] px-4 py-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-emerald-400/50 font-mono">Accepted &#10003;</span>
            <span className="text-[10px] text-white/15">但他真的会了吗？</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (index === 2) return (
    <div className="relative">
      <div className="absolute -inset-16 bg-[radial-gradient(ellipse_at_center,rgba(91,106,240,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="relative rounded-2xl border border-white/[0.06] bg-[#0a0a1a] overflow-hidden shadow-2xl shadow-black/40">
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.04] bg-white/[0.02]">
          <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/60" /><div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/60" /><div className="w-2.5 h-2.5 rounded-full bg-[#28c840]/60" /></div>
          <span className="text-[10px] text-white/15 ml-2 font-mono">dfs_solution.cpp</span>
          <span className="text-[10px] text-white/10 ml-auto font-mono">GESP 考试模式</span>
        </div>
        <div className="p-4 min-h-[140px] flex items-start">
          <div className="font-mono text-xs">
            <span className="text-white/10 select-none mr-3">1</span>
            <span className="inline-block w-1.5 h-4 bg-white/30 animate-pulse" />
          </div>
        </div>
        <div className="px-4 py-3 border-t border-white/[0.04] bg-white/[0.01]">
          <span className="text-[10px] text-white/10 font-mono">已过 20:00 &middot; 0 行代码</span>
        </div>
      </div>
    </div>
  );

  if (index === 3) return (
    <div className="relative">
      <div className="absolute -inset-16 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="relative rounded-2xl border border-white/[0.06] bg-[#0a0a1a] overflow-hidden shadow-2xl shadow-black/40">
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.04] bg-white/[0.02]">
          <span className="text-[10px] text-white/15 font-mono">提交记录</span>
        </div>
        <div className="p-3 space-y-2 font-mono text-[11px]">
          {["3 月 5 日", "3 月 12 日", "3 月 19 日"].map((d) => (
            <div key={d} className="flex items-center justify-between px-3 py-2 rounded-lg bg-red-500/[0.05] border border-red-500/10">
              <span className="text-red-400/60">Runtime Error</span>
              <span className="text-white/10">{d}</span>
            </div>
          ))}
          <div className="mt-1 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <div className="text-white/20 text-[10px]">原因：a[100]，数据范围 n &#8804; 1000</div>
            <div className="text-amber-400/40 text-[10px] mt-1">同一个错误，第 3 次了</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <div className="absolute -inset-16 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="relative rounded-2xl border border-white/[0.06] bg-[#0a0a1a] overflow-hidden shadow-2xl shadow-black/40">
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.04] bg-white/[0.02]">
          <span className="text-[10px] text-white/15 font-mono">GESP 冲刺班进度</span>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-white/25">班级进度</span>
              <span className="text-[10px] text-white/15 font-mono">图论 &middot; DFS / BFS</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.04]"><div className="h-full rounded-full bg-white/15 w-[75%]" /></div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-amber-400/50">你家孩子</span>
              <span className="text-[10px] text-amber-400/30 font-mono">排序 &middot; 还没搞明白</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.04]"><div className="h-full rounded-full bg-amber-400/30 w-[30%]" /></div>
          </div>
          <div className="h-px bg-white/[0.04]" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/15">&#165;800 / 节 &middot; 8 人班</span>
            <span className="text-[10px] text-white/10">课不能停</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScenarioBlock({ scenario, index }: { scenario: typeof SCENARIOS[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isEven = index % 2 === 0;

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden py-20">
      {/* Large background number */}
      <div className={`absolute ${isEven ? "left-4 sm:left-12" : "right-4 sm:right-12"} top-1/2 -translate-y-1/2 text-[10rem] sm:text-[14rem] lg:text-[18rem] font-black text-white/[0.02] leading-none select-none pointer-events-none`}>
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className={`relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
        <div className={isEven ? "lg:order-1" : "lg:order-2"}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-mono tracking-widest text-white/15">{String(index + 1).padStart(2, "0")}</span>
            <div className="h-px w-12 bg-gradient-to-r from-[#5b6af0]/30 to-transparent" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-bold text-white/90 mb-6 tracking-tight leading-snug">
            {scenario.title}
          </h2>
          <p className="text-base sm:text-lg text-white/30 leading-relaxed mb-8">
            {scenario.scene}
          </p>
          <p className="text-base sm:text-lg text-white/60 leading-relaxed pl-5 border-l-2 border-l-[#5b6af0]/40">
            {scenario.response}
          </p>
        </div>

        <div className={`${isEven ? "lg:order-2" : "lg:order-1"} hidden sm:block`}>
          <ScenarioVisual index={index} />
        </div>
      </div>
    </section>
  );
}

export function ScenarioSections() {
  return (
    <>
      {SCENARIOS.map((s, i) => (
        <ScenarioBlock key={i} scenario={s} index={i} />
      ))}
    </>
  );
}

// ══════════════════════════════════════════
// AI 对话预览（多场景 Tab）
// ══════════════════════════════════════════
const AI_SCENARIOS = [
  {
    tab: "概念讲解",
    title: "DFS 深度优先搜索",
    lines: [
      { role: "student" as const, text: "老师，DFS 的 vis 数组要在哪里标记？" },
      { role: "ai" as const, text: "好问题！想象你在走迷宫——走到一个路口就放一块石头，这样回头时就知道来过了。vis[i] = true 就是「放石头」，要在进入节点的那一刻做。" },
      { role: "student" as const, text: "那回溯的时候要把石头捡回来吗？" },
      { role: "ai" as const, text: "看情况！如果你要找「所有路径」，石头要捡回来（回溯）；如果只是判断能不能到终点，石头留着就好。你先试试写一版？我帮你看。" },
    ],
  },
  {
    tab: "调试纠错",
    title: "调试 · 数组越界排查",
    lines: [
      { role: "student" as const, text: "老师，我的代码提交报 Runtime Error，但本地运行没问题" },
      { role: "ai" as const, text: "别急！RE 最常见的原因是数组越界。你的数组开了多大？题目数据范围是多少？" },
      { role: "student" as const, text: "数组开了 a[100]，数据范围 n ≤ 1000..." },
      { role: "ai" as const, text: "找到了！数组只有 100 个位置，但数据最大有 1000 个。把 a[100] 改成 a[1001] 试试——多开 1 个是好习惯，防止边界问题。" },
    ],
  },
  {
    tab: "学习规划",
    title: "学习规划 · GESP 三级",
    lines: [
      { role: "student" as const, text: "老师，我想考 GESP 三级，还有两个月，该怎么准备？" },
      { role: "ai" as const, text: "两个月完全来得及！GESP 三级重点考排序、字符串处理和简单递推。我看你排序掌握得不错，字符串还需要加强。" },
      { role: "student" as const, text: "那我每天要学多久？" },
      { role: "ai" as const, text: "建议每天 40-60 分钟：前 30 天主攻知识点 + 配套练题，后 30 天做真题 + 查漏补缺。我来帮你生成每日任务表？" },
    ],
  },
];

export function AIPreviewSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const triggeredRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const startAnimation = (tabIdx: number) => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setVisibleLines(0);
    AI_SCENARIOS[tabIdx].lines.forEach((_, i) => {
      const t = setTimeout(() => setVisibleLines(i + 1), 400 + i * 900);
      timersRef.current.push(t);
    });
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggeredRef.current) {
          triggeredRef.current = true;
          startAnimation(0);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      timersRef.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (idx: number) => {
    if (idx === activeTab) return;
    setActiveTab(idx);
    startAnimation(idx);
  };

  const scenario = AI_SCENARIOS[activeTab];
  const lines = scenario.lines;

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            孩子和{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #5b6af0, #c084fc)" }}>
              GESP.AI
            </span>{" "}
            私教对话的样子
          </h2>
        </div>

        {/* Tab buttons */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {AI_SCENARIOS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleTabChange(i)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === i
                  ? "bg-[#5b6af0]/20 text-white border border-[#5b6af0]/40"
                  : "bg-white/[0.03] text-white/30 border border-white/[0.06] hover:text-white/50"
              }`}
            >
              {s.tab}
            </button>
          ))}
        </div>

        {/* Chat mockup */}
        <div className="relative">
          {/* 外围径向渐变光晕 */}
          <div className="absolute -inset-20 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(91,106,240,0.08)_0%,transparent_70%)] pointer-events-none" />
          <div ref={ref} className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.04]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]/70" />
            </div>
            <span className="text-[10px] text-white/20 font-mono ml-2">GESP.AI 私教 · {scenario.title}</span>
          </div>

          <div className="p-4 sm:p-5 space-y-4 min-h-[200px]">
            {lines.slice(0, visibleLines).map((line, i) => (
              <div
                key={`${activeTab}-${i}`}
                className={`flex gap-2.5 ${line.role === "student" ? "justify-end" : ""}`}
                style={{ animation: "fadeIn 0.3s ease-out forwards" }}
              >
                {line.role === "ai" && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#5b6af0] to-[#8b5cf6] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
                <div
                  className={`text-xs sm:text-sm leading-relaxed px-3 py-2.5 rounded-2xl max-w-[85%] ${
                    line.role === "ai"
                      ? "bg-white/[0.04] text-white/60 border-l-2 border-l-[#5b6af0]/50"
                      : "bg-[#5b6af0]/15 text-white/70 border-r-2 border-r-[#5b6af0]/40"
                  }`}
                >
                  {line.text}
                </div>
              </div>
            ))}

            {visibleLines > 0 && visibleLines < lines.length && (
              <div className="flex gap-2.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#5b6af0] to-[#8b5cf6] flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="flex items-center gap-1 px-3 py-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}


// ══════════════════════════════════════════
// 定价
// ══════════════════════════════════════════
const PRICING_PLANS = [
  {
    name: "免费体验", price: "¥0", period: "月", subtitle: "永久免费，无需绑卡",
    features: ["每日 3 题练习", "基础 AI 辅导", "知识点地图浏览", "学习进度追踪"],
    popular: false,
  },
  {
    name: "标准版", price: "¥49", period: "月", subtitle: "≈ 线下一节课的价格，用一整月",
    features: ["无限刷题 + 在线评测", "GESP.AI 私教不限次对话", "AI 自动规划每日任务", "错题三问复盘 + 防错规则", "GESP.AI 私教·验证训练", "XP 经验值与成就徽章"],
    popular: true,
  },
  {
    name: "冲刺版", price: "¥99", period: "月", subtitle: "考前最后一个月的秘密武器",
    features: ["标准版全部功能", "无限模拟考试", "AI 生成考前冲刺计划", "优先 AI 响应速度", "薄弱知识点专项强化", "详细学情分析报告"],
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-white">
            一节线下课的钱
            <span className="bg-clip-text text-transparent ml-1" style={{ backgroundImage: "linear-gradient(135deg, #5b6af0, #8b5cf6)" }}>
              ，用一整个月
            </span>
          </h2>
        </div>

        {/* Comparison table */}
        <div className="mb-10 overflow-x-auto">
          <table className="w-full max-w-2xl mx-auto text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="py-3 px-4 text-left text-white/30 font-normal"></th>
                <th className="py-3 px-4 text-center text-white/40 font-normal">线下 1v1</th>
                <th className="py-3 px-4 text-center text-white/40 font-normal">网课大班</th>
                <th className="py-3 px-4 text-center font-medium text-white relative">
                  <span className="absolute top-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-[#5b6af0] to-[#8b5cf6]" />
                  GESP.AI
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/[0.04]">
                <td className="py-3 px-4 text-white/40">月费</td>
                <td className="py-3 px-4 text-center text-white/30">¥1,200-3,200</td>
                <td className="py-3 px-4 text-center text-white/30">¥200-500</td>
                <td className="py-3 px-4 text-center text-emerald-400 font-medium">¥49</td>
              </tr>
              <tr className="border-b border-white/[0.04]">
                <td className="py-3 px-4 text-white/40">答疑时间</td>
                <td className="py-3 px-4 text-center text-white/30">上课时间</td>
                <td className="py-3 px-4 text-center text-white/30">有限</td>
                <td className="py-3 px-4 text-center text-emerald-400 font-medium">24 小时</td>
              </tr>
              <tr className="border-b border-white/[0.04]">
                <td className="py-3 px-4 text-white/40">个性化</td>
                <td className="py-3 px-4 text-center text-white/50">&#10003; 老师面授</td>
                <td className="py-3 px-4 text-center text-white/20">&#10007; 统一进度</td>
                <td className="py-3 px-4 text-center text-emerald-400 font-medium">&#10003; AI 自适应</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-white/40">错题管理</td>
                <td className="py-3 px-4 text-center text-white/20">&#10007; 靠自觉</td>
                <td className="py-3 px-4 text-center text-white/20">&#10007; 无</td>
                <td className="py-3 px-4 text-center text-emerald-400 font-medium">&#10003; 自动复盘</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 items-start">
          {PRICING_PLANS.map((plan, i) => (
            <div key={i} className={`group relative ${plan.popular ? "lg:-mt-4" : ""}`}>
              {plan.popular && (
                <div
                  className="absolute -inset-[1px] rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, #5b6af0, #8b5cf6, #5b6af0)",
                    backgroundSize: "200% 200%",
                    animation: "gradient-shift 3s ease infinite",
                  }}
                />
              )}
              {!plan.popular && <div className="absolute -inset-[1px] rounded-2xl border border-white/[0.06] transition-colors duration-300 group-hover:border-white/[0.12]" />}
              <div className="landing-pricing-card relative rounded-2xl p-6 sm:p-8 h-full flex flex-col">
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-[11px] font-semibold tracking-wider uppercase px-4 py-1 rounded-full bg-gradient-to-r from-[#5b6af0] to-[#8b5cf6] text-white">
                      最受欢迎
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-white/60 text-sm font-medium mb-3">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white tracking-tight">{plan.price}</span>
                    <span className="text-white/30 text-sm">/{plan.period}</span>
                  </div>
                  <p className="text-xs text-emerald-400/70 mt-2">{plan.subtitle}</p>
                </div>
                <ul className="space-y-3.5 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-white/60">
                      <Check className="w-4 h-4 text-emerald-400/70 shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block w-full text-center py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-[#5b6af0] to-[#8b5cf6] text-white hover:opacity-90 shadow-lg shadow-[#5b6af0]/20"
                      : "bg-white/[0.06] text-white/80 hover:bg-white/[0.1] border border-white/[0.06]"
                  }`}
                >
                  {plan.popular ? "免费试用" : plan.name === "免费体验" ? "免费注册" : "免费试用"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════
// CTA + Footer
// ══════════════════════════════════════════

function getNextGESPExam(): number {
  const now = new Date();
  const year = now.getFullYear();
  const examMonths = [3, 6, 9, 12];

  for (const month of examMonths) {
    const examDate = new Date(year, month - 1, 15);
    if (examDate > now) {
      return Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }
  }
  const nextExam = new Date(year + 1, 2, 15);
  return Math.ceil((nextExam.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function CTASection() {
  const [daysToExam, setDaysToExam] = useState<number | null>(null);

  useEffect(() => {
    setDaysToExam(getNextGESPExam());
  }, []);

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* 慢速脉冲动画 keyframes */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.05); }
        }
      `}</style>

      {/* 大面积径向渐变光晕背景 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(91,106,240,0.06)_0%,transparent_60%)] pointer-events-none" />
      <div className="relative text-center max-w-2xl mx-auto px-4 sm:px-6">
        {/* 考试倒计时 */}
        {daysToExam !== null && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] mb-8">
            <Clock className="w-3 h-3 text-amber-400" />
            <span className="text-xs text-white/40">
              距离下一场 GESP 考试还有{" "}
              <span
                className="font-bold bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #5b6af0, #c084fc)" }}
              >
                {daysToExam}
              </span>{" "}
              天
            </span>
          </div>
        )}

        <Link
          href="/register"
          className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#5b6af0] to-[#8b5cf6] text-white font-medium text-lg hover:opacity-90 transition-all shadow-2xl shadow-[#5b6af0]/25 hover:shadow-[#5b6af0]/40"
        >
          <span
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#5b6af0] to-[#8b5cf6]"
            style={{ animation: "pulse-slow 3s ease-in-out infinite" }}
          />
          <span className="relative">免费试用，立即开始</span>
          <ChevronRight className="relative w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-[#5b6af0] to-[#8b5cf6] flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="text-xs text-white/25">&copy; 2025 GESP.AI. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/ladder" className="text-xs text-white/20 hover:text-white/40 transition-colors">天梯</Link>
          <Link href="/login" className="text-xs text-white/20 hover:text-white/40 transition-colors">登录</Link>
          <Link href="/register" className="text-xs text-white/20 hover:text-white/40 transition-colors">注册</Link>
        </div>
      </div>
    </footer>
  );
}
