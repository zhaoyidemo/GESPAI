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
    difficulty: "普及-",
    description: `顽皮的小明发现，下楼梯时每步可以走 $1$ 个台阶、$2$ 个台阶或 $3$ 个台阶。现在一共有 $N$ 个台阶，你能帮小明算算有多少种方案吗？`,
    inputFormat: `输入一行，包含一个整数 $N$。`,
    outputFormat: `输出一行一个整数表示答案。`,
    samples: [
      { input: "4", output: "7" },
      { input: "10", output: "274" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对全部的测试点，保证 $1 \\leq N \\leq 60$。`,
  },
  {
    title: "[GESP样题 六级] 亲朋数",
    source: "gesp_official",
    sourceId: "P10262",
    sourceUrl: "https://www.luogu.com.cn/problem/P10262",
    level: 6,
    knowledgePoints: ["字符串", "数论", "前缀和", "取模"],
    difficulty: "普及/提高-",
    description: `给定一串长度为 $L$、由数字 $0\\sim 9$ 组成的数字串 $S$。容易知道，它的连续子串共有 $\\frac{L(L + 1)}2$ 个。如果某个子串对应的数（允许有前导零）是 $p$ 的倍数，则称该子串为数字串 $S$ 对于 $p$ 的亲朋数。

例如，数字串 $S$ 为" $12342$ "、$p$ 为 $2$，则在 $15$ 个连续子串中，亲朋数有" $12$ "、" $1234$ "、" $12342$ "、" $2$ "、" $234$ "、" $2342$ "、" $34$ "、" $342$ "、" $4$ "、" $42$ "、" $2$ "共 $11$ 个。注意其中" $2$ "出现了 $2$ 次，但由于其在 $S$ 中的位置不同，记为不同的亲朋数。

现在，告诉你数字串 $S$ 和正整数 $p$ ，你能计算出有多少个亲朋数吗？`,
    inputFormat: `输入的第一行，包含一个正整数 $p$。约定 $2 \\leq p \\leq 128$。

输入的第二行，包含一个长为 $L$ 的数字串 $S$。约定 $1 \\leq L \\leq 10^6$。`,
    outputFormat: `输出一行一个整数表示答案。`,
    samples: [
      { input: "2\n102", output: "5" },
      { input: "2\n12342", output: "11" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `## 样例 1 解释

$5$ 个亲朋数，分别 $10$、$102$、$0$、$02$、$2$。`,
  },
  // ========== 2023年9月 ==========
  {
    title: "[GESP202309 六级] 小杨买饮料",
    source: "gesp_official",
    sourceId: "B3873",
    sourceUrl: "https://www.luogu.com.cn/problem/B3873",
    level: 6,
    knowledgePoints: ["动态规划", "背包问题", "01背包"],
    difficulty: "普及/提高-",
    description: `小杨来到了一家商店，打算购买一些饮料。这家商店总共出售 $N$ 种饮料，编号从 $0$ 至 $N-1$，其中编号为 $i$ 的饮料售价 $c_i$ 元，容量 $l_i$ 毫升。

小杨的需求有如下几点：

1. 小杨想要尽可能尝试不同种类的饮料，因此他希望每种饮料至多购买 $1$ 瓶；

2. 小杨很渴，所以他想要购买总容量不低于 $L$ 的饮料；

3. 小杨勤俭节约，所以在 $1$ 和 $2$ 的前提下，他希望使用尽可能少的费用。

方便起见，你只需要输出最少花费的费用即可。特别地，如果不能满足小杨的要求，则输出 \`no solution\`。`,
    inputFormat: `第一行两个整数 $N,L$。

接下来 $N$行，依次描述第 $i=0,1,\\cdots,N-1$ 种饮料：每行两个整数 $c_i,l_i$。`,
    outputFormat: `输出一行一个整数，表示最少需要花费多少钱，才能满足小杨的要求。特别地，如果不能满足要求，则输出 \`no solution\`。`,
    samples: [
      { input: "5 100\n100 2000\n2 50\n4 40\n5 30\n3 20", output: "9" },
      { input: "5 141\n100 2000\n2 50\n4 40\n5 30\n3 20", output: "100" },
      { input: "4 141\n2 50\n4 40\n5 30\n3 20", output: "no solution" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `**样例 1 解释**

小杨可以购买 $2,3,5$ 号饮料，总计获得 $50+40+20=110$ 毫升饮料，花费 $2+4+3=9$ 元。

如果只考虑前两项需求，小杨也可以购买 $2,4,5$ 号饮料，它们的容量总和为 $50+30+20=100$ 毫升，恰好可以满足需求。但遗憾的是，这个方案需要花费 $2+5+3=10$ 元。

**样例 2 解释**

$1,2,3,4$ 号饮料总计 $140$ 毫升，如每种饮料至多购买 $1$ 瓶，则恰好无法满足需求，因此只能花费 $100$ 元购买 $0$ 号饮料。

**数据规模**

对于 $40\\%$ 的测试点，保证 $N \\le 20;1\\le L \\le 100; l_i \\le 100$。

对于 $70\\%$ 的测试点，保证 $l_i \\le 100$。

对于 $100\\%$ 的测试点，保证 $1\\le N \\le 500;1\\le L \\le 2000; 1\\le c_i,l_i \\le 10^6$。`,
  },
  {
    title: "[GESP202309 六级] 小杨的握手问题",
    source: "gesp_official",
    sourceId: "B3874",
    sourceUrl: "https://www.luogu.com.cn/problem/B3874",
    level: 6,
    knowledgePoints: ["归并排序", "逆序对", "分治"],
    difficulty: "普及/提高-",
    description: `小杨的班级里共有 $N$ 名同学，学号从 $0$ 至 $N-1$。

某节课上，老师安排全班同学进行一次握手游戏，具体规则如下：老师安排了一个顺序，让全班 $N$ 名同学依次进入教室。每位同学进入教室时，需要和 **已经在教室内** 且 **学号小于自己** 的同学握手。

现在，小杨想知道，整个班级总共会进行多少次握手。

**提示：可以考虑使用归并排序进行降序排序，并在此过程中求解。**`,
    inputFormat: `输入包含 $2$ 行。第一行一个整数 $N$ ，表示同学的个数；第二行 $N$ 个用单个空格隔开的整数，依次描述同学们进入教室的顺序，每个整数在 $0 \\sim N-1$ 之间，表示该同学的学号。

保证每位同学会且只会进入教室一次。`,
    outputFormat: `输出一行一个整数，表示全班握手的总次数。`,
    samples: [
      { input: "4\n2 1 3 0", output: "2" },
      { input: "6\n0 1 2 3 4 5", output: "15" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `**样例解释 1**:

$2$ 号同学进入教室，此时教室里没有其他同学。

$1$ 号同学进入教室，此时教室里有 $2$ 号同学。$1$ 号同学的学号小于 $2$ 号同学，因此他们之间不需要握手。

$3$ 号同学进入教室，此时教室里有 $1,2$ 号同学。$3$ 号同学的学号比他们都大，因此 $3$ 号同学需要分别和另外两位同学握手。

$0$ 号同学进入教室，此时教室里有 $1,2,3$ 号同学。$0$ 号同学的学号比他们都小，因此 $0$ 号同学不需要与其他同学握手。

**样例解释2：**

全班所有同学之间都会进行握手，因为每位同学来到教室时，都会发现他的学号是当前教室里最大的，所以他需要和教室里的每位其他同学进行握手。

对于 $30\\%$ 的测试点，保证 $N\\le100$。

对于所有测试点，保证 $2\\le N\\le3\\times10^5$。`,
  },
  // ========== 2023年12月 ==========
  {
    title: "[GESP202312 六级] 闯关游戏",
    source: "gesp_official",
    sourceId: "P10108",
    sourceUrl: "https://www.luogu.com.cn/problem/P10108",
    level: 6,
    knowledgePoints: ["动态规划", "图论", "BFS"],
    difficulty: "普及-",
    description: `你来到了一个闯关游戏。

这个游戏总共有 $N$ 关，每关都有 $M$ 个通道，你需要选择一个通道并通往后续关卡。其中，第 $i$ 个通道可以让你前进 $a_i$ 关，也就是说，如果你现在在第 $x$ 关，那么选择第 $i$ 个通道后，你将直接来到第 $x+a_i$ 关（特别地，如果 $x + a_i \\geq N$，那么你就通关了）。此外，当你顺利离开第 $s$ 关时，你还将获得 $b_s$ 分。

游戏开始时，你在第 $0$ 关。请问，你通关时最多能获得多少总分。`,
    inputFormat: `第一行两个整数 $N$，$M$，分别表示关卡数量和每关的通道数量。

接下来一行 $M$ 个用单个空格隔开的整数 $a_0,a_1\\cdots,a_{M-1}$。保证 $1\\le a_i \\le N$。

接下来一行 $N$ 个用单个空格隔开的整数 $b_0,b_1\\cdots,b_{N-1}$。保证 $|b_i|\\le 10^5$。`,
    outputFormat: `一行一个整数，表示你通关时最多能够获得的分数。`,
    samples: [
      { input: "6 2 \n2 3\n1 0 30 100 30 30", output: "131" },
      { input: "6 2\n2 3\n1 0 30 100 30 -1", output: "101" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `## 样例解释 1

你可以在第 $0$ 关选择第 $1$ 个通道，获得 $1$ 分并来到第 $3$ 关；随后再选择第 $0$ 个通道，获得 $100$ 分并来到第 $5$ 关；最后任选一个通道，都可以获得 $30$ 分并通关。如此，总得分为 $1+100+30=131$。

## 样例解释 2

请注意，一些关卡的得分可能是负数。

## 数据范围

对于 $20\\%$ 的测试点，保证 $M=1$。

对于 $40\\%$ 的测试点，保证 $N \\le 20$；保证 $M\\le 2$。

对于所有测试点，保证 $1 \\le N \\le 10^4$；保证 $1 \\le M\\le 100$。`,
  },
  {
    title: "[GESP202312 六级] 工作沟通",
    source: "gesp_official",
    sourceId: "P10109",
    sourceUrl: "https://www.luogu.com.cn/problem/P10109",
    level: 6,
    knowledgePoints: ["树", "LCA", "倍增"],
    difficulty: "普及-",
    description: `某公司有 $N$ 名员工，编号从 $0$ 至 $N-1$。其中，除了 $0$ 号员工是老板，其余每名员工都有一个直接领导。我们假设编号为 $i$ 的员工的直接领导是 $f_i$。

该公司有严格的管理制度，每位员工只能受到本人或直接领导或间接领导的管理。具体来说，规定员工 $x$ 可以管理员工 $y$，当且仅当 $x=y$，或 $x=f_y$，或 $x$ 可以管理 $f_y$。特别地，$0$ 号员工老板只能自我管理，无法由其他任何员工管理。

现在，有一些同事要开展合作，他们希望找到一位同事来主持这场合作，这位同事必须能够管理参与合作的所有同事。如果有多名满足这一条件的员工，他们希望找到编号最大的员工。你能帮帮他们吗？`,
    inputFormat: `第一行一个整数 $N$，表示员工的数量。

第二行 $N - 1$ 个用空格隔开的正整数，依次为 $f_1,f_2,\\dots f_{N−1}$。

第三行一个整数 $Q$，表示共有 $Q$ 场合作需要安排。

接下来 $Q$ 行，每行描述一场合作：开头是一个整数 $m$（$2 \\le m \\le N$），表示参与本次合作的员工数量；接着是 $m$ 个整数，依次表示参与本次合作的员工编号（保证编号合法且不重复）。

保证公司结构合法，即不存在任意一名员工，其本人是自己的直接或间接领导。`,
    outputFormat: `输出 $Q$ 行，每行一个整数，依次为每场合作的主持人选。`,
    samples: [
      { input: "5\n0 0 2 2\n3\n2 3 4\n3 2 3 4\n2 1 4", output: "2\n2\n0" },
      { input: "7\n0 1 0 2 1 2\n5\n2 4 6\n2 4 5\n3 4 5 6\n4 2 4 5 6\n2 3 4", output: "2\n1\n1\n1\n0" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `**样例解释 1**

对于第一场合作，员工 $3,4$ 有共同领导 $2$ ，可以主持合作。

对于第二场合作，员工 $2$ 本人即可以管理所有参与者。

对于第三场合作，只有 $0$ 号老板才能管理所有员工。

**数据范围**

对于 $50\\%$ 的测试点，保证 $N \\leq 50$。

对于所有测试点，保证 $3 \\leq N \\leq 300$，$Q \\leq 100$。



------------
2024/1/28 添加一组 hack 数据。`,
  },
  // ========== 2024年3月 ==========
  {
    title: "[GESP202403 六级] 游戏",
    source: "gesp_official",
    sourceId: "P10376",
    sourceUrl: "https://www.luogu.com.cn/problem/P10376",
    level: 6,
    knowledgePoints: ["动态规划", "递推", "组合数学"],
    difficulty: "普及-",
    description: `你有四个正整数 $n,a,b,c$，并准备用它们玩一个简单的小游戏。

在一轮游戏操作中，你可以选择将 $n$ 减去 $a$，或是将 $n$ 减去 $b$。游戏将会进行多轮操作，直到当 $n \\leq c$ 时游戏结束。

你想知道游戏结束时有多少种不同的游戏操作序列。两种游戏操作序列不同，当且仅当游戏操作轮数不同，或是某一轮游戏操作中，一种操作序列选择将 $n$ 减去 $a$，而另一种操作序列选择将 $n$ 减去 $b$。如果 $a=b$，也认为将 $n$ 减去 $a$ 与将 $n$ 减去 $b$ 是不同的操作。

由于答案可能很大，你只需要求出答案对 $10^9 + 7$ 取模的结果。`,
    inputFormat: `一行四个整数 $n,a,b,c$。`,
    outputFormat: `输出一行一个整数表示答案。`,
    samples: [
      { input: "1 1 1 1", output: "1" },
      { input: "114 51 4 1", output: "176" },
      { input: "114514 191 9 810", output: "384178446" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `### 数据规模与约定


- 对 $20\\%$ 的数据，$a=b=c=1$，$n \\leq 30$。
- 对 $40\\%$ 的数据，$c = 1$，$n \\leq 10^3$。
- 对全部的测试数据，保证 $1 \\leq a,b,c \\leq n \\leq 2 \\times 10^5$。`,
  },
  {
    title: "[GESP202403 六级] 好斗的牛",
    source: "gesp_official",
    sourceId: "P10377",
    sourceUrl: "https://www.luogu.com.cn/problem/P10377",
    level: 6,
    knowledgePoints: ["贪心", "排序", "枚举"],
    difficulty: "普及-",
    description: `你有 $10^9$ 个牛棚，从左到右一字排开。你希望把 $n$ 头牛安置到牛棚里。麻烦的是，你的牛很好斗，如果他们附近有其他的牛，他们就会不安分地去挑事。其中，第 $i$ 头牛的攻击范围是 $(a_i, b_i)$，这意味着，如果他的左边 $a_i$ 个牛棚或者右边 $b_i$ 个牛棚有其他牛，它就会去挑事。

你想留下一段连续的牛棚，并把其他牛棚都卖掉。请问您最少需要留下多少牛棚，才能保证至少存在一种方案能够把所有的 $n$ 头牛都安置进剩余的牛棚里，且没有牛会挑事？`,
    inputFormat: `第一行一个正整数 $n$。
第二行 $n$ 个正整数 $a_1, a_2, \\dots a_n$。
第三行 $n$ 个正整数 $b_1, b_2, \\dots b_n$。`,
    outputFormat: `输出一行一个整数表示答案。`,
    samples: [
      { input: "2\n1 2\n1 2", output: "4" },
      { input: "3\n1 2 3\n3 2 1", output: "7" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `## 样例 1 解释

留下第 1、2、3、4 个牛棚，并在第 $1$、$4$ 两个牛棚分别放下两头牛。

## 数据规模与约定

- 对 $20\\%$ 的数据，保证 $n = 2$。
- 另有 $20\\%$ 的数据，保证 $n = 3$。
- 对 $80\\%$ 的数据，保证 $n \\leq 8$。
- 对于所有的测试数据，保证 $1 \\leq n \\leq 9$，$1 \\leq a_i, b_i \\leq 10^3$。`,
  },
  // ========== 2024年6月 ==========
  {
    title: "[GESP202406 六级] 计算得分",
    source: "gesp_official",
    sourceId: "P10721",
    sourceUrl: "https://www.luogu.com.cn/problem/P10721",
    level: 6,
    knowledgePoints: ["动态规划", "字符串", "贪心"],
    difficulty: "普及/提高-",
    description: `小杨想要计算由 $m$ 个小写字母组成的字符串的得分。

小杨设置了一个包含 $n$ 个正整数的计分序列 $A=[a_1,a_2,\\ldots,a_n]$，如果字符串的一个子串由 $k(1\\leq k \\leq n)$ 个 $\\texttt{abc}$ 首尾相接组成，那么能够得到分数 $a_k$，并且字符串包含的字符不能够重复计算得分，整个字符串的得分是计分子串的总和。

例如，假设 ，字符串 $\\texttt{dabcabcabcabzabc}$ 的所有可能计分方式如下：
- $\\texttt{d+abc+abcabc+abz+abc}$ 或者 $\\texttt{d+abcabc+abc+abz+abc}$，其中 $\\texttt{d}$ 和 $\\texttt{abz}$ 不计算得分，总得分为 $a_1+a_2+a_1$。
- $\\texttt{d+abc+abc+abc+abz+abc}$，总得分为 $a_1+a_1+a_1+a_1$。
- $\\texttt{d+abcabcabc+abz+abc}$，总得分为 $a_3+a_1$。

小杨想知道对于给定的字符串，最大总得分是多少。`,
    inputFormat: `- 第一行包含一个正整数 $n$，代表计分序列 $A$ 的长度。

- 第二行包含 $n$ 个正整数，代表计分序列 $A$。

- 第三行包含一个正整数 $m$，代表字符串的长度。

- 第四行包含一个由 $m$ 个小写字母组成的字符串。`,
    outputFormat: `输出一个整数，代表给定字符串的最大总得分。`,
    samples: [
      { input: "3\n3 1 2\n13\ndabcabcabcabz", output: "9" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `## 样例解释
最优的计分方式为 $\\texttt{d+abc+abc+abc+abz}$，总得分为 $a_1+a_1+a_1$，共 $9$ 分。

## 数据范围

子任务编号|数据点占比|$n$|$m$|$a_i$|特殊性质
:-:|:-:|:-:|:-:|:-:|:-:
$1$|$20\\%$|$\\le 20$|$\\le 10^5$|$\\le 1000$|对于所有的 $i(1 \\le i \\le n)$，存在 $a_i \\ge a_{i+1}$
$2$|$40\\%$|$\\le 3$|$\\le 10^5$|$\\le 1000$|
$3$|$40\\%$|$\\le 20$|$\\le 10^5$|$\\le 1000$|

对于全部数据，保证有 $1\\leq n\\leq 20$，$1\\leq m\\leq 10^5$，$1\\leq a_i\\leq 1000$。`,
  },
  {
    title: "[GESP202406 六级] 二叉树",
    source: "gesp_official",
    sourceId: "P10722",
    sourceUrl: "https://www.luogu.com.cn/problem/P10722",
    level: 6,
    knowledgePoints: ["树", "二叉树", "DFS", "异或"],
    difficulty: "普及/提高-",
    description: `小杨有一棵包含 $n$ 个节点的二叉树，且根节点的编号为 $1$。这棵二叉树任意一个节点要么是白色，要么是黑色。之后小杨会对这棵二叉树进行 $q$ 次操作，每次小杨会选择一个节点，将以这个节点为根的子树内所有节点的颜色反转，即黑色变成白色，白色变成黑色。

小杨想知道 $q$ 次操作全部完成之后每个节点的颜色。`,
    inputFormat: `第一行一个正整数 $n$，表示二叉树的节点数量。

第二行 $(n-1)$ 个正整数，第 $i$（$1\\le i\\le n-1$）个数表示编号为 $(i+1)$ 的节点的父亲节点编号，数据保证是一棵二叉树。

第三行一个长度为 $n$ 的 $\\texttt{01}$ 串，从左到右第 $i$（$1\\le i\\le n$）位如果为 $\\texttt{0}$，表示编号为 $i$ 的节点颜色为白色，否则为黑色。

第四行一个正整数 $q$，表示操作次数。

接下来 $q$ 行每行一个正整数 $a_i$（$1\\le a_i\\le n$），表示第 $i$ 次操作选择的节点编号。`,
    outputFormat: `输出一行一个长度为 $n$ 的 $\\texttt{01}$ 串，表示 $q$ 次操作全部完成之后每个节点的颜色。从左到右第 $i$（$1\\le i\\le n$） 位如果为 $\\texttt{0}$，表示编号为 $i$ 的节点颜色为白色，否则为黑色。`,
    samples: [
      { input: "6\n3 1 1 3 4\n100101\n3\n1\n3\n2", output: "010000" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `#### 样例解释

第一次操作后，节点颜色为：$\\texttt{011010}$

第二次操作后，节点颜色为：$\\texttt{000000}$

第三次操作后，节点颜色为：$\\texttt{010000}$

#### 数据范围

| 子任务编号 | 得分 | $n$ | $q$ | 特殊条件 |
| :--: | :--: | :--: | :--: | :--: |
| $1$ |  $20$ | $\\le 10^5$ | $\\le 10^5$ |对于所有 $i\\ge 2$，节点 $i$ 的父亲节点编号为 $i-1$
| $2$ |  $40$ | $\\le 1000$ | $\\le 1000$ | |
| $3$ | $40$ | $\\le 10^5$ | $\\le 10^5$ | |

对于全部数据，保证有 $n,q\\le 10^5$。`,
  },
  // ========== 2024年9月 ==========
  {
    title: "[GESP202409 六级] 小杨和整数拆分",
    source: "gesp_official",
    sourceId: "P11246",
    sourceUrl: "https://www.luogu.com.cn/problem/P11246",
    level: 6,
    knowledgePoints: ["动态规划", "数论", "完全平方数"],
    difficulty: "普及-",
    description: `小杨有一个正整数 $n$，小杨想将它拆分成若干完全平方数的和，同时小杨希望拆分的数量越少越好。

编程计算总和为 $n$ 的完全平方数的最小数量。`,
    inputFormat: `输入只有一行一个正整数 $n$。`,
    outputFormat: `输出一行一个整数表示答案。`,
    samples: [
      { input: "18", output: "2" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `### 数据规模与约定

对全部的测试数据，保证 $1 \\leq n \\leq 10^5$。`,
  },
  {
    title: "[GESP202409 六级] 算法学习",
    source: "gesp_official",
    sourceId: "P11247",
    sourceUrl: "https://www.luogu.com.cn/problem/P11247",
    level: 6,
    knowledgePoints: ["贪心", "动态规划", "排序"],
    difficulty: "普及/提高-",
    description: `小杨计划学习 $m$ 种算法，为此他找了 $n$ 道题目来帮助自己学习，每道题目最多学习一次。

小杨对于 $m$ 种算法的初始掌握程度均为 $0$。第 $i$ 道题目有对应的知识点 $a_i$，即学习第 $i$ 道题目可以令小杨对第 $a_i$ 种算法的掌握程度提高 $b_i$。小杨的学习目标是对于 $m$ 种算法的掌握程度均至少为 $k$。

小杨认为连续学习两道相同知识点的题目是不好的，小杨想请你编写程序帮他计算出他最少需要学习多少道题目才能使得他在完成学习目标的同时避免连续学习两道相同知识点的题目。`,
    inputFormat: `第一行三个正整数 $m, n, k$，代表算法种类数，题目数和目标掌握程度。
第二行 $n$ 个正整数 $a_1, a_2, ..., a_n$，代表每道题目的知识点。
第三行 $n$ 个正整数 $b_1, b_2, ..., b_n$，代表每道题目提升的掌握程度。`,
    outputFormat: `输出一个整数，代表小杨最少需要学习题目的数量，如果不存在满足条件的方案，输出 -1。`,
    samples: [
      { input: "3 5 10\n1 1 2 3 3\n9 1 10 10 1", output: "4" },
      { input: "2 4 10\n1 1 1 2\n1 2 7 10", output: "-1" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `### 样例 1 解释

一种最优学习顺序为第一道题，第三道题，第四道题，第二道题。

### 数据规模与约定

| 子任务编号 | 数据点占比 | $m$ | $n$ | $b_i$ | $k$ |
| :-: | :-: | :-: | :-: | :-: | :-: |
| $1$ | $30\\%$ | $2$ | $\\leq 9$ | $\\leq 10$ | $\\leq 10$ |
| $2$ | $30\\%$ | $\\leq 9$ | $\\leq 9$ | $\\leq 10$ | $\\leq 10$ |
| $3$ | $40\\%$ | $\\leq 10^5$ | $\\leq 10^5$ | $\\leq 10^5$ | $\\leq 10^5$ |

对于全部数据，保证有 $1 \\leq m, n, b_i, k \\leq 10^5$，$1 \\leq a_i \\leq m$。`,
  },
  // ========== 2024年12月 ==========
  {
    title: "[GESP202412 六级] 树上游走",
    source: "gesp_official",
    sourceId: "P11375",
    sourceUrl: "https://www.luogu.com.cn/problem/P11375",
    level: 6,
    knowledgePoints: ["树", "二叉树", "模拟", "位运算"],
    difficulty: "普及-",
    description: `小杨有一棵包含无穷节点的二叉树（即每个节点都有左儿子节点和右儿子节点；除根节点外，每个节点都有父节点），其中根节点的编号为 $1$，对于节点 $i$，其左儿子的编号为 $2\\times i$，右儿子的编号为 $2\\times i + 1$。

小杨会从节点 $s$ 开始在二叉树上移动，每次移动为以下三种移动方式的任意一种：

- **第 1 种移动方式**：如果当前节点存在父亲节点，向上移动到当前节点的父节点，否则不移动；
- **第 2 种移动方式**：移动到当前节点的左儿子；
- **第 3 种移动方式**：移动到当前节点的右儿子。

小杨想知道移动 $n$ 次后自己所处的节点编号。**数据保证最后所处的节点编号不超过 $10^{12}$**。`,
    inputFormat: `第一行包含两个正整数 $n$ 和 $s$，代表移动次数和初始节点编号。

第二行包含一个长度为 $n$ 且仅包含大写字母 $\\tt{U}$、$\\tt{L}$ 和 $\\tt{R}$ 的字符串，代表每次移动的方式，其中 $\\tt{U}$ 代表第 1 种移动方式，$\\tt{L}$ 代表第 2 种移动方式，$\\tt{R}$ 代表第 3 种移动方式。`,
    outputFormat: `输出一个正整数，代表最后所处的节点编号。`,
    samples: [
      { input: "3 2\nURR", output: "7" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `小杨的移动路线为 $2 \\to 1 \\to 3 \\to 7$。

| 子任务编号 | 数据点占比 |     $n$     |      $s$       |
| :--------: | :--------: | :---------: | :------------: |
|    $1$     |   $20\\%$   |  $\\leq 10$  |    $\\leq 2$    |
|    $2$     |   $20\\%$   |  $\\leq 50$  |   $\\leq 10$    |
|    $3$     |   $60\\%$   | $\\leq 10^6$ | $\\leq 10^{12}$ |


对于全部数据，保证有 $1\\leq n\\leq 10^6$，$1\\leq s\\leq 10^{12}$。`,
  },
  {
    title: "[GESP202412 六级] 运送物资",
    source: "gesp_official",
    sourceId: "P11376",
    sourceUrl: "https://www.luogu.com.cn/problem/P11376",
    level: 6,
    knowledgePoints: ["贪心", "排序", "图论", "最优化"],
    difficulty: "普及/提高-",
    description: `小杨管理着 $m$ 辆货车，每辆货车每天需要向 A 市和 B 市运送若干次物资。小杨同时拥有 $n$ 个运输站点，这些站点位于 A 市和 B 市之间。

每次运送物资时，货车从初始运输站点出发，前往 A 市或 B 市，之后返回初始运输站点。A 市、B 市和运输站点的位置可以视作数轴上的三个点，其中 A 市的坐标为 $0$，B 市的坐标为 $x$，运输站点的坐标为 $p$ 且有 $0 \\lt p \\lt x$。货车每次去 A 市运送物资的总行驶路程为 $2p$，去 B 市运送物资的总行驶路程为 $2(x - p)$。

对于第 $i$ 个运输站点，其位置为 $p_i$ 且至多作为 $c_i$ 辆车的初始运输站点。小杨想知道，在最优分配每辆货车的初始运输站点的情况下，所有货车每天的最短总行驶路程是多少。`,
    inputFormat: `第一行包含三个正整数 $n,m,x$，代表运输站点数量、货车数量和两市距离。

之后 $n$ 行，每行包含两个正整数 $p_i$ 和 $c_i$，代表第 $i$ 个运输站点的位置和最多容纳车辆数。

之后 $m$ 行，每行包含两个正整数 $a_i$ 和 $b_i$，代表第 $i$ 辆货车每天需要向 A 市运送 $a_i$ 次物资，向 B 市运送 $b_i$ 次物资。`,
    outputFormat: `输出一个正整数，代表所有货车每天的最短总行驶路程。`,
    samples: [
      { input: "3 4 10\n1 1\n2 1\n8 3\n5 3\n7 2\n9 0\n1 10000", output: "40186" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `第 $1$ 辆车的初始运输站点为站点 $3$，第 $2$ 辆车的初始运输站点为站点 $2$。第 $3$ 辆车的初始运输站点为站点 $1$，第 $4$ 辆车的初始运输站点为站点 $3$。此时总驶路程最短，为 $40186$。

| 子任务编号 | 数据点占比 |     $n$     |     $s$     |    $c_i$    |
| :--------: | :--------: | :---------: | :---------: | :---------: |
|    $1$     |   $20\\%$   |     $2$     |     $2$     |     $1$     |
|    $2$     |   $20\\%$   | $\\leq 10^5$ | $\\leq 10^5$ |     $1$     |
|    $3$     |   $60\\%$   | $\\leq 10^5$ | $\\leq 10^5$ | $\\leq 10^5$ |

对于全部数据，保证有 $1\\leq n,m\\leq 10^5$，$2\\leq x\\leq 10^8$，$0\\lt p_i\\lt x$，$1\\leq c_i\\leq 10^5$，$0\\leq a_i,b_i\\leq 10^5$。数据保证 $\\sum c_i\\geq m$。`,
  },
  // ========== 2025年3月 ==========
  {
    title: "[GESP202503 六级] 树上漫步",
    source: "gesp_official",
    sourceId: "P11962",
    sourceUrl: "https://www.luogu.com.cn/problem/P11962",
    level: 6,
    knowledgePoints: ["树", "DFS", "BFS", "图的遍历", "奇偶性"],
    difficulty: "普及-",
    description: `小 A 有一棵 $n$ 个结点的树，这些结点依次以 $1,2,\\cdots,n$ 标号。

小 A 想在这棵树上漫步。具体来说，小 A 会从树上的某个结点出发，每一步可以移动到与当前结点相邻的结点，并且小 A 只会在偶数步（可以是零步）后结束漫步。

现在小 A 想知道，对于树上的每个结点，从这个结点出发开始漫步，经过偶数步能结束漫步的结点有多少个（可以经过重复的节点）。`,
    inputFormat: `第一行，一个正整数 $n$。

接下来 $n-1$ 行，每行两个整数 $u_i,v_i$，表示树上有⼀条连接结点 $u_i$ 和结点 $v_i$ 的边。`,
    outputFormat: `一行，$n$ 个整数。第 $i$ 个整数表示从结点 $i$ 出发开始漫步，能结束漫步的结点数量。`,
    samples: [
      { input: "3\n1 3\n2 3", output: "2 2 1" },
      { input: "4\n1 3\n3 2\n4 3", output: "3 3 1 3" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于 $40\\%$ 的测试点，保证 $1\\leq n\\leq 10^3$。

对于所有测试点，保证 $1\\leq n\\leq 2\\times 10^5$。`,
  },
  {
    title: "[GESP202503 六级] 环线",
    source: "gesp_official",
    sourceId: "P11963",
    sourceUrl: "https://www.luogu.com.cn/problem/P11963",
    level: 6,
    knowledgePoints: ["前缀和", "最大子段和", "环形结构"],
    difficulty: "普及/提高-",
    description: `小 A 喜欢坐地铁。地铁环线有 $n$ 个车站，依次以 $1,2,\\cdots,n$ 标号。车站 $i\\ (1\\leq i<n)$ 的下一个车站是车站 $i+1$。特殊地，车站 $n$ 的下一个车站是车站 $1$。

小 A 会从某个车站出发，乘坐地铁环线到某个车站结束行程，这意味着小 A 至少会经过一个车站。小 A 不会经过一个车站多次。当小 A 乘坐地铁环线经过车站 $i$ 时，小 A 会获得 $a_i$ 点快乐值。请你安排小 A 的行程，选择出发车站与结束车站，使得获得的快乐值总和最大。`,
    inputFormat: `第一行，一个正整数 $n$，表示车站的数量。

第二行，$n$ 个整数 $a_i$，分别表示经过每个车站时获得的快乐值。`,
    outputFormat: `一行，一个整数，表示小 A 能获得的最大快乐值。`,
    samples: [
      { input: "4\n-1 2 3 0", output: "5" },
      { input: "5\n-3 4 -5 1 3", output: "5" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于 $20\\%$ 的测试点，保证 $1\\leq n\\leq 200$。

对于 $40\\%$ 的测试点，保证 $1\\leq n\\leq 2000$。

对于所有测试点，保证 $1\\leq n\\leq 2\\times 10^5$，$-10^9\\leq a_i\\leq 10^9$。`,
  },
  // ========== 2025年6月 ==========
  {
    title: "[GESP202506 六级] 学习小组",
    source: "gesp_official",
    sourceId: "P13015",
    sourceUrl: "https://www.luogu.com.cn/problem/P13015",
    level: 6,
    knowledgePoints: ["动态规划", "整数划分", "背包问题"],
    difficulty: "普及-",
    description: `班主任计划将班级里的 $ n $ 名同学划分为若干个学习小组，每名同学都需要分入某一个学习小组中。观察发现，如果一个学习小组中恰好包含 $ k $ 名同学，则该学习小组的讨论积极度为 $ a_k $。

给定讨论积极度 $ a_1, a_2, \\ldots, a_n $，请你计算将这 $ n $ 名同学划分为学习小组的所有可能方案中，讨论积极度之和的最大值。`,
    inputFormat: `第一行，一个正整数 $ n $，表示班级人数。

第二行，$ n $ 个非负整数 $ a_1, a_2, \\ldots, a_n $，表示不同人数学习小组的讨论积极度。`,
    outputFormat: `输出共一行，一个整数，表示所有划分方案中，学习小组讨论积极度之和的最大值。`,
    samples: [
      { input: "4\n1 5 6 3", output: "10" },
      { input: "8\n0 2 5 6 4 3 3 4", output: "12" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于 $40\\%$ 的测试点，保证 $1\\le n\\le 10$。

对于所有测试点，保证 $1\\le n\\le 1000$，$0\\le a_i\\le 10^4$。`,
  },
  {
    title: "[GESP202506 六级] 最大因数",
    source: "gesp_official",
    sourceId: "P13016",
    sourceUrl: "https://www.luogu.com.cn/problem/P13016",
    level: 6,
    knowledgePoints: ["树", "因数", "数论", "LCA"],
    difficulty: "普及/提高-",
    description: `给定一棵有 $10^9$ 个结点的有根树，这些结点依次以 $1, 2, \\dots, 10^9$ 编号，根结点的编号为 $1$。对于编号为 $k$（$2 \\leq k \\leq 10^9$）的结点，其父结点的编号为 $k$ 的因数中除 $k$ 以外最大的因数。

现在有 $q$ 组询问，第 $i$（$1 \\leq i \\leq q$）组询问给定 $x_i, y_i$，请你求出编号分别为 $x_i, y_i$ 的两个结点在这棵树上的距离。两个结点之间的距离是连接这两个结点的简单路径所包含的边数。`,
    inputFormat: `第一行，一个正整数 $q$，表示询问组数。

接下来 $q$ 行，每行两个正整数 $x_i, y_i$，表示询问结点的编号。`,
    outputFormat: `输出共 $q$ 行，每行一个整数，表示结点 $x_i, y_i$ 之间的距离。`,
    samples: [
      { input: "3\n1 3\n2 5\n4 8", output: "1\n2\n1" },
      { input: "1\n120 650", output: "9" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于 $60\\%$ 的测试点，保证 $1 \\leq x_i, y_i \\leq 1000$。

对于所有测试点，保证 $1 \\leq q \\leq 1000$，$1 \\leq x_i, y_i \\leq 10^9$。`,
  },
  // ========== 2025年9月 ==========
  {
    title: "[GESP202509 六级] 划分字符串",
    source: "gesp_official",
    sourceId: "P14075",
    sourceUrl: "https://www.luogu.com.cn/problem/P14075",
    level: 6,
    knowledgePoints: ["动态规划", "字符串", "贪心"],
    difficulty: "普及/提高-",
    description: `小 A 有一个由 $n$ 个小写字母组成的字符串 $s$。他希望将 $s$ 划分为若干个子串，使得子串中每个字母至多出现一次。例如，对于字符串 \`street\` 来说，\`str + e + e + t\` 是满足条件的划分；而 \`s + tree + t\` 不是，因为子串 \`tree\` 中 \`e\` 出现了两次。

额外地，小 A 还给出了价值 $a_1,a_2,\\ldots,a_n$，表示划分后长度为 $i$ 的子串价值为 $a_i$。小 A 希望最大化划分后得到的子串价值之和。你能帮他求出划分后子串价值之和的最大值吗？`,
    inputFormat: `第一行，一个正整数 $n$，表示字符串的长度。

第二行，一个包含 $n$ 个小写字母的字符串 $s$。

第三行，$n$ 个正整数 $a_1,a_2,\\ldots,a_n$，表示不同长度的子串价值。`,
    outputFormat: `一行，一个整数，表示划分后子串价值之和的最大值。`,
    samples: [
      { input: "6\nstreet\n2 1 7 4 3 3", output: "13" },
      { input: "8\nblossoms\n1 1 2 3 5 8 13 21", output: "8" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于 $40\\%$ 的测试点，保证 $1\\le n\\le 10^3$。

对于所有测试点，保证 $1\\le n\\le 10^5$，$1\\le a_i\\le 10^9$。`,
  },
  {
    title: "[GESP202509 六级] 货物运输",
    source: "gesp_official",
    sourceId: "P14076",
    sourceUrl: "https://www.luogu.com.cn/problem/P14076",
    level: 6,
    knowledgePoints: ["树", "DFS", "树的遍历", "贪心"],
    difficulty: "普及-",
    description: `A 国有 $n$ 座城市，依次以 $1,2,\\ldots,n$ 编号，其中 $1$ 号城市为首都。这 $n$ 座城市由 $n-1$ 条双向道路连接，第 $i$ 条道路（$1 \\le i < n$）连接编号为 $u_i,v_i$ 的两座城市，道路长度为 $l_i$。任意两座城市间均可通过双向道路到达。

现在 A 国需要从首都向各个城市运送货物。具体来说，满载货物的车队会从首都开出，经过一座城市时将对应的货物送出，因此车队需要经过所有城市。A 国希望你设计一条路线，在从首都出发经过所有城市的前提下，最小化经过的道路长度总和。注意一座城市可以经过多次，车队最后可以不返回首都。`,
    inputFormat: `第一行，一个正整数 $n$，表示 A 国的城市数量。

接下来 $n-1$ 行，每行三个正整数 $u_i,v_i,l_i$，表示一条双向道路连接编号为 $u_i,v_i$ 的两座城市，道路长度为 $l_i$。`,
    outputFormat: `一行，一个整数，表示你设计的路线所经过的道路长度总和。`,
    samples: [
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
    difficulty: "普及/提高-",
    description: `给定一棵有 $n$ 结点的有根树 $T$，结点依次以 $1,2,\\ldots,n$ 编号，根结点编号为 $1$。方便起见，编号为 $i$ 的结点称为结点 $i$。

初始时 $T$ 中的结点均为白色。你需要将 $T$ 中的若干个结点染为黑色，使得所有叶子到根的路径上至少有一个黑色结点。将结点 $i$ 染为黑色需要代价 $c_i$，你需要在满足以上条件的情况下，最小化染色代价之和。

叶子是指 $T$ 中没有子结点的结点。`,
    inputFormat: `第一行，一个正整数 $n$，表示结点数量。

第二行，$n-1$ 个正整数 $f_2,f_3,\\ldots,f_n$，其中 $f_i$ 表示结点 $i$ 的父结点的编号，保证 $f_i<i$。

第三行，$n$ 个正整数 $c_1,c_2,\\ldots,c_n$，其中 $c_i$ 表示将结点 $i$ 染为黑色所需的代价。`,
    outputFormat: `一行，一个整数，表示在满足所有叶子到根的路径上至少有一个黑色结点的前提下，染色代价之和的最小值。`,
    samples: [
      { input: "4\n1 2 3\n5 6 2 3", output: "2" },
      { input: "7\n1 1 2 2 3 3\n64 16 15 4 3 2 1", output: "10" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于 $40\\%$ 的测试点，保证 $2\\le n\\le 16$。

对于另外 $20\\%$ 的测试点，保证 $f_i=i-1$。

对于所有测试点，保证 $2\\le n\\le 10^5$，$1\\le c_i\\le 10^9$。`,
  },
  {
    title: "[GESP202512 六级] 道具商店",
    source: "gesp_official",
    sourceId: "P14920",
    sourceUrl: "https://www.luogu.com.cn/problem/P14920",
    level: 6,
    knowledgePoints: ["动态规划", "背包问题", "01背包"],
    difficulty: "普及/提高-",
    description: `道具商店里有 $n$ 件道具可供挑选。第 $i$ 件道具可为玩家提升 $a_i$ 点攻击力，需要 $c_i$ 枚金币才能购买，每件道具只能购买一次。现在你有 $k$ 枚金币，请问你最多可以提升多少点攻击力？`,
    inputFormat: `第一行，两个正整数 $n,k$，表示道具数量以及你所拥有的金币数量。

接下来 $n$ 行，每行两个正整数 $a_i,c_i$，表示道具所提升的攻击力点数，以及购买所需的金币数量。`,
    outputFormat: `输出一行，一个整数，表示最多可以提升的攻击力点数。`,
    samples: [
      { input: "3 5\n99 1\n33 2\n11 3", output: "132" },
      { input: "4 100\n10 1\n20 11\n40 33\n100 99", output: "110" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于 $60\\%$ 的测试点，保证 $1\\le k\\le 500$，$1\\le c_i\\le 500$。

对于所有测试点，保证 $1\\le n\\le 500$，$1\\le k\\le 10^9$，$1\\le a_i\\le 500$，$1\\le c_i\\le 10^9$。`,
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

    // 为每个题目添加 testCases（与 samples 相同）
    const problemsWithTestCases = gesp6Problems.map(p => ({
      ...p,
      testCases: p.samples,
    }));

    // 添加所有题目
    const result = await prisma.problem.createMany({
      data: problemsWithTestCases,
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
