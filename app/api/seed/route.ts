import { NextResponse } from "next/server";

/**
 * 一次性导入所有 GESP 1-8 级题库
 * 会依次调用各个级别的种子数据 API
 */
async function seedAllData() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const results = [];

    // 导入顺序：GESP 1-8 级
    const levels = [1, 2, 3, 4, 5, 6, 7, 8];

    for (const level of levels) {
      try {
        console.log(`📥 开始导入 GESP ${level} 级题目...`);

        // 调用对应级别的 API
        const response = await fetch(`${baseUrl}/api/seed/gesp${level}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        results.push({
          level,
          success: data.success || response.ok,
          message: data.message,
          addedCount: data.addedCount || 0,
          totalCount: data.totalCount || 0,
        });

        console.log(`✅ GESP ${level} 级导入完成: ${data.message}`);
      } catch (error) {
        console.error(`❌ GESP ${level} 级导入失败:`, error);
        results.push({
          level,
          success: false,
          message: `导入失败: ${error}`,
          addedCount: 0,
          totalCount: 0,
        });
      }
    }

    // 统计总数
    const totalAdded = results.reduce((sum, r) => sum + (r.addedCount || 0), 0);
    const totalCount = results.reduce((sum, r) => sum + (r.totalCount || 0), 0);
    const successCount = results.filter(r => r.success).length;

    return NextResponse.json({
      success: successCount === levels.length,
      message: `完成导入：成功 ${successCount}/${levels.length} 个级别`,
      totalAdded,
      totalCount,
      details: results,
    });
  } catch (error) {
    console.error("❌ 批量导入失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: "批量导入失败",
        details: String(error)
      },
      { status: 500 }
    );
  }
}

// 支持 GET 请求 - 直接在浏览器访问 /api/seed 即可初始化数据
export async function GET() {
  return seedAllData();
}

// 支持 POST 请求
export async function POST() {
  return seedAllData();
}
