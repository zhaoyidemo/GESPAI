import { create } from "zustand";

interface FocusState {
  sessionId: string | null;
  isTracking: boolean;
  isPageVisible: boolean;
  focusSeconds: number;
  totalSeconds: number;
  blurCount: number;
  showReminder: boolean;
  lastBlurAt: number | null;
  awayDuration: number;

  setSessionId: (id: string | null) => void;
  setIsTracking: (tracking: boolean) => void;
  setIsPageVisible: (visible: boolean) => void;
  setFocusSeconds: (seconds: number) => void;
  setTotalSeconds: (seconds: number) => void;
  incrementBlurCount: () => void;
  setShowReminder: (show: boolean) => void;
  setLastBlurAt: (timestamp: number | null) => void;
  setAwayDuration: (duration: number) => void;
  reset: () => void;
}

export const useFocusStore = create<FocusState>((set) => ({
  sessionId: null,
  isTracking: false,
  isPageVisible: true,
  focusSeconds: 0,
  totalSeconds: 0,
  blurCount: 0,
  showReminder: false,
  lastBlurAt: null,
  awayDuration: 0,

  setSessionId: (id) => set({ sessionId: id }),
  setIsTracking: (tracking) => set({ isTracking: tracking }),
  setIsPageVisible: (visible) => set({ isPageVisible: visible }),
  setFocusSeconds: (seconds) => set({ focusSeconds: seconds }),
  setTotalSeconds: (seconds) => set({ totalSeconds: seconds }),
  incrementBlurCount: () => set((state) => ({ blurCount: state.blurCount + 1 })),
  setShowReminder: (show) => set({ showReminder: show }),
  setLastBlurAt: (timestamp) => set({ lastBlurAt: timestamp }),
  setAwayDuration: (duration) => set({ awayDuration: duration }),
  reset: () =>
    set({
      sessionId: null,
      isTracking: false,
      isPageVisible: true,
      focusSeconds: 0,
      totalSeconds: 0,
      blurCount: 0,
      showReminder: false,
      lastBlurAt: null,
      awayDuration: 0,
    }),
}));
