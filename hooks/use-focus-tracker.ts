"use client";

import { useEffect, useRef, useCallback } from "react";
import { useFocusStore } from "@/stores/focus-store";

interface UseFocusTrackerOptions {
  pageType: string;
  pageId?: string;
}

const HEARTBEAT_INTERVAL = 30_000; // 30 秒心跳保存到服务端
const TICK_INTERVAL = 1_000; // 1 秒刷新 UI

// 判断用户是否真正在看 GESP AI：标签页可见 + 窗口聚焦
function isUserActive() {
  return !document.hidden && document.hasFocus();
}

export function useFocusTracker({ pageType, pageId }: UseFocusTrackerOptions) {
  const store = useFocusStore();

  // 用 ref 追踪计时数据，避免闭包陈旧问题
  const sessionIdRef = useRef<string | null>(null);
  const focusStartRef = useRef<number>(Date.now());
  const focusAccRef = useRef(0); // 累计专注时间（毫秒）
  const totalStartRef = useRef<number>(Date.now());
  const blurCountRef = useRef(0);
  const isActiveRef = useRef(true);

  // 获取当前数据快照
  const getSnapshot = useCallback(() => {
    const now = Date.now();
    const totalSeconds = Math.round((now - totalStartRef.current) / 1000);

    let focusSeconds = Math.round(focusAccRef.current / 1000);
    if (isActiveRef.current) {
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

  // 统一处理焦点状态变化（visibilitychange / window blur / window focus）
  const handleFocusChange = useCallback(() => {
    const now = Date.now();
    const wasActive = isActiveRef.current;
    const nowActive = isUserActive();

    if (wasActive === nowActive) return; // 状态没变，忽略

    isActiveRef.current = nowActive;

    if (!nowActive) {
      // 专注 → 分心：暂停专注计时
      focusAccRef.current += now - focusStartRef.current;
      blurCountRef.current += 1;
      store.setIsActive(false);
      store.setBlurCount(blurCountRef.current);
    } else {
      // 分心 → 专注：恢复专注计时
      focusStartRef.current = now;
      store.setIsActive(true);
    }
  }, [store]);

  // 初始化：创建会话 + 注册事件 + 启动定时器
  useEffect(() => {
    let heartbeatTimer: ReturnType<typeof setInterval>;
    let tickTimer: ReturnType<typeof setInterval>;
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
        isActiveRef.current = isUserActive();

        store.setSessionId(data.id);
        store.setIsTracking(true);
        store.setIsActive(isActiveRef.current);

        // 如果初始就不在前台，记录一下
        if (!isActiveRef.current) {
          focusStartRef.current = 0; // 不累加
        }

        // 1 秒 UI 刷新
        tickTimer = setInterval(() => {
          const snapshot = getSnapshot();
          store.setFocusSeconds(snapshot.focusSeconds);
          store.setTotalSeconds(snapshot.totalSeconds);
        }, TICK_INTERVAL);

        // 30 秒心跳保存
        heartbeatTimer = setInterval(() => {
          syncToServer(false);
        }, HEARTBEAT_INTERVAL);

        // 注册三个事件，全面覆盖焦点丢失场景
        document.addEventListener("visibilitychange", handleFocusChange);
        window.addEventListener("blur", handleFocusChange);
        window.addEventListener("focus", handleFocusChange);
        window.addEventListener("beforeunload", beaconSync);
      } catch {
        // 静默忽略初始化错误
      }
    };

    init();

    return () => {
      mounted = false;
      clearInterval(heartbeatTimer);
      clearInterval(tickTimer);
      document.removeEventListener("visibilitychange", handleFocusChange);
      window.removeEventListener("blur", handleFocusChange);
      window.removeEventListener("focus", handleFocusChange);
      window.removeEventListener("beforeunload", beaconSync);

      // 组件卸载时结束会话
      if (sessionIdRef.current) {
        syncToServer(true);
      }

      store.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageType, pageId]);

  return {
    isActive: store.isActive,
    focusSeconds: store.focusSeconds,
    totalSeconds: store.totalSeconds,
    blurCount: store.blurCount,
  };
}
