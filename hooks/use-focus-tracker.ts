"use client";

import { useEffect, useRef, useCallback } from "react";
import { useFocusStore } from "@/stores/focus-store";

const HEARTBEAT_INTERVAL = 30_000; // 30 秒心跳保存到服务端
const TICK_INTERVAL = 1_000; // 1 秒刷新 UI

// 判断用户是否真正在看 GESP AI：标签页可见 + 窗口聚焦
function isUserActive() {
  return !document.hidden && document.hasFocus();
}

// 获取今日零点的 ISO 字符串（客户端本地时区）
function getTodayStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
}

export function useFocusTracker() {
  const store = useFocusStore();

  const sessionIdRef = useRef<string | null>(null);
  const focusStartRef = useRef<number>(Date.now());
  const focusAccRef = useRef(0); // 累计专注时间（毫秒）
  const totalStartRef = useRef<number>(Date.now());
  const blurCountRef = useRef(0);
  const isActiveRef = useRef(true);
  const sessionDateRef = useRef<string>(new Date().toDateString());
  const rollingOverRef = useRef(false); // 防止午夜翻转重入

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
        [JSON.stringify({ ...snapshot, end: false })],
        { type: "application/json" }
      )
    );
  }, [getSnapshot]);

  // 创建或恢复今日会话
  const createSession = useCallback(async () => {
    const response = await fetch("/api/focus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dayStart: getTodayStart() }),
    });

    if (!response.ok) return null;
    return await response.json();
  }, []);

  // 用服务端返回的累计数据初始化 refs
  const initFromServer = useCallback(
    (data: { id: string; focusSeconds: number; totalSeconds: number; blurCount: number }) => {
      sessionIdRef.current = data.id;
      // totalStart 倒推：让 Date.now() - totalStart = 已有的 totalSeconds
      totalStartRef.current = Date.now() - data.totalSeconds * 1000;
      // focus 累计器初始化为服务端保存的值
      focusAccRef.current = data.focusSeconds * 1000;
      focusStartRef.current = Date.now();
      blurCountRef.current = data.blurCount;
      isActiveRef.current = isUserActive();
      sessionDateRef.current = new Date().toDateString();

      store.setSessionId(data.id);
      store.setIsTracking(true);
      store.setIsActive(isActiveRef.current);
      store.setFocusSeconds(data.focusSeconds);
      store.setTotalSeconds(data.totalSeconds);
      store.setBlurCount(data.blurCount);
    },
    [store]
  );

  // 午夜翻转：结束旧会话，创建新会话
  const rolloverDay = useCallback(async () => {
    if (rollingOverRef.current) return;
    rollingOverRef.current = true;

    try {
      // 结束旧会话
      await syncToServer(true);

      // 创建新会话
      const data = await createSession();
      if (data) {
        initFromServer(data);
      }
    } finally {
      rollingOverRef.current = false;
    }
  }, [syncToServer, createSession, initFromServer]);

  // 统一处理焦点状态变化
  const handleFocusChange = useCallback(() => {
    const now = Date.now();
    const wasActive = isActiveRef.current;
    const nowActive = isUserActive();

    if (wasActive === nowActive) return;

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

  // 初始化：一次性挂载，不依赖 URL 变化
  useEffect(() => {
    let heartbeatTimer: ReturnType<typeof setInterval>;
    let tickTimer: ReturnType<typeof setInterval>;
    let mounted = true;

    const init = async () => {
      try {
        const data = await createSession();
        if (!data || !mounted) return;

        initFromServer(data);

        // 1 秒 UI 刷新 + 午夜检测
        tickTimer = setInterval(() => {
          const todayStr = new Date().toDateString();
          if (sessionDateRef.current !== todayStr) {
            rolloverDay();
            return;
          }

          const snapshot = getSnapshot();
          store.setFocusSeconds(snapshot.focusSeconds);
          store.setTotalSeconds(snapshot.totalSeconds);
        }, TICK_INTERVAL);

        // 30 秒心跳保存
        heartbeatTimer = setInterval(() => {
          syncToServer(false);
        }, HEARTBEAT_INTERVAL);

        // 注册三个事件
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

      if (sessionIdRef.current) {
        syncToServer(false);
      }

      store.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isActive: store.isActive,
    focusSeconds: store.focusSeconds,
    totalSeconds: store.totalSeconds,
    blurCount: store.blurCount,
  };
}
