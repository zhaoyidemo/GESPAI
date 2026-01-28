import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GESP 官方真题数据 - 来源：CCF-GESP 官方 + 洛谷
// 支持 GET 和 POST 请求
async function seedData() {
  try {
    // 检查是否已有题目
    const existingProblems = await prisma.problem.count();
    if (existingProblems > 0) {
      return NextResponse.json({ message: "数据已存在", count: existingProblems });
    }

    // 创建 GESP 真题
    const problems = await prisma.problem.createMany({
      data: [
        // ============ GESP 5级真题 ============
        {
          title: "[GESP202406 五级] 小杨的幸运数字",
          source: "gesp_official",
          sourceId: "P10720",
          sourceUrl: "https://www.luogu.com.cn/problem/P10720",
          level: 5,
          knowledgePoints: ["质因数分解", "数论", "筛法"],
          difficulty: "medium",
          description: `小杨认为他的幸运数字应该恰好有两种不同的质因子。

例如，12 = 2×2×3 的质因子有 2, 3，恰好为两种不同的质因子，因此 12 是幸运数字。
而 30 = 2×3×5 的质因子有 2, 3, 5，有三种不同的质因子，不符合要求，不是幸运数字。

小杨现在有 n 个正整数，他想知道每个正整数是否是他的幸运数字。`,
          inputFormat: `第一行包含一个正整数 n，表示正整数的个数。

接下来 n 行，每行包含一个正整数 aᵢ。

数据范围：
- 1 ≤ n ≤ 10⁴
- 2 ≤ aᵢ ≤ 10⁶`,
          outputFormat: `输出 n 行，对于每个正整数，如果是幸运数字，输出 1，否则输出 0。`,
          samples: [
            { input: "3\n7\n12\n30", output: "0\n1\n0", explanation: "7 的质因子只有 7，共 1 种；12 的质因子有 2,3，恰好 2 种；30 的质因子有 2,3,5，共 3 种" },
          ],
          testCases: [
            { input: "3\n7\n12\n30", output: "0\n1\n0" },
            { input: "5\n6\n8\n10\n15\n21", output: "1\n0\n1\n1\n1" },
            { input: "4\n4\n9\n25\n49", output: "0\n0\n0\n0" },
            { input: "3\n2\n3\n5", output: "0\n0\n0" },
            { input: "2\n1000000\n999999", output: "0\n1" },
          ],
          timeLimit: 1000,
          memoryLimit: 256,
          hint: "使用质因数分解，统计每个数的不同质因子个数。可以预处理质数表来优化。",
        },
        {
          title: "[GESP202409 五级] 挑战怪物",
          source: "gesp_official",
          sourceId: "B4050",
          sourceUrl: "https://www.luogu.com.cn/problem/B4050",
          level: 5,
          knowledgePoints: ["贪心", "质数判断", "位运算"],
          difficulty: "medium",
          description: `小杨正在和一个怪物战斗，怪物的血量为 h。只有当怪物的血量恰好为 0 时，小杨才能成功击败怪物。

小杨有两种攻击怪物的方式：

1. 物理攻击：假设当前为小杨第 i 次使用物理攻击，则会对怪物造成 2^(i-1) 点伤害。
   即第 1 次物理攻击造成 1 点伤害，第 2 次造成 2 点伤害，第 3 次造成 4 点伤害，以此类推。

2. 魔法攻击：小杨选择任意一个质数 x（x 不能超过怪物当前血量），对怪物造成 x 点伤害。
   由于小杨并不擅长魔法，他最多只能使用一次魔法攻击。

小杨想知道自己能否击败怪物，如果能，他想知道自己最少需要多少次攻击。`,
          inputFormat: `第一行包含一个正整数 t，代表测试用例组数。

接下来 t 行，每行包含一个正整数 h，代表怪物血量。

数据范围：
- 1 ≤ t ≤ 100
- 1 ≤ h ≤ 10⁵`,
          outputFormat: `对于每组测试用例，如果小杨能够击败怪物，输出一个整数，代表小杨需要的最少攻击次数；如果不能击败怪物，输出 -1。`,
          samples: [
            { input: "3\n6\n188\n9999", output: "2\n4\n-1", explanation: "h=6: 魔法攻击质数5，物理攻击1次(1点伤害)，共2次；h=188: 可以用物理攻击组合达成；h=9999: 无法恰好打到0" },
          ],
          testCases: [
            { input: "3\n6\n188\n9999", output: "2\n4\n-1" },
            { input: "5\n1\n2\n3\n4\n5", output: "1\n1\n1\n2\n2" },
            { input: "3\n7\n15\n31", output: "1\n2\n1" },
            { input: "2\n100\n1000", output: "4\n6" },
          ],
          timeLimit: 1000,
          memoryLimit: 256,
          hint: "物理攻击的伤害总和是 2^n - 1。考虑是否需要使用魔法攻击，以及用哪个质数。",
        },
        {
          title: "[GESP202312 五级] 小杨的幸运数",
          source: "gesp_official",
          sourceId: "B3929",
          sourceUrl: "https://www.luogu.com.cn/problem/B3929",
          level: 5,
          knowledgePoints: ["完全平方数", "数论", "倍数"],
          difficulty: "medium",
          description: `小杨认为，所有大于等于 a 的完全平方数都是他的"超级幸运数"。

而超级幸运数的所有正整数倍都是"幸运数"。

例如，当 a = 4 时：
- 超级幸运数有：4, 9, 16, 25, 36, ...
- 幸运数有：4, 8, 9, 12, 16, 18, 20, 24, 25, 27, ...（即 4 的倍数、9 的倍数、16 的倍数等）

对于一个正整数 x：
- 如果它已经是幸运数，直接输出 "lucky"
- 如果它不是幸运数，需要找到最小的幸运数 y（y > x），输出 y

这个过程称为"幸运化"。`,
          inputFormat: `第一行包含两个正整数 a 和 N。

接下来 N 行，每行一个正整数 x，表示需要判断或幸运化的数。

数据范围：
- 1 ≤ a ≤ 1,000,000
- 1 ≤ N ≤ 2×10⁵
- 1 ≤ x ≤ 1,000,001`,
          outputFormat: `对于每个 x，如果是幸运数则输出 "lucky"，否则输出幸运化后的最小幸运数。`,
          samples: [
            { input: "2 4\n1\n4\n5\n9", output: "4\nlucky\n8\nlucky", explanation: "a=2时，超级幸运数是4,9,16,...；1不是幸运数，最小的幸运数是4；4是4的倍数，是幸运数；5不是幸运数，下一个是8；9是9的1倍，是幸运数" },
          ],
          testCases: [
            { input: "2 4\n1\n4\n5\n9", output: "4\nlucky\n8\nlucky" },
            { input: "16 5\n1\n16\n32\n15\n17", output: "16\nlucky\nlucky\n16\n32" },
            { input: "1 3\n1\n2\n3", output: "lucky\nlucky\nlucky" },
          ],
          timeLimit: 1000,
          memoryLimit: 256,
          hint: "预处理所有超级幸运数（完全平方数），然后判断 x 是否是某个超级幸运数的倍数。",
        },
        {
          title: "[GESP202403 五级] 成绩排序",
          source: "gesp_official",
          sourceId: "B3968",
          sourceUrl: "https://www.luogu.com.cn/problem/B3968",
          level: 5,
          knowledgePoints: ["排序", "结构体", "多关键字排序"],
          difficulty: "medium",
          description: `有 n 名同学，每名同学有语文、数学、英语三科成绩。

需要按照如下规则对所有同学的成绩从高到低排序，输出每名同学的排名：

1. 首先按照三科总分从高到低排序
2. 总分相同时，按照语文和数学的分数之和从高到低排序
3. 如果仍然相同，按照语文和数学中的较高分从高到低排序
4. 如果还是相同，则排名相同

排名规则：如果有 x 人并列第 k 名，则他们的排名都是 k，下一名同学的排名是 k+x。

最后按照输入顺序输出每名同学的排名。`,
          inputFormat: `第一行包含一个正整数 n，表示同学人数。

接下来 n 行，每行包含三个非负整数，分别表示语文、数学、英语成绩。

数据范围：
- 1 ≤ n ≤ 1000
- 0 ≤ 每科成绩 ≤ 150`,
          outputFormat: `输出 n 行，按输入顺序输出每名同学的排名。`,
          samples: [
            { input: "5\n100 90 80\n90 100 80\n80 80 100\n100 100 60\n85 85 90", output: "2\n2\n4\n1\n5", explanation: "总分依次为270,270,260,260,260。第4名同学总分260但语数和200最高排第1；第1、2名同学总分270并列第2；其他同学按规则排序" },
          ],
          testCases: [
            { input: "5\n100 90 80\n90 100 80\n80 80 100\n100 100 60\n85 85 90", output: "2\n2\n4\n1\n5" },
            { input: "3\n100 100 100\n100 100 100\n100 100 100", output: "1\n1\n1" },
            { input: "4\n150 150 150\n100 100 100\n50 50 50\n0 0 0", output: "1\n2\n3\n4" },
          ],
          timeLimit: 1000,
          memoryLimit: 256,
          hint: "使用结构体存储学生信息，自定义比较函数进行多关键字排序。注意最后要按原始输入顺序输出。",
        },
        {
          title: "[GESP202403 五级] B-smooth 数",
          source: "gesp_official",
          sourceId: "B3969",
          sourceUrl: "https://www.luogu.com.cn/problem/B3969",
          level: 5,
          knowledgePoints: ["筛法", "质因数", "埃氏筛"],
          difficulty: "medium",
          description: `一个正整数是 B-smooth 数，当且仅当其最大质因子不超过 B。

特别地，1 没有质因子，我们认为 1 是 B-smooth 数。

例如，当 B = 3 时：
- 1 是 B-smooth 数（没有质因子）
- 2 是 B-smooth 数（最大质因子是 2 ≤ 3）
- 3 是 B-smooth 数（最大质因子是 3 ≤ 3）
- 4 = 2² 是 B-smooth 数（最大质因子是 2 ≤ 3）
- 5 不是 B-smooth 数（最大质因子是 5 > 3）
- 6 = 2×3 是 B-smooth 数（最大质因子是 3 ≤ 3）
- 7 不是 B-smooth 数（最大质因子是 7 > 3）
- 8 = 2³ 是 B-smooth 数（最大质因子是 2 ≤ 3）
- 9 = 3² 是 B-smooth 数（最大质因子是 3 ≤ 3）
- 10 = 2×5 不是 B-smooth 数（最大质因子是 5 > 3）

请你统计不超过 n 的所有 B-smooth 数的数量。`,
          inputFormat: `第一行包含两个正整数 n 和 B。

数据范围：
- 1 ≤ n ≤ 10⁷
- 2 ≤ B ≤ n`,
          outputFormat: `输出一个非负整数，表示不超过 n 的 B-smooth 数的数量。`,
          samples: [
            { input: "10 3", output: "7", explanation: "不超过 10 的 3-smooth 数有：1, 2, 3, 4, 6, 8, 9，共 7 个" },
          ],
          testCases: [
            { input: "10 3", output: "7" },
            { input: "100 5", output: "35" },
            { input: "20 2", output: "5" },
            { input: "1000 7", output: "149" },
            { input: "1 2", output: "1" },
          ],
          timeLimit: 1000,
          memoryLimit: 256,
          hint: "使用埃氏筛的思想，预处理每个数的最大质因子，然后统计满足条件的数。",
        },
        {
          title: "[GESP202309 五级] 巧夺大奖",
          source: "gesp_official",
          sourceId: "B3872",
          sourceUrl: "https://www.luogu.com.cn/problem/B3872",
          level: 5,
          knowledgePoints: ["贪心", "排序", "任务调度"],
          difficulty: "medium",
          description: `小明参加了一个巧夺大奖的游戏节目。主持人宣布了游戏规则：

1. 游戏分为 n 个时间段，参加者每个时间段可以选择完成一个小游戏。
2. 游戏中共有 n 个小游戏可供选择。
3. 每个小游戏有规定的时限和奖励。对于第 i 个小游戏：
   - 必须在第 Tᵢ 个时间段结束前完成才能得到奖励
   - 完成后可获得 Rᵢ 的奖励

小明发现，这些小游戏都很简单，不管选择哪个小游戏，他都能在一个时间段内完成。

问题是：如何安排每个时间段分别选择哪个小游戏，才能使得总奖励最高？`,
          inputFormat: `第一行包含一个正整数 n。n 既是游戏时间段的个数，也是小游戏的个数。

第二行包含 n 个正整数 Tᵢ，表示第 i 个小游戏的完成期限。

第三行包含 n 个正整数 Rᵢ，表示第 i 个小游戏的完成奖励。

数据范围：
- 1 ≤ n ≤ 500
- 1 ≤ Tᵢ ≤ n
- 1 ≤ Rᵢ ≤ 10⁶`,
          outputFormat: `输出一个正整数，表示能获得的最高奖励。`,
          samples: [
            { input: "7\n4 2 4 3 1 4 6\n70 60 50 40 30 20 10", output: "230", explanation: "可以在7个时间段分别安排完成第4,2,3,1,6,7,5个小游戏，其中第4,2,3,1,7个在期限内完成，获得40+60+50+70+10=230" },
          ],
          testCases: [
            { input: "7\n4 2 4 3 1 4 6\n70 60 50 40 30 20 10", output: "230" },
            { input: "3\n1 1 1\n100 200 300", output: "300" },
            { input: "5\n5 5 5 5 5\n1 2 3 4 5", output: "15" },
            { input: "4\n1 2 3 4\n10 20 30 40", output: "100" },
          ],
          timeLimit: 1000,
          memoryLimit: 256,
          hint: "贪心策略：优先选择奖励高的小游戏，同时满足时限要求。可以按奖励降序排序，然后依次尝试安排。",
        },
        // ============ 基础入门题 ============
        {
          title: "A+B 问题",
          source: "gesp_official",
          level: 1,
          knowledgePoints: ["输入输出", "基本运算"],
          difficulty: "easy",
          description: "输入两个整数 a 和 b，输出它们的和。\n\n这是最基础的编程题，用于熟悉输入输出操作。",
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
          outputFormat: '如果 n 是偶数，输出 "even"；如果 n 是奇数，输出 "odd"。',
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
        // ============ 中级练习题 ============
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

    // 创建 GESP 5级相关知识点
    await prisma.knowledgePoint.createMany({
      data: [
        // 5级核心知识点
        { name: "质因数分解", level: 5, category: "初等数论", description: "将正整数分解为质数乘积的方法" },
        { name: "最大公约数与最小公倍数", level: 5, category: "初等数论", description: "辗转相除法（欧几里得算法）" },
        { name: "埃氏筛法", level: 5, category: "初等数论", description: "高效筛选质数的算法" },
        { name: "线性筛法", level: 5, category: "初等数论", description: "O(n)时间复杂度的质数筛选" },
        { name: "同余与模运算", level: 5, category: "初等数论", description: "取模运算的性质和应用" },
        { name: "高精度运算", level: 5, category: "数值计算", description: "大整数的加减乘除运算" },
        { name: "链表操作", level: 5, category: "数据结构", description: "链表的创建、插入、删除、遍历" },
        { name: "递归", level: 5, category: "算法基础", description: "函数调用自身的编程技巧" },
        { name: "记忆化搜索", level: 5, category: "优化技术", description: "缓存结果避免重复计算" },
        { name: "贪心算法", level: 5, category: "算法思想", description: "每步选择局部最优解" },
        // 4级知识点
        { name: "二分查找", level: 4, category: "搜索算法", description: "在有序数组中高效查找" },
        { name: "排序算法", level: 4, category: "算法基础", description: "冒泡、选择、插入、快速排序等" },
        { name: "字符串处理", level: 4, category: "字符串", description: "字符串的基本操作和处理" },
        // 3级知识点
        { name: "数组", level: 3, category: "数据结构", description: "一维和二维数组的使用" },
        { name: "循环结构", level: 3, category: "程序结构", description: "for、while循环的使用" },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "GESP 官方真题数据创建成功",
      problemsCreated: problems.count,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "创建数据失败" }, { status: 500 });
  }
}

// 支持 GET 请求 - 直接在浏览器访问 /api/seed 即可初始化数据
export async function GET() {
  return seedData();
}

// 支持 POST 请求
export async function POST() {
  return seedData();
}
