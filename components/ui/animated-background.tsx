"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedBackgroundProps {
  className?: string;
  variant?: "simple" | "fluid" | "particles";
}

// 方案4：纯色渐变背景 + 网格纹理（无动画，最简洁）
export function SimpleBackground({ className }: { className?: string }) {
  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className || ""}`}>
      {/* 主背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      {/* 网格纹理 */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      {/* 顶部微弱光晕 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-primary/5 via-transparent to-transparent" />

      {/* 边角渐变 */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
    </div>
  );
}

// 纯 CSS 流体背景（备用）
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

      {/* 渐变覆盖 */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/60" />
    </div>
  );
}

// 主背景组件 - 默认使用简洁版本
export function AnimatedBackground({ className, variant = "simple" }: AnimatedBackgroundProps) {
  if (variant === "fluid") {
    return <FluidBackground className={className} />;
  }

  // 默认使用简洁背景
  return <SimpleBackground className={className} />;
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
