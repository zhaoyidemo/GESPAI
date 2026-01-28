"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

interface AnimatedBackgroundProps {
  className?: string;
  variant?: "fluid" | "particles";
}

// 动态导入粒子场组件（避免 SSR 问题）
const ParticleField = dynamic(
  () => import("./particle-field").then((mod) => mod.ParticleField),
  {
    ssr: false,
    loading: () => <FluidBackground />,
  }
);

// 纯 CSS 流体背景（备用/加载时显示）
export function FluidBackground({ className }: { className?: string }) {
  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className || ""}`}>
      {/* 主背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/50 to-slate-900" />

      {/* 动态光斑 */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-radial from-cyan-500/20 via-cyan-500/5 to-transparent rounded-full blur-3xl animate-blob" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-radial from-violet-500/20 via-violet-500/5 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-gradient-radial from-fuchsia-500/15 via-fuchsia-500/5 to-transparent rounded-full blur-3xl animate-blob animation-delay-4000" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-radial from-emerald-500/15 via-emerald-500/5 to-transparent rounded-full blur-3xl animate-blob animation-delay-3000" />

      {/* 网格纹理 */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />

      {/* 噪点纹理 */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* 渐变覆盖 */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/60" />
    </div>
  );
}

// 主背景组件 - 可切换模式
export function AnimatedBackground({ className, variant = "particles" }: AnimatedBackgroundProps) {
  const [mounted, setMounted] = useState(false);
  const [useParticles, setUseParticles] = useState(true);

  useEffect(() => {
    setMounted(true);

    // 检测是否为低性能设备
    const checkPerformance = () => {
      // 移动设备或低分辨率设备使用简化版本
      if (typeof window !== "undefined") {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const isLowRes = window.innerWidth < 768;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion || (isMobile && isLowRes)) {
          setUseParticles(false);
        }
      }
    };

    checkPerformance();
  }, []);

  if (!mounted) {
    return <FluidBackground className={className} />;
  }

  if (variant === "fluid" || !useParticles) {
    return <FluidBackground className={className} />;
  }

  return <ParticleField className={className} />;
}

// Canvas 动画背景（中等复杂度）
export function CanvasBackground({ className }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 颜色配置
    const colors = [
      { r: 0, g: 245, b: 255 },    // 青色
      { r: 255, g: 0, b: 255 },    // 品红
      { r: 139, g: 92, b: 246 },   // 紫色
      { r: 0, g: 255, b: 136 },    // 绿色
      { r: 59, g: 130, b: 246 },   // 蓝色
    ];

    const render = () => {
      time += 0.003;

      // 深色背景
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制动态光斑
      for (let i = 0; i < 5; i++) {
        const color = colors[i];
        const x = canvas.width * (0.2 + 0.6 * Math.sin(time * 0.5 + i * 1.5));
        const y = canvas.height * (0.2 + 0.6 * Math.cos(time * 0.3 + i * 2));
        const radius = 200 + 100 * Math.sin(time + i);

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.15)`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 ${className || ""}`}
      style={{ pointerEvents: "none" }}
    />
  );
}
