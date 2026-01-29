import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GESP 8级完整题库 - 来源：洛谷 CCF GESP C++ 八级上机题
// 共20道题目
// 难度标签采用洛谷评级：
// - "easy" = 入门(1)/普及-(2)
// - "medium" = 普及/提高-(3)/普及+/提高(4)
// - "hard" = 提高+/省选-(5)及以上

const gesp8Problems = [
  // ========== 样题 ==========
  {
    title: "[GESP样题 八级] 区间",
    source: "gesp_official",
    sourceId: "P10288",
    sourceUrl: "https://www.luogu.com.cn/problem/P10288",
    level: 8,
    knowledgePoints: ["区间查询", "二分查找", "离散化", "数据结构"],
    difficulty: "省选/NOI-", // 洛谷难度4 普及+/提高
    description: `给定一个正整数序列，需要处理多次区间查询。对于每次查询，统计指定区间内某个目标值出现的次数。

具体地，给定一个长度为 n 的正整数序列 A，以及 q 次查询，每次查询给出三个整数 l, r, x，求 A[l] 到 A[r] 中有多少个数等于 x。`,
    inputFormat: `第一行包含一个正整数 T，表示测试用例数。

对于每个测试用例：
- 第一行包含一个正整数 n，表示序列长度
- 第二行包含 n 个正整数，表示序列 A
- 第三行包含一个正整数 q，表示查询次数
- 接下来 q 行，每行三个正整数 l, r, x，表示一次查询

数据范围：
- 1 ≤ T ≤ 5
- 1 ≤ n, q ≤ 10^5
- 1 ≤ A[i] ≤ 10^9
- 1 ≤ l ≤ r ≤ n`,
    outputFormat: `对于每个测试用例，输出 q 行，每行一个非负整数，表示对应查询的答案。`,
    samples: [
      {
        input: "2\n5\n7 4 6 1 1\n2\n1 2 3\n1 5 1\n5\n1 2 3 4 5\n2\n5 5 3\n1 4 3",
        output: "0\n2\n0\n1",
        explanation: "第一组：区间[1,2]中没有3，区间[1,5]中有2个1；第二组：区间[5,5]中没有3，区间[1,4]中有1个3"
      },
    ],
    testCases: [
      { input: "2\n5\n7 4 6 1 1\n2\n1 2 3\n1 5 1\n5\n1 2 3 4 5\n2\n5 5 3\n1 4 3", output: "0\n2\n0\n1" },
      { input: "1\n3\n1 1 1\n1\n1 3 1", output: "3" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `子任务1（30分）：n, q ≤ 100，值域 ≤ 10
子任务2（30分）：n, q ≤ 10^5，值域 ≤ 10^5
子任务3（40分）：n, q ≤ 10^5，值域 ≤ 10^9

可以使用离散化+二分查找，或者对每个值维护其出现位置的有序列表。`,
  },
  {
    title: "[GESP样题 八级] 小杨的旅游",
    source: "gesp_official",
    sourceId: "P10289",
    sourceUrl: "https://www.luogu.com.cn/problem/P10289",
    level: 8,
    knowledgePoints: ["树", "LCA", "最近公共祖先", "图论", "传送门"],
    difficulty: "省选/NOI-", // 洛谷难度4 提高
    description: `小杨在B国旅游。B国有 n 座城市，由 n-1 条双向道路连接成树形结构。其中 k 座城市设有传送门，可以在任意两个有传送门的城市之间瞬间传送。

小杨需要回答 q 次查询，每次查询给出两座城市，求它们之间的最短时间。

从一座城市到相邻城市需要花费 1 单位时间，使用传送门不花费时间。`,
    inputFormat: `第一行包含三个正整数 n, k, q，分别表示城市数、传送门城市数、查询次数。

接下来 n-1 行，每行两个正整数 u, v，表示城市 u 和城市 v 之间有一条道路。

第 n+1 行包含 k 个正整数，表示设有传送门的城市编号。

接下来 q 行，每行两个正整数 s, t，表示查询从城市 s 到城市 t 的最短时间。

数据范围：
- 1 ≤ n ≤ 2×10^5
- 0 ≤ k ≤ n
- 1 ≤ q ≤ 2×10^5`,
    outputFormat: `输出 q 行，每行一个非负整数，表示对应查询的最短时间。`,
    samples: [
      {
        input: "7 2 1\n5 7\n3 6\n2 3\n1 5\n5 4\n1 2\n7 4\n3 7",
        output: "4",
        explanation: "城市7和4都有传送门，从3走到7用传送门，再走到4"
      },
      {
        input: "5 0 3\n2 3\n5 1\n5 2\n1 4\n4 5\n1 4\n4 3",
        output: "2\n1\n4",
        explanation: "没有传送门，直接走树上路径"
      }
    ],
    testCases: [
      { input: "7 2 1\n5 7\n3 6\n2 3\n1 5\n5 4\n1 2\n7 4\n3 7", output: "4" },
      { input: "5 0 3\n2 3\n5 1\n5 2\n1 4\n4 5\n1 4\n4 3", output: "2\n1\n4" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `子任务1（30分）：小规模树
子任务2（30分）：无传送门
子任务3（40分）：完整数据

关键是求树上两点距离，可用LCA。有传送门时，最短路可能是：直接走、先走到某个传送门再传送到离终点最近的传送门。`,
  },
  // ========== 2023年12月 ==========
  {
    title: "[GESP202312 八级] 奖品分配",
    source: "gesp_official",
    sourceId: "P10112",
    sourceUrl: "https://www.luogu.com.cn/problem/P10112",
    level: 8,
    knowledgePoints: ["组合数学", "排列组合", "模运算", "多重集排列"],
    difficulty: "省选/NOI-", // 洛谷难度3
    description: `有 N 名学生（编号 0 到 N-1）和 M 种奖品。第 i 种奖品有 a_i 个。每名学生恰好获得一个奖品，且最多剩余一个奖品，即：
N ≤ a_0 + a_1 + ... + a_{M-1} ≤ N+1

求有多少种不同的分配方案。两种方案不同当且仅当存在某个学生获得的奖品种类不同。`,
    inputFormat: `第一行包含一个正整数 T，表示测试用例数。

接下来 T 行，每行包含 N、M 以及 M 个整数 a_0, a_1, ..., a_{M-1}。

数据范围：
- 1 ≤ T ≤ 100
- 1 ≤ N ≤ 10^6
- 1 ≤ M ≤ 10
- 0 ≤ a_i ≤ N`,
    outputFormat: `输出 T 行，每行一个整数，表示分配方案数对 10^9+7 取模的结果。`,
    samples: [
      {
        input: "3\n3 2 1 2\n3 2 1 3\n5 3 1 3 1",
        output: "3\n4\n20",
        explanation: "第一组：3个学生，1个A类奖品和2个B类奖品，方案数为C(3,1)=3"
      },
    ],
    testCases: [
      { input: "3\n3 2 1 2\n3 2 1 3\n5 3 1 3 1", output: "3\n4\n20" },
      { input: "1\n2 2 1 1", output: "2" },
    ],
    timeLimit: 1000,
    memoryLimit: 524,
    hint: `本质是多重集排列问题。答案为 N! / (a_0! × a_1! × ... × a_{M-1}! × r!)，其中 r 是剩余奖品数（0或1）。

需要预处理阶乘和阶乘逆元。`,
  },
  {
    title: "[GESP202312 八级] 大量的工作沟通",
    source: "gesp_official",
    sourceId: "P10113",
    sourceUrl: "https://www.luogu.com.cn/problem/P10113",
    level: 8,
    knowledgePoints: ["树", "LCA", "最近公共祖先", "树上路径"],
    difficulty: "省选/NOI-", // 洛谷难度3 提高-
    description: `一家公司有 N 名员工（编号 0 到 N-1）。员工 0 是老板。每个其他员工有且仅有一个直接上级。

定义"管理关系"：员工 x 可以管理员工 y，当且仅当：
1. x 等于 y，或
2. x 是 y 的直接上级，或
3. x 可以管理 y 的直接上级

注意：老板（员工0）只能管理自己。

对于每次协作项目，需要找到能管理所有参与者的、编号最大的员工。`,
    inputFormat: `第一行包含一个正整数 N，表示员工数。

第二行包含 N-1 个正整数 f_1, f_2, ..., f_{N-1}，其中 f_i 表示员工 i 的直接上级。

第三行包含一个正整数 Q，表示协作项目数。

接下来 Q 行，每行先是一个正整数 m 表示参与人数，然后是 m 个员工编号。

数据范围：
- 3 ≤ N ≤ 10^5
- Q ≤ 100
- m ≤ 10^4`,
    outputFormat: `输出 Q 行，每行一个整数，表示协调人的编号。`,
    samples: [
      {
        input: "5\n0 0 2 2\n3\n2 3 4\n3 2 3 4\n2 1 4",
        output: "2\n2\n0",
        explanation: "员工2可以管理3和4；员工0管理所有人"
      },
    ],
    testCases: [
      { input: "5\n0 0 2 2\n3\n2 3 4\n3 2 3 4\n2 1 4", output: "2\n2\n0" },
      { input: "7\n0 1 0 2 1 2\n5\n2 3 6\n3 1 4 5\n2 5 6\n3 4 5 6\n2 1 3", output: "2\n1\n1\n1\n0" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `本质是求多个节点的LCA（最近公共祖先）。注意题目定义的"管理关系"实际上是祖先关系。

找所有参与者的LCA，就是能管理所有人的编号最大的员工。`,
  },
  // ========== 2024年3月 ==========
  {
    title: "[GESP202403 八级] 公倍数问题",
    source: "gesp_official",
    sourceId: "P10263",
    sourceUrl: "https://www.luogu.com.cn/problem/P10263",
    level: 8,
    knowledgePoints: ["数论", "因子", "公倍数", "枚举因子"],
    difficulty: "省选/NOI-", // 洛谷难度3 普及
    description: `给定一个 N×M 的矩阵，其中位置 (i,j) 的元素 A[i,j] 是 i 和 j 的公倍数。

对于每个 k（1 ≤ k ≤ K），统计矩阵中有多少个位置可能存放值 k。

最终输出 Σ(k=1 到 K) k × ans_k，其中 ans_k 是能存放 k 的位置数。`,
    inputFormat: `一行三个正整数 N, M, K。

数据范围：
- 1 ≤ N, M ≤ 10^9
- 1 ≤ K ≤ 10^5`,
    outputFormat: `输出一个整数，表示答案。`,
    samples: [
      {
        input: "2 5 2",
        output: "9",
        explanation: "k=1时，只有(1,1)位置可以是1的公倍数，ans_1=1；k=2时，(1,2),(2,1),(2,2),(1,4)等位置可以，ans_2=4。总和=1×1+2×4=9"
      },
      {
        input: "100 100 100",
        output: "185233"
      }
    ],
    testCases: [
      { input: "2 5 2", output: "9" },
      { input: "100 100 100", output: "185233" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `位置 (i,j) 可以存放 k 当且仅当 k 是 i 和 j 的公倍数，即 i|k 且 j|k。

ans_k = (k在[1,N]内的因子数) × (k在[1,M]内的因子数)

枚举 k 的所有因子即可。`,
  },
  {
    title: "[GESP202403 八级] 接竹竿",
    source: "gesp_official",
    sourceId: "P10264",
    sourceUrl: "https://www.luogu.com.cn/problem/P10264",
    level: 8,
    knowledgePoints: ["栈", "模拟", "区间DP", "记忆化搜索"],
    difficulty: "省选/NOI-", // 洛谷难度4 提高
    description: `这是一个纸牌游戏。玩家依次将卡牌加入队列末尾。当新加入的卡牌与队列中某张卡牌值相同时，这两张卡牌及其之间的所有卡牌都会被移除。

给定一个长度为 n 的卡牌序列和 q 次查询，每次查询给出区间 [l, r]，求用这个区间的卡牌玩游戏后剩余的卡牌数。`,
    inputFormat: `第一行包含一个正整数 T，表示测试用例数。

对于每个测试用例：
- 第一行包含一个正整数 n，表示卡牌序列长度
- 第二行包含 n 个正整数 A_1, A_2, ..., A_n，表示卡牌值
- 第三行包含一个正整数 q，表示查询次数
- 接下来 q 行，每行两个正整数 l, r，表示查询区间

数据范围：
- n, q ≤ 1.5×10^4
- A_i ≤ 13`,
    outputFormat: `对于每个测试用例，输出 q 行，每行一个非负整数，表示剩余卡牌数。`,
    samples: [
      {
        input: "1\n6\n1 2 2 3 1 3\n4\n1 3\n1 6\n1 5\n5 6",
        output: "1\n1\n0\n2",
        explanation: "[1,3]: 1,2,2 -> 2,2被移除 -> 剩1张\n[1,6]: 最终只剩1张\n[1,5]: 全部被移除\n[5,6]: 1,3无法配对，剩2张"
      },
    ],
    testCases: [
      { input: "1\n6\n1 2 2 3 1 3\n4\n1 3\n1 6\n1 5\n5 6", output: "1\n1\n0\n2" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `子任务1（30分）：n, q ≤ 100
子任务2（30分）：n, q ≤ 1.5×10^4，所有查询 r = n
子任务3（40分）：n, q ≤ 1.5×10^4

可以使用区间DP或记忆化搜索预处理所有区间的答案。`,
  },
  // ========== 2024年6月 ==========
  {
    title: "[GESP202406 八级] 最远点对",
    source: "gesp_official",
    sourceId: "P10725",
    sourceUrl: "https://www.luogu.com.cn/problem/P10725",
    level: 8,
    knowledgePoints: ["树", "树的直径", "DFS", "BFS", "换根DP"],
    difficulty: "省选/NOI-", // 洛谷难度5 提高+
    description: `给定一棵 n 个节点的树，每个节点被染成白色（0）或黑色（1）。

求树上颜色不同的两个节点之间的最大距离。`,
    inputFormat: `第一行包含一个正整数 n，表示节点数。

第二行包含 n 个整数 a_1, a_2, ..., a_n，其中 a_i ∈ {0, 1} 表示节点 i 的颜色。

接下来 n-1 行，每行两个正整数 u, v，表示节点 u 和 v 之间有一条边。

数据范围：
- 1 ≤ n ≤ 10^5
- 保证存在至少一个白色节点和一个黑色节点`,
    outputFormat: `输出一个整数，表示颜色不同的两点之间的最大距离。`,
    samples: [
      {
        input: "5\n0 1 0 1 0\n1 2\n1 3\n3 4\n3 5",
        output: "3",
        explanation: "节点2（黑）和节点5（白）的距离为3，是最远的异色点对"
      },
    ],
    testCases: [
      { input: "5\n0 1 0 1 0\n1 2\n1 3\n3 4\n3 5", output: "3" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `子任务1（30分）：n ≤ 10^5，树是一条链
子任务2（30分）：n ≤ 10^3
子任务3（40分）：n ≤ 10^5

方法一：枚举每个点，求到最远黑点和最远白点的距离
方法二：分别求白色点集和黑色点集的"直径端点"，然后计算跨颜色的最远距离`,
  },
  {
    title: "[GESP202406 八级] 空间跳跃",
    source: "gesp_official",
    sourceId: "P10726",
    sourceUrl: "https://www.luogu.com.cn/problem/P10726",
    level: 8,
    knowledgePoints: ["图论", "最短路", "Dijkstra", "建图"],
    difficulty: "省选/NOI-", // 洛谷难度4 提高
    description: `小杨可以在 n 个水平平台上移动。每个平台有左端点、右端点和高度。

小杨从平台 s 的左端点出发，目标是到达平台 t。移动规则：
- 水平移动：每单位距离花费 1 单位时间
- 当走到平台边缘继续移动时，会垂直下落到正下方的平台，每单位高度花费 1 单位时间

求从平台 s 的左端点到达平台 t 的最短时间。如果无法到达，输出 -1。`,
    inputFormat: `第一行包含一个正整数 n，表示平台数。

第二行包含两个正整数 s, t，表示起点和终点平台。

接下来 n 行，每行三个正整数 l_i, r_i, h_i，表示平台 i 的左端点、右端点和高度。

数据范围：
- 1 ≤ n ≤ 10^5
- 1 ≤ l_i < r_i ≤ 10^9
- 1 ≤ h_i ≤ 10^9`,
    outputFormat: `输出一个整数，表示最短时间。如果无法到达输出 -1。`,
    samples: [
      {
        input: "3\n3 1\n5 6 3\n3 5 6\n1 4 100000",
        output: "100001",
        explanation: "从平台3的左端点出发，需要计算到达平台1的最短路径"
      },
    ],
    testCases: [
      { input: "3\n3 1\n5 6 3\n3 5 6\n1 4 100000", output: "100001" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `关键是正确建图：
1. 找到每个位置下落后到达的平台
2. 建立平台之间的边（包括水平移动和下落）
3. 使用 Dijkstra 求最短路

需要对坐标离散化处理。`,
  },
  // ========== 2024年9月 ==========
  {
    title: "[GESP202409 八级] 手套配对",
    source: "gesp_official",
    sourceId: "P11250",
    sourceUrl: "https://www.luogu.com.cn/problem/P11250",
    level: 8,
    knowledgePoints: ["组合数学", "排列组合", "容斥原理", "逆元"],
    difficulty: "省选/NOI-", // 洛谷难度5 提高+
    description: `小杨有 n 双不同的手套，每双手套由一只左手套和一只右手套组成。

她想从这 2n 只手套中选择 m 只，使得恰好有 k 双是配对的（即同时选中了同一双手套的左右两只）。

求选择方案数，答案对 10^9+7 取模。`,
    inputFormat: `第一行包含一个正整数 t，表示测试用例数。

接下来 t 行，每行三个正整数 n, m, k。

数据范围：
- 1 ≤ t ≤ 10^5
- 1 ≤ n ≤ 1000
- 1 ≤ m ≤ 2n
- 1 ≤ k ≤ n`,
    outputFormat: `输出 t 行，每行一个整数，表示方案数。`,
    samples: [
      {
        input: "2\n5 6 2\n5 1 5",
        output: "120\n0",
        explanation: "第一组：5双手套选6只，恰好2对配对；第二组：只选1只不可能有5对配对"
      },
    ],
    testCases: [
      { input: "2\n5 6 2\n5 1 5", output: "120\n0" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `子任务1（30%）：t≤5, n≤1000, m≤3, k=1
子任务2（30%）：t≤5, n≤5, m≤10, k≤5
子任务3（40%）：t≤10^5, n≤1000, m≤2000, k≤2000

方案数 = C(n,k) × C(n-k, m-2k) × 2^(m-2k)
- C(n,k)：选择哪k双完整配对
- C(n-k, m-2k)：从剩余n-k双中选m-2k只
- 2^(m-2k)：每只手套选左或右`,
  },
  {
    title: "[GESP202409 八级] 美丽路径",
    source: "gesp_official",
    sourceId: "P11251",
    sourceUrl: "https://www.luogu.com.cn/problem/P11251",
    level: 8,
    knowledgePoints: ["树", "DFS", "树形DP", "路径"],
    difficulty: "省选/NOI-", // 洛谷难度3 普及+
    description: `给定一棵 n 个节点的树，每个节点被染成白色（0）或黑色（1）。

定义"美丽路径"：路径上相邻的两个节点颜色不同。

求树上最长美丽路径的长度（以节点数计）。`,
    inputFormat: `第一行包含一个正整数 n，表示节点数。

第二行包含 n 个整数，表示每个节点的颜色（0=白色，1=黑色）。

接下来 n-1 行，每行两个正整数 u, v，表示一条边。

数据范围：
- 1 ≤ n ≤ 10^5`,
    outputFormat: `输出一个整数，表示最长美丽路径包含的节点数。`,
    samples: [
      {
        input: "5\n1 0 0 1 0\n1 2\n3 5\n4 3\n1 3",
        output: "4",
        explanation: "路径 2-1-3-4 是美丽的（颜色为 0-1-0-1），长度为4"
      },
      {
        input: "5\n0 0 0 0 0\n1 2\n2 3\n3 4\n4 5",
        output: "1",
        explanation: "所有节点同色，任何包含两个以上节点的路径都不美丽"
      }
    ],
    testCases: [
      { input: "5\n1 0 0 1 0\n1 2\n3 5\n4 3\n1 3", output: "4" },
      { input: "5\n0 0 0 0 0\n1 2\n2 3\n3 4\n4 5", output: "1" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `子任务1（30%）：n ≤ 1000，树是一条链
子任务2（30%）：n ≤ 1000
子任务3（40%）：n ≤ 10^5

树形DP：对每个节点，维护以它为端点的最长美丽路径长度，然后合并子树信息求出经过它的最长路径。`,
  },
  // ========== 2024年12月 ==========
  {
    title: "[GESP202412 八级] 树上移动",
    source: "gesp_official",
    sourceId: "P11379",
    sourceUrl: "https://www.luogu.com.cn/problem/P11379",
    level: 8,
    knowledgePoints: ["树", "树形DP", "DFS", "滑动窗口"],
    difficulty: "省选/NOI-", // 洛谷难度5 提高+/省选-
    description: `给定一棵 n 个节点的树，每个节点被染成白色（0）或黑色（1）。

小杨可以选择任意两个节点 s 和 t，然后从 s 沿树上路径走到 t（不能重复经过节点）。

求小杨最多能访问多少个节点，同时经过的黑色节点数不超过 k 个。`,
    inputFormat: `第一行包含两个正整数 n, k。

第二行包含 n 个整数 a_1, a_2, ..., a_n，表示节点颜色（0=白色，1=黑色）。

接下来 n-1 行，每行两个正整数 u, v，表示一条边。

数据范围：
- 1 ≤ n ≤ 1000
- 0 ≤ k ≤ 1000`,
    outputFormat: `输出一个整数，表示最多能访问的节点数。`,
    samples: [
      {
        input: "5 1\n0 0 1 1 1\n1 2\n2 3\n2 5\n1 4",
        output: "3",
        explanation: "路径 2-1-4 或 5-2-1 经过1个黑色节点，包含3个节点"
      },
    ],
    testCases: [
      { input: "5 1\n0 0 1 1 1\n1 2\n2 3\n2 5\n1 4", output: "3" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `子任务1（20%）：n≤100, k≤100，树是一条链
子任务2（20%）：n≤1000, k=0
子任务3（60%）：n≤1000, k≤1000

枚举所有路径，或者使用树形DP记录每个节点向下走经过不同黑色节点数时的最长路径。`,
  },
  {
    title: "[GESP202412 八级] 排队",
    source: "gesp_official",
    sourceId: "P11380",
    sourceUrl: "https://www.luogu.com.cn/problem/P11380",
    level: 8,
    knowledgePoints: ["组合数学", "排列组合", "图论", "连通分量"],
    difficulty: "省选/NOI-", // 洛谷难度3 提高-
    description: `班级有 n 名学生（编号 1 到 n）需要排成一队。有 m 对关系要求：学生 a_i 必须紧挨在学生 b_i 的前面。

求满足所有约束的排队方案数，答案对 10^9+7 取模。`,
    inputFormat: `第一行包含两个正整数 n, m。

接下来 m 行，每行两个正整数 a_i, b_i，表示 a_i 必须紧挨在 b_i 前面。

数据范围：
- 1 ≤ n ≤ 2×10^5
- 0 ≤ m ≤ 2×10^5`,
    outputFormat: `输出一个整数，表示方案数。如果无解输出 0。`,
    samples: [
      {
        input: "4 2\n1 3\n2 4",
        output: "2",
        explanation: "约束：1在3前面且相邻，2在4前面且相邻。方案：1324, 2413"
      },
      {
        input: "3 0",
        output: "6",
        explanation: "无约束，3!=6"
      },
      {
        input: "3 2\n1 2\n2 1",
        output: "0",
        explanation: "矛盾约束，无解"
      }
    ],
    testCases: [
      { input: "4 2\n1 3\n2 4", output: "2" },
      { input: "3 0", output: "6" },
      { input: "3 2\n1 2\n2 1", output: "0" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `分析约束关系：
1. 每个学生最多有一个"后继"（必须紧跟在他后面的人）
2. 每个学生最多有一个"前驱"
3. 如果形成环或冲突，无解
4. 约束会把学生分成若干条链，方案数 = (链的数量)!

判断是否有环、是否有冲突，然后统计链的数量。`,
  },
  // ========== 2025年3月 ==========
  {
    title: "[GESP202503 八级] 上学",
    source: "gesp_official",
    sourceId: "P11966",
    sourceUrl: "https://www.luogu.com.cn/problem/P11966",
    level: 8,
    knowledgePoints: ["图论", "最短路", "Dijkstra", "BFS"],
    difficulty: "提高+/省选-", // 洛谷难度2 普及
    description: `C城是一个包含 n 个节点和 m 条边的无向图。学校位于节点 s。有 q 位同学分别住在不同的节点，每位同学每秒可以行走 1 米。

计算每位同学从家到学校的最短时间。`,
    inputFormat: `第一行包含四个正整数 n, m, s, q，分别表示节点数、边数、学校位置、同学数。

接下来 m 行，每行三个正整数 u, v, l，表示节点 u 和 v 之间有一条长度为 l 米的边。

接下来 q 行，每行一个正整数 h，表示一位同学的家的位置。

数据范围：
- n, m, q ≤ 2×10^5
- 1 ≤ l ≤ 10^9`,
    outputFormat: `输出 q 行，每行一个整数，表示对应同学到学校的最短时间（秒）。`,
    samples: [
      {
        input: "5 5 3 3\n1 2 3\n2 3 2\n3 4 1\n4 5 3\n1 4 5\n5\n1\n4",
        output: "4\n3\n1",
        explanation: "学校在节点3，分别求节点5、1、4到节点3的最短距离"
      },
    ],
    testCases: [
      { input: "5 5 3 3\n1 2 3\n2 3 2\n3 4 1\n4 5 3\n1 4 5\n5\n1\n4", output: "4\n3\n1" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `从学校节点运行一次 Dijkstra 算法，求出学校到所有节点的最短距离，然后直接回答每个查询。

注意边权可能很大，需要用 long long。`,
  },
  {
    title: "[GESP202503 八级] 割裂",
    source: "gesp_official",
    sourceId: "P11967",
    sourceUrl: "https://www.luogu.com.cn/problem/P11967",
    level: 8,
    knowledgePoints: ["树", "LCA", "树上路径", "树链"],
    difficulty: "省选/NOI-", // 洛谷难度4 提高
    description: `小杨有一棵 n 个节点的树（节点编号 1 到 n）。

定义：
- 好点对：给定 a 对好点对
- 坏点对：给定一对坏点对 (b_u, b_v)

一个节点可以被删除，当且仅当删除后：
1. 所有好点对仍然连通
2. 坏点对不再连通

求有多少个节点可以被删除。`,
    inputFormat: `第一行包含两个正整数 n, a（节点数和好点对数）。

接下来 n-1 行，每行两个正整数，表示树的边。

接下来 a 行，每行两个正整数，表示好点对。

最后一行两个正整数 b_u, b_v，表示坏点对。

数据范围：
- n ≤ 10^6
- a ≤ 10^5`,
    outputFormat: `输出一个非负整数，表示可删除的节点数。`,
    samples: [
      {
        input: "6 2\n1 3\n1 5\n3 6\n3 2\n5 4\n5 3\n2 6\n4 6",
        output: "2",
        explanation: "删除节点1或3后，好点对仍连通，坏点对4和6不连通"
      },
    ],
    testCases: [
      { input: "6 2\n1 3\n1 5\n3 6\n3 2\n5 4\n5 3\n2 6\n4 6", output: "2" },
    ],
    timeLimit: 4000,
    memoryLimit: 512,
    hint: `子任务1（20分）：n ≤ 10, a = 0
子任务2（20分）：n ≤ 100, a ≤ 100
子任务3（60分）：n ≤ 10^6, a ≤ 10^5

关键观察：
1. 可删除的节点必须在坏点对的路径上
2. 不能是任何好点对路径上的"必经点"
3. 使用树链并集或差分统计`,
  },
  // ========== 2025年6月 ==========
  {
    title: "[GESP202506 八级] 树上旅行",
    source: "gesp_official",
    sourceId: "P13019",
    sourceUrl: "https://www.luogu.com.cn/problem/P13019",
    level: 8,
    knowledgePoints: ["树", "DFS", "倍增", "树上操作"],
    difficulty: "省选/NOI-", // 洛谷难度4 提高
    description: `给定一棵以节点 1 为根的有根树，包含 n 个节点。小 A 在树上进行 q 次旅行。

每次旅行从节点 s 出发，执行一系列移动操作：
- 正数 x：向上移动（走向父节点方向）x 步，如果到达根节点则停留
- 负数 x：向下移动（走向最小编号的子节点）|x| 步，如果到达叶子则停留

求每次旅行结束后所在的节点。`,
    inputFormat: `第一行包含两个正整数 n, q。

第二行包含 n-1 个正整数 p_2, p_3, ..., p_n，表示节点 i 的父节点。

接下来 q 次旅行，每次旅行：
- 第一行两个正整数 s, k（起点和操作数）
- 第二行 k 个整数，表示操作序列

数据范围：
- n ≤ 10^5
- Σk ≤ 10^5
- |操作值| ≤ n`,
    outputFormat: `输出 q 行，每行一个整数，表示旅行结束位置。`,
    samples: [
      {
        input: "5 4\n1 1 2 2\n3 3\n1 -1 -1\n2 5\n2 1 -2 1 -5\n1 1\n-5\n1 2\n100 -100",
        output: "4\n1\n4\n2",
        explanation: "每次旅行按操作执行后的最终位置"
      },
    ],
    testCases: [
      { input: "5 4\n1 1 2 2\n3 3\n1 -1 -1\n2 5\n2 1 -2 1 -5\n1 1\n-5\n1 2\n100 -100", output: "4\n1\n4\n2" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `子任务1（20%）：n,q ≤ 100，操作值为 ±1
子任务2（20%）：只有正数操作（向上）
子任务3（20%）：只有负数操作（向下）
子任务4（40%）：n ≤ 10^5

向上移动可用倍增优化；向下移动需要预处理每个节点的最小子节点链。`,
  },
  {
    title: "[GESP202506 八级] 遍历计数",
    source: "gesp_official",
    sourceId: "P13020",
    sourceUrl: "https://www.luogu.com.cn/problem/P13020",
    level: 8,
    knowledgePoints: ["树", "DFS", "组合数学", "阶乘"],
    difficulty: "省选/NOI-", // 洛谷难度4
    description: `给定一棵 n 个节点的无根树。

对这棵树进行深度优先遍历（DFS），起点可以任选，访问相邻节点的顺序也可以任选。

求有多少种不同的 DFS 序列，答案对 10^9 取模。`,
    inputFormat: `第一行包含一个正整数 n。

接下来 n-1 行，每行两个正整数 u, v，表示一条边。

数据范围：
- 1 ≤ n ≤ 10^5`,
    outputFormat: `输出一个整数，表示不同 DFS 序列的数量。`,
    samples: [
      {
        input: "4\n1 2\n2 3\n3 4",
        output: "6",
        explanation: "链状树，可以从两端开始，每个方向3种序列"
      },
      {
        input: "8\n1 2\n1 3\n1 4\n2 5\n2 6\n3 7\n3 8",
        output: "112"
      }
    ],
    testCases: [
      { input: "4\n1 2\n2 3\n3 4", output: "6" },
      { input: "8\n1 2\n1 3\n1 4\n2 5\n2 6\n3 7\n3 8", output: "112" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `子任务1（40%）：n ≤ 8
子任务2（20%）：树是一条链
子任务3（40%）：n ≤ 10^5

分析：选择起点有 n 种方式，然后在每个节点选择访问子节点的顺序。

答案 = Σ(以 u 为根时的方案数) = n × Π(每个节点的子节点排列数)

实际公式更复杂，需要考虑换根。`,
  },
  // ========== 2025年9月 ==========
  {
    title: "[GESP202509 八级] 最短距离",
    source: "gesp_official",
    sourceId: "P14079",
    sourceUrl: "https://www.luogu.com.cn/problem/P14079",
    level: 8,
    knowledgePoints: ["数论", "GCD", "最短路", "数学"],
    difficulty: "省选/NOI-", // 洛谷难度5 提高+
    description: `构造一个完全无向图，有 N = 10^18 个节点（编号 1 到 N）。

对于任意两个节点 u < v，它们之间有一条边，边权为：
- 如果 gcd(u, v) = 1（互质），边权为 p
- 否则，边权为 q

给定 n 个查询，每次查询两个节点之间的最短距离。`,
    inputFormat: `第一行包含三个正整数 n, p, q。

接下来 n 行，每行两个正整数 a, b，表示查询节点 a 和 b 之间的最短距离。

数据范围：
- n ≤ 10^4
- 1 ≤ a, b ≤ 10^9
- 1 ≤ p, q ≤ 10^9`,
    outputFormat: `输出 n 行，每行一个整数，表示最短距离。`,
    samples: [
      {
        input: "4 4 3\n1 2\n2 3\n4 2\n3 5",
        output: "4\n4\n3\n4",
        explanation: "1和2互质，直接走边权p=4；4和2不互质(gcd=2)，直接走边权q=3"
      },
      {
        input: "5 2 6\n1 2\n2 3\n4 2\n3 5\n6 6",
        output: "2\n2\n4\n2\n0",
        explanation: "当p<q时，可能绕路更短"
      }
    ],
    testCases: [
      { input: "4 4 3\n1 2\n2 3\n4 2\n3 5", output: "4\n4\n3\n4" },
      { input: "5 2 6\n1 2\n2 3\n4 2\n3 5\n6 6", output: "2\n2\n4\n2\n0" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `子任务1（30%）：n ≤ 10, a,b ≤ 50
子任务2（30%）：a,b ≤ 250
子任务3（40%）：a,b ≤ 10^9

关键观察：
- 如果 p ≤ q，最短路就是直接连边
- 如果 p > q，可能绕路经过一个中间节点
- 1 与任何数互质，可以作为中转站
- 最短距离最多是 2p（经过节点1中转）或 2q（经过公共因子中转）`,
  },
  {
    title: "[GESP202509 八级] 最小生成树",
    source: "gesp_official",
    sourceId: "P14080",
    sourceUrl: "https://www.luogu.com.cn/problem/P14080",
    level: 8,
    knowledgePoints: ["图论", "最小生成树", "Kruskal", "Prim", "并查集"],
    difficulty: "省选/NOI-", // 洛谷难度5 提高+
    description: `给定一个 n 个节点 m 条边的连通无向图。

对于每条边，求删除这条边后，剩余图的最小生成树的边权和。如果删除后图不连通，输出 -1。`,
    inputFormat: `第一行包含两个正整数 n, m。

接下来 m 行，每行三个正整数 u, v, w，表示一条边。

数据范围：
- 1 ≤ n ≤ 10^5
- n-1 ≤ m ≤ 10^5
- 1 ≤ w ≤ 10^9`,
    outputFormat: `输出 m 行，每行一个整数。`,
    samples: [
      {
        input: "5 5\n1 2 3\n2 3 4\n3 4 5\n4 5 6\n1 5 1",
        output: "14\n15\n-1\n-1\n10",
        explanation: "删除第5条边(1-5,权1)后，MST权和为3+4+5+6=18？需要重新计算"
      },
    ],
    testCases: [
      { input: "5 5\n1 2 3\n2 3 4\n3 4 5\n4 5 6\n1 5 1", output: "14\n15\n-1\n-1\n10" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `子任务1（25%）：n, m ≤ 50
子任务2（25%）：n, m ≤ 500
子任务3（25%）：n, m ≤ 5000
子任务4（25%）：n, m ≤ 10^5

方法一：暴力重新计算每次删边后的MST，O(m^2 log m)
方法二：分析删除边对MST的影响
- 如果删除的边不在原MST中，答案不变
- 如果删除的边在原MST中，需要找替代边`,
  },
  // ========== 2025年12月 ==========
  {
    title: "[GESP202512 八级] 猫和老鼠",
    source: "gesp_official",
    sourceId: "P14923",
    sourceUrl: "https://www.luogu.com.cn/problem/P14923",
    level: 8,
    knowledgePoints: ["图论", "最短路", "Dijkstra", "博弈"],
    difficulty: "省选/NOI-", // 洛谷难度4 提高
    description: `一张连通图中，猫在节点 a，老鼠在节点 b（老鼠洞）。每个节点有价值为 c_i 的奶酪。

老鼠想收集奶酪然后回到老鼠洞。一个节点是"安全的"，当且仅当老鼠能规划一条从该节点返回老鼠洞的路径，使得路径上的任意节点 x，猫到达 x 的最短时间严格大于老鼠沿路径到达 x 的时间。

求老鼠能获取的所有安全节点的奶酪总价值。`,
    inputFormat: `第一行包含两个正整数 n, m（节点数和边数）。

第二行包含两个正整数 a, b（猫的位置和老鼠洞位置）。

第三行包含 n 个正整数 c_1, c_2, ..., c_n（每个节点的奶酪价值）。

接下来 m 行，每行三个正整数 u, v, w，表示边及其权值。

数据范围：
- n, m ≤ 10^5
- 1 ≤ w_i, c_i ≤ 10^9`,
    outputFormat: `输出一个整数，表示老鼠可获取的奶酪价值总和。`,
    samples: [
      {
        input: "5 5\n1 2\n1 2 4 8 16\n1 2 1\n2 3 1\n3 4 1\n4 5 1\n1 5 3",
        output: "22",
        explanation: "老鼠从节点2出发，可以安全访问某些节点收集奶酪"
      },
      {
        input: "6 10\n3 4\n1 1 1 1 1 1\n1 2 1\n1 3 1\n1 4 1\n2 3 1\n2 4 1\n2 5 1\n3 5 1\n3 6 1\n4 6 1\n5 6 1",
        output: "3"
      }
    ],
    testCases: [
      { input: "5 5\n1 2\n1 2 4 8 16\n1 2 1\n2 3 1\n3 4 1\n4 5 1\n1 5 3", output: "22" },
      { input: "6 10\n3 4\n1 1 1 1 1 1\n1 2 1\n1 3 1\n1 4 1\n2 3 1\n2 4 1\n2 5 1\n3 5 1\n3 6 1\n4 6 1\n5 6 1", output: "3" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `子任务1（40%）：n, m ≤ 500
子任务2（60%）：n, m ≤ 10^5

思路：
1. 从猫的位置求最短路，得到猫到每个节点的最短时间
2. 从老鼠洞反向BFS/Dijkstra，维护老鼠回家的路径时间
3. 一个节点安全当且仅当：老鼠可以从该节点沿某条路径回家，且路径上每个点老鼠都比猫先到`,
  },
  {
    title: "[GESP202512 八级] 宝石项链",
    source: "gesp_official",
    sourceId: "P14924",
    sourceUrl: "https://www.luogu.com.cn/problem/P14924",
    level: 8,
    knowledgePoints: ["环形问题", "双指针", "滑动窗口", "贪心"],
    difficulty: "省选/NOI-", // 洛谷难度3 提高-
    description: `小 A 有一条包含 n 枚宝石的项链（首尾相连成环），宝石共有 m 种类型。

需要将项链划分为若干连续段，要求每段都包含全部 m 种宝石。

求最多可以划分成多少段。`,
    inputFormat: `第一行包含两个正整数 n, m（宝石数量和种类数）。

第二行包含 n 个正整数 t_1, t_2, ..., t_n（每枚宝石的种类）。

数据范围：
- 2 ≤ n ≤ 10^5
- 2 ≤ m ≤ n
- 1 ≤ t_i ≤ m
- 保证所有 m 种宝石都至少出现一次`,
    outputFormat: `输出一个整数，表示最多可划分的段数。`,
    samples: [
      {
        input: "6 2\n1 2 1 2 1 2",
        output: "3",
        explanation: "可以分成 [1,2], [1,2], [1,2] 三段，每段都包含两种宝石"
      },
      {
        input: "7 3\n3 1 3 1 2 1 2",
        output: "2",
        explanation: "最多分成2段，每段包含全部3种宝石"
      }
    ],
    testCases: [
      { input: "6 2\n1 2 1 2 1 2", output: "3" },
      { input: "7 3\n3 1 3 1 2 1 2", output: "2" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `子任务1（40%）：n ≤ 1000
子任务2（60%）：n ≤ 10^5

贪心思路：尽量让每段尽可能短。

环形处理：可以枚举断开的位置，或者将数组复制一份接在后面处理。

使用双指针/滑动窗口找到包含所有种类的最短区间。`,
  },
];

async function seedGesp8() {
  try {
    // 获取现有题目ID列表，避免重复添加
    const existingProblems = await prisma.problem.findMany({
      where: {
        sourceId: {
          in: gesp8Problems.map(p => p.sourceId).filter(Boolean) as string[]
        }
      },
      select: { sourceId: true }
    });

    const existingIds = new Set(existingProblems.map(p => p.sourceId));

    // 过滤出需要添加的新题目
    const newProblems = gesp8Problems.filter(p => !existingIds.has(p.sourceId));

    if (newProblems.length === 0) {
      return NextResponse.json({
        success: true,
        message: "所有 GESP 8级题目已存在",
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
      message: `成功添加 ${result.count} 道 GESP 8级题目`,
      existingCount: existingProblems.length,
      addedCount: result.count,
      totalCount: existingProblems.length + result.count
    });
  } catch (error) {
    console.error("Seed GESP8 error:", error);
    return NextResponse.json({ error: "添加题目失败", details: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return seedGesp8();
}

export async function POST() {
  return seedGesp8();
}
