"use client";

import { useEffect, useRef } from "react";

export default function MobileFallback() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create floating particle divs
    const particles: HTMLDivElement[] = [];
    const count = 20;

    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      const size = 2 + Math.random() * 4;
      p.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(91, 106, 240, ${0.2 + Math.random() * 0.3});
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: mobileParticleFloat ${6 + Math.random() * 8}s ease-in-out infinite;
        animation-delay: ${-Math.random() * 8}s;
        filter: blur(${Math.random() < 0.3 ? 1 : 0}px);
      `;
      container.appendChild(p);
      particles.push(p);
    }

    return () => {
      particles.forEach((p) => {
        if (container.contains(p)) container.removeChild(p);
      });
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden" ref={containerRef}>
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(91, 106, 240, 0.15) 0%, rgba(139, 92, 246, 0.08) 40%, #06060f 80%)",
        }}
      />
      {/* Central glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(91, 106, 240, 0.2) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation: "mobileGlow 4s ease-in-out infinite",
        }}
      />
    </div>
  );
}
