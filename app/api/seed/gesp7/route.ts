import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GESP 7级完整题库 - 来源：洛谷 CCF GESP C++ 七级上机题
// 共22道题目
// 难度标签采用洛谷评级：
// - "easy" = 入门(1)/普及-(2)
// - "medium" = 普及/提高-(3)/普及+/提高(4)
// - "hard" = 提高+/省选-(5)及以上

const gesp7Problems = [
  // ========== GESP 样卷 ==========
  {
    title: "[GESP样题 七级] 迷宫统计",
    source: "gesp_official",
    sourceId: "P10265",
    sourceUrl: "https://www.luogu.com.cn/problem/P10265",
    level: 7,
    knowledgePoints: ["图论", "邻接矩阵", "DFS", "BFS"],
    difficulty: "普及/提高-",
    description: `在一片神秘的奇幻大陆上，有 n 个古老的迷宫，编号为 1 到 n。部分迷宫之间可以双向通行，也有一些只能单向通过。

一位名叫小友的玩家从迷宫 m 出发，需要统计：
1. 有多少迷宫可以从迷宫 m 直接到达
2. 有多少迷宫可以直接到达迷宫 m
3. 二者之和

注意：每个迷宫 i (1 ≤ i ≤ n) 总可以直接到达自身。`,
    inputFormat: `第一行：两个整数 n 和 m，分别表示迷宫总数和起始迷宫编号。

第 2 到第 n+1 行：一个 n×n 的邻接矩阵，第 i 行第 j 列为 1 表示迷宫 i 可以直接到达迷宫 j，为 0 表示不可以。`,
    outputFormat: `三个空格分隔的整数，分别表示：(1) 迷宫 m 可以到达的迷宫数量；(2) 可以到达迷宫 m 的迷宫数量；(3) 二者之和。`,
    samples: [
      { input: "6 4\n1 1 0 1 0 0\n0 1 1 0 0 0\n1 0 1 0 0 1\n0 0 1 1 0 1\n0 0 0 1 1 0\n1 0 0 0 1 1", output: "3 3 6" },
    ],
    testCases: [
      { input: "6 4\n1 1 0 1 0 0\n0 1 1 0 0 0\n1 0 1 0 0 1\n0 0 1 1 0 1\n0 0 0 1 1 0\n1 0 0 0 1 1", output: "3 3 6" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `子任务 1（30 分）：n ≤ 10。子任务 2（30 分）：n ≤ 100。子任务 3（40 分）：n ≤ 1000。通用约束：1 ≤ m ≤ n ≤ 1000。`,
  },
  {
    title: "[GESP样题 七级] 最长不下降子序列",
    source: "gesp_official",
    sourceId: "P10287",
    sourceUrl: "https://www.luogu.com.cn/problem/P10287",
    level: 7,
    knowledgePoints: ["动态规划", "DAG", "最长不下降子序列", "图论"],
    difficulty: "提高+/省选-",
    description: `小杨有一个有向无环图（DAG），包含 n 个节点和 m 条边（节点编号 1 到 n）。每个节点 i 有一个权值 A_i。

对于图中的任意一条路径，按顺序经过的节点权值构成一个序列。任务是在所有可能的路径序列中，找到最长不下降子序列（LDS）的最大长度。

定义：给定序列 S，其最长不下降子序列 S' 是一个所有元素单调不下降的最长子序列。例如：S = [11, 12, 13, 9, 8, 17, 19]，其 LDS 为 [11, 12, 13, 17, 19]，长度为 5。`,
    inputFormat: `第一行：两个整数 n, m（节点数和边数）。

第二行：n 个整数 A_1, A_2, ..., A_n（节点权值）。

接下来 m 行：每行两个整数 u_i, v_i，表示一条从 u_i 到 v_i 的有向边。`,
    outputFormat: `一个整数，表示答案。`,
    samples: [
      { input: "5 4\n2 10 6 3 1\n5 2\n2 3\n3 1\n1 4", output: "3" },
    ],
    testCases: [
      { input: "5 4\n2 10 6 3 1\n5 2\n2 3\n3 1\n1 4", output: "3" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `子任务 1（30 分）：n ≤ 10^3，A_i ≤ 10，图为一条链。子任务 2（30 分）：n ≤ 10^5，A_i ≤ 2。子任务 3（40 分）：n ≤ 10^5，A_i ≤ 10。通用约束：1 ≤ n, m ≤ 10^5；1 ≤ A_i ≤ 10。`,
  },

  // ========== 2023年12月 ==========
  {
    title: "[GESP202312 七级] 商品交易",
    source: "gesp_official",
    sourceId: "P10110",
    sourceUrl: "https://www.luogu.com.cn/problem/P10110",
    level: 7,
    knowledgePoints: ["图论", "最短路径", "Dijkstra"],
    difficulty: "提高+/省选-",
    description: `市场上有 N 种商品（编号 0 到 N-1），每种商品有一个价值 v_i。有 M 个商人（编号 0 到 M-1），在商人 j 处可以用你的商品 x_j 换取商人的商品 y_j。

交易机制：
- 若 v_{x_j} > v_{y_j}：商人付你 |v_{x_j} - v_{y_j}| 元。
- 若 v_{x_j} < v_{y_j}：你付商人 |v_{y_j} - v_{x_j}| 元。
- 每次交易额外收取 1 元手续费。

目标：从商品 a 出发，求获得商品 b 的最小花费。花费可以为负（表示盈利）。`,
    inputFormat: `第一行：四个整数 N, M, a, b（商品数、商人数、起始商品、目标商品）。约束：0 ≤ a, b < N；a ≠ b。

第二行：N 个正整数 v_0, v_1, ..., v_{N-1}（商品价值）。约束：1 ≤ v_i ≤ 10^9。

第 3 到 M+2 行：每行两个整数 x_j, y_j（可交易的商品对）。约束：0 ≤ x_j, y_j < N；x_j ≠ y_j。`,
    outputFormat: `一个整数，表示最小花费。若无法获得商品 b，输出 "No solution"。`,
    samples: [
      { input: "3 5 0 2\n1 2 4\n1 0\n2 0\n0 1\n2 1\n1 2", output: "5" },
      { input: "3 3 0 2\n100 2 4\n0 1\n1 2\n0 2", output: "-95" },
      { input: "4 4 3 0\n1 2 3 4\n1 0\n0 1\n3 2\n2 3", output: "No solution" },
    ],
    testCases: [
      { input: "3 5 0 2\n1 2 4\n1 0\n2 0\n0 1\n2 1\n1 2", output: "5" },
      { input: "3 3 0 2\n100 2 4\n0 1\n1 2\n0 2", output: "-95" },
      { input: "4 4 3 0\n1 2 3 4\n1 0\n0 1\n3 2\n2 3", output: "No solution" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `本质上是一个最短路径问题，边权表示交易花费。子任务 1（30 分）：N ≤ 10, M ≤ 20。子任务 2（70 分）：N ≤ 10^3, M ≤ 10^4。子任务 3（100 分）：N ≤ 10^5, M ≤ 2×10^5。`,
  },
  {
    title: "[GESP202312 七级] 纸牌游戏",
    source: "gesp_official",
    sourceId: "P10111",
    sourceUrl: "https://www.luogu.com.cn/problem/P10111",
    level: 7,
    knowledgePoints: ["动态规划", "博弈论", "贪心"],
    difficulty: "提高+/省选-",
    description: `你和小杨进行纸牌游戏。双方各有三张牌：0、1、2。共进行 N 轮，每轮双方各出一张牌。胜负规则：「1 胜 0，2 胜 1，0 胜 2」。第 i 轮赢家得 2×a_i 分，输家得 0 分；平局双方各得 a_i 分。

特殊规则：小杨在游戏开始前会公布他全部 N 轮的出牌序列。从第 2 轮开始，你可以选择重复上一轮出的牌，或者换牌（需支付代价）。若你总共换了 t 次牌，你的最终得分需减去 b_1 + b_2 + ... + b_t 分。

目标：最大化你的总得分。`,
    inputFormat: `第一行：整数 N（轮数）。

第二行：N 个非负整数 a_1, ..., a_N（每轮的基础分值）。

第三行：N-1 个非负整数 b_1, ..., b_{N-1}（换牌的代价，按换牌顺序依次扣除）。

第四行：N 个整数 c_1, ..., c_N ∈ {0, 1, 2}（小杨的出牌序列）。`,
    outputFormat: `一个整数，表示你能获得的最大得分。`,
    samples: [
      { input: "4\n1 2 10 100\n1 100 1\n1 1 2 0", output: "219" },
      { input: "6\n3 7 2 8 9 4\n1 3 9 27 81\n0 1 2 1 2 0", output: "56" },
    ],
    testCases: [
      { input: "4\n1 2 10 100\n1 100 1\n1 1 2 0", output: "219" },
      { input: "6\n3 7 2 8 9 4\n1 3 9 27 81\n0 1 2 1 2 0", output: "56" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `30% 的测试数据：N ≤ 15。60% 的测试数据：N ≤ 100。100% 的测试数据：N ≤ 1000；0 ≤ a_i, b_i ≤ 10^6。`,
  },

  // ========== 2024年3月 ==========
  {
    title: "[GESP202403 七级] 交流问题",
    source: "gesp_official",
    sourceId: "P10378",
    sourceUrl: "https://www.luogu.com.cn/problem/P10378",
    level: 7,
    knowledgePoints: ["图论", "二分图", "连通分量", "DFS"],
    difficulty: "提高+/省选-",
    description: `A、B 两校共 n 名同学（编号 1 到 n）参加交流活动，共进行了 m 次交流。第 i 次交流中，编号为 u_i 和 v_i 的同学讨论话题并成为朋友。只有不同学校的同学之间才会交流，同校同学之间不会交流。

作为 A 校的辅导员，你需要确定 B 校的最少和最多可能的人数。`,
    inputFormat: `第一行：两个正整数 n（学生总数）和 m（交流次数）

接下来 m 行：每行两个整数 u_i、v_i，表示一次交流`,
    outputFormat: `一行两个整数，用空格分隔，分别表示 B 校最少和最多可能的学生人数。`,
    samples: [
      { input: "4 3\n1 2\n2 3\n4 2", output: "1 3" },
      { input: "7 5\n1 2\n2 3\n4 2\n5 6\n6 7", output: "2 5" },
    ],
    testCases: [
      { input: "4 3\n1 2\n2 3\n4 2", output: "1 3" },
      { input: "7 5\n1 2\n2 3\n4 2\n5 6\n6 7", output: "2 5" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `30%: n ≤ 17, m ≤ 50。60%: n ≤ 500, m ≤ 2000。100%: 1 ≤ n ≤ 10^5, 1 ≤ m ≤ 2×10^5。`,
  },
  {
    title: "[GESP202403 七级] 俄罗斯方块",
    source: "gesp_official",
    sourceId: "P10379",
    sourceUrl: "https://www.luogu.com.cn/problem/P10379",
    level: 7,
    knowledgePoints: ["BFS", "DFS", "连通分量", "哈希", "集合"],
    difficulty: "提高+/省选-",
    description: `小杨用不同类型的俄罗斯方块填满了一个 n × m 的网格。网格由 n × m 个彩色方格组成。你的任务是统计不同俄罗斯方块类型的数量。

连通性定义：
- 两个同色方格如果在四方向（上/下/左/右）相邻，则它们"直接连通"
- 两个同色方格如果能通过其他同色方格间接相连，则它们"间接连通"
- 一个俄罗斯方块由一个方格及其所有直接或间接连通的同色方格组成

类型判定：两个俄罗斯方块属于同一类型，当且仅当其中一个可以通过平移与另一个完全重合。颜色不影响类型判断。`,
    inputFormat: `第一行：两个正整数 n 和 m，表示网格尺寸

接下来 n 行：每行 m 个正整数，表示该行 m 个方格的颜色`,
    outputFormat: `一个整数，表示不同方块类型的数量。`,
    samples: [
      { input: "5 6\n1 2 3 4 4 5\n1 2 3 3 4 5\n1 2 2 3 4 5\n1 6 6 7 7 8\n6 6 7 7 8 8", output: "7" },
    ],
    testCases: [
      { input: "5 6\n1 2 3 4 4 5\n1 2 3 3 4 5\n1 2 2 3 4 5\n1 6 6 7 7 8\n6 6 7 7 8 8", output: "7" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `子任务 1（30分）：n, m ≤ 20，所有方块不超过 5×5。子任务 2（30分）：n, m ≤ 500，所有方块为条状。子任务 3（40分）：n, m ≤ 500。`,
  },

  // ========== 2024年6月 ==========
  {
    title: "[GESP202406 七级] 黑白翻转",
    source: "gesp_official",
    sourceId: "P10723",
    sourceUrl: "https://www.luogu.com.cn/problem/P10723",
    level: 7,
    knowledgePoints: ["树", "树形DP", "斯坦纳树"],
    difficulty: "提高+/省选-",
    description: `小杨有一棵含 n 个节点的树，每个节点被染成白色或黑色。如果一棵树去掉所有白色节点后，剩余节点仍能构成一棵连通的树，则称这棵树是"美丽的"。

每次操作可以将一个白色节点变为黑色。求使树变美丽所需的最少操作次数。`,
    inputFormat: `第一行：整数 n（节点数）

第二行：n 个非负整数 a_1, a_2, ..., a_n，其中 a_i = 0 表示白色，否则为黑色

第 3 到第 n+1 行：每行两个整数 x_i, y_i，表示连接节点 x_i 和 y_i 的一条边`,
    outputFormat: `输出一个整数，表示最少操作次数。`,
    samples: [
      { input: "5\n0 1 0 1 0\n1 2\n1 3\n3 4\n3 5", output: "2" },
    ],
    testCases: [
      { input: "5\n0 1 0 1 0\n1 2\n1 3\n3 4\n3 5", output: "2" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `将节点 1 和节点 3 变为黑色即可使树变美丽。1 ≤ n ≤ 10^5，0 ≤ a_i ≤ 1。`,
  },
  {
    title: "[GESP202406 七级] 区间乘积",
    source: "gesp_official",
    sourceId: "P10724",
    sourceUrl: "https://www.luogu.com.cn/problem/P10724",
    level: 7,
    knowledgePoints: ["数论", "质因数分解", "状态压缩", "前缀和"],
    difficulty: "提高+/省选-",
    description: `小杨有一个包含 n 个正整数的序列 A = [a_1, a_2, ..., a_n]。求有多少对 ⟨l, r⟩（1 ≤ l ≤ r ≤ n）满足乘积 a_l × a_{l+1} × ... × a_r 是完全平方数。

正整数 x 是完全平方数当且仅当存在正整数 y 使得 x = y × y。`,
    inputFormat: `第一行：正整数 n（序列长度）

第二行：n 个正整数 a_i，表示序列 A`,
    outputFormat: `输出一个整数，表示满足条件的 ⟨l, r⟩ 对数。`,
    samples: [
      { input: "5\n3 2 4 3 2", output: "2" },
    ],
    testCases: [
      { input: "5\n3 2 4 3 2", output: "2" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `满足条件的区间为 ⟨1, 5⟩ 和 ⟨3, 3⟩。⟨1,5⟩: 3×2×4×3×2 = 144 = 12²；⟨3,3⟩: 4 = 2²。约束：1 ≤ n ≤ 10^5，1 ≤ a_i ≤ 30。`,
  },

  // ========== 2024年9月 ==========
  {
    title: "[GESP202409 七级] 矩阵移动",
    source: "gesp_official",
    sourceId: "P11248",
    sourceUrl: "https://www.luogu.com.cn/problem/P11248",
    level: 7,
    knowledgePoints: ["动态规划", "网格路径", "贪心"],
    difficulty: "提高+/省选-",
    description: `小杨有一个 n × m 的矩阵，矩阵中只包含字符 '0'、'1' 和 '?'。从位置 (1,1) 出发，每次只能向下或向右移动，最终到达 (n,m)。每经过一个 '1' 字符，得分增加 1（包括起点和终点）。其他字符不影响得分，初始得分为 0。

小杨可以将至多 x 个 '?' 转换为 '1'。修改完成后，小杨会以最优方式从左上角移动到右下角。求最大可能得分。`,
    inputFormat: `第一行：整数 t（测试用例数）

每个测试用例：
- 第一行：三个整数 n, m, x（矩阵维度和最大转换次数）
- 接下来 n 行：长度为 m 的字符串，仅包含 '0'、'1'、'?'`,
    outputFormat: `对每个测试用例，输出一个整数，表示最优策略下的最大得分。`,
    samples: [
      { input: "2\n3 3 1\n000\n111\n01?\n3 3 1\n000\n?0?\n01?", output: "4\n2" },
    ],
    testCases: [
      { input: "2\n3 3 1\n000\n111\n01?\n3 3 1\n000\n?0?\n01?", output: "4\n2" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `测试用例 1：将 (3,3) 位置的 '?' 转为 '1'，走路径得分 4。约束：1 ≤ t ≤ 10，1 ≤ n,m ≤ 500，1 ≤ x ≤ 300。`,
  },
  {
    title: "[GESP202409 七级] 小杨寻宝",
    source: "gesp_official",
    sourceId: "P11249",
    sourceUrl: "https://www.luogu.com.cn/problem/P11249",
    level: 7,
    knowledgePoints: ["树", "欧拉路径", "DFS", "树的遍历"],
    difficulty: "提高+/省选-",
    description: `小杨有一棵含 n 个节点的树，其中某些节点藏有宝藏。他可以从任意节点出发遍历这棵树，但每条边最多只能经过一次——经过后该边消失。经过含有宝藏的节点时可以收集宝藏。

判断小杨是否能收集到所有宝藏。`,
    inputFormat: `多组测试数据。第一行：整数 t（测试用例数）。

每个测试用例（共 n+1 行）：
- 第 1 行：整数 n（节点数）
- 第 2 行：n 个非负整数 a_1, a_2, ..., a_n，a_i = 1 表示节点 i 有宝藏，a_i = 0 表示无宝藏
- 第 3 到第 n+1 行：每行两个整数 x_i, y_i，表示连接节点的边`,
    outputFormat: `对每个测试用例：若能收集所有宝藏输出 "Yes"，否则输出 "No"。`,
    samples: [
      { input: "2\n5\n0 1 0 1 0\n1 2\n1 3\n3 4\n3 5\n5\n1 1 1 1 1\n1 2\n1 3\n3 4\n3 5", output: "Yes\nNo" },
    ],
    testCases: [
      { input: "2\n5\n0 1 0 1 0\n1 2\n1 3\n3 4\n3 5\n5\n1 1 1 1 1\n1 2\n1 3\n3 4\n3 5", output: "Yes\nNo" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `测试用例 1：从节点 2 出发，沿路径 2→1→3→4 可收集所有宝藏。约束：1 ≤ t ≤ 10，1 ≤ n ≤ 10^5。`,
  },

  // ========== 2024年12月 ==========
  {
    title: "[GESP202412 七级] 武器购买",
    source: "gesp_official",
    sourceId: "P11377",
    sourceUrl: "https://www.luogu.com.cn/problem/P11377",
    level: 7,
    knowledgePoints: ["动态规划", "背包问题", "二维背包"],
    difficulty: "普及+/提高",
    description: `商店有 n 件武器，第 i 件武器的战斗力为 p_i，花费为 c_i。小杨希望购买若干武器，使得：总战斗力 ≥ P，总花费 ≤ Q。

判断是否存在合法的购买方案，若存在则输出最小花费。`,
    inputFormat: `第一行：正整数 t（测试用例数）。

每组测试用例：第一行三个正整数 n, P, Q；接下来 n 行，每行两个正整数 p_i, c_i（第 i 件武器的战斗力和花费）。`,
    outputFormat: `对于每组测试用例，若存在合法方案则输出最小花费，否则输出 -1。`,
    samples: [
      { input: "3\n3 2 3\n1 2\n1 2\n2 3\n3 3 4\n1 2\n1 2\n2 3\n3 1000 1000\n1 2\n1 2\n2 3", output: "3\n-1\n-1" },
    ],
    testCases: [
      { input: "3\n3 2 3\n1 2\n1 2\n2 3\n3 3 4\n1 2\n1 2\n2 3\n3 1000 1000\n1 2\n1 2\n2 3", output: "3\n-1\n-1" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `约束：1 ≤ t ≤ 10, 1 ≤ n ≤ 100, 1 ≤ p_i, c_i, P, Q ≤ 5×10^4。`,
  },
  {
    title: "[GESP202412 七级] 燃烧",
    source: "gesp_official",
    sourceId: "P11378",
    sourceUrl: "https://www.luogu.com.cn/problem/P11378",
    level: 7,
    knowledgePoints: ["树", "DFS", "BFS", "排序"],
    difficulty: "提高+/省选-",
    description: `小杨有一棵 n 个节点的树，节点编号 1 到 n，每个节点 i 有权值 a_i。选择一个初始节点点燃，燃烧的节点会向权值严格小于自身的相邻节点传播火焰，直到无法继续。

求：选择最优初始节点时，最多能燃烧多少个节点。`,
    inputFormat: `第一行：正整数 n（节点数）。

第二行：n 个正整数 a_1, a_2, ..., a_n（节点权值）。

接下来 n-1 行：每行两个正整数 u_i, v_i（表示连边）。`,
    outputFormat: `一个正整数，表示最多能燃烧的节点数。`,
    samples: [
      { input: "5\n6 2 3 4 5\n1 2\n2 3\n2 5\n1 4", output: "3" },
    ],
    testCases: [
      { input: "5\n6 2 3 4 5\n1 2\n2 3\n2 5\n1 4", output: "3" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `样例中选择节点1（权值6）可以烧到节点4（权值4）和节点2（权值2），共烧3个节点。约束：1 ≤ n ≤ 10^5, 1 ≤ a_i ≤ 10^6。`,
  },

  // ========== 2025年3月 ==========
  {
    title: "[GESP202503 七级] 图上移动",
    source: "gesp_official",
    sourceId: "P11964",
    sourceUrl: "https://www.luogu.com.cn/problem/P11964",
    level: 7,
    knowledgePoints: ["图论", "矩阵乘法", "位运算", "BFS"],
    difficulty: "提高+/省选-",
    description: `给定一个 n 个节点、m 条边的无向图（节点编号 1 到 n）。对于每个起始节点 i（1 ≤ i ≤ n），求恰好走 1, 2, ..., k 步后，分别能到达多少个不同的节点。`,
    inputFormat: `第一行：三个正整数 n, m, k（节点数、边数、最大步数）。

接下来 m 行：每行两个整数 u_i, v_i，表示一条无向边。`,
    outputFormat: `共 n 行，第 i 行包含 k 个整数，第 j 个整数表示从节点 i 出发恰好走 j 步后能到达的不同节点数。`,
    samples: [
      { input: "4 4 3\n1 2\n1 3\n2 3\n3 4", output: "2 4 4\n2 4 4\n3 3 4\n1 3 3" },
    ],
    testCases: [
      { input: "4 4 3\n1 2\n1 3\n2 3\n3 4", output: "2 4 4\n2 4 4\n3 3 4\n1 3 3" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `约束：1 ≤ n ≤ 500, 1 ≤ m ≤ 500, 1 ≤ k ≤ 20。可以用布尔矩阵乘法或 BFS 逐步扩展。`,
  },
  {
    title: "[GESP202503 七级] 等价消除",
    source: "gesp_official",
    sourceId: "P11965",
    sourceUrl: "https://www.luogu.com.cn/problem/P11965",
    level: 7,
    knowledgePoints: ["字符串", "哈希", "异或", "前缀和"],
    difficulty: "提高+/省选-",
    description: `小A有一个仅包含小写英文字母的字符串 S。如果一个字符串可以通过不断消除两个相同字符最终变为空串，则称该字符串是"可等价消除的"。

求 S 有多少个子串是可等价消除的。子串定义为从 S 中去掉某个前缀和某个后缀后得到的字符串。`,
    inputFormat: `第一行：正整数 |S|（字符串长度）。

第二行：字符串 S，仅包含小写英文字母。`,
    outputFormat: `一个整数，表示可等价消除的子串数量。`,
    samples: [
      { input: "7\naaaaabb", output: "9" },
      { input: "9\nbabacabab", output: "2" },
    ],
    testCases: [
      { input: "7\naaaaabb", output: "9" },
      { input: "9\nbabacabab", output: "2" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `关键性质：一个字符串是可等价消除的，当且仅当其中每个字符都出现偶数次。约束：1 ≤ |S| ≤ 2×10^5。`,
  },

  // ========== 2025年6月 ==========
  {
    title: "[GESP202506 七级] 线图",
    source: "gesp_official",
    sourceId: "P13017",
    sourceUrl: "https://www.luogu.com.cn/problem/P13017",
    level: 7,
    knowledgePoints: ["图论", "线图", "度数计算"],
    difficulty: "普及+/提高",
    description: `给定一个简单无向图 G，有 n 个节点和 m 条边，节点编号 1 到 n。简单无向图中不含重边和自环。

线图 L(G) 的构造方式如下：
- 初始时 L(G) 为空图
- 对 G 中的每条边，在 L(G) 中添加一个对应的节点
- 对于 G 中两条不同的边，如果它们共享一个公共端点，则在 L(G) 中添加一条无向边连接这两条边对应的节点

任务：求 L(G) 中无向边的数量。`,
    inputFormat: `第一行：两个正整数 n、m（G 的节点数和边数）

接下来 m 行：每行两个正整数 u_i、v_i，表示 G 中一条无向边`,
    outputFormat: `一个整数，表示 L(G) 中无向边的总数。`,
    samples: [
      { input: "5 4\n1 2\n2 3\n3 1\n4 5", output: "3" },
      { input: "5 10\n1 2\n1 3\n1 4\n1 5\n2 3\n2 4\n2 5\n3 4\n3 5\n4 5", output: "30" },
    ],
    testCases: [
      { input: "5 4\n1 2\n2 3\n3 1\n4 5", output: "3" },
      { input: "5 10\n1 2\n1 3\n1 4\n1 5\n2 3\n2 4\n2 5\n3 4\n3 5\n4 5", output: "30" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `60%: 1 ≤ n ≤ 500, 1 ≤ m ≤ 500。100%: 1 ≤ n ≤ 10^5, 1 ≤ m ≤ 10^5。`,
  },
  {
    title: "[GESP202506 七级] 调味平衡",
    source: "gesp_official",
    sourceId: "P13018",
    sourceUrl: "https://www.luogu.com.cn/problem/P13018",
    level: 7,
    knowledgePoints: ["动态规划", "背包问题", "数学"],
    difficulty: "提高+/省选-",
    description: `小 A 准备了 n 种食材（编号 1 到 n）用于烹饪。每种食材 i 有酸度 a_i 和甜度 b_i。对于每种食材，小 A 可以选择放入或不放入菜品中。

菜品的总酸度 A 等于所有被选食材的酸度之和，总甜度 B 等于所有被选食材的甜度之和。当总酸度等于总甜度（A = B）时，菜品实现"调味平衡"。

由于过于寡淡的菜品口感不佳，小 A 希望在保持平衡的前提下，最大化酸度与甜度之和（A + B）。求该最大值。`,
    inputFormat: `第一行：正整数 n（食材种类数）

接下来 n 行：每行两个正整数 a_i、b_i（食材 i 的酸度和甜度）`,
    outputFormat: `一个整数，表示在调味平衡约束下，酸度与甜度之和的最大值。`,
    samples: [
      { input: "3\n1 2\n2 4\n3 2", output: "8" },
      { input: "5\n1 1\n2 3\n6 1\n8 2\n5 7", output: "2" },
    ],
    testCases: [
      { input: "3\n1 2\n2 4\n3 2", output: "8" },
      { input: "5\n1 1\n2 3\n6 1\n8 2\n5 7", output: "2" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `40%: 1 ≤ n ≤ 10, 1 ≤ a_i, b_i ≤ 10。60%: 1 ≤ n ≤ 50。100%: 1 ≤ n ≤ 100, 1 ≤ a_i, b_i ≤ 500。`,
  },

  // ========== 2025年9月 ==========
  {
    title: "[GESP202509 七级] 连通图",
    source: "gesp_official",
    sourceId: "P14077",
    sourceUrl: "https://www.luogu.com.cn/problem/P14077",
    level: 7,
    knowledgePoints: ["图论", "并查集", "连通分量", "BFS"],
    difficulty: "普及/提高-",
    description: `给定一个 n 个节点、m 条边的无向图，节点编号为 1 到 n。如果两个节点可以通过若干条边互相到达，则称它们是"连通的"。

你需要添加最少的边，使得整个图连通（即任意两个节点可以互相到达）。输入的图可能包含重边和自环。`,
    inputFormat: `第一行：两个正整数 n 和 m（节点数和边数）

接下来 m 行：每行两个正整数 u_i 和 v_i，表示一条连接 u_i 和 v_i 的边`,
    outputFormat: `一个整数，表示使图完全连通所需的最少添加边数。`,
    samples: [
      { input: "4 4\n1 2\n2 3\n3 1\n1 4", output: "0" },
      { input: "6 4\n1 2\n2 3\n3 1\n6 5", output: "2" },
    ],
    testCases: [
      { input: "4 4\n1 2\n2 3\n3 1\n1 4", output: "0" },
      { input: "6 4\n1 2\n2 3\n3 1\n6 5", output: "2" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `40%: 1 ≤ n ≤ 100, 1 ≤ m ≤ 100。100%: 1 ≤ n ≤ 10^5, 1 ≤ m ≤ 10^5。`,
  },
  {
    title: "[GESP202509 七级] 金币收集",
    source: "gesp_official",
    sourceId: "P14078",
    sourceUrl: "https://www.luogu.com.cn/problem/P14078",
    level: 7,
    knowledgePoints: ["动态规划", "贪心", "排序"],
    difficulty: "提高+/省选-",
    description: `玩家 A 在一条数轴上进行金币收集游戏。共有 n 枚金币，其中第 i 枚金币在时刻 t_i 出现在坐标 x_i 处。玩家 A 必须恰好在时刻 t_i 处于坐标 x_i 才能收集到第 i 枚金币。

游戏在时刻 0 开始，玩家 A 的初始位置在坐标 0。左方向键坏了，在每个时间步，玩家 A 只能选择原地不动或向右移动一个单位。

求玩家 A 最多能收集多少枚金币。`,
    inputFormat: `第一行：整数 n（金币数量）

接下来 n 行：每行两个整数 x_i, t_i（第 i 枚金币的坐标和出现时间）`,
    outputFormat: `一个整数，表示最多能收集的金币数量。`,
    samples: [
      { input: "3\n1 6\n3 7\n2 4", output: "2" },
      { input: "4\n1 1\n2 2\n1 3\n2 4", output: "3" },
    ],
    testCases: [
      { input: "3\n1 6\n3 7\n2 4", output: "2" },
      { input: "4\n1 1\n2 2\n1 3\n2 4", output: "3" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `40%: 1 ≤ n ≤ 8。另外30%: 1 ≤ n ≤ 100。100%: 1 ≤ n ≤ 10^5, 1 ≤ x_i, t_i ≤ 10^9。`,
  },

  // ========== 2025年12月 ==========
  {
    title: "[GESP202512 七级] 城市规划",
    source: "gesp_official",
    sourceId: "P14921",
    sourceUrl: "https://www.luogu.com.cn/problem/P14921",
    level: 7,
    knowledgePoints: ["图论", "BFS", "最短路径", "图的中心"],
    difficulty: "普及+/提高",
    description: `A 国有 n 个城市，通过 m 条双向道路相连。任意城市之间都可以通过若干条道路互相到达。城市编号为 1 到 n。

对于城市 u 和 v，定义它们的连通度 d(u, v) 为从 u 到 v 所需经过的最少道路数。

城市 u 的建设难度定义为 u 到所有其他城市连通度的最大值。求建设难度最小的城市；如果有多个城市并列，选择编号最小的。`,
    inputFormat: `第一行：两个整数 n, m（城市数和道路数）

接下来 m 行：每行两个整数 u_i, v_i（一条双向道路）`,
    outputFormat: `一个整数，表示建设难度最小的城市编号（并列时取最小编号）。`,
    samples: [
      { input: "3 3\n1 2\n1 3\n2 3", output: "1" },
      { input: "4 4\n1 2\n2 3\n3 4\n2 4", output: "2" },
    ],
    testCases: [
      { input: "3 3\n1 2\n1 3\n2 3", output: "1" },
      { input: "4 4\n1 2\n2 3\n3 4\n2 4", output: "2" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `40%: 1 ≤ n ≤ 300。100%: 1 ≤ n ≤ 2000, 1 ≤ m ≤ 2000。`,
  },
  {
    title: "[GESP202512 七级] 学习小组",
    source: "gesp_official",
    sourceId: "P14922",
    sourceUrl: "https://www.luogu.com.cn/problem/P14922",
    level: 7,
    knowledgePoints: ["动态规划", "分组", "排序", "贪心"],
    difficulty: "提高+/省选-",
    description: `班主任计划将 n 名学生分成若干学习小组。每名学生必须恰好加入一个小组。学生编号为 1 到 n，第 i 名学生有一个"发言积极性"值 c_i。

对于一个包含 k 名学生（编号为 p_1, p_2, ..., p_k）的小组：
- 基础讨论积极性：a_k
- 综合讨论积极性：a_k + max{c_{p_1}, ..., c_{p_k}} - min{c_{p_1}, ..., c_{p_k}}

任务：求所有可能的分组方案中，所有小组综合讨论积极性之和的最大值。`,
    inputFormat: `第 1 行：整数 n（学生人数）

第 2 行：n 个非负整数 c_1, c_2, ..., c_n（各学生的发言积极性值）

第 3 行：n 个非负整数 a_1, a_2, ..., a_n（各组人数对应的基础讨论积极性）`,
    outputFormat: `一个整数，表示综合讨论积极性之和的最大值。`,
    samples: [
      { input: "4\n2 1 3 2\n1 5 6 3", output: "12" },
      { input: "8\n1 3 2 4 3 5 4 6\n0 2 5 6 4 3 3 4", output: "21" },
    ],
    testCases: [
      { input: "4\n2 1 3 2\n1 5 6 3", output: "12" },
      { input: "8\n1 3 2 4 3 5 4 6\n0 2 5 6 4 3 3 4", output: "21" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `40%: c_i = 0。100%: 1 ≤ n ≤ 300, 0 ≤ c_i ≤ 10^4, 0 ≤ a_i ≤ 10^4。`,
  },
];

async function seedGesp7() {
  try {
    // 删除现有的GESP7题目，重新导入
    await prisma.problem.deleteMany({
      where: {
        sourceId: {
          in: gesp7Problems.map(p => p.sourceId).filter(Boolean) as string[]
        }
      }
    });

    // 添加所有题目
    const result = await prisma.problem.createMany({
      data: gesp7Problems,
    });

    return NextResponse.json({
      success: true,
      message: `成功导入 ${result.count} 道 GESP 7级题目`,
      count: result.count
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
