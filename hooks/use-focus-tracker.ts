"use client";

import { useEffect, useRef, useCallback } from "react";
import { useFocusStore } from "@/stores/focus-store";

interface UseFocusTrackerOptions {
  pageType: string;
  pageId?: string;
}

const HEARTBEAT_INTERVAL = 30_000; // 30 秒心跳
const REMINDER_THRESHOLD = 30; // 离开 30 秒后显示提醒

export function useFocusTracker({ pageType, pageId }: UseFocusTrackerOptions) {
  const store = useFocusStore();

  // 用 ref 追踪计时数据，避免闭包陈旧问题
  const sessionIdRef = useRef<string | null>(null);
  const focusStartRef = useRef<number>(Date.now());
  const focusAccRef = useRef(0); // 累计专注时间（毫秒）
  const totalStartRef = useRef<number>(Date.now());
  const blurCountRef = useRef(0);
  const lastBlurAtRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);

  // 获取当前数据快照（供心跳/结束使用）
  const getSnapshot = useCallback(() => {
    const now = Date.now();
    const totalSeconds = Math.round((now - totalStartRef.current) / 1000);

    let focusSeconds = Math.round(focusAccRef.current / 1000);
    if (isVisibleRef.current) {
      focusSeconds += Math.round((now - focusStartRef.current) / 1000);
    }

    return {
      sessionId: sessionIdRef.current,
      focusSeconds,
      totalSeconds,
      blurCount: blurCountRef.current,
    };
  }, []);

  // 同步数据到服务端
  const syncToServer = useCallback(
    async (end = false) => {
      const snapshot = getSnapshot();
      if (!snapshot.sessionId) return;

      try {
        await fetch("/api/focus", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...snapshot, end }),
        });
      } catch {
        // 静默忽略网络错误
      }
    },
    [getSnapshot]
  );

  // sendBeacon 用于页面关闭时保存
  const beaconSync = useCallback(() => {
    const snapshot = getSnapshot();
    if (!snapshot.sessionId) return;

    navigator.sendBeacon(
      "/api/focus",
      new Blob(
        [JSON.stringify({ ...snapshot, end: true })],
        { type: "application/json" }
      )
    );
  }, [getSnapshot]);

  // 处理 visibilitychange 事件
  const handleVisibilityChange = useCallback(() => {
    const now = Date.now();

    if (document.hidden) {
      // 页面隐藏：暂停计时
      isVisibleRef.current = false;
      lastBlurAtRef.current = now;
      blurCountRef.current += 1;

      // 累积当前这段专注时间
      focusAccRef.current += now - focusStartRef.current;

      store.setIsPageVisible(false);
      store.incrementBlurCount();
      store.setLastBlurAt(now);
    } else {
      // 页面恢复：恢复计时
      isVisibleRef.current = true;
      focusStartRef.current = now;

      const awayMs = lastBlurAtRef.current ? now - lastBlurAtRef.current : 0;
      const awaySeconds = Math.round(awayMs / 1000);

      store.setIsPageVisible(true);
      store.setAwayDuration(awaySeconds);

      // 离开超过阈值则显示提醒
      if (awaySeconds >= REMINDER_THRESHOLD) {
        store.setShowReminder(true);
      }

      // 更新 store 中的时间
      const snapshot = getSnapshot();
      store.setFocusSeconds(snapshot.focusSeconds);
      store.setTotalSeconds(snapshot.totalSeconds);
    }
  }, [store, getSnapshot]);

  // 初始化：创建会话 + 注册事件
  useEffect(() => {
    let heartbeatTimer: ReturnType<typeof setInterval>;
    let mounted = true;

    const init = async () => {
      try {
        const response = await fetch("/api/focus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pageType, pageId }),
        });

        if (!response.ok) return;
        const data = await response.json();

        if (!mounted) return;

        sessionIdRef.current = data.id;
        focusStartRef.current = Date.now();
        totalStartRef.current = Date.now();
        focusAccRef.current = 0;
        blurCountRef.current = 0;
        lastBlurAtRef.current = null;
        isVisibleRef.current = !document.hidden;

        store.setSessionId(data.id);
        store.setIsTracking(true);

        // 心跳定时器
        heartbeatTimer = setInterval(() => {
          syncToServer(false);
          const snapshot = getSnapshot();
          store.setFocusSeconds(snapshot.focusSeconds);
          store.setTotalSeconds(snapshot.totalSeconds);
        }, HEARTBEAT_INTERVAL);

        // 注册事件监听
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("beforeunload", beaconSync);
      } catch {
        // 静默忽略初始化错误
      }
    };

    init();

    return () => {
      mounted = false;
      clearInterval(heartbeatTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", beaconSync);

      // 组件卸载时结束会话
      if (sessionIdRef.current) {
        syncToServer(true);
      }

      store.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageType, pageId]);

  const dismissReminder = useCallback(() => {
    store.setShowReminder(false);
  }, [store]);

  return {
    showReminder: store.showReminder,
    awayDuration: store.awayDuration,
    dismissReminder,
    focusSeconds: store.focusSeconds,
    totalSeconds: store.totalSeconds,
    blurCount: store.blurCount,
  };
}
