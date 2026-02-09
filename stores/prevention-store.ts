import { create } from "zustand";

interface TriggeredRule {
  id: string;
  errorType: string;
  rule: string;
  hitCount: number;
}

interface RuleWarning {
  ruleIndex: number;
  issue: string;
  suggestion: string;
  rule: string;
}

interface PreventionState {
  alertOpen: boolean;
  triggeredRules: TriggeredRule[];
  warnings: RuleWarning[];
  skipCheck: boolean;

  setAlertOpen: (open: boolean) => void;
  setTriggeredRules: (rules: TriggeredRule[]) => void;
  setWarnings: (warnings: RuleWarning[]) => void;
  setSkipCheck: (skip: boolean) => void;
  reset: () => void;
}

export const usePreventionStore = create<PreventionState>((set) => ({
  alertOpen: false,
  triggeredRules: [],
  warnings: [],
  skipCheck: false,

  setAlertOpen: (open) => set({ alertOpen: open }),
  setTriggeredRules: (rules) => set({ triggeredRules: rules }),
  setWarnings: (warnings) => set({ warnings }),
  setSkipCheck: (skip) => set({ skipCheck: skip }),
  reset: () =>
    set({
      alertOpen: false,
      triggeredRules: [],
      warnings: [],
      skipCheck: false,
    }),
}));
