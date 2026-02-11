import { create } from "zustand";

export type ContentType = "build" | "learn";
export type CardStyle = "dark" | "gradient" | "light";

export interface VibeResult {
  title: string;
  body: string;
  hashtags: string[];
  codeSnippet?: string | null;
}

interface VibeState {
  contentType: ContentType;
  rawInput: string;
  generating: boolean;
  result: VibeResult | null;
  cardStyle: CardStyle;
  error: string | null;

  setContentType: (type: ContentType) => void;
  setRawInput: (input: string) => void;
  setGenerating: (generating: boolean) => void;
  setResult: (result: VibeResult | null) => void;
  setCardStyle: (style: CardStyle) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useVibeStore = create<VibeState>((set) => ({
  contentType: "build",
  rawInput: "",
  generating: false,
  result: null,
  cardStyle: "dark",
  error: null,

  setContentType: (type) => set({ contentType: type }),
  setRawInput: (input) => set({ rawInput: input }),
  setGenerating: (generating) => set({ generating }),
  setResult: (result) => set({ result }),
  setCardStyle: (style) => set({ cardStyle: style }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      contentType: "build",
      rawInput: "",
      generating: false,
      result: null,
      cardStyle: "dark",
      error: null,
    }),
}));
