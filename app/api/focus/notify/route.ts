import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";

// 内存级防刷：每个用户 5 分钟内最多通知一次
const lastNotifyMap = new Map<string, number>();
const COOLDOWN_MS = 5 * 60 * 1000;

function formatMin(seconds: number) {
  if (seconds < 60) return `${seconds}秒`;
  return `${Math.floor(seconds / 60)}分${seconds % 60}秒`;
}

export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  const webhookUrl = process.env.FEISHU_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: "未配置飞书 Webhook" }, { status: 500 });
  }

  // 服务端冷却检查
  const userId = session.user.id;
  const now = Date.now();
  const lastTime = lastNotifyMap.get(userId) || 0;
  if (now - lastTime < COOLDOWN_MS) {
    return NextResponse.json({ skipped: true, reason: "cooldown" });
  }

  try {
    const { awaySec, focusSeconds, totalSeconds, blurCount } = await request.json();
    const distractSeconds = Math.max(0, totalSeconds - focusSeconds);
    const username = session.user.username || "孩子";

    const card = {
      msg_type: "interactive",
      card: {
        header: {
          title: { tag: "plain_text", content: "专注度提醒" },
          template: "red",
        },
        elements: [
          {
            tag: "div",
            text: {
              tag: "lark_md",
              content: `**${username}** 已离开 GESP AI 超过 **${formatMin(awaySec)}**`,
            },
          },
          { tag: "hr" },
          {
            tag: "div",
            text: {
              tag: "lark_md",
              content: [
                `**今日数据**`,
                `专注时长：${formatMin(focusSeconds)}`,
                `分心时长：${formatMin(distractSeconds)}`,
                `切出次数：${blurCount} 次`,
              ].join("\n"),
            },
          },
          {
            tag: "note",
            elements: [
              {
                tag: "plain_text",
                content: `来自 GESP AI · ${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}`,
              },
            ],
          },
        ],
      },
    };

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(card),
    });

    if (res.ok) {
      lastNotifyMap.set(userId, now);
      return NextResponse.json({ sent: true });
    }

    const err = await res.text();
    console.error("Feishu webhook error:", err);
    return NextResponse.json({ error: "飞书发送失败" }, { status: 502 });
  } catch (error) {
    console.error("Notify error:", error);
    return NextResponse.json({ error: "通知发送失败" }, { status: 500 });
  }
}
