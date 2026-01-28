import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GESP AI - AI驱动的编程等级考试备考助手",
  description: "GESP AI 是一款AI原生的GESP编程等级考试备考产品，通过智能学习规划、AI辅导对话和在线判题帮助学生高效备考。",
  keywords: ["GESP", "编程考试", "AI学习", "C++", "少儿编程"],
  authors: [{ name: "GESP AI Team" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
