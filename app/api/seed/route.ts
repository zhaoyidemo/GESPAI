import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// 初始化示例数据 - 仅用于开发测试
export async function POST() {
  try {
    // 检查是否已有题目
    const existingProblems = await prisma.problem.count();
    if (existingProblems > 0) {
      return NextResponse.json({ message: "数据已存在", count: existingProblems });
    }

    // 创建示例题目
    const problems = await prisma.problem.createMany({
      data: [
        {
          title: "A+B 问题",
          source: "gesp_official",
          level: 1,
          knowledgePoints: ["输入输出", "基本运算"],
          difficulty: "easy",
          description: "输入两个整数 a 和 b，输出它们的和。",
          inputFormat: "输入一行，包含两个整数 a 和 b，用空格分隔。\n\n数据范围：-1000 ≤ a, b ≤ 1000",
          outputFormat: "输出一行，包含一个整数，表示 a + b 的值。",
          samples: [
            { input: "1 2", output: "3" },
            { input: "-5 10", output: "5" },
          ],
          testCases: [
            { input: "1 2", output: "3" },
            { input: "-5 10", output: "5" },
            { input: "0 0", output: "0" },
            { input: "1000 -1000", output: "0" },
            { input: "999 1", output: "1000" },
          ],
          timeLimit: 1000,
          memoryLimit: 256,
          hint: "使用 cin 读取输入，使用 cout 输出结果。",
        },
        {
          title: "判断奇偶",
          source: "gesp_official",
          level: 1,
          knowledgePoints: ["条件判断", "取模运算"],
          difficulty: "easy",
          description: "输入一个整数 n，判断它是奇数还是偶数。",
          inputFormat: "输入一行，包含一个整数 n。\n\n数据范围：-10000 ≤ n ≤ 10000",
          outputFormat: "如果 n 是偶数，输出 \"even\"；如果 n 是奇数，输出 \"odd\"。",
          samples: [
            { input: "4", output: "even" },
            { input: "7", output: "odd" },
          ],
          testCases: [
            { input: "4", output: "even" },
            { input: "7", output: "odd" },
            { input: "0", output: "even" },
            { input: "-3", output: "odd" },
            { input: "-8", output: "even" },
          ],
          timeLimit: 1000,
          memoryLimit: 256,
          hint: "使用取模运算符 % 判断一个数除以 2 的余数。",
        },
        {
          title: "斐波那契数列",
          source: "gesp_official",
          level: 5,
          knowledgePoints: ["递归", "记忆化搜索"],
          difficulty: "medium",
          description: "斐波那契数列的定义如下：\n\nF(0) = 0\nF(1) = 1\nF(n) = F(n-1) + F(n-2)（n ≥ 2）\n\n给定一个非负整数 n，请计算 F(n)。",
          inputFormat: "输入一行，包含一个非负整数 n。\n\n数据范围：0 ≤ n ≤ 40",
          outputFormat: "输出一行，包含一个整数，表示 F(n) 的值。",
          samples: [
            { input: "0", output: "0" },
            { input: "1", output: "1" },
            { input: "10", output: "55" },
          ],
          testCases: [
            { input: "0", output: "0" },
            { input: "1", output: "1" },
            { input: "5", output: "5" },
            { input: "10", output: "55" },
            { input: "20", output: "6765" },
            { input: "30", output: "832040" },
            { input: "40", output: "102334155" },
          ],
          timeLimit: 1000,
          memoryLimit: 256,
          hint: "可以使用递归实现，但注意直接递归会超时。考虑使用记忆化搜索或动态规划优化。",
        },
        {
          title: "数组求和",
          source: "gesp_official",
          level: 3,
          knowledgePoints: ["数组", "循环"],
          difficulty: "easy",
          description: "给定 n 个整数，计算它们的和。",
          inputFormat: "第一行输入一个整数 n，表示整数的个数。\n第二行输入 n 个整数，用空格分隔。\n\n数据范围：1 ≤ n ≤ 1000，每个整数的绝对值不超过 10000。",
          outputFormat: "输出一行，包含一个整数，表示所有整数的和。",
          samples: [
            { input: "5\n1 2 3 4 5", output: "15" },
            { input: "3\n-1 0 1", output: "0" },
          ],
          testCases: [
            { input: "5\n1 2 3 4 5", output: "15" },
            { input: "3\n-1 0 1", output: "0" },
            { input: "1\n100", output: "100" },
            { input: "4\n10000 10000 -10000 -10000", output: "0" },
            { input: "6\n1 1 1 1 1 1", output: "6" },
          ],
          timeLimit: 1000,
          memoryLimit: 256,
          hint: "使用循环遍历数组，累加每个元素。",
        },
        {
          title: "二分查找",
          source: "gesp_official",
          level: 4,
          knowledgePoints: ["二分查找", "数组"],
          difficulty: "medium",
          description: "给定一个升序排列的整数数组和一个目标值，使用二分查找确定目标值在数组中的位置。如果目标值不存在，返回 -1。",
          inputFormat: "第一行输入两个整数 n 和 target，分别表示数组长度和目标值。\n第二行输入 n 个升序排列的整数，用空格分隔。\n\n数据范围：1 ≤ n ≤ 100000，数组元素和目标值的绝对值不超过 10^9。",
          outputFormat: "输出目标值在数组中的下标（从 0 开始），如果不存在则输出 -1。",
          samples: [
            { input: "5 3\n1 2 3 4 5", output: "2" },
            { input: "5 6\n1 2 3 4 5", output: "-1" },
          ],
          testCases: [
            { input: "5 3\n1 2 3 4 5", output: "2" },
            { input: "5 6\n1 2 3 4 5", output: "-1" },
            { input: "5 1\n1 2 3 4 5", output: "0" },
            { input: "5 5\n1 2 3 4 5", output: "4" },
            { input: "1 1\n1", output: "0" },
            { input: "3 0\n1 2 3", output: "-1" },
          ],
          timeLimit: 1000,
          memoryLimit: 256,
          hint: "使用二分查找，每次将搜索范围缩小一半。",
        },
      ],
    });

    // 创建知识点
    await prisma.knowledgePoint.createMany({
      data: [
        { name: "递归", level: 5, category: "算法基础", description: "函数调用自身的编程技巧" },
        { name: "深度优先搜索", level: 5, category: "搜索算法", description: "沿着分支深度遍历的算法" },
        { name: "广度优先搜索", level: 5, category: "搜索算法", description: "逐层向外扩展的算法" },
        { name: "记忆化搜索", level: 5, category: "优化技术", description: "缓存结果避免重复计算" },
        { name: "二分查找", level: 4, category: "搜索算法", description: "在有序数组中高效查找" },
        { name: "排序算法", level: 4, category: "算法基础", description: "将数据按顺序排列的方法" },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "示例数据创建成功",
      problemsCreated: problems.count,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "创建示例数据失败" }, { status: 500 });
  }
}
