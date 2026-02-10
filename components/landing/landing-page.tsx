"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Navbar,
  HeroSection,
  PainPointsSection,
  TrustSection,
  PricingSection,
  CTASection,
  Footer,
} from "./scroll-sections";
import { useMouseParallax } from "./use-mouse-parallax";

// Dynamic import for Three.js scene (SSR disabled)
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
  const { mouseRef } = useMouseParallax(0.03);

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

  // Hero parallax offset
  const heroParallaxStyle = !isMobile
    ? {
        transform: `translate(${mouseRef.current.x * -8}px, ${mouseRef.current.y * -8}px)`,
      }
    : undefined;

  return (
    <div
      ref={containerRef}
      className="landing-page-root min-h-screen bg-[#06060f] text-white overflow-x-hidden"
      style={{ height: "550vh" }}
    >
      {/* 3D Background */}
      {isMobile ? <MobileFallback /> : <BrainScene scrollProgress={scrollProgress} />}

      {/* Navbar */}
      <Navbar scrolled={scrolled} />

      {/* Scroll-driven HTML overlay sections */}
      <div className="relative z-10">
        {/* Hero (0-15%) */}
        <div
          className="min-h-screen flex items-center justify-center sticky top-0"
          style={{
            opacity: scrollProgress < 0.15 ? 1 - scrollProgress / 0.15 * 0.3 : Math.max(0, 1 - (scrollProgress - 0.15) / 0.05),
            pointerEvents: scrollProgress > 0.2 ? "none" : "auto",
          }}
        >
          <HeroSection />
        </div>

        {/* Pain Points (20-50%) */}
        <div
          style={{
            opacity: scrollProgress >= 0.18 && scrollProgress <= 0.55 ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: scrollProgress >= 0.18 && scrollProgress <= 0.55 ? "auto" : "none",
          }}
        >
          <PainPointsSection />
        </div>

        {/* Trust Data (60-75%) */}
        <div
          style={{
            opacity: scrollProgress >= 0.55 && scrollProgress <= 0.80 ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: scrollProgress >= 0.55 && scrollProgress <= 0.80 ? "auto" : "none",
          }}
        >
          <TrustSection />
        </div>

        {/* Pricing (85-95%) */}
        <div
          style={{
            opacity: scrollProgress >= 0.80 && scrollProgress <= 0.97 ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: scrollProgress >= 0.80 && scrollProgress <= 0.97 ? "auto" : "none",
          }}
        >
          <PricingSection />
        </div>

        {/* CTA + Footer (95-100%) */}
        <div
          style={{
            opacity: scrollProgress >= 0.92 ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: scrollProgress >= 0.92 ? "auto" : "none",
          }}
        >
          <CTASection />
          <Footer />
        </div>
      </div>
    </div>
  );
}
