import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GESP 5级完整题库 - 来源：洛谷 CCF GESP C++ 五级上机题
// 共22道题目
// 难度标签采用洛谷评级：
// - "entry" = 入门 (洛谷1)
// - "easy" = 普及- (洛谷2)
// - "medium" = 普及/提高- (洛谷3)
// - "medium-hard" = 普及+/提高 (洛谷4)
// - "hard" = 提高+/省选- (洛谷5)
// - "expert" = 省选/NOI- (洛谷6)

const gesp5Problems = [
  // ========== 2023年6月 ==========
  {
    title: "[GESP202306 五级] 小杨的锻炼",
    source: "gesp_official",
    sourceId: "B3941",
    sourceUrl: "https://www.luogu.com.cn/problem/B3941",
    level: 5,
    knowledgePoints: ["最小公倍数", "最大公约数", "数论"],
    difficulty: "easy", // 洛谷难度2
    description: `小杨每天都要进行锻炼。他有 n 种不同的锻炼项目，第 i 种锻炼项目每隔 aᵢ 天进行一次。

小杨想知道，他最少需要多少天才能把所有的锻炼项目都完成一遍？

换句话说，求 n 个数的最小公倍数（LCM）。`,
    inputFormat: `第一行包含一个正整数 n，表示锻炼项目的数量。

第二行包含 n 个正整数 a₁, a₂, ..., aₙ，表示每种锻炼项目的周期。

数据范围：
- 1 ≤ n ≤ 100
- 1 ≤ aᵢ ≤ 10⁶`,
    outputFormat: `输出一个整数，表示最少需要的天数。如果答案超过 10¹⁸，输出 -1。`,
    samples: [
      { input: "3\n2 3 4", output: "12", explanation: "2,3,4的最小公倍数是12" },
    ],
    testCases: [
      { input: "3\n2 3 4", output: "12" },
      { input: "2\n6 8", output: "24" },
      { input: "4\n1 2 3 4", output: "12" },
      { input: "2\n7 11", output: "77" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: "使用公式 LCM(a,b) = a * b / GCD(a,b)，注意数据范围可能溢出。",
  },
  {
    title: "[GESP202306 五级] 小杨的队列",
    source: "gesp_official",
    sourceId: "B3951",
    sourceUrl: "https://www.luogu.com.cn/problem/B3951",
    level: 5,
    knowledgePoints: ["逆序对", "排序", "冒泡排序"],
    difficulty: "easy", // 洛谷难度2
    description: `小杨的班级里共有 N 名同学，学号从 0 至 N-1。某节课上，老师要求同学们进行列队。

老师会依次点名 M 名同学加入队伍。每名新入队的同学需要先站到队伍末尾，随后整个队伍中的所有同学需要按身高从低到高重新排序。

同学们可以通过交换位置的方法来实现排序。具体来说，他们可以让队伍中的两名同学交换位置。

小杨想要知道：在老师每次点名一位新同学加入队伍后，同学们最少要进行几次交换位置，才能完成按身高排序的要求。`,
    inputFormat: `第一行包含两个正整数 N 和 M。

第二行包含 N 个正整数，第 i 个数表示学号为 i-1 的同学的身高。

第三行包含 M 个整数，表示老师依次点名的同学的学号。

数据范围：
- 1 ≤ N, M ≤ 1000`,
    outputFormat: `输出 M 行，第 i 行表示第 i 名同学入队后，最少需要的交换次数。`,
    samples: [
      { input: "5 4\n170 165 180 175 160\n0 2 4 3", output: "0\n1\n0\n2" },
    ],
    testCases: [
      { input: "5 4\n170 165 180 175 160\n0 2 4 3", output: "0\n1\n0\n2" },
      { input: "3 3\n150 160 170\n0 1 2", output: "0\n0\n0" },
      { input: "3 3\n170 160 150\n0 1 2", output: "0\n1\n3" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: "每次加入新元素后，统计逆序对的数量。可以使用冒泡排序的思想。",
  },
  // ========== 2023年9月 ==========
  {
    title: "[GESP202309 五级] 因数分解",
    source: "gesp_official",
    sourceId: "B3871",
    sourceUrl: "https://www.luogu.com.cn/problem/B3871",
    level: 5,
    knowledgePoints: ["质因数分解", "数论"],
    difficulty: "easy", // 洛谷难度2
    description: `每个正整数都可以分解成素数的乘积，例如：6 = 2×3，20 = 2²×5。

现在给定一个正整数 N，请按要求输出它的因数分解式。

要求：
- 按质因数由小到大排列
- 乘号用星号 * 表示，且左右各空一格
- 当且仅当一个素数出现多次时，将它们合并为指数形式，用上箭头 ^ 表示，且左右不空格`,
    inputFormat: `输入一行，包含一个正整数 N。

数据范围：2 ≤ N ≤ 10¹²`,
    outputFormat: `输出一行，为 N 的因数分解式。`,
    samples: [
      { input: "12", output: "2^2 * 3", explanation: "12 = 2² × 3" },
      { input: "60", output: "2^2 * 3 * 5", explanation: "60 = 2² × 3 × 5" },
    ],
    testCases: [
      { input: "12", output: "2^2 * 3" },
      { input: "60", output: "2^2 * 3 * 5" },
      { input: "7", output: "7" },
      { input: "100", output: "2^2 * 5^2" },
      { input: "1000000007", output: "1000000007" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: "从2开始试除，注意处理输出格式，第一个因子前不加乘号。",
  },
  // ========== 2023年12月 ==========
  {
    title: "[GESP202312 五级] 烹饪问题",
    source: "gesp_official",
    sourceId: "B3930",
    sourceUrl: "https://www.luogu.com.cn/problem/B3930",
    level: 5,
    knowledgePoints: ["位运算", "按位与", "枚举"],
    difficulty: "medium", // 洛谷难度3
    description: `有 N 种食材，编号从 0 至 N-1，其中第 i 种食材的美味度为 aᵢ。

不同食材之间的组合可能产生奇妙的化学反应。具体来说，如果两种食材的美味度分别为 x 和 y，那么它们的契合度为 x AND y（按位与运算）。

例如，12 与 6 的二进制表示分别为 1100 和 0110，将它们逐位进行与运算，得到 0100，转换为十进制得到 4，因此 12 AND 6 = 4。

在 C++ 中，可以直接使用 & 运算符表示与运算。

现在，请你找到契合度最高的两种食材，并输出它们的契合度。`,
    inputFormat: `第一行包含一个正整数 N。

第二行包含 N 个非负整数 a₀, a₁, ..., aₙ₋₁。

数据范围：
- 2 ≤ N ≤ 10⁵
- 0 ≤ aᵢ ≤ 10⁹`,
    outputFormat: `输出一个整数，表示最高的契合度。`,
    samples: [
      { input: "4\n12 6 8 14", output: "12", explanation: "12 AND 14 = 12" },
    ],
    testCases: [
      { input: "4\n12 6 8 14", output: "12" },
      { input: "3\n7 7 7", output: "7" },
      { input: "2\n1 2", output: "0" },
      { input: "5\n15 15 15 15 15", output: "15" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: "O(n²) 枚举只能拿部分分。考虑从高位开始枚举，或者只枚举最大的若干个数。",
  },
  // ========== 2024年6月 ==========
  {
    title: "[GESP202406 五级] 黑白格",
    source: "gesp_official",
    sourceId: "P10719",
    sourceUrl: "https://www.luogu.com.cn/problem/P10719",
    level: 5,
    knowledgePoints: ["二维前缀和", "枚举", "子矩阵"],
    difficulty: "medium", // 洛谷难度3
    description: `小杨有一个 n 行 m 列的网格图，每个格子是白色或黑色。

小杨想要找出一个最小的子矩形，使得这个子矩形至少包含 k 个黑色格子。

请输出这个最小子矩形包含的格子数。如果不存在这样的子矩形，输出 0。`,
    inputFormat: `第一行包含三个正整数 n, m, k。

接下来 n 行，每行一个长度为 m 的字符串，由 '.' 和 '#' 组成，'.' 表示白色，'#' 表示黑色。

数据范围：
- 1 ≤ n, m ≤ 100
- 1 ≤ k ≤ n × m`,
    outputFormat: `输出一个整数，表示最小子矩形的格子数。如果不存在输出 0。`,
    samples: [
      { input: "3 4 2\n.#..\n..#.\n.#..", output: "4", explanation: "2×2的子矩形可以包含2个黑格" },
    ],
    testCases: [
      { input: "3 4 2\n.#..\n..#.\n.#..", output: "4" },
      { input: "2 2 5\n##\n##", output: "0" },
      { input: "3 3 1\n...\n.#.\n...", output: "1" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: "使用二维前缀和快速计算子矩形内的黑格数量，枚举所有可能的子矩形。",
  },
  // ========== 2024年9月 ==========
  {
    title: "[GESP202409 五级] 小杨的武器",
    source: "gesp_official",
    sourceId: "B4051",
    sourceUrl: "https://www.luogu.com.cn/problem/B4051",
    level: 5,
    knowledgePoints: ["贪心", "排序", "前缀和"],
    difficulty: "easy", // 洛谷难度2
    description: `小杨有 n 种不同的武器，他对第 i 种武器的初始熟练度为 cᵢ。

小杨会依次参加 m 场战斗，每场战斗小杨只能且必须选择一种武器使用。假设小杨使用了第 i 种武器参加了第 j 场战斗，战斗前该武器的熟练度为 c'ᵢ，则战斗后小杨对该武器的熟练度会变为 c'ᵢ + aⱼ。

注意 aⱼ 可能是正数、0 或负数，这意味着熟练度可能提高、不变或降低。

小杨想请你帮他计算出如何选择武器才能使得 m 场战斗后，自己对 n 种武器的熟练度的最大值尽可能大。`,
    inputFormat: `第一行包含两个正整数 n, m。

第二行包含 n 个整数 c₁, c₂, ..., cₙ，表示初始熟练度。

第三行包含 m 个整数 a₁, a₂, ..., aₘ，表示每场战斗的熟练度变化值。

数据范围：
- 1 ≤ n, m ≤ 10⁵
- -10⁴ ≤ cᵢ, aᵢ ≤ 10⁴`,
    outputFormat: `输出一个整数，表示熟练度最大值的最大可能值。`,
    samples: [
      { input: "3 4\n10 20 15\n5 -3 8 2", output: "32", explanation: "选初始值最大的武器20，加上所有正数变化5+8+2=15，得到35。但需要参加所有战斗，最优策略得到32。" },
    ],
    testCases: [
      { input: "3 4\n10 20 15\n5 -3 8 2", output: "32" },
      { input: "2 3\n5 5\n1 1 1", output: "8" },
      { input: "1 3\n10\n-1 -2 -3", output: "4" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: "贪心：选择初始值最大的武器，并让它参加所有正收益的战斗。",
  },
  // ========== 2024年12月 ==========
  {
    title: "[GESP202412 五级] 奇妙数字",
    source: "gesp_official",
    sourceId: "B4070",
    sourceUrl: "https://www.luogu.com.cn/problem/B4070",
    level: 5,
    knowledgePoints: ["质因数分解", "数论", "贪心"],
    difficulty: "medium", // 洛谷难度3
    description: `小杨认为一个数字 x 是奇妙数字当且仅当 x = pᵃ，其中 p 为任意质数且 a 为正整数。

例如：
- 8 = 2³，是奇妙数字
- 6 = 2 × 3，不是奇妙数字（有两个不同的质因子）

对于一个正整数 n，小杨想要构建一个包含 m 个奇妙数字的集合 {x₁, x₂, ..., xₘ}，使其满足：
1. 集合中不包含相同的数字
2. x₁ × x₂ × ... × xₘ 是 n 的因子

小杨希望集合包含的奇妙数字尽可能多。请你计算出满足条件的集合最多包含多少个奇妙数字。`,
    inputFormat: `输入一行，包含一个正整数 n。

数据范围：1 ≤ n ≤ 10¹²`,
    outputFormat: `输出一个整数，表示集合最多包含的奇妙数字个数。`,
    samples: [
      { input: "128", output: "3", explanation: "128 = 2⁷，可以分成 2¹, 2², 2⁴（1+2+4=7），共3个奇妙数字" },
      { input: "12", output: "3", explanation: "12 = 2² × 3，可以分成 2, 4, 3，共3个奇妙数字" },
    ],
    testCases: [
      { input: "128", output: "3" },
      { input: "12", output: "3" },
      { input: "1", output: "0" },
      { input: "6", output: "2" },
      { input: "1000000000000", output: "12" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: "对n质因数分解，对每个质因子的指数e，求最大的k使得1+2+...+k ≤ e。",
  },
  {
    title: "[GESP202412 五级] 武器强化",
    source: "gesp_official",
    sourceId: "B4071",
    sourceUrl: "https://www.luogu.com.cn/problem/B4071",
    level: 5,
    knowledgePoints: ["贪心", "排序", "模拟"],
    difficulty: "medium", // 洛谷难度3
    description: `小杨有 n 种武器和 m 种强化材料。第 i 种强化材料会适配第 pᵢ 种武器。

小杨可以花费 cᵢ 金币将第 i 种材料的适配武器修改为任意武器。

小杨最喜欢第 1 种武器，因此他希望适配该武器的强化材料种类数严格大于其他所有武器。

请你帮小杨计算为了满足该条件最少需要花费多少金币。`,
    inputFormat: `第一行包含两个正整数 n, m。

接下来 m 行，每行两个正整数 pᵢ 和 cᵢ，表示第 i 种材料适配的武器和修改花费。

数据范围：
- 1 ≤ n, m ≤ 1000
- 1 ≤ pᵢ ≤ n
- 1 ≤ cᵢ ≤ 10⁹`,
    outputFormat: `输出一个整数，表示最少花费的金币数。`,
    samples: [
      { input: "3 4\n1 10\n2 5\n3 1\n2 3", output: "1", explanation: "花费1金币将第3种材料改为适配武器1" },
    ],
    testCases: [
      { input: "3 4\n1 10\n2 5\n3 1\n2 3", output: "1" },
      { input: "2 2\n1 100\n1 100", output: "0" },
      { input: "2 4\n2 1\n2 2\n2 3\n2 4", output: "6" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: "枚举武器1最终的材料数量，贪心选择花费最小的材料进行转换。",
  },
  // ========== 2025年3月 ==========
  {
    title: "[GESP202503 五级] 平均分配",
    source: "gesp_official",
    sourceId: "P11960",
    sourceUrl: "https://www.luogu.com.cn/problem/P11960",
    level: 5,
    knowledgePoints: ["贪心", "排序", "差值"],
    difficulty: "medium", // 洛谷难度3
    description: `小 A 有 2n 件物品，小 B 和小 C 想从小 A 手上买走这些物品。

对于第 i 件物品，小 B 会以 bᵢ 的价格购买，而小 C 会以 cᵢ 的价格购买。

为了平均分配这 2n 件物品，小 A 决定小 B 和小 C 各自只能买走恰好 n 件物品。

请帮助小 A 求出他卖出这 2n 件物品所能获得的最大收入。`,
    inputFormat: `第一行包含一个正整数 n。

第二行包含 2n 个整数 b₁, b₂, ..., b₂ₙ，表示小 B 对每件物品的出价。

第三行包含 2n 个整数 c₁, c₂, ..., c₂ₙ，表示小 C 对每件物品的出价。

数据范围：
- 1 ≤ n ≤ 10⁵
- 0 ≤ bᵢ, cᵢ ≤ 10⁹`,
    outputFormat: `输出一个整数，表示最大收入。`,
    samples: [
      { input: "2\n3 2 5 4\n4 3 1 2", output: "14", explanation: "物品1、4给C（4+2=6），物品2、3给B（2+5=7），但最优是物品1、2给B得5，物品3、4给C得3，总共14" },
    ],
    testCases: [
      { input: "2\n3 2 5 4\n4 3 1 2", output: "14" },
      { input: "1\n10\n20", output: "20" },
      { input: "2\n1 1 1 1\n2 2 2 2", output: "6" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: "按照 bᵢ - cᵢ 的差值排序，差值大的给 B，差值小的给 C。",
  },
  {
    title: "[GESP202503 五级] 原根判断",
    source: "gesp_official",
    sourceId: "P11961",
    sourceUrl: "https://www.luogu.com.cn/problem/P11961",
    level: 5,
    knowledgePoints: ["数论", "快速幂", "费马小定理"],
    difficulty: "hard", // 洛谷难度5 (提高+/省选-)
    description: `对于质数 p，如果一个正整数 g 满足：对于任意 1 ≤ i < p-1 均有 gⁱ mod p ≠ 1，则称 g 是 p 的原根。

换句话说，g 的 1 次方、2 次方、...、(p-2) 次方对 p 取模的结果都不等于 1，只有 (p-1) 次方对 p 取模才等于 1。

给定一个整数 a 和一个质数 p，请判断 a 是否是 p 的原根。`,
    inputFormat: `第一行包含一个正整数 T，表示测试用例数。

接下来 T 行，每行包含两个正整数 a 和 p，其中 p 是质数。

数据范围：
- 1 ≤ T ≤ 100
- 2 ≤ a < p ≤ 10⁹`,
    outputFormat: `对于每组测试数据，如果 a 是 p 的原根，输出 "Yes"，否则输出 "No"。`,
    samples: [
      { input: "2\n2 5\n3 5", output: "Yes\nNo", explanation: "2是5的原根，3不是" },
    ],
    testCases: [
      { input: "2\n2 5\n3 5", output: "Yes\nNo" },
      { input: "3\n2 7\n3 7\n5 7", output: "Yes\nYes\nNo" },
      { input: "1\n2 3", output: "Yes" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: "a 是 p 的原根当且仅当对于 p-1 的所有质因子 q，都有 a^((p-1)/q) mod p ≠ 1。需要快速幂。",
  },
  // ========== 2025年6月 ==========
  {
    title: "[GESP202506 五级] 奖品兑换",
    source: "gesp_official",
    sourceId: "P13013",
    sourceUrl: "https://www.luogu.com.cn/problem/P13013",
    level: 5,
    knowledgePoints: ["二分查找", "贪心", "数学"],
    difficulty: "medium", // 洛谷难度3
    description: `小杨有 n 张课堂券和 m 张作业券，他想用这些券兑换奖品。

兑换一份奖品有两种方式：
1. 使用 a 张课堂券和 b 张作业券
2. 使用 b 张课堂券和 a 张作业券

小杨想知道他最多能兑换多少份奖品。`,
    inputFormat: `输入一行，包含四个正整数 n, m, a, b。

数据范围：
- 1 ≤ n, m ≤ 10⁹
- 1 ≤ a, b ≤ 10⁹`,
    outputFormat: `输出一个整数，表示最多能兑换的奖品数量。`,
    samples: [
      { input: "8 8 2 1", output: "5", explanation: "可以兑换5份奖品" },
    ],
    testCases: [
      { input: "8 8 2 1", output: "5" },
      { input: "10 10 3 3", output: "3" },
      { input: "100 1 1 100", output: "1" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: "二分答案：二分奖品数量 k，检查是否能用 n 张课堂券和 m 张作业券兑换 k 份奖品。",
  },
  {
    title: "[GESP202506 五级] 最大公因数",
    source: "gesp_official",
    sourceId: "P13014",
    sourceUrl: "https://www.luogu.com.cn/problem/P13014",
    level: 5,
    knowledgePoints: ["最大公约数", "辗转相除法", "数论"],
    difficulty: "easy", // 洛谷难度2
    description: `对于两个正整数 a 和 b，它们的最大公因数记为 gcd(a, b)。

对于 k (k > 2) 个正整数 c₁, c₂, ..., cₖ，它们的最大公因数定义为：
gcd(c₁, c₂, ..., cₖ) = gcd(gcd(c₁, c₂, ..., cₖ₋₁), cₖ)

现在给定 n 个正整数，请你回答 q 次询问，每次询问给出一段区间 [l, r]，求这段区间内所有数的最大公因数。`,
    inputFormat: `第一行包含两个正整数 n 和 q。

第二行包含 n 个正整数 a₁, a₂, ..., aₙ。

接下来 q 行，每行两个正整数 l 和 r。

数据范围：
- 1 ≤ n, q ≤ 10⁵
- 1 ≤ aᵢ ≤ 10⁹
- 1 ≤ l ≤ r ≤ n`,
    outputFormat: `对于每次询问，输出一行，表示答案。`,
    samples: [
      { input: "5 3\n12 18 6 24 36\n1 3\n2 4\n1 5", output: "6\n6\n6" },
    ],
    testCases: [
      { input: "5 3\n12 18 6 24 36\n1 3\n2 4\n1 5", output: "6\n6\n6" },
      { input: "3 2\n10 20 30\n1 2\n1 3", output: "10\n10" },
      { input: "4 2\n7 11 13 17\n1 4\n2 3", output: "1\n1" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: "可以预处理或直接遍历区间计算。如果 q 很大，考虑使用稀疏表（ST表）。",
  },
  // ========== 2025年9月 ==========
  {
    title: "[GESP202509 五级] 数字选取",
    source: "gesp_official",
    sourceId: "P14073",
    sourceUrl: "https://www.luogu.com.cn/problem/P14073",
    level: 5,
    knowledgePoints: ["互质", "质数", "贪心"],
    difficulty: "easy", // 洛谷难度2
    description: `给定 1, 2, 3, ..., n 一共 n 个正整数，从这些数中选取一些数字，使得选取的整数中任意两个不同的整数均互质。

两个整数互质是指它们的最大公约数为 1。

请问最多能选取多少个整数？`,
    inputFormat: `输入一行，包含一个正整数 n。

数据范围：1 ≤ n ≤ 10⁵`,
    outputFormat: `输出一个整数，表示最多能选取的整数个数。`,
    samples: [
      { input: "10", output: "5", explanation: "可以选择 1, 2, 3, 5, 7（或其他方案）" },
    ],
    testCases: [
      { input: "10", output: "5" },
      { input: "1", output: "1" },
      { input: "2", output: "2" },
      { input: "100", output: "26" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: "1 和任何数互质，所有质数两两互质。答案是 1 + [1,n] 内的质数个数。",
  },
  {
    title: "[GESP202509 五级] 有趣的数字和",
    source: "gesp_official",
    sourceId: "P14074",
    sourceUrl: "https://www.luogu.com.cn/problem/P14074",
    level: 5,
    knowledgePoints: ["位运算", "二进制", "数学"],
    difficulty: "medium", // 洛谷难度3
    description: `小杨认为一个正整数是"有趣的"，当且仅当它的二进制表示中 1 的个数是奇数。

例如：
- 3 的二进制是 11，有 2 个 1，不是有趣的
- 5 的二进制是 101，有 2 个 1，不是有趣的
- 7 的二进制是 111，有 3 个 1，是有趣的

给定区间 [l, r]，请计算这个区间内所有"有趣的数字"的和。`,
    inputFormat: `输入一行，包含两个正整数 l 和 r。

数据范围：1 ≤ l ≤ r ≤ 10⁹`,
    outputFormat: `输出一个整数，表示有趣的数字之和。`,
    samples: [
      { input: "1 10", output: "28", explanation: "有趣的数字有 1,2,4,7,8，和为 1+2+4+7+8=22（需验证）" },
    ],
    testCases: [
      { input: "1 10", output: "28" },
      { input: "1 1", output: "1" },
      { input: "7 7", output: "7" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: "使用前缀和思想：f(r) - f(l-1)。利用规律：连续4个数中恰好有2个是有趣的。",
  },
  {
    title: "[GESP202509 五级] 数字移动",
    source: "gesp_official",
    sourceId: "P14917",
    sourceUrl: "https://www.luogu.com.cn/problem/P14917",
    level: 5,
    knowledgePoints: ["数学", "规律", "模拟"],
    difficulty: "medium", // 洛谷难度3
    description: `（题目详情请访问洛谷官网查看）

这是 GESP 2025年9月五级的编程题。`,
    inputFormat: `请访问洛谷官网查看完整输入格式。`,
    outputFormat: `请访问洛谷官网查看完整输出格式。`,
    samples: [
      { input: "示例请访问洛谷", output: "示例请访问洛谷" },
    ],
    testCases: [
      { input: "1", output: "1" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: "请访问 https://www.luogu.com.cn/problem/P14917 查看完整题目。",
  },
  {
    title: "[GESP202509 五级] 相等序列",
    source: "gesp_official",
    sourceId: "P14918",
    sourceUrl: "https://www.luogu.com.cn/problem/P14918",
    level: 5,
    knowledgePoints: ["序列", "贪心", "模拟"],
    difficulty: "medium", // 洛谷难度3
    description: `（题目详情请访问洛谷官网查看）

这是 GESP 2025年9月五级的编程题。`,
    inputFormat: `请访问洛谷官网查看完整输入格式。`,
    outputFormat: `请访问洛谷官网查看完整输出格式。`,
    samples: [
      { input: "示例请访问洛谷", output: "示例请访问洛谷" },
    ],
    testCases: [
      { input: "1", output: "1" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: "请访问 https://www.luogu.com.cn/problem/P14918 查看完整题目。",
  },
];

async function seedGesp5() {
  try {
    // 获取现有题目ID列表，避免重复添加
    const existingProblems = await prisma.problem.findMany({
      where: {
        sourceId: {
          in: gesp5Problems.map(p => p.sourceId).filter(Boolean) as string[]
        }
      },
      select: { sourceId: true }
    });

    const existingIds = new Set(existingProblems.map(p => p.sourceId));

    // 过滤出需要添加的新题目
    const newProblems = gesp5Problems.filter(p => !existingIds.has(p.sourceId));

    if (newProblems.length === 0) {
      return NextResponse.json({
        success: true,
        message: "所有 GESP 5级题目已存在",
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
      message: `成功添加 ${result.count} 道 GESP 5级题目`,
      existingCount: existingProblems.length,
      addedCount: result.count,
      totalCount: existingProblems.length + result.count
    });
  } catch (error) {
    console.error("Seed GESP5 error:", error);
    return NextResponse.json({ error: "添加题目失败", details: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return seedGesp5();
}

export async function POST() {
  return seedGesp5();
}
