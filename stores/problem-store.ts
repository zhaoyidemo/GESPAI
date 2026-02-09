import { create } from "zustand";

interface Problem {
  id: string;
  title: string;
  level: number;
  difficulty: string;
  knowledgePoints: string[];
  description: string;
  inputFormat: string | null;
  outputFormat: string | null;
  samples: Array<{ input: string; output: string; explanation?: string }>;
  timeLimit: number;
  memoryLimit: number;
  hint: string | null;
}

interface TestResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  time: number | null;
  memory: number | null;
  status: string;
}

interface JudgeResult {
  id?: string;
  status: string;
  score: number;
  testResults: TestResult[];
  xpEarned?: number;
}

interface SubmissionRecord {
  id: string;
  status: string;
  score: number;
  language: string;
  code: string;
  testResults: TestResult[] | null;
  createdAt: string;
  problem: { id: string; title: string };
  errorCase: { id: string } | null;
}

const DEFAULT_CODE = `#include <iostream>
using namespace std;

int main() {
    // 在这里编写你的代码

    return 0;
}
`;

interface ProblemState {
  problem: Problem | null;
  code: string;
  loading: boolean;
  submitting: boolean;
  running: boolean;
  judgeResult: JudgeResult | null;
  runResult: JudgeResult | null;
  activeResultType: "run" | "submit";
  submissions: SubmissionRecord[];
  selectedSubmission: SubmissionRecord | null;
  activeTab: string;
  recordingError: boolean;

  setProblem: (problem: Problem | null) => void;
  setCode: (code: string) => void;
  setLoading: (loading: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  setRunning: (running: boolean) => void;
  setJudgeResult: (result: JudgeResult | null) => void;
  setRunResult: (result: JudgeResult | null) => void;
  setActiveResultType: (type: "run" | "submit") => void;
  setSubmissions: (submissions: SubmissionRecord[]) => void;
  setSelectedSubmission: (submission: SubmissionRecord | null) => void;
  setActiveTab: (tab: string) => void;
  setRecordingError: (recording: boolean) => void;
  reset: () => void;
}

export const useProblemStore = create<ProblemState>((set) => ({
  problem: null,
  code: DEFAULT_CODE,
  loading: true,
  submitting: false,
  running: false,
  judgeResult: null,
  runResult: null,
  activeResultType: "submit",
  submissions: [],
  selectedSubmission: null,
  activeTab: "description",
  recordingError: false,

  setProblem: (problem) => set({ problem }),
  setCode: (code) => set({ code }),
  setLoading: (loading) => set({ loading }),
  setSubmitting: (submitting) => set({ submitting }),
  setRunning: (running) => set({ running }),
  setJudgeResult: (result) => set({ judgeResult: result }),
  setRunResult: (result) => set({ runResult: result }),
  setActiveResultType: (type) => set({ activeResultType: type }),
  setSubmissions: (submissions) => set({ submissions }),
  setSelectedSubmission: (submission) => set({ selectedSubmission: submission }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setRecordingError: (recording) => set({ recordingError: recording }),
  reset: () =>
    set({
      problem: null,
      code: DEFAULT_CODE,
      loading: true,
      submitting: false,
      running: false,
      judgeResult: null,
      runResult: null,
      activeResultType: "submit",
      submissions: [],
      selectedSubmission: null,
      activeTab: "description",
      recordingError: false,
    }),
}));

export type { Problem, TestResult, JudgeResult, SubmissionRecord };
