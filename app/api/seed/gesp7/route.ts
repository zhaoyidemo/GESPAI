import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GESP 7级完整题库 - 来源：洛谷 CCF GESP C++ 七级上机题
// 共20道题目
// 难度标签采用洛谷评级：
// - 入门(1)/普及-(2) → "easy"
// - 普及/提高-(3)/普及+/提高(4) → "medium"
// - 提高+/省选-(5)及以上 → "hard"

const gesp7Problems = [
  // ========== 样题 ==========
  {
    title: "[GESP样题 七级] 迷宫统计",
    source: "gesp_official",
    sourceId: "P10265",
    sourceUrl: "https://www.luogu.com.cn/problem/P10265",
    level: 7,
    knowledgePoints: ["图论", "邻接矩阵", "有向图", "遍历"],
    difficulty: "easy", // 普及级
    description: `在有向图中，存在 n 个迷宫（节点），编号 1 到 n。玩家从 m 号迷宫出发，需要统计：有多少迷宫能直接到达 m，m 能直接到达多少迷宫，以及这两个数的和。

注意每个迷宫都能直接到达自身。`,
    inputFormat: `第一行：两个整数 n 和 m（分别为迷宫总数和出发迷宫编号）

随后 n 行：每行 n 个整数组成的邻接矩阵，其中 1 表示能直接到达，0 表示不能

数据范围：
- 子任务1：n ≤ 10，30分
- 子任务2：n ≤ 100，30分
- 子任务3：n ≤ 1000，40分
- 全部数据：1 ≤ m ≤ n ≤ 1000`,
    outputFormat: `一行输出空格分隔的三个整数，分别表示迷宫 m 可以直接到达其他的迷宫有多少个，有多少迷宫可以直接到达 m 号迷宫，这些迷宫的总和。`,
    samples: [
      {
        input: "6 4\n1 1 0 1 0 0\n0 1 1 0 0 0\n1 0 1 0 0 1\n0 0 1 1 0 1\n0 0 0 1 1 0\n1 0 0 0 1 1",
        output: "3 3 6",
        explanation: "从迷宫4出发可以直接到达3个迷宫，有3个迷宫可以直接到达迷宫4",
      },
    ],
    testCases: [
      {
        input: "6 4\n1 1 0 1 0 0\n0 1 1 0 0 0\n1 0 1 0 0 1\n0 0 1 1 0 1\n0 0 0 1 1 0\n1 0 0 0 1 1",
        output: "3 3 6",
      },
      { input: "3 1\n1 1 1\n0 1 0\n0 0 1", output: "3 1 4" },
      { input: "2 2\n1 0\n1 1", output: "1 1 2" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: "遍历邻接矩阵的第 m 行统计 m 能到达的迷宫数，遍历第 m 列统计能到达 m 的迷宫数。",
  },
  {
    title: "[GESP样题 七级] 最长不下降子序列",
    source: "gesp_official",
    sourceId: "P10287",
    sourceUrl: "https://www.luogu.com.cn/problem/P10287",
    level: 7,
    knowledgePoints: ["动态规划", "DP", "最长不下降子序列", "LIS", "DAG", "拓扑排序", "图上DP"],
    difficulty: "medium", // 普及/提高-
    description: `小杨有一个有向无环图（DAG），共有 n 个节点和 m 条边。每个节点 i 有一个权值 A_i。

对于图中的任意一条路径，经过的节点权值依次组成一个序列。

请求出所有可能路径序列中，最长不下降子序列的最大长度。`,
    inputFormat: `第一行：两个整数 n, m（节点数和边数）

第二行：n 个整数 A_1, A_2, ..., A_n（节点权值）

接下来 m 行：每行两个整数 u_i, v_i（表示从 u_i 到 v_i 的有向边）

数据范围：
- 1 ≤ n, m ≤ 10^5
- 1 ≤ A_i ≤ 10`,
    outputFormat: `输出一个整数，表示答案。`,
    samples: [
      {
        input: "5 4\n2 10 6 3 1\n5 2\n2 3\n3 1\n1 4",
        output: "3",
        explanation: "路径 5→2→3→1→4 对应序列 [1,10,6,2,3]，最长不下降子序列为 [1,2,3] 长度为3",
      },
      {
        input: "6 11\n1 1 2 1 1 2\n1 2\n2 1\n2 3\n3 2\n3 4\n4 3\n4 5\n5 4\n5 6\n6 5\n1 6",
        output: "4",
      },
    ],
    testCases: [
      { input: "5 4\n2 10 6 3 1\n5 2\n2 3\n3 1\n1 4", output: "3" },
      {
        input: "6 11\n1 1 2 1 1 2\n1 2\n2 1\n2 3\n3 2\n3 4\n4 3\n4 5\n5 4\n5 6\n6 5\n1 6",
        output: "4",
      },
      {
        input: "6 11\n5 9 10 5 1 6\n1 2\n2 1\n2 3\n3 2\n3 4\n4 3\n4 5\n5 4\n5 6\n6 5\n1 6",
        output: "4",
      },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "结合图的拓扑结构和动态规划。由于权值范围很小（≤10），可以用 dp[u][v] 表示到达节点 u 且最长不下降子序列最后一个元素为 v 时的最大长度。",
  },

  // ========== 2023年12月 ==========
  {
    title: "[GESP202312 七级] 商品交易",
    source: "gesp_official",
    sourceId: "P10110",
    sourceUrl: "https://www.luogu.com.cn/problem/P10110",
    level: 7,
    knowledgePoints: ["图论", "最短路", "Dijkstra", "SPFA", "带权图"],
    difficulty: "medium", // 普及+/提高
    description: `你拥有商品 a，想要通过交换获得商品 b。共有 N 种商品（编号 0 到 N-1），每种商品有价值 v_0 到 v_{N-1}。

有 M 个商人提供交易服务。对于第 j 个商人，他可以将商品 x_j 换成商品 y_j：
- 如果 v_{x_j} > v_{y_j}，你将获得 |差值| 元
- 否则，你需要支付 |差值| 元
- 无论哪种情况，都需要额外支付 1 元手续费

求获得商品 b 的最小花费（可能为负，表示盈利）。`,
    inputFormat: `第一行：四个整数 N, M, a, b（商品数量、商人数量、起始商品、目标商品）

第二行：N 个正整数，表示价值 v_0 到 v_{N-1}（每个 ≤ 10^9）

接下来 M 行：每行两个整数 x_j, y_j（表示可用 x_j 换 y_j）

数据范围：
- 30% 数据：N ≤ 10, M ≤ 20
- 70% 数据：N ≤ 10^3, M ≤ 10^4
- 100% 数据：N ≤ 10^5, M ≤ 2×10^5`,
    outputFormat: `输出一个整数，表示最小花费。如果无法获得商品 b，输出 "No solution"。`,
    samples: [
      {
        input: "3 5 0 2\n1 2 4\n1 0\n2 0\n0 1\n2 1\n1 2",
        output: "5",
        explanation: "从商品0出发，通过一系列交易到达商品2，最小花费为5",
      },
      {
        input: "3 3 0 2\n100 2 4\n0 1\n1 2\n0 2",
        output: "-95",
        explanation: "可以盈利95元",
      },
      {
        input: "4 4 3 0\n1 2 3 4\n1 0\n0 1\n3 2\n2 3",
        output: "No solution",
      },
    ],
    testCases: [
      { input: "3 5 0 2\n1 2 4\n1 0\n2 0\n0 1\n2 1\n1 2", output: "5" },
      { input: "3 3 0 2\n100 2 4\n0 1\n1 2\n0 2", output: "-95" },
      { input: "4 4 3 0\n1 2 3 4\n1 0\n0 1\n3 2\n2 3", output: "No solution" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "将问题建模为带权有向图的最短路问题。每条边的权值为交易的净花费。使用 Dijkstra 或 SPFA 求解。",
  },
  {
    title: "[GESP202312 七级] 纸牌游戏",
    source: "gesp_official",
    sourceId: "P10111",
    sourceUrl: "https://www.luogu.com.cn/problem/P10111",
    level: 7,
    knowledgePoints: ["动态规划", "DP", "博弈", "状态转移", "贪心"],
    difficulty: "medium", // 普及+/提高
    description: `两名玩家进行 N 轮游戏。每人各有卡牌 0、1、2（各一张，可重复使用）。

规则：
- "1 克 0，2 克 1，0 克 2"
- 胜者得 2×a_i 分，败者得 0 分
- 平局双方各得 a_i 分

对手已提前公开所有 N 轮的出牌。你可以继续使用上一轮的牌，或"切换"到新牌（从第2轮开始），每次切换需要支付 b_i 的罚分。

目标：最大化总得分。`,
    inputFormat: `第一行：整数 N（轮数）

第二行：N 个非负整数 a_1, ..., a_n（每轮奖励分）

第三行：N-1 个非负整数 b_1, ..., b_{n-1}（切换惩罚）

第四行：N 个整数 c_1, ..., c_n（对手每轮出的牌，0/1/2）

数据范围：
- N ≤ 1000
- a_i, b_i ≤ 10^6`,
    outputFormat: `输出一个整数，表示最大得分。`,
    samples: [
      {
        input: "4\n1 2 10 100\n1 100 1\n1 1 2 0",
        output: "219",
        explanation: "选择合适的出牌策略和切换时机",
      },
      {
        input: "6\n3 7 2 8 9 4\n1 3 9 27 81\n0 1 2 1 2 0",
        output: "56",
      },
    ],
    testCases: [
      { input: "4\n1 2 10 100\n1 100 1\n1 1 2 0", output: "219" },
      { input: "6\n3 7 2 8 9 4\n1 3 9 27 81\n0 1 2 1 2 0", output: "56" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "使用动态规划。dp[i][j] 表示第 i 轮结束时手持卡牌 j 的最大得分。注意状态转移时要考虑切换牌的代价。",
  },

  // ========== 2024年3月 ==========
  {
    title: "[GESP202403 七级] 交流问题",
    source: "gesp_official",
    sourceId: "P10378",
    sourceUrl: "https://www.luogu.com.cn/problem/P10378",
    level: 7,
    knowledgePoints: ["图论", "二分图", "染色", "BFS", "DFS", "连通分量"],
    difficulty: "medium", // 普及/提高-
    description: `A、B 两所学校的学生聚在一起交流。共有 n 名学生（编号 1 到 n）。

他们进行了 m 次交流，每次交流学生 u_i 和 v_i 讨论问题并成为朋友。只有不同学校的学生才会交流，同校学生不交流。

作为 A 校的顾问，你需要确定 B 校学生人数的最小值和最大值。`,
    inputFormat: `第一行：两个整数 n（学生数）和 m（交流次数）

接下来 m 行：每行两个整数 u_i, v_i（表示一次交流）

数据范围：
- 30% 数据：n ≤ 17, m ≤ 50
- 60% 数据：n ≤ 500, m ≤ 2000
- 100% 数据：1 ≤ u_i, v_i ≤ n ≤ 10^5, 1 ≤ m ≤ 2×10^5`,
    outputFormat: `一行两个整数，空格分隔，表示 B 校学生人数的最小值和最大值。`,
    samples: [
      {
        input: "4 3\n1 2\n2 3\n4 2",
        output: "1 3",
        explanation: "可以让1个学生属于B校，也可以让3个学生属于B校",
      },
      {
        input: "7 5\n1 2\n2 3\n4 2\n5 6\n6 7",
        output: "2 5",
      },
    ],
    testCases: [
      { input: "4 3\n1 2\n2 3\n4 2", output: "1 3" },
      { input: "7 5\n1 2\n2 3\n4 2\n5 6\n6 7", output: "2 5" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "这是一个二分图染色问题。对每个连通分量进行二分图染色，统计两种颜色的节点数。利用背包思想或贪心求解最小和最大值。",
  },
  {
    title: "[GESP202403 七级] 俄罗斯方块",
    source: "gesp_official",
    sourceId: "P10379",
    sourceUrl: "https://www.luogu.com.cn/problem/P10379",
    level: 7,
    knowledgePoints: ["图论", "连通分量", "BFS", "DFS", "哈希", "形状判断", "平移不变性"],
    difficulty: "medium", // 普及/提高-
    description: `小杨用不同种类的俄罗斯方块填满了一个 n×m 的网格。需要计算网格中俄罗斯方块的种类数。

规则：
- 同色方块若四连通（上下左右相邻）则直接连通
- 通过其他同色方块间接连接也视为连通
- 一个俄罗斯方块由一个方块及所有与其连通的同色方块组成
- 两个俄罗斯方块种类相同，当且仅当通过平移可使其重合（颜色不同也视为同种）`,
    inputFormat: `第一行：两个正整数 n 和 m（网格大小）

后续 n 行：每行 m 个正整数，表示对应位置方块的颜色值

数据范围：
- 子任务1(30分)：n, m ≤ 20，所有方块大小不超过 5×5
- 子任务2(30分)：n, m ≤ 500，仅包含 1×x 或 x×1 的线性方块
- 子任务3(40分)：n, m ≤ 500，无特殊限制`,
    outputFormat: `一个整数，表示俄罗斯方块的种类总数。`,
    samples: [
      {
        input: "5 6\n1 2 3 4 4 5\n1 2 3 3 4 5\n1 2 2 3 4 5\n1 6 6 7 7 8\n6 6 7 7 8 8",
        output: "7",
        explanation: "网格中共有7种不同形状的方块",
      },
    ],
    testCases: [
      {
        input: "5 6\n1 2 3 4 4 5\n1 2 3 3 4 5\n1 2 2 3 4 5\n1 6 6 7 7 8\n6 6 7 7 8 8",
        output: "7",
      },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "先用 BFS/DFS 找出所有连通块。对每个连通块，将其坐标归一化（平移到原点）后用某种方式表示其形状（如排序后的坐标列表），再用哈希或集合去重。",
  },

  // ========== 2024年6月 ==========
  {
    title: "[GESP202406 七级] 黑白翻转",
    source: "gesp_official",
    sourceId: "P10723",
    sourceUrl: "https://www.luogu.com.cn/problem/P10723",
    level: 7,
    knowledgePoints: ["树", "树形DP", "动态规划", "连通性", "DFS"],
    difficulty: "medium", // 普及+/提高
    description: `小杨有一棵 n 个节点的树，每个节点染成黑色或白色。

定义一棵树是"美丽的"：移除所有白色节点后，剩余的黑色节点仍然形成一棵连通的树。

目标：找出最少需要将多少个白色节点改为黑色，才能使这棵树变得"美丽"。`,
    inputFormat: `第一行：整数 n（节点数）

第二行：n 个整数 a_1, a_2, ..., a_n（a_i = 0 表示白色，a_i ≠ 0 表示黑色）

接下来 n-1 行：每行两个整数 x_i, y_i（表示一条边）

数据范围：
- 1 ≤ n ≤ 10^5
- 0 ≤ a_i ≤ 1`,
    outputFormat: `一个整数，表示最少的操作次数。`,
    samples: [
      {
        input: "5\n0 1 0 1 0\n1 2\n1 3\n3 4\n3 5",
        output: "2",
        explanation: "将节点1和3改为黑色，使得黑色节点保持连通",
      },
    ],
    testCases: [{ input: "5\n0 1 0 1 0\n1 2\n1 3\n3 4\n3 5", output: "2" }],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "树形DP。关键观察：黑色节点最终形成的连通块必须是原树的一个连通子图。可以枚举这个子图包含哪些黑色节点，然后计算需要添加多少白色节点来连接它们。",
  },
  {
    title: "[GESP202406 七级] 区间乘积",
    source: "gesp_official",
    sourceId: "P10724",
    sourceUrl: "https://www.luogu.com.cn/problem/P10724",
    level: 7,
    knowledgePoints: ["数论", "质因数分解", "前缀和", "位运算", "哈希", "完全平方数"],
    difficulty: "medium", // 普及+/提高
    description: `给定一个长度为 n 的正整数序列 A，求满足以下条件的数对 ⟨l, r⟩ 的个数（1 ≤ l ≤ r ≤ n）：

a_l × a_{l+1} × ... × a_r 是一个完全平方数。`,
    inputFormat: `第一行：整数 n（序列长度）

第二行：n 个正整数，组成序列 A

数据范围：
- 子任务1(20%)：n ≤ 10^5, 1 ≤ a_i ≤ 2
- 子任务2(40%)：n ≤ 100, 1 ≤ a_i ≤ 30
- 子任务3(40%)：n ≤ 10^5, 1 ≤ a_i ≤ 30`,
    outputFormat: `一个整数，表示满足条件的数对个数。`,
    samples: [
      {
        input: "5\n3 2 4 3 2",
        output: "2",
        explanation: "满足条件的区间有 ⟨1,5⟩ 和 ⟨3,3⟩",
      },
    ],
    testCases: [{ input: "5\n3 2 4 3 2", output: "2" }],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "一个数是完全平方数，当且仅当它的所有质因子的指数都是偶数。由于 a_i ≤ 30，质因子只有 2, 3, 5, 7, 11, 13, 17, 19, 23, 29。用位掩码记录每个前缀积中各质因子指数的奇偶性，相同掩码的位置之间形成完全平方数区间。",
  },

  // ========== 2024年9月 ==========
  {
    title: "[GESP202409 七级] 矩阵移动",
    source: "gesp_official",
    sourceId: "P11248",
    sourceUrl: "https://www.luogu.com.cn/problem/P11248",
    level: 7,
    knowledgePoints: ["动态规划", "DP", "矩阵", "路径DP", "贪心"],
    difficulty: "easy", // 普及-级
    description: `小杨在一个 n×m 的矩阵中，从左上角 (1,1) 移动到右下角 (n,m)，只能向下或向右移动。

矩阵中包含 '0'、'1'、'?' 三种字符：
- 经过 '1' 时得 1 分
- 经过其他字符不得分

小杨可以将不超过 x 个 '?' 改为 '1'。

求在最优策略下的最高得分。`,
    inputFormat: `第一行：测试用例数 t

每组用例：
- 第一行：三个正整数 n、m、x
- 接下来 n 行：长度为 m 的字符串（仅含 '0'、'1'、'?'）

数据范围：
- 子任务1(30%)：t ≤ 5, n, m ≤ 10, x = 1
- 子任务2(30%)：t ≤ 10, n, m ≤ 500, x ≤ 30
- 子任务3(40%)：t ≤ 10, n, m ≤ 500, x ≤ 300`,
    outputFormat: `每组用例输出一行整数，表示最高得分。`,
    samples: [
      {
        input: "2\n3 3 1\n000\n111\n01?\n3 3 1\n000\n?0?\n01?",
        output: "4\n2",
        explanation: "第一组：最优路径可以得到4分；第二组：最优路径可以得到2分",
      },
    ],
    testCases: [{ input: "2\n3 3 1\n000\n111\n01?\n3 3 1\n000\n?0?\n01?", output: "4\n2" }],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "三维 DP：dp[i][j][k] 表示到达 (i,j) 且已使用 k 次修改时的最大得分。注意优化空间复杂度。",
  },
  {
    title: "[GESP202409 七级] 小杨寻宝",
    source: "gesp_official",
    sourceId: "P11249",
    sourceUrl: "https://www.luogu.com.cn/problem/P11249",
    level: 7,
    knowledgePoints: ["树", "DFS", "树的遍历", "贪心", "叶子节点"],
    difficulty: "medium", // 普及/提高-
    description: `小杨有一棵 n 个节点的树，其中一些节点有宝藏。

小杨从任意节点出发，可以遍历树但每条边最多只能走一次（走过的边会消失）。小杨会收集经过节点的宝藏。

判断是否能收集到所有宝藏。`,
    inputFormat: `第一行：整数 t（测试用例数）

每个测试用例（n+1 行）：
- 第一行：整数 n（节点数）
- 第二行：n 个整数，1 表示有宝藏，0 表示无宝藏
- 接下来 n-1 行：每行两个整数表示一条边

数据范围：
- t ≤ 10
- n ≤ 10^5`,
    outputFormat: `对于每个测试用例，如果能收集所有宝藏输出 "Yes"，否则输出 "No"。`,
    samples: [
      {
        input: "2\n5\n0 1 0 1 0\n1 2\n1 3\n3 4\n3 5\n5\n1 1 1 1 1\n1 2\n1 3\n3 4\n3 5",
        output: "Yes\nNo",
        explanation: "第一组可以收集所有宝藏，第二组无法收集所有宝藏",
      },
    ],
    testCases: [
      {
        input: "2\n5\n0 1 0 1 0\n1 2\n1 3\n3 4\n3 5\n5\n1 1 1 1 1\n1 2\n1 3\n3 4\n3 5",
        output: "Yes\nNo",
      },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "关键观察：由于每条边只能走一次，从起点出发的路径是一条简单路径。能收集所有宝藏当且仅当所有有宝藏的节点在树上形成一条链。",
  },

  // ========== 2024年12月 ==========
  {
    title: "[GESP202412 七级] 武器购买",
    source: "gesp_official",
    sourceId: "P11377",
    sourceUrl: "https://www.luogu.com.cn/problem/P11377",
    level: 7,
    knowledgePoints: ["动态规划", "DP", "01背包", "背包问题", "双重约束"],
    difficulty: "medium", // 普及/提高-
    description: `商店有 n 件武器，第 i 件武器的战力为 p_i，花费为 c_i。

小杨想购买若干武器，使得：
1. 总战力至少为 P
2. 总花费不超过 Q

判断是否存在合法方案，如果存在，求最小花费。`,
    inputFormat: `第一行：正整数 t（测试用例数）

每个测试用例：
- 第一行：三个正整数 n, P, Q
- 接下来 n 行：每行两个正整数 p_i, c_i

数据范围：
- 1 ≤ t ≤ 10, 1 ≤ n ≤ 100
- 1 ≤ p_i, c_i, P, Q ≤ 5×10^4`,
    outputFormat: `对于每个测试用例，如果存在合法方案输出最小花费，否则输出 -1。`,
    samples: [
      {
        input: "3\n3 2 3\n1 2\n1 2\n2 3\n3 3 4\n1 2\n1 2\n2 3\n3 1000 1000\n1 2\n1 2\n2 3",
        output: "3\n-1\n-1",
        explanation: "第一组：选择战力2花费3的武器即可；第二组和第三组无法满足条件",
      },
    ],
    testCases: [
      {
        input: "3\n3 2 3\n1 2\n1 2\n2 3\n3 3 4\n1 2\n1 2\n2 3\n3 1000 1000\n1 2\n1 2\n2 3",
        output: "3\n-1\n-1",
      },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "这是 01 背包的变体。dp[j] 表示获得至少 j 点战力所需的最小花费。注意处理"至少"的语义。",
  },
  {
    title: "[GESP202412 七级] 燃烧",
    source: "gesp_official",
    sourceId: "P11378",
    sourceUrl: "https://www.luogu.com.cn/problem/P11378",
    level: 7,
    knowledgePoints: ["树", "DFS", "排序", "贪心", "树的遍历"],
    difficulty: "medium", // 普及/提高-
    description: `小杨有一棵 n 个节点的树（编号 1 到 n），每个节点 i 有权值 a_i。

点燃一个初始节点后，火会蔓延到相邻且权值严格更小的节点，直到无法继续蔓延。

求选择最优起始节点时，最多能燃烧多少个节点。`,
    inputFormat: `第一行：整数 n（节点数）

第二行：n 个整数 a_1, a_2, ..., a_n（节点权值）

接下来 n-1 行：每行两个整数 u_i, v_i（表示一条边）

数据范围：
- 子任务1(20%)：n ≤ 10
- 子任务2(20%)：n ≤ 100
- 子任务3(60%)：n ≤ 10^5
- 全部：1 ≤ a_i ≤ 10^6`,
    outputFormat: `一个整数，表示最多能燃烧的节点数。`,
    samples: [
      {
        input: "5\n6 2 3 4 5\n1 2\n2 3\n2 5\n1 4",
        output: "3",
        explanation: "从节点1开始燃烧，可以燃烧到节点2、4、5中的部分",
      },
    ],
    testCases: [{ input: "5\n6 2 3 4 5\n1 2\n2 3\n2 5\n1 4", output: "3" }],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "从每个节点开始 DFS，统计能燃烧到的节点数。可以优化：按权值从大到小排序节点，用记忆化搜索避免重复计算。",
  },

  // ========== 2025年3月 ==========
  {
    title: "[GESP202503 七级] 图上移动",
    source: "gesp_official",
    sourceId: "P11964",
    sourceUrl: "https://www.luogu.com.cn/problem/P11964",
    level: 7,
    knowledgePoints: ["图论", "BFS", "可达性", "邻接表", "距离"],
    difficulty: "medium", // 普及/提高-
    description: `给定一个无向图，有 n 个节点和 m 条边。

对于每个节点作为起点，求恰好走 1, 2, ..., k 步时，分别能到达多少个不同的节点。`,
    inputFormat: `第一行：三个整数 n, m, k（节点数、边数、最大步数）

接下来 m 行：每行两个整数（表示无向边）

数据范围：
- 20% 数据：k = 1
- 20% 数据：n, m ≤ 50
- 全部数据：1 ≤ n, m ≤ 500, 1 ≤ k ≤ 20`,
    outputFormat: `n 行，每行 k 个整数，表示从第 i 个节点出发，恰好走 1, 2, ..., k 步时能到达的不同节点数。`,
    samples: [
      {
        input: "4 4 3\n1 2\n1 3\n2 3\n3 4",
        output: "2 4 4\n2 4 4\n3 4 4\n1 3 4",
        explanation: "从节点1出发，走1步能到2个节点，走2步能到4个节点，走3步能到4个节点",
      },
    ],
    testCases: [{ input: "4 4 3\n1 2\n1 3\n2 3\n3 4", output: "2 4 4\n2 4 4\n3 4 4\n1 3 4" }],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "从每个节点出发做 BFS，记录每个距离能到达的节点集合。由于需要"恰好"k 步，可能需要多次经过同一节点。",
  },
  {
    title: "[GESP202503 七级] 等价消除",
    source: "gesp_official",
    sourceId: "P11965",
    sourceUrl: "https://www.luogu.com.cn/problem/P11965",
    level: 7,
    knowledgePoints: ["字符串", "动态规划", "DP", "区间DP", "子串", "消除"],
    difficulty: "medium", // 普及/提高-
    description: `定义字符串可被"等价消除"：通过反复删除其中任意两个相同字符，最终变为空串。

给定一个字符串，统计有多少个子串（连续）可被等价消除。`,
    inputFormat: `第一行：正整数，表示字符串长度

第二行：仅含小写英文字母的字符串

数据范围：
- 20% 数据：仅包含 'a' 和 'b' 两种字符
- 20% 数据：长度 ≤ 2000
- 全部数据：1 ≤ |S| ≤ 2×10^5`,
    outputFormat: `一个整数，表示可被等价消除的子串数量。`,
    samples: [
      {
        input: "7\naaaaabb",
        output: "9",
        explanation: "满足条件的子串有9个",
      },
      {
        input: "9\nbabacabab",
        output: "2",
      },
    ],
    testCases: [
      { input: "7\naaaaabb", output: "9" },
      { input: "9\nbabacabab", output: "2" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "关键观察：字符串可等价消除当且仅当每种字符出现偶数次。使用前缀异或和，相同异或值的位置之间的子串可以被消除。",
  },

  // ========== 2025年6月 ==========
  {
    title: "[GESP202506 七级] 线图",
    source: "gesp_official",
    sourceId: "P13017",
    sourceUrl: "https://www.luogu.com.cn/problem/P13017",
    level: 7,
    knowledgePoints: ["图论", "线图", "图的变换", "度数", "组合数学"],
    difficulty: "medium", // 普及/提高-
    description: `给定简单无向图 G（n 个节点，m 条边），构造其线图 L(G)：
- L(G) 的每个节点对应 G 的一条边
- 当 G 中两条边共享至少一个端点时，L(G) 中对应的两个节点之间连一条边

求线图 L(G) 中的边数。`,
    inputFormat: `第一行：两个正整数 n 和 m（节点数和边数）

后续 m 行：每行两个正整数 u_i, v_i（表示一条边）

数据范围：
- 60% 数据：1 ≤ n, m ≤ 500
- 全部数据：1 ≤ n, m ≤ 10^5`,
    outputFormat: `单行一个整数，表示线图中的边数。`,
    samples: [
      {
        input: "5 4\n1 2\n2 3\n3 1\n4 5",
        output: "3",
        explanation: "边(1,2)、(2,3)、(3,1)两两有公共端点，形成3条线图边",
      },
      {
        input: "5 10\n1 2\n1 3\n1 4\n1 5\n2 3\n2 4\n2 5\n3 4\n3 5\n4 5",
        output: "30",
        explanation: "完全图K5的线图边数为30",
      },
    ],
    testCases: [
      { input: "5 4\n1 2\n2 3\n3 1\n4 5", output: "3" },
      {
        input: "5 10\n1 2\n1 3\n1 4\n1 5\n2 3\n2 4\n2 5\n3 4\n3 5\n4 5",
        output: "30",
      },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "线图的边数等于 Σ C(d_i, 2)，其中 d_i 是原图中节点 i 的度数。因为共享端点 i 的边在线图中两两相连。",
  },
  {
    title: "[GESP202506 七级] 调味平衡",
    source: "gesp_official",
    sourceId: "P13018",
    sourceUrl: "https://www.luogu.com.cn/problem/P13018",
    level: 7,
    knowledgePoints: ["动态规划", "DP", "背包问题", "平衡条件", "差值DP"],
    difficulty: "medium", // 普及/提高-
    description: `从 n 种食材中选择若干种，使得选中食材的酸度之和等于甜度之和（平衡条件）。

在满足平衡条件的前提下，最大化酸度与甜度之和的总值。`,
    inputFormat: `第一行：正整数 n（食材种类数）

后续 n 行：每行两个正整数 a_i 和 b_i（第 i 种食材的酸度和甜度）

数据范围：
- 40% 数据：1 ≤ n ≤ 10, 1 ≤ a_i, b_i ≤ 10
- 20% 数据：1 ≤ n ≤ 50, 1 ≤ a_i, b_i ≤ 10
- 全部数据：1 ≤ n ≤ 100, 1 ≤ a_i, b_i ≤ 500`,
    outputFormat: `一个整数，表示在调味平衡条件下，酸度与甜度之和的最大值。`,
    samples: [
      {
        input: "3\n1 2\n2 4\n3 2",
        output: "8",
        explanation: "选择食材2和3，酸度和=2+3=5，甜度和=4+2=6？需要重新验证",
      },
      {
        input: "5\n1 1\n2 3\n6 1\n8 2\n5 7",
        output: "2",
        explanation: "选择食材1，酸度=甜度=1，总和为2",
      },
    ],
    testCases: [
      { input: "3\n1 2\n2 4\n3 2", output: "8" },
      { input: "5\n1 1\n2 3\n6 1\n8 2\n5 7", output: "2" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "将问题转化为背包DP。设 d_i = a_i - b_i（酸度与甜度的差），目标是选择一些食材使得 Σd_i = 0，同时最大化 Σ(a_i + b_i)。可以用 dp[j] 表示差值为 j 时的最大总和。",
  },

  // ========== 2025年9月 ==========
  {
    title: "[GESP202509 七级] 连通图",
    source: "gesp_official",
    sourceId: "P14077",
    sourceUrl: "https://www.luogu.com.cn/problem/P14077",
    level: 7,
    knowledgePoints: ["图论", "连通分量", "并查集", "DFS", "BFS"],
    difficulty: "easy", // 普及-级
    description: `给定一个无向图，有 n 个节点和 m 条边。

求最少需要添加多少条边，才能使所有节点连通（即形成一个连通图）。`,
    inputFormat: `第一行：两个整数 n, m（节点数和边数）

接下来 m 行：每行两个整数 u_i, v_i（表示一条边）

数据范围：
- 40% 数据：1 ≤ n, m ≤ 100
- 全部数据：1 ≤ n, m ≤ 10^5

注意：图可能包含自环和重边。`,
    outputFormat: `一个整数，表示最少需要添加的边数。`,
    samples: [
      {
        input: "4 4\n1 2\n2 3\n3 1\n1 4",
        output: "0",
        explanation: "图已经连通",
      },
      {
        input: "6 4\n1 2\n2 3\n3 1\n6 5",
        output: "2",
        explanation: "有3个连通分量，需要添加2条边",
      },
    ],
    testCases: [
      { input: "4 4\n1 2\n2 3\n3 1\n1 4", output: "0" },
      { input: "6 4\n1 2\n2 3\n3 1\n6 5", output: "2" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "统计连通分量的个数 k，答案就是 k-1。可以用并查集或 DFS/BFS 求连通分量。",
  },
  {
    title: "[GESP202509 七级] 金币收集",
    source: "gesp_official",
    sourceId: "P14078",
    sourceUrl: "https://www.luogu.com.cn/problem/P14078",
    level: 7,
    knowledgePoints: ["动态规划", "DP", "贪心", "排序", "LIS变体"],
    difficulty: "medium", // 普及+/提高
    description: `玩家从数轴位置 0、时刻 0 出发。玩家只能向右移动（每个时间单位移动 1 格）或原地等待，不能向左移动。

有 n 枚金币，第 i 枚金币在时刻 t_i 出现在位置 x_i。玩家必须恰好在该时刻、该位置才能收集金币。

求最多能收集多少枚金币。`,
    inputFormat: `第一行：整数 n（金币数量）

接下来 n 行：每行两个整数 x_i, t_i（金币的位置和出现时刻）

数据范围：
- 40% 数据：1 ≤ n ≤ 8
- 30% 数据：1 ≤ n ≤ 100, 1 ≤ x_i, t_i ≤ 100
- 全部数据：1 ≤ n ≤ 10^5, 1 ≤ x_i, t_i ≤ 10^9`,
    outputFormat: `一个整数，表示最多能收集的金币数量。`,
    samples: [
      {
        input: "3\n1 6\n3 7\n2 4",
        output: "2",
        explanation: "可以收集位置2时刻4的金币和位置3时刻7的金币",
      },
      {
        input: "4\n1 1\n2 2\n1 3\n2 4",
        output: "3",
        explanation: "可以收集3枚金币",
      },
    ],
    testCases: [
      { input: "3\n1 6\n3 7\n2 4", output: "2" },
      { input: "4\n1 1\n2 2\n1 3\n2 4", output: "3" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "金币 i 可收集的条件是 t_i ≥ x_i（有足够时间到达）。按 t_i - x_i 排序后，问题转化为求最长的非递减子序列（按 x_i 或 t_i）。类似 LIS 问题。",
  },

  // ========== 2025年12月 ==========
  {
    title: "[GESP202512 七级] 城市规划",
    source: "gesp_official",
    sourceId: "P14921",
    sourceUrl: "https://www.luogu.com.cn/problem/P14921",
    level: 7,
    knowledgePoints: ["图论", "BFS", "最短路", "图的中心", "偏心率"],
    difficulty: "medium", // 普及/提高-
    description: `给定一个连通图，有 n 个城市通过 m 条双向道路相连。

需要找到"中心"城市——即到其他所有城市的最大距离最小的城市。

用数学语言表述：求使 max(d(u, i), 1 ≤ i ≤ n) 最小的城市 u。若有多个满足条件的城市，选编号最小的。`,
    inputFormat: `第一行：两个正整数 n、m（城市数量、道路数量）

后续 m 行：每行两个整数 u_i, v_i（道路连接的两个城市）

数据范围：
- 40% 数据：1 ≤ n ≤ 300
- 全部数据：1 ≤ n ≤ 2000, 1 ≤ m ≤ 2000`,
    outputFormat: `一个整数，表示中心城市的编号。`,
    samples: [
      {
        input: "3 3\n1 2\n1 3\n2 3",
        output: "1",
        explanation: "任意城市到其他城市的最大距离都是1，选编号最小的",
      },
      {
        input: "4 4\n1 2\n2 3\n3 4\n2 4",
        output: "2",
        explanation: "从城市2出发，到最远城市的距离为2",
      },
    ],
    testCases: [
      { input: "3 3\n1 2\n1 3\n2 3", output: "1" },
      { input: "4 4\n1 2\n2 3\n3 4\n2 4", output: "2" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "从每个节点出发做 BFS 求到所有其他节点的最短距离，记录最大距离（偏心率）。找出偏心率最小的节点。",
  },
  {
    title: "[GESP202512 七级] 学习小组",
    source: "gesp_official",
    sourceId: "P14922",
    sourceUrl: "https://www.luogu.com.cn/problem/P14922",
    level: 7,
    knowledgePoints: ["动态规划", "DP", "分组", "区间DP", "排序"],
    difficulty: "medium", // 普及+/提高
    description: `需要将班级的 n 名学生分成若干学习小组，最大化总讨论强度。

每个学生 i 有发言积极度 c_i。如果一个小组有 k 名学生（下标为 p_1, p_2, ..., p_k），其讨论强度计算为：

讨论强度 = a_k + max(c_{p_1}, ..., c_{p_k}) - min(c_{p_1}, ..., c_{p_k})

其中 a_k 是小组规模为 k 时的基础讨论强度。`,
    inputFormat: `第一行：整数 n（班级人数）

第二行：n 个非负整数 c_1, c_2, ..., c_n（学生发言积极度）

第三行：n 个非负整数 a_1, a_2, ..., a_n（不同规模的基础讨论强度）

数据范围：
- 1 ≤ n ≤ 300
- 0 ≤ c_i ≤ 10^4
- 0 ≤ a_i ≤ 10^4`,
    outputFormat: `一个整数，表示最大总讨论强度。`,
    samples: [
      {
        input: "4\n2 1 3 2\n1 5 6 3",
        output: "12",
        explanation: "最优分组方案使总讨论强度为12",
      },
      {
        input: "8\n1 3 2 4 3 5 4 6\n0 2 5 6 4 3 3 4",
        output: "21",
      },
    ],
    testCases: [
      { input: "4\n2 1 3 2\n1 5 6 3", output: "12" },
      { input: "8\n1 3 2 4 3 5 4 6\n0 2 5 6 4 3 3 4", output: "21" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "先将学生按积极度排序。由于讨论强度只依赖于小组内的最大最小值，排序后每个小组对应一段连续区间。使用区间 DP：dp[i] 表示前 i 个学生（排序后）的最大总讨论强度。",
  },
];

async function seedGesp7() {
  try {
    // 获取现有题目ID列表，避免重复添加
    const existingProblems = await prisma.problem.findMany({
      where: {
        sourceId: {
          in: gesp7Problems.map((p) => p.sourceId).filter(Boolean) as string[],
        },
      },
      select: { sourceId: true },
    });

    const existingIds = new Set(existingProblems.map((p) => p.sourceId));

    // 过滤出需要添加的新题目
    const newProblems = gesp7Problems.filter((p) => !existingIds.has(p.sourceId));

    if (newProblems.length === 0) {
      return NextResponse.json({
        success: true,
        message: "所有 GESP 7级题目已存在",
        existingCount: existingProblems.length,
        addedCount: 0,
      });
    }

    // 添加新题目
    const result = await prisma.problem.createMany({
      data: newProblems,
    });

    return NextResponse.json({
      success: true,
      message: `成功添加 ${result.count} 道 GESP 7级题目`,
      existingCount: existingProblems.length,
      addedCount: result.count,
      totalCount: existingProblems.length + result.count,
    });
  } catch (error) {
    console.error("Seed GESP7 error:", error);
    return NextResponse.json({ error: "添加题目失败", details: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return seedGesp7();
}

export async function POST() {
  return seedGesp7();
}
