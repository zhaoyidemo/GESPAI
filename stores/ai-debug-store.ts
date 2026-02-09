import { create } from "zustand";
import type { AIConversation } from "@/components/ai-debug-drawer";

interface AIDebugState {
  drawerOpen: boolean;
  conversations: AIConversation[];
  loading: boolean;
  helpCount: number;

  setDrawerOpen: (open: boolean) => void;
  addConversation: (conv: AIConversation) => void;
  setLoading: (loading: boolean) => void;
  setHelpCount: (count: number) => void;
  reset: () => void;
}

export const useAIDebugStore = create<AIDebugState>((set) => ({
  drawerOpen: false,
  conversations: [],
  loading: false,
  helpCount: 0,

  setDrawerOpen: (open) => set({ drawerOpen: open }),
  addConversation: (conv) =>
    set((state) => ({ conversations: [...state.conversations, conv] })),
  setLoading: (loading) => set({ loading }),
  setHelpCount: (count) => set({ helpCount: count }),
  reset: () =>
    set({
      drawerOpen: false,
      conversations: [],
      loading: false,
      helpCount: 0,
    }),
}));
