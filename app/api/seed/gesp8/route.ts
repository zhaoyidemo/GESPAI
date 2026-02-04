import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GESP 8级完整题库 - 来源：洛谷 CCF GESP C++ 八级上机题
// 共20道题目
// 难度标签采用洛谷评级：
// - "easy" = 入门(1)/普及-(2)
// - "medium" = 普及/提高-(3)/普及+/提高(4)
// - "hard" = 提高+/省选-(5)及以上

const gesp8Problems = [
  // ========== GESP 样卷 ==========
  {
    title: "[GESP样题 八级] 区间",
    source: "gesp_official",
    sourceId: "P10288",
    sourceUrl: "https://www.luogu.com.cn/problem/P10288",
    level: 8,
    knowledgePoints: ["二分查找", "离线查询", "数组"],
    difficulty: "提高+/省选-",
    description: `小杨有一个包含 n 个正整数的序列 A。有 q 次查询，对于第 i 次查询，小杨给出 l_i, r_i, x_i，需要求出"x_i 在 A[l_i], A[l_i+1], ..., A[r_i] 中出现了多少次"。`,
    inputFormat: `第一行：一个正整数 T（测试用例数）

对于每个测试用例：
- 第一行：一个正整数 n（序列长度）
- 第二行：n 个正整数 A_1, A_2, ..., A_n
- 第三行：一个正整数 q（查询次数）
- 接下来 q 行：每行三个正整数 l_i, r_i, x_i`,
    outputFormat: `对于每个测试用例，输出 q 行，第 i 行包含一个非负整数，即第 i 次查询的答案。`,
    samples: [
      { input: "2\n5\n7 4 6 1 1\n2\n1 2 3\n1 5 1\n5\n1 2 3 4 5\n2\n5 5 3\n1 4 3", output: "0\n2\n0\n1" },
    ],
    testCases: [
      { input: "2\n5\n7 4 6 1 1\n2\n1 2 3\n1 5 1\n5\n1 2 3 4 5\n2\n5 5 3\n1 4 3", output: "0\n2\n0\n1" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `子任务 1（30分）：n, q ≤ 100, A_i ≤ 10。子任务 2（30分）：n, q ≤ 10^5, A_i ≤ 10^5。子任务 3（40分）：n, q ≤ 10^5, A_i ≤ 10^9。总体：1 ≤ T ≤ 5。`,
  },
  {
    title: "[GESP样题 八级] 小杨的旅游",
    source: "gesp_official",
    sourceId: "P10289",
    sourceUrl: "https://www.luogu.com.cn/problem/P10289",
    level: 8,
    knowledgePoints: ["树", "LCA", "BFS", "传送门"],
    difficulty: "提高+/省选-",
    description: `小杨打算在 B 国旅游。B 国有 n 个城市，编号为 1 到 n，通过 n-1 条双向道路连接，保证任意两个城市可以互相到达（即一棵树）。

小杨可以通过双向道路在城市之间旅行，每条道路耗时 1 个单位时间。B 国有 k 个城市设有传送门，小杨可以从任意一个有传送门的城市瞬间传送到任意另一个有传送门的城市。

小杨计划 q 次旅行。对于第 i 次旅行，求从城市 u_i 到城市 v_i 的最短时间。`,
    inputFormat: `第一行：三个整数 n, k, q（城市数、传送门城市数、旅行次数）

第 2 到第 n 行：每行两个整数 x_i, y_i，表示一条双向道路

第 n+1 行：k 个整数，表示有传送门的城市编号

第 n+2 到第 n+1+q 行：每行两个整数 u_i, v_i，表示一次旅行`,
    outputFormat: `输出 q 行，每行包含一个非负整数，表示对应旅行的最短时间。`,
    samples: [
      { input: "7 2 1\n5 7\n3 6\n2 3\n1 5\n5 4\n1 2\n7 4\n3 7", output: "4" },
      { input: "5 0 3\n2 3\n5 1\n5 2\n1 4\n4 5\n1 4\n4 3", output: "2\n1\n4" },
    ],
    testCases: [
      { input: "7 2 1\n5 7\n3 6\n2 3\n1 5\n5 4\n1 2\n7 4\n3 7", output: "4" },
      { input: "5 0 3\n2 3\n5 1\n5 2\n1 4\n4 5\n1 4\n4 3", output: "2\n1\n4" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `子任务 1（30分）：n ≤ 500, k ≤ 500, q ≤ 1。子任务 2（30分）：n ≤ 2×10^5, k = 0。子任务 3（40分）：n ≤ 2×10^5, k ≤ 2×10^5, q ≤ 2×10^5。`,
  },

  // ========== 2023年12月 ==========
  {
    title: "[GESP202312 八级] 奖品分配",
    source: "gesp_official",
    sourceId: "P10112",
    sourceUrl: "https://www.luogu.com.cn/problem/P10112",
    level: 8,
    knowledgePoints: ["组合数学", "多项式系数", "模运算"],
    difficulty: "提高+/省选-",
    description: `一个班有 N 个学生（编号 0 到 N-1）。有 M 种奖品需要分配，其中第 i 种奖品有 a_i 个（i=0,1,...,M-1）。奖品总数恰好等于 N 或 N+1（即每个学生恰好得到一个奖品，最多剩余一个）。

求每个学生恰好获得一种奖品的分配方案数。两种方案不同当且仅当存在某个学生在两种方案中获得的奖品类型不同。结果对 10^9+7 取模。`,
    inputFormat: `第一行：整数 T（测试用例数）

接下来 T 行：每行包含 N, M，后跟 M 个整数 a_0, a_1, ..., a_{M-1}

约束：N ≤ a_0 + a_1 + ... + a_{M-1} ≤ N+1`,
    outputFormat: `T 行，每行包含一个整数——分配方案数对 10^9+7 取模的结果。`,
    samples: [
      { input: "3\n3 2 1 2\n3 2 1 3\n5 3 1 3 1", output: "3\n4\n20" },
      { input: "5\n100 1 100\n100 1 101\n20 2 12 8\n123 4 80 20 21 3\n999 5 101 234 499 66 99", output: "1\n1\n125970\n895031747\n307187590" },
    ],
    testCases: [
      { input: "3\n3 2 1 2\n3 2 1 3\n5 3 1 3 1", output: "3\n4\n20" },
      { input: "5\n100 1 100\n100 1 101\n20 2 12 8\n123 4 80 20 21 3\n999 5 101 234 499 66 99", output: "1\n1\n125970\n895031747\n307187590" },
    ],
    timeLimit: 1000,
    memoryLimit: 524,
    hint: `30%: N ≤ 10。30%: M = 2。100%: N ≤ 1000, T ≤ 1000, M ≤ 1001。`,
  },
  {
    title: "[GESP202312 八级] 大量的工作沟通",
    source: "gesp_official",
    sourceId: "P10113",
    sourceUrl: "https://www.luogu.com.cn/problem/P10113",
    level: 8,
    knowledgePoints: ["树", "LCA", "最近公共祖先", "DFS"],
    difficulty: "提高+/省选-",
    description: `一个公司有 N 名员工，编号为 0 到 N-1。员工 0 是老板；其余每个员工恰好有一个直接上级。

公司的管理关系构成一棵树。对于 Q 次协作项目，需要找到一个能管理所有项目参与者的员工（即所有参与者的最近公共祖先 LCA）。`,
    inputFormat: `第一行：整数 N（员工数量）

第二行：N-1 个空格分隔的整数，表示 f_1, f_2, ..., f_{N-1}（每个员工的直接上级）

第三行：整数 Q（协作项目数量）

接下来 Q 行：每行先是一个整数 m（参与者数量），后跟 m 个员工编号`,
    outputFormat: `输出 Q 行，每行包含一个整数，表示每次协作对应的协调者编号。`,
    samples: [
      { input: "5\n0 0 2 2\n3\n2 3 4\n3 2 3 4\n2 1 4", output: "2\n2\n0" },
      { input: "7\n0 1 0 2 1 2\n5\n2 4 6\n2 4 5\n3 4 5 6\n4 2 4 5 6\n2 3 4", output: "2\n1\n1\n1\n0" },
    ],
    testCases: [
      { input: "5\n0 0 2 2\n3\n2 3 4\n3 2 3 4\n2 1 4", output: "2\n2\n0" },
      { input: "7\n0 1 0 2 1 2\n5\n2 4 6\n2 4 5\n3 4 5 6\n4 2 4 5 6\n2 3 4", output: "2\n1\n1\n1\n0" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `25%: N ≤ 50。50%: N ≤ 300。100%: 3 ≤ N ≤ 10^5, Q ≤ 100, m ≤ 10^4。`,
  },

  // ========== 2024年3月 ==========
  {
    title: "[GESP202403 八级] 公倍数问题",
    source: "gesp_official",
    sourceId: "P10263",
    sourceUrl: "https://www.luogu.com.cn/problem/P10263",
    level: 8,
    knowledgePoints: ["数论", "最小公倍数", "枚举因子", "容斥原理"],
    difficulty: "提高+/省选-",
    description: `小A写了一个 N × M 的矩阵 A，其中元素 A_{i,j} 等于 i 和 j 的最小公倍数（LCM）。给定 K 个朋友，第 k 个朋友想知道：矩阵中有多少个位置的值可能等于 k（记为 ans_k）。

各个朋友的回答互相独立，同一个位置可以同时满足多个朋友的条件。输出 Σ(k=1 到 K) k × ans_k 的值。`,
    inputFormat: `第一行三个正整数 N, M, K。`,
    outputFormat: `输出一行，即 Σ(k=1 到 K) k × ans_k。请注意，这个数可能很大，使用 long long 类型。`,
    samples: [
      { input: "2 5 2", output: "9" },
      { input: "100 100 100", output: "185233" },
    ],
    testCases: [
      { input: "2 5 2", output: "9" },
      { input: "100 100 100", output: "185233" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `30%: N, M, K ≤ 10。60%: N, M, K ≤ 500。100%: N, M ≤ 10^5, K ≤ 10^6。`,
  },
  {
    title: "[GESP202403 八级] 接竹竿",
    source: "gesp_official",
    sourceId: "P10264",
    sourceUrl: "https://www.luogu.com.cn/problem/P10264",
    level: 8,
    knowledgePoints: ["栈", "模拟", "区间查询", "预处理"],
    difficulty: "提高+/省选-",
    description: `玩家依次将卡牌放入队列末端。当放入的卡牌点数与队列中已有卡牌的点数相同时，该牌与匹配牌之间的所有卡牌（包括两张匹配牌）会被移出队列。

给定长度为 n 的卡牌序列 A，其中 A_i 表示第 i 张牌的点数。对于 q 次询问，每次给出范围 [l_i, r_i]，需要计算用这个范围内的卡牌按顺序玩游戏后，队列中剩余的牌数。`,
    inputFormat: `第一行：正整数 T（测试数据组数）。

对于每组数据：
- 第一行正整数 n（序列长度）
- 第二行 n 个正整数 A_1, ..., A_n（卡牌点数）
- 第三行正整数 q（询问次数）
- 后 q 行每行两个正整数 l_i, r_i（询问范围）`,
    outputFormat: `对于每组数据，输出 q 行。第 i 行输出一个非负整数，表示第 i 次询问的答案。`,
    samples: [
      { input: "1\n6\n1 2 2 3 1 3\n4\n1 3\n1 6\n1 5\n5 6", output: "1\n1\n0\n2" },
    ],
    testCases: [
      { input: "1\n6\n1 2 2 3 1 3\n4\n1 3\n1 6\n1 5\n5 6", output: "1\n1\n0\n2" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `子任务1 (30分): T≤5, n≤100, q≤100。子任务2 (30分): 所有右端点等于n。子任务3 (40分): T≤5, n≤1.5×10^4, q≤1.5×10^4, 1≤A_i≤13。`,
  },

  // ========== 2024年6月 ==========
  {
    title: "[GESP202406 八级] 最远点对",
    source: "gesp_official",
    sourceId: "P10725",
    sourceUrl: "https://www.luogu.com.cn/problem/P10725",
    level: 8,
    knowledgePoints: ["树", "BFS", "DFS", "树的直径"],
    difficulty: "提高+/省选-",
    description: `小杨有一棵包含 n 个节点的树，树上的任意一个节点要么是白色，要么是黑色。小杨想知道相距最远的一对不同颜色节点的距离是多少。`,
    inputFormat: `第一行包含一个正整数 n，代表树的节点数。

第二行包含 n 个非负整数 a_1, a_2, ..., a_n（a_i=0 表示白色，a_i=1 表示黑色）。

之后 n-1 行，每行两个正整数 x_i, y_i，表示一条边。保证树中存在不同颜色的点。`,
    outputFormat: `输出一个整数，代表相距最远的一对不同颜色节点的距离。`,
    samples: [
      { input: "5\n0 1 0 1 0\n1 2\n1 3\n3 4\n3 5", output: "3" },
    ],
    testCases: [
      { input: "5\n0 1 0 1 0\n1 2\n1 3\n3 4\n3 5", output: "3" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `相距最远的不同颜色的一对节点为节点 2 和节点 5，距离为 3。约束：1 ≤ n ≤ 10^5。`,
  },
  {
    title: "[GESP202406 八级] 空间跳跃",
    source: "gesp_official",
    sourceId: "P10726",
    sourceUrl: "https://www.luogu.com.cn/problem/P10726",
    level: 8,
    knowledgePoints: ["图论", "最短路径", "建图", "模拟"],
    difficulty: "提高+/省选-",
    description: `小杨在二维空间中有 n 个互不重叠的水平平台。平台 i 的高度为 h_i，左端点为 l_i，右端点为 r_i。

小杨可以在平台上左右移动。当走到右端点继续向右移动时，会垂直下落到下方第一个平台上；走到左端点继续向左移动时同理。

时间开销：水平移动 1 个单位或垂直下落 1 个单位均为 1 个单位时间。

求从平台 s 的左端点出发，到达平台 t 所需的最短时间。若无法到达，输出 -1。`,
    inputFormat: `第 1 行：整数 n（平台数量）

第 2 行：两个整数 s, t（起始平台和目标平台）

第 3 到第 n+2 行：三个整数 l_i, r_i, h_i（平台 i 的左端点、右端点、高度）`,
    outputFormat: `输出一个整数，表示最短时间。若无法到达输出 -1。`,
    samples: [
      { input: "3\n3 1\n5 6 3\n3 5 6\n1 4 100000", output: "100001" },
    ],
    testCases: [
      { input: "3\n3 1\n5 6 3\n3 5 6\n1 4 100000", output: "100001" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `约束：1 ≤ n ≤ 1000, 1 ≤ l_i ≤ r_i ≤ 10^5, 1 ≤ h_i ≤ 10^5。`,
  },

  // ========== 2024年9月 ==========
  {
    title: "[GESP202409 八级] 手套配对",
    source: "gesp_official",
    sourceId: "P11250",
    sourceUrl: "https://www.luogu.com.cn/problem/P11250",
    level: 8,
    knowledgePoints: ["组合数学", "容斥原理", "模运算"],
    difficulty: "提高+/省选-",
    description: `小杨有 n 双不同的手套，每双手套由一只左手手套和一只右手手套组成。小杨想知道从中选出 m 只手套，使得恰好组成 k 双完整手套的方案数。

两个选择方案不同，当且仅当它们包含不同的手套（同一双的左手和右手手套视为不同的手套）。答案对 10^9 + 7 取模。`,
    inputFormat: `多组测试数据。

第 1 行：整数 t（测试用例数）

每组测试用例一行：三个整数 n, m, k`,
    outputFormat: `每组测试用例输出一行，一个整数：方案数对 10^9 + 7 取模的结果。`,
    samples: [
      { input: "2\n5 6 2\n5 1 5", output: "120\n0" },
    ],
    testCases: [
      { input: "2\n5 6 2\n5 1 5", output: "120\n0" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `约束：1 ≤ t ≤ 10^5, 1 ≤ n ≤ 1000, 1 ≤ m ≤ 2n, 1 ≤ k ≤ n。`,
  },
  {
    title: "[GESP202409 八级] 美丽路径",
    source: "gesp_official",
    sourceId: "P11251",
    sourceUrl: "https://www.luogu.com.cn/problem/P11251",
    level: 8,
    knowledgePoints: ["树", "树形DP", "路径问题"],
    difficulty: "提高+/省选-",
    description: `小杨有一棵包含 n 个节点的树，节点从 1 到 n 编号，每个节点为白色或黑色。对于树上的简单路径，若路径上相邻节点颜色均不相同，则称为美丽路径。路径长度定义为路径包含的节点数量。

求最长美丽路径的长度。`,
    inputFormat: `第一行：正整数 n（节点数量）。

第二行：n 个整数 c_1, c_2, ..., c_n（颜色，c_i=0 表示白色，c_i=1 表示黑色）。

后 n-1 行：每行两个正整数 u_i, v_i（表示边的连接）。`,
    outputFormat: `输出一个整数，代表最长美丽路径的长度。`,
    samples: [
      { input: "5\n1 0 0 1 0\n1 2\n3 5\n4 3\n1 3", output: "4" },
      { input: "5\n0 0 0 0 0\n1 2\n2 3\n3 4\n4 5", output: "1" },
    ],
    testCases: [
      { input: "5\n1 0 0 1 0\n1 2\n3 5\n4 3\n1 3", output: "4" },
      { input: "5\n0 0 0 0 0\n1 2\n2 3\n3 4\n4 5", output: "1" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `样例1中最长美丽路径为 2→1→3→4（颜色 0→1→0→1），长度为4。约束：1 ≤ n ≤ 10^5。`,
  },

  // ========== 2024年12月 ==========
  {
    title: "[GESP202412 八级] 树上移动",
    source: "gesp_official",
    sourceId: "P11379",
    sourceUrl: "https://www.luogu.com.cn/problem/P11379",
    level: 8,
    knowledgePoints: ["树", "DFS", "树形DP", "路径"],
    difficulty: "提高+/省选-",
    description: `小杨有一棵 n 个节点的树（编号 1 到 n），每个节点被染成白色(0)或黑色(1)。小杨可以选择任意两个节点 s 和 t，从 s 移动到 t，不重复经过任何节点。

目标是在经过不超过 k 个黑色节点的情况下，最大化经过的节点总数。`,
    inputFormat: `第一行：两个正整数 n, k（节点数和允许经过的最大黑色节点数）

第二行：n 个整数 a_1, a_2, ..., a_n 表示节点颜色（0=白色，1=黑色）

第 3 到 n+1 行：每行两个整数 u_i, v_i 表示一条边`,
    outputFormat: `一个正整数，表示最多能经过的节点数。`,
    samples: [
      { input: "5 1\n0 0 1 1 1\n1 2\n2 3\n2 5\n1 4", output: "3" },
    ],
    testCases: [
      { input: "5 1\n0 0 1 1 1\n1 2\n2 3\n2 5\n1 4", output: "3" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `子任务1（20%）：n≤100, 树是链。子任务2（20%）：n≤1000, k=0。子任务3（60%）：n≤1000, k≤1000。`,
  },
  {
    title: "[GESP202412 八级] 排队",
    source: "gesp_official",
    sourceId: "P11380",
    sourceUrl: "https://www.luogu.com.cn/problem/P11380",
    level: 8,
    knowledgePoints: ["排列组合", "拓扑排序", "组合数学", "模运算"],
    difficulty: "提高+/省选-",
    description: `有 n 个学生编号 1, 2, ..., n，需要排成一列队伍。其中有 m 对关系约束，每对约束 (a_i, b_i) 表示学生 a_i 必须直接排在学生 b_i 前面（即两人必须相邻且 a_i 在 b_i 之前）。

求满足所有约束的合法排列数，答案对 10^9 + 7 取模。`,
    inputFormat: `第一行：两个整数 n, m（学生数和关系约束数）

接下来 m 行：每行两个整数 a_i, b_i（表示一对约束关系）`,
    outputFormat: `一个整数，表示合法排列数对 10^9 + 7 取模的结果。`,
    samples: [
      { input: "4 2\n1 3\n2 4", output: "2" },
      { input: "3 0", output: "6" },
      { input: "3 2\n1 2\n2 1", output: "0" },
    ],
    testCases: [
      { input: "4 2\n1 3\n2 4", output: "2" },
      { input: "3 0", output: "6" },
      { input: "3 2\n1 2\n2 1", output: "0" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `样例1：4个学生，约束(1,3)和(2,4)，合法排列有2种。样例3：约束形成环，无合法排列。约束：1 ≤ n ≤ 2×10^5, 0 ≤ m ≤ 2×10^5。`,
  },

  // ========== 2025年3月 ==========
  {
    title: "[GESP202503 八级] 上学",
    source: "gesp_official",
    sourceId: "P11966",
    sourceUrl: "https://www.luogu.com.cn/problem/P11966",
    level: 8,
    knowledgePoints: ["图论", "最短路径", "Dijkstra"],
    difficulty: "提高+/省选-",
    description: `城市 C 表示为一个有 n 个节点和 m 条边的无向图。节点编号为 1 到 n，每条边连接节点 u_i 和 v_i，长度为 l_i 米。

小 A 的学校在节点 s。q 个同学分别住在不同的节点，步行速度为 1 米/秒。求每位同学从家到学校的最短时间。`,
    inputFormat: `第 1 行：四个整数 n, m, s, q — 节点数、边数、学校位置、同学数量

接下来 m 行：三个整数 u_i, v_i, l_i — 一条长度为 l_i 的无向边

接下来 q 行：一个整数 h_i — 第 i 个同学的住所节点`,
    outputFormat: `输出 q 行，每行一个整数，表示对应同学从家到学校的最短时间（秒）。`,
    samples: [
      { input: "5 5 3 3\n1 2 3\n2 3 2\n3 4 1\n4 5 3\n1 4 2\n5\n1\n4", output: "4\n3\n1" },
    ],
    testCases: [
      { input: "5 5 3 3\n1 2 3\n2 3 2\n3 4 1\n4 5 3\n1 4 2\n5\n1\n4", output: "4\n3\n1" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `20%: q = 1。另20%: n ≤ 500, m ≤ 500。100%: 1 ≤ n, m, q ≤ 2×10^5, 1 ≤ l_i ≤ 10^6。`,
  },
  {
    title: "[GESP202503 八级] 割裂",
    source: "gesp_official",
    sourceId: "P11967",
    sourceUrl: "https://www.luogu.com.cn/problem/P11967",
    level: 8,
    knowledgePoints: ["树", "LCA", "树上差分", "连通性"],
    difficulty: "省选-/NOI-",
    description: `小杨有一棵 n 个节点的树（编号 1 到 n）。他定义了 a 对"好对"和一对"坏对"。

一个节点可以被删除，当且仅当：
1. 删除后所有"好对"仍然连通
2. 删除后"坏对"变得不连通

（如果一对中的任一节点被删除，则该对视为不连通。）

求可以被删除的节点数量。`,
    inputFormat: `第一行：两个非负整数 n 和 a

第 2 到第 n 行：每行两个整数 x_i, y_i 表示树边

接下来 a 行：每行两个整数 u_i, v_i 表示一对"好对"

最后一行：两个整数 b_u, b_v 表示"坏对"`,
    outputFormat: `一个非负整数，表示可以删除的节点数量。`,
    samples: [
      { input: "6 2\n1 3\n1 5\n3 6\n3 2\n5 4\n5 4\n5 3\n2 6", output: "2" },
    ],
    testCases: [
      { input: "6 2\n1 3\n1 5\n3 6\n3 2\n5 4\n5 4\n5 3\n2 6", output: "2" },
    ],
    timeLimit: 4000,
    memoryLimit: 512,
    hint: `子任务1（20分）：n=10, a=0。子任务2（20分）：n≤100, a≤100。子任务3（60分）：n≤10^6, a≤10^5。`,
  },

  // ========== 2025年6月 ==========
  {
    title: "[GESP202506 八级] 树上旅行",
    source: "gesp_official",
    sourceId: "P13019",
    sourceUrl: "https://www.luogu.com.cn/problem/P13019",
    level: 8,
    knowledgePoints: ["树", "DFS", "倍增", "模拟"],
    difficulty: "提高+/省选-",
    description: `给定一棵以节点 1 为根的 n 个节点的有根树，节点编号为 1 到 n。A 计划在这棵树上进行 q 次旅行。第 i 次旅行从节点 s_i 出发，执行一系列移动操作。

移动操作有两种类型：
1. 移动到父节点（若已在根节点则不动）
2. 移动到最小编号子节点（若在叶子节点则不动）

移动操作以序列形式编码：正值表示类型1的移动次数，负值表示类型2的移动次数。`,
    inputFormat: `第 1 行：两个整数 n, q（节点数和旅行次数）

第 2 行：n-1 个整数 p_2, p_3, ..., p_n（每个节点的父节点）

对于每次旅行 i：
- 两个整数 s_i, k_i（起始节点和操作序列长度）
- k_i 个整数（移动序列）`,
    outputFormat: `输出 q 行，每行包含第 i 次旅行结束时所在的节点编号。`,
    samples: [
      { input: "5 4\n1 1 2 2\n3 3\n1 -1 -1\n2 5\n1 -1 1 -1 1\n5 8\n1 1 1 -1 -1 -1 -1 -1\n5 3\n-1 -1 1", output: "4\n1\n4\n2" },
      { input: "8 3\n5 4 2 1 3 6 6\n8 1\n8\n8 2\n8 -8\n8 3\n8 -8 8", output: "1\n7\n1" },
    ],
    testCases: [
      { input: "5 4\n1 1 2 2\n3 3\n1 -1 -1\n2 5\n1 -1 1 -1 1\n5 8\n1 1 1 -1 -1 -1 -1 -1\n5 3\n-1 -1 1", output: "4\n1\n4\n2" },
      { input: "8 3\n5 4 2 1 3 6 6\n8 1\n8\n8 2\n8 -8\n8 3\n8 -8 8", output: "1\n7\n1" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `约束：1 ≤ n ≤ 10^5, 1 ≤ q ≤ 2×10^4, Σk_i ≤ 10^5。`,
  },
  {
    title: "[GESP202506 八级] 遍历计数",
    source: "gesp_official",
    sourceId: "P13020",
    sourceUrl: "https://www.luogu.com.cn/problem/P13020",
    level: 8,
    knowledgePoints: ["树", "DFS", "组合数学", "阶乘"],
    difficulty: "提高+/省选-",
    description: `给定一棵 n 个节点的树 T，节点编号为 1 到 n。通过以下过程生成深度优先遍历序列：

1. 选择任意一个起始节点 s（1 ≤ s ≤ n）
2. 从当前节点出发，如果存在未访问的相邻节点，则移动到其中一个；否则回溯
3. 按访问顺序记录节点，形成一个 DFS 序列

起始节点的选择和访问相邻节点的顺序都是任意的，因此同一棵树可以产生多种不同的 DFS 序列。任务是计算所有不同的 DFS 序列的数量。答案对 10^9 取模。`,
    inputFormat: `第 1 行：整数 n（节点数）

第 2 到第 n 行：每行两个整数 u_i, v_i，表示树的一条边`,
    outputFormat: `一个整数：不同 DFS 序列的数量，对 10^9 取模。`,
    samples: [
      { input: "4\n1 2\n2 3\n3 4", output: "6" },
      { input: "8\n1 2\n1 3\n1 4\n2 5\n2 6\n3 7\n3 8", output: "112" },
    ],
    testCases: [
      { input: "4\n1 2\n2 3\n3 4", output: "6" },
      { input: "8\n1 2\n1 3\n1 4\n2 5\n2 6\n3 7\n3 8", output: "112" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `40%: 1 ≤ n ≤ 8。20%: 树是一条链。100%: 1 ≤ n ≤ 10^5。`,
  },

  // ========== 2025年9月 ==========
  {
    title: "[GESP202509 八级] 最短距离",
    source: "gesp_official",
    sourceId: "P14079",
    sourceUrl: "https://www.luogu.com.cn/problem/P14079",
    level: 8,
    knowledgePoints: ["数论", "GCD", "最短路径", "图论"],
    difficulty: "省选-/NOI-",
    description: `给定正整数 p, q 和常数 N = 10^18，构造一个包含 N 个节点的带权无向图，节点编号为 1 到 N。对于任意满足 1 ≤ u < v ≤ N 的节点对，在节点 u 和 v 之间添加一条边，边权为：
- p，若 gcd(u, v) = 1（互素）
- q，若 gcd(u, v) > 1（不互素）

回答 n 个查询，每个查询询问节点 a_i 和 b_i 之间的最短距离。`,
    inputFormat: `第 1 行：三个正整数 n, p, q（查询数、互素边权、非互素边权）

接下来 n 行：每行两个正整数 a_i, b_i（查询的节点对）`,
    outputFormat: `输出 n 行，每行一个整数，表示 a_i 和 b_i 之间的最短距离。`,
    samples: [
      { input: "4 4 3\n1 2\n2 3\n4 2\n3 5", output: "4\n4\n3\n4" },
      { input: "5 2 6\n1 2\n2 3\n4 2\n3 5\n6 6", output: "2\n2\n4\n2\n0" },
    ],
    testCases: [
      { input: "4 4 3\n1 2\n2 3\n4 2\n3 5", output: "4\n4\n3\n4" },
      { input: "5 2 6\n1 2\n2 3\n4 2\n3 5\n6 6", output: "2\n2\n4\n2\n0" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `30%: 1 ≤ n ≤ 10, 1 ≤ a_i, b_i ≤ 50。另30%: 1 ≤ a_i, b_i ≤ 250。100%: 1 ≤ n ≤ 10^4, 1 ≤ a_i, b_i ≤ 10^9, 1 ≤ p, q ≤ 10^9。`,
  },
  {
    title: "[GESP202509 八级] 最小生成树",
    source: "gesp_official",
    sourceId: "P14080",
    sourceUrl: "https://www.luogu.com.cn/problem/P14080",
    level: 8,
    knowledgePoints: ["最小生成树", "Kruskal", "图论", "并查集"],
    difficulty: "提高+/省选-",
    description: `给定一个包含 n 个节点和 m 条边的带权连通无向图，节点编号为 1 到 n，第 i 条边连接节点 u_i 和 v_i，边权为 w_i。

对于每条边，求删除该边后图的最小生成树的所有边权之和。如果删除某条边后不存在最小生成树，则输出 -1。`,
    inputFormat: `第 1 行：两个整数 n, m（节点数和边数）

第 2 到第 m+1 行：每行三个整数 u_i, v_i, w_i`,
    outputFormat: `输出 m 行。第 i 行包含一个整数，表示删除第 i 条边后最小生成树的边权之和，若不存在则输出 -1。`,
    samples: [
      { input: "5 5\n1 2 4\n2 3 3\n3 4 1\n2 5 2\n3 1 8", output: "14\n15\n-1\n-1\n10" },
      { input: "6 10\n1 2 6\n2 3 3\n3 1 4\n3 4 5\n4 5 8\n5 6 2\n6 4 1\n3 2 4\n5 4 4\n3 3 6", output: "15\n16\n17\n-1\n15\n17\n18\n15\n15\n15" },
    ],
    testCases: [
      { input: "5 5\n1 2 4\n2 3 3\n3 4 1\n2 5 2\n3 1 8", output: "14\n15\n-1\n-1\n10" },
      { input: "6 10\n1 2 6\n2 3 3\n3 1 4\n3 4 5\n4 5 8\n5 6 2\n6 4 1\n3 2 4\n5 4 4\n3 3 6", output: "15\n16\n17\n-1\n15\n17\n18\n15\n15\n15" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `约束：1 ≤ n ≤ 10^5, 1 ≤ m ≤ 10^5, 1 ≤ w_i ≤ 10^9。`,
  },

  // ========== 2025年12月 ==========
  {
    title: "[GESP202512 八级] 猫和老鼠",
    source: "gesp_official",
    sourceId: "P14923",
    sourceUrl: "https://www.luogu.com.cn/problem/P14923",
    level: 8,
    knowledgePoints: ["图论", "最短路径", "Dijkstra", "博弈"],
    difficulty: "提高+/省选-",
    description: `猫和老鼠居住的庄园被建模为一个有 n 个节点和 m 条带权无向边的连通图。节点 i 上有价值为 c_i 的奶酪。猫的巢穴在节点 a；老鼠的洞穴在节点 b。

安全的定义：节点 u 对老鼠来说是安全的，当且仅当老鼠能规划一条从 u 到老鼠洞穴的路径，使得对于该路径上的每一个节点 x，猫从 a 到 x 的最短时间严格大于老鼠沿规划路径从 u 到 x 的时间。

老鼠只从安全节点收集奶酪。计算老鼠能收集到的奶酪总价值。`,
    inputFormat: `第一行：两个正整数 n, m（节点数和边数）

第二行：两个正整数 a, b（猫的节点、老鼠洞穴节点）

第三行：n 个正整数 c_1, ..., c_n（每个节点的奶酪价值）

接下来 m 行：每行三个正整数 u_i, v_i, w_i（边及其权重）`,
    outputFormat: `一个整数：老鼠能从安全节点收集到的奶酪总价值。`,
    samples: [
      { input: "5 5\n1 2\n1 2 4 8 16\n1 2 4\n2 3 3\n3 4 1\n2 5 2\n3 1 8", output: "22" },
      { input: "6 10\n3 4\n1 1 1 1 1 1\n1 2 6\n2 3 3\n3 1 4\n3 4 5\n4 5 8\n5 6 2\n6 4 1\n3 2 4\n5 4 4\n3 3 6", output: "3" },
    ],
    testCases: [
      { input: "5 5\n1 2\n1 2 4 8 16\n1 2 4\n2 3 3\n3 4 1\n2 5 2\n3 1 8", output: "22" },
      { input: "6 10\n3 4\n1 1 1 1 1 1\n1 2 6\n2 3 3\n3 1 4\n3 4 5\n4 5 8\n5 6 2\n6 4 1\n3 2 4\n5 4 4\n3 3 6", output: "3" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `40%: n, m ≤ 500。100%: 1 ≤ n, m ≤ 10^5, 1 ≤ w_i, c_i ≤ 10^9。`,
  },
  {
    title: "[GESP202512 八级] 宝石项链",
    source: "gesp_official",
    sourceId: "P14924",
    sourceUrl: "https://www.luogu.com.cn/problem/P14924",
    level: 8,
    knowledgePoints: ["贪心", "双指针", "环形问题", "二分"],
    difficulty: "提高+/省选-",
    description: `小明拥有一条包含 n 颗宝石的项链，宝石按顺序编号为 1 到 n，排列在项链上，其中宝石 n 与宝石 1 相邻（环形结构）。项链共有 m 种不同的宝石类型，宝石 i 的类型为 t_i。

小明想把项链分给朋友们，方法是将其分成若干连续的段，要求每一段都包含所有 m 种宝石类型。求在满足约束条件下，最多能分成多少段。`,
    inputFormat: `第一行：两个正整数 n, m — 宝石数量和不同类型数量

第二行：n 个正整数 t_1, t_2, ..., t_n — 每颗宝石的类型`,
    outputFormat: `一个整数，表示项链最多能被分成的段数。`,
    samples: [
      { input: "6 2\n1 2 1 2 1 2", output: "3" },
      { input: "7 3\n3 1 3 1 2 1 2", output: "2" },
    ],
    testCases: [
      { input: "6 2\n1 2 1 2 1 2", output: "3" },
      { input: "7 3\n3 1 3 1 2 1 2", output: "2" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `40%: 2 ≤ n ≤ 1000。100%: 2 ≤ n ≤ 10^5, 2 ≤ m ≤ n, 所有类型至少出现一次。`,
  },
];

async function seedGesp8() {
  try {
    // 删除现有的GESP8题目，重新导入
    await prisma.problem.deleteMany({
      where: {
        sourceId: {
          in: gesp8Problems.map(p => p.sourceId).filter(Boolean) as string[]
        }
      }
    });

    // 添加所有题目
    const result = await prisma.problem.createMany({
      data: gesp8Problems,
    });

    return NextResponse.json({
      success: true,
      message: `成功导入 ${result.count} 道 GESP 8级题目`,
      count: result.count
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
