import { create } from "zustand";

export type ContentType = "build" | "learn";
export type CardStyle = "dark" | "gradient" | "light";

export interface VibeResult {
  title: string;
  body: string;
  hashtags: string[];
  codeSnippet?: string | null;
}

export interface VibeSuggestion {
  id: string;
  label: string;
  contentType: ContentType;
  rawInput: string;
  emoji: string;
}

interface VibeState {
  contentType: ContentType;
  rawInput: string;
  generating: boolean;
  results: VibeResult[];
  selectedIndex: number;
  suggestions: VibeSuggestion[];
  suggestionsLoading: boolean;
  prefilled: boolean;
  cardStyle: CardStyle;
  error: string | null;

  setContentType: (type: ContentType) => void;
  setRawInput: (input: string) => void;
  setGenerating: (generating: boolean) => void;
  setResult: (result: VibeResult | null) => void;
  setResults: (results: VibeResult[]) => void;
  setSelectedIndex: (index: number) => void;
  setSuggestions: (suggestions: VibeSuggestion[]) => void;
  setSuggestionsLoading: (loading: boolean) => void;
  setPrefilled: (prefilled: boolean) => void;
  setCardStyle: (style: CardStyle) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useVibeStore = create<VibeState>((set) => ({
  contentType: "build",
  rawInput: "",
  generating: false,
  results: [],
  selectedIndex: 0,
  suggestions: [],
  suggestionsLoading: false,
  prefilled: false,
  cardStyle: "dark",
  error: null,

  setContentType: (type) => set({ contentType: type }),
  setRawInput: (input) => set({ rawInput: input }),
  setGenerating: (generating) => set({ generating }),
  setResult: (result) =>
    set({ results: result ? [result] : [], selectedIndex: 0 }),
  setResults: (results) => set({ results, selectedIndex: 0 }),
  setSelectedIndex: (index) => set({ selectedIndex: index }),
  setSuggestions: (suggestions) => set({ suggestions }),
  setSuggestionsLoading: (loading) => set({ suggestionsLoading: loading }),
  setPrefilled: (prefilled) => set({ prefilled }),
  setCardStyle: (style) => set({ cardStyle: style }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      contentType: "build",
      rawInput: "",
      generating: false,
      results: [],
      selectedIndex: 0,
      suggestions: [],
      suggestionsLoading: false,
      prefilled: false,
      cardStyle: "dark",
      error: null,
    }),
}));
