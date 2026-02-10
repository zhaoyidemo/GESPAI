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

export default function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  useMouseParallax(0.03);

  // Scroll tracking with gsap ScrollTrigger
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

    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="landing-page-root min-h-screen bg-[#06060f] text-white overflow-x-hidden"
      style={{ height: "600vh" }}
    >
      {/* 3D Background */}
      {isMobile ? <MobileFallback /> : <BrainScene scrollProgress={scrollProgress} />}

      {/* Navbar */}
      <Navbar scrolled={scrolled} />

      {/* Scroll-driven HTML overlay sections */}
      <div className="relative z-10">
        {/* Hero (0-12%) */}
        <div
          className="min-h-screen flex items-center justify-center sticky top-0"
          style={{
            opacity: scrollProgress < 0.10 ? 1 : Math.max(0, 1 - (scrollProgress - 0.10) / 0.04),
            pointerEvents: scrollProgress > 0.15 ? "none" : "auto",
          }}
        >
          <HeroSection />
        </div>

        {/* Pain Points (15-42%) */}
        <div
          style={{
            opacity: scrollProgress >= 0.13 && scrollProgress <= 0.48 ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: scrollProgress >= 0.13 && scrollProgress <= 0.48 ? "auto" : "none",
          }}
        >
          <PainPointsSection />
        </div>

        {/* How It Works (42-52%) */}
        <div
          style={{
            opacity: scrollProgress >= 0.40 && scrollProgress <= 0.56 ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: scrollProgress >= 0.40 && scrollProgress <= 0.56 ? "auto" : "none",
          }}
        >
          <HowItWorksSection />
        </div>

        {/* AI Preview (50-62%) */}
        <div
          style={{
            opacity: scrollProgress >= 0.50 && scrollProgress <= 0.65 ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: scrollProgress >= 0.50 && scrollProgress <= 0.65 ? "auto" : "none",
          }}
        >
          <AIPreviewSection />
        </div>

        {/* Trust Data (60-74%) */}
        <div
          style={{
            opacity: scrollProgress >= 0.60 && scrollProgress <= 0.78 ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: scrollProgress >= 0.60 && scrollProgress <= 0.78 ? "auto" : "none",
          }}
        >
          <TrustSection />
        </div>

        {/* Pricing (76-92%) */}
        <div
          style={{
            opacity: scrollProgress >= 0.74 && scrollProgress <= 0.94 ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: scrollProgress >= 0.74 && scrollProgress <= 0.94 ? "auto" : "none",
          }}
        >
          <PricingSection />
        </div>

        {/* CTA + Footer (90-100%) */}
        <div
          style={{
            opacity: scrollProgress >= 0.90 ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: scrollProgress >= 0.90 ? "auto" : "none",
          }}
        >
          <CTASection />
          <Footer />
        </div>
      </div>
    </div>
  );
}
