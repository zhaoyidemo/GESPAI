import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GESP 7级完整题库 - 来源：洛谷 CCF GESP C++ 七级上机题
// 官方题单：https://www.luogu.com.cn/training/557
// 所有内容与洛谷100%一致

const gesp7Problems = [
  // ========== 样题 ==========
  {
    title: "[GESP样题 七级] 迷宫统计",
    source: "gesp_official",
    sourceId: "P10265",
    sourceUrl: "https://www.luogu.com.cn/problem/P10265",
    level: 7,
    knowledgePoints: ["图论", "邻接矩阵", "模拟"],
    difficulty: "普及-",
    description: `在神秘的幻想大陆中，存在着 $n$ 个古老而神奇的迷宫，迷宫编号从 $1$ 到 $n$。有的迷宫之间可以直接往返，有的可以走到别的迷宫，但是不能走回来。玩家小杨想挑战一下不同的迷宫，他决定从 $m$ 号迷宫出发。现在，他需要你帮助他统计：有多少迷宫可以直接到达 $m$ 号迷宫，$m$ 号迷宫可以直接到达其他的迷宫有多少，并求出他们的和。

需要注意的是，对于 $i$ ($1 \\leq i \\leq n$) 号迷宫，它总可以直接到达自身。`,
    inputFormat: `第一行两个整数 $n$ 和 $m$，分别表示结点迷宫总数，指定出发迷宫的编号。

下面 $n$ 行，每行 $n$ 个整数，表示迷宫之间的关系。对于第 $i$ 行第 $j$ 列的整数，$1$ 表示能从 $i$ 号迷宫直接到达 $j$ 号迷宫，$0$ 表示不能直接到达。`,
    outputFormat: `一行输出空格分隔的三个整数，分别表示迷宫 $m$ 可以直接到达其他的迷宫有多少个，有多少迷宫可以直接到达 $m$ 号迷宫，这些迷宫的总和。`,
    samples: [
      { input: `6 4\n1 1 0 1 0 0\n0 1 1 0 0 0\n1 0 1 0 0 1\n0 0 1 1 0 1\n0 0 0 1 1 0\n1 0 0 0 1 1`, output: `3 3 6` },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `### 样例 1 解释

$4$ 号迷宫能直接到达的迷宫有 $3,4,6$ 号迷宫，共 $3$ 个。
能直接到达 $4$ 号迷宫的迷宫有 $1,4,5$ 号迷宫，共 $3$ 个。

共 6 个。

### 数据规模与约定

| 子任务| 分值 | $n \\leq $ |
| :-: | :-: | :-: |
| $1$ | $30$ | $10$ |
| $2$ | $30$ | $100$ |
| $3$ | $40$ | $1000$ |

对全部的测试数据，保证 $1 \\leq m \\leq n \\leq 1000$。`,
  },
  {
    title: "[GESP样题 七级] 最长不下降子序列",
    source: "gesp_official",
    sourceId: "P10287",
    sourceUrl: "https://www.luogu.com.cn/problem/P10287",
    level: 7,
    knowledgePoints: ["图论", "DAG", "动态规划", "最长不下降子序列", "拓扑排序"],
    difficulty: "普及/提高-",
    description: `小杨有个包含 $n$ 个节点 $m$ 条边的有向无环图，其中节点的编号为 $1$ 到 $n$。

对于编号为 $i$ 的节点，其权值为 $A_i$。对于图中的一条路径，根据路径上的经过节点的先后顺序可以得到一个节点权值的序列，小杨想知道图中所有可能序列中最长不下降子序列的最大长度。

注：给定一个序列 $S$，其最长不下降子序列 $S'$ 是原序列中的如下子序列：整个子序列 $S'$ 单调不降，并且是序列中最长的单调不降子序列。例如，给定序列 $S = [11,12,13,9,8,17,19]$，其最长不下降子序列为 $S'=[11,12,13,17,19]$，长度为 $5$。`,
    inputFormat: `第一行包含两个正整数 $n,m$，表示节点数和边数。

第二行包含 $n$ 个正整数 $A_1, A_2, \\dots A_n$，表示节点 $1$ 到 $n$ 的点权。

之后 $m$ 行每行包含两个正整数 $u_i, v_i$，表示第 $i$ 条边连接节点 $u_i$ 和 $v_i$，方向为从 $u_i$ 到 $v_i$。`,
    outputFormat: `输出一行一个整数表示答案。`,
    samples: [
      { input: `5 4\n2 10 6 3 1\n5 2\n2 3\n3 1\n1 4`, output: `3` },
      { input: `6 11\n1 1 2 1 1 2\n3 2\n3 1\n5 3\n4 2\n2 6\n3 6\n1 6\n4 6\n1 2\n5 1\n5 4`, output: `4` },
      { input: `6 11\n5 9 10 5 1 6\n5 4\n5 2\n4 2\n3 1\n5 3\n6 1\n4 1\n4 3\n5 1\n2 3\n2 1`, output: `4` },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `### 数据规模与约定

| 子任务 | 分值 | $n\\le$ | $A_i \\le$ | 特殊约定 |
| :-: | :-: | :-: | :-: | :-:|
| $1$ | $30$ | $10^3$ | $10$ | 输入的图是一条链 |
| $2$ | $30$ | $10^5$ | $2$ | 无 |
| $3$ | $40$ | $10^5$ | $10$ | 无|

对全部的测试数据，保证 $1 \\leq n \\leq 10^5$，$1 \\leq m \\leq 10^5$，$1 \\leq A_i \\leq 10$。`,
  },
  // ========== 2023年12月 ==========
  {
    title: "[GESP202312 七级] 商品交易",
    source: "gesp_official",
    sourceId: "P10110",
    sourceUrl: "https://www.luogu.com.cn/problem/P10110",
    level: 7,
    knowledgePoints: ["图论", "最短路", "Dijkstra"],
    difficulty: "普及/提高-",
    description: `市场上共有 $N$ 种商品，编号从 $0$ 至 $N-1$ ，其中，第 $i$ 种商品价值 $v_i$ 元。

现在共有 $M$ 个商人，编号从 $0$ 至 $M-1$ 。在第 $j$ 个商人这，你可以使用你手上的第 $x_j$ 种商品交换商人手上的第 $y_j$ 种商品。每个商人都会按照商品价值进行交易，具体来说，如果 $v_{x_j}>v_{y_j}$，他将会付给你 $v_{x_j}-v_{y_j}$元钱；否则，那么你需要付给商人 $v_{y_j}-v_{x_j}$ 元钱。除此之外，每次交易商人还会收取 $1$ 元作为手续费，不论交易商品的价值孰高孰低。

你现在拥有商品 $a$ ，并希望通过一些交换来获得商品 $b$ 。请问你至少要花费多少钱？（当然，这个最小花费也可能是负数，这表示你可以在完成目标的同时赚取一些钱。）`,
    inputFormat: `第一行四个整数 $N , M , a , b$，分别表示商品的数量、商人的数量、你持有的商品以及你希望获得的商品。保证 $0 \\le a,b < N$ ，保证 $a \\ne b$。

第二行 $N$ 个用单个空格隔开的正整数 $v_0,v_1,\\ldots,v_{N-1}$ ，依次表示每种商品的价值。保证 $1 \\le v_i \\le 10^9$。

接下来 $M$ 行，每行两个整数 $x_j,y_j$ ，表示在第 $j$ 个商人这，你可以使用第 $x_j$ 种商品交换第 $y_j$ 种商品。保证 $0 \\le x_j,y_j < N$，保证 $x_j \\ne y_j$ 。`,
    outputFormat: `输出一行一个整数，表示最少的花费。特别地，如果无法通过交换换取商品 $b$ ，请输出 \`No solution\`。`,
    samples: [
      { input: `3 5 0 2\n1 2 4\n1 0\n2 0\n0 1\n2 1\n1 2`, output: `5` },
      { input: `3 3 0 2\n100 2 4\n0 1\n1 2\n0 2`, output: `-95` },
      { input: `4 4 3 0\n1 2 3 4\n1 0\n0 1\n3 2\n2 3`, output: `No solution` },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `**数据范围**

对于 30% 的测试点，保证 $N ≤ 10$，$M ≤ 20$。

对于 70% 的测试点，保证 $N ≤10^3$，$M≤10^4$。

对于 100% 的测试点，保证 $N≤10^5$，$M≤2×10^5$。`,
  },
  {
    title: "[GESP202312 七级] 纸牌游戏",
    source: "gesp_official",
    sourceId: "P10111",
    sourceUrl: "https://www.luogu.com.cn/problem/P10111",
    level: 7,
    knowledgePoints: ["动态规划", "博弈", "枚举"],
    difficulty: "普及/提高-",
    description: `你和小杨在玩一个纸牌游戏。

你和小杨各有 $3$ 张牌，分别是 $0、1、2$。你们要进行 $N$ 轮游戏，每轮游戏双方都要出一张牌，并按 $1$ 战胜 $0$，$2$ 战胜 $1$，$0$ 战胜 $2$ 的规则决出胜负。第 $i$ 轮的胜者可以获得 $2 \\times a_i$ 分，败者不得分，如果双方出牌相同，则算平局，二人都可获得 $a_i$ 分 $(i=1,2,\\cdots,N)$。

玩了一会后，你们觉得这样太过于单调，于是双方给自己制定了不同的新规则。小杨会在整局游戏开始前确定自己全部 $n$ 轮的出牌，并将他的全部计划告诉你；而你从第 $2$ 轮开始，要么继续出上一轮出的牌，要么记一次"换牌"。游戏结束时，你换了 $t$ 次牌，就要额外扣 $b_1+\\cdots+b_t$ 分。

请计算出你最多能获得多少分。`,
    inputFormat: `第一行一个整数 $N$，表示游戏轮数。

第二行 $N$ 个用单个空格隔开的非负整数 $a_1,\\cdots,a_N$，意义见题目描述。

第三行 $N-1$ 个用单个空格隔开的非负整数 $b_1,\\cdots,b_{N-1}$，表示换牌的罚分，具体含义见题目描述。由于游戏进行 $N$ 轮，所以你至多可以换 $N-1$ 次牌。

第四行 $N$ 个用单个空格隔开的整数 $c_1,\\cdots,c_N$，依次表示小杨从第 $1$ 轮至第 $N$ 轮出的牌。保证 $c_i\\in\\{0,1,2\\}$。`,
    outputFormat: `一行一个整数，表示你最多获得的分数。`,
    samples: [
      { input: `4\n1 2 10 100\n1 100 1\n1 1 2 0`, output: `219` },
      { input: `6\n3 7 2 8 9 4\n1 3 9 27 81\n0 1 2 1 2 0`, output: `56` },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `**样例解释 1**

你可以第 $1$ 轮出 $0$，并在第 $2,3$ 轮保持不变，如此输掉第 $1,2$ 轮，但在第 $3$ 轮中取胜，获得 $2×10=20$ 分；

随后，你可以在第 $4$ 轮中以扣 $1$ 分为代价改出 $1$ ，并在第 $4$ 轮中取得胜利，获得 $2×100=200$ 分。

如此，你可以获得最高的总分 $20+200-1=219$。

**数据范围**

对于 $30\\%$ 的测试点，保证 $N\\le15$。

对于 $60\\%$ 的测试点，保证 $N\\le100$。

对于所有测试点，保证 $N \\le 1,000$；保证 $0 \\le a_i,b_i \\le 10^6$。`,
  },
  // ========== 2024年3月 ==========
  {
    title: "[GESP202403 七级] 交流问题",
    source: "gesp_official",
    sourceId: "P10378",
    sourceUrl: "https://www.luogu.com.cn/problem/P10378",
    level: 7,
    knowledgePoints: ["图论", "二分图", "并查集", "染色法"],
    difficulty: "普及/提高-",
    description: `来自两所学校 $A$、$B$ 的 $n$ 名同学聚在一起相互交流。为了方便起见，我们把这些同学从 $1$ 至 $n$ 编号。他们共进行了 $m$ 次交流，第 $i$ 次交流中，编号为 $u_i, v_i$ 的同学相互探讨了他们感兴趣的话题，并结交成为了新的朋友。

由于这次交流会的目的是促进两校友谊，因此只有不同学校的同学之间会交流。同校同学并不会互相交流。

作为 $A$ 校顾问，你对 $B$ 校的规模非常感兴趣，你希望求出 $B$ 校至少有几名同学、至多有几名同学。`,
    inputFormat: `第一行两个正整数，表示同学的人数 $n$、交流的次数 $m$。
接下来 $m$ 行，每行两个整数 $u_i, v_i$，表示一次交流。`,
    outputFormat: `输出一行两个整数，用单个空格隔开，分别表示 $B$ 校至少有几名同学、至多有几名同学。`,
    samples: [
      { input: "4 3\n1 2\n2 3\n4 2", output: "1 3" },
      { input: "7 5\n1 2\n2 3\n4 2\n5 6\n6 7", output: "2 5" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `### 数据规模与约定

- 对 $30\\%$ 的数据，保证 $n \\leq 17$，$m \\leq 50$。
- 对 $60\\%$ 的数据，保证 $n \\leq 500$，$m \\leq 2000$。
- 对全部的测试数据，保证 $1 \\leq u_i, v_i \\leq n \\leq 10^5$，$1 \\leq m \\leq 2\\times 10^5$，输入是合法的，即交流一定是跨校开展的。`,
  },
  {
    title: "[GESP202403 七级] 俄罗斯方块",
    source: "gesp_official",
    sourceId: "P10379",
    sourceUrl: "https://www.luogu.com.cn/problem/P10379",
    level: 7,
    knowledgePoints: ["搜索", "BFS", "连通块", "哈希", "平移等价"],
    difficulty: "普及/提高-",
    description: `小杨同学用不同种类的俄罗斯方块填满了一个大小为 $n \\times m$ 的网格图。

网格图由 $n \\times m$ 个带颜色方块构成。小杨同学现在将这个网格图交给了你，请你计算出网格图中俄罗斯方块的种类数。
如果两个同色方块是四连通（即上下左右四个相邻的位置）的，则称两个同色方块直接连通；若两个同色方块同时与另一个同色方块直接或间接连通，则称两个同色方块间接连通。一个俄罗斯方块由一个方块和所有与其直接或间接连接的同色方块组成。定义两个俄罗斯方块的种类相同当且仅当通过**平移**其中一个俄罗斯方块可以和另一个俄罗斯方块重合；如果两个俄罗斯方块颜色不同，仍然视为同一种俄罗斯方块。

例如，在如下情况中，方块 $1$ 和方块 $2$ 是同一种俄罗斯方块，而方块 $1$ 和方块 $3$ **不是**同一种俄罗斯方块。

![](https://cdn.luogu.com.cn/upload/image_hosting/ttv3nmgs.png)`,
    inputFormat: `第一行包含两个正整数 $n$ 和 $m$，表示网格图的大小。
对于之后的 $n$ 行，第 $i$ 行包含 $m$ 个正整数 $a_{i1}, a_{i2}, \\dots a_{im}$，表示该行 $m$ 个方块的颜色。`,
    outputFormat: `输出一行一个整数表示答案。`,
    samples: [
      { input: "5 6\n1 2 3 4 4 5\n1 2 3 3 4 5\n1 2 2 3 4 5\n1 6 6 7 7 8\n6 6 7 7 8 8", output: "7" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `| 子任务 | 分数 | $n,m \\leq$ | 特殊约定 |
| :-: | :-: | :-: | :-: |
| $1$ | $30$ | $20$ | 所有俄罗斯方块大小不超过 $5 \\times 5$ |
| $2$ | $30$ | $500$ | 所有俄罗斯方块大小均为 $1 \\times x$ 或 $x \\times 1$ 类型，其中 $x$ 是任意正整数|
| $3$ | $40$ | $500$ | 无 |

对全部的测试数据，保证 $1 \\leq n, m \\leq 500$，$1 \\leq a_{i,j} \\leq n \\times m$。`,
  },
  // ========== 2024年6月 ==========
  {
    title: "[GESP202406 七级] 黑白翻转",
    source: "gesp_official",
    sourceId: "P10723",
    sourceUrl: "https://www.luogu.com.cn/problem/P10723",
    level: 7,
    knowledgePoints: ["树", "树形DP", "贪心", "连通性"],
    difficulty: "普及+/提高",
    description: `小杨有一棵包含 $n$ 个节点的树，这棵树上的任意一个节点要么是白色，要么是黑色。小杨认为一棵树是美丽树当且仅当在删除所有白色节点之后，剩余节点仍然组成一棵树。

小杨每次操作可以选择一个白色节点将它的颜色变为黑色，他想知道自己最少要执行多少次操作可以使得这棵树变为美丽树。`,
    inputFormat: `第一行包含一个正整数 $n$，代表树的节点数。

第二行包含 $n$ 个非负整数 $a_1,a_2,\\ldots,a_n$，其中如果 $a_i=0$，则节点 $i$ 的颜色为白色，否则为黑色。

之后 $n-1$ 行，每行包含两个正整数 $x_i,y_i$，代表存在一条连接节点 $x_i$ 和 $y_i$ 的边。`,
    outputFormat: `输出一个整数，代表最少执行的操作次数。`,
    samples: [
      { input: "5\n0 1 0 1 0\n1 2\n1 3\n3 4\n3 5", output: "2" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `### 样例解释

将节点 $1$ 和 $3$ 变为黑色即可使这棵树变为美丽树，此时删除白色节点 $5$，剩余黑色节点仍然组成一棵树。

### 数据范围
子任务编号|数据点占比|$n$ |$a_i$ |特殊条件
:-:|:-:|:-:|:-:|:-:
$1$|$30\\%$ |$\\leq 10^5$ | $0\\leq a_i\\leq 1$|树的形态为一条链
$2$|$30\\%$ | $\\leq 10^5$ | $0\\leq a_i\\leq 1$| 只有两个节点颜色为黑色
$3$|$40\\%$|$\\leq 10^5$|$0\\leq a_i\\leq 1$|

对于全部数据，保证有 $1\\leq n\\leq 10^5$，$0\\leq a_i\\leq 1$。`,
  },
  {
    title: "[GESP202406 七级] 区间乘积",
    source: "gesp_official",
    sourceId: "P10724",
    sourceUrl: "https://www.luogu.com.cn/problem/P10724",
    level: 7,
    knowledgePoints: ["数学", "质因数分解", "前缀异或", "哈希", "完全平方数"],
    difficulty: "普及+/提高",
    description: `小杨有一个包含 $n$ 个正整数的序列 $A=[a_1,a_2,\\ldots,a_n]$。

小杨想知道有多少对 $\\langle l,r\\rangle(1\\leq l\\leq r\\leq n)$ 满足 $a_l\\times a_{l+1}\\times\\ldots\\times a_r$ 为完全平方数。

一个正整数 $x$ 为完全平方数当且仅当存在一个正整数 $y$ 使得 $x=y\\times y$。`,
    inputFormat: `第一行包含一个正整数 $n$，代表正整数个数。

第二行包含 $n$ 个正整数 $a_i$，代表序列 $A$。`,
    outputFormat: `输出一个整数，代表满足要求的 $\\langle l,r\\rangle$ 数量。`,
    samples: [
      { input: "5\n3 2 4 3 2", output: "2" },
    ],
    timeLimit: 1000,
    memoryLimit: 500,
    hint: `### 样例解释

满足条件的 $\\langle l,r\\rangle$ 有 $\\langle 1,5\\rangle$ 和 $\\langle 3,3\\rangle$。


### 数据范围

子任务编号|数据点占比|$n$|$a_i$
:-:|:-:|:-:|:-:
$1$|$20\\%$|$\\leq 10^5$|$1\\leq a_i\\leq 2$
$2$|$40\\%$|$\\leq 100$|$1\\leq a_i\\leq 30$
$3$|$40\\%$|$\\leq 10^5$|$1\\leq a_i\\leq 30$`,
  },
  // ========== 2024年9月 ==========
  {
    title: "[GESP202409 七级] 矩阵移动",
    source: "gesp_official",
    sourceId: "P11248",
    sourceUrl: "https://www.luogu.com.cn/problem/P11248",
    level: 7,
    knowledgePoints: ["动态规划", "网格路径", "贪心"],
    difficulty: "普及-",
    description: `小杨有一个 $n \\times m$ 的矩阵，仅包含 \`01?\` 三种字符。矩阵的行从上到下编号依次为 $1,2,\\dots, n$，列从左到右编号依次为 $1, 2, \\dots, m$。小杨开始在矩阵的左上角 $(1,1)$，小杨只能向下或者向右移动，最终到达右下角 $(n, m)$ 时停止，在移动的过程中每经过一个字符 \`1\` 得分会增加一分（包括起点和终点），经过其它字符则分数不变。小杨的初始分数为 $0$ 分。

小杨可以将矩阵中不超过 $x$ 个字符 \`?\` 变为字符 \`1\`。小杨在修改矩阵后，会以最优的策略从左上角移动到右下角。他想知道自己最多能获得多少分。`,
    inputFormat: `第一行包含一个正整数 $t$，代表测试用例组数，接下来是 $t$ 组测试用例。对于每组测试用例，一共 $n + 1$ 行。

第一行包含三个正整数 $n, m, x$，含义如题面所示。
之后 $n$ 行，每行一个长度为 $m$ 的仅含 \`01?\` 的字符串。`,
    outputFormat: `对于每组测试用例，输出一行一个整数，代表最优策略下小杨的得分最多是多少。`,
    samples: [
      { input: `2\n3 3 1\n000\n111\n01?\n3 3 1\n000\n?0?\n01?`, output: `4\n2` },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `### 样例 1 解释

对于第二组测试用例，将 $(2,1)$ 或者 $(3,3)$ 变为 $1$ 均是最优策略。

### 数据规模与约定

| 子任务编号 | 数据点占比 | $t$ | $n,m$ | $x$ |
| :-: | :-: | :-: | :-: | :-: |
| $1$ | $30\\%$ | $\\leq 5$ | $\\le 10$ | $=1$ |
| $2$ | $30\\%$ | $\\le 10$ | $\\le 500$ | $\\le 30$ |
| $3$ | $40\\%$ | $\\le 10$ | $\\le 500$ | $\\le 300$ |

对全部的测试数据，保证 $1 \\leq t \\leq 10$，$1 \\leq n,m \\leq 500$，$1 \\leq x \\leq 300$，保证所有测试用例 $n \\times m$ 的总和不超过 $2.5 \\times 10^5$。`,
  },
  {
    title: "[GESP202409 七级] 小杨寻宝",
    source: "gesp_official",
    sourceId: "P11249",
    sourceUrl: "https://www.luogu.com.cn/problem/P11249",
    level: 7,
    knowledgePoints: ["树", "欧拉路径", "DFS", "树的遍历"],
    difficulty: "普及/提高-",
    description: `小杨有一棵包含 $n$ 个节点的树，树上的一些节点放置有宝物。

小杨可以任意选择一个节点作为起点并在树上移动，但是小杨只能经过每条边至多一次，当小杨经过一条边后，这条边就会消失。小杨每经过一个放置有宝物的节点就会取得该宝物。

小杨想请你帮他判断自己能否成功取得所有宝物。`,
    inputFormat: `**本题单个测试点内有多组测试数据**。输入第一行包含一个正整数 $t$，代表测试用例组数。
接下来是 $t$ 组测试用例。对于每组测试用例，一共 $n+1$ 行。

第一行包含一个正整数 $n$，代表树的节点数。
第二行包含 $n$ 个非负整数 $a_1, a_2, \\dots a_n$，其中如果 $a_i = 1$，则节点 $i$ 放置有宝物；若 $a_i = 0$，则节点 $i$ 没有宝物。
之后 $n - 1$ 行，每行包含两个正整数 $x_i, y_i$，代表存在一条连接节点 $x_i$ 和 $y_i$ 的边。`,
    outputFormat: `对于每组测试数据，如果小杨能成功取得所有宝物，输出 Yes，否则输出 No。`,
    samples: [
      { input: `2\n5\n0 1 0 1 0\n1 2\n1 3\n3 4\n3 5\n5\n1 1 1 1 1\n1 2\n1 3\n3 4\n3 5\n`, output: `Yes\nNo\n` },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `### 样例 1 解释

对于第一组测试用例，小杨从节点 $2$ 出发，按照 $2-1-3-4$ 的顺序即可成功取得所有宝物。

### 数据规模与约定

| 子任务编号 | 数据点占比 | $t$ | $n$ |
| :-: | :-: | :-: | :-: |
| $1$ | $20\\%$ | $\\leq 10$ | $\\leq 5$ |
| $2$ | $20\\%$ | $\\leq 10$ | $\\leq 10^3$ |
| $3$ | $60\\%$ | $\\leq 10$ | $\\leq 10^5$ |

对全部的测试点，保证 $1 \\leq t \\leq 10$，$1 \\leq n \\leq 10^5$，$0 \\leq a_i \\leq 1$，且保证树上至少有一个点放置有宝物。`,
  },
  // ========== 2024年12月 ==========
  {
    title: "[GESP202412 七级] 武器购买",
    source: "gesp_official",
    sourceId: "P11377",
    sourceUrl: "https://www.luogu.com.cn/problem/P11377",
    level: 7,
    knowledgePoints: ["动态规划", "背包问题", "二维背包"],
    difficulty: "普及-",
    description: `商店里有 $n$ 个武器，第 $i$ 个武器的强度为 $p_i$，花费为 $c_i$。

小杨想要购买一些武器，满足这些武器的总强度不小于 $P$，总花费不超过 $Q$，小杨想知道是否存在满足条件的购买方案，如果有，最少花费又是多少。`,
    inputFormat: `第一行包含一个正整数 $t$，代表测试数据组数。

对于每组测试数据，第一行包含三个正整数 $n,P,Q$，含义如题面所示。

之后 $n$ 行，每行包含两个正整数 $p_i,c_i$，代表武器的强度和花费。`,
    outputFormat: `对于每组测试数据，如果存在满足条件的购买方案，输出最少花费，否则输出 \`-1\`。`,
    samples: [
      { input: `3\n3 2 3\n1 2\n1 2\n2 3\n3 3 4\n1 2\n1 2\n2 3\n3 1000 1000\n1 2\n1 2\n2 3`, output: `3\n-1\n-1` },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `| 子任务编号 | 数据点占比 | $n$ | $p_i$ | $c_i$ | $P$ | $Q$ |
| :--------: | :--------: | :--------: | :-----------------: | :-----------------: | :-----------------: | :-----------------: |
| $1$ | $20\\%$ | $\\leq 10$ | $1$ | $1$ | $\\leq 10$ | $\\leq 10$ |
| $2$ | $20\\%$ | $\\leq 100$ | $\\leq 5\\times 10^4$ | $1$ | $\\leq 5\\times 10^4$ | $2$ |
| $3$ | $60\\%$ | $\\leq 100$ | $\\leq 5\\times 10^4$ | $\\leq 5\\times 10^4$ | $\\leq 5\\times 10^4$ | $\\leq 5\\times 10^4$ |

对于全部数据，保证有 $1\\leq t\\leq 10$，$1\\leq n\\leq 100$，$1\\leq p_i,c_i,P,Q\\leq 5\\times 10^4$。`,
  },
  {
    title: "[GESP202412 七级] 燃烧",
    source: "gesp_official",
    sourceId: "P11378",
    sourceUrl: "https://www.luogu.com.cn/problem/P11378",
    level: 7,
    knowledgePoints: ["树", "DFS", "BFS", "排序"],
    difficulty: "普及/提高-",
    description: `小杨有一棵包含 $n$ 个节点的树，其中节点的编号从 $1$ 到 $n$。节点 $i$ 的权值为 $a_i$。

小杨可以选择一个初始节点引燃，每个燃烧的节点会将其相邻节点中权值**严格小于**自身权值的在节点间扩散直到不会有新的节点被引燃。

小杨想知道在合理选择初始节点的情况下，最多可以燃烧多少个节点。`,
    inputFormat: `第一行包含一个正整数 $n$，表示节点数量。

第二行包含 $n$ 个正整数 $a_1,a_2,\\dots,a_n$，代表节点权值。

之后 $n-1$ 行，每行包含两个正整数 $u_i,v_i$，代表存在一条连接节点 $u_i$ 和 $v_i$ 的边。`,
    outputFormat: `输出一个正整数，代表最多燃烧的节点个数。`,
    samples: [
      { input: `5\n6 2 3 4 5\n1 2\n2 3\n2 5\n1 4`, output: `3` },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `| 子任务编号 | 数据点占比 | $n$ |
| :--------: | :--------: | :---------: |
| $1$ | $20\\%$ | $\\leq 10$ |
| $2$ | $20\\%$ | $\\leq 100$ |
| $3$ | $60\\%$ | $\\leq 10^5$ |

对于全部数据，保证有 $1\\leq n\\leq 10^5$，$1\\leq a_i\\leq 10^6$。`,
  },
  // ========== 2025年3月 ==========
  {
    title: "[GESP202503 七级] 图上移动",
    source: "gesp_official",
    sourceId: "P11964",
    sourceUrl: "https://www.luogu.com.cn/problem/P11964",
    level: 7,
    knowledgePoints: ["图论", "BFS", "可达性分析"],
    difficulty: "普及-",
    description: `小 A 有一张包含 $n$ 个结点与 $m$ 条边的无向图，结点以 $1, 2, \\dots, n$ 标号。小 A 会从图上选择一个结点作为起点，每一步移动到某个与当前小 A 所在结点相邻的结点。对于每个结点 $i$ （$1 \\leq i \\leq n$），小 A 想知道从结点 $i$ 出发恰好移动 $1, 2, \\dots, k$ 步之后，小 A 可能会位于哪些结点。由于满足条件的结点可能有很多，你只需要求出这些结点的数量。`,
    inputFormat: `第一行，三个正整数 $n, m, k$，分别表示无向图的结点数与边数，最多移动的步数。

接下来 $m$ 行，每行两个正整数 $u_i, v_i$，表示图中的一条连接结点 $u_i$ 与 $v_i$ 的无向边。`,
    outputFormat: `共 $n$ 行，第 $i$ 行 ($1 \\leq i \\leq n$) 包含 $k$ 个整数，第 $j$ 个整数 ($1 \\leq j \\leq k$) 表示从结点 $i$ 出发恰好移动 $j$ 步之后可能位置的结点数量。`,
    samples: [
      { input: `4 4 3\n1 2\n1 3\n2 3\n3 4`, output: `2 4 4\n2 4 4\n3 3 4\n1 3 3` },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `**本题采用捆绑测试。**

对于 $20\\%$ 的测试点，保证 $k = 1$。

对于另外 $20\\%$ 的测试点，保证 $1 \\leq n \\leq 50, 1 \\leq m \\leq 50$。

对于所有测试点，保证 $1 \\leq n \\leq 500, 1 \\leq m \\leq 500, 1 \\leq k \\leq 20, 1 \\leq u_i, v_i \\leq n$。`,
  },
  {
    title: "[GESP202503 七级] 等价消除",
    source: "gesp_official",
    sourceId: "P11965",
    sourceUrl: "https://www.luogu.com.cn/problem/P11965",
    level: 7,
    knowledgePoints: ["字符串", "哈希", "前缀和"],
    difficulty: "普及/提高-",
    description: `小 A 有一个仅包含小写英文字母的字符串 $S$。

对于一个字符串，如果能通过每次删去其中两个相同字符的方式，将这个字符串变为空串，那么称这个字符串是可以被等价消除的。

小 A 想知道 $S$ 有多少子串是可以被等价消除的。

一个字符串 $S'$ 是 $S$ 的子串，当且仅当删去 $S$ 的某个可以为空的前缀和某个可以为空的后缀之后，可以得到 $S'$。`,
    inputFormat: `第一行，一个正整数 $|S|$，表示字符串 $S$ 的长度。

第二行，一个仅包含小写英文字母的字符串 $S$。`,
    outputFormat: `一行，一个整数，表示答案。`,
    samples: [
      { input: `7\naaaaabb`, output: `9` },
      { input: `9\nbabacabab`, output: `2` },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `**本题采用捆绑测试。**

对于 $20\\%$ 的测试点，保证 $S$ 中仅包含 $a$ 和 $b$ 两种字符。

对于另外 $20\\%$ 的测试点，保证 $1 \\leq |S| \\leq 2000$。

对于所有测试点，保证 $1 \\leq |S| \\leq 2 \\times 10^5$。`,
  },
  // ========== 2025年6月 ==========
  {
    title: "[GESP202506 七级] 线图",
    source: "gesp_official",
    sourceId: "P13017",
    sourceUrl: "https://www.luogu.com.cn/problem/P13017",
    level: 7,
    knowledgePoints: ["图论", "数学", "度数"],
    difficulty: "普及/提高-",
    description: `给定由 $n$ 个结点与 $m$ 条边构成的简单无向图 $G$，结点依次以 $1,2,\\dots,n$ 编号。简单无向图意味着 $G$ 中不包含重边与自环。$G$ 的**线图** $L(G)$ 通过以下方式构建：

- 初始时线图 $L(G)$ 为空。

- 对于无向图 $G$ 中的一条边，在线图 $L(G)$ 中加入与之对应的一个结点。

- 对于无向图 $G$ 中两条不同的边 $(u_1,v_1),(u_2,v_2)$，若存在 $G$ 中的结点同时连接这两条边（即 $u_1,v_1$ 之一与 $u_2,v_2$ 之一相同），则在线图 $L(G)$ 中加入一条无向边，连接 $(u_1,v_1),(u_2,v_2)$ 在线图中对应的结点。

请你求出线图 $L(G)$ 中所包含的无向边的数量。`,
    inputFormat: `第一行，两个正整数 $n,m$，分别表示无向图 $G$ 中的结点数和边数。

接下来 $m$ 行，每行两个正整数 $u_i,v_i$，表示 $G$ 中连接 $u_i,v_i$ 的一条无向边。`,
    outputFormat: `输出共一行，一个整数，表示线图 $L(G)$ 中所包含的无向边的数量。`,
    samples: [
      { input: `5 4\n1 2\n2 3\n3 1\n4 5`, output: `3` },
      { input: `5 10\n1 2\n1 3\n1 4\n1 5\n2 3\n2 4\n2 5\n3 4\n3 5\n4 5`, output: `30` },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `**【样例解释 #1】**

![](https://cdn.luogu.com.cn/upload/image_hosting/72ffa0a3.png)

**【数据范围】**

对于 $60\\%$ 的测试点，保证 $1 \\le n \\le 500$，$1 \\le m \\le 500$。

对于所有测试点，保证 $1 \\le n \\le 10^5$，$1 \\le m \\le 10^5$。`,
  },
  {
    title: "[GESP202506 七级] 调味平衡",
    source: "gesp_official",
    sourceId: "P13018",
    sourceUrl: "https://www.luogu.com.cn/problem/P13018",
    level: 7,
    knowledgePoints: ["动态规划", "背包问题"],
    difficulty: "普及/提高-",
    description: `小 A 准备了 $n$ 种食材用来制作料理，这些食材依次以 $1,2,\\dots,n$ 编号，第 $i$ 种食材的酸度为 $a_i$，甜度为 $b_i$。对于每种食材，小 A 可以选择将其放入料理，或者不放入料理。料理的酸度 $A$ 为放入食材的酸度之和，甜度 $B$ 为放入食材的甜度之和。如果料理的酸度和甜度相等，那么料理的调味是**平衡的**。

过于清淡的料理并不好吃，因此小 A 想在满足料理调味平衡的前提下，合理选择食材，最大化料理的酸度与甜度之和。你能帮他求出在调味平衡的前提下，料理酸度与甜度之和的最大值吗？`,
    inputFormat: `第一行，一个正整数 $n$，表示食材种类数量。

接下来 $n$ 行，每行两个正整数 $a_i,b_i$，表示食材的酸度和甜度。`,
    outputFormat: `输出共一行，一个整数，表示在调味平衡的前提下，料理酸度与甜度之和的最大值。`,
    samples: [
      { input: `3\n1 2\n2 4\n3 2`, output: `8` },
      { input: `5\n1 1\n2 3\n6 1\n8 2\n5 7`, output: `2` },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于 $40\\%$ 的测试点，保证 $1 \\le n \\le 10$，$1 \\le a_i,b_i \\le 10$。

对于另外 $20\\%$ 的测试点，保证 $1 \\le n \\le 50$，$1 \\le a_i,b_i \\le 10$。

对于所有测试点，保证 $1 \\le n \\le 100$，$1 \\le a_i,b_i \\le 500$。`,
  },
  // ========== 2025年9月 ==========
  {
    title: "[GESP202509 七级] 连通图",
    source: "gesp_official",
    sourceId: "P14077",
    sourceUrl: "https://www.luogu.com.cn/problem/P14077",
    level: 7,
    knowledgePoints: ["图论", "并查集", "连通分量"],
    difficulty: "普及-",
    description: `给定一张包含 $n$ 个结点与 $m$ 条边的无向图，结点依次以 $1,2,\\ldots,n$ 编号，第 $i$ 条边（$1\\le i\\le m$）连接结点 $u_i$ 与结点 $v_i$。如果从一个结点经过若干条边可以到达另一个结点，则称这两个结点是连通的。

你需要向图中加入若干条边，使得图中任意两个结点都是连通的。请你求出最少需要加入的边的条数。

注意给出的图中可能包含重边与自环。`,
    inputFormat: `第一行，两个正整数 $n,m$，表示图的点数与边数。

接下来 $m$ 行，每行两个正整数 $u_i,v_i$，表示图中一条连接结点 $u_i$ 与结点 $v_i$ 的边。`,
    outputFormat: `输出一行，一个整数，表示使得图中任意两个结点连通所需加入的边的最少数量。`,
    samples: [
      { input: `4 4\n1 2\n2 3\n3 1\n1 4`, output: `0` },
      { input: `6 4\n1 2\n2 3\n3 1\n6 5`, output: `2` },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于 $40\\%$ 的测试点，保证 $1\\le n\\le 100$，$1\\le m\\le 100$。

对于所有测试点，保证 $1\\le n\\le 10^5$，$1\\le m\\le 10^5$。`,
  },
  {
    title: "[GESP202509 七级] 金币收集",
    source: "gesp_official",
    sourceId: "P14078",
    sourceUrl: "https://www.luogu.com.cn/problem/P14078",
    level: 7,
    knowledgePoints: ["动态规划", "排序", "贪心"],
    difficulty: "普及+/提高",
    description: `小 A 正在游玩收集金币的游戏。具体来说，在数轴上将会出现 $n$ 枚金币，其中第 $i$ 枚（$1\\le i\\le n$）金币将会在时刻 $t_i$ 出现在数轴上坐标为 $x_i$ 的位置。小 A 必须在时刻 $t_i$ 恰好位于坐标 $x_i$，才可以获得第 $i$ 枚金币。

游戏开始时为时刻 $0$，此时小 A 的坐标为 $0$。正常来说，小 A 可以按游戏机的按键在数轴上左右移动，但不幸的是游戏机的左方向键失灵了。小 A 每个时刻只能选择保持不动，或是向右移动一个单位。换言之，如果小 A 在时刻 $t$ 的坐标为 $x$，那么他在时刻 $t+1$ 的坐标只能是 $x$ 或是 $x+1$ 二者之一，分别对应保持不动和向右移动。

小 A 想知道他最多能收集多少枚金币。你能帮他收集最多的金币吗？`,
    inputFormat: `第一行，一个正整数 $n$，表示金币的数量。

接下来 $n$ 行，每行两个正整数 $x_i,t_i$，分别表示金币出现的坐标与时刻。`,
    outputFormat: `输出一行，一个整数，表示小 A 最多能收集的金币数量。`,
    samples: [
      { input: `3\n1 6\n3 7\n2 4`, output: `2` },
      { input: `4\n1 1\n2 2\n1 3\n2 4`, output: `3` },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于 $40\\%$ 的测试点，保证 $1\\le n\\le 8$。

对于另外 $30\\%$ 的测试点，保证 $1\\le n\\le 100$，$1\\le x_i\\le 100$，$1\\le t_i\\le 100$。

对于所有测试点，保证 $1\\le n\\le 10^5$，$1\\le x_i\\le 10^9$，$1\\le t_i\\le 10^9$。`,
  },
  // ========== 2025年12月 ==========
  {
    title: "[GESP202512 七级] 城市规划",
    source: "gesp_official",
    sourceId: "P14921",
    sourceUrl: "https://www.luogu.com.cn/problem/P14921",
    level: 7,
    knowledgePoints: ["图论", "BFS", "最短路"],
    difficulty: "普及/提高-",
    description: `A 国有 $n$ 座城市，城市之间由 $m$ 条双向道路连接，任意一座城市均可经过若干条双向道路到达另一座城市。城市依次以 $1,2,\\ldots,n$ 编号。第 $i$（$1\\le i\\le m$）条双向道路连接城市 $u_i$ 与城市 $v_i$。

对于城市 $u$ 和城市 $v$ 而言，它们之间的连通度 $d(u,v)$ 定义为从城市 $u$ 出发到达城市 $v$ 所需经过的双向道路的最少条数。由于道路是双向的，可以知道连通度满足 $d(u,v)=d(v,u)$，特殊地有 $d(u,u)=0$。

现在 A 国正在规划城市建设方案。城市 $u$ 的建设难度为它到其它城市的最大连通度。请你求出建设难度最小的城市，如果有多个满足条件的城市，则选取其中编号最小的城市。形式化地，你需要求出使得 $\\max\\limits_{1\\le i\\le n}d(u,i)$ 最小的 $u$，若存在多个可能的 $u$ 则选取其中最小的。`,
    inputFormat: `第一行，两个正整数 $n,m$，表示 A 国的城市数量与双向道路数量。

接下来 $m$ 行，每行两个整数 $u_i,v_i$，表示一条连接城市 $u_i$ 与城市 $v_i$ 的双向道路。`,
    outputFormat: `输出一行，一个整数，表示建设难度最小的城市编号。如果有多个满足条件的城市，则选取其中编号最小的城市。`,
    samples: [
      { input: `3 3\n1 2\n1 3\n2 3`, output: `1` },
      { input: `4 4\n1 2\n2 3\n3 4\n2 4`, output: `2` },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于 $40\\%$ 的测试点，保证 $1\\le n\\le 300$。

对于所有测试点，保证 $1\\le n\\le 2000$，$1\\le m\\le 2000$，$1\\le u_i,v_i\\le n$。`,
  },
  {
    title: "[GESP202512 七级] 学习小组",
    source: "gesp_official",
    sourceId: "P14922",
    sourceUrl: "https://www.luogu.com.cn/problem/P14922",
    level: 7,
    knowledgePoints: ["动态规划", "排序", "区间DP"],
    difficulty: "普及+/提高",
    description: `班主任计划将班级里的 $n$ 名同学划分为若干个学习小组，每名同学都需要分入某一个学习小组中。班级里的同学依次以 $1,2,\\ldots,n$ 编号，第 $i$ 名同学有其发言积极度 $c_i$。

观察发现，如果一个学习小组中恰好包含编号为 $p_1,p_2,\\ldots,p_k$ 的 $k$ 名同学，则该学习小组的基础讨论积极度为 $a_k$，综合讨论积极度为 $a_k+\\max\\{c_{p_1},c_{p_2},\\ldots,c_{p_k}\\}-\\min\\{c_{p_1},c_{p_2},\\ldots,c_{p_k}\\}$，也即基础讨论积极度加上小组内同学的最大发言积极度与最小发言积极度之差。

给定基础讨论积极度 $a_1,a_2,\\ldots,a_n$，请你计算将这 $n$ 名同学划分为学习小组的所有可能方案中，综合讨论积极度之和的最大值。`,
    inputFormat: `第一行，一个正整数 $n$，表示班级人数。

第二行，$n$ 个非负整数 $c_1,c_2,\\ldots,c_n$，表示每位同学的发言积极度。

第三行，$n$ 个非负整数 $a_1,a_2,\\ldots,a_n$，表示不同人数学习小组的基础讨论积极度。`,
    outputFormat: `输出一行，一个整数，表示所有划分方案中，学习小组综合讨论积极度之和的最大值。`,
    samples: [
      { input: `4\n2 1 3 2\n1 5 6 3`, output: `12` },
      { input: `8\n1 3 2 4 3 5 4 6\n0 2 5 6 4 3 3 4`, output: `21` },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于 $40\\%$ 的测试点，保证 $c_i=0$。

对于所有测试点，保证 $1\\le n\\le 300$，$0\\le c_i\\le 10^4$，$0\\le a_i\\le 10^4$。`,
  },
];

async function seedGesp7() {
  try {
    await prisma.problem.deleteMany({
      where: {
        sourceId: {
          in: gesp7Problems.map(p => p.sourceId).filter(Boolean) as string[]
        }
      }
    });

    const problemsWithTestCases = gesp7Problems.map(p => ({
      ...p,
      testCases: p.samples,
    }));

    const result = await prisma.problem.createMany({
      data: problemsWithTestCases,
    });

    return NextResponse.json({
      success: true,
      message: `成功导入 ${result.count} 道 GESP 7级题目（已更新为与洛谷100%一致）`,
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
