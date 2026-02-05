import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GESP 1级完整题库 - 来源：洛谷 CCF GESP C++ 一级上机题
// 官方题单：https://www.luogu.com.cn/training/551
// 共26道题目，内容100%来自洛谷原文

const gesp1Problems = [
  // ========== 2023年3月 ==========
  {
    title: "[GESP202303 一级] 长方形面积",
    source: "gesp_official",
    sourceId: "B3834",
    sourceUrl: "https://www.luogu.com.cn/problem/B3834",
    level: 1,
    knowledgePoints: ["因数", "枚举", "基本运算"],
    difficulty: "入门",
    description: `小明刚刚学习了如何计算长方形面积。他发现，如果一个长方形的长和宽都是整数，它的面积一定也是整数。现在，小明想知道如果给定长方形的面积，有多少种可能的长方形，满足长和宽都是整数？如果两个长方形的长相等、宽也相等，则认为是同一种长方形。约定长方形的长大于等于宽。正方形是长方形的特例，即长方形的长和宽可以相等。`,
    inputFormat: `输入一行，包含一个整数 $A$，表示长方形的面积。约定 $2 \\leq A \\leq 1000$。`,
    outputFormat: `输出一行，包含一个整数 $C$，表示有 $C$ 种可能的长方形。`,
    samples: [
      { input: "4", output: "2" },
      { input: "6", output: "2" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `【样例 1 解释】

有 $2$ 种长方形面积为 $4$，它们的长宽分别为 $2 \\times 2$，$4 \\times 1$。

【样例 2 解释】

有 $2$ 种长方形面积为 $6$，它们的长宽分别为 $3 \\times 2$，$6 \\times 1$。`,
  },
  {
    title: "[GESP202303 一级] 每月天数",
    source: "gesp_official",
    sourceId: "B3835",
    sourceUrl: "https://www.luogu.com.cn/problem/B3835",
    level: 1,
    knowledgePoints: ["分支结构", "闰年判断", "日期处理"],
    difficulty: "入门",
    description: `小明刚刚学习了每月有多少天，以及如何判断平年和闰年，想到可以使用编程方法求出给定的月份有多少天。你能做到吗？`,
    inputFormat: `输入一行，包含两个整数 $A, B$，分别表示一个日期的年、月。约定 $2000 \\leq A \\leq 3000$，$1 \\leq B \\leq 12$。`,
    outputFormat: `输出一行，包含一个整数，表示输入月份有多少天。`,
    samples: [
      { input: "2022 1", output: "31" },
      { input: "2020 2", output: "29" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: ``,
  },
  {
    title: "[GESP202303 一级] 时间规划",
    source: "gesp_official",
    sourceId: "B3838",
    sourceUrl: "https://www.luogu.com.cn/problem/B3838",
    level: 1,
    knowledgePoints: ["时间计算", "基本运算"],
    difficulty: "入门",
    description: `小明在为自己规划学习时间。现在他想知道两个时刻之间有多少分钟，你能通过编程帮他做到吗？`,
    inputFormat: `输入 $4$ 行，第一行为开始时刻的小时，第二行为开始时刻的分钟，第三行为结束时刻的小时，第四行为结束时刻的分钟。输入保证两个时刻是同一天，开始时刻一定在结束时刻之前。时刻使用 $24$ 小时制，即小时在 $0$ 到 $23$ 之间，分钟在 $0$ 到 $59$ 之间。`,
    outputFormat: `输出一行，包含一个整数，从开始时刻到结束时刻之间有多少分钟。`,
    samples: [
      { input: "9\n5\n9\n6", output: "1" },
      { input: "9\n5\n10\n0", output: "55" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: ``,
  },
  {
    title: "[GESP202303 一级] 累计相加",
    source: "gesp_official",
    sourceId: "B3839",
    sourceUrl: "https://www.luogu.com.cn/problem/B3839",
    level: 1,
    knowledgePoints: ["循环", "累加", "数学"],
    difficulty: "入门",
    description: `输入一个正整数 $n$，求形如：

$1+(1+2)+(1+2+3)+(1+2+3+4)+ \\cdots +(1+2+3+4+5+ \\cdots +n)$ 的累计相加。`,
    inputFormat: `输入一个正整数 $n$。约定 $1<n \\le 100$。`,
    outputFormat: `输出累计相加的结果。`,
    samples: [
      { input: "3", output: "10" },
      { input: "4", output: "20" },
      { input: "10", output: "220" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: ``,
  },

  // ========== 2023年6月 ==========
  {
    title: "[GESP202306 一级] 闰年求和",
    source: "gesp_official",
    sourceId: "B3846",
    sourceUrl: "https://www.luogu.com.cn/problem/B3846",
    level: 1,
    knowledgePoints: ["闰年判断", "循环", "数位分离"],
    difficulty: "入门",
    description: `小明刚刚学习了如何判断平年和闰年，他想知道两个年份之间（**不包含起始年份和终止年份**）的闰年年份具体数字之和。你能帮帮他吗？`,
    inputFormat: `输入一行，包含两个整数，分别表示起始年份和终止年份。约定年份在 $1$ 到 $2022$ 之间。`,
    outputFormat: `输出一行，包含一个整数，表示闰年年份具体数字之和。`,
    samples: [
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
    knowledgePoints: ["时间计算", "进制转换"],
    difficulty: "入门",
    description: `小明刚刚学习了小时、分和秒的换算关系。他想知道一个给定的时刻是这一天的第几秒，你能编写一个程序帮帮他吗？`,
    inputFormat: `输入一行，包含三个整数和一个字符。三个整数分别表示时刻的时、分、秒；字符有两种取值，大写字母 \`A\` 表示上午，大写字母 \`P\` 表示下午。`,
    outputFormat: `输出一行，包含一个整数，表示输入时刻是当天的第几秒。`,
    samples: [
      { input: "0 0 0 A", output: "0" },
      { input: "11 59 59 P", output: "86399" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: ``,
  },

  // ========== 2023年9月 ==========
  {
    title: "[GESP202309 一级] 买文具",
    source: "gesp_official",
    sourceId: "B3863",
    sourceUrl: "https://www.luogu.com.cn/problem/B3863",
    level: 1,
    knowledgePoints: ["基本运算", "分支结构"],
    difficulty: "入门",
    description: `开学了，小明来到文具店选购文具。签字笔 $2$ 元一支，他需要 $X$ 支；记事本 $5$ 元一本，他需要 $Y$ 本；直尺 $3$ 元一把，他需要 $Z$ 把。小明手里有 $Q$ 元钱。请你通过编程帮小明算算，他手里的钱是否够买他需要的文具。`,
    inputFormat: `第一行包含一个正整数，是小明购买签字笔的数量。约定 $1 \\le X \\le 10$。

第二行包含一个正整数，是小明购买记事本的数量。约定 $1 \\le Y \\le 10$。

第三行包含一个正整数，是小明购买直尺的数量。约定 $1 \\le Z \\le 10$。

第四行包含一个正整数 $Q$，是小明手里的钱数（单位：元）。`,
    outputFormat: `输出 $2$ 行。如果小明手里的钱够买他需要的文具，则第一行输出 \`Yes\`，第二行输出小明会剩下的钱数（单位：元）；否则，第一行输出 \`No\`，第二行输出小明缺少的钱数（单位：元）。`,
    samples: [
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
    knowledgePoints: ["循环", "条件判断", "取模"],
    difficulty: "入门",
    description: `所有个位数为 $k$ 的正整数，以及所有 $k$ 的倍数，都被小明称为"$k$ 幸运数"。小明想知道正整数 $L$ 和 $R$ 之间（包括 $L$ 和 $R$）所有 $k$ 幸运数的和。`,
    inputFormat: `输入 $3$ 行。第一行包含一个正整数 $k$，第二行包含一个正整数 $L$，第三行包含一个正整数 $R$。约定 $2 \\le k \\le 9$，$1 \\le L \\le R \\le 1000$。`,
    outputFormat: `输出 $1$ 行，符合题意的幸运数之和。`,
    samples: [
      { input: "7\n1\n10", output: "7" },
      { input: "7\n10\n20", output: "31" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `【样例 1 解释】

在 $1$ 到 $10$ 之间，只有 $7$ 是 $7$ 的幸运数（它是 $7$ 的倍数，个位也是 $7$）。

【样例 2 解释】

在 $10$ 到 $20$ 之间，$14$ 是 $7$ 的倍数，$17$ 的个位是 $7$，所以幸运数之和为 $14+17=31$。`,
  },

  // ========== 2023年12月 ==========
  {
    title: "[GESP202312 一级] 小杨的考试",
    source: "gesp_official",
    sourceId: "B3921",
    sourceUrl: "https://www.luogu.com.cn/problem/B3921",
    level: 1,
    knowledgePoints: ["取模", "日期计算"],
    difficulty: "入门",
    description: `今天是星期 $X$，小杨还有 $N$ 天就要考试了，你能推算出小杨考试那天是星期几吗？（本题中使用 $7$ 表示星期日）`,
    inputFormat: `输入 $2$ 行，第一行一个整数 $X(1\\le X \\le 7)$；第二行一个整数 $N(1≤N≤364)$。`,
    outputFormat: `输出一个整数，表示小杨考试那天是星期几。`,
    samples: [
      { input: "1\n6", output: "7" },
      { input: "5\n3", output: "1" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `**样例解释 1**

今天是星期 1，那么 6 天后就是星期日，星期日在本题中用 $7$ 表示。

**样例解释 2**

今天是星期 5，那么 3 天后就是星期 1。`,
  },
  {
    title: "[GESP202312 一级] 小杨报数",
    source: "gesp_official",
    sourceId: "B3922",
    sourceUrl: "https://www.luogu.com.cn/problem/B3922",
    level: 1,
    knowledgePoints: ["循环", "取模", "条件判断"],
    difficulty: "入门",
    description: `小杨需要从 $1$ 到 $N$ 报数。在报数过程中，小杨希望跳过 $M$ 的倍数。例如，如果 $N=5$， $M=2$ ，那么小杨就需要依次报出 $1$、$3$、$5$。 现在，请你依次输出小杨报的数。`,
    inputFormat: `输入 $2$ 行，第一行一个整数 $N（1 \\le N \\le 1,000）$；第二行一个整数 $M（2 \\le M \\le 100）$。`,
    outputFormat: `输出若干行，依次表示小杨报的数。`,
    samples: [
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
    knowledgePoints: ["整除", "取模"],
    difficulty: "入门",
    description: `小杨同学积攒了一部分零用钱想要用来购买书籍，已知一本书的单价是 $13$ 元，请根据小杨零用钱的金额，编写程序计算可以购买多少本书，还剩多少零用钱。`,
    inputFormat: `输入一个正整数 $m$，表示小杨拥有的零用钱数。`,
    outputFormat: `输出包含两行，第一行，购买图书的本数；第二行，剩余的零用钱数。`,
    samples: [
      { input: "100", output: "7\n9" },
      { input: "199", output: "15\n4" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `### 数据规模与约定

对全部的测试数据，保证 $0 < m < 200$。`,
  },
  {
    title: "[GESP202403 一级] 找因数",
    source: "gesp_official",
    sourceId: "B3953",
    sourceUrl: "https://www.luogu.com.cn/problem/B3953",
    level: 1,
    knowledgePoints: ["因数", "循环", "取模"],
    difficulty: "入门",
    description: `小 A 最近刚刚学习了因数的概念，具体来说，如果一个正整数 $a$ 可以被另一个正整数 $b$ 整除，那么我们就说 $b$ 是 $a$ 的因数。请你帮忙写一个程序，从小到大输出正整数 $a$ 的所有因数。`,
    inputFormat: `输入一行一个正整数 $a$。保证 $a\\leq1000$。`,
    outputFormat: `输出若干行，为 $a$ 的所有约数，从小到大排序。`,
    samples: [
      { input: "1", output: "1" },
      { input: "6", output: "1\n2\n3\n6" },
      { input: "10", output: "1\n2\n5\n10" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: ``,
  },

  // ========== 2024年6月 ==========
  {
    title: "[GESP202406 一级] 休息时间",
    source: "gesp_official",
    sourceId: "B4000",
    sourceUrl: "https://www.luogu.com.cn/problem/B4000",
    level: 1,
    knowledgePoints: ["时间计算", "进位"],
    difficulty: "入门",
    description: `小杨计划在某个时刻开始学习，并决定在学习 $k$ 秒后开始休息。小杨想知道自己开始休息的时刻是多少。`,
    inputFormat: `前三行每行包含一个整数，分别表示小杨开始学习时刻的时 $h$、分 $m$、秒 $s$（$h,m, s$ 的值符合 $1 \\le h \\le 12,0 \\le m\\le 59,0 \\le s\\le59$）。第四行包含一个整数 $k$，表示小杨学习的总秒数（注：$k$ 的值符合 $1 \\le k \\le 3600$）。`,
    outputFormat: `输出一行，包含三个整数，分别表示小杨开始休息时刻的时、分、秒。`,
    samples: [
      { input: "12\n59\n59\n10", output: "13 0 9" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `小杨在时刻 12:59:59 开始学习，学习 10 秒后开始休息，即在 13:0:9 时刻开始休息。

对于全部数据，保证有 $1 \\le h \\le 12$，$0 \\le m\\le 59$，$0 \\le s\\le 59$，$1 \\le k \\le 3600$。`,
  },
  {
    title: "[GESP202406 一级] 立方数",
    source: "gesp_official",
    sourceId: "B4001",
    sourceUrl: "https://www.luogu.com.cn/problem/B4001",
    level: 1,
    knowledgePoints: ["完全立方数", "循环"],
    difficulty: "入门",
    description: `小杨有一个正整数 $n$，他想知道 $n$ 是否是一个立方数。一个正整数 $n$ 是立方数当且仅当存在一个正整数 $x$ 满足 $x\\times x\\times x=n$ 。`,
    inputFormat: `第一行包含一个正整数 $n$。`,
    outputFormat: `如果正整数 $n$ 是一个立方数，输出 \`Yes\`，否则输出 \`No\`。`,
    samples: [
      { input: "8", output: "Yes" },
      { input: "9", output: "No" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于样例 1，存在正整数 $2$ 使得 $8=2\\times 2\\times 2$ ，因此 $8$ 为立方数。

对于样例 $2$，不存在满足条件的正整数，因此 $9$ 不为立方数。

对于全部数据，保证有 $1 \\le n \\le 1000$。`,
  },

  // ========== 2024年9月 ==========
  {
    title: "[GESP202409 一级] 小杨购物",
    source: "gesp_official",
    sourceId: "B4034",
    sourceUrl: "https://www.luogu.com.cn/problem/B4034",
    level: 1,
    knowledgePoints: ["整除", "基本运算"],
    difficulty: "入门",
    description: `小杨有 $n$ 元钱用于购物。商品 A 的单价是 $a$ 元，商品 B 的单价是 $b$ 元。小杨想购买**相同数量**的商品 A 和商品 B。请你编写程序帮助小杨计算出他最多能够购买多少个商品 A 和商品 B。`,
    inputFormat: `第一行包含一个正整数 $n$，代表小杨用于购物的金额。第二行包含一个正整数 $a$，代表商品 A 的单价。第三行包含一个正整数 $b$，代表商品 B 的单价。`,
    outputFormat: `输出一行，包含一个整数，代表小杨最多能够购买的商品 A 和商品 B 的数量。`,
    samples: [
      { input: "12\n1\n2", output: "4" },
      { input: "13\n1\n2", output: "4" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `**样例解释 1**

买 4 个 A 和 4 个 B，花费 $1 \\times 4 + 2 \\times 4 = 12$ 元。

**样例解释 2**

买 4 个 A 和 4 个 B 花费 12 元；买 5 个 A 和 5 个 B 需要 15 元，超出预算。

对全部的测试数据，保证 $1 \\le n, a, b \\le 10^5$。`,
  },
  {
    title: "[GESP202409 一级] 美丽数字",
    source: "gesp_official",
    sourceId: "B4035",
    sourceUrl: "https://www.luogu.com.cn/problem/B4035",
    level: 1,
    knowledgePoints: ["取模", "条件判断", "循环"],
    difficulty: "入门",
    description: `小杨有 $n$ 个正整数，他认为一个正整数是美丽数字当且仅当该正整数是 $9$ 的倍数但不是 $8$ 的倍数。小杨想请你编写一个程序计算 $n$ 个正整数中美丽数字的数量。`,
    inputFormat: `第一行包含一个整数 $n$，代表正整数个数。第二行有 $n$ 个正整数 $a_1, a_2, \\dots a_n$。`,
    outputFormat: `输出一个整数，表示其中美丽数字的数量。`,
    samples: [
      { input: "3\n1 9 72", output: "1" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `**样例解释**

- 1：既不是 9 的倍数也不是 8 的倍数
- 9：是 9 的倍数，不是 8 的倍数 ✓（美丽数字）
- 72：既是 9 的倍数也是 8 的倍数（不是美丽数字）

对全部的测试数据，保证 $1 \\leq n, a_i \\leq 10^5$。`,
  },

  // ========== 2024年12月 ==========
  {
    title: "[GESP202412 一级] 温度转换",
    source: "gesp_official",
    sourceId: "B4062",
    sourceUrl: "https://www.luogu.com.cn/problem/B4062",
    level: 1,
    knowledgePoints: ["浮点运算", "分支结构", "公式计算"],
    difficulty: "入门",
    description: `小杨最近学习了开尔文温度、摄氏温度和华氏温度的转换。令符号 $K$ 表开尔文温度，符号 $C$ 表摄氏温度，符号 $F$ 表华氏温度，这三者的转换公式如下：

$$ C=K-273.15$$
$$ F=C\\times 1.8+32 $$

现在小杨想编写一个程序计算某一开尔文温度对应的摄氏温度和华氏温度，你能帮帮他吗?`,
    inputFormat: `一行，一个实数 $K$，表示开尔文温度。`,
    outputFormat: `一行，若输入开尔文温度对应的华氏温度高于 $212$，输出 \`Temperature is too high!\`；否则，输出两个由空格分隔的实数 $C$ 和 $F$，分别表示摄氏温度和华氏度，保留两位小数。`,
    samples: [
      { input: "412.00", output: "Temperature is too high!" },
      { input: "173.56", output: "-99.59 -147.26" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `$0<K<10^5$`,
  },
  {
    title: "[GESP202412 一级] 奇数和偶数",
    source: "gesp_official",
    sourceId: "B4063",
    sourceUrl: "https://www.luogu.com.cn/problem/B4063",
    level: 1,
    knowledgePoints: ["奇偶判断", "计数", "循环"],
    difficulty: "入门",
    description: `小杨有 $n$ 个正整数，他想知道其中的奇数有多少个，偶数有多少个。`,
    inputFormat: `第一行包含一个正整数 $n$，代表正整数个数。之后 $n$ 行，每行包含一个正整数。`,
    outputFormat: `输出两个正整数（英文空格间隔），代表奇数的个数和偶数的个数。如奇数或偶数的个数为 $0$，则对应输出 $0$。`,
    samples: [
      { input: "5\n1\n2\n3\n4\n5", output: "3 2" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于全部数据，保证有 $1\\leq n\\leq 10^5$ 且正整数不超过 $10^5$。`,
  },

  // ========== 2025年3月 ==========
  {
    title: "[GESP202503 一级] 图书馆里的老鼠",
    source: "gesp_official",
    sourceId: "B4257",
    sourceUrl: "https://www.luogu.com.cn/problem/B4257",
    level: 1,
    knowledgePoints: ["整除", "基本运算"],
    difficulty: "入门",
    description: `图书馆里有 $n$ 本书，不幸的是，还混入了一只老鼠，老鼠每 $x$ 小时能啃光一本书，假设老鼠在啃光一本书之前，不会啃另一本。请问 $y$ 小时后图书馆里还剩下多少本完整的书。`,
    inputFormat: `三行，第一行一个正整数 $n$，表示图书馆里书的数量；第二行，一个正整数 $x$，表示老鼠啃光一本书需要的时间；第三行，一个正整数 $y$，表示经过的总时间；输入数据保证 $y$ 小时后至少会剩下一本完整的书。`,
    outputFormat: `一行，一个整数，表示 $y$ 小时后图书馆里还剩下多少本完整的书。`,
    samples: [
      { input: "10\n2\n3", output: "8" },
      { input: "5\n2\n4", output: "3" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于所有测试点，保证 $1\\leq n,x,y\\leq 1000$，保证 $y$ 小时后至少会剩下一本完整的书。`,
  },
  {
    title: "[GESP202503 一级] 四舍五入",
    source: "gesp_official",
    sourceId: "B4258",
    sourceUrl: "https://www.luogu.com.cn/problem/B4258",
    level: 1,
    knowledgePoints: ["四舍五入", "数学"],
    difficulty: "入门",
    description: `四舍五入是一种常见的近似计算方法。现在，给定 $n$ 个整数，你需要将每个整数四舍五入到最接近的整十数。例如，$43$ 四舍五入后为 $40$，$58$ 四舍五入后为 $60$。`,
    inputFormat: `共 $n+1$ 行，第一行，一个整数 $n$，表示接下来输入的整数个数。接下来 $n$ 行，每行一个整数 $a_1, \\cdots, a_n$，表示需要四舍五入的整数。`,
    outputFormat: `$n$ 行，每行一个整数，表示每个整数四舍五入后的结果。`,
    samples: [
      { input: "5\n43\n58\n25\n67\n90", output: "40\n60\n30\n70\n90" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于所有测试点，保证 $1\\leq n\\leq 100$，$1\\leq a_i\\leq 10000$。`,
  },

  // ========== 2025年6月 ==========
  {
    title: "[GESP202506 一级] 假期阅读",
    source: "gesp_official",
    sourceId: "B4354",
    sourceUrl: "https://www.luogu.com.cn/problem/B4354",
    level: 1,
    knowledgePoints: ["取最小值", "基本运算"],
    difficulty: "入门",
    description: `小 A 有一本厚厚的书。这本书总共有 $n$ 页，小 A 一天中最多只能阅读完其中的 $k$ 页。小 A 的假期总共有 $t$ 天，他想知道在假期中最多能阅读完这本书的多少页。`,
    inputFormat: `第一行，一个正整数 $n$，表示书的页数。 第二行，一个正整数 $k$，表示小 A 每天最多阅读的页数。 第三行，一个正整数 $t$，表示小 A 假期的天数。`,
    outputFormat: `一行，一个整数，表示假期中所能阅读的最多页数。`,
    samples: [
      { input: "8\n3\n2", output: "6" },
      { input: "19\n3\n30", output: "19" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于所有测试点，保证 $n,k,t$ 均不超过 $1000$。`,
  },
  {
    title: "[GESP202506 一级] 值日",
    source: "gesp_official",
    sourceId: "B4355",
    sourceUrl: "https://www.luogu.com.cn/problem/B4355",
    level: 1,
    knowledgePoints: ["最小公倍数", "数学"],
    difficulty: "入门",
    description: `小杨和小红是值日生，负责打扫教室。小杨每 $m$ 天值日一次，小红每 $n$ 天值日一次。今天他们两个一起值日，请问至少多少天后，他们会再次同一天值日？`,
    inputFormat: `第一行，一个正整数 $m$，表示小杨的值日周期；第二行，一个正整数 $n$，表示小红的值日周期。`,
    outputFormat: `一行，一个整数，表示至少多少天后他们会再次同一天值日。`,
    samples: [
      { input: "4\n6", output: "12" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于所有测试点，保证 $1 \\leq m, n \\leq 100$。`,
  },

  // ========== 2025年9月 ==========
  {
    title: "[GESP202509 一级] 商店折扣",
    source: "gesp_official",
    sourceId: "B4409",
    sourceUrl: "https://www.luogu.com.cn/problem/B4409",
    level: 1,
    knowledgePoints: ["分支结构", "比较", "浮点运算"],
    difficulty: "入门",
    description: `商店正在开展促销活动，给出了两种方案的折扣优惠。第一种方案是购物满 $x$ 元减 $y$ 元；第二种方案是直接打 $n$ 折，也就是说价格变为原先的 $n\\div 10$。这里的 $x, y, n$ 均是正整数，并且 $1 \\leq y < x$，$1 \\leq n < 10$。`,
    inputFormat: `四行，四个正整数 $x, y, n, p$，含义见题目描述。`,
    outputFormat: `一行，一个小数，表示小明最少需要支付多少钱，保留两位小数。`,
    samples: [
      { input: "8\n7\n9\n10", output: "3.00" },
      { input: "8\n7\n2\n11", output: "2.20" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于所有测试点，保证 $1 \\leq y < x \\leq 100$，$1 \\leq n < 10$，$1 \\leq p \\leq 100$。`,
  },
  {
    title: "[GESP202509 一级] 金字塔",
    source: "gesp_official",
    sourceId: "B4410",
    sourceUrl: "https://www.luogu.com.cn/problem/B4410",
    level: 1,
    knowledgePoints: ["循环", "累加", "平方数"],
    difficulty: "入门",
    description: `金字塔由 $n$ 层石块垒成。从塔底向上，每层依次需要 $n \\times n, (n-1) \\times (n-1), \\cdots, 2 \\times 2, 1 \\times 1$ 块石块。请问搭建金字塔总共需要多少块石块？`,
    inputFormat: `一行，一个正整数 $n$，表示金字塔的层数。`,
    outputFormat: `一行，一个正整数，表示搭建金字塔所需的石块数量。`,
    samples: [
      { input: "2", output: "5" },
      { input: "5", output: "55" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于所有测试点，保证 $1 \\leq n \\leq 50$。`,
  },

  // ========== 2025年12月 ==========
  {
    title: "[GESP202512 一级] 小杨的爱心快递",
    source: "gesp_official",
    sourceId: "B4445",
    sourceUrl: "https://www.luogu.com.cn/problem/B4445",
    level: 1,
    knowledgePoints: ["分支结构", "比较", "浮点运算"],
    difficulty: "入门",
    description: `小杨是"爱心社区"的小志愿者，每周他都会帮助邻居们寄送捐赠给山区小学的文具和书籍。快递公司为了支持公益行动，制定了特殊的运费规则，鼓励大家合理包装：假设快递的体积为 $V$，重量为 $G$。按体积计算：运费按体积计算，公式是 $0.5 \\times V$ 元。按重量计算：为了鼓励减轻包裹重量，规则是：当重量小于 300 克，即 $G < 300$ 时，运费为 $M$ 元；当重量达到或超过 300 克，即 $G \\geq 300$ 时，运费为 $N$ 元。所以，最终的运费会取按体积计算和按重量计算这两种方式中**价格较低**的那一个，这样对寄件人最公道。`,
    inputFormat: `四行，每行一个一位小数的浮点数，分别代表，快递的体积 $V$，快递的重量 $G$，第一档重量运费 $M$，第二档重量运费 $N$。`,
    outputFormat: `一行一个一位小数，代表实际快递运费。`,
    samples: [
      { input: "100.4\n300.2\n60.6\n70.5", output: "50.2" },
      { input: "99.8\n200.9\n60.2\n70.1", output: "49.9" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `所有输入数据均为不超过 1000 的正数。`,
  },
  {
    title: "[GESP202512 一级] 手机电量显示",
    source: "gesp_official",
    sourceId: "B4446",
    sourceUrl: "https://www.luogu.com.cn/problem/B4446",
    level: 1,
    knowledgePoints: ["分支结构", "条件判断"],
    difficulty: "入门",
    description: `小杨的手机就像一个聪明的小助手，当电量变化时，它会用不同的方式来提醒我们，假设当前的电量百分比为 $P$：

- 当电量非常低（不超过 10，即 $P \\leq 10$），它会显示一个大写字母 R，就像在说："快给我充电吧！（Red 警告色）"
- 当电量有点低（超过 10 但不超过 20，即 $10 < P \\leq 20$），它会显示一个大写字母 L，意思是"电量有点 Low 啦！"
- 当电量比较充足（超过 20，即 $P > 20$），它就会直接显示具体的数字，比如直接显示 50，表示还有 50 的电量。`,
    inputFormat: `第一行一个正整数 $T$，代表数据组数。对于每组数据，一行包含一个正整数 $P$，代表手机电量百分比。`,
    outputFormat: `对于每组数据，输出一行，代表当前手机显示的电量信息。`,
    samples: [
      { input: "5\n10\n1\n20\n99\n19", output: "R\nR\nL\n99\nL" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于所有测试点，保证 $1 \\leq T \\leq 20$，$1 \\leq P \\leq 100$。`,
  },
];

async function seedGesp1() {
  try {
    // 删除现有的GESP1题目，重新导入
    await prisma.problem.deleteMany({
      where: {
        sourceId: {
          in: gesp1Problems.map(p => p.sourceId).filter(Boolean) as string[]
        }
      }
    });

    // 添加所有题目（testCases 复用 samples）
    const problemsWithTestCases = gesp1Problems.map(p => ({
      ...p,
      testCases: p.samples,
    }));

    const result = await prisma.problem.createMany({
      data: problemsWithTestCases,
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
