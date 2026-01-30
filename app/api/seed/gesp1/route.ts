import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GESP 1级完整题库 - 来源：洛谷 CCF GESP C++ 一级上机题
// 官方题单：https://www.luogu.com.cn/training/551
// 所有内容与洛谷100%一致

const gesp1Problems = [
  // ========== 样题 ==========
  {
    title: "[GESP样题 一级] 闰年求和",
    source: "gesp_official",
    sourceId: "B3846",
    sourceUrl: "https://www.luogu.com.cn/problem/B3846",
    level: 1,
    knowledgePoints: ["循环语句", "条件判断", "闰年判断"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1101`,
    description: `小明学习了判断平年和闰年的方法，他想知道两个年份之间（不包含起始年份和终止年份）的闰年年份具体数字之和。你能编写一个程序帮帮他吗？`,
    inputFormat: `输入一行，包含两个整数，分别表示起始年份和终止年份。约定年份在 $1$ 到 $2022$ 之间。`,
    outputFormat: `输出一行，包含一个整数，表示闰年年份具体数字之和。`,
    samples: [
      { input: "2018 2022", output: "2020" },
    ],
    testCases: [
      { input: "2018 2022", output: "2020" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: ``,
  },
  {
    title: "[GESP样题 一级] 当天的第几秒",
    source: "gesp_official",
    sourceId: "B3847",
    sourceUrl: "https://www.luogu.com.cn/problem/B3847",
    level: 1,
    knowledgePoints: ["时间计算", "条件判断"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1101`,
    description: `小明刚刚学习了小时、分和秒的换算关系。他想知道一个给定的时刻是这一天的第几秒，你能编写一个程序帮帮他吗？`,
    inputFormat: `输入一行，包含三个整数和一个字符。三个整数分别表示时刻的时、分、秒；字符有两种取值，大写字母 \`A\` 表示上午，大写字母 \`P\` 表示下午。`,
    outputFormat: `输出一行，包含一个整数，表示输入时刻是当天的第几秒。`,
    samples: [
      { input: "0 0 0 A", output: "0" },
      { input: "11 59 59 P", output: "86399" },
    ],
    testCases: [
      { input: "0 0 0 A", output: "0" },
      { input: "11 59 59 P", output: "86399" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: ``,
  },
  // ========== 2023年3月 ==========
  {
    title: "[GESP202303 一级] 长方形面积",
    source: "gesp_official",
    sourceId: "B3834",
    sourceUrl: "https://www.luogu.com.cn/problem/B3834",
    level: 1,
    knowledgePoints: ["循环语句", "因数"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1121`,
    description: `小明学习了长方形面积的计算方法，他发现如果长方形的长和宽都为整数，那么面积也是整数。现在已知长方形面积，小明想知道有多少种可能的长方形，可以使其长和宽都为正整数。其中，相同长和宽的两个长方形，视为同一种长方形。另外，我们约定长方形的长大于或等于宽，正方形也是长方形的一种。`,
    inputFormat: `输入一行，包含一个整数 $A$，表示长方形的面积。约定 $2 \\le A \\le 1000$。`,
    outputFormat: `输出一行，包含一个整数 $C$，表示有 $C$ 种可能的长方形。`,
    samples: [
      { input: "4", output: "2" },
      { input: "6", output: "2" },
    ],
    testCases: [
      { input: "4", output: "2" },
      { input: "6", output: "2" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `**【样例解释 #1】**

面积为 $4$ 的长方形有 $2$ 种：$2 \\times 2$、$4 \\times 1$。

**【样例解释 #2】**

面积为 $6$ 的长方形有 $2$ 种：$3 \\times 2$、$6 \\times 1$。`,
  },
  {
    title: "[GESP202303 一级] 每月天数",
    source: "gesp_official",
    sourceId: "B3835",
    sourceUrl: "https://www.luogu.com.cn/problem/B3835",
    level: 1,
    knowledgePoints: ["条件判断", "闰年判断"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1121`,
    description: `小明刚刚学习了每月有多少天，以及如何判断平年和闰年，想到可以使用编程方法求出给定的月份有多少天。你能做到吗？`,
    inputFormat: `输入一行，包含两个整数 $A, B$，分别表示一个日期的年、月。约定 $2000 \\le A \\le 3000$，$1 \\le B \\le 12$。`,
    outputFormat: `输出一行，包含一个整数，表示输入月份有多少天。`,
    samples: [
      { input: "2022 1", output: "31" },
      { input: "2020 2", output: "29" },
    ],
    testCases: [
      { input: "2022 1", output: "31" },
      { input: "2020 2", output: "29" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: ``,
  },
  // ========== 2023年6月 ==========
  {
    title: "[GESP202306 一级] 时间规划",
    source: "gesp_official",
    sourceId: "B3838",
    sourceUrl: "https://www.luogu.com.cn/problem/B3838",
    level: 1,
    knowledgePoints: ["时间计算"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1123`,
    description: `小明正在进行时间规划，他想知道从某一个时刻到另一个时刻，一共有多少分钟。你能编写程序帮帮他吗？`,
    inputFormat: `输入包含 $4$ 行。第 $1$ 行为起始时刻的小时，第 $2$ 行为起始时刻的分钟，第 $3$ 行为结束时刻的小时，第 $4$ 行为结束时刻的分钟。起始时刻和结束时刻为同一天，且起始时刻不晚于结束时刻。时刻采用 $24$ 小时制，即小时为 $0 \\sim 23$ 之间的整数，分钟为 $0 \\sim 59$ 之间的整数。`,
    outputFormat: `输出一行一个整数，表示起始时刻与结束时刻之间的分钟数。`,
    samples: [
      { input: "9\n5\n9\n6", output: "1" },
      { input: "9\n5\n10\n0", output: "55" },
    ],
    testCases: [
      { input: "9\n5\n9\n6", output: "1" },
      { input: "9\n5\n10\n0", output: "55" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: ``,
  },
  {
    title: "[GESP202306 一级] 累计相加",
    source: "gesp_official",
    sourceId: "B3839",
    sourceUrl: "https://www.luogu.com.cn/problem/B3839",
    level: 1,
    knowledgePoints: ["循环语句", "累加"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1123`,
    description: `输入一个正整数 $n$，求形如：$1+(1+2)+(1+2+3)+(1+2+3+4)+\\cdots+(1+2+3+4+5+\\cdots+n)$ 的累计相加。`,
    inputFormat: `输入一个正整数 $n$。约定 $1 < n \\le 100$。`,
    outputFormat: `输出累计相加的结果。`,
    samples: [
      { input: "3", output: "10" },
      { input: "4", output: "20" },
      { input: "10", output: "220" },
    ],
    testCases: [
      { input: "3", output: "10" },
      { input: "4", output: "20" },
      { input: "10", output: "220" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: ``,
  },
  // ========== 2023年9月 ==========
  {
    title: "[GESP202309 一级] 购买文具",
    source: "gesp_official",
    sourceId: "B3863",
    sourceUrl: "https://www.luogu.com.cn/problem/B3863",
    level: 1,
    knowledgePoints: ["条件判断", "计算"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1127`,
    description: `小明去文具店购买文具。已知铅笔的单价是 $2$ 元，小明需要购买 $X$ 支；作业本的单价是 $5$ 元，小明需要购买 $Y$ 本；尺子的单价是 $3$ 元，小明需要购买 $Z$ 把。假设小明一共带了 $Q$ 元钱，请判断小明带的钱够不够。`,
    inputFormat: `输入共 $4$ 行。第 $1$ 行输入小明需要购买的铅笔数量 $X$（$1 \\le X \\le 10$）；第 $2$ 行输入小明需要购买的作业本数量 $Y$（$1 \\le Y \\le 10$）；第 $3$ 行输入小明需要购买的尺子数量 $Z$（$1 \\le Z \\le 10$）；第 $4$ 行输入小明带的钱的金额 $Q$（单位是元）。`,
    outputFormat: `输出共 $2$ 行。如果钱够，第 $1$ 行输出 \`Yes\`，第 $2$ 行输出剩下多少钱；如果不够，第 $1$ 行输出 \`No\`，第 $2$ 行输出还差多少钱。`,
    samples: [
      { input: "1\n1\n1\n20", output: "Yes\n10" },
      { input: "1\n1\n1\n5", output: "No\n5" },
    ],
    testCases: [
      { input: "1\n1\n1\n20", output: "Yes\n10" },
      { input: "1\n1\n1\n5", output: "No\n5" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: ``,
  },
  {
    title: "[GESP202309 一级] 小明的幸运数",
    source: "gesp_official",
    sourceId: "B3864",
    sourceUrl: "https://www.luogu.com.cn/problem/B3864",
    level: 1,
    knowledgePoints: ["循环语句", "条件判断"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1127`,
    description: `小明有很多幸运数。他把个位数字是 $k$ 或者是 $k$ 的倍数的数称为"$k$ 幸运数"。现在给出一组 $L \\sim R$ 之间的数，请帮小明找出其中所有 $k$ 幸运数之和。`,
    inputFormat: `共 $3$ 行。第 $1$ 行输入正整数 $k$；第 $2$ 行输入正整数 $L$；第 $3$ 行输入正整数 $R$。约定 $2 \\le k \\le 9$，$1 \\le L \\le R \\le 1000$。`,
    outputFormat: `输出一行，包含一个整数，表示所有满足条件的幸运数之和。`,
    samples: [
      { input: "7\n1\n10", output: "7" },
      { input: "7\n10\n20", output: "31" },
    ],
    testCases: [
      { input: "7\n1\n10", output: "7" },
      { input: "7\n10\n20", output: "31" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `**【样例解释 #1】**

在 $1 \\sim 10$ 之间只有一个 $7$ 幸运数：$7$（是 $7$ 的倍数，并且个位数字是 $7$），所以答案是 $7$。

**【样例解释 #2】**

在 $10 \\sim 20$ 之间有两个 $7$ 幸运数：$14$（是 $7$ 的倍数）、$17$（个位数字是 $7$），所以答案是 $31$。`,
  },
  // ========== 2023年12月 ==========
  {
    title: "[GESP202312 一级] 小杨的考试",
    source: "gesp_official",
    sourceId: "B3921",
    sourceUrl: "https://www.luogu.com.cn/problem/B3921",
    level: 1,
    knowledgePoints: ["取模运算"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1133`,
    description: `今天是星期 $X$，小杨还有 $N$ 天就要考试了，你能算出考试是星期几吗？（本题中使用 $7$ 表示星期天）`,
    inputFormat: `输入共 $2$ 行。第 $1$ 行输入一个整数 $X$（$1 \\le X \\le 7$）；第 $2$ 行输入一个整数 $N$（$1 \\le N \\le 364$）。`,
    outputFormat: `输出一行一个整数，表示考试是星期几。`,
    samples: [
      { input: "1\n6", output: "7" },
      { input: "5\n3", output: "1" },
    ],
    testCases: [
      { input: "1\n6", output: "7" },
      { input: "5\n3", output: "1" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `**【样例解释 #1】**

如果今天是星期一，则 $6$ 天后是星期天（用 $7$ 表示）。

**【样例解释 #2】**

如果今天是星期五，则 $3$ 天后是星期一。`,
  },
  {
    title: "[GESP202312 一级] 小杨报数",
    source: "gesp_official",
    sourceId: "B3922",
    sourceUrl: "https://www.luogu.com.cn/problem/B3922",
    level: 1,
    knowledgePoints: ["循环语句", "条件判断"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1133`,
    description: `小杨需要从 $1$ 报数到 $N$，但他希望跳过所有 $M$ 的倍数。例如，如果 $N$ 是 $5$，$M$ 是 $2$，则小杨会报：$1$，$3$，$5$。请输出小杨报的每一个数。`,
    inputFormat: `输入共 $2$ 行。第 $1$ 行输入一个整数 $N$（$1 \\le N \\le 1000$）；第 $2$ 行输入一个整数 $M$（$2 \\le M \\le 100$）。`,
    outputFormat: `输出若干行，每行一个整数，依次表示小杨报的每一个数。`,
    samples: [
      { input: "5\n2", output: "1\n3\n5" },
      { input: "10\n3", output: "1\n2\n4\n5\n7\n8\n10" },
    ],
    testCases: [
      { input: "5\n2", output: "1\n3\n5" },
      { input: "10\n3", output: "1\n2\n4\n5\n7\n8\n10" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: ``,
  },
  // ========== 2024年3月 ==========
  {
    title: "[GESP202403 一级] 小杨买书",
    source: "gesp_official",
    sourceId: "B3952",
    sourceUrl: "https://www.luogu.com.cn/problem/B3952",
    level: 1,
    knowledgePoints: ["整除运算", "取模运算"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1141`,
    description: `小杨同学积攒了一部分零用钱想要用来购买书籍，已知一本书的单价是 $13$ 元，请根据小杨零用钱的金额，编写程序计算可以购买多少本书，还剩多少零用钱。`,
    inputFormat: `输入一个正整数 $m$，表示小杨拥有的零用钱数。`,
    outputFormat: `输出包含两行，第一行，购买图书的本数；第二行，剩余的零用钱数。`,
    samples: [
      { input: "100", output: "7\n9" },
      { input: "199", output: "15\n4" },
    ],
    testCases: [
      { input: "100", output: "7\n9" },
      { input: "199", output: "15\n4" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `对全部的测试数据，保证 $0 < m < 200$。`,
  },
  {
    title: "[GESP202403 一级] 求因数",
    source: "gesp_official",
    sourceId: "B3953",
    sourceUrl: "https://www.luogu.com.cn/problem/B3953",
    level: 1,
    knowledgePoints: ["循环语句", "因数"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1141`,
    description: `同学甲刚刚学习了因数的概念。具体来说，如果一个正整数 $a$ 能够被另一个正整数 $b$ 整除，那么 $b$ 就是 $a$ 的一个因数。编写程序输出正整数 $a$ 的所有因数，按照从小到大的顺序排列。`,
    inputFormat: `输入一行，包含一个正整数 $a$，保证 $a \\le 1000$。`,
    outputFormat: `输出若干行，每行包含 $a$ 的一个因数，按照从小到大的顺序排列。`,
    samples: [
      { input: "1", output: "1" },
      { input: "6", output: "1\n2\n3\n6" },
      { input: "10", output: "1\n2\n5\n10" },
    ],
    testCases: [
      { input: "1", output: "1" },
      { input: "6", output: "1\n2\n3\n6" },
      { input: "10", output: "1\n2\n5\n10" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: ``,
  },
  // ========== 2024年6月 ==========
  {
    title: "[GESP202406 一级] 休息时间",
    source: "gesp_official",
    sourceId: "B4000",
    sourceUrl: "https://www.luogu.com.cn/problem/B4000",
    level: 1,
    knowledgePoints: ["时间计算"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1149`,
    description: `小杨计划在某一个时刻开始学习，并且决定学习 $k$ 秒后就开始休息。他想知道他开始休息的时刻是几点。`,
    inputFormat: `输入共 $4$ 行。前三行每行一个整数，分别表示小杨开始学习时刻的时 $h$、分 $m$、秒 $s$（其中 $1 \\le h \\le 12$，$0 \\le m \\le 59$，$0 \\le s \\le 59$）。第四行一个整数 $k$，表示小杨学习的总秒数（其中 $1 \\le k \\le 3600$）。`,
    outputFormat: `输出一行三个整数，分别表示小杨开始休息时刻的时、分、秒。`,
    samples: [
      { input: "12\n59\n59\n10", output: "13 0 9" },
    ],
    testCases: [
      { input: "12\n59\n59\n10", output: "13 0 9" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `**【样例解释】**

如果小杨在 $12$ 时 $59$ 分 $59$ 秒开始学习，学习了 $10$ 秒后开始休息，那么开始休息的时刻是 $13$ 时 $0$ 分 $9$ 秒。

**【数据范围】**

对于所有数据，保证 $1 \\le h \\le 12$，$0 \\le m \\le 59$，$0 \\le s \\le 59$，$1 \\le k \\le 3600$。`,
  },
  {
    title: "[GESP202406 一级] 立方数",
    source: "gesp_official",
    sourceId: "B4001",
    sourceUrl: "https://www.luogu.com.cn/problem/B4001",
    level: 1,
    knowledgePoints: ["循环语句", "立方数"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1149`,
    description: `给定一个正整数 $n$，判断是否存在正整数 $x$ 使得 $x^3 = n$。若 $n$ 是立方数，输出 \`Yes\`，否则输出 \`No\`。`,
    inputFormat: `输入一行，包含一个正整数 $n$。`,
    outputFormat: `如果 $n$ 是立方数，输出 \`Yes\`，否则输出 \`No\`。`,
    samples: [
      { input: "8", output: "Yes" },
      { input: "9", output: "No" },
    ],
    testCases: [
      { input: "8", output: "Yes" },
      { input: "9", output: "No" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `**【样例解释 #1】**

$8 = 2^3$，所以输出 \`Yes\`。

**【样例解释 #2】**

$9$ 不是立方数，所以输出 \`No\`。

**【数据范围】**

对于所有数据，保证 $1 \\le n \\le 1000$。`,
  },
  // ========== 2024年9月 ==========
  {
    title: "[GESP202409 一级] 小杨购物",
    source: "gesp_official",
    sourceId: "B4034",
    sourceUrl: "https://www.luogu.com.cn/problem/B4034",
    level: 1,
    knowledgePoints: ["整除运算"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1157`,
    description: `小杨有 $n$ 元钱要去购物。已知商品 A 的单价是 $a$ 元，商品 B 的单价是 $b$ 元。小杨需要购买相同数量的商品 A 和商品 B，请问他最多能购买多少个商品？`,
    inputFormat: `输入共 $3$ 行。第 $1$ 行输入一个正整数 $n$，表示小杨拥有的钱数。第 $2$ 行输入一个正整数 $a$，表示商品 A 的单价。第 $3$ 行输入一个正整数 $b$，表示商品 B 的单价。`,
    outputFormat: `输出一个整数，表示小杨最多能购买的商品 A 和商品 B 的总数量。`,
    samples: [
      { input: "12\n1\n2", output: "4" },
      { input: "13\n1\n2", output: "4" },
    ],
    testCases: [
      { input: "12\n1\n2", output: "4" },
      { input: "13\n1\n2", output: "4" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `**【样例解释 #1】**

当 $n = 12$，$a = 1$，$b = 2$ 时，小杨可以购买 $4$ 件商品 A 和 $4$ 件商品 B，花费 $4 \\times 1 + 4 \\times 2 = 12$ 元，所以答案为 $4$。

**【样例解释 #2】**

当 $n = 13$，$a = 1$，$b = 2$ 时，如果购买 $5$ 件商品，花费 $5 \\times 1 + 5 \\times 2 = 15$ 元，超过预算，所以答案为 $4$。`,
  },
  {
    title: "[GESP202409 一级] 漂亮数",
    source: "gesp_official",
    sourceId: "B4035",
    sourceUrl: "https://www.luogu.com.cn/problem/B4035",
    level: 1,
    knowledgePoints: ["循环语句", "条件判断"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1157`,
    description: `给定 $n$ 个正整数，如果一个数是 $9$ 的倍数但不是 $8$ 的倍数，则称它为"漂亮数"。请统计这 $n$ 个正整数中有多少个漂亮数。`,
    inputFormat: `输入共 $2$ 行。第 $1$ 行输入一个整数 $n$，表示正整数的个数。第 $2$ 行输入 $n$ 个正整数 $a_1, a_2, \\ldots, a_n$。`,
    outputFormat: `输出一行一个整数，表示漂亮数的个数。`,
    samples: [
      { input: "3\n1 9 72", output: "1" },
    ],
    testCases: [
      { input: "3\n1 9 72", output: "1" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `**【样例解释】**

$1$ 既不是 $9$ 的倍数也不是 $8$ 的倍数，不是漂亮数；$9$ 是 $9$ 的倍数但不是 $8$ 的倍数，是漂亮数；$72$ 既是 $9$ 的倍数也是 $8$ 的倍数，不是漂亮数。`,
  },
  // ========== 2024年12月 ==========
  {
    title: "[GESP202412 一级] 温度转换",
    source: "gesp_official",
    sourceId: "B4062",
    sourceUrl: "https://www.luogu.com.cn/problem/B4062",
    level: 1,
    knowledgePoints: ["浮点数计算", "条件判断"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1165`,
    description: `小杨想编写一个程序，将开尔文温度转换为摄氏度和华氏度。已知开尔文温度 $K$ 转换为摄氏度 $C$ 的公式为：$C = K - 273.15$；摄氏度 $C$ 转换为华氏度 $F$ 的公式为：$F = C \\times 1.8 + 32$。如果转换后的华氏温度超过 $212$，输出 \`Temperature is too high!\`；否则输出转换后的摄氏度和华氏度，保留两位小数。`,
    inputFormat: `输入一个实数，表示开尔文温度 $K$。`,
    outputFormat: `如果转换后的华氏温度超过 $212$，输出 \`Temperature is too high!\`；否则输出转换后的摄氏度和华氏度，用空格隔开，均保留两位小数。`,
    samples: [
      { input: "412.00", output: "Temperature is too high!" },
      { input: "173.56", output: "-99.59 -147.26" },
    ],
    testCases: [
      { input: "412.00", output: "Temperature is too high!" },
      { input: "173.56", output: "-99.59 -147.26" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `**【数据范围】**

对于所有数据，保证 $0 < K < 10^5$。`,
  },
  {
    title: "[GESP202412 一级] 奇数和偶数",
    source: "gesp_official",
    sourceId: "B4063",
    sourceUrl: "https://www.luogu.com.cn/problem/B4063",
    level: 1,
    knowledgePoints: ["循环语句", "条件判断"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1165`,
    description: `小杨有 $n$ 个正整数，需要统计其中奇数和偶数的个数。`,
    inputFormat: `输入共 $n + 1$ 行。第 $1$ 行输入一个正整数 $n$，代表正整数的个数。之后 $n$ 行，每行包含一个正整数。`,
    outputFormat: `输出两个正整数，用空格间隔，分别代表奇数和偶数的个数。若某类数的个数为 $0$，则输出 $0$。`,
    samples: [
      { input: "5\n1\n2\n3\n4\n5", output: "3 2" },
    ],
    testCases: [
      { input: "5\n1\n2\n3\n4\n5", output: "3 2" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `**【数据范围】**

对于所有数据，保证 $1 \\le n \\le 10^5$，正整数不超过 $10^5$。`,
  },
  // ========== 2025年3月 ==========
  {
    title: "[GESP202503 一级] 图书馆里的老鼠",
    source: "gesp_official",
    sourceId: "B4257",
    sourceUrl: "https://www.luogu.com.cn/problem/B4257",
    level: 1,
    knowledgePoints: ["整除运算"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1173`,
    description: `一个图书馆里共有 $n$ 本书，但不幸的是图书馆里进了一只老鼠。老鼠每 $x$ 小时就能完整吃掉一本书，并且在没有完全吃掉之前不会去吃另外一本。现在 $y$ 小时过去了，请问图书馆中还有多少本完整的书？`,
    inputFormat: `输入共 $3$ 行。第 $1$ 行输入一个正整数 $n$，表示图书馆中书的数量。第 $2$ 行输入一个正整数 $x$，表示老鼠吃掉一本书需要的小时数。第 $3$ 行输入一个正整数 $y$，表示经过的时间。数据保证 $y$ 小时后至少有一本完整的书。`,
    outputFormat: `输出一行一个整数，表示图书馆中剩余完整书的数量。`,
    samples: [
      { input: "10\n2\n3", output: "8" },
      { input: "5\n2\n4", output: "3" },
    ],
    testCases: [
      { input: "10\n2\n3", output: "8" },
      { input: "5\n2\n4", output: "3" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `**【数据范围】**

对于所有测试点，保证 $1 \\le n, x, y \\le 1000$，且保证 $y$ 小时后图书馆中至少有一本完整的书。`,
  },
  {
    title: "[GESP202503 一级] 四舍五入",
    source: "gesp_official",
    sourceId: "B4258",
    sourceUrl: "https://www.luogu.com.cn/problem/B4258",
    level: 1,
    knowledgePoints: ["取模运算", "条件判断"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1173`,
    description: `四舍五入是一种常见的取近似值方法。给定 $n$ 个整数，请将它们四舍五入到最接近的十的倍数。例如，$43$ 四舍五入后是 $40$，$58$ 四舍五入后是 $60$。`,
    inputFormat: `输入共 $n + 1$ 行。第 $1$ 行输入一个整数 $n$，表示接下来会输入的整数个数。接下来 $n$ 行，每行输入一个需要进行四舍五入的整数。`,
    outputFormat: `输出共 $n$ 行，每行一个整数，表示对应输入整数四舍五入后的结果。`,
    samples: [
      { input: "5\n43\n58\n25\n67\n90", output: "40\n60\n30\n70\n90" },
    ],
    testCases: [
      { input: "5\n43\n58\n25\n67\n90", output: "40\n60\n30\n70\n90" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `**【数据范围】**

对于所有测试点，保证 $1 \\le n \\le 100$，$1 \\le a_i \\le 10000$。`,
  },
  // ========== 2025年6月 ==========
  {
    title: "[GESP202506 一级] 假期阅读",
    source: "gesp_official",
    sourceId: "B4354",
    sourceUrl: "https://www.luogu.com.cn/problem/B4354",
    level: 1,
    knowledgePoints: ["计算", "条件判断"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1181`,
    description: `小 A 有一本书共 $n$ 页，他计划每天最多阅读 $k$ 页，假期共有 $t$ 天。请问假期中他最多能阅读多少页？`,
    inputFormat: `输入共 $3$ 行，分别输入书的页数 $n$、每天最多阅读的页数 $k$、假期的天数 $t$。`,
    outputFormat: `输出一个整数，表示假期中能阅读的最多页数。`,
    samples: [
      { input: "8\n3\n2", output: "6" },
      { input: "19\n3\n30", output: "19" },
    ],
    testCases: [
      { input: "8\n3\n2", output: "6" },
      { input: "19\n3\n30", output: "19" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `**【数据范围】**

对于所有测试点，保证 $n, k, t$ 均不超过 $1000$。`,
  },
  {
    title: "[GESP202506 一级] 值日表",
    source: "gesp_official",
    sourceId: "B4355",
    sourceUrl: "https://www.luogu.com.cn/problem/B4355",
    level: 1,
    knowledgePoints: ["最小公倍数"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1181`,
    description: `小杨和小红两位同学是班级值日生，负责打扫班级卫生。小杨每 $m$ 天值日一次，小红每 $n$ 天值日一次。今天他们两人都值日了，请问最少再过多少天，他们两人还会在同一天一起值日？`,
    inputFormat: `输入共 $2$ 行。第 $1$ 行输入一个正整数 $m$，表示小杨的值日周期。第 $2$ 行输入一个正整数 $n$，表示小红的值日周期。`,
    outputFormat: `输出一行一个整数，表示最少再过多少天他们两人会在同一天值日。`,
    samples: [
      { input: "4\n6", output: "12" },
    ],
    testCases: [
      { input: "4\n6", output: "12" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `**【数据范围】**

对于所有测试点，保证 $1 \\le m, n \\le 100$。`,
  },
  // ========== 2025年9月 ==========
  {
    title: "[GESP202509 一级] 商场折扣",
    source: "gesp_official",
    sourceId: "B4409",
    sourceUrl: "https://www.luogu.com.cn/problem/B4409",
    level: 1,
    knowledgePoints: ["条件判断", "浮点数计算"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1189`,
    description: `某商店提供两种优惠方案。方案一：满 $x$ 元减 $y$ 元。方案二：直接打 $n$ 折（即实际支付为原价的 $\\frac{n}{10}$）。其中 $x, y, n$ 均为正整数，且 $1 \\le y < x$，$1 \\le n < 10$。需要注意的是，方案一最多只能使用一次。例如，购物 $33$ 元，若满 $10$ 元减 $3$ 元，则实付 $30$ 元。小明选好了价值 $p$ 元的商品，只能选择其中一种优惠方案，请计算他最少需要支付多少钱。`,
    inputFormat: `输入共 $4$ 行，分别输入正整数 $x, y, n, p$，含义如题面所述。`,
    outputFormat: `输出一行一个小数，表示小明最少需要支付的金额，保留两位小数。`,
    samples: [
      { input: "8\n7\n9\n10", output: "3.00" },
      { input: "8\n7\n2\n11", output: "2.20" },
    ],
    testCases: [
      { input: "8\n7\n9\n10", output: "3.00" },
      { input: "8\n7\n2\n11", output: "2.20" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `**【数据范围】**

对于所有测试点，保证 $1 \\le y < x \\le 100$，$1 \\le n < 10$，$1 \\le p \\le 100$。`,
  },
  {
    title: "[GESP202509 一级] 金字塔",
    source: "gesp_official",
    sourceId: "B4410",
    sourceUrl: "https://www.luogu.com.cn/problem/B4410",
    level: 1,
    knowledgePoints: ["循环语句", "累加"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1189`,
    description: `一座金字塔由 $n$ 层石块构成。从底部向上，各层分别需要 $n \\times n$、$(n-1) \\times (n-1)$、$\\ldots$、$2 \\times 2$、$1 \\times 1$ 块石块。请问总共需要多少块石块？`,
    inputFormat: `输入一行一个正整数 $n$，代表金字塔的层数。`,
    outputFormat: `输出一行一个正整数，表示所需的石块总数。`,
    samples: [
      { input: "2", output: "5" },
      { input: "5", output: "55" },
    ],
    testCases: [
      { input: "2", output: "5" },
      { input: "5", output: "55" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `**【数据范围】**

对于所有测试点，保证 $1 \\le n \\le 50$。`,
  },
  // ========== 2025年12月 ==========
  {
    title: "[GESP202512 一级] 小杨的爱心快递",
    source: "gesp_official",
    sourceId: "B4445",
    sourceUrl: "https://www.luogu.com.cn/problem/B4445",
    level: 1,
    knowledgePoints: ["条件判断", "浮点数计算"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1197`,
    description: `小杨作为志愿者寄送捐赠物品。快递公司提供两种计费方式：按体积计费（$0.5 \\times V$ 元）或按重量计费（重量小于 $300$ 克时为 $M$ 元，大于等于 $300$ 克时为 $N$ 元）。请输出两种方式中较低的费用。`,
    inputFormat: `输入共 $4$ 行浮点数，分别表示快递体积 $V$、重量 $G$、第一档运费 $M$、第二档运费 $N$。`,
    outputFormat: `输出一行一个小数，表示实际快递运费，保留一位小数。`,
    samples: [
      { input: "100.4\n300.2\n60.6\n70.5", output: "50.2" },
      { input: "99.8\n200.9\n60.2\n70.1", output: "49.9" },
    ],
    testCases: [
      { input: "100.4\n300.2\n60.6\n70.5", output: "50.2" },
      { input: "99.8\n200.9\n60.2\n70.1", output: "49.9" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `**【样例解释 #1】**

体积费 $0.5 \\times 100.4 = 50.2$，重量费 $70.5$（$\\ge 300$），输出 $50.2$。

**【样例解释 #2】**

体积费 $0.5 \\times 99.8 = 49.9$，重量费 $60.2$（$< 300$），输出 $49.9$。`,
  },
  {
    title: "[GESP202512 一级] 手机电量显示",
    source: "gesp_official",
    sourceId: "B4446",
    sourceUrl: "https://www.luogu.com.cn/problem/B4446",
    level: 1,
    knowledgePoints: ["条件判断"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1197`,
    description: `某款手机根据电量百分比 $P$ 智能显示电量状态：当 $P \\le 10$ 时显示 \`R\`（临界），当 $10 < P \\le 20$ 时显示 \`L\`（低电量），当 $P > 20$ 时直接显示数字。`,
    inputFormat: `第一行输入整数 $T$，表示测试用例数。接下来 $T$ 行，每行输入一个整数 $P$，表示电量百分比。`,
    outputFormat: `对于每个测试用例，输出一行，表示电量显示：\`R\`、\`L\` 或数值。`,
    samples: [
      { input: "5\n10\n1\n20\n99\n19", output: "R\nR\nL\n99\nL" },
    ],
    testCases: [
      { input: "5\n10\n1\n20\n99\n19", output: "R\nR\nL\n99\nL" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `**【数据范围】**

对于所有测试点，保证 $1 \\le T \\le 20$，$1 \\le P \\le 100$。`,
  },
];

async function seedGesp1() {
  try {
    await prisma.problem.deleteMany({
      where: {
        sourceId: {
          in: gesp1Problems.map(p => p.sourceId).filter(Boolean) as string[]
        }
      }
    });

    const result = await prisma.problem.createMany({
      data: gesp1Problems,
    });

    return NextResponse.json({
      success: true,
      message: `成功导入 ${result.count} 道 GESP 1级题目`,
      count: result.count
    });
  } catch (error) {
    console.error("Seed GESP1 error:", error);
    return NextResponse.json({ error: "添加题目失败", details: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return seedGesp1();
}

export async function POST() {
  return seedGesp1();
}
