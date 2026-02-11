import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import {
  fetchRecentActivity,
  generateSuggestions,
} from "@/lib/vibe-suggestions";

export async function POST() {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const userId = authResult.user.id;
    const data = await fetchRecentActivity(userId);
    const suggestions = generateSuggestions(data);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Vibe suggestions error:", error);
    return NextResponse.json(
      { error: "获取建议失败", suggestions: [] },
      { status: 500 }
    );
  }
}
