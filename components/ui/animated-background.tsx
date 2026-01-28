"use client";

import { useEffect, useRef } from "react";

interface AnimatedBackgroundProps {
  className?: string;
}

export function AnimatedBackground({ className }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // 设置画布尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 流体渐变颜色
    const colors = {
      light: [
        { r: 99, g: 102, b: 241 },   // 靛蓝 indigo-500
        { r: 139, g: 92, b: 246 },   // 紫罗兰 violet-500
        { r: 59, g: 130, b: 246 },   // 蓝色 blue-500
        { r: 16, g: 185, b: 129 },   // 翡翠绿 emerald-500
      ],
      dark: [
        { r: 30, g: 41, b: 59 },     // slate-800
        { r: 49, g: 46, b: 129 },    // indigo-900
        { r: 88, g: 28, b: 135 },    // purple-900
        { r: 30, g: 58, b: 138 },    // blue-900
      ]
    };

    // 流体波动函数
    const noise = (x: number, y: number, t: number) => {
      return Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t * 0.5) * 0.5 + 0.5;
    };

    // 渲染帧
    const render = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const palette = isDark ? colors.dark : colors.light;

      time += 0.005;

      // 创建渐变
      const gradient = ctx.createLinearGradient(
        canvas.width * (0.3 + Math.sin(time * 0.3) * 0.2),
        0,
        canvas.width * (0.7 + Math.cos(time * 0.2) * 0.2),
        canvas.height
      );

      // 动态渐变色停止点
      palette.forEach((color, index) => {
        const offset = (index / (palette.length - 1));
        const dynamicOffset = offset + Math.sin(time + index) * 0.1;
        const clampedOffset = Math.max(0, Math.min(1, dynamicOffset));
        gradient.addColorStop(
          clampedOffset,
          `rgba(${color.r}, ${color.g}, ${color.b}, ${isDark ? 0.8 : 0.15})`
        );
      });

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 添加流动的光斑
      for (let i = 0; i < 5; i++) {
        const x = canvas.width * (0.2 + 0.6 * noise(i * 100, 0, time * 0.5));
        const y = canvas.height * (0.2 + 0.6 * noise(0, i * 100, time * 0.3));
        const radius = 150 + 100 * Math.sin(time + i);

        const spotGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        const color = palette[i % palette.length];
        spotGradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${isDark ? 0.3 : 0.1})`);
        spotGradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

        ctx.fillStyle = spotGradient;
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

// 备选：纯CSS流体背景（性能更好）
export function FluidBackground({ className }: AnimatedBackgroundProps) {
  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className || ""}`}>
      {/* 主背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 dark:from-slate-950 dark:via-indigo-950/50 dark:to-slate-900" />

      {/* 动态光斑 */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-radial from-violet-400/30 via-violet-400/10 to-transparent dark:from-violet-600/20 dark:via-violet-600/5 rounded-full blur-3xl animate-blob" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-radial from-blue-400/30 via-blue-400/10 to-transparent dark:from-blue-600/20 dark:via-blue-600/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-indigo-400/20 via-indigo-400/5 to-transparent dark:from-indigo-500/15 dark:via-indigo-500/5 rounded-full blur-3xl animate-blob animation-delay-4000" />

      {/* 网格纹理 */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />

      {/* 渐变覆盖 */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40" />
    </div>
  );
}
