import { vi } from "vitest";

const mockSession = {
  user: {
    id: "test-user-id",
    username: "testuser",
    email: "test@example.com",
    role: "user" as const,
  },
  expires: "2099-01-01T00:00:00.000Z",
};

const mockAdminSession = {
  user: {
    id: "admin-user-id",
    username: "admin",
    email: "admin@example.com",
    role: "admin" as const,
  },
  expires: "2099-01-01T00:00:00.000Z",
};

// Mock next-auth
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(() => Promise.resolve(mockSession)),
}));

// Mock auth options
vi.mock("@/lib/auth", () => ({
  authOptions: {},
}));

// Mock require-auth
vi.mock("@/lib/require-auth", () => ({
  requireAuth: vi.fn(() => Promise.resolve(mockSession)),
}));

// Mock require-admin
vi.mock("@/lib/require-admin", () => ({
  requireAdmin: vi.fn(() => Promise.resolve(mockAdminSession)),
}));

export { mockSession, mockAdminSession };
