"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Sparkles } from "lucide-react";

/**
 * 做题页面专属布局
 * 与默认布局的区别：固定高度，禁止外层滚动，让滚动发生在题目内容区域
 */
export default function ProblemDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("theme");
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* 导航栏 */}
      <Navbar />

      {/* 主内容区 - 固定高度，不滚动 */}
      <main className="flex-1 container-responsive py-4 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
