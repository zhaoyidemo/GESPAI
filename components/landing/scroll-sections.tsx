"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Check,
  ChevronRight,
  MessageCircle,
  Clock,
  SearchCode,
  BarChart3,
  Zap,
  Brain,
  Target,
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
            天梯排行
          </Link>
          <a href="#pain" className="text-sm text-white/40 hover:text-white/80 transition-colors">
            为什么选我们
          </a>
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

const ROTATING_WORDS = ["答疑", "规划", "纠错", "陪练", "冲刺"];

export function HeroSection() {
  const [wordIdx, setWordIdx] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setWordIdx((prev) => (prev + 1) % ROTATING_WORDS.length);
        setFadeIn(true);
      }, 300);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16">
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm mb-8">
          <Zap className="w-3 h-3 text-amber-400" />
          <span className="text-xs text-white/50">专为 GESP C++ 1-8 级设计 · 184+ 真题 · AI 驱动</span>
        </div>

        {/* Main title */}
        <h1 className="landing-hero-title text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tighter leading-none mb-6">
          <span className="landing-exclusion-text">GESP.AI</span>
        </h1>

        {/* Subtitle with rotating word */}
        <p className="text-xl sm:text-2xl lg:text-3xl text-white/60 font-light max-w-2xl mx-auto mb-3 landing-subtitle leading-relaxed">
          超算大脑，24 小时
          <span
            className="inline-block min-w-[3em] text-transparent bg-clip-text font-medium transition-all duration-300"
            style={{
              backgroundImage: "linear-gradient(135deg, #5b6af0, #c084fc)",
              opacity: fadeIn ? 1 : 0,
              transform: fadeIn ? "translateY(0)" : "translateY(8px)",
            }}
          >
            {ROTATING_WORDS[wordIdx]}
          </span>
        </p>
        <p className="text-sm sm:text-base text-white/30 max-w-lg mx-auto mb-8 leading-relaxed">
          别的家长花 300-800 元/小时请线下老师。<br />
          你的孩子有一个 ¥49/月的 AI 编程私教，永远不累、永远耐心。
        </p>

        {/* Price anchor + trust row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
            <span className="text-[11px] text-white/25 line-through">线下 1v1：¥300+/h</span>
            <span className="text-[11px] text-white/15">→</span>
            <span className="text-[11px] text-emerald-400/80 font-medium">GESP.AI：¥49/月</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/70" />
            <span className="text-[11px] text-white/40">已有家长正在使用</span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#5b6af0] to-[#8b5cf6] text-white font-medium hover:opacity-90 transition-all shadow-xl shadow-[#5b6af0]/25 hover:shadow-[#5b6af0]/40"
          >
            免费试用，30 秒注册
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <span className="text-xs text-white/15">无需付费 · 无需绑卡</span>
        </div>
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
// 痛点（2x2 卡片）
// ══════════════════════════════════════════
const PAIN_POINTS = [
  {
    icon: MessageCircle,
    pain: "晚上 10 点，孩子做题卡住了",
    solution: "AI 私教 24 小时在线",
    detail: "凌晨两点也能问。AI 用孩子听得懂的比喻讲解，一步步引导思考——而不是直接给答案。",
    color: "#60a5fa",
  },
  {
    icon: Clock,
    pain: "每天学什么？练什么？毫无头绪",
    solution: "AI 自动规划每日任务",
    detail: "输入目标级别和考试日期，AI 分析薄弱点，每天自动推送「今天学什么 + 练哪题」。",
    color: "#8b5cf6",
  },
  {
    icon: SearchCode,
    pain: "同一个坑，掉了三次",
    solution: "三问复盘 + 智能防错规则",
    detail: "错了哪？为什么错？怎么防？AI 自动生成防错规则，下次提交前主动提醒。",
    color: "#c084fc",
  },
  {
    icon: BarChart3,
    pain: "花了几千块，到底有没有用？",
    solution: "数据全透明，一目了然",
    detail: "知识点掌握度、任务完成率、模拟考通过率——所有学习数据实时可见。",
    color: "#f59e0b",
  },
];

export function PainPointsSection() {
  return (
    <section id="pain" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest uppercase text-white/25 mb-3">为什么选择 GESP.AI</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            这些场景，是不是你家的
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #5b6af0, #c084fc)" }}>日常？</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          {PAIN_POINTS.map((point, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 transition-colors duration-200 hover:bg-white/[0.04]"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `${point.color}15`, border: `1px solid ${point.color}25` }}
                >
                  <point.icon className="w-4 h-4" style={{ color: point.color }} />
                </div>
                <div>
                  <p className="text-sm text-white/30 mb-1.5">{point.pain}</p>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5">{point.solution}</h3>
                  <p className="text-xs sm:text-sm text-white/35 leading-relaxed">{point.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════
// 三步上手
// ══════════════════════════════════════════
const STEPS = [
  { step: "01", title: "注册 & 设定目标", desc: "选择目标 GESP 级别和考试日期，30 秒完成", icon: Target },
  { step: "02", title: "AI 生成专属计划", desc: "AI 分析知识点缺口，自动排出每日学习 + 练题任务", icon: Brain },
  { step: "03", title: "学、练、问、纠", desc: "跟着计划走：看讲解、做题、随时提问、错题自动复盘", icon: Zap },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="absolute left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest uppercase text-white/25 mb-3">如何开始</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            三步，让 AI 接管备考规划
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 sm:gap-10">
          {STEPS.map((s, i) => (
            <div key={i} className="relative text-center">
              <div className="text-5xl font-bold text-white/[0.04] absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 select-none pointer-events-none">
                {s.step}
              </div>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                  <s.icon className="w-5 h-5 text-white/50" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-white/35 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════
// AI 对话预览
// ══════════════════════════════════════════
const AI_LINES = [
  { role: "student" as const, text: "老师，DFS 的 vis 数组要在哪里标记？" },
  { role: "ai" as const, text: "好问题！想象你在走迷宫——走到一个路口就放一块石头，这样回头时就知道来过了。vis[i] = true 就是「放石头」，要在进入节点的那一刻做。" },
  { role: "student" as const, text: "那回溯的时候要把石头捡回来吗？" },
  { role: "ai" as const, text: "看情况！如果你要找「所有路径」，石头要捡回来（回溯）；如果只是判断能不能到终点，石头留着就好。你先试试写一版？我帮你看。" },
];

export function AIPreviewSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState(0);
  const triggeredRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggeredRef.current) {
          triggeredRef.current = true;
          AI_LINES.forEach((_, i) => {
            setTimeout(() => setVisibleLines(i + 1), 400 + i * 900);
          });
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-xs tracking-widest uppercase text-white/25 mb-3">真实体验</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            孩子和{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #5b6af0, #c084fc)" }}>
              GESP.AI
            </span>{" "}
            私教对话的样子
          </h2>
          <p className="text-sm text-white/30">不是冷冰冰的答案输出，是引导思考的教学对话</p>
        </div>

        {/* Chat mockup */}
        <div ref={ref} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.04]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
            </div>
            <span className="text-[10px] text-white/20 font-mono ml-2">GESP.AI 私教 · DFS 深度优先搜索</span>
          </div>

          <div className="p-4 sm:p-5 space-y-4 min-h-[200px]">
            {AI_LINES.slice(0, visibleLines).map((line, i) => (
              <div
                key={i}
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
                      ? "bg-white/[0.04] text-white/60"
                      : "bg-[#5b6af0]/15 text-white/70"
                  }`}
                >
                  {line.text}
                </div>
              </div>
            ))}

            {visibleLines > 0 && visibleLines < AI_LINES.length && (
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
    </section>
  );
}

// ══════════════════════════════════════════
// 信任数据
// ══════════════════════════════════════════
const TRUST_DATA = [
  { value: "1-8 级", label: "覆盖 GESP 全部级别", sub: "知识点完整对齐官方大纲" },
  { value: "184+", label: "洛谷真题实时同步", sub: "题目内容逐字复制自洛谷" },
  { value: "24h", label: "AI 从不下线", sub: "凌晨两点也能问、也能练" },
  { value: "10 种", label: "错误类型精准诊断", sub: "从语法错误到算法错误全覆盖" },
];

export function TrustSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest uppercase text-white/25 mb-3">硬实力</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            不是花架子，是
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #5b6af0, #c084fc)" }}>真材实料</span>
          </h2>
        </div>

        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {TRUST_DATA.map((item, i) => (
            <TrustItem key={i} {...item} visible={visible} delay={i * 150} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustItem({
  value,
  label,
  sub,
  visible,
  delay,
}: {
  value: string;
  label: string;
  sub: string;
  visible: boolean;
  delay: number;
}) {
  const numRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!visible || animatedRef.current || !numRef.current) return;
    animatedRef.current = true;

    const el = numRef.current;
    const numericMatch = value.match(/(\d+)/);

    if (numericMatch) {
      const target = parseInt(numericMatch[1]);
      const prefix = value.substring(0, value.indexOf(numericMatch[1]));
      const suffix = value.substring(value.indexOf(numericMatch[1]) + numericMatch[1].length);
      const duration = 1500;
      const startTime = performance.now() + delay;

      const step = (now: number) => {
        const elapsed = now - startTime;
        if (elapsed < 0) { requestAnimationFrame(step); return; }
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${prefix}${Math.round(eased * target)}${suffix}`;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    } else {
      setTimeout(() => { el.textContent = value; }, delay);
    }
  }, [visible, value, delay]);

  return (
    <div className="text-center">
      <div
        ref={numRef}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-2 bg-clip-text text-transparent"
        style={{ backgroundImage: "linear-gradient(135deg, #5b6af0, #8b5cf6)" }}
      >
        &nbsp;
      </div>
      <p className="text-sm font-medium text-white/60 mb-1">{label}</p>
      <p className="text-xs text-white/25">{sub}</p>
    </div>
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
          <p className="text-xs tracking-widest uppercase text-white/25 mb-3">简单透明</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-white">
            一节线下课的钱
            <span className="bg-clip-text text-transparent ml-1" style={{ backgroundImage: "linear-gradient(135deg, #5b6af0, #8b5cf6)" }}>
              ，用一整个月
            </span>
          </h2>
          <p className="text-white/30 max-w-lg mx-auto text-sm sm:text-base">
            线下 C++ 培训 300-800 元/小时。GESP.AI 每天不到 2 块钱，不满意随时取消。
          </p>
        </div>

        {/* Price comparison bar */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="flex items-center gap-2 text-xs">
            <div className="h-2 w-32 sm:w-48 rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full w-full rounded-full bg-gradient-to-r from-red-500/50 to-red-500/30" />
            </div>
            <span className="text-white/25">线下 ¥300+/h</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="h-2 w-4 sm:w-6 rounded-full bg-gradient-to-r from-[#5b6af0] to-[#8b5cf6]" />
            <span className="text-white/50 font-medium">GESP.AI ¥49/月</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 items-start">
          {PRICING_PLANS.map((plan, i) => (
            <div key={i} className={`relative ${plan.popular ? "lg:-mt-4" : ""}`}>
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
              {!plan.popular && <div className="absolute -inset-[1px] rounded-2xl border border-white/[0.06]" />}
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
                <ul className="space-y-3 mb-8 flex-1">
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
export function CTASection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="text-center max-w-2xl mx-auto px-4 sm:px-6">
        <p className="text-sm text-white/20 mb-4">还在犹豫？</p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-white leading-tight">
          别让孩子在备考路上<br />
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #5b6af0, #c084fc)" }}>
            孤军奋战
          </span>
        </h2>
        <p className="text-base sm:text-lg text-white/30 mb-10 leading-relaxed">
          下一场 GESP 考试不会等人。<br />
          今天注册，AI 今天就开始帮孩子规划。
        </p>
        <Link
          href="/register"
          className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#5b6af0] to-[#8b5cf6] text-white font-medium text-lg hover:opacity-90 transition-all shadow-2xl shadow-[#5b6af0]/25 hover:shadow-[#5b6af0]/40"
        >
          免费试用，立即开始
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <p className="mt-4 text-xs text-white/15">无需付费 · 30 秒注册 · 随时取消</p>
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
          <Link href="/ladder" className="text-xs text-white/20 hover:text-white/40 transition-colors">天梯排行</Link>
          <Link href="/login" className="text-xs text-white/20 hover:text-white/40 transition-colors">登录</Link>
          <Link href="/register" className="text-xs text-white/20 hover:text-white/40 transition-colors">注册</Link>
        </div>
      </div>
    </footer>
  );
}
