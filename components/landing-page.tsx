"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Code2,
  BrainCircuit,
  SearchCode,
  Trophy,
  Check,
  ArrowRight,
  ArrowDown,
  Zap,
  Terminal,
  ChevronRight,
} from "lucide-react";

/* ──────────────────────────────────────────
   Floating code fragments for the background
   ────────────────────────────────────────── */
const CODE_FRAGMENTS = [
  "int dp[N][N];",
  "for(int i=0; i<n; i++)",
  "sort(a, a+n);",
  "dfs(root, 0);",
  "while(!q.empty())",
  "return ans % MOD;",
  "memset(vis, 0, sizeof vis);",
  "cin >> n >> m;",
  "struct Node { int val; };",
  "if(l > r) return;",
  "stack<int> st;",
  "gcd(a, b)",
];

function FloatingCode() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {CODE_FRAGMENTS.map((code, i) => (
        <div
          key={i}
          className="absolute font-mono text-[11px] sm:text-xs whitespace-nowrap"
          style={{
            color: `hsla(${238 + (i * 7) % 40}, 70%, 65%, ${0.06 + (i % 4) * 0.02})`,
            left: `${(i * 17.3) % 90}%`,
            top: `${(i * 23.7) % 85}%`,
            animation: `codeDrift ${20 + i * 3}s linear infinite`,
            animationDelay: `${i * -2.5}s`,
          }}
        >
          {code}
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────
   Animated gradient orbs
   ────────────────────────────────────────── */
function GlowOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsla(238,84%,67%,0.15) 0%, transparent 70%)",
          top: "-10%",
          left: "-10%",
          animation: "orbFloat 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsla(263,70%,58%,0.12) 0%, transparent 70%)",
          bottom: "5%",
          right: "-5%",
          animation: "orbFloat 25s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsla(200,90%,60%,0.08) 0%, transparent 70%)",
          top: "40%",
          left: "50%",
          animation: "orbFloat 18s ease-in-out infinite",
          animationDelay: "-5s",
        }}
      />
    </div>
  );
}

/* ──────────────────────────────────────────
   Terminal-style hero code mockup
   ────────────────────────────────────────── */
function HeroTerminal() {
  const lines = [
    { prompt: true, text: 'gesp-ai --start "学习计划"', delay: 0 },
    { prompt: false, text: "✓ 正在分析你的知识盲区...", delay: 800 },
    { prompt: false, text: "✓ 生成个性化学习路径", delay: 1600 },
    { prompt: false, text: "✓ 今日任务：递归 + 排序练习", delay: 2400 },
    { prompt: true, text: 'solve --problem "B3856"', delay: 3400 },
    { prompt: false, text: "→ AI 提示：试试分治思路", delay: 4200 },
    { prompt: false, text: "✓ Accepted! +50 XP", delay: 5200 },
  ];

  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    lines.forEach((line, i) => {
      timers.push(
        setTimeout(() => setVisibleLines(i + 1), line.delay + 600)
      );
    });
    // Loop
    timers.push(
      setTimeout(() => setVisibleLines(0), 7000)
    );
    const loop = setInterval(() => {
      setVisibleLines(0);
      lines.forEach((line, i) => {
        timers.push(
          setTimeout(() => setVisibleLines(i + 1), line.delay + 600)
        );
      });
    }, 8000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(loop);
    };
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0">
      {/* Glow behind terminal */}
      <div
        className="absolute -inset-4 rounded-2xl opacity-50 blur-2xl"
        style={{
          background: "linear-gradient(135deg, hsla(238,84%,67%,0.2), hsla(263,70%,58%,0.15))",
        }}
      />
      <div className="relative rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          </div>
          <span className="text-[10px] text-white/25 font-mono ml-2">gesp-ai terminal</span>
        </div>
        {/* Terminal body */}
        <div className="p-4 font-mono text-xs sm:text-sm leading-relaxed min-h-[200px]">
          {lines.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              className="flex items-start gap-2 animate-fade-in"
              style={{ animationDuration: "0.3s" }}
            >
              {line.prompt ? (
                <span className="text-emerald-400/80 shrink-0">❯</span>
              ) : (
                <span className="shrink-0 w-3" />
              )}
              <span
                className={
                  line.prompt
                    ? "text-white/80"
                    : line.text.includes("✓")
                    ? "text-emerald-400/70"
                    : line.text.includes("→")
                    ? "text-violet-400/70"
                    : "text-white/50"
                }
              >
                {line.text}
              </span>
            </div>
          ))}
          {/* Blinking cursor */}
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-emerald-400/80">❯</span>
            <span className="inline-block w-2 h-4 bg-emerald-400/60 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Feature card component
   ────────────────────────────────────────── */
function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}) {
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

  return (
    <div
      ref={ref}
      className="group relative"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {/* Animated gradient border */}
      <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: gradient }} />
      <div className="relative rounded-2xl border border-white/[0.06] bg-[#0a0a1a]/80 backdrop-blur-sm p-6 sm:p-8 h-full transition-all duration-500 group-hover:bg-[#0e0e24]/90 group-hover:border-transparent">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110"
          style={{ background: gradient.replace("90deg", "135deg") }}
        >
          <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm leading-relaxed text-white/50">{description}</p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Pricing card component
   ────────────────────────────────────────── */
function PricingCard({
  name,
  price,
  period,
  features,
  cta,
  popular,
  delay,
}: {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  popular?: boolean;
  delay: number;
}) {
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

  return (
    <div
      ref={ref}
      className={`relative ${popular ? "lg:-mt-4 lg:mb-0" : ""}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {/* Popular glow */}
      {popular && (
        <div
          className="absolute -inset-[1px] rounded-2xl"
          style={{
            background: "linear-gradient(135deg, hsl(238,84%,67%), hsl(263,70%,58%), hsl(238,84%,67%))",
            backgroundSize: "200% 200%",
            animation: "gradient-shift 3s ease infinite",
          }}
        />
      )}
      {!popular && (
        <div className="absolute -inset-[1px] rounded-2xl border border-white/[0.06]" />
      )}
      <div className={`relative rounded-2xl bg-[#0a0a1a] p-6 sm:p-8 h-full flex flex-col ${popular ? "ring-0" : ""}`}>
        {popular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="text-[11px] font-semibold tracking-wider uppercase px-4 py-1 rounded-full bg-gradient-to-r from-[hsl(238,84%,67%)] to-[hsl(263,70%,58%)] text-white">
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
              ? "bg-gradient-to-r from-[hsl(238,84%,67%)] to-[hsl(263,70%,58%)] text-white hover:opacity-90 shadow-lg shadow-[hsl(238,84%,67%)]/20"
              : "bg-white/[0.06] text-white/80 hover:bg-white/[0.1] border border-white/[0.06]"
          }`}
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Section reveal hook
   ────────────────────────────────────────── */
function useSectionReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ══════════════════════════════════════════
   MAIN LANDING PAGE
   ══════════════════════════════════════════ */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const featuresReveal = useSectionReveal();
  const pricingReveal = useSectionReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#06060f] text-white overflow-x-hidden">
      {/* ─── Grid background ─── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ─── Floating orbs ─── */}
      <GlowOrbs />

      {/* ═══ NAVBAR ═══ */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#06060f]/80 backdrop-blur-xl border-b border-white/[0.05]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(238,84%,67%)] to-[hsl(263,70%,58%)] flex items-center justify-center shadow-lg shadow-[hsl(238,84%,67%)]/25">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight leading-none">GESP AI</span>
              <span className="text-[9px] text-white/30 leading-tight">智能备考助手</span>
            </div>
          </div>

          {/* Center nav */}
          <div className="hidden sm:flex items-center gap-8">
            <a href="#features" className="text-sm text-white/40 hover:text-white/80 transition-colors">
              功能
            </a>
            <a href="#pricing" className="text-sm text-white/40 hover:text-white/80 transition-colors">
              定价
            </a>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-white/50 hover:text-white transition-colors px-3 py-1.5"
            >
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

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center pt-16">
        <FloatingCode />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div className="animate-fade-in text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm mb-8">
                <Zap className="w-3 h-3 text-amber-400" />
                <span className="text-xs text-white/50">Claude Sonnet 4.5 驱动</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                <span className="text-white">用 AI 重新定义</span>
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(135deg, hsl(238,84%,67%), hsl(263,70%,58%), hsl(300,60%,55%))",
                  }}
                >
                  GESP 备考体验
                </span>
              </h1>

              <p className="text-base sm:text-lg text-white/40 max-w-lg mb-10 mx-auto lg:mx-0 leading-relaxed">
                AI 私教 · 智能刷题 · 错题诊断 · 模拟考试
                <br />
                一站式搞定 GESP C++ 4-6 级备考
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[hsl(238,84%,67%)] to-[hsl(263,70%,58%)] text-white font-medium hover:opacity-90 transition-all shadow-xl shadow-[hsl(238,84%,67%)]/25 hover:shadow-[hsl(238,84%,67%)]/40"
                >
                  免费试用
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <a
                  href="#features"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-white/50 hover:text-white/80 border border-white/[0.06] hover:border-white/[0.12] transition-all"
                >
                  了解更多
                  <ArrowDown className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right — Terminal */}
            <div className="animate-slide-up hidden lg:block" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
              <HeroTerminal />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse-soft">
          <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-white/20 animate-bounce" style={{ animationDuration: "1.5s" }} />
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="relative py-24 sm:py-32">
        <div ref={featuresReveal.ref} className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <div
            className="text-center mb-16"
            style={{
              opacity: featuresReveal.visible ? 1 : 0,
              transform: featuresReveal.visible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] mb-6">
              <Terminal className="w-3 h-3 text-white/40" />
              <span className="text-xs text-white/40">核心功能</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              AI 驱动的
              <span
                className="bg-clip-text text-transparent ml-2"
                style={{
                  backgroundImage: "linear-gradient(135deg, hsl(238,84%,67%), hsl(263,70%,58%))",
                }}
              >
                全方位备考
              </span>
            </h2>
            <p className="text-white/35 max-w-xl mx-auto">
              从知识学习到实战演练，AI 全程陪伴你的 GESP 备考之旅
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            <FeatureCard
              icon={BrainCircuit}
              title="AI 私教"
              description="一对一智能辅导，用最适合你的方式讲解每一个知识点。支持语音提问，像真人老师一样随时答疑。"
              gradient="linear-gradient(90deg, hsla(238,84%,67%,0.5), hsla(200,90%,60%,0.5))"
              delay={0}
            />
            <FeatureCard
              icon={Code2}
              title="智能刷题"
              description="覆盖 GESP 4-6 级全部题型，在线代码编辑器 + Judge0 实时评测，每次提交都有 AI 针对性反馈。"
              gradient="linear-gradient(90deg, hsla(263,70%,58%,0.5), hsla(300,60%,55%,0.5))"
              delay={100}
            />
            <FeatureCard
              icon={SearchCode}
              title="错题诊断"
              description="AI 自动分类错误类型，引导「三问复盘法」——错了哪？为什么错？怎么避免？生成专属防错规则。"
              gradient="linear-gradient(90deg, hsla(160,70%,45%,0.5), hsla(200,80%,55%,0.5))"
              delay={200}
            />
            <FeatureCard
              icon={Trophy}
              title="模拟考试"
              description="完全还原 GESP 真实考试环境：90 分钟限时、选择题 + 编程题，AI 精准预估你的通过率。"
              gradient="linear-gradient(90deg, hsla(38,90%,55%,0.5), hsla(20,85%,55%,0.5))"
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="relative py-24 sm:py-32">
        {/* Subtle divider glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div ref={pricingReveal.ref} className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <div
            className="text-center mb-16"
            style={{
              opacity: pricingReveal.visible ? 1 : 0,
              transform: pricingReveal.visible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] mb-6">
              <Sparkles className="w-3 h-3 text-white/40" />
              <span className="text-xs text-white/40">灵活定价</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              选择适合你的
              <span
                className="bg-clip-text text-transparent ml-2"
                style={{
                  backgroundImage: "linear-gradient(135deg, hsl(238,84%,67%), hsl(263,70%,58%))",
                }}
              >
                方案
              </span>
            </h2>
            <p className="text-white/35">
              从免费体验开始，随时升级解锁全部功能
            </p>
          </div>

          {/* Pricing grid */}
          <div className="grid lg:grid-cols-3 gap-5 items-start">
            <PricingCard
              name="免费体验"
              price="¥0"
              period="月"
              features={[
                "每日 3 题练习",
                "基础 AI 辅导",
                "知识点地图浏览",
                "学习进度追踪",
              ]}
              cta="免费注册"
              delay={0}
            />
            <PricingCard
              name="标准版"
              price="¥49"
              period="月"
              popular
              features={[
                "无限刷题 + 在线评测",
                "AI 私教 · 不限次对话",
                "错题诊断 · 三问复盘",
                "个性化学习计划",
                "防错规则库",
                "XP 与成就系统",
              ]}
              cta="免费试用"
              delay={100}
            />
            <PricingCard
              name="冲刺版"
              price="¥99"
              period="月"
              features={[
                "标准版全部功能",
                "无限模拟考试",
                "考前冲刺计划",
                "优先 AI 响应",
                "费曼学习法训练",
                "详细学情报告",
              ]}
              cta="免费试用"
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="relative py-24 sm:py-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        {/* CTA glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, hsla(238,84%,67%,0.08) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 text-center max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            准备好了吗？
          </h2>
          <p className="text-lg text-white/35 mb-10">
            让 AI 成为你的备考搭档，从今天开始高效学习
          </p>
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[hsl(238,84%,67%)] to-[hsl(263,70%,58%)] text-white font-medium text-lg hover:opacity-90 transition-all shadow-2xl shadow-[hsl(238,84%,67%)]/25 hover:shadow-[hsl(238,84%,67%)]/40"
          >
            免费试用
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <p className="mt-4 text-xs text-white/20">无需信用卡 · 即刻开始</p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/[0.04] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-[hsl(238,84%,67%)] to-[hsl(263,70%,58%)] flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-xs text-white/25">© 2025 GESP AI. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-xs text-white/20 hover:text-white/40 transition-colors">
              功能
            </a>
            <a href="#pricing" className="text-xs text-white/20 hover:text-white/40 transition-colors">
              定价
            </a>
            <Link href="/login" className="text-xs text-white/20 hover:text-white/40 transition-colors">
              登录
            </Link>
          </div>
        </div>
      </footer>

      {/* ─── Custom CSS for this page ─── */}
      <style jsx>{`
        @keyframes codeDrift {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translateY(-120px) translateX(40px);
            opacity: 0;
          }
        }
        @keyframes orbFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -40px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.95);
          }
        }
      `}</style>
    </div>
  );
}
