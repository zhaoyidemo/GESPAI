import { create } from "zustand";

export type ContentType = "build" | "learn" | "weekly";
export type CardStyle =
  | "dark"
  | "gradient"
  | "light"
  | "campus"
  | "pixel"
  | "journal";
export type CardSize = "3:4" | "1:1";
export type TonePreset =
  | "inspirational"
  | "technical"
  | "humble-brag"
  | "casual";

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

export interface VibeHistoryItem {
  id: string;
  title: string;
  contentType: string;
  cardStyle: string;
  shared: boolean;
  createdAt: string;
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
  cardSize: CardSize;
  tone: TonePreset;
  editMode: boolean;
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
  setCardSize: (size: CardSize) => void;
  setTone: (tone: TonePreset) => void;
  setEditMode: (editMode: boolean) => void;
  updateCurrentResult: (partial: Partial<VibeResult>) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useVibeStore = create<VibeState>((set, get) => ({
  contentType: "build",
  rawInput: "",
  generating: false,
  results: [],
  selectedIndex: 0,
  suggestions: [],
  suggestionsLoading: false,
  prefilled: false,
  cardStyle: "dark",
  cardSize: "3:4",
  tone: "inspirational",
  editMode: false,
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
  setCardSize: (size) => set({ cardSize: size }),
  setTone: (tone) => set({ tone }),
  setEditMode: (editMode) => set({ editMode }),
  updateCurrentResult: (partial) => {
    const { results, selectedIndex } = get();
    if (results[selectedIndex]) {
      const updated = [...results];
      updated[selectedIndex] = { ...updated[selectedIndex], ...partial };
      set({ results: updated });
    }
  },
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
      cardSize: "3:4",
      tone: "inspirational",
      editMode: false,
      error: null,
    }),
}));
