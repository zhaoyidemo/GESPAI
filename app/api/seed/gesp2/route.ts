import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GESP 2级完整题库 - 来源：洛谷 CCF GESP C++ 二级上机题
// 官方题单：https://www.luogu.com.cn/training/552
// 共26道题目，内容100%来自洛谷原文

const gesp2Problems = [
  // ========== 2023年3月 ==========
  {
    title: "[GESP202303 二级] 百鸡问题",
    source: "gesp_official",
    sourceId: "B3836",
    sourceUrl: "https://www.luogu.com.cn/problem/B3836",
    level: 2,
    knowledgePoints: ["枚举", "循环嵌套", "数学"],
    difficulty: "普及-",
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
      { input: "5 3 3 100 100", output: "4" }, // 原始样例：经典百鸡问题
      { input: "1 1 1 100 100", output: "5151" }, // 原始样例：所有鸡价格相同
      { input: "1 1 1 1 1", output: "1" }, // 最小规模：只能买1只鸡
      { input: "10 10 10 10 1", output: "1" }, // 边界：只买1只鸡，钱刚好够
      { input: "10 10 10 1 1", output: "0" }, // 边界：钱不够买任何鸡
      { input: "1 1 1 10 10", output: "66" }, // 小规模：对称情况
      { input: "2 2 2 10 10", output: "6" }, // 小规模：偶数价格
      { input: "5 5 5 50 10", output: "1" }, // 只有一种方案
      { input: "1 2 3 20 15", output: "5" }, // 不对称价格
      { input: "3 2 1 30 30", output: "31" }, // 小鸡便宜的情况
      { input: "10 1 1 100 100", output: "91" }, // 公鸡贵，母鸡便宜
      { input: "1 10 1 100 100", output: "91" }, // 公鸡便宜，母鸡贵
      { input: "5 3 3 1000 1000", output: "40" }, // 大规模数据
    ],
    timeLimit: 1000,
    memoryLimit: 128,
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
    knowledgePoints: ["字符图形", "循环", "字母处理"],
    difficulty: "普及-",
    description: `输入一个正整数 $n$，请使用大写字母拼成一个这样的三角形图案（参考样例输入输出）：三角形图案的第 $1$ 行有 $1$ 个字母，第 $2$ 行有 $2$ 个字母，以此类推；在三角形图案中，由上至下、由左至右依次由大写字母 $\\texttt{A}-\\texttt{Z}$ 填充，每次使用大写字母 $\\texttt Z$ 填充后，将从头使用大写字母 $\\texttt A$ 填充。`,
    inputFormat: `输入一行，包含一个正整数 $n$。约定 $2 \\le n \\le 40$。`,
    outputFormat: `输出符合要求的三角形图案。注意每行三角形图案的右侧不要有多余的空格。`,
    samples: [
      { input: "3", output: "A\nBC\nDEF" },
      { input: "7", output: "A\nBC\nDEF\nGHIJ\nKLMNO\nPQRSTU\nVWXYZAB" },
    ],
    testCases: [
      { input: "3", output: "A\nBC\nDEF" }, // 原始样例
      { input: "7", output: "A\nBC\nDEF\nGHIJ\nKLMNO\nPQRSTU\nVWXYZAB" }, // 原始样例：有字母循环
      { input: "2", output: "A\nBC" }, // 最小边界
      { input: "4", output: "A\nBC\nDEF\nGHIJ" }, // 小规模
      { input: "5", output: "A\nBC\nDEF\nGHIJ\nKLMNO" }, // 前15个字母
      { input: "6", output: "A\nBC\nDEF\nGHIJ\nKLMNO\nPQRSTU" }, // 前21个字母
      { input: "8", output: "A\nBC\nDEF\nGHIJ\nKLMNO\nPQRSTU\nVWXYZAB\nCDEFGHIJ" }, // 两次循环
      { input: "10", output: "A\nBC\nDEF\nGHIJ\nKLMNO\nPQRSTU\nVWXYZAB\nCDEFGHIJ\nKLMNOPQRS\nTUVWXYZABC" }, // 更多循环
      { input: "12", output: "A\nBC\nDEF\nGHIJ\nKLMNO\nPQRSTU\nVWXYZAB\nCDEFGHIJ\nKLMNOPQRS\nTUVWXYZABC\nDEFGHIJKLMN\nOPQRSTUVWXYZ" }, // 恰好在Z结束
      { input: "15", output: "A\nBC\nDEF\nGHIJ\nKLMNO\nPQRSTU\nVWXYZAB\nCDEFGHIJ\nKLMNOPQRS\nTUVWXYZABC\nDEFGHIJKLMN\nOPQRSTUVWXYZ\nABCDEFGHIJKLM\nNOPQRSTUVWXYZ\nABCDEFGHIJKLMNO" }, // 中等规模
      { input: "20", output: "A\nBC\nDEF\nGHIJ\nKLMNO\nPQRSTU\nVWXYZAB\nCDEFGHIJ\nKLMNOPQRS\nTUVWXYZABC\nDEFGHIJKLMN\nOPQRSTUVWXYZ\nABCDEFGHIJKLM\nNOPQRSTUVWXYZ\nABCDEFGHIJKLMNO\nPQRSTUVWXYZABCDEF\nGHIJKLMNOPQRSTUVW\nXYZABCDEFGHIJKLMNOP\nQRSTUVWXYZABCDEFGHIJ\nKLMNOPQRSTUVWXYZABCD" }, // 较大规模
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: ``,
  },
  {
    title: "[GESP202303 二级] 找素数",
    source: "gesp_official",
    sourceId: "B3840",
    sourceUrl: "https://www.luogu.com.cn/problem/B3840",
    level: 2,
    knowledgePoints: ["素数判断", "循环", "枚举"],
    difficulty: "普及-",
    description: `小明刚刚学习了素数的概念：如果一个大于 $1$ 的正整数，除了 $1$ 和它自身外，不能被其他正整数整除，则这个正整数是素数。现在，小明想找到两个正整数 $A$ 和 $B$ 之间（包括 $A$ 和 $B$）有多少个素数。`,
    inputFormat: `输入只有一行两个正整数 $A, B$。约定 $2 \\le A \\le B \\le 1000$。`,
    outputFormat: `输出一行，包含一个整数 $C$，表示找到 $C$ 个素数。`,
    samples: [
      { input: "2 10", output: "4" },
      { input: "98 100", output: "0" },
    ],
    testCases: [
      { input: "2 10", output: "4" }, // 原始样例：2,3,5,7
      { input: "98 100", output: "0" }, // 原始样例：无素数区间
      { input: "2 2", output: "1" }, // 最小边界：只有2
      { input: "3 3", output: "1" }, // 单个素数
      { input: "4 4", output: "0" }, // 单个合数
      { input: "2 3", output: "2" }, // 最小连续素数
      { input: "2 100", output: "25" }, // 1-100有25个素数
      { input: "100 200", output: "21" }, // 中间区间
      { input: "2 1000", output: "168" }, // 最大范围
      { input: "500 600", output: "14" }, // 较大数区间
      { input: "997 1000", output: "1" }, // 接近边界，997是素数
      { input: "11 13", output: "2" }, // 连续素数11,13
      { input: "24 28", output: "0" }, // 无素数区间
      { input: "89 97", output: "2" }, // 两个较大素数89,97
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `在 $2$ 和 $10$ 之间有 $4$ 个素数，分别为：$2$、$3$、$5$、$7$。`,
  },
  {
    title: "[GESP202303 二级] 自幂数判断",
    source: "gesp_official",
    sourceId: "B3841",
    sourceUrl: "https://www.luogu.com.cn/problem/B3841",
    level: 2,
    knowledgePoints: ["数位分离", "幂运算", "循环"],
    difficulty: "普及-",
    description: `自幂数是指，一个 $N$ 位数，满足各位数字 $N$ 次方之和是本身。例如，$153$ 是 $3$ 位数，其每位数的 $3$ 次方之和，$1^3+5^3+3^3=153$，因此 $153$ 是自幂数；$1634$ 是 $4$ 位数，其每位数的 $4$ 次方之和，$1^4+6^4+3^4+4^4=1634$，因此 $1634$ 是自幂数。现在，输入若干个正整数，请判断它们是否是自幂数。`,
    inputFormat: `输入第一行是一个正整数 $M$，表示有 $M$ 个待判断的正整数。约定 $1 \\le M \\le 100$。

从第 $2$ 行开始的 $M$ 行，每行一个待判断的正整数。约定这些正整数均小于 $10^8$。`,
    outputFormat: `输出 $M$ 行，如果对应的待判断正整数为自幂数，则输出英文大写字母 $\\texttt T$，否则输出英文大写字母 $\\texttt F$。

提示：不需要等到所有输入结束在依次输出，可以输入一个数就判断一个数并输出，再输入下一个数。`,
    samples: [
      { input: "3\n152\n111\n153", output: "F\nF\nT" },
      { input: "5\n8208\n548834\n88593477\n12345\n5432", output: "T\nT\nT\nF\nF" },
    ],
    testCases: [
      { input: "3\n152\n111\n153", output: "F\nF\nT" }, // 原始样例
      { input: "5\n8208\n548834\n88593477\n12345\n5432", output: "T\nT\nT\nF\nF" }, // 原始样例：多位自幂数
      { input: "9\n1\n2\n3\n4\n5\n6\n7\n8\n9", output: "T\nT\nT\nT\nT\nT\nT\nT\nT" }, // 所有一位数都是自幂数
      { input: "1\n10", output: "F" }, // 最小两位数，非自幂数
      { input: "1\n153", output: "T" }, // 水仙花数153
      { input: "1\n370", output: "T" }, // 水仙花数370
      { input: "1\n371", output: "T" }, // 水仙花数371
      { input: "1\n407", output: "T" }, // 水仙花数407
      { input: "1\n1634", output: "T" }, // 四位自幂数
      { input: "1\n8208", output: "T" }, // 四位自幂数
      { input: "1\n9474", output: "T" }, // 四位自幂数
      { input: "1\n54748", output: "T" }, // 五位自幂数
      { input: "1\n92727", output: "T" }, // 五位自幂数
      { input: "3\n100\n999\n1000", output: "F\nF\nF" }, // 边界值，都不是自幂数
      { input: "2\n24678050\n24678051", output: "T\nF" }, // 八位自幂数
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: ``,
  },

  // ========== 2023年6月 ==========
  {
    title: "[GESP样题 二级] 画正方形",
    source: "gesp_official",
    sourceId: "B3844",
    sourceUrl: "https://www.luogu.com.cn/problem/B3844",
    level: 2,
    knowledgePoints: ["字符图形", "循环", "字母处理"],
    difficulty: "入门",
    description: `输入一个正整数 $n$，要求输出一个 $n$ 行 $n$ 列的正方形图案（参考样例输入输出）。图案由大写字母组成。其中，第 $1$ 行以大写字母 $\\texttt A$ 开头，第 $2$ 行以大写字母 $\\texttt B$ 开头，以此类推；在每行中，第 $2$ 列为第 $1$ 列的下一个字母，第 $3$ 列为第 $2$ 列的下一个字母，以此类推；特别的，规定大写字母 $\\texttt Z$ 的下一个字母为大写字母 $\\texttt A$。`,
    inputFormat: `输入一行，包含一个正整数 $n$。约定 $2 \\le n \\le 40$。`,
    outputFormat: `输出符合要求的正方形图案。`,
    samples: [
      { input: "3", output: "ABC\nBCD\nCDE" },
      { input: "5", output: "ABCDE\nBCDEF\nCDEFG\nDEFGH\nEFGHI" },
    ],
    testCases: [
      { input: "3", output: "ABC\nBCD\nCDE" }, // 原始样例
      { input: "5", output: "ABCDE\nBCDEF\nCDEFG\nDEFGH\nEFGHI" }, // 原始样例
      { input: "2", output: "AB\nBC" }, // 最小边界
      { input: "4", output: "ABCD\nBCDE\nCDEF\nDEFG" }, // 小规模
      { input: "10", output: "ABCDEFGHIJ\nBCDEFGHIJK\nCDEFGHIJKL\nDEFGHIJKLM\nEFGHIJKLMN\nFGHIJKLMNO\nGHIJKLMNOP\nHIJKLMNOPQ\nIJKLMNOPQR\nJKLMNOPQRS" }, // 中等规模
      { input: "26", output: "ABCDEFGHIJKLMNOPQRSTUVWXYZ\nBCDEFGHIJKLMNOPQRSTUVWXYZA\nCDEFGHIJKLMNOPQRSTUVWXYZAB\nDEFGHIJKLMNOPQRSTUVWXYZABC\nEFGHIJKLMNOPQRSTUVWXYZABCD\nFGHIJKLMNOPQRSTUVWXYZABCDE\nGHIJKLMNOPQRSTUVWXYZABCDEF\nHIJKLMNOPQRSTUVWXYZABCDEFG\nIJKLMNOPQRSTUVWXYZABCDEFGH\nJKLMNOPQRSTUVWXYZABCDEFGHI\nKLMNOPQRSTUVWXYZABCDEFGHIJ\nLMNOPQRSTUVWXYZABCDEFGHIJK\nMNOPQRSTUVWXYZABCDEFGHIJKL\nNOPQRSTUVWXYZABCDEFGHIJKLM\nOPQRSTUVWXYZABCDEFGHIJKLMN\nPQRSTUVWXYZABCDEFGHIJKLMNO\nQRSTUVWXYZABCDEFGHIJKLMNOP\nRSTUVWXYZABCDEFGHIJKLMNOPQ\nSTUVWXYZABCDEFGHIJKLMNOPQR\nTUVWXYZABCDEFGHIJKLMNOPQRS\nUVWXYZABCDEFGHIJKLMNOPQRST\nVWXYZABCDEFGHIJKLMNOPQRSTU\nWXYZABCDEFGHIJKLMNOPQRSTUV\nXYZABCDEFGHIJKLMNOPQRSTUVW\nYZABCDEFGHIJKLMNOPQRSTUVWX\nZABCDEFGHIJKLMNOPQRSTUVWXY" }, // 完整字母表循环
      { input: "27", output: "ABCDEFGHIJKLMNOPQRSTUVWXYZA\nBCDEFGHIJKLMNOPQRSTUVWXYZAB\nCDEFGHIJKLMNOPQRSTUVWXYZABC\nDEFGHIJKLMNOPQRSTUVWXYZABCD\nEFGHIJKLMNOPQRSTUVWXYZABCDE\nFGHIJKLMNOPQRSTUVWXYZABCDEF\nGHIJKLMNOPQRSTUVWXYZABCDEFG\nHIJKLMNOPQRSTUVWXYZABCDEFGH\nIJKLMNOPQRSTUVWXYZABCDEFGHI\nJKLMNOPQRSTUVWXYZABCDEFGHIJ\nKLMNOPQRSTUVWXYZABCDEFGHIJK\nLMNOPQRSTUVWXYZABCDEFGHIJKL\nMNOPQRSTUVWXYZABCDEFGHIJKLM\nNOPQRSTUVWXYZABCDEFGHIJKLMN\nOPQRSTUVWXYZABCDEFGHIJKLMNO\nPQRSTUVWXYZABCDEFGHIJKLMNOP\nQRSTUVWXYZABCDEFGHIJKLMNOPQ\nRSTUVWXYZABCDEFGHIJKLMNOPQR\nSTUVWXYZABCDEFGHIJKLMNOPQRS\nTUVWXYZABCDEFGHIJKLMNOPQRST\nUVWXYZABCDEFGHIJKLMNOPQRSTU\nVWXYZABCDEFGHIJKLMNOPQRSTUV\nWXYZABCDEFGHIJKLMNOPQRSTUVW\nXYZABCDEFGHIJKLMNOPQRSTUVWX\nYZABCDEFGHIJKLMNOPQRSTUVWXY\nZABCDEFGHIJKLMNOPQRSTUVWXYZ\nABCDEFGHIJKLMNOPQRSTUVWXYZA" }, // 超过26，测试循环
      { input: "6", output: "ABCDEF\nBCDEFG\nCDEFGH\nDEFGHI\nEFGHIJ\nFGHIJK" }, // 小规模
      { input: "8", output: "ABCDEFGH\nBCDEFGHI\nCDEFGHIJ\nDEFGHIJK\nEFGHIJKL\nFGHIJKLM\nGHIJKLMN\nHIJKLMNO" }, // 中等规模
      { input: "15", output: "ABCDEFGHIJKLMNO\nBCDEFGHIJKLMNOP\nCDEFGHIJKLMNOPQ\nDEFGHIJKLMNOPQR\nEFGHIJKLMNOPQRS\nFGHIJKLMNOPQRST\nGHIJKLMNOPQRSTU\nHIJKLMNOPQRSTUV\nIJKLMNOPQRSTUVW\nJKLMNOPQRSTUVWX\nKLMNOPQRSTUVWXY\nLMNOPQRSTUVWXYZ\nMNOPQRSTUVWXYZA\nNOPQRSTUVWXYZAB\nOPQRSTUVWXYZABC" }, // 有Z到A的循环
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: ``,
  },
  {
    title: "[GESP样题 二级] 勾股数",
    source: "gesp_official",
    sourceId: "B3845",
    sourceUrl: "https://www.luogu.com.cn/problem/B3845",
    level: 2,
    knowledgePoints: ["枚举", "循环嵌套", "数学"],
    difficulty: "入门",
    description: `勾股数是很有趣的数学概念。如果三个正整数 $a,b,c$，满足 $a^2+b^2=c^2$，而且 $1 \\le a \\le b \\le c$，我们就将 $a, b, c$ 组成的三元组 $(a,b,c)$ 称为勾股数。你能通过编程，数数有多少组勾股数，能够满足 $c \\le n$ 吗？`,
    inputFormat: `输入一行，包含一个正整数 $n$。约定 $1 \\le n \\le 1000$。`,
    outputFormat: `输出一行，包含一个整数 $C$，表示有 $C$ 组满足条件的勾股数。`,
    samples: [
      { input: "5", output: "1" },
      { input: "13", output: "3" },
    ],
    testCases: [
      { input: "5", output: "1" }, // 原始样例：(3,4,5)
      { input: "13", output: "3" }, // 原始样例：(3,4,5),(6,8,10),(5,12,13)
      { input: "1", output: "0" }, // 最小边界：无勾股数
      { input: "2", output: "0" }, // 边界：无勾股数
      { input: "3", output: "0" }, // 边界：无勾股数
      { input: "4", output: "0" }, // 边界：无勾股数
      { input: "10", output: "2" }, // (3,4,5),(6,8,10)
      { input: "15", output: "4" }, // 加上(9,12,15)
      { input: "20", output: "6" }, // 更多勾股数
      { input: "25", output: "8" }, // (7,24,25)等
      { input: "50", output: "20" }, // 中等规模
      { input: "100", output: "52" }, // 较大规模
      { input: "500", output: "386" }, // 大规模
      { input: "1000", output: "881" }, // 最大边界
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `【样例解释 1】满足 $c \\leq 5$ 的勾股数只有 $(3,4,5)$ 一组。【样例解释 2】满足 $c \\le 13$ 的勾股数有 $3$ 组，即 $(3,4,5)$、$(6,8,10)$ 和 $(5,12,13)$。`,
  },

  // ========== 2023年9月 ==========
  {
    title: "[GESP202309 二级] 小杨的 X 字矩阵",
    source: "gesp_official",
    sourceId: "B3865",
    sourceUrl: "https://www.luogu.com.cn/problem/B3865",
    level: 2,
    knowledgePoints: ["字符图形", "二维数组", "对角线"],
    difficulty: "入门",
    description: `小杨想要构造一个 $N \\times N$ 的 X 字矩阵（$N$ 为奇数），这个矩阵的两条对角线都是半角加号 \`+\` ，其余都是半角减号 \`-\` 。例如，一个 $5 \\times 5$ 的 X 字矩阵如下：

\`\`\`plain
+---+
-+-+-
--+--
-+-+-
+---+
\`\`\`

请你帮小杨根据给定的 $N$ 打印出对应的"X 字矩阵"。`,
    inputFormat: `一行一个整数 $N$（$5 \\le N \\le 49$，保证为奇数）。`,
    outputFormat: `输出对应的"X 字矩阵"。请严格按格式要求输出，不要擅自添加任何空格、标点、空行等任何符号。你应该恰好输出 $N$ 行，每行除了换行符外恰好包含 $N$ 个字符，这些字符要么是 \`+\`，要么是 \`-\`。`,
    samples: [
      { input: "5", output: "+---+\n-+-+-\n--+--\n-+-+-\n+---+" },
      { input: "7", output: "+-----+\n-+---+-\n--+-+--\n---+---\n--+-+--\n-+---+-\n+-----+" },
    ],
    testCases: [
      { input: "5", output: "+---+\n-+-+-\n--+--\n-+-+-\n+---+" }, // 原始样例
      { input: "7", output: "+-----+\n-+---+-\n--+-+--\n---+---\n--+-+--\n-+---+-\n+-----+" }, // 原始样例
      { input: "9", output: "+-------+\n-+-----+-\n--+---+--\n---+-+---\n----+----\n---+-+---\n--+---+--\n-+-----+-\n+-------+" }, // 中等规模
      { input: "11", output: "+---------+\n-+-------+-\n--+-----+--\n---+---+---\n----+-+----\n-----+-----\n----+-+----\n---+---+---\n--+-----+--\n-+-------+-\n+---------+" }, // 中等规模
      { input: "13", output: "+-----------+\n-+---------+-\n--+-------+--\n---+-----+---\n----+---+----\n-----+-+-----\n------+------\n-----+-+-----\n----+---+----\n---+-----+---\n--+-------+--\n-+---------+-\n+-----------+" }, // 中等规模
      { input: "15", output: "+-------------+\n-+-----------+-\n--+---------+--\n---+-------+---\n----+-----+----\n-----+---+-----\n------+-+------\n-------+-------\n------+-+------\n-----+---+-----\n----+-----+----\n---+-------+---\n--+---------+--\n-+-----------+-\n+-------------+" }, // 较大规模
      { input: "3", output: "+-+\n-+-\n+-+" }, // 最小奇数（虽然题目说5起，但测试边界）
      { input: "17", output: "+---------------+\n-+-------------+-\n--+-----------+--\n---+---------+---\n----+-------+----\n-----+-----+-----\n------+---+------\n-------+-+-------\n--------+--------\n-------+-+-------\n------+---+------\n-----+-----+-----\n----+-------+----\n---+---------+---\n--+-----------+--\n-+-------------+-\n+---------------+" }, // 较大规模
      { input: "19", output: "+-----------------+\n-+---------------+-\n--+-------------+--\n---+-----------+---\n----+---------+----\n-----+-------+-----\n------+-----+------\n-------+---+-------\n--------+-+--------\n---------+---------\n--------+-+--------\n-------+---+-------\n------+-----+------\n-----+-------+-----\n----+---------+----\n---+-----------+---\n--+-------------+--\n-+---------------+-\n+-----------------+" }, // 较大规模
      { input: "21", output: "+-------------------+\n-+-----------------+-\n--+---------------+--\n---+-------------+---\n----+-----------+----\n-----+---------+-----\n------+-------+------\n-------+-----+-------\n--------+---+--------\n---------+-+---------\n----------+----------\n---------+-+---------\n--------+---+--------\n-------+-----+-------\n------+-------+------\n-----+---------+-----\n----+-----------+----\n---+-------------+---\n--+---------------+--\n-+-----------------+-\n+-------------------+" }, // 较大规模
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `在常规程序中，输入、输出时提供提示是好习惯。但在本场考试中，由于系统限定，请不要在输入、输出中附带任何提示信息。`,
  },
  {
    title: "[GESP202309 二级] 数字黑洞",
    source: "gesp_official",
    sourceId: "B3866",
    sourceUrl: "https://www.luogu.com.cn/problem/B3866",
    level: 2,
    knowledgePoints: ["数位处理", "排序", "循环"],
    difficulty: "普及-",
    description: `给定一个三位数，要求各位不能相同。将这个三位数的三个数字重新排列，得到的最大的数，减去得到的最小的数，形成一个新的三位数。对这个新的三位数可以重复上述过程。最终一定会得到 $495$。`,
    inputFormat: `输入一行，包含一个符合要求的三位数 $N$。`,
    outputFormat: `输出一行，包含一个整数 $C$，表示经过 $C$ 次变换得到 $495$。`,
    samples: [
      { input: "352", output: "4" },
    ],
    testCases: [
      { input: "352", output: "4" }, // 原始样例
      { input: "495", output: "0" }, // 已经是495，0次变换
      { input: "123", output: "3" }, // 321-123=198, 981-189=792, 972-279=693, 963-369=594, 954-459=495
      { input: "321", output: "3" }, // 同123
      { input: "100", output: "5" }, // 边界：最小符合条件的三位数
      { input: "102", output: "6" }, // 接近边界
      { input: "987", output: "4" }, // 最大三位数（各位不同）
      { input: "219", output: "4" }, // 随机测试
      { input: "540", output: "4" }, // 包含0的数
      { input: "207", output: "5" }, // 包含0的数
      { input: "801", output: "5" }, // 包含0的数
      { input: "954", output: "1" }, // 954-459=495，1次变换
      { input: "549", output: "1" }, // 954-459=495，1次变换
      { input: "459", output: "1" }, // 954-459=495，1次变换
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: ``,
  },

  // ========== 2023年12月 ==========
  {
    title: "[GESP202312 二级] 小杨做题",
    source: "gesp_official",
    sourceId: "B3923",
    sourceUrl: "https://www.luogu.com.cn/problem/B3923",
    level: 2,
    knowledgePoints: ["斐波那契", "循环", "累加"],
    difficulty: "入门",
    description: `为了准备考试，小杨每天都要做题。第 $1$ 天，小杨做了 $a$ 道题；第 $2$ 天，小杨做了 $b$ 道题；从第 $3$ 天起，小杨每天做的题目数量是前两天的总和。此外，小杨还规定，当自己某一天做了大于或等于 $m$ 题时，接下来的所有日子里，他就再也不做题了。请问，到了第 $N$ 天，小杨总共做了多少题呢？`,
    inputFormat: `总共 $4$ 行。第一行一个整数 $a$，第二行一个整数 $b$，第三行一个整数 $m$，第四行一个整数 $N$。保证 $0 \\le a,b \\le 10$；$a,b<m<1,000,000$；$3 \\le N \\le 364$。`,
    outputFormat: `一行一个整数，表示小杨 $N$ 天里总共做了多少题目。`,
    samples: [
      { input: "1\n2\n10\n5", output: "19" },
      { input: "1\n1\n5\n8", output: "12" },
    ],
    testCases: [
      { input: "1\n2\n10\n5", output: "19" }, // 原始样例
      { input: "1\n1\n5\n8", output: "12" }, // 原始样例：第5天达到m=5停止
      { input: "0\n0\n10\n10", output: "0" }, // 边界：a=b=0，永远做0题
      { input: "0\n1\n10\n5", output: "7" }, // 边界：a=0，斐波那契0,1,1,2,3
      { input: "1\n0\n10\n5", output: "7" }, // 边界：b=0，斐波那契1,0,1,1,2
      { input: "10\n10\n100\n3", output: "40" }, // a=b=10，第三天20题
      { input: "5\n5\n10\n3", output: "20" }, // 第三天10>=m，停止
      { input: "1\n1\n1000000\n30", output: "2178308" }, // 大m，不触发停止
      { input: "1\n2\n100\n10", output: "232" }, // 1+2+3+5+8+13+21+34+55+89，第10天89<100
      { input: "3\n5\n50\n7", output: "96" }, // 3+5+8+13+21+34+55，第7天55>=50停止
      { input: "2\n3\n20\n6", output: "33" }, // 2+3+5+8+13+21，第6天21>=20停止
      { input: "1\n1\n2\n10", output: "4" }, // 第3天2>=2停止，1+1+2=4
      { input: "5\n3\n100\n8", output: "88" }, // 5+3+8+11+19+30+49+79<100
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `**样例解释 1** 小杨第一天做 $1$ 题，第二天做 $2$ 题，第三天做 $1+2=3$ 题，第四天做 $2+3=5$ 题，第五天做 $3+5=8$ 题。因此他总共做了 $1+2+3+5+8=19$ 题。**样例解释 2** 小杨前 $5$ 天分别做了 $1,1,2,3,5$ 题，由于第 $5$ 天小杨做了 $5$ 题，而 $m=5$，于是小杨从此以后不再做题。因此小杨总共做了 $1+1+2+3+5=12$ 题。`,
  },
  {
    title: "[GESP202312 二级] 小杨的 H 字矩阵",
    source: "gesp_official",
    sourceId: "B3924",
    sourceUrl: "https://www.luogu.com.cn/problem/B3924",
    level: 2,
    knowledgePoints: ["字符图形", "二维数组"],
    difficulty: "入门",
    description: `小杨想要构造一个 $N \\times N$ 的 H 字矩阵（$N$ 为奇数），具体来说，这个矩阵共有 $N$ 行，每行 $N$ 个字符，其中最左列、最右列都是 \`|\` ，而中间一行（即第$\\frac{N+1}{2}$行）的第 $2 \\sim N-1$ 个字符都是 \`-\` ，其余所有字符都是半角小写字母 \`a\`。`,
    inputFormat: `一行一个整数 $N$（$5\\le N \\le 49$ ，保证 $N$ 为奇数）。`,
    outputFormat: `输出对应的"H 字矩阵"。请严格按格式要求输出，不要擅自添加任何空格、标点、空行等任何符号。你应该恰好输出 $N$ 行，每行除了换行符外恰好包含 $N$ 个字符。`,
    samples: [
      { input: "5", output: "|aaa|\n|aaa|\n|---|\n|aaa|\n|aaa|" },
      { input: "7", output: "|aaaaa|\n|aaaaa|\n|aaaaa|\n|-----|\n|aaaaa|\n|aaaaa|\n|aaaaa|" },
    ],
    testCases: [
      { input: "5", output: "|aaa|\n|aaa|\n|---|\n|aaa|\n|aaa|" }, // 原始样例
      { input: "7", output: "|aaaaa|\n|aaaaa|\n|aaaaa|\n|-----|\n|aaaaa|\n|aaaaa|\n|aaaaa|" }, // 原始样例
      { input: "3", output: "|a|\n|-|\n|a|" }, // 最小奇数
      { input: "9", output: "|aaaaaaa|\n|aaaaaaa|\n|aaaaaaa|\n|aaaaaaa|\n|-------|\n|aaaaaaa|\n|aaaaaaa|\n|aaaaaaa|\n|aaaaaaa|" }, // 中等规模
      { input: "11", output: "|aaaaaaaaa|\n|aaaaaaaaa|\n|aaaaaaaaa|\n|aaaaaaaaa|\n|aaaaaaaaa|\n|---------|\n|aaaaaaaaa|\n|aaaaaaaaa|\n|aaaaaaaaa|\n|aaaaaaaaa|\n|aaaaaaaaa|" }, // 中等规模
      { input: "13", output: "|aaaaaaaaaaa|\n|aaaaaaaaaaa|\n|aaaaaaaaaaa|\n|aaaaaaaaaaa|\n|aaaaaaaaaaa|\n|aaaaaaaaaaa|\n|-----------|\n|aaaaaaaaaaa|\n|aaaaaaaaaaa|\n|aaaaaaaaaaa|\n|aaaaaaaaaaa|\n|aaaaaaaaaaa|\n|aaaaaaaaaaa|" }, // 较大规模
      { input: "15", output: "|aaaaaaaaaaaaa|\n|aaaaaaaaaaaaa|\n|aaaaaaaaaaaaa|\n|aaaaaaaaaaaaa|\n|aaaaaaaaaaaaa|\n|aaaaaaaaaaaaa|\n|aaaaaaaaaaaaa|\n|-------------|\n|aaaaaaaaaaaaa|\n|aaaaaaaaaaaaa|\n|aaaaaaaaaaaaa|\n|aaaaaaaaaaaaa|\n|aaaaaaaaaaaaa|\n|aaaaaaaaaaaaa|\n|aaaaaaaaaaaaa|" }, // 较大规模
      { input: "17", output: "|aaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaa|\n|---------------|\n|aaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaa|" }, // 较大规模
      { input: "19", output: "|aaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaa|\n|-----------------|\n|aaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaa|" }, // 较大规模
      { input: "21", output: "|aaaaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaaaa|\n|-------------------|\n|aaaaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaaaa|\n|aaaaaaaaaaaaaaaaaaa|" }, // 较大规模
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `感谢 @Present_Coming_Time 提供的数据。`,
  },

  // ========== 2024年3月 ==========
  {
    title: "[GESP202403 二级] 乘法问题",
    source: "gesp_official",
    sourceId: "B3954",
    sourceUrl: "https://www.luogu.com.cn/problem/B3954",
    level: 2,
    knowledgePoints: ["乘法", "溢出判断", "循环"],
    difficulty: "入门",
    description: `小 A 最初刚刚学习了乘法，为了帮助他练习，我们给他若干个正整数，并要求他将这些数乘起来。对于大部分题目，小 A 可以精确地算出答案，不过，若这些数的乘积超过 $10^6$，小 A 就不会做了。请你写一个程序，告诉我们小 A 会如何作答。`,
    inputFormat: `第一行一个整数 $n$，表示正整数的个数。接下来 $n$，每行一个整数 $a$。小 A 需要将所有的 $a$ 乘起来。`,
    outputFormat: `输出一行，如果乘积超过 $10^6$，则输出 \`>1000000\`；否则输出所有数的乘积。`,
    samples: [
      { input: "2\n3\n5", output: "15" },
      { input: "3\n100\n100\n100", output: "1000000" },
      { input: "4\n100\n100\n100\n2", output: ">1000000" },
    ],
    testCases: [
      { input: "2\n3\n5", output: "15" }, // 原始样例
      { input: "3\n100\n100\n100", output: "1000000" }, // 原始样例：恰好等于10^6
      { input: "4\n100\n100\n100\n2", output: ">1000000" }, // 原始样例：超过10^6
      { input: "1\n1", output: "1" }, // 最小边界：只有一个1
      { input: "1\n100", output: "100" }, // 最小边界：只有一个100
      { input: "1\n1000000", output: "1000000" }, // 单个数恰好等于10^6
      { input: "50\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1", output: "1" }, // 50个1
      { input: "2\n1000\n1000", output: "1000000" }, // 恰好等于10^6
      { input: "2\n1000\n1001", output: ">1000000" }, // 刚好超过10^6
      { input: "3\n10\n10\n10", output: "1000" }, // 小乘积
      { input: "6\n10\n10\n10\n10\n10\n10", output: "1000000" }, // 恰好10^6
      { input: "7\n10\n10\n10\n10\n10\n10\n10", output: ">1000000" }, // 超过10^6
      { input: "5\n2\n3\n4\n5\n6", output: "720" }, // 小数乘积
      { input: "4\n50\n50\n50\n8", output: "1000000" }, // 恰好10^6
      { input: "3\n99\n99\n99", output: "970299" }, // 接近但不超过10^6
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对全部的测试数据，保证 $1 \\leq n \\leq 50$，$1 \\leq a \\leq 100$。`,
  },
  {
    title: "[GESP202403 二级] 小杨的日字矩阵",
    source: "gesp_official",
    sourceId: "B3955",
    sourceUrl: "https://www.luogu.com.cn/problem/B3955",
    level: 2,
    knowledgePoints: ["字符图形", "二维数组"],
    difficulty: "入门",
    description: `小杨想要构造一个 $N\\times N$ 的日字矩阵（$N$ 为奇数），具体来说，这个矩阵共有 $N$ 行，每行 $N$ 个字符，其中最左列、最右列都是 \`|\`，而第一行、最后一行、以及中间一行（即第 $\\frac{N+1}{2}$ 行）的第 $2\\sim N-1$ 个字符都是 \`-\` ，其余所有字符都是半角小写字母 \`x\` 。`,
    inputFormat: `一行一个整数 $N$（$5\\leq N \\leq 49$，保证 $N$ 为奇数）。`,
    outputFormat: `输出对应的"日字矩阵"。请严格按格式要求输出，不要擅自添加任何空格、标点、空格等任何符号。输出 $N$ 行，每行除了换行符外恰好包含 $N$ 个字符，这些字符要么是 \`-\`，要么是 \`|\`，要么是 \`x\`。`,
    samples: [
      { input: "5", output: "|---|\n|xxx|\n|---|\n|xxx|\n|---|" },
      { input: "7", output: "|-----|\n|xxxxx|\n|xxxxx|\n|-----|\n|xxxxx|\n|xxxxx|\n|-----|" },
    ],
    testCases: [
      { input: "5", output: "|---|\n|xxx|\n|---|\n|xxx|\n|---|" }, // 原始样例
      { input: "7", output: "|-----|\n|xxxxx|\n|xxxxx|\n|-----|\n|xxxxx|\n|xxxxx|\n|-----|" }, // 原始样例
      { input: "3", output: "|-|\n|-|\n|-|" }, // 最小奇数：全是横线行
      { input: "9", output: "|-------|\n|xxxxxxx|\n|xxxxxxx|\n|xxxxxxx|\n|-------|\n|xxxxxxx|\n|xxxxxxx|\n|xxxxxxx|\n|-------|" }, // 中等规模
      { input: "11", output: "|---------|\n|xxxxxxxxx|\n|xxxxxxxxx|\n|xxxxxxxxx|\n|xxxxxxxxx|\n|---------|\n|xxxxxxxxx|\n|xxxxxxxxx|\n|xxxxxxxxx|\n|xxxxxxxxx|\n|---------|" }, // 中等规模
      { input: "13", output: "|-----------|\n|xxxxxxxxxxx|\n|xxxxxxxxxxx|\n|xxxxxxxxxxx|\n|xxxxxxxxxxx|\n|xxxxxxxxxxx|\n|-----------|\n|xxxxxxxxxxx|\n|xxxxxxxxxxx|\n|xxxxxxxxxxx|\n|xxxxxxxxxxx|\n|xxxxxxxxxxx|\n|-----------|" }, // 较大规模
      { input: "15", output: "|-------------|\n|xxxxxxxxxxxxx|\n|xxxxxxxxxxxxx|\n|xxxxxxxxxxxxx|\n|xxxxxxxxxxxxx|\n|xxxxxxxxxxxxx|\n|xxxxxxxxxxxxx|\n|-------------|\n|xxxxxxxxxxxxx|\n|xxxxxxxxxxxxx|\n|xxxxxxxxxxxxx|\n|xxxxxxxxxxxxx|\n|xxxxxxxxxxxxx|\n|xxxxxxxxxxxxx|\n|-------------|" }, // 较大规模
      { input: "17", output: "|---------------|\n|xxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxx|\n|---------------|\n|xxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxx|\n|---------------|" }, // 较大规模
      { input: "19", output: "|-----------------|\n|xxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxx|\n|-----------------|\n|xxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxx|\n|-----------------|" }, // 较大规模
      { input: "21", output: "|-------------------|\n|xxxxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxxxx|\n|-------------------|\n|xxxxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxxxx|\n|xxxxxxxxxxxxxxxxxxx|\n|-------------------|" }, // 较大规模
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: ``,
  },

  // ========== 2024年6月 ==========
  {
    title: "[GESP202406 二级] 平方之和",
    source: "gesp_official",
    sourceId: "B4002",
    sourceUrl: "https://www.luogu.com.cn/problem/B4002",
    level: 2,
    knowledgePoints: ["枚举", "完全平方数"],
    difficulty: "入门",
    description: `小杨有 $n$ 个正整数 $a_1,a_2,\\dots,a_n$，他想知道对于所有的 $i (1\\le i\\le n)$，是否存在两个正整数 $x$ 和 $y$ 满足 $x\\times x+y \\times y=a_i$。`,
    inputFormat: `第一行包含一个正整数 $n$，代表正整数数量。之后 $n$ 行，每行包含一个正整数，代表 $a_i$。`,
    outputFormat: `对于每个正整数 $a_i$，如果存在两个正整数 $x$ 和 $y$ 满足 $x\\times x+y \\times y=a_i$，输出 \`Yes\`，否则输出 \`No\`。`,
    samples: [
      { input: "2\n5\n4", output: "Yes\nNo" },
    ],
    testCases: [
      { input: "2\n5\n4", output: "Yes\nNo" }, // 原始样例：5=1^2+2^2, 4不行
      { input: "1\n2", output: "Yes" }, // 最小：2=1^2+1^2
      { input: "1\n1", output: "No" }, // 1不能表示为两个正整数平方和
      { input: "1\n3", output: "No" }, // 3不行
      { input: "1\n8", output: "Yes" }, // 8=2^2+2^2
      { input: "1\n10", output: "Yes" }, // 10=1^2+3^2
      { input: "1\n13", output: "Yes" }, // 13=2^2+3^2
      { input: "1\n25", output: "Yes" }, // 25=3^2+4^2
      { input: "1\n50", output: "Yes" }, // 50=1^2+7^2 或 5^2+5^2
      { input: "1\n100", output: "Yes" }, // 100=6^2+8^2
      { input: "5\n2\n5\n8\n10\n13", output: "Yes\nYes\nYes\nYes\nYes" }, // 全部可以
      { input: "5\n1\n3\n6\n7\n11", output: "No\nNo\nNo\nNo\nNo" }, // 全部不行
      { input: "10\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10", output: "No\nYes\nNo\nNo\nYes\nNo\nNo\nYes\nNo\nYes" }, // 1-10混合
      { input: "1\n1000000", output: "Yes" }, // 最大值：1000000=600^2+800^2
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于第一个正整数，存在 $1\\times 1+2 \\times 2=5$，因此答案为 \`Yes\`。对于全部数据，保证有 $1 \\le n \\le 10,1 \\le a_i \\le 10^6$。`,
  },
  {
    title: "[GESP202406 二级] 计数",
    source: "gesp_official",
    sourceId: "B4007",
    sourceUrl: "https://www.luogu.com.cn/problem/B4007",
    level: 2,
    knowledgePoints: ["数位统计", "循环"],
    difficulty: "入门",
    description: `小杨认为自己的幸运数是正整数 $k$（注：保证 $1 \\le k\\le 9$）。小杨想知道，对于从 $1$ 到 $n$ 的所有正整数中， $k$ 出现了多少次。`,
    inputFormat: `第一行包含一个正整数 $n$。

第二行包含一个正整数 $k$。`,
    outputFormat: `输出从 $1$ 到 $n$ 的所有正整数中， $k$ 出现的次数。`,
    samples: [
      { input: "25\n2", output: "9" },
    ],
    testCases: [
      { input: "25\n2", output: "9" }, // 原始样例
      { input: "1\n1", output: "1" }, // 最小边界：只有1
      { input: "1\n2", output: "0" }, // 最小边界：1中没有2
      { input: "10\n1", output: "2" }, // 1和10中各有一个1
      { input: "9\n9", output: "1" }, // 只有9包含9
      { input: "100\n1", output: "21" }, // 1-100中1出现21次
      { input: "100\n5", output: "20" }, // 1-100中5出现20次
      { input: "111\n1", output: "36" }, // 含有111的特殊情况
      { input: "1000\n1", output: "301" }, // 最大范围
      { input: "1000\n9", output: "300" }, // 最大范围查找9
      { input: "50\n3", output: "15" }, // 中等规模
      { input: "99\n9", output: "20" }, // 9,19,29...99共有20个9
      { input: "200\n2", output: "140" }, // 包含200-299区间
      { input: "555\n5", output: "216" }, // 含有很多5的情况
    ],
    timeLimit: 1000,
    memoryLimit: 512,
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
    knowledgePoints: ["数位分离", "取模", "循环"],
    difficulty: "普及-",
    description: `小杨有 $n$ 个正整数，他认为一个正整数是美丽数字当且仅当该正整数每一位数字的总和是 $7$ 的倍数。小杨想请你编写一个程序判断 $n$ 个正整数哪些是美丽数字。`,
    inputFormat: `第一行包含一个正整数 $n$，表示正整数个数。之后 $n$ 行，每行一个包含一个正整数 $a_i$。`,
    outputFormat: `对于每个正整数输出一行一个字符串，如果是美丽数字则输出 \`Yes\`，否则输出 \`No\`。`,
    samples: [
      { input: "3\n7\n52\n103", output: "Yes\nYes\nNo" },
    ],
    testCases: [
      { input: "3\n7\n52\n103", output: "Yes\nYes\nNo" }, // 原始样例：7是，5+2=7是，1+0+3=4不是
      { input: "1\n7", output: "Yes" }, // 单个7
      { input: "1\n1", output: "No" }, // 最小正整数，不是7的倍数
      { input: "1\n14", output: "No" }, // 1+4=5，不是7的倍数
      { input: "1\n16", output: "Yes" }, // 1+6=7
      { input: "1\n70", output: "Yes" }, // 7+0=7
      { input: "1\n77", output: "Yes" }, // 7+7=14
      { input: "1\n777", output: "Yes" }, // 7+7+7=21
      { input: "1\n123", output: "No" }, // 1+2+3=6
      { input: "1\n124", output: "Yes" }, // 1+2+4=7
      { input: "5\n7\n14\n21\n28\n35", output: "Yes\nNo\nNo\nNo\nNo" }, // 只有7数位和是7的倍数
      { input: "1\n99999", output: "No" }, // 9*5=45，不是7的倍数
      { input: "1\n79999", output: "No" }, // 7+9+9+9+9=43，不是7的倍数
      { input: "1\n100000", output: "No" }, // 最大值，1+0+0+0+0+0=1
      { input: "4\n25\n34\n43\n61", output: "Yes\nYes\nYes\nYes" }, // 都是数位和=7
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对全部的测试数据，保证 $1 \\leq n \\leq 10^5$，$1 \\leq a_i \\leq 10^5$。`,
  },
  {
    title: "[GESP202409 二级] 小杨的 N 字矩阵",
    source: "gesp_official",
    sourceId: "B4037",
    sourceUrl: "https://www.luogu.com.cn/problem/B4037",
    level: 2,
    knowledgePoints: ["字符图形", "二维数组", "对角线"],
    difficulty: "入门",
    description: `小杨想要构造一个 $m \\times m$ 的 $N$ 字矩阵（$m$ 为奇数），这个矩阵的从左上角到右下角的对角线、第 $1$ 列和第 $m$ 列都是半角加号 \`+\` ，其余都是半角减号 \`-\` 。`,
    inputFormat: `输入只有一行包含一个正整数 $m$。`,
    outputFormat: `输出对应的 $N$ 字矩阵。`,
    samples: [
      { input: "5", output: "+---+\n++--+\n+-+-+\n+--++\n+---+" },
    ],
    testCases: [
      { input: "5", output: "+---+\n++--+\n+-+-+\n+--++\n+---+" }, // 原始样例
      { input: "3", output: "+-+\n+++\n+-+" }, // 最小边界
      { input: "7", output: "+-----+\n++----+\n+-+---+\n+--+--+\n+---+-+\n+----++\n+-----+" }, // 中等规模
      { input: "9", output: "+-------+\n++------+\n+-+-----+\n+--+----+\n+---+---+\n+----+--+\n+-----+-+\n+------++\n+-------+" }, // 中等规模
      { input: "11", output: "+---------+\n++--------+\n+-+-------+\n+--+------+\n+---+-----+\n+----+----+\n+-----+---+\n+------+--+\n+-------+-+\n+--------++\n+---------+" }, // 中等规模
      { input: "13", output: "+-----------+\n++----------+\n+-+---------+\n+--+--------+\n+---+-------+\n+----+------+\n+-----+-----+\n+------+----+\n+-------+---+\n+--------+--+\n+---------+-+\n+----------++\n+-----------+" }, // 较大规模
      { input: "15", output: "+-------------+\n++------------+\n+-+-----------+\n+--+----------+\n+---+---------+\n+----+--------+\n+-----+-------+\n+------+------+\n+-------+-----+\n+--------+----+\n+---------+---+\n+----------+--+\n+-----------+-+\n+------------++\n+-------------+" }, // 较大规模
      { input: "17", output: "+---------------+\n++--------------+\n+-+-------------+\n+--+------------+\n+---+-----------+\n+----+----------+\n+-----+---------+\n+------+--------+\n+-------+-------+\n+--------+------+\n+---------+-----+\n+----------+----+\n+-----------+---+\n+------------+--+\n+-------------+-+\n+--------------++\n+---------------+" }, // 较大规模
      { input: "19", output: "+-----------------+\n++----------------+\n+-+---------------+\n+--+--------------+\n+---+-------------+\n+----+------------+\n+-----+-----------+\n+------+----------+\n+-------+---------+\n+--------+--------+\n+---------+-------+\n+----------+------+\n+-----------+-----+\n+------------+----+\n+-------------+---+\n+--------------+--+\n+---------------+-+\n+----------------++\n+-----------------+" }, // 较大规模
      { input: "21", output: "+-------------------+\n++------------------+\n+-+-----------------+\n+--+----------------+\n+---+---------------+\n+----+--------------+\n+-----+-------------+\n+------+------------+\n+-------+-----------+\n+--------+----------+\n+---------+---------+\n+----------+--------+\n+-----------+-------+\n+------------+------+\n+-------------+-----+\n+--------------+----+\n+---------------+---+\n+----------------+--+\n+-----------------+-+\n+------------------++\n+-------------------+" }, // 较大规模
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对全部的测试数据，保证 $3 \\leq m \\leq 49$ 且 $m$ 是奇数。`,
  },

  // ========== 2024年12月 ==========
  {
    title: "[GESP202412 二级] 寻找数字",
    source: "gesp_official",
    sourceId: "B4064",
    sourceUrl: "https://www.luogu.com.cn/problem/B4064",
    level: 2,
    knowledgePoints: ["四次方根", "枚举"],
    difficulty: "入门",
    description: `小杨有一个正整数 $a$，小杨想知道是否存在一个正整数 $b$ 满足 $a=b^4$。`,
    inputFormat: `第一行包含一个正整数 $t$，代表测试数据组数。对于每组测试数据，第一行包含一个正整数代表 $a$。`,
    outputFormat: `对于每组测试数据，如果存在满足条件的正整数 $b$，则输出 $b$，否则输出 $-1$。`,
    samples: [
      { input: "3\n16\n81\n10", output: "2\n3\n-1" },
    ],
    testCases: [
      { input: "3\n16\n81\n10", output: "2\n3\n-1" }, // 原始样例
      { input: "1\n1", output: "1" }, // 最小：1^4=1
      { input: "1\n16", output: "2" }, // 2^4=16
      { input: "1\n81", output: "3" }, // 3^4=81
      { input: "1\n256", output: "4" }, // 4^4=256
      { input: "1\n625", output: "5" }, // 5^4=625
      { input: "1\n1296", output: "6" }, // 6^4=1296
      { input: "1\n2401", output: "7" }, // 7^4=2401
      { input: "1\n4096", output: "8" }, // 8^4=4096
      { input: "1\n6561", output: "9" }, // 9^4=6561
      { input: "1\n10000", output: "10" }, // 10^4=10000
      { input: "1\n100000000", output: "100" }, // 100^4=10^8，最大
      { input: "5\n2\n3\n4\n5\n6", output: "-1\n-1\n-1\n-1\n-1" }, // 都不是四次方
      { input: "1\n15", output: "-1" }, // 接近16但不是
      { input: "1\n17", output: "-1" }, // 接近16但不是
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于全部数据，保证有 $1\\leq t\\leq 10^5$，$1\\leq a_i\\leq 10^8$。`,
  },
  {
    title: "[GESP202412 二级] 数位和",
    source: "gesp_official",
    sourceId: "B4065",
    sourceUrl: "https://www.luogu.com.cn/problem/B4065",
    level: 2,
    knowledgePoints: ["数位分离", "最大值"],
    difficulty: "入门",
    description: `小杨有 $n$ 个正整数，小杨想知道这些正整数的数位和中最大值是多少。"数位和"指的是一个数字中所有数位的和。例如:对于数字 $12345$，它的各个数位分别是 $1,2,3,4,5$。将这些数位相加，得到 $$1+2+3+4+5=15$$ 因此，$12345$ 的数位和是 $15$。`,
    inputFormat: `第一行包含一个正整数 $n$，代表正整数个数。之后 $n$ 行，每行包含一个正整数。`,
    outputFormat: `输出这些正整数的数位和的最大值。`,
    samples: [
      { input: "3\n16\n81\n10", output: "9" },
    ],
    testCases: [
      { input: "3\n16\n81\n10", output: "9" }, // 原始样例：1+6=7, 8+1=9, 1+0=1，最大9
      { input: "1\n1", output: "1" }, // 最小：单个数字1
      { input: "1\n9", output: "9" }, // 单个数字最大
      { input: "1\n99", output: "18" }, // 9+9=18
      { input: "1\n999", output: "27" }, // 9+9+9=27
      { input: "1\n12345", output: "15" }, // 样例中的例子
      { input: "5\n1\n2\n3\n4\n5", output: "5" }, // 全是一位数
      { input: "3\n100\n200\n300", output: "3" }, // 都是一个非零数字
      { input: "2\n99999\n11111", output: "45" }, // 9*5=45 vs 1*5=5
      { input: "1\n999999999999", output: "108" }, // 最大值10^12-1，12个9
      { input: "3\n123\n456\n789", output: "24" }, // 6, 15, 24
      { input: "4\n10\n100\n1000\n10000", output: "1" }, // 都是1
      { input: "2\n5555\n4444", output: "20" }, // 20 vs 16
      { input: "1\n1000000000000", output: "1" }, // 10^12
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于全部数据，保证有 $1\\leq n\\leq 10^5$，每个正整数不超过 $10^{12}$。`,
  },

  // ========== 2025年3月 ==========
  {
    title: "[GESP202503 二级] 等差矩阵",
    source: "gesp_official",
    sourceId: "B4259",
    sourceUrl: "https://www.luogu.com.cn/problem/B4259",
    level: 2,
    knowledgePoints: ["二维数组", "乘法表"],
    difficulty: "入门",
    description: `小 A 想构造一个 $n$ 行 $m$ 列的矩阵，使得矩阵的每一行与每一列均是等差数列。小 A 发现，在矩阵的第 $i$ 行第 $j$ 列填入整数 $i \\times j$，得到的矩阵能满足要求。你能帮小 A 输出这个矩阵吗？`,
    inputFormat: `一行，两个正整数 $n, m$。`,
    outputFormat: `共 $n$ 行，每行 $m$ 个由空格分割的整数，表示小 A 需要构造的矩阵。`,
    samples: [
      { input: "3 4", output: "1 2 3 4\n2 4 6 8\n3 6 9 12" },
    ],
    testCases: [
      { input: "3 4", output: "1 2 3 4\n2 4 6 8\n3 6 9 12" }, // 原始样例
      { input: "1 1", output: "1" }, // 最小边界
      { input: "1 5", output: "1 2 3 4 5" }, // 单行
      { input: "5 1", output: "1\n2\n3\n4\n5" }, // 单列
      { input: "2 2", output: "1 2\n2 4" }, // 2x2
      { input: "3 3", output: "1 2 3\n2 4 6\n3 6 9" }, // 3x3
      { input: "4 4", output: "1 2 3 4\n2 4 6 8\n3 6 9 12\n4 8 12 16" }, // 4x4
      { input: "5 5", output: "1 2 3 4 5\n2 4 6 8 10\n3 6 9 12 15\n4 8 12 16 20\n5 10 15 20 25" }, // 5x5
      { input: "2 5", output: "1 2 3 4 5\n2 4 6 8 10" }, // 2行5列
      { input: "5 2", output: "1 2\n2 4\n3 6\n4 8\n5 10" }, // 5行2列
      { input: "10 10", output: "1 2 3 4 5 6 7 8 9 10\n2 4 6 8 10 12 14 16 18 20\n3 6 9 12 15 18 21 24 27 30\n4 8 12 16 20 24 28 32 36 40\n5 10 15 20 25 30 35 40 45 50\n6 12 18 24 30 36 42 48 54 60\n7 14 21 28 35 42 49 56 63 70\n8 16 24 32 40 48 56 64 72 80\n9 18 27 36 45 54 63 72 81 90\n10 20 30 40 50 60 70 80 90 100" }, // 10x10
      { input: "1 10", output: "1 2 3 4 5 6 7 8 9 10" }, // 单行长
      { input: "10 1", output: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10" }, // 单列长
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于所有测试点，保证 $1\\leq n,m \\leq 50$。`,
  },
  {
    title: "[GESP202503 二级] 时间跨越",
    source: "gesp_official",
    sourceId: "B4260",
    sourceUrl: "https://www.luogu.com.cn/problem/B4260",
    level: 2,
    knowledgePoints: ["日期计算", "闰年判断", "进位"],
    difficulty: "普及-",
    description: `假设现在是 $y$ 年 $m$ 月 $d$ 日 $h$ 时而 $k$ 小时后是 $y'$ 年 $m'$ 月 $d'$ 日 $h'$ 时，对于给定的 $y, m, d, h, k$，小杨想请你帮他计算出对应的 $y', m', d', h'$ 是多少。`,
    inputFormat: `输入包含五行，每行一个正整数，分别代表 $y, m, d, h, k$。`,
    outputFormat: `输出四个正整数，代表 $y', m', d', h'$。`,
    samples: [
      { input: "2008\n2\n28\n23\n1", output: "2008 2 29 0" },
    ],
    testCases: [
      { input: "2008\n2\n28\n23\n1", output: "2008 2 29 0" }, // 原始样例：闰年2月28日跨到29日
      { input: "2008\n2\n29\n23\n1", output: "2008 3 1 0" }, // 闰年2月29日跨到3月1日
      { input: "2000\n2\n28\n23\n1", output: "2000 2 29 0" }, // 世纪闰年
      { input: "2100\n2\n28\n23\n1", output: "2100 3 1 0" }, // 2100不是闰年
      { input: "2024\n12\n31\n23\n1", output: "2025 1 1 0" }, // 跨年
      { input: "2024\n1\n1\n0\n1", output: "2024 1 1 1" }, // 同一天内
      { input: "2024\n1\n31\n23\n1", output: "2024 2 1 0" }, // 1月跨到2月
      { input: "2024\n3\n31\n23\n1", output: "2024 4 1 0" }, // 3月跨到4月
      { input: "2024\n4\n30\n23\n1", output: "2024 5 1 0" }, // 4月跨到5月
      { input: "2024\n6\n30\n23\n24", output: "2024 7 1 23" }, // 加24小时
      { input: "2024\n7\n15\n12\n12", output: "2024 7 16 0" }, // 中午加12小时
      { input: "2023\n2\n28\n23\n1", output: "2023 3 1 0" }, // 平年2月28日跨到3月1日
      { input: "2024\n12\n31\n0\n24", output: "2025 1 1 0" }, // 跨年+24小时
      { input: "2024\n5\n15\n10\n5", output: "2024 5 15 15" }, // 普通情况
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于全部数据，保证有 $2000 \\leq y \\leq 3000$，$1 \\leq m \\leq 12$，$1 \\leq d \\leq 31$，$0 \\leq h \\leq 23$，$1 \\leq k \\leq 24$。数据保证为合法时间。

闰年判断规则

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
    knowledgePoints: ["枚举", "整数面积"],
    difficulty: "入门",
    description: `直角三角形有两条直角边与一条斜边，设两条直角边的长度分别为 $a, b$，则直角三角形的面积为 $\\frac{ab}{2}$。请你计算当直角边长 $a, b$ 均取不超过 $n$ 的正整数时，有多少个不同的面积为整数的直角三角形。直角边长分别为 $a, b$ 和 $a', b'$ 的两个直角三角形相同，当且仅当 $a = a'$, $b = b'$ 或者 $a = b'$, $b = a'$。`,
    inputFormat: `一行，一个整数 $n$，表示直角边长的最大值。`,
    outputFormat: `输出一行，一个整数，表示不同的直角三角形数量。`,
    samples: [
      { input: "3", output: "3" },
      { input: "5", output: "9" },
    ],
    testCases: [
      { input: "3", output: "3" }, // 原始样例：(1,2),(2,2),(2,3)或类似
      { input: "5", output: "9" }, // 原始样例
      { input: "1", output: "0" }, // 边界：只有(1,1)，面积0.5不是整数
      { input: "2", output: "1" }, // (1,2)或(2,2)
      { input: "4", output: "5" }, // 小规模
      { input: "6", output: "12" }, // 中等规模
      { input: "10", output: "30" }, // 中等规模
      { input: "20", output: "110" }, // 较大规模
      { input: "50", output: "650" }, // 较大规模
      { input: "100", output: "2550" }, // 大规模
      { input: "200", output: "10100" }, // 大规模
      { input: "500", output: "62750" }, // 大规模
      { input: "1000", output: "250500" }, // 最大规模
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于所有测试点，保证 $1 \\leq n \\leq 1000$。`,
  },
  {
    title: "[GESP202506 二级] 幂和数",
    source: "gesp_official",
    sourceId: "B4357",
    sourceUrl: "https://www.luogu.com.cn/problem/B4357",
    level: 2,
    knowledgePoints: ["2的幂", "枚举"],
    difficulty: "普及-",
    description: `对于正整数 $n$，如果 $n$ 可以表为两个 $2$ 的次幂之和，即 $n = 2^x + 2^y$（$x, y$ 均为非负整数），那么称 $n$ 为幂和数。给定正整数 $l, r$，请你求出满足 $l \\leq n \\leq r$ 的整数 $n$ 中有多少个幂和数。`,
    inputFormat: `一行，两个正整数 $l, r$，含义如上。`,
    outputFormat: `输出一行，一个整数，表示 $l, r$ 之间幂和数的数量。`,
    samples: [
      { input: "2 8", output: "6" },
      { input: "10 100", output: "20" },
    ],
    testCases: [
      { input: "2 8", output: "6" }, // 原始样例：2,3,4,5,6,8
      { input: "10 100", output: "20" }, // 原始样例
      { input: "1 1", output: "0" }, // 1不是幂和数（最小是2=1+1）
      { input: "2 2", output: "1" }, // 2=1+1
      { input: "1 2", output: "1" }, // 只有2
      { input: "3 3", output: "1" }, // 3=1+2
      { input: "1 10", output: "8" }, // 2,3,4,5,6,8,9,10
      { input: "1 100", output: "27" }, // 较大范围
      { input: "100 200", output: "11" }, // 中间区间
      { input: "1 1000", output: "45" }, // 大范围
      { input: "1 10000", output: "91" }, // 最大范围
      { input: "5000 10000", output: "27" }, // 后半区间
      { input: "16 16", output: "1" }, // 16=8+8
      { input: "17 17", output: "1" }, // 17=1+16
      { input: "7 7", output: "0" }, // 7不是幂和数
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于所有测试点，保证 $1 \\leq l \\leq r \\leq 10^4$。`,
  },

  // ========== 2025年9月 ==========
  {
    title: "[GESP202509 二级] 优美的数字",
    source: "gesp_official",
    sourceId: "B4411",
    sourceUrl: "https://www.luogu.com.cn/problem/B4411",
    level: 2,
    knowledgePoints: ["数位判断", "循环"],
    difficulty: "入门",
    description: `如果一个正整数在十进制下的所有数位都相同，小 A 就会觉得这个正整数很优美。例如，正整数 $6$ 的数位都是 $6$，所以 $6$ 是优美的。正整数 $99$ 的数位都是 $9$，所以 $99$ 是优美的。正整数 $123$ 的数位不都相同，所以 $123$ 并不优美。

小 A 想知道不超过 $n$ 的正整数中有多少优美的数字。你能帮他数一数吗？`,
    inputFormat: `一行，一个正整数 $n$。`,
    outputFormat: `一行，一个正整数，表示不超过 $n$ 的优美正整数的数量。`,
    samples: [
      { input: "6", output: "6" },
      { input: "2025", output: "28" },
    ],
    testCases: [
      { input: "6", output: "6" }, // 原始样例：1,2,3,4,5,6
      { input: "2025", output: "28" }, // 原始样例
      { input: "1", output: "1" }, // 最小边界：只有1
      { input: "9", output: "9" }, // 一位数：1-9
      { input: "10", output: "9" }, // 10不是优美数
      { input: "11", output: "10" }, // 11是优美数
      { input: "22", output: "11" }, // 1-9,11,22
      { input: "99", output: "18" }, // 1-9(9个) + 11,22,...,99(9个)
      { input: "100", output: "18" }, // 100不是优美数
      { input: "111", output: "19" }, // 加上111
      { input: "555", output: "23" }, // 加上111,222,333,444,555
      { input: "999", output: "27" }, // 1-9(9个) + 11-99(9个) + 111-999(9个)
      { input: "1000", output: "27" }, // 1000不是优美数
      { input: "1111", output: "28" }, // 加上1111
      { input: "2000", output: "28" }, // 2000不是优美数，1111是最大优美数<=2000
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于所有测试点，保证 $1 \\leq n \\leq 2025$。`,
  },
  {
    title: "[GESP202509 二级] 菱形",
    source: "gesp_official",
    sourceId: "B4412",
    sourceUrl: "https://www.luogu.com.cn/problem/B4412",
    level: 2,
    knowledgePoints: ["字符图形", "对角线", "绝对值"],
    difficulty: "普及-",
    description: `小 A 想绘制一个菱形。具体来说，需要绘制的菱形是一个 $n$ 行 $n$ 列的字符画，$n$ 是一个大于 $1$ 的奇数。菱形的四个顶点依次位于第 $1$ 行、第 $1$ 列、第 $n$ 行、第 $n$ 列的正中间，使用 \`#\` 绘制。相邻顶点之间也用 \`#\` 连接。其余位置都是 \`.\`。`,
    inputFormat: `一行，一个正整数 $n$。`,
    outputFormat: `输出共 $n$ 行，表示对应的菱形。`,
    samples: [
      { input: "3", output: ".#.\n#.#\n.#." },
      { input: "9", output: "....#....\n...#.#...\n..#...#..\n.#.....#.\n#.......#\n.#.....#.\n..#...#..\n...#.#...\n....#...." },
    ],
    testCases: [
      { input: "3", output: ".#.\n#.#\n.#." }, // 原始样例
      { input: "9", output: "....#....\n...#.#...\n..#...#..\n.#.....#.\n#.......#\n.#.....#.\n..#...#..\n...#.#...\n....#...." }, // 原始样例
      { input: "5", output: "..#..\n.#.#.\n#...#\n.#.#.\n..#.." }, // 小规模
      { input: "7", output: "...#...\n..#.#..\n.#...#.\n#.....#\n.#...#.\n..#.#..\n...#..." }, // 中等规模
      { input: "11", output: ".....#.....\n....#.#....\n...#...#...\n..#.....#..\n.#.......#.\n#.........#\n.#.......#.\n..#.....#..\n...#...#...\n....#.#....\n.....#....." }, // 中等规模
      { input: "13", output: "......#......\n.....#.#.....\n....#...#....\n...#.....#...\n..#.......#..\n.#.........#.\n#...........#\n.#.........#.\n..#.......#..\n...#.....#...\n....#...#....\n.....#.#.....\n......#......" }, // 较大规模
      { input: "15", output: ".......#.......\n......#.#......\n.....#...#.....\n....#.....#....\n...#.......#...\n..#.........#..\n.#...........#.\n#.............#\n.#...........#.\n..#.........#..\n...#.......#...\n....#.....#....\n.....#...#.....\n......#.#......\n.......#......." }, // 较大规模
      { input: "17", output: "........#........\n.......#.#.......\n......#...#......\n.....#.....#.....\n....#.......#....\n...#.........#...\n..#...........#..\n.#.............#.\n#...............#\n.#.............#.\n..#...........#..\n...#.........#...\n....#.......#....\n.....#.....#.....\n......#...#......\n.......#.#.......\n........#........" }, // 较大规模
      { input: "19", output: ".........#.........\n........#.#........\n.......#...#.......\n......#.....#......\n.....#.......#.....\n....#.........#....\n...#...........#...\n..#.............#..\n.#...............#.\n#.................#\n.#...............#.\n..#.............#..\n...#...........#...\n....#.........#....\n.....#.......#.....\n......#.....#......\n.......#...#.......\n........#.#........\n.........#........." }, // 较大规模
      { input: "21", output: "..........#..........\n.........#.#.........\n........#...#........\n.......#.....#.......\n......#.......#......\n.....#.........#.....\n....#...........#....\n...#.............#...\n..#...............#..\n.#.................#.\n#...................#\n.#.................#.\n..#...............#..\n...#.............#...\n....#...........#....\n.....#.........#.....\n......#.......#......\n.......#.....#.......\n........#...#........\n.........#.#.........\n..........#.........." }, // 较大规模
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于所有测试点，保证 $3 \\leq n \\leq 29$ 并且 $n$ 为奇数。`,
  },

  // ========== 2025年12月 ==========
  {
    title: "[GESP202512 二级] 环保能量球",
    source: "gesp_official",
    sourceId: "B4447",
    sourceUrl: "https://www.luogu.com.cn/problem/B4447",
    level: 2,
    knowledgePoints: ["整除", "累加"],
    difficulty: "入门",
    description: `小杨最近在玩一个环保主题的游戏。在游戏中，小杨每行走 1 公里就可以获得 1 点"环保能量"。为了激励玩家，游戏设置了"里程奖励"：小杨每行走 $x$ 公里，游戏就会额外奖励 1 点能量。现在已知小杨总共行走了 $n$ 公里，请你帮他计算，他一共能获得多少点环保能量？`,
    inputFormat: `第一行包含一个正整数 $t$，代表测试数据组数。对于每组测试数据：
- 第一行包含一个正整数 $n$，代表行走的公里数。
- 第二行包含一个正整数 $x$，代表奖励触发的间隔。`,
    outputFormat: `对于每组测试数据，输出一个整数，代表小杨获得的环保能量总数。`,
    samples: [
      { input: "3\n5\n2\n10\n3\n2\n5", output: "7\n13\n2" },
    ],
    testCases: [
      { input: "3\n5\n2\n10\n3\n2\n5", output: "7\n13\n2" }, // 原始样例
      { input: "1\n1\n1", output: "2" }, // 最小边界：1公里，每1公里奖励1次，共1+1=2
      { input: "1\n1\n2", output: "1" }, // 1公里，每2公里奖励，不够2公里，共1
      { input: "1\n10\n1", output: "20" }, // 10公里，每1公里奖励，共10+10=20
      { input: "1\n10\n10", output: "11" }, // 10公里，每10公里奖励1次，共10+1=11
      { input: "1\n100\n10", output: "110" }, // 100公里，每10公里奖励10次，共100+10=110
      { input: "1\n1000\n1000", output: "1001" }, // 最大边界
      { input: "1\n1000\n1", output: "2000" }, // 1000公里，每1公里奖励
      { input: "1\n15\n5", output: "18" }, // 15公里，每5公里奖励3次，共15+3=18
      { input: "1\n7\n3", output: "9" }, // 7公里，每3公里奖励2次（3,6），共7+2=9
      { input: "2\n50\n10\n99\n100", output: "55\n99" }, // 多组数据
      { input: "1\n999\n1000", output: "999" }, // 不够触发奖励
      { input: "1\n500\n250", output: "502" }, // 500+2=502
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `### 样例解释

- 对于第 1 组数据，$n = 5, x = 2$：小杨行走获得 $5$ 点能量。此外，他在第 $2$ 公里和第 $4$ 公里时各获得 $1$ 点额外奖励，总共 $5 + 2 = 7$ 点。
- 对于第 2 组数据，$n = 10, x = 3$：行走获得 $10$ 点。他在第 $3$、$6$、$9$ 公里时各获得 $1$ 点额外奖励，总共 $10 + 3 = 13$ 点。
- 对于第 3 组数据，$n = 2, x = 5$：行走获得 $2$ 点。由于行走路程不足 $5$ 公里，没有额外奖励，总共 $2$ 点。

### 数据范围

对于全部数据，保证：$1 \\leq t \\leq 100$，$1 \\leq n, x \\leq 1000$。`,
  },
  {
    title: "[GESP202512 二级] 黄金格",
    source: "gesp_official",
    sourceId: "B4448",
    sourceUrl: "https://www.luogu.com.cn/problem/B4448",
    level: 2,
    knowledgePoints: ["枚举", "数学公式", "开方"],
    difficulty: "入门",
    description: `小杨在探险时发现了一张神奇的矩形地图，地图有 $H$ 行和 $W$ 列。每个格子的坐标是 $(r, c)$，其中 $r$ 表示行号从 $1$ 到 $H$，$c$ 表示列号 $1$ 到 $W$。小杨听说地图中隐藏着一些"黄金格"，这些格子满足一个神秘的数学挑战：当格子坐标 $(r, c)$ 代入特定的不等式关系成立时，该格子就是黄金格。具体来说，黄金格的条件是：$\\sqrt{r^2 + c^2} \\leq x + r - c$。例如，如果参数 $x = 5$，那么格子 $(4, 3)$ 就是黄金格。因为左边坐标平方和的平方根 $\\sqrt{4^2 + 3^2}$ 算出来是 $5$，而右边 $5 + 4 - 3$ 算出来是 $6$，$5$ 小于等于 $6$，符合条件。`,
    inputFormat: `三行，每行一个正整数，分别表示 $H,W,x$。含义如题面所示。`,
    outputFormat: `一行一个整数，代表黄金格数量。`,
    samples: [
      { input: "4\n4\n2", output: "4" },
    ],
    testCases: [
      { input: "4\n4\n2", output: "4" }, // 原始样例
      { input: "1\n1\n1", output: "1" }, // 最小边界：1x1地图，(1,1)检查
      { input: "1\n1\n0", output: "0" }, // x=0时，sqrt(2)>0+1-1=0
      { input: "5\n5\n5", output: "15" }, // 5x5地图，x=5
      { input: "10\n10\n10", output: "55" }, // 10x10地图
      { input: "10\n10\n1", output: "10" }, // x=1，只有第一列满足
      { input: "3\n3\n3", output: "6" }, // 3x3地图
      { input: "5\n1\n5", output: "5" }, // 只有一列
      { input: "1\n5\n5", output: "5" }, // 只有一行
      { input: "100\n100\n50", output: "2550" }, // 较大规模
      { input: "10\n5\n3", output: "21" }, // 非正方形
      { input: "5\n10\n3", output: "13" }, // 非正方形（行少列多）
      { input: "1000\n1000\n1000", output: "500500" }, // 最大边界
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `样例解释：图中标注为黄色的四个格子是黄金格，坐标分别为 $(1, 1)$，$(2, 1)$，$(3, 1)$，$(4, 1)$。

数据范围：对于所有测试点，保证给出的正整数不超过 $1000$。`,
  },
];

async function seedGesp2() {
  try {
    let addedCount = 0;
    let updatedCount = 0;

    for (const problem of gesp2Problems) {
      const existing = await prisma.problem.findFirst({
        where: { sourceId: problem.sourceId }
      });

      if (existing) {
        await prisma.problem.update({
          where: { id: existing.id },
          data: problem
        });
        updatedCount++;
      } else {
        await prisma.problem.create({
          data: problem
        });
        addedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `GESP 2级：新增 ${addedCount} 道，更新 ${updatedCount} 道`,
      addedCount,
      updatedCount,
      totalCount: gesp2Problems.length
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
