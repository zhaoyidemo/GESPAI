"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { FluidBackground } from "@/components/ui/animated-background";

export default function MainLayout({
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

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          {/* 加载动画 */}
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold gradient-text">G</span>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      {/* 流体动态背景 */}
      <FluidBackground />

      {/* 导航栏 */}
      <Navbar />

      {/* 主内容区 */}
      <main className="container-responsive py-6 relative z-10">
        {children}
      </main>
    </div>
  );
}
