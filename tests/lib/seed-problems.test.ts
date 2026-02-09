import { describe, it, expect, vi, beforeEach } from "vitest";
import mockPrisma from "../mocks/db";
import "../mocks/auth";

// Mock NextResponse
vi.mock("next/server", () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200,
      _data: data,
    }),
  },
}));

import { seedProblems } from "@/lib/seed-problems";

describe("seedProblems", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const sampleProblems = [
    {
      title: "测试题目1",
      source: "gesp_official",
      sourceId: "B0001",
      sourceUrl: "https://www.luogu.com.cn/problem/B0001",
      level: 1,
      knowledgePoints: ["基础"],
      difficulty: "入门",
      description: "这是一道测试题",
      inputFormat: "输入一个整数",
      outputFormat: "输出一个整数",
      samples: [{ input: "1", output: "1" }],
      testCases: [{ input: "1", output: "1" }],
      timeLimit: 1000,
      memoryLimit: 128,
      hint: "无",
    },
  ];

  it("应创建新题目", async () => {
    mockPrisma.problem.findFirst.mockResolvedValue(null);
    mockPrisma.problem.create.mockResolvedValue({ id: "new-id" });

    const response = await seedProblems(sampleProblems, "GESP 1级");
    const data = (response as unknown as { _data: Record<string, unknown> })._data;

    expect(data.success).toBe(true);
    expect(data.addedCount).toBe(1);
    expect(data.updatedCount).toBe(0);
    expect(mockPrisma.problem.create).toHaveBeenCalledTimes(1);
  });

  it("应更新已存在的题目", async () => {
    mockPrisma.problem.findFirst.mockResolvedValue({ id: "existing-id", sourceId: "B0001" });
    mockPrisma.problem.update.mockResolvedValue({ id: "existing-id" });

    const response = await seedProblems(sampleProblems, "GESP 1级");
    const data = (response as unknown as { _data: Record<string, unknown> })._data;

    expect(data.success).toBe(true);
    expect(data.addedCount).toBe(0);
    expect(data.updatedCount).toBe(1);
    expect(mockPrisma.problem.update).toHaveBeenCalledTimes(1);
  });

  it("应处理数据库错误", async () => {
    mockPrisma.problem.findFirst.mockRejectedValue(new Error("DB error"));

    const response = await seedProblems(sampleProblems, "GESP 1级");
    const result = response as unknown as { status: number; _data: Record<string, unknown> };

    expect(result.status).toBe(500);
    expect(result._data.error).toBe("添加题目失败");
  });
});
