"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
}

interface CelebrationProps {
  show: boolean;
  onComplete?: () => void;
  duration?: number;
  particleCount?: number;
}

const COLORS = [
  "#FF6B6B", // 红
  "#4ECDC4", // 青
  "#45B7D1", // 蓝
  "#96CEB4", // 绿
  "#FFEAA7", // 黄
  "#DDA0DD", // 紫
  "#FF9F43", // 橙
  "#A29BFE", // 淡紫
];

export function Celebration({
  show,
  onComplete,
  duration = 3000,
  particleCount = 100,
}: CelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100, // 百分比
        y: -10 - Math.random() * 20, // 从顶部开始
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 8 + Math.random() * 8,
        speedX: (Math.random() - 0.5) * 3,
        speedY: 2 + Math.random() * 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      });
    }
    return newParticles;
  }, [particleCount]);

  useEffect(() => {
    if (!show) {
      setParticles([]);
      return;
    }

    // 创建粒子
    setParticles(createParticles());

    // 动画循环
    let animationId: number;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed >= duration) {
        setParticles([]);
        onComplete?.();
        return;
      }

      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: p.x + p.speedX * 0.1,
          y: p.y + p.speedY * 0.3,
          rotation: p.rotation + p.rotationSpeed,
          speedY: p.speedY + 0.05, // 重力
        }))
      );

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [show, duration, onComplete, createParticles]);

  if (!mounted || !show || particles.length === 0) return null;

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            opacity: Math.max(0, 1 - particle.y / 150),
          }}
        />
      ))}
    </div>,
    document.body
  );
}

// 任务完成提示组件
interface TaskCompletionToastProps {
  show: boolean;
  completedCount: number;
  totalCount: number;
  xpEarned: number;
  streakDays: number;
  isAllCompleted: boolean;
  onClose: () => void;
}

export function TaskCompletionToast({
  show,
  completedCount,
  totalCount,
  xpEarned,
  streakDays,
  isAllCompleted,
  onClose,
}: TaskCompletionToastProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!mounted || !show) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">
      <div
        className={`
          pointer-events-auto
          bg-white
          rounded-2xl shadow-2xl
          p-6 max-w-sm w-full mx-4
          transform transition-all duration-500
          ${show ? "scale-100 opacity-100" : "scale-95 opacity-0"}
          border-2
          ${isAllCompleted ? "border-green-400" : "border-primary/50"}
        `}
      >
        {isAllCompleted ? (
          // 全部完成
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              太棒了！
            </h3>
            <p className="text-lg text-muted-foreground mb-4">
              今日任务全部完成！
            </p>
            <div className="flex justify-center gap-6 mb-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-500">+{xpEarned}</p>
                <p className="text-xs text-muted-foreground">经验值</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-500">{streakDays}</p>
                <p className="text-xs text-muted-foreground">连胜天数</p>
              </div>
            </div>
            <p className="text-sm text-green-600 font-medium">
              继续保持，明天见！
            </p>
          </div>
        ) : (
          // 部分完成
          <div className="text-center">
            <div className="text-5xl mb-3">✨</div>
            <h3 className="text-xl font-bold mb-2">任务完成！</h3>
            <p className="text-muted-foreground mb-4">
              今日进度 {completedCount}/{totalCount}
            </p>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              再完成 {totalCount - completedCount} 个任务就能保持连胜！
            </p>
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
        >
          <svg
            className="w-5 h-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>,
    document.body
  );
}
