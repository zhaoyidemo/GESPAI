"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Navbar,
  HeroSection,
  PainPointsSection,
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
      setIsMobile(
        window.innerWidth < 768 ||
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      );
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const isMobile = useIsMobile();
  useMouseParallax(0.03);

  // 简单滚动监听：只控制导航栏样式 + 3D 场景淡出
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      // 3D 场景在滚过首屏时淡出
      const vh = window.innerHeight;
      setHeroOpacity(Math.max(0, 1 - y / (vh * 0.8)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-[#06060f] text-white">
      {/* ── 3D 大脑：只在首屏可见，滚动后淡出 ── */}
      <div
        className="fixed inset-0 z-0"
        style={{ opacity: heroOpacity, pointerEvents: heroOpacity < 0.1 ? "none" : "auto" }}
      >
        {isMobile ? <MobileFallback /> : <BrainScene scrollProgress={0} />}
      </div>

      {/* ── 导航栏 ── */}
      <Navbar scrolled={scrolled} />

      {/* ── 首屏 Hero：全屏，3D 背景 ── */}
      <div className="relative z-10">
        <HeroSection />
      </div>

      {/* ── 下方内容：普通布局，暗色背景遮盖 3D ── */}
      <div className="relative z-10 bg-[#06060f]">
        <PainPointsSection />
        <AIPreviewSection />
        <TrustSection />
        <PricingSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}
