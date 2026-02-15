import { create } from "zustand";

interface FocusState {
  sessionId: string | null;
  isTracking: boolean;
  isActive: boolean; // 页面可见 + 窗口聚焦
  focusSeconds: number;
  totalSeconds: number;
  blurCount: number;

  setSessionId: (id: string | null) => void;
  setIsTracking: (tracking: boolean) => void;
  setIsActive: (active: boolean) => void;
  setFocusSeconds: (seconds: number) => void;
  setTotalSeconds: (seconds: number) => void;
  setBlurCount: (count: number) => void;
  reset: () => void;
}

export const useFocusStore = create<FocusState>((set) => ({
  sessionId: null,
  isTracking: false,
  isActive: true,
  focusSeconds: 0,
  totalSeconds: 0,
  blurCount: 0,

  setSessionId: (id) => set({ sessionId: id }),
  setIsTracking: (tracking) => set({ isTracking: tracking }),
  setIsActive: (active) => set({ isActive: active }),
  setFocusSeconds: (seconds) => set({ focusSeconds: seconds }),
  setTotalSeconds: (seconds) => set({ totalSeconds: seconds }),
  setBlurCount: (count) => set({ blurCount: count }),
  reset: () =>
    set({
      sessionId: null,
      isTracking: false,
      isActive: true,
      focusSeconds: 0,
      totalSeconds: 0,
      blurCount: 0,
    }),
}));
