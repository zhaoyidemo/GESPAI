import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GESP 6级完整题库 - 来源：洛谷 CCF GESP C++ 六级上机题
// 共22道题目
// 难度标签采用洛谷评级：
// - "easy" = 入门(1)/普及-(2)
// - "medium" = 普及/提高-(3)/普及+/提高(4)
// - "hard" = 提高+/省选-(5)及以上

const gesp6Problems = [
  // ========== 样题 ==========
  {
    title: "[GESP样题 六级] 下楼梯",
    source: "gesp_official",
    sourceId: "P10250",
    sourceUrl: "https://www.luogu.com.cn/problem/P10250",
    level: 6,
    knowledgePoints: ["动态规划", "递推", "记忆化搜索"],
    difficulty: "medium", // 洛谷难度4 普及+/提高
    description: `小朋友发现，下楼梯时每一步可以跨越 1、2 或 3 级台阶。

给定共有 N 级台阶，求一共有多少种不同的下楼方法。`,
    inputFormat: `输入一行，包含一个正整数 N，表示台阶的级数。

数据范围：1 ≤ N ≤ 60`,
    outputFormat: `输出一个整数，表示不同的下楼方法数。`,
    samples: [
      { input: "4", output: "7", explanation: "共有7种下楼方式" },
      { input: "10", output: "274", explanation: "共有274种下楼方式" },
    ],
    testCases: [
      { input: "4", output: "7" },
      { input: "10", output: "274" },
      { input: "1", output: "1" },
      { input: "3", output: "4" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "经典动态规划问题。设 f(n) 表示 n 级台阶的方法数，则 f(n) = f(n-1) + f(n-2) + f(n-3)。注意 n=60 时答案很大，需要使用 long long。",
  },
  {
    title: "[GESP样题 六级] 亲朋数",
    source: "gesp_official",
    sourceId: "P10262",
    sourceUrl: "https://www.luogu.com.cn/problem/P10262",
    level: 6,
    knowledgePoints: ["字符串", "数论", "前缀和", "取模"],
    difficulty: "medium", // 洛谷难度4
    description: `给定一个由数字组成的字符串 S，长度为 L（只包含数字 0-9）。

统计有多少个连续子串表示的数字能被给定的整数 p 整除。

注意：
- 子串允许有前导零
- 同一个数字在不同位置出现算作不同的子串`,
    inputFormat: `第一行包含一个整数 p（2 ≤ p ≤ 128）。

第二行包含一个数字字符串 S（1 ≤ L ≤ 10^6）。`,
    outputFormat: `输出一个整数，表示能被 p 整除的连续子串个数。`,
    samples: [
      { input: "2\n102", output: "5", explanation: "能被2整除的子串有：10, 102, 0, 02, 2，共5个" },
      { input: "2\n12342", output: "11", explanation: "共有11个子串能被2整除" },
    ],
    testCases: [
      { input: "2\n102", output: "5" },
      { input: "2\n12342", output: "11" },
      { input: "5\n12345", output: "3" },
    ],
    timeLimit: 2000,
    memoryLimit: 512,
    hint: "直接枚举所有子串时间复杂度为 O(L^2)，可能超时。可以利用取模的性质优化：如果 num[i..j] % p == 0，则 prefix[j] % p == prefix[i-1] % p。",
  },
  // ========== 2023年9月 ==========
  {
    title: "[GESP202309 六级] 小杨买饮料",
    source: "gesp_official",
    sourceId: "B3873",
    sourceUrl: "https://www.luogu.com.cn/problem/B3873",
    level: 6,
    knowledgePoints: ["动态规划", "背包问题", "01背包"],
    difficulty: "medium", // 洛谷难度4 普及+/提高
    description: `小杨想要从商店购买饮料。商店共有 N 种不同的饮料，编号从 0 到 N-1。第 i 种饮料的价格为 c_i 元，容量为 l_i 毫升。

小杨需要购买至少 L 毫升的饮料，每种饮料最多只能购买一瓶。

请帮小杨计算出满足需求的最小花费。如果无法满足需求，输出 "no solution"。`,
    inputFormat: `第一行包含两个正整数 N 和 L，分别表示饮料种类数和需要的最少容量。

接下来 N 行，每行两个正整数 c_i 和 l_i，表示第 i 种饮料的价格和容量。

数据范围：
- 1 ≤ N ≤ 500
- 1 ≤ L ≤ 2000
- 1 ≤ c_i, l_i ≤ 10^6`,
    outputFormat: `输出一个整数，表示最小花费。如果无法满足需求，输出 "no solution"。`,
    samples: [
      { input: "5 100\n100 2000\n2 50\n4 40\n5 30\n3 20", output: "9", explanation: "购买第2、3、4种饮料，总容量110mL，花费9元" },
      { input: "5 141\n100 2000\n2 50\n4 40\n5 30\n3 20", output: "100", explanation: "只能购买第0种饮料" },
      { input: "4 141\n2 50\n4 40\n5 30\n3 20", output: "no solution", explanation: "无法满足需求" },
    ],
    testCases: [
      { input: "5 100\n100 2000\n2 50\n4 40\n5 30\n3 20", output: "9" },
      { input: "5 141\n100 2000\n2 50\n4 40\n5 30\n3 20", output: "100" },
      { input: "4 141\n2 50\n4 40\n5 30\n3 20", output: "no solution" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: "这是一个变形的01背包问题。可以将容量作为状态，求达到至少 L 容量的最小花费。",
  },
  {
    title: "[GESP202309 六级] 小杨的握手问题",
    source: "gesp_official",
    sourceId: "B3874",
    sourceUrl: "https://www.luogu.com.cn/problem/B3874",
    level: 6,
    knowledgePoints: ["归并排序", "逆序对", "分治"],
    difficulty: "medium", // 洛谷难度3 普及/提高-
    description: `班级共有 N 名学生，学号从 0 到 N-1。学生们按照指定的顺序依次进入教室。

每当一名学生进入教室时，需要与已在教室内且学号比自己小的所有学生握手。

求所有学生进入教室后，总共发生了多少次握手。`,
    inputFormat: `第一行包含一个正整数 N，表示学生人数。

第二行包含 N 个整数，表示学生进入教室的顺序（即学号的排列）。

数据范围：1 ≤ N ≤ 10^5`,
    outputFormat: `输出一个整数，表示总握手次数。`,
    samples: [
      { input: "4\n2 1 3 0", output: "2", explanation: "学号2先进，然后1进来与2握手（学号1<2不握手），然后3进来与1、2握手（2次），最后0进来不握手。共2次。" },
      { input: "6\n0 1 2 3 4 5", output: "15", explanation: "每个学生进来都要与前面所有人握手，共1+2+3+4+5=15次" },
    ],
    testCases: [
      { input: "4\n2 1 3 0", output: "2" },
      { input: "6\n0 1 2 3 4 5", output: "15" },
      { input: "3\n2 1 0", output: "0" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: "问题等价于求进入顺序的逆序对数量（即有多少对 (i,j) 满足 i<j 且 a[i]>a[j]）。可以使用归并排序在 O(n log n) 时间内求解。",
  },
  // ========== 2023年12月 ==========
  {
    title: "[GESP202312 六级] 闯关游戏",
    source: "gesp_official",
    sourceId: "P10108",
    sourceUrl: "https://www.luogu.com.cn/problem/P10108",
    level: 6,
    knowledgePoints: ["动态规划", "图论", "BFS"],
    difficulty: "easy", // 洛谷难度2 普及-
    description: `一个包含 N 关的游戏，每关有 M 个通道可供选择。

选择通道 i 后，可以向前推进 a_i 关。离开第 s 关时，可以获得 b_s 分。

从第 0 关开始，当到达或超过第 N 关时游戏结束。求通关时能获得的最大总分。`,
    inputFormat: `第一行包含两个正整数 N 和 M，分别表示关卡数和通道数。

第二行包含 M 个正整数 a_0, a_1, ..., a_{M-1}，表示每个通道能推进的关卡数。

第三行包含 N 个整数 b_0, b_1, ..., b_{N-1}，表示离开每关获得的分数（可以为负数）。

数据范围：
- 1 ≤ N ≤ 10^4
- 1 ≤ M ≤ 100
- 1 ≤ a_i ≤ N
- -10^5 ≤ b_i ≤ 10^5`,
    outputFormat: `输出一个整数，表示能获得的最大总分。`,
    samples: [
      { input: "6 2\n2 3\n1 0 30 100 30 30", output: "131", explanation: "第0关选通道1(+1分到3关) → 第3关选通道0(+100分到5关) → 任选(+30分通关) = 131分" },
      { input: "6 2\n2 3\n1 0 30 100 30 -1", output: "101", explanation: "选择合适的路径避开负分关卡" },
    ],
    testCases: [
      { input: "6 2\n2 3\n1 0 30 100 30 30", output: "131" },
      { input: "6 2\n2 3\n1 0 30 100 30 -1", output: "101" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "使用动态规划，dp[i] 表示从第 i 关开始到通关能获得的最大分数。从后往前递推。",
  },
  {
    title: "[GESP202312 六级] 工作沟通",
    source: "gesp_official",
    sourceId: "P10109",
    sourceUrl: "https://www.luogu.com.cn/problem/P10109",
    level: 6,
    knowledgePoints: ["树", "LCA", "最近公共祖先", "树的遍历"],
    difficulty: "easy", // 洛谷难度2 普及-
    description: `一个公司有 N 名员工，编号从 0 到 N-1。员工 0 是老板，其他每个员工都有且仅有一个直接上司。

员工 x 能够管理员工 y，当且仅当：x = y，或 x 是 y 的直接上司，或 x 能够管理 y 的直接上司。

对于每次协作，需要找到编号最大的员工，使得他能够管理所有参与协作的员工。`,
    inputFormat: `第一行包含一个正整数 N，表示员工数量。

第二行包含 N-1 个整数 f_1, f_2, ..., f_{N-1}，其中 f_i 表示员工 i 的直接上司编号。

第三行包含一个正整数 Q，表示协作次数。

接下来 Q 行，每行描述一次协作：首先是参与人数 m（2 ≤ m ≤ N），然后是 m 个员工编号。

数据范围：
- 3 ≤ N ≤ 300
- Q ≤ 100`,
    outputFormat: `对于每次协作，输出一行，表示被选中协调人的编号。`,
    samples: [
      { input: "5\n0 0 2 2\n3\n2 3 4\n3 2 3 4\n2 1 4", output: "2\n2\n0", explanation: "第一次协作3和4，协调人是2；第二次2、3、4，协调人是2；第三次1和4，只有0能同时管理" },
    ],
    testCases: [
      { input: "5\n0 0 2 2\n3\n2 3 4\n3 2 3 4\n2 1 4", output: "2\n2\n0" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "本质上是求树上多个节点的最近公共祖先（LCA），然后在 LCA 到根的路径上找编号最大的节点。",
  },
  // ========== 2024年3月 ==========
  {
    title: "[GESP202403 六级] 游戏",
    source: "gesp_official",
    sourceId: "P10376",
    sourceUrl: "https://www.luogu.com.cn/problem/P10376",
    level: 6,
    knowledgePoints: ["动态规划", "递推", "计数"],
    difficulty: "medium", // 洛谷难度4
    description: `给定整数 n，从 n 开始，每次操作可以选择减去 a 或减去 b。

当 n ≤ c 时游戏结束。

求不同的操作序列数量，答案对 10^9+7 取模。

注意：即使 a = b，选择减去 a 和选择减去 b 也被视为不同的操作。`,
    inputFormat: `输入一行，包含四个正整数 n, a, b, c。

数据范围：
- 1 ≤ a, b, c ≤ n ≤ 2×10^5`,
    outputFormat: `输出一个整数，表示不同操作序列的数量对 10^9+7 取模的结果。`,
    samples: [
      { input: "1 1 1 1", output: "1", explanation: "n=1已经≤c=1，不需要操作" },
      { input: "114 51 4 1", output: "176" },
      { input: "114514 191 9 810", output: "384178446" },
    ],
    testCases: [
      { input: "1 1 1 1", output: "1" },
      { input: "114 51 4 1", output: "176" },
      { input: "114514 191 9 810", output: "384178446" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "使用动态规划，dp[i] 表示从 i 开始到结束的方案数。当 i ≤ c 时 dp[i] = 1，否则 dp[i] = dp[i-a] + dp[i-b]。",
  },
  {
    title: "[GESP202403 六级] 好斗的牛",
    source: "gesp_official",
    sourceId: "P10377",
    sourceUrl: "https://www.luogu.com.cn/problem/P10377",
    level: 6,
    knowledgePoints: ["贪心", "排序", "枚举", "全排列"],
    difficulty: "easy", // 洛谷难度2 普及-
    description: `有 10^9 个牛栏排成一排。你需要将 n 头牛放入牛栏中。

第 i 头牛有攻击范围 (a_i, b_i)，表示如果在它左边 a_i 个位置内或右边 b_i 个位置内有其他牛，就会发生冲突。

求至少需要多少个连续的牛栏，才能保证存在一种放置方案使得没有任何冲突。`,
    inputFormat: `第一行包含一个正整数 n，表示牛的数量。

第二行包含 n 个正整数 a_1, a_2, ..., a_n。

第三行包含 n 个正整数 b_1, b_2, ..., b_n。

数据范围：
- 1 ≤ n ≤ 9
- 1 ≤ a_i, b_i ≤ 10^3`,
    outputFormat: `输出一个整数，表示需要的最少连续牛栏数。`,
    samples: [
      { input: "2\n1 2\n1 2", output: "4", explanation: "需要4个连续牛栏" },
      { input: "3\n1 2 3\n3 2 1", output: "7", explanation: "需要7个连续牛栏" },
    ],
    testCases: [
      { input: "2\n1 2\n1 2", output: "4" },
      { input: "3\n1 2 3\n3 2 1", output: "7" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "由于 n ≤ 9，可以枚举所有排列方式，对于每种排列计算所需的最小牛栏数。",
  },
  // ========== 2024年6月 ==========
  {
    title: "[GESP202406 六级] 计算得分",
    source: "gesp_official",
    sourceId: "P10721",
    sourceUrl: "https://www.luogu.com.cn/problem/P10721",
    level: 6,
    knowledgePoints: ["动态规划", "字符串", "贪心"],
    difficulty: "medium", // 洛谷难度4 普及+/提高
    description: `给定一个长度为 m 的字符串和一个长度为 n 的得分序列 A。

字符串中连续 k 个 "abc" 构成的子串可以获得 a_k 分。每个字符只能参与一次计分。

求字符串能获得的最大总分。`,
    inputFormat: `第一行包含一个正整数 n，表示得分序列长度。

第二行包含 n 个正整数，表示得分序列 A。

第三行包含一个正整数 m，表示字符串长度。

第四行包含一个长度为 m 的小写字母字符串。

数据范围：
- 1 ≤ n ≤ 20
- 1 ≤ m ≤ 10^5
- 1 ≤ a_i ≤ 1000`,
    outputFormat: `输出一个整数，表示最大总分。`,
    samples: [
      { input: "3\n3 1 2\n13\ndabcabcabcabz", output: "9", explanation: "最优分割是 d+abc+abc+abc+abz，每个abc得3分，共9分" },
    ],
    testCases: [
      { input: "3\n3 1 2\n13\ndabcabcabcabz", output: "9" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "使用动态规划，需要处理如何最优地划分连续的 abc 子串。",
  },
  {
    title: "[GESP202406 六级] 二叉树",
    source: "gesp_official",
    sourceId: "P10722",
    sourceUrl: "https://www.luogu.com.cn/problem/P10722",
    level: 6,
    knowledgePoints: ["树", "二叉树", "DFS", "子树"],
    difficulty: "medium", // 洛谷难度3 普及/提高-
    description: `小杨有一棵 n 个节点的二叉树，根节点编号为 1。每个节点颜色为白色（0）或黑色（1）。

小杨会进行 q 次操作，每次操作选择一个节点，将以该节点为根的子树中所有节点的颜色取反（白变黑，黑变白）。

求所有操作完成后，每个节点的最终颜色。`,
    inputFormat: `第一行包含一个正整数 n，表示节点数量。

第二行包含 n-1 个正整数，第 i 个数表示节点 i+1 的父节点编号。

第三行包含一个长度为 n 的 01 字符串，表示每个节点的初始颜色。

第四行包含一个正整数 q，表示操作次数。

接下来 q 行，每行一个正整数，表示操作的节点编号。

数据范围：
- 1 ≤ n, q ≤ 10^5`,
    outputFormat: `输出一个长度为 n 的 01 字符串，表示最终每个节点的颜色。`,
    samples: [
      { input: "6\n3 1 1 3 4\n100101\n3\n1\n3\n2", output: "010000", explanation: "依次对节点1、3、2的子树取反后的结果" },
    ],
    testCases: [
      { input: "6\n3 1 1 3 4\n100101\n3\n1\n3\n2", output: "010000" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "每个节点被取反的次数等于其祖先（包括自己）被操作的次数之和。奇数次取反则颜色改变，偶数次则不变。可以用DFS或记录每个节点的操作次数来解决。",
  },
  // ========== 2024年9月 ==========
  {
    title: "[GESP202409 六级] 小杨和整数拆分",
    source: "gesp_official",
    sourceId: "P11246",
    sourceUrl: "https://www.luogu.com.cn/problem/P11246",
    level: 6,
    knowledgePoints: ["动态规划", "数论", "完全平方数"],
    difficulty: "medium", // 洛谷难度4
    description: `给定一个正整数 n，求将其表示为若干个完全平方数之和的最少个数。

例如：
- 18 = 9 + 9 = 3² + 3²，最少需要 2 个完全平方数`,
    inputFormat: `输入一行，包含一个正整数 n。

数据范围：1 ≤ n ≤ 10^5`,
    outputFormat: `输出一个整数，表示最少需要的完全平方数个数。`,
    samples: [
      { input: "18", output: "2", explanation: "18 = 9 + 9 = 3² + 3²" },
    ],
    testCases: [
      { input: "18", output: "2" },
      { input: "12", output: "3" },
      { input: "1", output: "1" },
      { input: "100", output: "1" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "使用动态规划，dp[i] 表示 i 最少可以拆分成多少个完全平方数之和。dp[i] = min(dp[i-j²]) + 1，其中 j² ≤ i。",
  },
  {
    title: "[GESP202409 六级] 算法学习",
    source: "gesp_official",
    sourceId: "P11247",
    sourceUrl: "https://www.luogu.com.cn/problem/P11247",
    level: 6,
    knowledgePoints: ["贪心", "动态规划", "排序"],
    difficulty: "hard", // 洛谷难度5 提高+/省选-
    description: `小杨计划通过做 n 道练习题来掌握 m 种算法。每道题针对一种算法，完成后可以增加对应算法的熟练度。

目标是让所有 m 种算法的熟练度都达到 k。

约束条件：不能连续做两道针对同一种算法的题目。

求达成目标所需的最少做题数量，如果无法达成则输出 -1。`,
    inputFormat: `第一行包含三个正整数 m, n, k，分别表示算法种类数、题目数、目标熟练度。

第二行包含 n 个正整数 a_1, a_2, ..., a_n，表示每道题对应的算法编号。

第三行包含 n 个正整数 b_1, b_2, ..., b_n，表示完成每道题增加的熟练度。

数据范围：
- 1 ≤ m ≤ 10^5
- 1 ≤ n ≤ 10^5
- 1 ≤ k ≤ 10^5
- 1 ≤ b_i ≤ 10^5`,
    outputFormat: `输出一个整数，表示最少做题数量，如果无法达成输出 -1。`,
    samples: [
      { input: "3 5 10\n1 1 2 3 3\n9 1 10 10 1", output: "4", explanation: "最优顺序是题目1→3→4→2，共4道" },
      { input: "2 4 10\n1 1 1 2\n1 2 7 10", output: "-1", explanation: "无法满足条件" },
    ],
    testCases: [
      { input: "3 5 10\n1 1 2 3 3\n9 1 10 10 1", output: "4" },
      { input: "2 4 10\n1 1 1 2\n1 2 7 10", output: "-1" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "需要贪心地选择题目，同时满足不能连续做同一算法的约束。可以使用优先队列或排序来优化选择过程。",
  },
  // ========== 2024年12月 ==========
  {
    title: "[GESP202412 六级] 树上游走",
    source: "gesp_official",
    sourceId: "P11375",
    sourceUrl: "https://www.luogu.com.cn/problem/P11375",
    level: 6,
    knowledgePoints: ["树", "二叉树", "模拟", "位运算"],
    difficulty: "hard", // 洛谷难度5 提高+/省选-
    description: `小杨在一棵无限完全二叉树上进行游走。节点 1 是根，对于节点 i，其左孩子是 2i，右孩子是 2i+1。

从节点 s 开始，进行 n 次移动。每次移动使用以下操作之一：
- U：移动到父节点（如果存在）
- L：移动到左孩子
- R：移动到右孩子

求 n 次移动后所在的节点编号。`,
    inputFormat: `第一行包含两个正整数 n 和 s，表示移动次数和起始节点。

第二行包含一个长度为 n 的字符串，只包含 U、L、R 三种字符。

数据范围：
- 1 ≤ n ≤ 10^6
- 1 ≤ s ≤ 10^12
- 最终节点编号 ≤ 10^12`,
    outputFormat: `输出一个整数，表示最终所在节点的编号。`,
    samples: [
      { input: "3 2\nURR", output: "7", explanation: "路径：2 → 1 → 3 → 7" },
    ],
    testCases: [
      { input: "3 2\nURR", output: "7" },
      { input: "4 1\nLRLR", output: "13" },
      { input: "2 4\nUU", output: "1" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "直接模拟可能会因为中间节点编号过大而溢出。可以先用栈处理 U 和 L/R 的抵消关系，然后再计算最终位置。",
  },
  {
    title: "[GESP202412 六级] 运送物资",
    source: "gesp_official",
    sourceId: "P11376",
    sourceUrl: "https://www.luogu.com.cn/problem/P11376",
    level: 6,
    knowledgePoints: ["贪心", "排序", "图论", "最优化"],
    difficulty: "hard", // 洛谷难度5
    description: `A 国有 n 座城市，城市 1 是首都。城市之间有 n-1 条双向道路连接，形成一棵树。

需要将货物从首都运送到每座城市。共有 m 辆卡车，每辆卡车可以分配到一个运输站。

每辆卡车 i 需要去 A 城（坐标 0）运输 a_i 次，去 B 城（坐标 x）运输 b_i 次。从位置 p 的运输站出发，去 A 城一次的行驶距离是 2p，去 B 城一次的行驶距离是 2(x-p)。

每个运输站 i 位于位置 p_i，最多可容纳 c_i 辆卡车。

求所有卡车的最小总行驶距离。`,
    inputFormat: `第一行包含三个正整数 n, m, x，表示运输站数、卡车数、城市距离。

接下来 n 行，每行两个整数 p_i, c_i，表示运输站位置和容量。

接下来 m 行，每行两个整数 a_i, b_i，表示每辆卡车需要去 A 城和 B 城的次数。

数据范围：
- 1 ≤ n, m ≤ 10^5
- 2 ≤ x ≤ 10^8
- 0 < p_i < x
- 1 ≤ c_i ≤ 10^5
- 0 ≤ a_i, b_i ≤ 10^5
- 运输站总容量 ≥ m`,
    outputFormat: `输出一个整数，表示最小总行驶距离。`,
    samples: [
      { input: "3 3 100\n20 2\n50 1\n80 2\n5 3\n3 5\n4 4", output: "40186", explanation: "最优分配方案的总距离" },
    ],
    testCases: [
      { input: "3 3 100\n20 2\n50 1\n80 2\n5 3\n3 5\n4 4", output: "40186" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "对于每辆卡车，根据 a_i 和 b_i 的比例，可以计算出其最优的运输站位置。然后使用贪心算法进行分配。",
  },
  // ========== 2025年3月 ==========
  {
    title: "[GESP202503 六级] 树上漫步",
    source: "gesp_official",
    sourceId: "P11962",
    sourceUrl: "https://www.luogu.com.cn/problem/P11962",
    level: 6,
    knowledgePoints: ["树", "DFS", "BFS", "图的遍历", "奇偶性"],
    difficulty: "medium", // 洛谷难度4
    description: `小 A 有一棵 n 个节点的树，节点编号从 1 到 n。

从任意节点出发，可以移动到相邻节点。小 A 必须在偶数步后停止（包括 0 步）。

对于每个起始节点，计算有多少个节点可以通过偶数步到达。`,
    inputFormat: `第一行包含一个正整数 n，表示节点数量。

接下来 n-1 行，每行两个正整数 u_i, v_i，表示节点 u_i 和 v_i 之间有一条边。

数据范围：1 ≤ n ≤ 2×10^5`,
    outputFormat: `输出一行 n 个整数，第 i 个整数表示从节点 i 出发能到达的节点数。`,
    samples: [
      { input: "3\n1 3\n2 3", output: "2 2 1", explanation: "从1出发可到1,2；从2出发可到1,2；从3出发只能到3" },
      { input: "4\n1 3\n3 2\n4 3", output: "3 3 1 3", explanation: "树的结构决定了可达性" },
    ],
    testCases: [
      { input: "3\n1 3\n2 3", output: "2 2 1" },
      { input: "4\n1 3\n3 2\n4 3", output: "3 3 1 3" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "树是二分图。从任意节点出发，偶数步只能到达与起点同色的节点。先对树进行黑白染色，然后统计同色节点数量。",
  },
  {
    title: "[GESP202503 六级] 环线",
    source: "gesp_official",
    sourceId: "P11963",
    sourceUrl: "https://www.luogu.com.cn/problem/P11963",
    level: 6,
    knowledgePoints: ["前缀和", "最大子段和", "环形结构"],
    difficulty: "medium", // 洛谷难度3 普及/提高-
    description: `小 A 喜欢坐地铁。环形地铁线有 n 个站点，编号 1, 2, ..., n。站点 i（1 ≤ i < n）与站点 i+1 相邻，站点 n 与站点 1 相邻。

小 A 从某站上车，在另一站下车（至少经过一个站点，每个站点最多经过一次）。经过站点 i 时获得 a_i 的快乐值。

求小 A 能获得的最大快乐值。`,
    inputFormat: `第一行包含一个正整数 n，表示站点数量。

第二行包含 n 个整数 a_i，表示每个站点的快乐值（可以为负数）。

数据范围：
- 1 ≤ n ≤ 2×10^5
- -10^9 ≤ a_i ≤ 10^9`,
    outputFormat: `输出一个整数，表示最大快乐值。`,
    samples: [
      { input: "4\n-1 2 3 0", output: "5", explanation: "选择站点2和3，获得2+3=5" },
      { input: "5\n-3 4 -5 1 3", output: "5", explanation: "最优选择得5分" },
    ],
    testCases: [
      { input: "4\n-1 2 3 0", output: "5" },
      { input: "5\n-3 4 -5 1 3", output: "5" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "环形最大子段和问题。答案是 max(普通最大子段和, 总和 - 最小子段和)。但要注意不能选择所有元素（必须至少经过一个站点，且不能绕完整圈）。",
  },
  // ========== 2025年6月 ==========
  {
    title: "[GESP202506 六级] 学习小组",
    source: "gesp_official",
    sourceId: "P13015",
    sourceUrl: "https://www.luogu.com.cn/problem/P13015",
    level: 6,
    knowledgePoints: ["动态规划", "整数划分", "背包问题"],
    difficulty: "medium", // 洛谷难度4 普及+/提高
    description: `老师将 n 名学生分成若干学习小组。如果一个小组恰好有 k 名学生，该小组的"讨论热情"为 a_k。

求所有可能的分组方案中，总"讨论热情"的最大值。`,
    inputFormat: `第一行包含一个正整数 n，表示学生人数。

第二行包含 n 个非负整数 a_1, a_2, ..., a_n，表示不同小组人数对应的讨论热情。

数据范围：
- 1 ≤ n ≤ 1000
- 0 ≤ a_i ≤ 10^4`,
    outputFormat: `输出一个整数，表示最大总讨论热情。`,
    samples: [
      { input: "4\n1 5 6 3", output: "10", explanation: "分成两个2人小组，讨论热情为5+5=10" },
      { input: "8\n0 2 5 6 4 3 3 4", output: "12", explanation: "最优分组方案总热情为12" },
    ],
    testCases: [
      { input: "4\n1 5 6 3", output: "10" },
      { input: "8\n0 2 5 6 4 3 3 4", output: "12" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "使用动态规划，dp[i] 表示 i 个学生的最大讨论热情。dp[i] = max(dp[i-k] + a_k)，其中 1 ≤ k ≤ i。",
  },
  {
    title: "[GESP202506 六级] 最大因数",
    source: "gesp_official",
    sourceId: "P13016",
    sourceUrl: "https://www.luogu.com.cn/problem/P13016",
    level: 6,
    knowledgePoints: ["树", "因数", "数论", "LCA"],
    difficulty: "medium", // 洛谷难度3 普及/提高-
    description: `定义一棵有 10^9 个节点的有根树，节点编号从 1 到 10^9，节点 1 是根。

对于节点 k（k ≥ 2），其父节点是 k 除了 k 自身以外的最大因数。

给定 q 次询问，每次询问两个节点 x 和 y 之间的距离（树上两点间的边数）。`,
    inputFormat: `第一行包含一个正整数 q，表示询问次数。

接下来 q 行，每行两个正整数 x_i 和 y_i，表示询问的两个节点。

数据范围：
- 1 ≤ q ≤ 1000
- 1 ≤ x_i, y_i ≤ 10^9`,
    outputFormat: `对于每次询问，输出一行，表示两节点间的距离。`,
    samples: [
      { input: "3\n1 3\n2 5\n4 8", output: "1\n2\n1", explanation: "节点3的父节点是1，距离为1；节点2和5的LCA是1，距离为2；节点4和8的父节点都是2，但8的父节点是4，距离为1" },
      { input: "1\n120 650", output: "9", explanation: "计算树上距离" },
    ],
    testCases: [
      { input: "3\n1 3\n2 5\n4 8", output: "1\n2\n1" },
      { input: "1\n120 650", output: "9" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "节点 k 的父节点是 k / p，其中 p 是 k 的最小质因子。节点 k 到根的距离等于 k 的质因子个数（计重数）。求两点距离需要找 LCA。",
  },
  // ========== 2025年9月 ==========
  {
    title: "[GESP202509 六级] 划分字符串",
    source: "gesp_official",
    sourceId: "P14075",
    sourceUrl: "https://www.luogu.com.cn/problem/P14075",
    level: 6,
    knowledgePoints: ["动态规划", "字符串", "贪心"],
    difficulty: "medium", // 洛谷难度4
    description: `将一个长度为 n 的小写字母字符串划分成若干子串，要求每个子串中每个字母最多出现一次。

划分一个长度为 k 的子串可以获得 a_k 分。

求最大总分。`,
    inputFormat: `第一行包含一个正整数 n，表示字符串长度。

第二行包含一个长度为 n 的小写字母字符串 s。

第三行包含 n 个正整数 a_1, a_2, ..., a_n，表示不同长度子串的分值。

数据范围：
- 1 ≤ n ≤ 10^5
- 1 ≤ a_i ≤ 10^9`,
    outputFormat: `输出一个整数，表示最大总分。`,
    samples: [
      { input: "6\nstreet\n2 1 7 4 3 3", output: "13", explanation: "划分为 str(7分) + e(1分) + e(1分) + t(4分) = 13分。注意：无法把ee划分在一起因为有重复字母" },
      { input: "8\nblossoms\n1 1 2 3 5 8 13 21", output: "8", explanation: "最优划分得8分" },
    ],
    testCases: [
      { input: "6\nstreet\n2 1 7 4 3 3", output: "13" },
      { input: "8\nblossoms\n1 1 2 3 5 8 13 21", output: "8" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "使用动态规划，dp[i] 表示前 i 个字符的最大得分。对于每个位置 i，枚举以 i 结尾的最长无重复子串。",
  },
  {
    title: "[GESP202509 六级] 货物运输",
    source: "gesp_official",
    sourceId: "P14076",
    sourceUrl: "https://www.luogu.com.cn/problem/P14076",
    level: 6,
    knowledgePoints: ["树", "DFS", "树的遍历", "贪心"],
    difficulty: "hard", // 洛谷难度5 提高+/省选-
    description: `A 国有 n 座城市（编号 1 到 n，城市 1 是首都），由 n-1 条双向道路连接成一棵树。

一支货物车队需要从首都出发，将货物运送到每座城市。车队可以多次经过同一条道路，最后不需要返回首都。

求车队完成运送任务的最小总行驶距离。`,
    inputFormat: `第一行包含一个正整数 n，表示城市数量。

接下来 n-1 行，每行三个正整数 u_i, v_i, l_i，表示城市 u_i 和 v_i 之间有一条长度为 l_i 的道路。

数据范围：
- 1 ≤ n ≤ 10^5
- 边权 ≤ 10^9`,
    outputFormat: `输出一个整数，表示最小总行驶距离。`,
    samples: [
      { input: "4\n1 2 6\n1 3 1\n3 4 5", output: "18", explanation: "最优路径的总距离为18" },
      { input: "7\n1 2 1\n2 3 1\n3 4 1\n4 5 1\n5 6 1\n6 7 1", output: "9", explanation: "链状树的情况" },
    ],
    testCases: [
      { input: "4\n1 2 6\n1 3 1\n3 4 5", output: "18" },
      { input: "7\n1 2 1\n2 3 1\n3 4 1\n4 5 1\n5 6 1\n6 7 1", output: "9" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "要访问所有节点，除了最后停留的那条路径外，其他每条边都需要走两次。答案 = 2 * 总边权 - 从根到最远叶子的距离。",
  },
  // ========== 2025年12月 ==========
  {
    title: "[GESP202512 六级] 路径覆盖",
    source: "gesp_official",
    sourceId: "P14919",
    sourceUrl: "https://www.luogu.com.cn/problem/P14919",
    level: 6,
    knowledgePoints: ["树", "DFS", "动态规划", "树形DP"],
    difficulty: "medium", // 洛谷难度4
    description: `给定一棵 n 个节点的有根树，根是节点 1。需要将某些节点染成黑色，使得从每个叶子节点到根的路径上至少有一个黑色节点。

每个节点 i 染色的代价是 c_i。

求满足条件的最小总染色代价。`,
    inputFormat: `第一行包含一个正整数 n，表示节点数量。

第二行包含 n-1 个正整数 f_2, f_3, ..., f_n，其中 f_i 表示节点 i 的父节点（f_i < i）。

第三行包含 n 个正整数 c_1, c_2, ..., c_n，表示每个节点的染色代价。

数据范围：
- 2 ≤ n ≤ 10^5
- 1 ≤ c_i ≤ 10^9`,
    outputFormat: `输出一个整数，表示最小总染色代价。`,
    samples: [
      { input: "4\n1 2 3\n5 6 2 3", output: "2", explanation: "只需要染色节点3，代价为2" },
      { input: "7\n1 1 2 2 3 3\n64 16 15 4 3 2 1", output: "10", explanation: "最优方案染色代价为10" },
    ],
    testCases: [
      { input: "4\n1 2 3\n5 6 2 3", output: "2" },
      { input: "7\n1 1 2 2 3 3\n64 16 15 4 3 2 1", output: "10" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "使用树形动态规划。对于每个节点，考虑是否染色。如果染色，则其子树中的叶子都被覆盖；否则需要在子树中选择节点染色。",
  },
  {
    title: "[GESP202512 六级] 道具商店",
    source: "gesp_official",
    sourceId: "P14920",
    sourceUrl: "https://www.luogu.com.cn/problem/P14920",
    level: 6,
    knowledgePoints: ["动态规划", "背包问题", "01背包"],
    difficulty: "medium", // 洛谷难度4
    description: `道具商店提供 n 种道具。第 i 种道具可以增加 a_i 点攻击力，价格为 c_i 金币。

你有 k 金币，每种道具最多购买一件。

求能获得的最大攻击力增益。`,
    inputFormat: `第一行包含两个正整数 n 和 k，表示道具种类数和金币数量。

接下来 n 行，每行两个正整数 a_i 和 c_i，表示第 i 种道具的攻击力增益和价格。

数据范围：
- 1 ≤ n ≤ 500
- 1 ≤ k ≤ 10^9
- 1 ≤ a_i ≤ 500
- 1 ≤ c_i ≤ 10^9`,
    outputFormat: `输出一个整数，表示最大攻击力增益。`,
    samples: [
      { input: "3 3\n99 1\n33 2\n11 3", output: "132", explanation: "购买前两件道具，攻击力增益99+33=132" },
      { input: "4 100\n10 1\n20 11\n40 33\n100 99", output: "110", explanation: "最优购买方案得110点攻击力" },
    ],
    testCases: [
      { input: "3 3\n99 1\n33 2\n11 3", output: "132" },
      { input: "4 100\n10 1\n20 11\n40 33\n100 99", output: "110" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "这是01背包问题，但 k 可能很大（10^9）。注意到 n ≤ 500 且 a_i ≤ 500，可以转换思路：dp[i] 表示获得 i 点攻击力的最小花费，然后找最大的 i 使得 dp[i] ≤ k。",
  },
];

async function seedGesp6() {
  try {
    // 获取现有题目ID列表，避免重复添加
    const existingProblems = await prisma.problem.findMany({
      where: {
        sourceId: {
          in: gesp6Problems.map(p => p.sourceId).filter(Boolean) as string[]
        }
      },
      select: { sourceId: true }
    });

    const existingIds = new Set(existingProblems.map(p => p.sourceId));

    // 过滤出需要添加的新题目
    const newProblems = gesp6Problems.filter(p => !existingIds.has(p.sourceId));

    if (newProblems.length === 0) {
      return NextResponse.json({
        success: true,
        message: "所有 GESP 6级题目已存在",
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
      message: `成功添加 ${result.count} 道 GESP 6级题目`,
      existingCount: existingProblems.length,
      addedCount: result.count,
      totalCount: existingProblems.length + result.count
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
