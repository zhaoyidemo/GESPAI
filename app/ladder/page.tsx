import type { Metadata } from "next";
import LadderPage from "@/components/ladder-page";

export const metadata: Metadata = {
  title: "信息学奥赛天梯 | GESP AI",
  description:
    "从GESP到IOI，一图看懂NOI系列信息学竞赛完整路径。2025年官方数据，游戏化RPG天梯呈现。",
  keywords: [
    "信息学奥赛",
    "NOI",
    "NOIP",
    "CSP",
    "GESP",
    "IOI",
    "信息学竞赛路径",
    "编程竞赛",
  ],
};

export default function LadderRoute() {
  return <LadderPage />;
}
