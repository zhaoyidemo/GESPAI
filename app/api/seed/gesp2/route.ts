import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GESP 2级完整题库 - 来源：洛谷 CCF GESP C++ 二级上机题
// 共26道题目
// 难度标签采用洛谷评级：
// - "easy" = 入门(1) / 普及-(2)
// - "medium" = 普及/提高-(3) / 普及+/提高(4)
// - "hard" = 提高+/省选-(5) 及以上

const gesp2Problems = [
  // ========== 样题 ==========
  {
    title: "[GESP样题 二级] 画正方形",
    source: "gesp_official",
    sourceId: "B3844",
    sourceUrl: "https://www.luogu.com.cn/problem/B3844",
    level: 2,
    knowledgePoints: ["循环嵌套", "字符输出", "ASCII码"],
    difficulty: "普及-",
    description: `用大写字母构成一个 n×n 的正方形矩阵。第 1 行从 A 开始，第 2 行从 B 开始，以此类推。每行内，每列依次是下一个字母。字母循环使用（Z 的下一个字母是 A）。

例如 n=3 时：
\`\`\`
ABC
BCD
CDE
\`\`\``,
    inputFormat: `一行，包含一个正整数 n，其中 2 ≤ n ≤ 40。`,
    outputFormat: `输出符合要求的正方形矩阵。`,
    samples: [
      { input: "3", output: "ABC\nBCD\nCDE", explanation: "第1行从A开始：A,B,C；第2行从B开始：B,C,D；第3行从C开始：C,D,E" },
      { input: "5", output: "ABCDE\nBCDEF\nCDEFG\nDEFGH\nEFGHI" },
    ],
    testCases: [
      { input: "3", output: "ABC\nBCD\nCDE" },
      { input: "5", output: "ABCDE\nBCDEF\nCDEFG\nDEFGH\nEFGHI" },
      { input: "2", output: "AB\nBC" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: "对于第 i 行第 j 列（从0开始），字符为 'A' + (i + j) % 26。",
  },
  {
    title: "[GESP样题 二级] 勾股数",
    source: "gesp_official",
    sourceId: "B3845",
    sourceUrl: "https://www.luogu.com.cn/problem/B3845",
    level: 2,
    knowledgePoints: ["循环嵌套", "枚举", "数学"],
    difficulty: "普及-",
    description: `勾股数是指满足 a² + b² = c² 的三个正整数 (a, b, c)，其中 1 ≤ a ≤ b ≤ c。

给定正整数 n，统计满足 c ≤ n 的勾股数组的个数。`,
    inputFormat: `一行，包含一个正整数 n，其中 1 ≤ n ≤ 1000。`,
    outputFormat: `一个整数，表示满足条件的勾股数组个数。`,
    samples: [
      { input: "5", output: "1", explanation: "只有 (3,4,5) 满足 c ≤ 5" },
      { input: "13", output: "3", explanation: "满足条件的有：(3,4,5)、(6,8,10)、(5,12,13)" },
    ],
    testCases: [
      { input: "5", output: "1" },
      { input: "13", output: "3" },
      { input: "10", output: "2" },
      { input: "100", output: "52" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: "枚举 a 和 b（a ≤ b），计算 c = sqrt(a² + b²)，检查 c 是否为整数且 c ≤ n。",
  },

  // ========== 2023年3月 ==========
  {
    title: "[GESP202303 二级] 百鸡问题",
    source: "gesp_official",
    sourceId: "B3836",
    sourceUrl: "https://www.luogu.com.cn/problem/B3836",
    level: 2,
    knowledgePoints: ["循环嵌套", "枚举", "数学"],
    difficulty: "普及-",
    description: `经典的"百鸡问题"：
- 公鸡每只 x 元
- 母鸡每只 y 元
- 小鸡 z 只共 1 元

现有 n 元钱，要买恰好 m 只鸡，求有多少种购买方案。`,
    inputFormat: `一行，包含五个正整数 x, y, z, n, m，分别表示公鸡单价、母鸡单价、小鸡数量（z只1元）、总金额、总鸡数。

数据范围：1 ≤ x, y, z ≤ 10；1 ≤ n, m ≤ 1000`,
    outputFormat: `一个整数，表示购买方案数。`,
    samples: [
      { input: "5 3 3 100 100", output: "4", explanation: "四种方案：(0,25,75)、(4,18,78)、(8,11,81)、(12,4,84)" },
      { input: "1 1 1 100 100", output: "5151" },
    ],
    testCases: [
      { input: "5 3 3 100 100", output: "4" },
      { input: "1 1 1 100 100", output: "5151" },
      { input: "5 3 3 50 50", output: "2" },
    ],
    timeLimit: 1000,
    memoryLimit: 131,
    hint: "枚举公鸡和母鸡的数量，小鸡数量由总数减去公鸡和母鸡得到，检查金额和小鸡数量是否满足条件。",
  },
  {
    title: "[GESP202303 二级] 画三角形",
    source: "gesp_official",
    sourceId: "B3837",
    sourceUrl: "https://www.luogu.com.cn/problem/B3837",
    level: 2,
    knowledgePoints: ["循环嵌套", "字符输出", "三角形图案"],
    difficulty: "普及-",
    description: `用大写字母画一个三角形图案。第 1 行有 1 个字母，第 2 行有 2 个字母，以此类推。从上到下、从左到右依次填入 A-Z，Z 之后再从 A 开始循环。

例如 n=3 时：
\`\`\`
A
BC
DEF
\`\`\``,
    inputFormat: `一行，包含一个正整数 n，其中 2 ≤ n ≤ 40。`,
    outputFormat: `输出三角形图案，每行右侧不能有多余空格。`,
    samples: [
      { input: "3", output: "A\nBC\nDEF" },
      { input: "7", output: "A\nBC\nDEF\nGHIJ\nKLMNO\nPQRSTU\nVWXYZAB" },
    ],
    testCases: [
      { input: "3", output: "A\nBC\nDEF" },
      { input: "7", output: "A\nBC\nDEF\nGHIJ\nKLMNO\nPQRSTU\nVWXYZAB" },
      { input: "4", output: "A\nBC\nDEF\nGHIJ" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: "使用一个计数器记录当前应该输出的字母，每输出一个字母计数器加1并对26取模。",
  },

  // ========== 2023年6月 ==========
  {
    title: "[GESP202306 二级] 找素数",
    source: "gesp_official",
    sourceId: "B3840",
    sourceUrl: "https://www.luogu.com.cn/problem/B3840",
    level: 2,
    knowledgePoints: ["循环", "素数判断", "枚举"],
    difficulty: "普及-",
    description: `素数是指大于1的正整数，除了1和它本身以外不能被其他正整数整除。

给定区间 [A, B]，统计该区间内有多少个素数。`,
    inputFormat: `一行，包含两个正整数 A 和 B，其中 2 ≤ A ≤ B ≤ 1000。`,
    outputFormat: `一个整数，表示区间 [A, B] 内的素数个数。`,
    samples: [
      { input: "2 10", output: "4", explanation: "2到10之间的素数有：2, 3, 5, 7，共4个" },
      { input: "98 100", output: "0", explanation: "98, 99, 100 都不是素数" },
    ],
    testCases: [
      { input: "2 10", output: "4" },
      { input: "98 100", output: "0" },
      { input: "1 100", output: "25" },
      { input: "2 2", output: "1" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: "判断一个数 n 是否为素数：检查从 2 到 sqrt(n) 的所有数是否能整除 n。",
  },
  {
    title: "[GESP202306 二级] 自幂数判断",
    source: "gesp_official",
    sourceId: "B3841",
    sourceUrl: "https://www.luogu.com.cn/problem/B3841",
    level: 2,
    knowledgePoints: ["循环", "数位分离", "幂运算"],
    difficulty: "普及-",
    description: `自幂数是指一个 N 位数，其各位数字的 N 次方之和等于它本身。

例如：
- 153 是 3 位数，1³ + 5³ + 3³ = 1 + 125 + 27 = 153，是自幂数
- 1634 是 4 位数，1⁴ + 6⁴ + 3⁴ + 4⁴ = 1 + 1296 + 81 + 256 = 1634，是自幂数

给定若干正整数，判断每个是否为自幂数。`,
    inputFormat: `第一行包含一个正整数 M（1 ≤ M ≤ 100），表示待判断的数字个数。

接下来 M 行，每行一个正整数，这些正整数均小于 10⁸。`,
    outputFormat: `输出 M 行，如果对应的正整数是自幂数，输出 T；否则输出 F。`,
    samples: [
      { input: "3\n152\n111\n153", output: "F\nF\nT", explanation: "152和111不是自幂数，153是自幂数" },
      { input: "5\n8208\n548834\n88593477\n12345\n5432", output: "T\nT\nT\nF\nF" },
    ],
    testCases: [
      { input: "3\n152\n111\n153", output: "F\nF\nT" },
      { input: "5\n8208\n548834\n88593477\n12345\n5432", output: "T\nT\nT\nF\nF" },
      { input: "1\n1", output: "T" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "先计算数字的位数 N，然后分离各位数字，计算各位数字的 N 次方之和。",
  },

  // ========== 2023年9月 ==========
  {
    title: "[GESP202309 二级] 小杨的 X 字矩阵",
    source: "gesp_official",
    sourceId: "B3865",
    sourceUrl: "https://www.luogu.com.cn/problem/B3865",
    level: 2,
    knowledgePoints: ["循环嵌套", "矩阵输出", "对角线"],
    difficulty: "普及-",
    description: `构造一个 N×N 的 X 字形矩阵（N 为奇数）。矩阵的两条对角线位置用 + 表示，其他位置用 - 表示。

例如 N=5 时：
\`\`\`
+---+
-+-+-
--+--
-+-+-
+---+
\`\`\``,
    inputFormat: `一个整数 N，其中 5 ≤ N ≤ 49，保证 N 为奇数。`,
    outputFormat: `输出 N 行，每行 N 个字符（+ 或 -），不含多余空格或空行。`,
    samples: [
      { input: "5", output: "+---+\n-+-+-\n--+--\n-+-+-\n+---+" },
      { input: "7", output: "+-----+\n-+---+-\n--+-+--\n---+---\n--+-+--\n-+---+-\n+-----+" },
    ],
    testCases: [
      { input: "5", output: "+---+\n-+-+-\n--+--\n-+-+-\n+---+" },
      { input: "7", output: "+-----+\n-+---+-\n--+-+--\n---+---\n--+-+--\n-+---+-\n+-----+" },
      { input: "9", output: "+-------+\n-+-----+-\n--+---+--\n---+-+---\n----+----\n---+-+---\n--+---+--\n-+-----+-\n+-------+" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: "位置 (i, j) 在主对角线上当 i == j，在副对角线上当 i + j == N - 1。",
  },
  {
    title: "[GESP202309 二级] 数字黑洞",
    source: "gesp_official",
    sourceId: "B3866",
    sourceUrl: "https://www.luogu.com.cn/problem/B3866",
    level: 2,
    knowledgePoints: ["循环", "数位操作", "排序"],
    difficulty: "普及-",
    description: `给定一个三位数（三个数字各不相同），重复以下操作：将数字重新排列得到最大数和最小数，然后相减。

这个过程最终会收敛到 495（三位数的卡普雷卡常数）。

例如 352：
- 532 - 235 = 297
- 972 - 279 = 693
- 963 - 369 = 594
- 954 - 459 = 495

共需 4 次变换。

给定初始三位数 N，求需要多少次变换才能得到 495。`,
    inputFormat: `一行，包含一个三位数 N，保证三个数字各不相同。`,
    outputFormat: `一个整数，表示变换次数。`,
    samples: [
      { input: "352", output: "4", explanation: "352 → 297 → 693 → 594 → 495，共4次" },
    ],
    testCases: [
      { input: "352", output: "4" },
      { input: "495", output: "0" },
      { input: "123", output: "3" },
      { input: "321", output: "3" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: "分离三个数字，排序后组成最大数和最小数，相减得到新数，循环直到得到495。",
  },

  // ========== 2023年12月 ==========
  {
    title: "[GESP202312 二级] 小杨做题",
    source: "gesp_official",
    sourceId: "B3923",
    sourceUrl: "https://www.luogu.com.cn/problem/B3923",
    level: 2,
    knowledgePoints: ["循环", "斐波那契数列", "模拟"],
    difficulty: "普及-",
    description: `小杨每天都做题。第 1 天做 a 道，第 2 天做 b 道，从第 3 天起每天做的题数等于前两天之和（类似斐波那契数列）。

但是，一旦某天做的题数达到或超过 m，小杨就停止做题。

给定 a, b, m 和天数 N，求小杨在前 N 天内总共做了多少道题。`,
    inputFormat: `四行，分别包含整数 a, b, m, N。

数据范围：
- 0 ≤ a, b ≤ 10
- a, b < m < 1000000
- 3 ≤ N ≤ 364`,
    outputFormat: `一个整数，表示小杨做题的总数。`,
    samples: [
      { input: "1\n2\n10\n5", output: "19", explanation: "每天做题数：1, 2, 3, 5, 8（都<10），总计19" },
      { input: "1\n1\n5\n8", output: "12", explanation: "每天做题数：1, 1, 2, 3, 5（第5天达到5≥5停止），总计12" },
    ],
    testCases: [
      { input: "1\n2\n10\n5", output: "19" },
      { input: "1\n1\n5\n8", output: "12" },
      { input: "0\n0\n10\n100", output: "0" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "模拟斐波那契数列的生成过程，累加每天的题数，当某天题数 ≥ m 时停止。",
  },
  {
    title: "[GESP202312 二级] 小杨的 H 字矩阵",
    source: "gesp_official",
    sourceId: "B3924",
    sourceUrl: "https://www.luogu.com.cn/problem/B3924",
    level: 2,
    knowledgePoints: ["循环嵌套", "矩阵输出", "字符图案"],
    difficulty: "普及-",
    description: `构造一个 N×N 的 H 字形矩阵（N 为奇数）。
- 第一列和最后一列为 |
- 中间行（第 (N+1)/2 行）的第 2 到第 N-1 个字符为 -
- 其他位置为小写字母 a

例如 N=5 时：
\`\`\`
|aaa|
|aaa|
|---|
|aaa|
|aaa|
\`\`\``,
    inputFormat: `一个整数 N，其中 5 ≤ N ≤ 49，保证 N 为奇数。`,
    outputFormat: `输出 N 行，每行 N 个字符。`,
    samples: [
      { input: "5", output: "|aaa|\n|aaa|\n|---|\n|aaa|\n|aaa|" },
      { input: "7", output: "|aaaaa|\n|aaaaa|\n|aaaaa|\n|-----|\n|aaaaa|\n|aaaaa|\n|aaaaa|" },
    ],
    testCases: [
      { input: "5", output: "|aaa|\n|aaa|\n|---|\n|aaa|\n|aaa|" },
      { input: "7", output: "|aaaaa|\n|aaaaa|\n|aaaaa|\n|-----|\n|aaaaa|\n|aaaaa|\n|aaaaa|" },
      { input: "9", output: "|aaaaaaa|\n|aaaaaaa|\n|aaaaaaa|\n|aaaaaaa|\n|-------|\n|aaaaaaa|\n|aaaaaaa|\n|aaaaaaa|\n|aaaaaaa|" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "第一列和最后一列输出 |，中间行的中间部分输出 -，其他位置输出 a。",
  },

  // ========== 2024年3月 ==========
  {
    title: "[GESP202403 二级] 乘法问题",
    source: "gesp_official",
    sourceId: "B3954",
    sourceUrl: "https://www.luogu.com.cn/problem/B3954",
    level: 2,
    knowledgePoints: ["循环", "乘法", "大数判断"],
    difficulty: "普及-",
    description: `小 A 刚学会乘法。给定若干正整数，他需要把它们全部乘起来。如果乘积超过 10⁶，他就算不出来了。

编写程序帮助小 A：如果乘积超过 10⁶，输出 ">1000000"；否则输出乘积。`,
    inputFormat: `第一行包含整数 n，表示数字个数。

接下来 n 行，每行一个正整数 a。

数据范围：1 ≤ n ≤ 50，1 ≤ a ≤ 100`,
    outputFormat: `如果乘积超过 10⁶，输出 ">1000000"；否则输出乘积。`,
    samples: [
      { input: "2\n3\n5", output: "15" },
      { input: "3\n100\n100\n100", output: "1000000" },
      { input: "4\n100\n100\n100\n2", output: ">1000000" },
    ],
    testCases: [
      { input: "2\n3\n5", output: "15" },
      { input: "3\n100\n100\n100", output: "1000000" },
      { input: "4\n100\n100\n100\n2", output: ">1000000" },
      { input: "1\n1", output: "1" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "每乘一个数后检查是否超过 10⁶，如果超过可以提前终止。",
  },
  {
    title: "[GESP202403 二级] 小杨的日字矩阵",
    source: "gesp_official",
    sourceId: "B3955",
    sourceUrl: "https://www.luogu.com.cn/problem/B3955",
    level: 2,
    knowledgePoints: ["循环嵌套", "矩阵输出", "字符图案"],
    difficulty: "普及-",
    description: `构造一个 N×N 的"日"字形矩阵（N 为奇数）。
- 第一列和最后一列为 |
- 第一行、最后一行、中间行的第 2 到第 N-1 个字符为 -
- 其他位置为小写字母 x

例如 N=5 时：
\`\`\`
|---|
|xxx|
|---|
|xxx|
|---|
\`\`\``,
    inputFormat: `一个整数 N，其中 5 ≤ N ≤ 49，保证 N 为奇数。`,
    outputFormat: `输出 N 行，每行 N 个字符。`,
    samples: [
      { input: "5", output: "|---|\n|xxx|\n|---|\n|xxx|\n|---|" },
      { input: "7", output: "|-----|\n|xxxxx|\n|xxxxx|\n|-----|\n|xxxxx|\n|xxxxx|\n|-----|" },
    ],
    testCases: [
      { input: "5", output: "|---|\n|xxx|\n|---|\n|xxx|\n|---|" },
      { input: "7", output: "|-----|\n|xxxxx|\n|xxxxx|\n|-----|\n|xxxxx|\n|xxxxx|\n|-----|" },
      { input: "9", output: "|-------|\n|xxxxxxx|\n|xxxxxxx|\n|xxxxxxx|\n|-------|\n|xxxxxxx|\n|xxxxxxx|\n|xxxxxxx|\n|-------|" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "第1行、第(N+1)/2行、第N行的中间部分是 -，其他中间部分是 x。",
  },

  // ========== 2024年6月 ==========
  {
    title: "[GESP202406 二级] 平方之和",
    source: "gesp_official",
    sourceId: "B4002",
    sourceUrl: "https://www.luogu.com.cn/problem/B4002",
    level: 2,
    knowledgePoints: ["循环嵌套", "枚举", "数学"],
    difficulty: "普及-",
    description: `给定若干正整数，判断每个数是否能表示为两个正整数的平方和，即是否存在正整数 x 和 y 使得 x² + y² = a。`,
    inputFormat: `第一行包含正整数 n，表示数字个数。

接下来 n 行，每行一个正整数 aᵢ。

数据范围：1 ≤ n ≤ 10，1 ≤ aᵢ ≤ 10⁶`,
    outputFormat: `对于每个数，如果能表示为两个正整数的平方和，输出 \"Yes\"；否则输出 \"No\"。`,
    samples: [
      { input: "2\n5\n4", output: "Yes\nNo", explanation: "5 = 1² + 2²，可以表示；4 = 2²，但 0 不是正整数，所以不行" },
    ],
    testCases: [
      { input: "2\n5\n4", output: "Yes\nNo" },
      { input: "3\n2\n10\n25", output: "Yes\nNo\nYes" },
      { input: "1\n1000000", output: "Yes" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "枚举 x 从 1 到 sqrt(a)，检查 a - x² 是否为完全平方数。",
  },
  {
    title: "[GESP202406 二级] 计数",
    source: "gesp_official",
    sourceId: "B4007",
    sourceUrl: "https://www.luogu.com.cn/problem/B4007",
    level: 2,
    knowledgePoints: ["循环", "数位分离", "计数"],
    difficulty: "普及-",
    description: `小杨认为 k（1 ≤ k ≤ 9）是他的幸运数字。他想知道从 1 到 n 的所有整数中，数字 k 一共出现了多少次。`,
    inputFormat: `第一行包含正整数 n。
第二行包含正整数 k。

数据范围：1 ≤ n ≤ 1000，1 ≤ k ≤ 9`,
    outputFormat: `输出数字 k 在 1 到 n 中出现的总次数。`,
    samples: [
      { input: "25\n2", output: "9", explanation: "从1到25，数字2出现在：2, 12, 20, 21, 22(两次), 23, 24, 25，共9次" },
    ],
    testCases: [
      { input: "25\n2", output: "9" },
      { input: "100\n1", output: "21" },
      { input: "10\n5", output: "1" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "遍历 1 到 n 的每个数，对每个数分离各位数字，统计数字 k 出现的次数。",
  },

  // ========== 2024年9月 ==========
  {
    title: "[GESP202409 二级] 数位之和",
    source: "gesp_official",
    sourceId: "B4036",
    sourceUrl: "https://www.luogu.com.cn/problem/B4036",
    level: 2,
    knowledgePoints: ["循环", "数位分离", "判断"],
    difficulty: "普及-",
    description: `一个正整数如果各位数字之和是 7 的倍数，则称它为"美丽数"。

给定若干正整数，判断每个是否为美丽数。`,
    inputFormat: `第一行包含整数 n，表示数字个数。

接下来 n 行，每行一个正整数 aᵢ。

数据范围：1 ≤ n ≤ 10⁵，1 ≤ aᵢ ≤ 10⁵`,
    outputFormat: `对于每个数，如果是美丽数输出 \"Yes\"；否则输出 \"No\"。`,
    samples: [
      { input: "3\n7\n52\n103", output: "Yes\nYes\nNo", explanation: "7的数位和是7；52的数位和是5+2=7；103的数位和是1+0+3=4" },
    ],
    testCases: [
      { input: "3\n7\n52\n103", output: "Yes\nYes\nNo" },
      { input: "2\n14\n21", output: "No\nNo" },
      { input: "1\n77", output: "Yes" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "计算每个数的各位数字之和，判断是否能被 7 整除。",
  },
  {
    title: "[GESP202409 二级] 小杨的 N 字矩阵",
    source: "gesp_official",
    sourceId: "B4037",
    sourceUrl: "https://www.luogu.com.cn/problem/B4037",
    level: 2,
    knowledgePoints: ["循环嵌套", "矩阵输出", "对角线"],
    difficulty: "普及-",
    description: `构造一个 m×m 的 N 字形矩阵（m 为奇数）。
- 第一列和最后一列为 +
- 主对角线为 +
- 其他位置为 -

例如 m=5 时：
\`\`\`
+---+
++--+
+-+-+
+--++
+---+
\`\`\``,
    inputFormat: `一个正整数 m，其中 3 ≤ m ≤ 49，保证 m 为奇数。`,
    outputFormat: `输出 m 行，每行 m 个字符。`,
    samples: [
      { input: "5", output: "+---+\n++--+\n+-+-+\n+--++\n+---+" },
    ],
    testCases: [
      { input: "5", output: "+---+\n++--+\n+-+-+\n+--++\n+---+" },
      { input: "3", output: "+-+\n+++\n+-+" },
      { input: "7", output: "+-----+\n++----+\n+-+---+\n+--+--+\n+---+-+\n+----++\n+-----+" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "位置 (i, j) 输出 + 的条件：j == 0 或 j == m-1 或 i == j。",
  },

  // ========== 2024年12月 ==========
  {
    title: "[GESP202412 二级] 寻找数字",
    source: "gesp_official",
    sourceId: "B4064",
    sourceUrl: "https://www.luogu.com.cn/problem/B4064",
    level: 2,
    knowledgePoints: ["循环", "开方", "判断"],
    difficulty: "普及-",
    description: `给定正整数 a，判断是否存在正整数 b 使得 a = b⁴。

如果存在，输出 b；否则输出 -1。`,
    inputFormat: `第一行包含正整数 t，表示测试用例数。

接下来 t 行，每行一个正整数 a。

数据范围：1 ≤ t ≤ 10⁵，1 ≤ a ≤ 10⁸`,
    outputFormat: `对于每个 a，如果存在 b 使得 a = b⁴，输出 b；否则输出 -1。`,
    samples: [
      { input: "3\n16\n81\n10", output: "2\n3\n-1", explanation: "16 = 2⁴，81 = 3⁴，10 不是四次方数" },
    ],
    testCases: [
      { input: "3\n16\n81\n10", output: "2\n3\n-1" },
      { input: "2\n1\n256", output: "1\n4" },
      { input: "1\n100000000", output: "100" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "计算 a 的四次方根（可以先开平方再开平方），检查结果的四次方是否等于 a。",
  },
  {
    title: "[GESP202412 二级] 数位和",
    source: "gesp_official",
    sourceId: "B4065",
    sourceUrl: "https://www.luogu.com.cn/problem/B4065",
    level: 2,
    knowledgePoints: ["循环", "数位分离", "最大值"],
    difficulty: "普及-",
    description: `给定 n 个正整数，找出其中数位和最大的值。

数位和是指一个数各位数字的总和。例如 12345 的数位和是 1+2+3+4+5=15。`,
    inputFormat: `第一行包含正整数 n，表示数字个数。

接下来 n 行，每行一个正整数。

数据范围：1 ≤ n ≤ 10⁵，每个数 ≤ 10¹²`,
    outputFormat: `输出所有数中数位和的最大值。`,
    samples: [
      { input: "3\n16\n81\n10", output: "9", explanation: "16的数位和是7，81的数位和是9，10的数位和是1，最大是9" },
    ],
    testCases: [
      { input: "3\n16\n81\n10", output: "9" },
      { input: "2\n999\n1000", output: "27" },
      { input: "1\n123456789", output: "45" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "对每个数计算数位和，用一个变量记录最大值。",
  },

  // ========== 2025年3月 ==========
  {
    title: "[GESP202503 二级] 等差矩阵",
    source: "gesp_official",
    sourceId: "B4259",
    sourceUrl: "https://www.luogu.com.cn/problem/B4259",
    level: 2,
    knowledgePoints: ["循环嵌套", "矩阵输出", "乘法表"],
    difficulty: "普及-",
    description: `构造一个 n×m 的矩阵，使得每行和每列都构成等差数列。

解法是在位置 (i, j) 放置 i × j 的值（i, j 从 1 开始）。`,
    inputFormat: `一行，包含两个正整数 n 和 m。

数据范围：1 ≤ n, m ≤ 50`,
    outputFormat: `输出 n 行，每行 m 个用空格分隔的整数。`,
    samples: [
      { input: "3 4", output: "1 2 3 4\n2 4 6 8\n3 6 9 12" },
    ],
    testCases: [
      { input: "3 4", output: "1 2 3 4\n2 4 6 8\n3 6 9 12" },
      { input: "2 2", output: "1 2\n2 4" },
      { input: "4 3", output: "1 2 3\n2 4 6\n3 6 9\n4 8 12" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "位置 (i, j) 的值为 i * j，这样每行和每列都是等差数列。",
  },
  {
    title: "[GESP202503 二级] 时间跨越",
    source: "gesp_official",
    sourceId: "B4260",
    sourceUrl: "https://www.luogu.com.cn/problem/B4260",
    level: 2,
    knowledgePoints: ["日期计算", "闰年", "模拟"],
    difficulty: "普及-",
    description: `给定一个日期和时间（年 y、月 m、日 d、小时 h）以及一个时间间隔 k 小时，计算经过 k 小时后的日期和时间。

闰年规则：
- 能被 4 整除但不能被 100 整除的年份是闰年
- 能被 400 整除的年份也是闰年`,
    inputFormat: `五行，分别包含正整数 y, m, d, h, k。

数据范围：
- 2000 ≤ y ≤ 3000
- 1 ≤ m ≤ 12
- 1 ≤ d ≤ 31
- 0 ≤ h ≤ 23
- 1 ≤ k ≤ 24
- 输入保证是合法日期`,
    outputFormat: `四个正整数 y', m', d', h'，表示经过 k 小时后的日期和时间。`,
    samples: [
      { input: "2008\n2\n28\n23\n1", output: "2008 2 29 0", explanation: "2008年是闰年，2月有29天，23点过1小时是29日0点" },
    ],
    testCases: [
      { input: "2008\n2\n28\n23\n1", output: "2008 2 29 0" },
      { input: "2023\n12\n31\n23\n2", output: "2024 1 1 1" },
      { input: "2100\n2\n28\n12\n24", output: "2100 3 1 12" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "先加小时，如果超过24则进位到下一天，注意处理月末和年末的情况，以及闰年2月有29天。",
  },

  // ========== 2025年6月 ==========
  {
    title: "[GESP202506 二级] 数三角形",
    source: "gesp_official",
    sourceId: "B4356",
    sourceUrl: "https://www.luogu.com.cn/problem/B4356",
    level: 2,
    knowledgePoints: ["循环嵌套", "枚举", "数学"],
    difficulty: "普及-",
    description: `直角三角形的面积公式为 S = ab/2，其中 a 和 b 是两条直角边的长度。

给定正整数 n，统计满足以下条件的直角三角形个数：
- 两条直角边都是不超过 n 的正整数
- 面积是整数

注意：边长为 (a, b) 和 (b, a) 的三角形视为同一个。`,
    inputFormat: `一个正整数 n。

数据范围：1 ≤ n ≤ 1000`,
    outputFormat: `满足条件的三角形个数。`,
    samples: [
      { input: "3", output: "3", explanation: "满足条件的有：(1,2), (2,2), (2,3)（积为偶数的情况）" },
      { input: "5", output: "9" },
    ],
    testCases: [
      { input: "3", output: "3" },
      { input: "5", output: "9" },
      { input: "10", output: "37" },
      { input: "100", output: "3775" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "面积 ab/2 是整数当且仅当 ab 是偶数，即 a 或 b 至少有一个是偶数。枚举 a ≤ b ≤ n 的所有情况。",
  },
  {
    title: "[GESP202506 二级] 幂和数",
    source: "gesp_official",
    sourceId: "B4357",
    sourceUrl: "https://www.luogu.com.cn/problem/B4357",
    level: 2,
    knowledgePoints: ["循环嵌套", "枚举", "位运算"],
    difficulty: "普及-",
    description: `一个正整数如果能表示为两个 2 的幂次之和（即 n = 2^x + 2^y，其中 x, y 是非负整数），则称为"幂和数"。

给定区间 [l, r]，统计其中有多少个幂和数。`,
    inputFormat: `一行，包含两个正整数 l 和 r。

数据范围：1 ≤ l ≤ r ≤ 10⁴`,
    outputFormat: `一个整数，表示区间内幂和数的个数。`,
    samples: [
      { input: "2 8", output: "6", explanation: "幂和数有：2(1+1), 3(1+2), 4(2+2), 5(1+4), 6(2+4), 8(4+4)" },
      { input: "10 100", output: "20" },
    ],
    testCases: [
      { input: "2 8", output: "6" },
      { input: "10 100", output: "20" },
      { input: "1 1", output: "0" },
      { input: "1 10000", output: "105" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "可以预先生成所有不超过 r 的幂和数（枚举 2^x + 2^y），然后统计在 [l, r] 范围内的个数。",
  },

  // ========== 2025年9月 ==========
  {
    title: "[GESP202509 二级] 优美的数字",
    source: "gesp_official",
    sourceId: "B4411",
    sourceUrl: "https://www.luogu.com.cn/problem/B4411",
    level: 2,
    knowledgePoints: ["循环", "数位判断", "计数"],
    difficulty: "普及-",
    description: `一个正整数如果所有数位上的数字都相同，则称为"优美的数字"。

例如：6（单个数字）、99（都是9）是优美的；123（数字不同）不是优美的。

给定正整数 n，统计不超过 n 的优美数字有多少个。`,
    inputFormat: `一个正整数 n。

数据范围：1 ≤ n ≤ 2025`,
    outputFormat: `一个整数，表示不超过 n 的优美数字个数。`,
    samples: [
      { input: "6", output: "6", explanation: "1, 2, 3, 4, 5, 6 都是优美的" },
      { input: "2025", output: "28" },
    ],
    testCases: [
      { input: "6", output: "6" },
      { input: "2025", output: "28" },
      { input: "11", output: "10" },
      { input: "100", output: "18" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "优美数字的规律：1-9, 11, 22, ..., 99, 111, 222, ..., 999, 1111, ...。可以直接枚举或生成。",
  },
  {
    title: "[GESP202509 二级] 菱形",
    source: "gesp_official",
    sourceId: "B4412",
    sourceUrl: "https://www.luogu.com.cn/problem/B4412",
    level: 2,
    knowledgePoints: ["循环嵌套", "矩阵输出", "菱形图案"],
    difficulty: "普及-",
    description: `绘制一个 n×n 的菱形图案（n 为奇数）。
- 菱形的四个顶点分别在第 1 行中央、第 1 列中央、第 n 行中央、第 n 列中央
- 菱形边界用 # 表示
- 其他位置用 . 表示

例如 n=3 时：
\`\`\`
.#.
#.#
.#.
\`\`\``,
    inputFormat: `一个整数 n，其中 3 ≤ n ≤ 29，保证 n 为奇数。`,
    outputFormat: `输出 n 行，每行 n 个字符。`,
    samples: [
      { input: "3", output: ".#.\n#.#\n.#." },
      { input: "9", output: "....#....\n...#.#...\n..#...#..\n.#.....#.\n#.......#\n.#.....#.\n..#...#..\n...#.#...\n....#...." },
    ],
    testCases: [
      { input: "3", output: ".#.\n#.#\n.#." },
      { input: "5", output: "..#..\n.#.#.\n#...#\n.#.#.\n..#.." },
      { input: "9", output: "....#....\n...#.#...\n..#...#..\n.#.....#.\n#.......#\n.#.....#.\n..#...#..\n...#.#...\n....#...." },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "设中心点为 (mid, mid)，则 # 的位置满足 |i - mid| + |j - mid| == mid。",
  },

  // ========== 2025年12月 ==========
  {
    title: "[GESP202512 二级] 环保能量球",
    source: "gesp_official",
    sourceId: "B4447",
    sourceUrl: "https://www.luogu.com.cn/problem/B4447",
    level: 2,
    knowledgePoints: ["循环", "整除", "计数"],
    difficulty: "普及-",
    description: `小杨在环保游戏中行走，每走 1 公里获得 1 点能量。此外，每走 x 公里还会额外获得 1 点奖励能量。

给定行走距离 n 和奖励间隔 x，计算总共获得多少点能量。`,
    inputFormat: `第一行包含整数 t，表示测试用例数（1 ≤ t ≤ 100）。

每个测试用例包含两行：
- 第一行：整数 n（行走距离，1 ≤ n ≤ 1000）
- 第二行：整数 x（奖励间隔，1 ≤ x ≤ 1000）`,
    outputFormat: `对于每个测试用例，输出一行表示总能量。`,
    samples: [
      { input: "3\n5\n2\n10\n3\n2\n5", output: "7\n13\n2", explanation: "第1组：基础5点 + 奖励2点（2km和4km处）= 7；第2组：10 + 3 = 13；第3组：2 + 0 = 2" },
    ],
    testCases: [
      { input: "3\n5\n2\n10\n3\n2\n5", output: "7\n13\n2" },
      { input: "1\n100\n10", output: "110" },
      { input: "2\n1\n1\n1000\n1000", output: "2\n1001" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "总能量 = n + n/x（整数除法），即基础能量加上奖励次数。",
  },
  {
    title: "[GESP202512 二级] 黄金格",
    source: "gesp_official",
    sourceId: "B4448",
    sourceUrl: "https://www.luogu.com.cn/problem/B4448",
    level: 2,
    knowledgePoints: ["循环嵌套", "枚举", "数学"],
    difficulty: "普及-",
    description: `在一个 H 行 W 列的网格中，坐标为 (r, c) 的格子（r 为行号，c 为列号，从 1 开始）如果满足条件 sqrt(r² + c²) ≤ x + r - c，则称为"黄金格"。

给定 H、W 和 x，统计黄金格的数量。`,
    inputFormat: `三行，分别包含正整数 H、W、x。

数据范围：所有输入值不超过 1000`,
    outputFormat: `一个整数，表示黄金格的数量。`,
    samples: [
      { input: "4\n4\n2", output: "4", explanation: "黄金格位于 (1,1), (2,1), (3,1), (4,1)" },
    ],
    testCases: [
      { input: "4\n4\n2", output: "4" },
      { input: "10\n10\n5", output: "30" },
      { input: "100\n100\n50", output: "2550" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "遍历所有 H×W 个格子，对每个 (r, c) 检查是否满足不等式条件。",
  },
];

async function seedGesp2() {
  try {
    // 获取现有题目ID列表，避免重复添加
    const existingProblems = await prisma.problem.findMany({
      where: {
        sourceId: {
          in: gesp2Problems.map(p => p.sourceId).filter(Boolean) as string[]
        }
      },
      select: { sourceId: true }
    });

    const existingIds = new Set(existingProblems.map(p => p.sourceId));

    // 过滤出需要添加的新题目
    const newProblems = gesp2Problems.filter(p => !existingIds.has(p.sourceId));

    if (newProblems.length === 0) {
      return NextResponse.json({
        success: true,
        message: "所有 GESP 2级题目已存在",
        existingCount: existingProblems.length,
        addedCount: 0
      });
    }

    // 添加新题目
    const result = await prisma.problem.createMany({
      data: newProblems,
    });

    return NextResponse.json({
      success: true,
      message: `成功添加 ${result.count} 道 GESP 2级题目`,
      existingCount: existingProblems.length,
      addedCount: result.count,
      totalCount: existingProblems.length + result.count
    });
  } catch (error) {
    console.error("Seed GESP2 error:", error);
    return NextResponse.json({ error: "添加题目失败", details: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return seedGesp2();
}

export async function POST() {
  return seedGesp2();
}
