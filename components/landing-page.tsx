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
  Terminal,
  ChevronRight,
  Clock,
  BarChart3,
  ShieldCheck,
  MessageCircle,
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
   Terminal-style hero mockup — 展示 AI 辅导场景
   ────────────────────────────────────────── */
function HeroTerminal() {
  const lines = [
    { role: "ai", text: "今天我们来学 DFS，它就像走迷宫——选一条路走到底，走不通就退回来换条路！" },
    { role: "student", text: "那怎么知道哪条路走过了？" },
    { role: "ai", text: "好问题！我们用一个 vis 数组做标记，走过的路标记为 true，这样就不会重复走了。" },
    { role: "student", text: "vis[i] = true 写在哪里？" },
    { role: "ai", text: "在进入这个节点的时候标记。来，你试试把 DFS 函数写出来？我帮你看对不对 👀" },
  ];

  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    const showLine = (start: number) => {
      lines.forEach((_, i) => {
        timers.push(setTimeout(() => setVisibleLines(i + 1), start + i * 1200));
      });
      timers.push(setTimeout(() => setVisibleLines(0), start + lines.length * 1200 + 2000));
    };
    showLine(600);
    const loop = setInterval(() => showLine(0), lines.length * 1200 + 3000);
    return () => { timers.forEach(clearTimeout); clearInterval(loop); };
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0">
      <div
        className="absolute -inset-4 rounded-2xl opacity-50 blur-2xl"
        style={{ background: "linear-gradient(135deg, hsla(238,84%,67%,0.2), hsla(263,70%,58%,0.15))" }}
      />
      <div className="relative rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          </div>
          <span className="text-[10px] text-white/25 font-mono ml-2">GESP AI 私教 · DFS 深度优先搜索</span>
        </div>
        <div className="p-4 space-y-3 min-h-[240px]">
          {lines.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              className={`flex gap-2.5 animate-fade-in ${line.role === "student" ? "justify-end" : ""}`}
              style={{ animationDuration: "0.3s" }}
            >
              {line.role === "ai" && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[hsl(238,84%,67%)] to-[hsl(263,70%,58%)] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              )}
              <div
                className={`text-xs sm:text-sm leading-relaxed px-3 py-2 rounded-xl max-w-[85%] ${
                  line.role === "ai"
                    ? "bg-white/[0.05] text-white/70"
                    : "bg-[hsl(238,84%,67%)]/20 text-white/80"
                }`}
              >
                {line.text}
              </div>
            </div>
          ))}
          {visibleLines < lines.length && visibleLines > 0 && (
            <div className="flex gap-2.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[hsl(238,84%,67%)] to-[hsl(263,70%,58%)] flex items-center justify-center shrink-0">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <div className="flex items-center gap-1 px-3 py-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   痛点 → 方案 卡片
   ────────────────────────────────────────── */
function PainPointCard({
  icon: Icon,
  pain,
  solution,
  detail,
  gradient,
  delay,
}: {
  icon: React.ElementType;
  pain: string;
  solution: string;
  detail: string;
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
      <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: gradient }} />
      <div className="relative rounded-2xl border border-white/[0.06] bg-[#0a0a1a]/80 backdrop-blur-sm p-6 sm:p-8 h-full transition-all duration-500 group-hover:bg-[#0e0e24]/90 group-hover:border-transparent">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110"
          style={{ background: gradient.replace("90deg", "135deg") }}
        >
          <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
        </div>
        {/* 痛点问句 */}
        <p className="text-white/40 text-sm mb-2">{pain}</p>
        {/* 方案标题 */}
        <h3 className="text-lg font-semibold text-white mb-2">{solution}</h3>
        {/* 细节 */}
        <p className="text-sm leading-relaxed text-white/50">{detail}</p>
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
  subtitle,
  features,
  cta,
  popular,
  delay,
}: {
  name: string;
  price: string;
  period: string;
  subtitle?: string;
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
      <div className="relative rounded-2xl bg-[#0a0a1a] p-6 sm:p-8 h-full flex flex-col">
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
          {subtitle && (
            <p className="text-xs text-emerald-400/70 mt-2">{subtitle}</p>
          )}
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
  const trustReveal = useSectionReveal();
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
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(238,84%,67%)] to-[hsl(263,70%,58%)] flex items-center justify-center shadow-lg shadow-[hsl(238,84%,67%)]/25">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight leading-none">GESP AI</span>
              <span className="text-[9px] text-white/30 leading-tight">智能备考助手</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-8">
            <a href="#features" className="text-sm text-white/40 hover:text-white/80 transition-colors">为什么选我们</a>
            <a href="#pricing" className="text-sm text-white/40 hover:text-white/80 transition-colors">定价</a>
            <Link href="/ladder" className="text-sm text-white/40 hover:text-white/80 transition-colors">天梯</Link>
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

      {/* ═══ HERO — 直击痛点 ═══ */}
      <section className="relative min-h-screen flex items-center pt-16">
        <FloatingCode />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-fade-in text-center lg:text-left">
              {/* 定位标签 */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm mb-8">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span className="text-xs text-white/50">专为 GESP C++ 4-6 级设计</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold tracking-tight leading-[1.15] mb-6">
                <span className="text-white">孩子备考 GESP</span>
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(135deg, hsl(238,84%,67%), hsl(263,70%,58%), hsl(300,60%,55%))",
                  }}
                >
                  不用再花几千块请家教
                </span>
              </h1>

              <p className="text-base sm:text-lg text-white/40 max-w-lg mb-6 mx-auto lg:mx-0 leading-relaxed">
                ¥49/月的 AI 编程私教，24 小时在线辅导。
                <br />
                AI 规划每天学什么、随时答疑、精准诊断薄弱点。
              </p>

              {/* 价格锚定 */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] mb-8">
                <span className="text-xs text-white/30 line-through">线下 1 对 1：300-800 元/小时</span>
                <span className="text-xs text-white/20">→</span>
                <span className="text-xs text-emerald-400/80 font-medium">GESP AI：¥49/月 不限时</span>
              </div>

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
                  看看怎么帮到孩子
                  <ArrowDown className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* 右侧 — AI 对话模拟 */}
            <div className="animate-slide-up hidden lg:block" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
              <HeroTerminal />
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse-soft">
          <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-white/20 animate-bounce" style={{ animationDuration: "1.5s" }} />
          </div>
        </div>
      </section>

      {/* ═══ FEATURES — 痛点 → 方案 ═══ */}
      <section id="features" className="relative py-24 sm:py-32">
        <div ref={featuresReveal.ref} className="max-w-6xl mx-auto px-4 sm:px-6">
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
              <span className="text-xs text-white/40">为什么选择 GESP AI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              家长的
              <span
                className="bg-clip-text text-transparent ml-1"
                style={{ backgroundImage: "linear-gradient(135deg, hsl(238,84%,67%), hsl(263,70%,58%))" }}
              >
                四个焦虑
              </span>
              ，我们逐个解决
            </h2>
            <p className="text-white/35 max-w-xl mx-auto">
              不懂编程也能帮孩子备考，让 AI 做你做不到的事
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            <PainPointCard
              icon={MessageCircle}
              pain="孩子做题卡住了，晚上 10 点没人能问？"
              solution="AI 老师 24 小时在线答疑"
              detail="不用等下次上课。孩子随时提问，AI 用比喻和例子讲到孩子听懂为止。支持语音提问，打字慢也没关系。"
              gradient="linear-gradient(90deg, hsla(238,84%,67%,0.5), hsla(200,90%,60%,0.5))"
              delay={0}
            />
            <PainPointCard
              icon={Clock}
              pain="每天不知道该学什么、练什么？"
              solution="AI 自动规划每日学习任务"
              detail="输入目标级别和考试日期，AI 根据孩子的薄弱点自动安排每天学什么、练哪道题。家长和孩子都不用操心。"
              gradient="linear-gradient(90deg, hsla(263,70%,58%,0.5), hsla(300,60%,55%,0.5))"
              delay={100}
            />
            <PainPointCard
              icon={SearchCode}
              pain="同样的错误，一犯再犯？"
              solution="三问复盘 + 防错规则，错过的不再错"
              detail="AI 引导孩子想清楚三个问题：错了哪？为什么错？怎么避免？自动生成防错规则，下次提交代码前 AI 主动提醒。"
              gradient="linear-gradient(90deg, hsla(160,70%,45%,0.5), hsla(200,80%,55%,0.5))"
              delay={200}
            />
            <PainPointCard
              icon={BarChart3}
              pain="花了钱，不知道孩子到底学到哪了？"
              solution="学习数据全透明，进度一目了然"
              detail="知识点掌握度百分比、每日任务完成率、模拟考试通过率预估——所有数据清清楚楚，不再花冤枉钱。"
              gradient="linear-gradient(90deg, hsla(38,90%,55%,0.5), hsla(20,85%,55%,0.5))"
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* ═══ 信任板块 — 硬实力 ═══ */}
      <section className="relative py-16 sm:py-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div ref={trustReveal.ref} className="max-w-5xl mx-auto px-4 sm:px-6">
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            style={{
              opacity: trustReveal.visible ? 1 : 0,
              transform: trustReveal.visible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {[
              { value: "4-6 级", label: "覆盖 GESP 考纲", sub: "知识点完整对齐官方大纲" },
              { value: "100+", label: "洛谷真题同步", sub: "题库持续更新中" },
              { value: "24h", label: "AI 随时在线", sub: "不受时间地点限制" },
              { value: "10 种", label: "错误类型诊断", sub: "精准定位每一次失误" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div
                  className="text-3xl sm:text-4xl font-bold tracking-tight mb-1 bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, hsl(238,84%,67%), hsl(263,70%,58%))" }}
                >
                  {item.value}
                </div>
                <p className="text-sm font-medium text-white/70 mb-0.5">{item.label}</p>
                <p className="text-xs text-white/30">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING — 价格锚定 ═══ */}
      <section id="pricing" className="relative py-24 sm:py-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div ref={pricingReveal.ref} className="max-w-5xl mx-auto px-4 sm:px-6">
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
              <span className="text-xs text-white/40">简单透明的定价</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              一节线下课的钱
              <span
                className="bg-clip-text text-transparent ml-1"
                style={{ backgroundImage: "linear-gradient(135deg, hsl(238,84%,67%), hsl(263,70%,58%))" }}
              >
                ，用一整个月
              </span>
            </h2>
            <p className="text-white/35 max-w-xl mx-auto">
              线下 C++ 1 对 1 培训 300-800 元/小时，GESP AI 从免费开始
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-5 items-start">
            <PricingCard
              name="免费体验"
              price="¥0"
              period="月"
              subtitle="永久免费，无需绑卡"
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
              subtitle="≈ 线下一节课的价格"
              features={[
                "无限刷题 + 在线评测",
                "GESP AI 私教不限次对话",
                "AI 自动规划每日任务",
                "错题三问复盘 + 防错规则",
                "GESP AI 私教·验证训练",
                "XP 经验值与成就徽章",
              ]}
              cta="免费试用"
              delay={100}
            />
            <PricingCard
              name="冲刺版"
              price="¥99"
              period="月"
              subtitle="考前最后一个月强推"
              features={[
                "标准版全部功能",
                "无限模拟考试",
                "AI 生成考前冲刺计划",
                "优先 AI 响应速度",
                "薄弱知识点专项强化",
                "详细学情分析报告",
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
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsla(238,84%,67%,0.08) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 text-center max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            别让孩子在备考路上孤军奋战
          </h2>
          <p className="text-lg text-white/35 mb-10">
            一个好的 GESP AI 私教，可能就是通过考试的关键
          </p>
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[hsl(238,84%,67%)] to-[hsl(263,70%,58%)] text-white font-medium text-lg hover:opacity-90 transition-all shadow-2xl shadow-[hsl(238,84%,67%)]/25 hover:shadow-[hsl(238,84%,67%)]/40"
          >
            免费试用，立即开始
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <p className="mt-4 text-xs text-white/20">无需付费 · 注册即可体验核心功能</p>
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
            <a href="#features" className="text-xs text-white/20 hover:text-white/40 transition-colors">功能</a>
            <a href="#pricing" className="text-xs text-white/20 hover:text-white/40 transition-colors">定价</a>
            <Link href="/ladder" className="text-xs text-white/20 hover:text-white/40 transition-colors">天梯</Link>
            <Link href="/login" className="text-xs text-white/20 hover:text-white/40 transition-colors">登录</Link>
          </div>
        </div>
      </footer>

      {/* ─── Custom keyframes ─── */}
      <style jsx>{`
        @keyframes codeDrift {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { transform: translateY(-120px) translateX(40px); opacity: 0; }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
      `}</style>
    </div>
  );
}
