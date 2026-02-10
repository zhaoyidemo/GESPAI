"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Sparkles, Check, ChevronRight } from "lucide-react";

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
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5b6af0] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-[#5b6af0]/25">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight leading-none text-white">GESP AI</span>
            <span className="text-[9px] text-white/30 leading-tight">智能备考助手</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-8">
          <Link href="/ladder" className="text-sm text-white/40 hover:text-white/80 transition-colors">
            天梯
          </Link>
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
// Hero 区块 (0-15%)
// ══════════════════════════════════════════
export function HeroSection() {
  return (
    <section className="landing-section relative min-h-screen flex items-center justify-center">
      <div className="relative z-10 text-center px-4">
        <h1 className="landing-hero-title text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tighter leading-none mb-6">
          <span className="landing-exclusion-text">GESP AI</span>
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-white/50 font-light max-w-xl mx-auto mb-4 landing-subtitle">
          超算大脑，陪孩子征战 GESP
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 landing-scroll-indicator">
        <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-white/20 animate-bounce" style={{ animationDuration: "1.5s" }} />
        </div>
        <span className="text-[10px] text-white/20 tracking-wider uppercase">Scroll</span>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════
// 痛点区块 (20-50%) — 左右交替大文字
// ══════════════════════════════════════════
const PAIN_POINTS = [
  {
    pain: "孩子做题卡住了，\n晚上 10 点没人能问？",
    solution: "AI 老师 24 小时在线答疑",
    detail: "不用等下次上课。孩子随时提问，AI 用比喻和例子讲到听懂为止。",
  },
  {
    pain: "每天不知道\n该学什么、练什么？",
    solution: "AI 自动规划每日学习任务",
    detail: "输入目标级别和考试日期，AI 根据薄弱点自动安排每天的学练内容。",
  },
  {
    pain: "同样的错误，\n一犯再犯？",
    solution: "三问复盘 + 防错规则",
    detail: "错了哪？为什么错？怎么避免？AI 自动生成防错规则，下次主动提醒。",
  },
  {
    pain: "花了钱，不知道\n孩子学到哪了？",
    solution: "学习数据全透明",
    detail: "知识点掌握度、任务完成率、模拟考试通过率——数据清清楚楚。",
  },
];

export function PainPointsSection() {
  return (
    <section className="landing-section relative py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {PAIN_POINTS.map((point, i) => (
          <PainPointItem key={i} {...point} index={i} />
        ))}
      </div>
    </section>
  );
}

function PainPointItem({
  pain,
  solution,
  detail,
  index,
}: {
  pain: string;
  solution: string;
  detail: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const isLeft = index % 2 === 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`flex flex-col ${
        isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
      } items-center gap-8 lg:gap-16 py-16 sm:py-24`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0)"
          : `translateY(40px) translateX(${isLeft ? "-30px" : "30px"})`,
        transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Pain question */}
      <div className={`flex-1 ${isLeft ? "lg:text-right" : "lg:text-left"}`}>
        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white/30 leading-snug whitespace-pre-line">
          {pain}
        </p>
      </div>

      {/* Divider dot */}
      <div className="hidden lg:flex w-3 h-3 rounded-full bg-gradient-to-br from-[#5b6af0] to-[#8b5cf6] shrink-0 shadow-lg shadow-[#5b6af0]/40" />

      {/* Solution */}
      <div className={`flex-1 ${isLeft ? "lg:text-left" : "lg:text-right"}`}>
        <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">{solution}</h3>
        <p className="text-sm sm:text-base text-white/40 leading-relaxed">{detail}</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// 信任数据 (60-75%)
// ══════════════════════════════════════════
const TRUST_DATA = [
  { value: "1-8 级", label: "覆盖 GESP 考纲" },
  { value: "184+", label: "洛谷真题同步" },
  { value: "24h", label: "AI 随时在线" },
  { value: "10 种", label: "错误类型诊断" },
];

export function TrustSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="landing-section relative py-24 sm:py-32">
      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6">
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
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
  visible,
  delay,
}: {
  value: string;
  label: string;
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
      const suffix = value.substring(
        value.indexOf(numericMatch[1]) + numericMatch[1].length
      );
      let start = 0;
      const duration = 1500;
      const startTime = performance.now() + delay;

      const step = (now: number) => {
        const elapsed = now - startTime;
        if (elapsed < 0) {
          requestAnimationFrame(step);
          return;
        }
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        start = Math.round(eased * target);
        el.textContent = `${prefix}${start}${suffix}`;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    } else {
      setTimeout(() => {
        el.textContent = value;
      }, delay);
    }
  }, [visible, value, delay]);

  return (
    <div className="text-center">
      <div
        ref={numRef}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-2 bg-clip-text text-transparent"
        style={{
          backgroundImage: "linear-gradient(135deg, #5b6af0, #8b5cf6)",
        }}
      >
        {/* Filled by animation */}
        &nbsp;
      </div>
      <p className="text-sm font-medium text-white/60">{label}</p>
    </div>
  );
}

// ══════════════════════════════════════════
// 定价 (85-95%)
// ══════════════════════════════════════════
const PRICING_PLANS = [
  {
    name: "免费体验",
    price: "¥0",
    period: "月",
    subtitle: "永久免费，无需绑卡",
    features: ["每日 3 题练习", "基础 AI 辅导", "知识点地图浏览", "学习进度追踪"],
    popular: false,
  },
  {
    name: "标准版",
    price: "¥49",
    period: "月",
    subtitle: "≈ 线下一节课的价格",
    features: [
      "无限刷题 + 在线评测",
      "GESP AI 私教不限次对话",
      "AI 自动规划每日任务",
      "错题三问复盘 + 防错规则",
      "GESP AI 私教·验证训练",
      "XP 经验值与成就徽章",
    ],
    popular: true,
  },
  {
    name: "冲刺版",
    price: "¥99",
    period: "月",
    subtitle: "考前最后一个月强推",
    features: [
      "标准版全部功能",
      "无限模拟考试",
      "AI 生成考前冲刺计划",
      "优先 AI 响应速度",
      "薄弱知识点专项强化",
      "详细学情分析报告",
    ],
    popular: false,
  },
];

export function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="landing-section relative py-24 sm:py-32">
      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6">
        <div
          className="text-center mb-12"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-white">
            一节线下课的钱
            <span className="bg-clip-text text-transparent ml-1" style={{ backgroundImage: "linear-gradient(135deg, #5b6af0, #8b5cf6)" }}>
              ，用一整个月
            </span>
          </h2>
          <p className="text-white/35 max-w-xl mx-auto">
            线下 C++ 1 对 1 培训 300-800 元/小时，GESP AI 从免费开始
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 items-start">
          {PRICING_PLANS.map((plan, i) => (
            <PricingCard key={i} {...plan} visible={visible} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  name,
  price,
  period,
  subtitle,
  features,
  popular,
  visible,
  delay,
}: {
  name: string;
  price: string;
  period: string;
  subtitle: string;
  features: string[];
  popular: boolean;
  visible: boolean;
  delay: number;
}) {
  return (
    <div
      className={`relative ${popular ? "lg:-mt-4" : ""}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {popular && (
        <div
          className="absolute -inset-[1px] rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #5b6af0, #8b5cf6, #5b6af0)",
            backgroundSize: "200% 200%",
            animation: "gradient-shift 3s ease infinite",
          }}
        />
      )}
      {!popular && (
        <div className="absolute -inset-[1px] rounded-2xl border border-white/[0.06]" />
      )}
      <div className="landing-pricing-card relative rounded-2xl p-6 sm:p-8 h-full flex flex-col">
        {popular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="text-[11px] font-semibold tracking-wider uppercase px-4 py-1 rounded-full bg-gradient-to-r from-[#5b6af0] to-[#8b5cf6] text-white">
              最受欢迎
            </span>
          </div>
        )}
        <div className="mb-6">
          <h3 className="text-white/60 text-sm font-medium mb-3">{name}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white tracking-tight">{price}</span>
            <span className="text-white/30 text-sm">/{period}</span>
          </div>
          <p className="text-xs text-emerald-400/70 mt-2">{subtitle}</p>
        </div>
        <ul className="space-y-3 mb-8 flex-1">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-white/60">
              <Check className="w-4 h-4 text-emerald-400/70 shrink-0 mt-0.5" strokeWidth={2.5} />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <Link
          href="/register"
          className={`block w-full text-center py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
            popular
              ? "bg-gradient-to-r from-[#5b6af0] to-[#8b5cf6] text-white hover:opacity-90 shadow-lg shadow-[#5b6af0]/20"
              : "bg-white/[0.06] text-white/80 hover:bg-white/[0.1] border border-white/[0.06]"
          }`}
        >
          {popular ? "免费试用" : name === "免费体验" ? "免费注册" : "免费试用"}
        </Link>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// CTA + Footer (95-100%)
// ══════════════════════════════════════════
export function CTASection() {
  return (
    <section className="landing-section relative py-24 sm:py-32">
      <div className="relative z-10 text-center max-w-2xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-white">
          别让孩子在备考路上孤军奋战
        </h2>
        <p className="text-lg text-white/35 mb-10">
          一个好的 GESP AI 私教，可能就是通过考试的关键
        </p>
        <Link
          href="/register"
          className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#5b6af0] to-[#8b5cf6] text-white font-medium text-lg hover:opacity-90 transition-all shadow-2xl shadow-[#5b6af0]/25 hover:shadow-[#5b6af0]/40"
        >
          免费试用，立即开始
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <p className="mt-4 text-xs text-white/20">无需付费 · 注册即可体验核心功能</p>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.04] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-[#5b6af0] to-[#8b5cf6] flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="text-xs text-white/25">&copy; 2025 GESP AI. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/ladder" className="text-xs text-white/20 hover:text-white/40 transition-colors">
            天梯
          </Link>
          <Link href="/login" className="text-xs text-white/20 hover:text-white/40 transition-colors">
            登录
          </Link>
        </div>
      </div>
    </footer>
  );
}
