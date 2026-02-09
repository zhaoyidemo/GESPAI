import { vi } from "vitest";

const mockPrisma = {
  problem: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    upsert: vi.fn(),
  },
  submission: {
    findMany: vi.fn(),
    groupBy: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  user: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  knowledgePoint: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
  },
  learningRecord: {
    upsert: vi.fn(),
  },
  mockExamResult: {
    findMany: vi.fn(),
    create: vi.fn(),
    deleteMany: vi.fn(),
  },
  preventionRule: {
    findMany: vi.fn(),
    update: vi.fn(),
  },
  $transaction: vi.fn((ops: unknown[]) => Promise.resolve(ops)),
};

vi.mock("@/lib/db", () => ({
  default: mockPrisma,
}));

export default mockPrisma;
