import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import mockPrisma from "../mocks/db";
import "../mocks/auth";

// Mock judge function
vi.mock("@/lib/judge", () => ({
  judgeSubmission: vi.fn(),
}));

import { POST } from "@/app/api/judge/route";
import { judgeSubmission } from "@/lib/judge";
import { requireAuth } from "@/lib/require-auth";

const mockJudge = vi.mocked(judgeSubmission);
const mockRequireAuth = vi.mocked(requireAuth);

function createRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("http://localhost/api/judge", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/judge", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequireAuth.mockResolvedValue({
      user: { id: "test-user-id", username: "testuser", email: "test@example.com", role: "user" },
      expires: "2099-01-01",
    } as never);
  });

  it("应拒绝未登录用户", async () => {
    mockRequireAuth.mockResolvedValue(
      NextResponse.json({ error: "请先登录" }, { status: 401 }) as never
    );

    const request = createRequest({ problemId: "p1", code: "int main(){}" });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("请先登录");
  });

  it("应拒绝缺少参数的请求", async () => {
    const request = createRequest({ problemId: "", code: "" });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("请提供题目ID和代码");
  });

  it("应返回 404 当题目不存在", async () => {
    mockPrisma.problem.findUnique.mockResolvedValue(null);

    const request = createRequest({ problemId: "nonexistent", code: "int main(){}" });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("题目不存在");
  });

  it("run 模式应不创建提交记录", async () => {
    const mockProblem = {
      id: "p1",
      title: "Test",
      level: 1,
      difficulty: "入门",
      knowledgePoints: [],
      samples: [{ input: "1", output: "1" }],
      testCases: [{ input: "1", output: "1" }],
      timeLimit: 1000,
      memoryLimit: 256,
    };

    mockPrisma.problem.findUnique.mockResolvedValue(mockProblem);
    mockJudge.mockResolvedValue({
      status: "accepted",
      score: 100,
      testResults: [{ passed: true, input: "1", expectedOutput: "1", actualOutput: "1", time: 10, memory: 1024, status: "accepted" }],
    });

    const request = createRequest({ problemId: "p1", code: "int main(){}", mode: "run" });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("accepted");
    expect(mockPrisma.submission.create).not.toHaveBeenCalled();
  });

  it("submit 模式应创建提交记录并在 AC 时奖励 XP", async () => {
    const mockProblem = {
      id: "p1",
      title: "Test",
      level: 1,
      difficulty: "入门",
      knowledgePoints: ["基础"],
      samples: [{ input: "1", output: "1" }],
      testCases: [{ input: "1", output: "1" }],
      timeLimit: 1000,
      memoryLimit: 256,
    };

    mockPrisma.problem.findUnique.mockResolvedValue(mockProblem);
    mockPrisma.submission.create.mockResolvedValue({ id: "sub1" });
    mockPrisma.submission.update.mockResolvedValue({});
    mockPrisma.user.update.mockResolvedValue({});
    mockPrisma.knowledgePoint.findMany.mockResolvedValue([
      { id: "kp1", name: "基础" },
    ]);
    mockPrisma.$transaction.mockResolvedValue([]);
    mockJudge.mockResolvedValue({
      status: "accepted",
      score: 100,
      testResults: [{ passed: true, input: "1", expectedOutput: "1", actualOutput: "1", time: 10, memory: 1024, status: "accepted" }],
    });

    const request = createRequest({ problemId: "p1", code: "int main(){}", mode: "submit" });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("accepted");
    expect(data.xpEarned).toBe(10);
    expect(mockPrisma.submission.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ totalXp: { increment: 10 } }),
      })
    );
  });
});
