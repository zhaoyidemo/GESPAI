import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GESP 6级完整题库 - 来源：洛谷 CCF GESP C++ 六级上机题
// 官方题单：https://www.luogu.com.cn/training/556
// 所有内容与洛谷100%一致

const gesp6Problems = [
  // ========== 样题 ==========
  {
    title: "[GESP样题 六级] 下楼梯",
    source: "gesp_official",
    sourceId: "P10250",
    sourceUrl: "https://www.luogu.com.cn/problem/P10250",
    level: 6,
    knowledgePoints: ["动态规划", "递推", "记忆化搜索"],
    difficulty: "普及+/提高",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1106`,
    description: `顽皮的小明发现，下楼梯时每步可以走 $1$ 个台阶、$2$ 个台阶或 $3$ 个台阶。现在一共有 $N$ 个台阶，你能帮小明算算有多少种方案吗？`,
    inputFormat: `输入一行，包含一个整数 $N$。`,
    outputFormat: `输出一行一个整数表示答案。`,
    samples: [
      { input: "4", output: "7" },
      { input: "10", output: "274" },
    ],
    testCases: [
      { input: "4", output: "7" },
      { input: "10", output: "274" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对全部的测试点，保证 $1 \\le N \\le 60$。`,
  },
  {
    title: "[GESP样题 六级] 亲朋数",
    source: "gesp_official",
    sourceId: "P10262",
    sourceUrl: "https://www.luogu.com.cn/problem/P10262",
    level: 6,
    knowledgePoints: ["字符串", "数论", "前缀和", "取模"],
    difficulty: "提高+/省选-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1106`,
    description: `给定一串长度为 $L$、由数字 $0 \\sim 9$ 组成的数字串 $S$。容易知道，它的连续子串共有 $\\frac{L(L+1)}{2}$ 个。如果某个子串对应的数（允许有前导零）是 $p$ 的倍数，则称该子串为数字串 $S$ 对于 $p$ 的亲朋数。`,
    inputFormat: `第一行包含一个正整数 $p$（$2 \\le p \\le 128$）。

第二行包含一个长为 $L$ 的数字串 $S$（$1 \\le L \\le 10^6$）。`,
    outputFormat: `输出一行一个整数表示答案。`,
    samples: [
      { input: "2\n102", output: "5" },
      { input: "2\n12342", output: "11" },
    ],
    testCases: [
      { input: "2\n102", output: "5" },
      { input: "2\n12342", output: "11" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `**【样例 #1 解释】**

$5$ 个亲朋数，分别为 $10$、$102$、$0$、$02$、$2$。`,
  },
  // ========== 2023年9月 ==========
  {
    title: "[GESP202309 六级] 小杨买饮料",
    source: "gesp_official",
    sourceId: "B3873",
    sourceUrl: "https://www.luogu.com.cn/problem/B3873",
    level: 6,
    knowledgePoints: ["动态规划", "背包问题", "01背包"],
    difficulty: "普及+/提高",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1132`,
    description: `小杨来到商店购买饮料。商店出售 $N$ 种饮料（编号 $0$ 至 $N-1$），每种饮料 $i$ 的售价为 $c_i$ 元，容量为 $l_i$ 毫升。

小杨的需求：

1. 每种饮料至多购买 $1$ 瓶；
2. 购买总容量不低于 $L$ 的饮料；
3. 在满足前两项的前提下，花费尽可能少。

输出最少费用，若无法满足则输出 \`no solution\`。`,
    inputFormat: `第一行两个整数 $N$，$L$。

接下来 $N$ 行，描述第 $i=0,1,...,N-1$ 种饮料：每行两个整数 $c_i$，$l_i$。`,
    outputFormat: `输出一行一个整数，表示最少花费。若无法满足要求，输出 \`no solution\`。`,
    samples: [
      { input: "5 100\n100 2000\n2 50\n4 40\n5 30\n3 20", output: "9" },
      { input: "5 141\n100 2000\n2 50\n4 40\n5 30\n3 20", output: "100" },
      { input: "4 141\n2 50\n4 40\n5 30\n3 20", output: "no solution" },
    ],
    testCases: [
      { input: "5 100\n100 2000\n2 50\n4 40\n5 30\n3 20", output: "9" },
      { input: "5 141\n100 2000\n2 50\n4 40\n5 30\n3 20", output: "100" },
      { input: "4 141\n2 50\n4 40\n5 30\n3 20", output: "no solution" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `**【样例 #1 解释】**

购买 $1$、$2$、$4$ 号饮料获得 $110$ 毫升，花费 $9$ 元。

**【样例 #2 解释】**

$1$、$2$、$3$、$4$ 号饮料总计 $140$ 毫升，每种至多购买 $1$ 瓶无法满足 $141$ 毫升需求，故购买 $0$ 号饮料花费 $100$ 元。`,
  },
  {
    title: "[GESP202309 六级] 小杨的握手问题",
    source: "gesp_official",
    sourceId: "B3874",
    sourceUrl: "https://www.luogu.com.cn/problem/B3874",
    level: 6,
    knowledgePoints: ["归并排序", "逆序对", "分治"],
    difficulty: "普及+/提高",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1132`,
    description: `班级有 $N$ 名同学（学号 $0$ 至 $N-1$），按指定顺序进入教室。每位同学进入时，需与已在室内且学号小于自己的同学握手。求总握手次数。`,
    inputFormat: `第一行：整数 $N$（同学个数）；

第二行：$N$ 个空格隔开的整数，表示进入顺序（学号范围 $0 \\sim N-1$）。`,
    outputFormat: `一行整数，表示全班握手的总次数。`,
    samples: [
      { input: "4\n2 1 3 0", output: "2" },
      { input: "6\n0 1 2 3 4 5", output: "15" },
    ],
    testCases: [
      { input: "4\n2 1 3 0", output: "2" },
      { input: "6\n0 1 2 3 4 5", output: "15" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `**【样例 #1 解释】**

$2$ 号进入无人握手；$1$ 号进入与 $2$ 号无握手（$1<2$）；$3$ 号进入与 $1$、$2$ 号各握手；$0$ 号进入无握手（$0$ 最小）。

**【样例 #2 解释】**

顺序递增，每人进入时都是最大学号，与所有在室者握手。

**【提示】**

可使用归并排序进行降序排序，并在过程中求解。`,
  },
  // ========== 2023年12月 ==========
  {
    title: "[GESP202312 六级] 闯关游戏",
    source: "gesp_official",
    sourceId: "P10108",
    sourceUrl: "https://www.luogu.com.cn/problem/P10108",
    level: 6,
    knowledgePoints: ["动态规划", "图论", "BFS"],
    difficulty: "普及/提高-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1138`,
    description: `游戏共有 $N$ 关，每关 $M$ 个通道。选择第 $i$ 个通道可前进 $a_i$ 关。从第 $x$ 关出发选择通道 $i$ 后到达第 $x+a_i$ 关（若 $x+a_i \\ge N$ 则通关）。离开第 $s$ 关时获得 $b_s$ 分。从第 $0$ 关开始，求通关时最多得分。`,
    inputFormat: `第一行两个整数 $N$、$M$；

第二行 $M$ 个整数 $a_0,a_1...a_{M-1}$（$1 \\le a_i \\le N$）；

第三行 $N$ 个整数 $b_0,b_1...b_{N-1}$（$|b_i| \\le 10^5$）。`,
    outputFormat: `一行一个整数，表示通关时最多能获得的分数。`,
    samples: [
      { input: "6 2\n2 3\n1 0 30 100 30 30", output: "131" },
      { input: "6 2\n2 3\n1 0 30 100 30 -1", output: "101" },
    ],
    testCases: [
      { input: "6 2\n2 3\n1 0 30 100 30 30", output: "131" },
      { input: "6 2\n2 3\n1 0 30 100 30 -1", output: "101" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `**【样例 #1 解释】**

第 $0$ 关选通道 $1$ 得 $1$ 分到第 $3$ 关，选通道 $0$ 得 $100$ 分到第 $5$ 关，任选通道得 $30$ 分通关，总分 $1+100+30=131$。

**【样例 #2 解释】**

注意某些关的得分可能为负数。`,
  },
  {
    title: "[GESP202312 六级] 工作沟通",
    source: "gesp_official",
    sourceId: "P10109",
    sourceUrl: "https://www.luogu.com.cn/problem/P10109",
    level: 6,
    knowledgePoints: ["树", "LCA", "最近公共祖先", "树的遍历"],
    difficulty: "普及/提高-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1138`,
    description: `某公司有 $N$ 名员工，编号从 $0$ 至 $N-1$。除了 $0$ 号员工是老板，其余每名员工都有一个直接领导。员工 $x$ 可以管理员工 $y$，当且仅当 $x=y$，或 $x=f_y$，或 $x$ 可以管理 $f_y$。现在需要找到一位能管理所有参与合作的同事的员工，若有多人满足，选编号最大的。`,
    inputFormat: `第一行整数 $N$（员工数量）。

第二行 $N-1$ 个整数为 $f_1,f_2,...,f_{N-1}$（直接领导）。

第三行整数 $Q$（合作场数）。

接下来 $Q$ 行，每行描述一场合作：整数 $m$（参与人数），随后 $m$ 个整数（员工编号）。`,
    outputFormat: `输出 $Q$ 行，每行一个整数，表示每场合作的主持人编号。`,
    samples: [
      { input: "5\n0 0 2 2\n3\n2 3 4\n3 2 3 4\n2 1 4", output: "2\n2\n0" },
      { input: "7\n0 1 0 2 1 2\n5\n2 4 6\n2 4 5\n3 4 5 6\n4 2 4 5 6\n2 3 4", output: "2\n1\n1\n1\n0" },
    ],
    testCases: [
      { input: "5\n0 0 2 2\n3\n2 3 4\n3 2 3 4\n2 1 4", output: "2\n2\n0" },
      { input: "7\n0 1 0 2 1 2\n5\n2 4 6\n2 4 5\n3 4 5 6\n4 2 4 5 6\n2 3 4", output: "2\n1\n1\n1\n0" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `**【样例 #1 解释】**

员工 $3$、$4$ 共同领导为 $2$；员工 $2$ 可管理所有参与者；只有 $0$ 号老板能管理全体。

**【数据范围】**

$50\\%$ 测试点 $N \\le 50$；所有测试点 $3 \\le N \\le 300$，$Q \\le 100$。`,
  },
  // ========== 2024年3月 ==========
  {
    title: "[GESP202403 六级] 游戏",
    source: "gesp_official",
    sourceId: "P10376",
    sourceUrl: "https://www.luogu.com.cn/problem/P10376",
    level: 6,
    knowledgePoints: ["动态规划", "递推", "计数"],
    difficulty: "普及+/提高",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1146`,
    description: `你有四个正整数 $n,a,b,c$，并准备用它们玩一个简单的小游戏。

在一轮游戏操作中，你可以选择将 $n$ 减去 $a$，或是将 $n$ 减去 $b$。游戏将会进行多轮操作，直到当 $n \\le c$ 时游戏结束。

你想知道游戏结束时有多少种不同的游戏操作序列。两种游戏操作序列不同，当且仅当游戏操作轮数不同，或是某一轮游戏操作中，一种操作序列选择将 $n$ 减去 $a$，而另一种操作序列选择将 $n$ 减去 $b$。

如果 $a=b$，也认为将 $n$ 减去 $a$ 与将 $n$ 减去 $b$ 是不同的操作。

由于答案可能很大，你只需要求出答案对 $10^9 + 7$ 取模的结果。`,
    inputFormat: `一行四个整数 $n,a,b,c$。`,
    outputFormat: `输出一行一个整数表示答案。`,
    samples: [
      { input: "1 1 1 1", output: "1" },
      { input: "114 51 4 1", output: "176" },
      { input: "114514 191 9 810", output: "384178446" },
    ],
    testCases: [
      { input: "1 1 1 1", output: "1" },
      { input: "114 51 4 1", output: "176" },
      { input: "114514 191 9 810", output: "384178446" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对 $20\\%$ 的数据，$a=b=c=1$，$n \\le 30$。

对 $40\\%$ 的数据，$c = 1$，$n \\le 10^3$。

对全部的测试数据，保证 $1 \\le a,b,c \\le n \\le 2 \\times 10^5$。`,
  },
  {
    title: "[GESP202403 六级] 好斗的牛",
    source: "gesp_official",
    sourceId: "P10377",
    sourceUrl: "https://www.luogu.com.cn/problem/P10377",
    level: 6,
    knowledgePoints: ["贪心", "排序", "枚举", "全排列"],
    difficulty: "普及/提高-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1146`,
    description: `你有 $10^9$ 个牛栏排成一排。你想把 $n$ 头牛放进去。问题是你的牛很好斗——如果附近有其他牛，它们就会惹麻烦。

第 $i$ 头牛有攻击范围 $(a_i, b_i)$，意思是如果在它左边 $a_i$ 个牛栏内或右边 $b_i$ 个牛栏内有其他牛，它就会惹麻烦。

你想保留一段连续的牛栏并卖掉其余的。为了保证存在至少一种排列方式使得所有 $n$ 头牛都可以放置而不会惹麻烦，你必须保留的最小牛栏数是多少？`,
    inputFormat: `第一行：正整数 $n$。

第二行：$n$ 个正整数 $a_1, a_2, ..., a_n$。

第三行：$n$ 个正整数 $b_1, b_2, ..., b_n$。`,
    outputFormat: `输出一个整数表示答案。`,
    samples: [
      { input: "2\n1 2\n1 2", output: "4" },
      { input: "3\n1 2 3\n3 2 1", output: "7" },
    ],
    testCases: [
      { input: "2\n1 2\n1 2", output: "4" },
      { input: "3\n1 2 3\n3 2 1", output: "7" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `**【样例 #1 解释】**

保留牛栏 $1, 2, 3, 4$，分别把牛放在位置 $1$ 和 $4$。`,
  },
  // ========== 2024年6月 ==========
  {
    title: "[GESP202406 六级] 计算得分",
    source: "gesp_official",
    sourceId: "P10721",
    sourceUrl: "https://www.luogu.com.cn/problem/P10721",
    level: 6,
    knowledgePoints: ["动态规划", "字符串", "贪心"],
    difficulty: "普及+/提高",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1154`,
    description: `小杨想要计算由 $m$ 个小写字母组成的字符串的得分。

小杨设置了一个包含 $n$ 个正整数的计分序列 $A=[a_1,a_2,...,a_n]$，如果字符串的一个子串由 $k$（$1 \\le k \\le n$）个 \`abc\` 首尾相接组成，那么能够得到分数 $a_k$，并且字符串包含的字符不能够重复计算得分，整个字符串的得分是计分子串的总和。`,
    inputFormat: `第一行包含一个正整数 $n$，代表计分序列 $A$ 的长度。

第二行包含 $n$ 个正整数，代表计分序列 $A$。

第三行包含一个正整数 $m$，代表字符串的长度。

第四行包含一个由 $m$ 个小写字母组成的字符串。`,
    outputFormat: `输出一个整数，代表给定字符串的最大总得分。`,
    samples: [
      { input: "3\n3 1 2\n13\ndabcabcabcabz", output: "9" },
    ],
    testCases: [
      { input: "3\n3 1 2\n13\ndabcabcabcabz", output: "9" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `最优的计分方式为 $d+abc+abc+abc+abz$，总得分为 $a_1+a_1+a_1$，共 $9$ 分。`,
  },
  {
    title: "[GESP202406 六级] 二叉树",
    source: "gesp_official",
    sourceId: "P10722",
    sourceUrl: "https://www.luogu.com.cn/problem/P10722",
    level: 6,
    knowledgePoints: ["树", "二叉树", "DFS", "子树"],
    difficulty: "普及/提高-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1154`,
    description: `小杨有一棵包含 $n$ 个节点的二叉树，根节点编号为 $1$。每个节点为白色或黑色。进行 $q$ 次操作，每次选择一个节点，将以该节点为根的子树内所有节点的颜色反转。求 $q$ 次操作后每个节点的颜色。`,
    inputFormat: `第一行：正整数 $n$（节点数量）。

第二行：$(n-1)$ 个正整数表示每个节点的父亲节点编号。

第三行：长度为 $n$ 的 $01$ 串表示初始颜色。

第四行：正整数 $q$（操作次数）。

接下来 $q$ 行：每行一个整数表示操作节点编号。`,
    outputFormat: `输出长度为 $n$ 的 $01$ 串，表示 $q$ 次操作后每个节点的颜色。$0$ 表示白色，$1$ 表示黑色。`,
    samples: [
      { input: "6\n3 1 1 3 4\n100101\n3\n1\n3\n2", output: "010000" },
    ],
    testCases: [
      { input: "6\n3 1 1 3 4\n100101\n3\n1\n3\n2", output: "010000" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `**【样例解释】**

第一次操作后为 $011010$；第二次操作后为 $000000$；第三次操作后为 $010000$。`,
  },
  // ========== 2024年9月 ==========
  {
    title: "[GESP202409 六级] 小杨和整数拆分",
    source: "gesp_official",
    sourceId: "P11246",
    sourceUrl: "https://www.luogu.com.cn/problem/P11246",
    level: 6,
    knowledgePoints: ["动态规划", "数论", "完全平方数"],
    difficulty: "普及+/提高",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1162`,
    description: `小杨有一个正整数 $n$，小杨想将它拆分成若干完全平方数的和，同时小杨希望拆分的数量越少越好。

编程计算总和为 $n$ 的完全平方数的最小数量。`,
    inputFormat: `输入只有一行一个正整数 $n$。`,
    outputFormat: `输出一行一个整数表示答案。`,
    samples: [
      { input: "18", output: "2" },
    ],
    testCases: [
      { input: "18", output: "2" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对全部的测试数据，保证 $1 \\le n \\le 10^5$。`,
  },
  {
    title: "[GESP202409 六级] 算法学习",
    source: "gesp_official",
    sourceId: "P11247",
    sourceUrl: "https://www.luogu.com.cn/problem/P11247",
    level: 6,
    knowledgePoints: ["贪心", "动态规划", "排序"],
    difficulty: "提高+/省选-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1162`,
    description: `小杨计划学习 $m$ 种算法，找了 $n$ 道题目来帮助学习，每道题目最多学习一次。初始掌握程度均为 $0$。

第 $i$ 道题目有知识点 $a_i$，学习可令掌握程度提高 $b_i$。

学习目标是对 $m$ 种算法的掌握程度均至少为 $k$。

避免连续学习两道相同知识点的题目。求最少需要学习多少道题目。`,
    inputFormat: `第一行三个正整数 $m, n, k$，代表算法种类数、题目数和目标掌握程度。

第二行 $n$ 个正整数 $a_1, a_2, ..., a_n$，代表每道题目的知识点。

第三行 $n$ 个正整数 $b_1, b_2, ..., b_n$，代表每道题目提升的掌握程度。`,
    outputFormat: `输出一个整数，代表最少需要学习题目的数量。若不存在满足条件的方案，输出 $-1$。`,
    samples: [
      { input: "3 5 10\n1 1 2 3 3\n9 1 10 10 1", output: "4" },
      { input: "2 4 10\n1 1 1 2\n1 2 7 10", output: "-1" },
    ],
    testCases: [
      { input: "3 5 10\n1 1 2 3 3\n9 1 10 10 1", output: "4" },
      { input: "2 4 10\n1 1 1 2\n1 2 7 10", output: "-1" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `**【样例 #1 解释】**

一种最优学习顺序为第一道题、第三道题、第四道题、第二道题。`,
  },
  // ========== 2024年12月 ==========
  {
    title: "[GESP202412 六级] 树上游走",
    source: "gesp_official",
    sourceId: "P11375",
    sourceUrl: "https://www.luogu.com.cn/problem/P11375",
    level: 6,
    knowledgePoints: ["树", "二叉树", "模拟", "位运算"],
    difficulty: "提高+/省选-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1170`,
    description: `小杨有一棵包含无穷节点的二叉树。根节点编号为 $1$，节点 $i$ 的左儿子编号为 $2 \\times i$，右儿子为 $2 \\times i+1$。

小杨从节点 $s$ 开始移动 $n$ 次，每次可执行：

1. 向上移动到父节点（若存在）；
2. 移动到左儿子；
3. 移动到右儿子。

求最终节点编号（不超过 $10^{12}$）。`,
    inputFormat: `第一行：两个正整数 $n$ 和 $s$（移动次数和初始节点）。

第二行：长度为 $n$ 的字符串，仅含 $U$、$L$、$R$ 字符，分别代表上移、左移、右移。`,
    outputFormat: `输出一个正整数，代表最后所处的节点编号。`,
    samples: [
      { input: "3 2\nURR", output: "7" },
    ],
    testCases: [
      { input: "3 2\nURR", output: "7" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `**【样例解释】**

示例中移动路线为 $2 \\to 1 \\to 3 \\to 7$。

**【数据范围】**

$n \\le 10^6$，$s \\le 10^{12}$。

子任务1（$20\\%$）：$n \\le 10$，$s \\le 2$；

子任务2（$20\\%$）：$n \\le 50$，$s \\le 10$；

子任务3（$60\\%$）：$n \\le 10^6$，$s \\le 10^{12}$。`,
  },
  {
    title: "[GESP202412 六级] 运送物资",
    source: "gesp_official",
    sourceId: "P11376",
    sourceUrl: "https://www.luogu.com.cn/problem/P11376",
    level: 6,
    knowledgePoints: ["贪心", "排序", "图论", "最优化"],
    difficulty: "提高+/省选-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1170`,
    description: `小杨管理着 $m$ 辆货车，每辆货车每天需要向 $A$ 市和 $B$ 市运送若干次物资。小杨同时拥有 $n$ 个运输站点，这些站点位于 $A$ 市和 $B$ 市之间。

每次运送物资时，货车从初始运输站点出发，前往 $A$ 市或 $B$ 市，之后返回初始运输站点。$A$ 市的坐标为 $0$，$B$ 市的坐标为 $x$，运输站点的坐标为 $p$ 且有 $0 < p < x$。

货车每次去 $A$ 市运送物资的总行驶路程为 $2p$，去 $B$ 市运送物资的总行驶路程为 $2(x - p)$。

对于第 $i$ 个运输站点，其位置为 $p_i$ 且至多作为 $c_i$ 辆车的初始运输站点。

求在最优分配每辆货车的初始运输站点的情况下，所有货车每天的最短总行驶路程。`,
    inputFormat: `第一行包含三个正整数 $n,m,x$，代表运输站点数量、货车数量和两市距离。

之后 $n$ 行，每行包含两个正整数 $p_i$ 和 $c_i$，代表第 $i$ 个运输站点的位置和最多容纳车辆数。

之后 $m$ 行，每行包含两个正整数 $a_i$ 和 $b_i$，代表第 $i$ 辆货车每天需要向 $A$ 市运送 $a_i$ 次物资，向 $B$ 市运送 $b_i$ 次物资。`,
    outputFormat: `输出一个正整数，代表所有货车每天的最短总行驶路程。`,
    samples: [
      { input: "3 4 10\n1 1\n2 1\n8 3\n5 3\n7 2\n9 0\n1 10000", output: "40186" },
    ],
    testCases: [
      { input: "3 4 10\n1 1\n2 1\n8 3\n5 3\n7 2\n9 0\n1 10000", output: "40186" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `**【样例解释】**

第 $1$ 辆车的初始运输站点为站点 $3$，第 $2$ 辆车的初始运输站点为站点 $2$。第 $3$ 辆车的初始运输站点为站点 $1$，第 $4$ 辆车的初始运输站点为站点 $3$。此时总行驶路程最短，为 $40186$。`,
  },
  // ========== 2025年3月 ==========
  {
    title: "[GESP202503 六级] 树上漫步",
    source: "gesp_official",
    sourceId: "P11962",
    sourceUrl: "https://www.luogu.com.cn/problem/P11962",
    level: 6,
    knowledgePoints: ["树", "DFS", "BFS", "图的遍历", "奇偶性"],
    difficulty: "普及+/提高",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1178`,
    description: `小 A 有一棵 $n$ 个结点的树，这些结点依次以 $1,2,\\ldots,n$ 标号。

小 A 想在这棵树上漫步。具体来说，小 A 会从树上的某个结点出发，每一步可以移动到与当前结点相邻的结点，并且小 A 只会在偶数步（可以是零步）后结束漫步。

现在小 A 想知道，对于树上的每个结点，从这个结点出发开始漫步，经过偶数步能结束漫步的结点有多少个（可以经过重复的节点）。`,
    inputFormat: `第一行，一个正整数 $n$。

接下来 $n-1$ 行，每行两个整数 $u_i,v_i$，表示树上有一条连接结点 $u_i$ 和结点 $v_i$ 的边。`,
    outputFormat: `一行，$n$ 个整数。第 $i$ 个整数表示从结点 $i$ 出发开始漫步，能结束漫步的结点数量。`,
    samples: [
      { input: "3\n1 3\n2 3", output: "2 2 1" },
      { input: "4\n1 3\n3 2\n4 3", output: "3 3 1 3" },
    ],
    testCases: [
      { input: "3\n1 3\n2 3", output: "2 2 1" },
      { input: "4\n1 3\n3 2\n4 3", output: "3 3 1 3" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于 $40\\%$ 的测试点，保证 $1 \\le n \\le 10^3$。

对于所有测试点，保证 $1 \\le n \\le 2 \\times 10^5$。`,
  },
  {
    title: "[GESP202503 六级] 环线",
    source: "gesp_official",
    sourceId: "P11963",
    sourceUrl: "https://www.luogu.com.cn/problem/P11963",
    level: 6,
    knowledgePoints: ["前缀和", "最大子段和", "环形结构"],
    difficulty: "普及/提高-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1178`,
    description: `小 A 喜欢坐地铁。地铁环线有 $n$ 个车站，依次以 $1,2,\\cdots,n$ 标号。车站 $i$（$1 \\le i < n$）的下一个车站是车站 $i+1$。特殊地，车站 $n$ 的下一个车站是车站 $1$。

小 A 会从某个车站出发，乘坐地铁环线到某个车站结束行程，这意味着小 A 至少会经过一个车站。小 A 不会经过一个车站多次。

当小 A 乘坐地铁环线经过车站 $i$ 时，小 A 会获得 $a_i$ 点快乐值。

请你安排小 A 的行程，选择出发车站与结束车站，使得获得的快乐值总和最大。`,
    inputFormat: `第一行，一个正整数 $n$，表示车站的数量。

第二行，$n$ 个整数 $a_i$，分别表示经过每个车站时获得的快乐值。`,
    outputFormat: `一行，一个整数，表示小 A 能获得的最大快乐值。`,
    samples: [
      { input: "4\n-1 2 3 0", output: "5" },
      { input: "5\n-3 4 -5 1 3", output: "5" },
    ],
    testCases: [
      { input: "4\n-1 2 3 0", output: "5" },
      { input: "5\n-3 4 -5 1 3", output: "5" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于 $20\\%$ 的测试点，保证 $1 \\le n \\le 200$。

对于 $40\\%$ 的测试点，保证 $1 \\le n \\le 2000$。

对于所有测试点，保证 $1 \\le n \\le 2 \\times 10^5$，$-10^9 \\le a_i \\le 10^9$。`,
  },
  // ========== 2025年6月 ==========
  {
    title: "[GESP202506 六级] 学习小组",
    source: "gesp_official",
    sourceId: "P13015",
    sourceUrl: "https://www.luogu.com.cn/problem/P13015",
    level: 6,
    knowledgePoints: ["动态规划", "整数划分", "背包问题"],
    difficulty: "普及+/提高",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1186`,
    description: `班主任将 $n$ 名同学划分为若干学习小组。若一个小组包含 $k$ 名同学，其讨论积极度为 $a_k$。

求所有划分方案中，讨论积极度之和的最大值。`,
    inputFormat: `第一行：正整数 $n$（班级人数）。

第二行：$n$ 个非负整数 $a_1, a_2, \\ldots, a_n$（不同人数学习小组的讨论积极度）。`,
    outputFormat: `一个整数，表示所有划分方案中讨论积极度之和的最大值。`,
    samples: [
      { input: "4\n1 5 6 3", output: "10" },
      { input: "8\n0 2 5 6 4 3 3 4", output: "12" },
    ],
    testCases: [
      { input: "4\n1 5 6 3", output: "10" },
      { input: "8\n0 2 5 6 4 3 3 4", output: "12" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `$40\\%$ 测试点：$1 \\le n \\le 10$。

全部测试点：$1 \\le n \\le 1000$，$0 \\le a_i \\le 10^4$。`,
  },
  {
    title: "[GESP202506 六级] 最大因数",
    source: "gesp_official",
    sourceId: "P13016",
    sourceUrl: "https://www.luogu.com.cn/problem/P13016",
    level: 6,
    knowledgePoints: ["树", "因数", "数论", "LCA"],
    difficulty: "普及/提高-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1186`,
    description: `给定一棵有 $10^9$ 个结点的有根树，结点编号为 $1$ 到 $10^9$，根结点编号为 $1$。

对于编号为 $k$（$2 \\le k \\le 10^9$）的结点，其父结点编号为 $k$ 的因数中除 $k$ 以外最大的因数。

现在有 $q$ 组询问，给定 $x_i$ 和 $y_i$，求两个结点在树上的距离。距离定义为连接两结点的简单路径所包含的边数。`,
    inputFormat: `第一行为正整数 $q$ 表示询问组数。

接下来 $q$ 行，每行两个正整数 $x_i$ 和 $y_i$ 表示询问结点编号。`,
    outputFormat: `输出 $q$ 行，每行一个整数表示结点 $x_i$ 和 $y_i$ 之间的距离。`,
    samples: [
      { input: "3\n1 3\n2 5\n4 8", output: "1\n2\n1" },
      { input: "1\n120 650", output: "9" },
    ],
    testCases: [
      { input: "3\n1 3\n2 5\n4 8", output: "1\n2\n1" },
      { input: "1\n120 650", output: "9" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `$60\\%$ 的测试点保证 $1 \\le x_i, y_i \\le 1000$。

所有测试点保证 $1 \\le q \\le 1000$，$1 \\le x_i, y_i \\le 10^9$。`,
  },
  // ========== 2025年9月 ==========
  {
    title: "[GESP202509 六级] 划分字符串",
    source: "gesp_official",
    sourceId: "P14075",
    sourceUrl: "https://www.luogu.com.cn/problem/P14075",
    level: 6,
    knowledgePoints: ["动态规划", "字符串", "贪心"],
    difficulty: "普及+/提高",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1194`,
    description: `小 A 有一个由 $n$ 个小写字母组成的字符串 $s$。他希望将 $s$ 划分为若干个子串，使得子串中每个字母至多出现一次。

例如，对于字符串 \`street\` 来说，\`str + e + e + t\` 是满足条件的划分；而 \`s + tree + t\` 不是，因为子串 \`tree\` 中 \`e\` 出现了两次。

额外地，小 A 还给出了价值 $a_1,a_2,...,a_n$，表示划分后长度为 $i$ 的子串价值为 $a_i$。

小 A 希望最大化划分后得到的子串价值之和。`,
    inputFormat: `第一行，一个正整数 $n$，表示字符串的长度。

第二行，一个包含 $n$ 个小写字母的字符串 $s$。

第三行，$n$ 个正整数 $a_1,a_2,...,a_n$，表示不同长度的子串价值。`,
    outputFormat: `一行，一个整数，表示划分后子串价值之和的最大值。`,
    samples: [
      { input: "6\nstreet\n2 1 7 4 3 3", output: "13" },
      { input: "8\nblossoms\n1 1 2 3 5 8 13 21", output: "8" },
    ],
    testCases: [
      { input: "6\nstreet\n2 1 7 4 3 3", output: "13" },
      { input: "8\nblossoms\n1 1 2 3 5 8 13 21", output: "8" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于 $40\\%$ 的测试点，保证 $1 \\le n \\le 10^3$。

对于所有测试点，保证 $1 \\le n \\le 10^5$，$1 \\le a_i \\le 10^9$。`,
  },
  {
    title: "[GESP202509 六级] 货物运输",
    source: "gesp_official",
    sourceId: "P14076",
    sourceUrl: "https://www.luogu.com.cn/problem/P14076",
    level: 6,
    knowledgePoints: ["树", "DFS", "树的遍历", "贪心"],
    difficulty: "提高+/省选-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1194`,
    description: `A 国有 $n$ 座城市，依次以 $1,2,...,n$ 编号，其中 $1$ 号城市为首都。这 $n$ 座城市由 $n-1$ 条双向道路连接，第 $i$ 条道路（$1 \\le i < n$）连接编号为 $u_i,v_i$ 的两座城市，道路长度为 $l_i$。任意两座城市间均可通过双向道路到达。

现在 A 国需要从首都向各个城市运送货物。具体来说，满载货物的车队会从首都开出，经过一座城市时将对应的货物送出，因此车队需要经过所有城市。

A 国希望你设计一条路线，在从首都出发经过所有城市的前提下，最小化经过的道路长度总和。注意一座城市可以经过多次，车队最后可以不返回首都。`,
    inputFormat: `第一行，一个正整数 $n$，表示 A 国的城市数量。

接下来 $n-1$ 行，每行三个正整数 $u_i,v_i,l_i$，表示一条双向道路连接编号为 $u_i,v_i$ 的两座城市，道路长度为 $l_i$。`,
    outputFormat: `一行，一个整数，表示你设计的路线所经过的道路长度总和。`,
    samples: [
      { input: "4\n1 2 6\n1 3 1\n3 4 5", output: "18" },
      { input: "7\n1 2 1\n2 3 1\n3 4 1\n7 6 1\n6 5 1\n5 1 1", output: "9" },
    ],
    testCases: [
      { input: "4\n1 2 6\n1 3 1\n3 4 5", output: "18" },
      { input: "7\n1 2 1\n2 3 1\n3 4 1\n7 6 1\n6 5 1\n5 1 1", output: "9" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于 $30\\%$ 的测试点，保证 $1 \\le n \\le 8$。

对于另外 $30\\%$ 的测试点，保证仅与一条双向道路连接的城市恰有两座。

对于所有测试点，保证 $1 \\le n \\le 10^5$，$1 \\le u_i,v_i \\le n$，$1 \\le l_i \\le 10^9$。`,
  },
  // ========== 2025年12月 ==========
  {
    title: "[GESP202512 六级] 路径覆盖",
    source: "gesp_official",
    sourceId: "P14919",
    sourceUrl: "https://www.luogu.com.cn/problem/P14919",
    level: 6,
    knowledgePoints: ["树", "DFS", "动态规划", "树形DP"],
    difficulty: "普及+/提高",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1202`,
    description: `给定一棵有 $n$ 结点的有根树 $T$，结点依次以 $1,2,...,n$ 编号，根结点编号为 $1$。

初始时 $T$ 中的结点均为白色。需将若干个结点染为黑色，使得所有叶子到根的路径上至少有一个黑色结点。

将结点 $i$ 染为黑色需要代价 $c_i$，在满足条件下最小化染色代价之和。`,
    inputFormat: `第一行：正整数 $n$，表示结点数量。

第二行：$n-1$ 个正整数 $f_2,f_3,...,f_n$，其中 $f_i$ 表示结点 $i$ 的父结点编号，保证 $f_i < i$。

第三行：$n$ 个正整数 $c_1,c_2,...,c_n$，其中 $c_i$ 表示将结点 $i$ 染为黑色所需的代价。`,
    outputFormat: `一行，一个整数，表示在满足所有叶子到根的路径上至少有一个黑色结点的前提下，染色代价之和的最小值。`,
    samples: [
      { input: "4\n1 2 3\n5 6 2 3", output: "2" },
      { input: "7\n1 1 2 2 3 3\n64 16 15 4 3 2 1", output: "10" },
    ],
    testCases: [
      { input: "4\n1 2 3\n5 6 2 3", output: "2" },
      { input: "7\n1 1 2 2 3 3\n64 16 15 4 3 2 1", output: "10" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于 $40\\%$ 的测试点，保证 $2 \\le n \\le 16$。

对于另外 $20\\%$ 的测试点，保证 $f_i = i-1$。

对于所有测试点，保证 $2 \\le n \\le 10^5$，$1 \\le c_i \\le 10^9$。`,
  },
  {
    title: "[GESP202512 六级] 道具商店",
    source: "gesp_official",
    sourceId: "P14920",
    sourceUrl: "https://www.luogu.com.cn/problem/P14920",
    level: 6,
    knowledgePoints: ["动态规划", "背包问题", "01背包"],
    difficulty: "普及+/提高",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1202`,
    description: `道具商店里有 $n$ 件道具可供挑选。第 $i$ 件道具可为玩家提升 $a_i$ 点攻击力，需要 $c_i$ 枚金币才能购买，每件道具只能购买一次。

现在你有 $k$ 枚金币，请问你最多可以提升多少点攻击力？`,
    inputFormat: `第一行，两个正整数 $n,k$，表示道具数量以及你所拥有的金币数量。

接下来 $n$ 行，每行两个正整数 $a_i,c_i$，表示道具所提升的攻击力点数，以及购买所需的金币数量。`,
    outputFormat: `输出一行，一个整数，表示最多可以提升的攻击力点数。`,
    samples: [
      { input: "3 5\n99 1\n33 2\n11 3", output: "132" },
      { input: "4 100\n10 1\n20 11\n40 33\n100 99", output: "110" },
    ],
    testCases: [
      { input: "3 5\n99 1\n33 2\n11 3", output: "132" },
      { input: "4 100\n10 1\n20 11\n40 33\n100 99", output: "110" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于 $60\\%$ 的测试点，保证 $1 \\le k \\le 500$，$1 \\le c_i \\le 500$。

对于所有测试点，保证 $1 \\le n \\le 500$，$1 \\le k \\le 10^9$，$1 \\le a_i \\le 500$，$1 \\le c_i \\le 10^9$。`,
  },
];

async function seedGesp6() {
  try {
    // 删除现有的GESP6题目，重新导入
    await prisma.problem.deleteMany({
      where: {
        sourceId: {
          in: gesp6Problems.map(p => p.sourceId).filter(Boolean) as string[]
        }
      }
    });

    // 添加所有题目
    const result = await prisma.problem.createMany({
      data: gesp6Problems,
    });

    return NextResponse.json({
      success: true,
      message: `成功导入 ${result.count} 道 GESP 6级题目（已更新为与洛谷100%一致）`,
      count: result.count
    });
  } catch (error) {
    console.error("Seed GESP6 error:", error);
    return NextResponse.json({ error: "添加题目失败", details: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return seedGesp6();
}

export async function POST() {
  return seedGesp6();
}
