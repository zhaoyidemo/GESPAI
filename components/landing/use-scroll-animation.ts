"use client";

import { useEffect, useRef, useCallback } from "react";

interface ScrollAnimationConfig {
  totalHeight: string; // e.g. "550vh"
  onProgress: (progress: number) => void;
}

export function useScrollAnimation({ totalHeight, onProgress }: ScrollAnimationConfig) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const gsapContextRef = useRef<{ kill: () => void } | null>(null);

  const initScrollTrigger = useCallback(async () => {
    const gsapModule = await import("gsap");
    const scrollTriggerModule = await import("gsap/ScrollTrigger");
    const gsap = gsapModule.default;
    const { ScrollTrigger } = scrollTriggerModule;

    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        onProgress(self.progress);
      },
    });

    gsapContextRef.current = {
      kill: () => {
        trigger.kill();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      },
    };
  }, [onProgress]);

  useEffect(() => {
    initScrollTrigger();
    return () => {
      gsapContextRef.current?.kill();
    };
  }, [initScrollTrigger]);

  return { containerRef, progressRef };
}

// Animate numbers counting up (for trust section)
export async function animateCountUp(
  element: HTMLElement,
  target: string,
  duration = 1.5
) {
  const gsapModule = await import("gsap");
  const gsap = gsapModule.default;

  // Extract numeric part
  const numericMatch = target.match(/(\d+)/);
  if (!numericMatch) {
    element.textContent = target;
    return;
  }

  const numericTarget = parseInt(numericMatch[1]);
  const prefix = target.substring(0, target.indexOf(numericMatch[1]));
  const suffix = target.substring(
    target.indexOf(numericMatch[1]) + numericMatch[1].length
  );

  const obj = { val: 0 };
  gsap.to(obj, {
    val: numericTarget,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      element.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
    },
  });
}
