import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GESP 2级完整题库 - 来源：洛谷 CCF GESP C++ 二级上机题
// 官方题单：https://www.luogu.com.cn/training/552
// 所有内容与洛谷100%一致

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
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1102`,
    description: `输入一个正整数 $n$，要求输出一个 $n$ 行 $n$ 列的正方形图案（参考样例输入输出）。图案由大写字母组成。

其中，第 $1$ 行以大写字母 $\\texttt A$ 开头，第 $2$ 行以大写字母 $\\texttt B$ 开头，以此类推；在每行中，第 $2$ 列为第 $1$ 列的下一个字母，第 $3$ 列为第 $2$ 列的下一个字母，以此类推；特别的，规定大写字母 $\\texttt Z$ 的下一个字母为大写字母 $\\texttt A$。`,
    inputFormat: `输入一行，包含一个正整数 $n$。约定 $2 \\le n \\le 40$。`,
    outputFormat: `输出符合要求的正方形图案。`,
    samples: [
      { input: "3", output: "ABC\nBCD\nCDE" },
      { input: "5", output: "ABCDE\nBCDEF\nCDEFG\nDEFGH\nEFGHI" },
    ],
    testCases: [
      { input: "3", output: "ABC\nBCD\nCDE" },
      { input: "5", output: "ABCDE\nBCDEF\nCDEFG\nDEFGH\nEFGHI" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: ``,
  },
  {
    title: "[GESP样题 二级] 勾股数",
    source: "gesp_official",
    sourceId: "B3845",
    sourceUrl: "https://www.luogu.com.cn/problem/B3845",
    level: 2,
    knowledgePoints: ["循环嵌套", "枚举", "数学"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1102`,
    description: `勾股数是很有趣的数学概念。如果三个正整数 $a,b,c$，满足 $a^2+b^2=c^2$，而且 $1 \\le a \\le b \\le c$，我们就将 $a, b, c$ 组成的三元组 $(a,b,c)$ 称为勾股数。你能通过编程，数数有多少组勾股数，能够满足 $c \\le n$ 吗？`,
    inputFormat: `输入一行，包含一个正整数 $n$。约定 $1 \\le n \\le 1000$。`,
    outputFormat: `输出一行，包含一个整数 $C$，表示有 $C$ 组满足条件的勾股数。`,
    samples: [
      { input: "5", output: "1" },
      { input: "13", output: "3" },
    ],
    testCases: [
      { input: "5", output: "1" },
      { input: "13", output: "3" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `【样例解释 1】满足 $c \\leq 5$ 的勾股数只有 $(3,4,5)$ 一组。

【样例解释 2】满足 $c \\le 13$ 的勾股数有 $3$ 组，即 $(3,4,5)$、$(6,8,10)$ 和 $(5,12,13)$。`,
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
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1122`,
    description: `"百鸡问题"是出自我国古代《张丘建算经》的著名数学问题。大意为：

> "每只公鸡 $5$ 元，每只母鸡 $3$ 元，每 $3$ 只小鸡 $1$ 元；现在有 $100$ 元，买了 $100$ 只鸡，共有多少种方案？"

小明很喜欢这个故事，他决定对这个问题进行扩展，并使用编程解决：如果每只公鸡 $x$ 元，每只母鸡 $y$ 元，每 $z$ 只小鸡 $1$ 元；现在有 $n$ 元，买了 $m$ 只鸡，共有多少种方案？`,
    inputFormat: `输入一行，包含五个整数，分别为问题描述中的 $x$，$y$，$z$，$n$，$m$。约定 $1 \\le x,y,z \\le 10$，$1 \\le n,m \\le 1000$。`,
    outputFormat: `输出一行，包含一个整数 $C$，表示有 $C$ 种方案。`,
    samples: [
      { input: "5 3 3 100 100", output: "4" },
      { input: "1 1 1 100 100", output: "5151" },
    ],
    testCases: [
      { input: "5 3 3 100 100", output: "4" },
      { input: "1 1 1 100 100", output: "5151" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `【样例 1 解释】

这就是问题描述中的"百鸡问题"。$4$ 种方案分别为：
- 公鸡 $0$ 只、母鸡 $25$ 只、小鸡 $75$ 只。
- 公鸡 $4$ 只、母鸡 $18$ 只、小鸡 $78$ 只。
- 公鸡 $8$ 只、母鸡 $11$ 只、小鸡 $81$ 只。
- 公鸡 $12$ 只、母鸡 $4$ 只、小鸡 $84$ 只。`,
  },
  {
    title: "[GESP202303 二级] 画三角形",
    source: "gesp_official",
    sourceId: "B3837",
    sourceUrl: "https://www.luogu.com.cn/problem/B3837",
    level: 2,
    knowledgePoints: ["循环嵌套", "字符输出", "三角形图案"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1122`,
    description: `输入一个正整数 $n$，请使用大写字母拼成一个这样的三角形图案（参考样例输入输出）：三角形图案的第 $1$ 行有 $1$ 个字母，第 $2$ 行有 $2$ 个字母，以此类推；在三角形图案中，由上至下、由左至右依次由大写字母 $\\texttt{A}-\\texttt{Z}$ 填充，每次使用大写字母 $\\texttt Z$ 填充后，将从头使用大写字母 $\\texttt A$ 填充。`,
    inputFormat: `输入一行，包含一个正整数 $n$。约定 $2 \\le n \\le 40$。`,
    outputFormat: `输出符合要求的三角形图案。注意每行三角形图案的右侧不要有多余的空格。`,
    samples: [
      { input: "3", output: "A\nBC\nDEF" },
      { input: "7", output: "A\nBC\nDEF\nGHIJ\nKLMNO\nPQRSTU\nVWXYZAB" },
    ],
    testCases: [
      { input: "3", output: "A\nBC\nDEF" },
      { input: "7", output: "A\nBC\nDEF\nGHIJ\nKLMNO\nPQRSTU\nVWXYZAB" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: ``,
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
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1124`,
    description: `小明刚刚学习了素数的概念：如果一个大于 $1$ 的正整数，除了 $1$ 和它自身外，不能被其他正整数整除，则这个正整数是素数。现在，小明想找到两个正整数 $A$ 和 $B$ 之间（包括 $A$ 和 $B$）有多少个素数。`,
    inputFormat: `输入只有一行两个正整数 $A, B$。约定 $2 \\le A \\le B \\le 1000$。`,
    outputFormat: `输出一行，包含一个整数 $C$，表示找到 $C$ 个素数。`,
    samples: [
      { input: "2 10", output: "4" },
      { input: "98 100", output: "0" },
    ],
    testCases: [
      { input: "2 10", output: "4" },
      { input: "98 100", output: "0" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `在 $2$ 和 $10$ 之间有 $4$ 个素数，分别为：$2$、$3$、$5$、$7$。`,
  },
  {
    title: "[GESP202306 二级] 自幂数判断",
    source: "gesp_official",
    sourceId: "B3841",
    sourceUrl: "https://www.luogu.com.cn/problem/B3841",
    level: 2,
    knowledgePoints: ["循环", "数位分离", "幂运算"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1124`,
    description: `自幂数是指，一个 $N$ 位数，满足各位数字 $N$ 次方之和是本身。例如，$153$ 是 $3$ 位数，其每位数的 $3$ 次方之和，$1^3+5^3+3^3=153$，因此 $153$ 是自幂数；$1634$ 是 $4$ 位数，其每位数的 $4$ 次方之和，$1^4+6^4+3^4+4^4=1634$，因此 $1634$ 是自幂数。现在，输入若干个正整数，请判断它们是否是自幂数。`,
    inputFormat: `输入第一行是一个正整数 $M$，表示有 $M$ 个待判断的正整数。约定 $1 \\le M \\le 100$。

从第 $2$ 行开始的 $M$ 行，每行一个待判断的正整数。约定这些正整数均小于 $10^8$。`,
    outputFormat: `输出 $M$ 行，如果对应的待判断正整数为自幂数，则输出英文大写字母 $\\texttt{T}$，否则输出英文大写字母 $\\texttt{F}$。

提示：可以输入一个数就判断一个数并输出，再输入下一个数。`,
    samples: [
      { input: "3\n152\n111\n153", output: "F\nF\nT" },
      { input: "5\n8208\n548834\n88593477\n12345\n5432", output: "T\nT\nT\nF\nF" },
    ],
    testCases: [
      { input: "3\n152\n111\n153", output: "F\nF\nT" },
      { input: "5\n8208\n548834\n88593477\n12345\n5432", output: "T\nT\nT\nF\nF" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: ``,
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
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1128`,
    description: `小杨想要构造一个 $N \\times N$ 的 X 字矩阵（$N$ 为奇数），这个矩阵的两条对角线都是半角加号 \`+\` ，其余都是半角减号 \`-\` 。例如，一个 $5 \\times 5$ 的 X 字矩阵如下：

\`\`\`plain
+---+
-+-+-
--+--
-+-+-
+---+
\`\`\`

请你帮小杨根据给定的 $N$ 打印出对应的"X 字矩阵"。`,
    inputFormat: `一行一个整数 $N$ （$5 \\le N \\le 49$，保证为奇数）。`,
    outputFormat: `输出对应的"X 字矩阵"。请严格按格式要求输出，不要擅自添加任何空格、标点、空行等任何符号。恰好输出 $N$ 行，每行除换行符外恰好包含 $N$ 个字符，这些字符要么是 \`+\`，要么是 \`-\`。`,
    samples: [
      { input: "5", output: "+---+\n-+-+-\n--+--\n-+-+-\n+---+" },
      { input: "7", output: "+-----+\n-+---+-\n--+-+--\n---+---\n--+-+--\n-+---+-\n+-----+" },
    ],
    testCases: [
      { input: "5", output: "+---+\n-+-+-\n--+--\n-+-+-\n+---+" },
      { input: "7", output: "+-----+\n-+---+-\n--+-+--\n---+---\n--+-+--\n-+---+-\n+-----+" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `在常规程序中，输入、输出时提供提示是好习惯。但在本场考试中，由于系统限定，请不要在输入、输出中附带任何提示信息。`,
  },
  {
    title: "[GESP202309 二级] 数字黑洞",
    source: "gesp_official",
    sourceId: "B3866",
    sourceUrl: "https://www.luogu.com.cn/problem/B3866",
    level: 2,
    knowledgePoints: ["循环", "数位操作", "排序"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1128`,
    description: `给定一个三位数，要求各位不能相同。将三个数字重新排列，得到最大的数减去最小的数，形成新的三位数。重复此过程，最终一定会得到 $495$。

例如 $352$：最大数 $532$ 减最小数 $235$ 得 $297$；$297$ 变换得 $972-279=693$；$693$ 变换得 $963-369=594$；$594$ 变换得 $954-459=495$。经过 $4$ 次变换得到 $495$。`,
    inputFormat: `输入一行，包含一个符合要求的三位数 $N$。`,
    outputFormat: `输出一行，包含一个整数 $C$，表示经过 $C$ 次变换得到 $495$。`,
    samples: [
      { input: "352", output: "4" },
    ],
    testCases: [
      { input: "352", output: "4" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: ``,
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
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1134`,
    description: `为了准备考试，小杨每天都要做题。第 $1$ 天，小杨做了 $a$ 道题；第 $2$ 天，小杨做了 $b$ 道题；从第 $3$ 天起，小杨每天做的题目数量是前两天的总和。

此外，小杨还规定，当自己某一天做了大于或等于 $m$ 题时，接下来的所有日子里，他就再也不做题了。

请问，到了第 $N$ 天，小杨总共做了多少题呢？`,
    inputFormat: `总共 $4$ 行。第一行一个整数 $a$，第二行一个整数 $b$，第三行一个整数 $m$，第四行一个整数 $N$。

保证 $0 \\le a,b \\le 10$；$a,b < m < 1,000,000$；$3 \\le N \\le 364$。`,
    outputFormat: `一行一个整数，表示小杨 $N$ 天里总共做了多少题目。`,
    samples: [
      { input: "1\n2\n10\n5", output: "19" },
      { input: "1\n1\n5\n8", output: "12" },
    ],
    testCases: [
      { input: "1\n2\n10\n5", output: "19" },
      { input: "1\n1\n5\n8", output: "12" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `**样例解释 1**

小杨第一天做 $1$ 题，第二天做 $2$ 题，第三天做 $1+2=3$ 题，第四天做 $2+3=5$ 题，第五天做 $3+5=8$ 题。因此他总共做了 $1+2+3+5+8=19$ 题。

**样例解释 2**

小杨前 $5$ 天分别做了 $1,1,2,3,5$ 题，由于第 $5$ 天小杨做了 $5$ 题，而 $m=5$，于是小杨从此以后不再做题。因此小杨总共做了 $1+1+2+3+5=12$ 题。`,
  },
  {
    title: "[GESP202312 二级] 小杨的 H 字矩阵",
    source: "gesp_official",
    sourceId: "B3924",
    sourceUrl: "https://www.luogu.com.cn/problem/B3924",
    level: 2,
    knowledgePoints: ["循环嵌套", "矩阵输出", "字符图案"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1134`,
    description: `小杨想要构造一个 $N \\times N$ 的 H 字矩阵（$N$ 为奇数）。矩阵共有 $N$ 行，每行 $N$ 个字符。最左列、最右列都是 \`|\`，中间一行（第 $\\frac{N+1}{2}$ 行）的第 $2 \\sim N-1$ 个字符都是 \`-\`，其余所有字符都是 \`a\`。

例如 $N=5$ 的 H 字矩阵：
\`\`\`
|aaa|
|aaa|
|---|
|aaa|
|aaa|
\`\`\``,
    inputFormat: `一行一个整数 $N$（$5 \\le N \\le 49$，保证 $N$ 为奇数）。`,
    outputFormat: `输出对应的「H 字矩阵」。严格按格式要求输出，恰好输出 $N$ 行，每行除换行符外恰好包含 $N$ 个字符，这些字符要么是 \`-\`，要么是 \`|\`，要么是 \`a\`。`,
    samples: [
      { input: "5", output: "|aaa|\n|aaa|\n|---|\n|aaa|\n|aaa|" },
      { input: "7", output: "|aaaaa|\n|aaaaa|\n|aaaaa|\n|-----|\n|aaaaa|\n|aaaaa|\n|aaaaa|" },
    ],
    testCases: [
      { input: "5", output: "|aaa|\n|aaa|\n|---|\n|aaa|\n|aaa|" },
      { input: "7", output: "|aaaaa|\n|aaaaa|\n|aaaaa|\n|-----|\n|aaaaa|\n|aaaaa|\n|aaaaa|" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `感谢 @Present_Coming_Time 提供的数据。`,
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
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1142`,
    description: `小 A 最初刚刚学习了乘法，为了帮助他练习，我们给他若干个正整数，并要求他将这些数乘起来。对于大部分题目，小 A 可以精确地算出答案，不过，若这些数的乘积超过 $10^6$，小 A 就不会做了。请你写一个程序，告诉我们小 A 会如何作答。`,
    inputFormat: `第一行一个整数 $n$，表示正整数的个数。接下来 $n$ 行，每行一个整数 $a$。小 A 需要将所有的 $a$ 乘起来。`,
    outputFormat: `输出一行，如果乘积超过 $10^6$，则输出 \`>1000000\`；否则输出所有数的乘积。`,
    samples: [
      { input: "2\n3\n5", output: "15" },
      { input: "3\n100\n100\n100", output: "1000000" },
      { input: "4\n100\n100\n100\n2", output: ">1000000" },
    ],
    testCases: [
      { input: "2\n3\n5", output: "15" },
      { input: "3\n100\n100\n100", output: "1000000" },
      { input: "4\n100\n100\n100\n2", output: ">1000000" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对全部的测试数据，保证 $1 \\leq n \\leq 50$，$1 \\leq a \\leq 100$。`,
  },
  {
    title: "[GESP202403 二级] 小杨的日字矩阵",
    source: "gesp_official",
    sourceId: "B3955",
    sourceUrl: "https://www.luogu.com.cn/problem/B3955",
    level: 2,
    knowledgePoints: ["循环嵌套", "矩阵输出", "字符图案"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1142`,
    description: `小杨想要构造一个 $N\\times N$ 的日字矩阵（$N$ 为奇数）。矩阵共有 $N$ 行，每行 $N$ 个字符。最左列、最右列都是 \`|\`；第一行、最后一行、以及中间一行（第 $\\frac{N+1}{2}$ 行）的第 $2\\sim N-1$ 个字符都是 \`-\`；其余所有字符都是 \`x\`。`,
    inputFormat: `一行一个整数 $N$（$5\\leq N \\leq 49$，保证 $N$ 为奇数）。`,
    outputFormat: `输出对应的日字矩阵。严格按格式要求，输出恰好 $N$ 行，每行恰好 $N$ 个字符（\`-\`、\`|\` 或 \`x\`），无额外符号。`,
    samples: [
      { input: "5", output: "|---|\n|xxx|\n|---|\n|xxx|\n|---|" },
      { input: "7", output: "|-----|\n|xxxxx|\n|xxxxx|\n|-----|\n|xxxxx|\n|xxxxx|\n|-----|" },
    ],
    testCases: [
      { input: "5", output: "|---|\n|xxx|\n|---|\n|xxx|\n|---|" },
      { input: "7", output: "|-----|\n|xxxxx|\n|xxxxx|\n|-----|\n|xxxxx|\n|xxxxx|\n|-----|" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: ``,
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
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1150`,
    description: `小杨有 $n$ 个正整数 $a_1,a_2,\\dots,a_n$，他想知道对于所有的 $i (1\\le i\\le n)$，是否存在两个正整数 $x$ 和 $y$ 满足 $x\\times x+y \\times y=a_i$。`,
    inputFormat: `第一行包含一个正整数 $n$，代表正整数数量。
之后 $n$ 行，每行包含一个正整数，代表 $a_i$。`,
    outputFormat: `对于每个正整数 $a_i$，如果存在两个正整数 $x$ 和 $y$ 满足 $x\\times x+y \\times y=a_i$，输出 \`Yes\`，否则输出 \`No\`。`,
    samples: [
      { input: "2\n5\n4", output: "Yes\nNo" },
    ],
    testCases: [
      { input: "2\n5\n4", output: "Yes\nNo" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于第一个正整数，存在 $1\\times 1+2 \\times 2=5$，因此答案为 \`Yes\`。

对于全部数据，保证有 $1 \\le n \\le 10,1 \\le a_i \\le 10^6$。`,
  },
  {
    title: "[GESP202406 二级] 计数",
    source: "gesp_official",
    sourceId: "B4007",
    sourceUrl: "https://www.luogu.com.cn/problem/B4007",
    level: 2,
    knowledgePoints: ["循环", "数位分离", "计数"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1150`,
    description: `小杨认为自己的幸运数是正整数 $k$（注：保证 $1 \\le k\\le 9$）。小杨想知道，对于从 $1$ 到 $n$ 的所有正整数中， $k$ 出现了多少次。`,
    inputFormat: `第一行包含一个正整数 $n$。

第二行包含一个正整数 $k$。`,
    outputFormat: `输出从 $1$ 到 $n$ 的所有正整数中， $k$ 出现的次数。`,
    samples: [
      { input: "25\n2", output: "9" },
    ],
    testCases: [
      { input: "25\n2", output: "9" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `从 $1$ 到 $25$ 中，$2$ 出现的正整数有 $2,12,20,21,22,23,24,25$ ，一共出现了 $9$ 次。

对于全部数据，保证有 $1 \\le n\\le 1000,1 \\le k\\le 9$。`,
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
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1158`,
    description: `小杨有 $n$ 个正整数，他认为一个正整数是美丽数字当且仅当该正整数每一位数字的总和是 $7$ 的倍数。小杨想请你编写一个程序判断 $n$ 个正整数哪些是美丽数字。`,
    inputFormat: `第一行包含一个正整数 $n$，表示正整数个数。之后 $n$ 行，每行一个包含一个正整数 $a_i$。`,
    outputFormat: `对于每个正整数输出一行一个字符串，如果是美丽数字则输出 \`Yes\`，否则输出 \`No\`。`,
    samples: [
      { input: "3\n7\n52\n103", output: "Yes\nYes\nNo" },
    ],
    testCases: [
      { input: "3\n7\n52\n103", output: "Yes\nYes\nNo" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `### 数据规模与约定

对全部的测试数据，保证 $1 \\leq n \\leq 10^5$，$1 \\leq a_i \\leq 10^5$。`,
  },
  {
    title: "[GESP202409 二级] 小杨的 N 字矩阵",
    source: "gesp_official",
    sourceId: "B4037",
    sourceUrl: "https://www.luogu.com.cn/problem/B4037",
    level: 2,
    knowledgePoints: ["循环嵌套", "矩阵输出", "对角线"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1158`,
    description: `小杨想要构造一个 $m \\times m$ 的 $N$ 字矩阵（$m$ 为奇数），这个矩阵的从左上角到右下角的对角线、第 $1$ 列和第 $m$ 列都是半角加号 \`+\` ，其余都是半角减号 \`-\` 。`,
    inputFormat: `输入只有一行包含一个正整数 $m$。`,
    outputFormat: `输出对应的 $N$ 字矩阵。`,
    samples: [
      { input: "5", output: "+---+\n++--+\n+-+-+\n+--++\n+---+" },
    ],
    testCases: [
      { input: "5", output: "+---+\n++--+\n+-+-+\n+--++\n+---+" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对全部的测试数据，保证 $3 \\leq m \\leq 49$ 且 $m$ 是奇数。`,
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
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1166`,
    description: `小杨有一个正整数 $a$，小杨想知道是否存在一个正整数 $b$ 满足 $a=b^4$。`,
    inputFormat: `第一行包含一个正整数 $t$，代表测试数据组数。

对于每组测试数据，第一行包含一个正整数代表 $a$。`,
    outputFormat: `对于每组测试数据，如果存在满足条件的正整数 $b$，则输出 $b$，否则输出 $-1$。`,
    samples: [
      { input: "3\n16\n81\n10", output: "2\n3\n-1" },
    ],
    testCases: [
      { input: "3\n16\n81\n10", output: "2\n3\n-1" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于全部数据，保证有 $1\\leq t\\leq 10^5$，$1\\leq a_i\\leq 10^8$。`,
  },
  {
    title: "[GESP202412 二级] 数位和",
    source: "gesp_official",
    sourceId: "B4065",
    sourceUrl: "https://www.luogu.com.cn/problem/B4065",
    level: 2,
    knowledgePoints: ["循环", "数位分离", "最大值"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1166`,
    description: `小杨有 $n$ 个正整数，小杨想知道这些正整数的数位和中最大值是多少。"数位和"指的是一个数字中所有数位的和。例如:对于数字 $12345$，它的各个数位分别是 $1,2,3,4,5$。将这些数位相加，得到

$$1+2+3+4+5=15$$

因此，$12345$ 的数位和是 $15$。`,
    inputFormat: `第一行包含一个正整数 $n$，代表正整数个数。

之后 $n$ 行，每行包含一个正整数。`,
    outputFormat: `输出这些正整数的数位和的最大值。`,
    samples: [
      { input: "3\n16\n81\n10", output: "9" },
    ],
    testCases: [
      { input: "3\n16\n81\n10", output: "9" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于全部数据，保证有 $1\\leq n\\leq 10^5$，每个正整数不超过 $10^{12}$。`,
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
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1174`,
    description: `小 A 想构造一个 $n$ 行 $m$ 列的矩阵，使得矩阵的每一行与每一列均是等差数列。小 A 发现，在矩阵的第 $i$ 行第 $j$ 列填入整数 $i \\times j$，得到的矩阵能满足要求。你能帮小 A 输出这个矩阵吗？`,
    inputFormat: `一行，两个正整数 $n, m$。`,
    outputFormat: `共 $n$ 行，每行 $m$ 个由空格分割的整数，表示小 A 需要构造的矩阵。`,
    samples: [
      { input: "3 4", output: "1 2 3 4\n2 4 6 8\n3 6 9 12" },
    ],
    testCases: [
      { input: "3 4", output: "1 2 3 4\n2 4 6 8\n3 6 9 12" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于所有测试点，保证 $1\\leq n,m \\leq 50$。`,
  },
  {
    title: "[GESP202503 二级] 时间跨越",
    source: "gesp_official",
    sourceId: "B4260",
    sourceUrl: "https://www.luogu.com.cn/problem/B4260",
    level: 2,
    knowledgePoints: ["日期计算", "闰年", "模拟"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1174`,
    description: `假设现在是 $y$ 年 $m$ 月 $d$ 日 $h$ 时而 $k$ 小时后是 $y'$ 年 $m'$ 月 $d'$ 日 $h'$ 时，对于给定的 $y, m, d, h, k$，小杨想请你帮他计算出对应的 $y', m', d', h'$ 是多少。`,
    inputFormat: `输入包含五行，每行一个正整数，分别代表 $y, m, d, h, k$。`,
    outputFormat: `输出四个正整数，代表 $y', m', d', h'$。`,
    samples: [
      { input: "2008\n2\n28\n23\n1", output: "2008 2 29 0" },
    ],
    testCases: [
      { input: "2008\n2\n28\n23\n1", output: "2008 2 29 0" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于全部数据，保证有 $2000 \\leq y \\leq 3000$，$1 \\leq m \\leq 12$，$1 \\leq d \\leq 31$，$0 \\leq h \\leq 23$，$1 \\leq k \\leq 24$。数据保证为合法时间。

闰年判断规则：
- 普通闰年：年份能被 $4$ 整除，但不能被 $100$ 整除。
- 世纪闰年：年份能被 $400$ 整除。

满足以上任意一条规则的年份就是闰年，否则是平年。`,
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
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1182`,
    description: `直角三角形有两条直角边与一条斜边，设两条直角边的长度分别为 $a, b$，则直角三角形的面积为 $\\frac{ab}{2}$。

请你计算当直角边长 $a, b$ 均取不超过 $n$ 的正整数时，有多少个不同的面积为整数的直角三角形。直角边长分别为 $a, b$ 和 $a', b'$ 的两个直角三角形相同，当且仅当 $a = a'$, $b = b'$ 或者 $a = b'$, $b = a'$。`,
    inputFormat: `一行，一个整数 $n$，表示直角边长的最大值。`,
    outputFormat: `输出一行，一个整数，表示不同的直角三角形数量。`,
    samples: [
      { input: "3", output: "3" },
      { input: "5", output: "9" },
    ],
    testCases: [
      { input: "3", output: "3" },
      { input: "5", output: "9" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于所有测试点，保证 $1 \\leq n \\leq 1000$。`,
  },
  {
    title: "[GESP202506 二级] 幂和数",
    source: "gesp_official",
    sourceId: "B4357",
    sourceUrl: "https://www.luogu.com.cn/problem/B4357",
    level: 2,
    knowledgePoints: ["循环嵌套", "枚举", "位运算"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1182`,
    description: `对于正整数 $n$，如果 $n$ 可以表为两个 $2$ 的次幂之和，即 $n = 2^x + 2^y$（$x, y$ 均为非负整数），那么称 $n$ 为幂和数。

给定正整数 $l, r$，请你求出满足 $l \\leq n \\leq r$ 的整数 $n$ 中有多少个幂和数。`,
    inputFormat: `一行，两个正整数 $l, r$，含义如上。`,
    outputFormat: `输出一行，一个整数，表示 $l, r$ 之间幂和数的数量。`,
    samples: [
      { input: "2 8", output: "6" },
      { input: "10 100", output: "20" },
    ],
    testCases: [
      { input: "2 8", output: "6" },
      { input: "10 100", output: "20" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于所有测试点，保证 $1 \\leq l \\leq r \\leq 10^4$。`,
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
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1190`,
    description: `如果一个正整数在十进制下的所有数位都相同，小 A 就会觉得这个正整数很优美。例如，正整数 $6$ 的数位都是 $6$，所以 $6$ 是优美的。正整数 $99$ 的数位都是 $9$，所以 $99$ 是优美的。正整数 $123$ 的数位不都相同，所以 $123$ 并不优美。

小 A 想知道不超过 $n$ 的正整数中有多少优美的数字。你能帮他数一数吗？`,
    inputFormat: `一行，一个正整数 $n$。`,
    outputFormat: `一行，一个正整数，表示不超过 $n$ 的优美正整数的数量。`,
    samples: [
      { input: "6", output: "6" },
      { input: "2025", output: "28" },
    ],
    testCases: [
      { input: "6", output: "6" },
      { input: "2025", output: "28" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于所有测试点，保证 $1 \\leq n \\leq 2025$。`,
  },
  {
    title: "[GESP202509 二级] 菱形",
    source: "gesp_official",
    sourceId: "B4412",
    sourceUrl: "https://www.luogu.com.cn/problem/B4412",
    level: 2,
    knowledgePoints: ["循环嵌套", "矩阵输出", "菱形图案"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1190`,
    description: `小 A 想绘制一个菱形。具体来说，需要绘制的菱形是一个 $n$ 行 $n$ 列的字符画，$n$ 是一个大于 $1$ 的奇数。菱形的四个顶点依次位于第 $1$ 行、第 $1$ 列、第 $n$ 行、第 $n$ 列的正中间，使用 \`#\` 绘制。相邻顶点之间也用 \`#\` 连接。其余位置都是 \`.\`。

例如，一个 $5$ 行 $5$ 列的菱形字符画是这样的：
\`\`\`
..#..
.#.#.
#...#
.#.#.
..#..
\`\`\`

给定 $n$，请你帮小 A 绘制对应的菱形。`,
    inputFormat: `一行，一个正整数 $n$。`,
    outputFormat: `输出共 $n$ 行，表示对应的菱形。`,
    samples: [
      { input: "3", output: ".#.\n#.#\n.#." },
      { input: "9", output: "....#....\n...#.#...\n..#...#..\n.#.....#.\n#.......#\n.#.....#.\n..#...#..\n...#.#...\n....#...." },
    ],
    testCases: [
      { input: "3", output: ".#.\n#.#\n.#." },
      { input: "9", output: "....#....\n...#.#...\n..#...#..\n.#.....#.\n#.......#\n.#.....#.\n..#...#..\n...#.#...\n....#...." },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于所有测试点，保证 $3 \\leq n \\leq 29$ 并且 $n$ 为奇数。`,
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
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1198`,
    description: `小杨玩环保主题游戏，每行走 1 公里获得 1 点"环保能量"。游戏设置里程奖励：每行走 $x$ 公里额外奖励 1 点能量。已知小杨行走了 $n$ 公里，求总能量点数。`,
    inputFormat: `第一行包含正整数 $t$，代表测试数据组数。对于每组测试数据：第一行包含正整数 $n$（行走公里数），第二行包含正整数 $x$（奖励触发间隔）。`,
    outputFormat: `对于每组测试数据，输出一个整数，代表小杨获得的环保能量总数。`,
    samples: [
      { input: "3\n5\n2\n10\n3\n2\n5", output: "7\n13\n2" },
    ],
    testCases: [
      { input: "3\n5\n2\n10\n3\n2\n5", output: "7\n13\n2" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `样例解释：
- $n=5, x=2$：基础能量 5 点，第 2、4 公里各获奖 1 点，共 7 点
- $n=10, x=3$：基础能量 10 点，第 3、6、9 公里各获奖 1 点，共 13 点
- $n=2, x=5$：基础能量 2 点，路程不足 5 公里无奖励，共 2 点

数据范围：$1 \\leq t \\leq 100$，$1 \\leq n, x \\leq 1000$`,
  },
  {
    title: "[GESP202512 二级] 黄金格",
    source: "gesp_official",
    sourceId: "B4448",
    sourceUrl: "https://www.luogu.com.cn/problem/B4448",
    level: 2,
    knowledgePoints: ["循环嵌套", "枚举", "数学"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1198`,
    description: `小杨在探险时发现了一张神奇的矩形地图，地图有 $H$ 行和 $W$ 列。每个格子的坐标是 $(r, c)$，其中 $r$ 表示行号从 $1$ 到 $H$，$c$ 表示列号 $1$ 到 $W$。小杨听说地图中隐藏着一些"黄金格"，这些格子满足一个神秘的数学挑战：当格子坐标 $(r, c)$ 代入特定的不等式关系成立时，该格子就是黄金格。具体来说，黄金格的条件是：$\\sqrt{r^2 + c^2} \\leq x + r - c$。例如，如果参数 $x = 5$，那么格子 $(4, 3)$ 就是黄金格。因为左边坐标平方和的平方根 $\\sqrt{4^2 + 3^2}$ 算出来是 $5$，而右边 $5 + 4 - 3$ 算出来是 $6$，$5$ 小于等于 $6$，符合条件。`,
    inputFormat: `三行，每行一个正整数，分别表示 $H,W,x$。含义如题面所示。`,
    outputFormat: `一行一个整数，代表黄金格数量。`,
    samples: [
      { input: "4\n4\n2", output: "4" },
    ],
    testCases: [
      { input: "4\n4\n2", output: "4" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `### 样例解释

图中标注为黄色的四个格子是黄金格，坐标分别为 $(1, 1)$，$(2, 1)$，$(3, 1)$，$(4, 1)$。

### 数据范围

对于所有测试点，保证给出的正整数不超过 $1000$。`,
  },
];

async function seedGesp2() {
  try {
    // 删除现有的GESP2题目，重新导入
    await prisma.problem.deleteMany({
      where: {
        sourceId: {
          in: gesp2Problems.map(p => p.sourceId).filter(Boolean) as string[]
        }
      }
    });

    // 添加所有题目
    const result = await prisma.problem.createMany({
      data: gesp2Problems,
    });

    return NextResponse.json({
      success: true,
      message: `成功导入 ${result.count} 道 GESP 2级题目（已更新为与洛谷100%一致）`,
      count: result.count
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
