import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import mockPrisma from "../mocks/db";
import "../mocks/auth";

import { GET } from "@/app/api/problems/route";
import { requireAuth } from "@/lib/require-auth";

const mockRequireAuth = vi.mocked(requireAuth);

function createGetRequest(params: Record<string, string> = {}): NextRequest {
  const url = new URL("http://localhost/api/problems");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return new NextRequest(url.toString(), { method: "GET" });
}

describe("GET /api/problems", () => {
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

    const request = createGetRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("请先登录");
  });

  it("应返回题目列表", async () => {
    const mockProblems = [
      { id: "p1", title: "题目1", level: 1, difficulty: "入门", knowledgePoints: [], _count: { submissions: 0 } },
      { id: "p2", title: "题目2", level: 2, difficulty: "普及-", knowledgePoints: [], _count: { submissions: 0 } },
    ];

    mockPrisma.problem.findMany.mockResolvedValue(mockProblems);
    mockPrisma.problem.count.mockResolvedValue(2);
    mockPrisma.submission.groupBy.mockResolvedValue([]);

    const request = createGetRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.problems).toBeDefined();
  });

  it("应支持按级别过滤", async () => {
    mockPrisma.problem.findMany.mockResolvedValue([]);
    mockPrisma.problem.count.mockResolvedValue(0);
    mockPrisma.submission.groupBy.mockResolvedValue([]);
    mockPrisma.submission.findMany.mockResolvedValue([]);

    const request = createGetRequest({ level: "3" });
    await GET(request);

    expect(mockPrisma.problem.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ level: 3 }),
      })
    );
  });
});
