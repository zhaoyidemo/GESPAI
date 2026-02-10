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
  Globe,
  ShieldCheck,
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
    <section id="pain" className="relative py-20 sm:py-28">
      {/* 顶部渐变分割线 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            这些场景，是不是你家的
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #5b6af0, #c084fc)" }}>日常？</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          {PAIN_POINTS.map((point, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-5 sm:p-6 transition-all duration-300 hover:bg-white/[0.04]"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-lg transition-shadow duration-300 group-hover:shadow-xl"
                  style={{
                    background: `${point.color}15`,
                    border: `1px solid ${point.color}25`,
                    boxShadow: `0 4px 12px ${point.color}10`,
                  }}
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
    <section className="relative py-20 sm:py-28">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            三步，让 AI 接管备考规划
          </h2>
        </div>

        <div className="relative grid sm:grid-cols-3 gap-6 sm:gap-10">
          {/* 桌面端步骤间虚线连接线 */}
          <div className="hidden sm:block absolute top-6 left-[calc(33.33%+8px)] right-[calc(33.33%+8px)] border-t-2 border-dashed border-white/[0.06]" />
          {STEPS.map((s, i) => (
            <div key={i} className="relative text-center">
              <div
                className="text-5xl font-bold absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 select-none pointer-events-none bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #5b6af0, #8b5cf6)", opacity: 0.1 }}
              >
                {s.step}
              </div>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5b6af0]/10 to-[#8b5cf6]/5 border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                  <s.icon className="w-5 h-5 text-white/50" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-white/35 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* 底部渐变分割线 */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </section>
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
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            孩子和{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #5b6af0, #c084fc)" }}>
              GESP.AI
            </span>{" "}
            私教对话的样子
          </h2>
          <p className="text-sm text-white/30">不是冷冰冰的答案输出，是引导思考的教学对话</p>
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
// 信任数据
// ══════════════════════════════════════════
const TRUST_DATA = [
  { value: "1-8 级", label: "GESP 全级别覆盖", sub: "知识点逐条对齐官方大纲" },
  { value: "184+", label: "洛谷真题在线练", sub: "题目与洛谷原题逐字一致" },
  { value: "24h", label: "私教永不下线", sub: "凌晨两点也能问、也能练" },
  { value: "¥2", label: "每天不到一瓶水", sub: "线下培训 1/6 的价格" },
];

const TECH_STRIP = [
  { icon: Brain, text: "Claude AI 大模型驱动" },
  { icon: Globe, text: "洛谷题库实时同步" },
  { icon: ShieldCheck, text: "Judge0 在线评测" },
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
    <section
      className="relative py-20 sm:py-28"
      style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            不是花架子，是
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #5b6af0, #c084fc)" }}>真材实料</span>
          </h2>
        </div>

        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {TRUST_DATA.map((item, i) => (
            <TrustItem key={i} {...item} visible={visible} delay={i * 150} />
          ))}
        </div>

        {/* 技术保障条带 */}
        <div className="mt-12 pt-8 border-t border-white/[0.04] flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {TECH_STRIP.map((item, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <item.icon className="w-4 h-4 text-white/20" />
              <span className="text-xs text-white/25">{item.text}</span>
            </div>
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
    <div className="text-center rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
      <div
        ref={numRef}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-2 bg-clip-text text-transparent"
        style={{ backgroundImage: "linear-gradient(135deg, #5b6af0, #8b5cf6)" }}
      >
        &nbsp;
      </div>
      {/* 渐变短横线装饰 */}
      <div className="w-8 h-0.5 mx-auto mb-3 rounded-full bg-gradient-to-r from-[#5b6af0] to-[#8b5cf6] opacity-40" />
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
        <p className="text-sm text-white/20 mb-4">还在犹豫？</p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-white leading-tight">
          别让孩子在备考路上<br />
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #5b6af0, #c084fc)" }}>
            孤军奋战
          </span>
        </h2>

        {/* 考试倒计时 */}
        {daysToExam !== null && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] mb-6">
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

        <p className="text-base sm:text-lg text-white/30 mb-10 leading-relaxed">
          下一场 GESP 考试不会等人。<br />
          今天注册，AI 今天就开始帮孩子规划。
        </p>
        <Link
          href="/register"
          className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#5b6af0] to-[#8b5cf6] text-white font-medium text-lg hover:opacity-90 transition-all shadow-2xl shadow-[#5b6af0]/25 hover:shadow-[#5b6af0]/40"
        >
          {/* 脉冲动画光圈 — 慢速 3s */}
          <span
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#5b6af0] to-[#8b5cf6]"
            style={{ animation: "pulse-slow 3s ease-in-out infinite" }}
          />
          <span className="relative">免费试用，立即开始</span>
          <ChevronRight className="relative w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
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
          <Link href="/ladder" className="text-xs text-white/20 hover:text-white/40 transition-colors">天梯</Link>
          <Link href="/login" className="text-xs text-white/20 hover:text-white/40 transition-colors">登录</Link>
          <Link href="/register" className="text-xs text-white/20 hover:text-white/40 transition-colors">注册</Link>
        </div>
      </div>
    </footer>
  );
}
