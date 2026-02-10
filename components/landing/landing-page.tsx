"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Navbar,
  HeroSection,
  PainPointsSection,
  HowItWorksSection,
  AIPreviewSection,
  TrustSection,
  PricingSection,
  CTASection,
  Footer,
} from "./scroll-sections";
import { useMouseParallax } from "./use-mouse-parallax";

const BrainScene = dynamic(() => import("./brain-scene"), { ssr: false });
const MobileFallback = dynamic(() => import("./mobile-fallback"), { ssr: false });

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile =
        window.innerWidth < 768 ||
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

// ── 每个区块的滚动区间（严格不重叠） ──
// 总高度 800vh，共 7 个区块 + Footer
// 每个区块约占 100-120vh 滚动距离
const SECTIONS = [
  { id: "hero",      start: 0.00, fadeIn: 0.00, fadeOut: 0.10, end: 0.125 },
  { id: "pain",      start: 0.125, fadeIn: 0.13, fadeOut: 0.28, end: 0.30 },
  { id: "howto",     start: 0.30, fadeIn: 0.31, fadeOut: 0.40, end: 0.42 },
  { id: "aipreview", start: 0.42, fadeIn: 0.43, fadeOut: 0.53, end: 0.55 },
  { id: "trust",     start: 0.55, fadeIn: 0.56, fadeOut: 0.65, end: 0.67 },
  { id: "pricing",   start: 0.67, fadeIn: 0.68, fadeOut: 0.82, end: 0.84 },
  { id: "cta",       start: 0.84, fadeIn: 0.85, fadeOut: 1.00, end: 1.00 },
] as const;

function getSectionOpacity(progress: number, section: typeof SECTIONS[number]): number {
  const fadeInDuration = 0.03;  // 3% 滚动距离内完成淡入
  const fadeOutDuration = 0.03; // 3% 滚动距离内完成淡出

  // 尚未进入
  if (progress < section.fadeIn) return 0;
  // 淡入阶段
  if (progress < section.fadeIn + fadeInDuration) {
    return (progress - section.fadeIn) / fadeInDuration;
  }
  // 完全可见
  if (progress <= section.fadeOut - fadeOutDuration) return 1;
  // 淡出阶段
  if (progress <= section.fadeOut) {
    return 1 - (progress - (section.fadeOut - fadeOutDuration)) / fadeOutDuration;
  }
  // 已离开
  return 0;
}

export default function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  useMouseParallax(0.03);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const init = async () => {
      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.default;
      const { ScrollTrigger } = scrollTriggerModule;

      gsap.registerPlugin(ScrollTrigger);

      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
          setScrolled(self.scroll() > 20);
        },
      });

      cleanup = () => {
        trigger.kill();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    };

    init();
    return () => { cleanup?.(); };
  }, []);

  // 计算每个区块的 opacity
  const opacities = SECTIONS.map((s) => getSectionOpacity(scrollProgress, s));

  return (
    <div
      ref={containerRef}
      className="landing-page-root bg-[#06060f] text-white overflow-x-hidden"
      style={{ height: "800vh" }}
    >
      {/* 3D Background — fixed fullscreen */}
      {isMobile ? <MobileFallback /> : <BrainScene scrollProgress={scrollProgress} />}

      {/* Navbar */}
      <Navbar scrolled={scrolled} />

      {/* ── 固定视口层：所有区块都在同一个 fixed 容器中切换 ── */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        {/* Hero */}
        <ScrollPanel opacity={opacities[0]}>
          <HeroSection />
        </ScrollPanel>

        {/* Pain Points — 这个区块内容较多，使用可滚动面板 */}
        <ScrollPanel opacity={opacities[1]}>
          <PainPointsSection />
        </ScrollPanel>

        {/* How It Works */}
        <ScrollPanel opacity={opacities[2]}>
          <HowItWorksSection />
        </ScrollPanel>

        {/* AI Preview */}
        <ScrollPanel opacity={opacities[3]}>
          <AIPreviewSection />
        </ScrollPanel>

        {/* Trust */}
        <ScrollPanel opacity={opacities[4]}>
          <TrustSection />
        </ScrollPanel>

        {/* Pricing */}
        <ScrollPanel opacity={opacities[5]}>
          <PricingSection />
        </ScrollPanel>

        {/* CTA + Footer */}
        <ScrollPanel opacity={opacities[6]}>
          <CTASection />
          <Footer />
        </ScrollPanel>
      </div>
    </div>
  );
}

// ── 单个滚动面板：固定全屏，通过 opacity 控制可见性 ──
function ScrollPanel({
  opacity,
  children,
}: {
  opacity: number;
  children: React.ReactNode;
}) {
  const visible = opacity > 0;
  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-y-auto"
      style={{
        opacity,
        pointerEvents: visible ? "auto" : "none",
        visibility: visible ? "visible" : "hidden",
        transition: "opacity 0.15s ease-out",
      }}
    >
      <div className="w-full max-h-full">
        {children}
      </div>
    </div>
  );
}
