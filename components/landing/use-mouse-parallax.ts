"use client";

import { useEffect, useRef, useCallback } from "react";

export interface MouseState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  normalizedX: number;
  normalizedY: number;
}

export function useMouseParallax(lerpFactor = 0.05) {
  const mouseRef = useRef<MouseState>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const nx = (event.clientX / window.innerWidth) * 2 - 1;
    const ny = -(event.clientY / window.innerHeight) * 2 + 1;
    mouseRef.current.targetX = nx;
    mouseRef.current.targetY = ny;
    mouseRef.current.normalizedX = nx;
    mouseRef.current.normalizedY = ny;
  }, []);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (event.touches.length === 0) return;
    const touch = event.touches[0];
    const nx = (touch.clientX / window.innerWidth) * 2 - 1;
    const ny = -(touch.clientY / window.innerHeight) * 2 + 1;
    mouseRef.current.targetX = nx;
    mouseRef.current.targetY = ny;
    mouseRef.current.normalizedX = nx;
    mouseRef.current.normalizedY = ny;
  }, []);

  // Call this in your animation loop
  const update = useCallback(() => {
    const m = mouseRef.current;
    m.x += (m.targetX - m.x) * lerpFactor;
    m.y += (m.targetY - m.y) * lerpFactor;
  }, [lerpFactor]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleMouseMove, handleTouchMove]);

  return { mouseRef, update };
}
