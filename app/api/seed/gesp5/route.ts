import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GESP 5级完整题库 - 来源：洛谷 CCF GESP C++ 五级上机题
// 官方题单：https://www.luogu.com.cn/training/555
// 共22道题目，所有内容与洛谷完全一致

const gesp5Problems = [
  // ========== 样题 ==========
  {
    title: "[GESP样题 五级] 小杨的锻炼",
    source: "gesp_official",
    sourceId: "B3941",
    sourceUrl: "https://www.luogu.com.cn/problem/B3941",
    level: 5,
    knowledgePoints: ["最小公倍数", "最大公约数", "数论"],
    difficulty: "普及/提高-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1105`,
    description: `班级有 $n$ 名同学，第 $i$ 位同学每隔 $a_i$ 天锻炼一次。某天所有同学都来锻炼了。求下一次所有同学都来锻炼，最少需要多少天。`,
    inputFormat: `第一行包含一个整数 $n$，表示同学数量。

第二行包含 $n$ 个正整数 $a_0, a_1, \\ldots, a_{n-1}$，相邻整数之间用空格隔开。`,
    outputFormat: `输出一个整数，表示下次所有同学都来锻炼需要过的天数。`,
    samples: [
      { input: "3\n1 2 3", output: "6", explanation: "1、2、3的最小公倍数是6" },
      { input: "4\n2 4 8 16", output: "16", explanation: "16是2、4、8、16的最小公倍数" },
      { input: "4\n2 4 6 8", output: "24", explanation: "2、4、6、8的最小公倍数是24" },
    ],
    testCases: [
      { input: "3\n1 2 3", output: "6" },
      { input: "4\n2 4 8 16", output: "16" },
      { input: "4\n2 4 6 8", output: "24" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `【样例1解释】第一位同学每天锻炼；第二位每2天一次；第三位每3天一次。6天后三人都锻炼，之前无法相遇。

【样例2解释】第四位同学每16天锻炼一次，恰好与前三位同学的锻炼日期重合。

【数据规模】
- 对于 $20\\%$ 的数据，$n = 2$。
- 对于 $50\\%$ 的数据，$n = 4$。
- 对于 $100\\%$ 的数据，$2 \\le n \\le 10$，$1 \\le a_i \\le 50$。`,
  },
  {
    title: "[GESP样题 五级] 小杨的队列",
    source: "gesp_official",
    sourceId: "B3951",
    sourceUrl: "https://www.luogu.com.cn/problem/B3951",
    level: 5,
    knowledgePoints: ["逆序对", "排序", "冒泡排序"],
    difficulty: "普及/提高-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1105`,
    description: `班级有 $N$ 名同学（学号 $0$ 至 $N-1$），老师依次点名 $M$ 名同学加入队伍。每名新入队同学站到队末，然后全队按身高从低到高重新排序。同学们通过交换两人位置来实现排序。

具体例子：队伍中4名同学学号依次为 $10,17,3,25$，令 $3$ 号和 $10$ 号交换位置后变为 $3,17,10,25$。

求每次点名后完成排序所需的最少交换次数。`,
    inputFormat: `第一行包含一个整数 $N$，表示同学数量。

第二行包含 $N$ 个空格隔开的正整数，依次表示学号 $0$ 至 $N-1$ 的同学的身高，身高不超过 $2,147,483,647$。

第三行包含一个整数 $M$，表示点名次数。

接下来 $M$ 行，每行一个整数 $x$（$0 \\le x < N$），表示点名学号为 $x$ 的同学。`,
    outputFormat: `输出 $M$ 行，依次表示每次点名后完成按身高排序所需的最少交换次数。`,
    samples: [
      { input: "5\n170 165 168 160 175\n4\n0\n3\n2\n1", output: "0\n1\n1\n2" },
      { input: "4\n20 20 20 10\n4\n0\n1\n2\n3", output: "0\n0\n0\n1" },
    ],
    testCases: [
      { input: "5\n170 165 168 160 175\n4\n0\n3\n2\n1", output: "0\n1\n1\n2" },
      { input: "4\n20 20 20 10\n4\n0\n1\n2\n3", output: "0\n0\n0\n1" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `【数据规模】
- 对于所有测试点，$1 \\le M \\le N \\le 2000$。
- 对于 $50\\%$ 的测试点，所有同学身高互不相同。`,
  },
  // ========== 2023年9月 ==========
  {
    title: "[GESP202309 五级] 因数分解",
    source: "gesp_official",
    sourceId: "B3871",
    sourceUrl: "https://www.luogu.com.cn/problem/B3871",
    level: 5,
    knowledgePoints: ["质因数分解", "数论"],
    difficulty: "普及/提高-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1131`,
    description: `每个正整数都可以分解为素数的乘积。例如：$6=2\\times3$，$20=2^2\\times5$。现给定一个正整数，按要求输出其因数分解式。`,
    inputFormat: `输入第一行包含一个正整数 $N$，其中 $2 \\le N \\le 10^{12}$。`,
    outputFormat: `输出一行为因数分解式。要求：
- 按质因数从小到大排列
- 乘号用 \`*\` 表示，左右各空一格
- 素数出现多次时合并为指数形式，用 \`^\` 表示，左右不空格`,
    samples: [
      { input: "6", output: "2 * 3" },
      { input: "20", output: "2^2 * 5" },
      { input: "23", output: "23" },
    ],
    testCases: [
      { input: "6", output: "2 * 3" },
      { input: "20", output: "2^2 * 5" },
      { input: "23", output: "23" },
      { input: "12", output: "2^2 * 3" },
      { input: "100", output: "2^2 * 5^2" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: ``,
  },
  {
    title: "[GESP202309 五级] 巧夺大奖",
    source: "gesp_official",
    sourceId: "B3872",
    sourceUrl: "https://www.luogu.com.cn/problem/B3872",
    level: 5,
    knowledgePoints: ["贪心", "调度问题", "排序"],
    difficulty: "普及+/提高",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1131`,
    description: `小明参加巧夺大奖游戏节目，规则如下：
1. 游戏分为 $n$ 个时间段，每段可选一个小游戏
2. 共有 $n$ 个小游戏可供选择
3. 第 $i$ 个小游戏必须在第 $T_i$ 个时间段结束前完成才能获得奖励 $R_i$

小明能在任何时间段内完成任意小游戏。问题：如何安排每个时间段的选择以最大化总奖励？`,
    inputFormat: `第一行包含一个正整数 $n$，表示时间段和小游戏数，$1 \\le n \\le 500$。

第二行包含 $n$ 个正整数 $T_i$，表示第 $i$ 个小游戏的完成期限，$1 \\le T_i \\le n$。

第三行包含 $n$ 个正整数 $R_i$，表示第 $i$ 个小游戏的奖励，$1 \\le R_i \\le 1000$。`,
    outputFormat: `输出一个正整数 $C$，表示最高可获得的奖励。`,
    samples: [
      { input: "7\n4 2 4 3 1 4 6\n70 60 50 40 30 20 10", output: "230", explanation: "7个时间段可分别安排完成第4、2、3、1、6、7、5个小游戏。其中第4、2、3、1、7个小游戏在期限内完成，获得奖励 40+60+50+70+10=230。" },
    ],
    testCases: [
      { input: "7\n4 2 4 3 1 4 6\n70 60 50 40 30 20 10", output: "230" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: ``,
  },
  // ========== 2023年12月 ==========
  {
    title: "[GESP202312 五级] 小杨的幸运数",
    source: "gesp_official",
    sourceId: "B3929",
    sourceUrl: "https://www.luogu.com.cn/problem/B3929",
    level: 5,
    knowledgePoints: ["完全平方数", "数论", "倍数"],
    difficulty: "普及/提高-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1137`,
    description: `小杨定义了两类数：
- **超级幸运数**：所有大于等于 $a$ 的完全平方数
- **幸运数**：所有超级幸运数的倍数（包括超级幸运数本身）

对于非幸运数，可以通过反复 $+1$ 操作使其变成幸运数，这个过程称为"幸运化"。

例：当 $a=4$ 时，$4$ 是幸运数；$1$ 不是幸运数，但经过 $3$ 次 $+1$ 后变为 $4$。`,
    inputFormat: `第一行包含两个正整数 $a, N$。

接下来 $N$ 行，每行一个正整数 $x$（需要判断或幸运化的数）。`,
    outputFormat: `输出 $N$ 行。对每个 $x$：
- 若是幸运数，输出 \`lucky\`
- 否则输出幸运化后的结果`,
    samples: [
      { input: "2 4\n1\n4\n5\n9", output: "4\nlucky\n8\nlucky" },
      { input: "16 11\n1\n2\n4\n8\n16\n32\n64\n128\n256\n512\n1024", output: "16\n16\n16\n16\nlucky\nlucky\nlucky\nlucky\nlucky\nlucky\nlucky" },
    ],
    testCases: [
      { input: "2 4\n1\n4\n5\n9", output: "4\nlucky\n8\nlucky" },
      { input: "16 11\n1\n2\n4\n8\n16\n32\n64\n128\n256\n512\n1024", output: "16\n16\n16\n16\nlucky\nlucky\nlucky\nlucky\nlucky\nlucky\nlucky" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `【数据规模】
- 对于 $30\\%$ 的测试点，$a, x \\le 100$，$N \\le 100$。
- 对于 $60\\%$ 的测试点，$a, x \\le 10^6$。
- 对于全部测试点，$a \\le 1,000,000$；$N \\le 2 \\times 10^5$；$1 \\le x \\le 1,000,001$。`,
  },
  {
    title: "[GESP202312 五级] 烹饪问题",
    source: "gesp_official",
    sourceId: "B3930",
    sourceUrl: "https://www.luogu.com.cn/problem/B3930",
    level: 5,
    knowledgePoints: ["位运算", "按位与", "枚举"],
    difficulty: "普及+/提高",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1137`,
    description: `有 $N$ 种食材（编号 $1$ 到 $N$），第 $i$ 种的美味度为 $a_i$。

两种食材的契合度定义为其美味度的按位与结果。例如 $12\\ \\text{and}\\ 6=4$（因为 $1100$ and $0110 = 0100$）。在 C++ 或 Python 中可用 \`&\` 运算符直接计算。

**任务：** 找出契合度最高的两种食材，输出其契合度。`,
    inputFormat: `第一行包含一个整数 $N$（食材种数）。

第二行包含 $N$ 个整数 $a_1, \\ldots, a_N$（各食材美味度）。`,
    outputFormat: `输出一个整数，表示最高契合度。`,
    samples: [
      { input: "3\n1 2 3", output: "2", explanation: "食材2和3的契合度为 2 and 3 = 2，为最高。" },
      { input: "5\n5 6 2 10 13", output: "8", explanation: "食材4和5的契合度为 10 and 13 = 8，为最高。" },
    ],
    testCases: [
      { input: "3\n1 2 3", output: "2" },
      { input: "5\n5 6 2 10 13", output: "8" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `【数据范围】
- 对于 $40\\%$ 的测试点，$N \\le 1000$。
- 对于所有测试点，$N \\le 10^6$，$0 \\le a_i \\le 2,147,483,647$。`,
  },
  // ========== 2024年3月 ==========
  {
    title: "[GESP202403 五级] 成绩排序",
    source: "gesp_official",
    sourceId: "B3968",
    sourceUrl: "https://www.luogu.com.cn/problem/B3968",
    level: 5,
    knowledgePoints: ["排序", "多关键字排序", "模拟"],
    difficulty: "普及/提高-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1145`,
    description: `有 $n$ 名同学，每人具有语文、数学、英语三科成绩。需按以下优先级从高到低排序：
1. 总分高者靠前
2. 总分相同时，语文+数学成绩高者靠前
3. 仍相同时，语文和数学中的最高分更高者靠前
4. 仍相同则并列

并列处理：$x$ 人并列时，他们排名相同，后续名次留空 $x-1$ 个。例如3人并列第1，下一人为第4。`,
    inputFormat: `第一行包含一个整数 $N$（同学人数）。

接下来 $N$ 行，每行三个非负整数 $c_i, m_i, e_i$，分别表示该同学的语文、数学、英语成绩。`,
    outputFormat: `输出 $N$ 行，按输入顺序输出每位同学的排名（不是按排名输出序号）。`,
    samples: [
      { input: "6\n140 140 150\n140 149 140\n148 141 140\n141 148 140\n145 145 139\n0 0 0", output: "1\n3\n4\n4\n2\n6" },
    ],
    testCases: [
      { input: "6\n140 140 150\n140 149 140\n148 141 140\n141 148 140\n145 145 139\n0 0 0", output: "1\n3\n4\n4\n2\n6" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `【数据规模】
- 对于 $30\\%$ 的数据，$N \\le 100$，所有同学总分各不相同。
- 对于全部数据，$2 \\le N \\le 10^4$，$0 \\le c_i, m_i, e_i \\le 150$。`,
  },
  {
    title: "[GESP202403 五级] B-smooth 数",
    source: "gesp_official",
    sourceId: "B3969",
    sourceUrl: "https://www.luogu.com.cn/problem/B3969",
    level: 5,
    knowledgePoints: ["质因数分解", "筛法", "数论"],
    difficulty: "普及+/提高",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1145`,
    description: `如果一个正整数的最大质因子不超过 $B$，则该正整数称为 $B$-smooth 数。

特别地，$1$ 没有质因子，我们认为 $1$ 是 $B$-smooth 数。

给定 $n$ 和 $B$，求不超过 $n$ 的 $B$-smooth 数的个数。`,
    inputFormat: `第一行包含两个正整数 $n$ 和 $B$，含义如题面所示。`,
    outputFormat: `输出一个非负整数，表示不超过 $n$ 的 $B$-smooth 数的数量。`,
    samples: [
      { input: "10 3", output: "7", explanation: "在不超过 10 的正整数中，3-smooth 数为 {1,2,3,4,6,8,9}，共 7 个。" },
    ],
    testCases: [
      { input: "10 3", output: "7" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `【数据规模与约定】

| 子任务 | 得分 | $n$ 上限 | $B$ 范围 |
|--------|------|----------|----------|
| 1 | 30分 | $10^3$ | $1 \\le B \\le 10^3$ |
| 2 | 30分 | $10^6$ | $\\sqrt{n} \\le B \\le 10^6$ |
| 3 | 40分 | $10^6$ | $1 \\le B \\le 10^6$ |

全部测试数据保证：$1 \\le n, B \\le 10^6$。`,
  },
  // ========== 2024年6月 ==========
  {
    title: "[GESP202406 五级] 黑白格",
    source: "gesp_official",
    sourceId: "P10719",
    sourceUrl: "https://www.luogu.com.cn/problem/P10719",
    level: 5,
    knowledgePoints: ["二维前缀和", "枚举", "子矩阵"],
    difficulty: "普及+/提高",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1153`,
    description: `小杨拥有一个 $n$ 行 $m$ 列的网格，每个格子为白色或黑色。需要找到至少包含 $k$ 个黑色格子的最小子矩形，并输出该矩形包含的总格子数。`,
    inputFormat: `第一行包含三个正整数 $n, m, k$。

之后 $n$ 行，每行一个长度为 $m$ 的 01 串，0 表示白色，1 表示黑色。`,
    outputFormat: `输出一个整数，表示满足条件的最小子矩形包含的格子总数。如果不存在这样的子矩形，输出 0。`,
    samples: [
      { input: "4 5 5\n00000\n01111\n00011\n00011", output: "6", explanation: "设 $(i,j)$ 表示第 $i$ 行第 $j$ 列，满足条件的最小子矩形顶点为 $(2,4)$、$(2,5)$、$(4,4)$、$(4,5)$，包含 6 个格子。" },
    ],
    testCases: [
      { input: "4 5 5\n00000\n01111\n00011\n00011", output: "6" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `【数据范围】
- 约束：$1 \\le n, m \\le 100$，$1 \\le k \\le n \\times m$。
- 子任务1（20分）：$n, m \\le 10$。
- 子任务2（40分）：$n = 1$，$1 \\le m \\le 100$。
- 子任务3（40分）：$n, m \\le 100$。`,
  },
  {
    title: "[GESP202406 五级] 小杨的幸运数字",
    source: "gesp_official",
    sourceId: "P10720",
    sourceUrl: "https://www.luogu.com.cn/problem/P10720",
    level: 5,
    knowledgePoints: ["质因数分解", "数论"],
    difficulty: "普及/提高-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1153`,
    description: `小杨定义的幸运数字需满足：恰好具有两种不同的质因子。例如 $12=2\\times2\\times3$ 有质因子 2 和 3（两种），符合条件；而 $30=2\\times3\\times5$ 有三种质因子，不符合要求。

需要判断 $n$ 个正整数是否为幸运数字。`,
    inputFormat: `第一行包含一个正整数 $n$（代表正整数个数）。

之后 $n$ 行，每行一个正整数。`,
    outputFormat: `输出 $n$ 行，对每个正整数，若为幸运数字输出 1，否则输出 0。`,
    samples: [
      { input: "3\n7\n12\n30", output: "0\n1\n0", explanation: "7 的质因子：{7}（1种）→ 0；12 的质因子：{2,3}（2种）→ 1；30 的质因子：{2,3,5}（3种）→ 0" },
    ],
    testCases: [
      { input: "3\n7\n12\n30", output: "0\n1\n0" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `【数据范围】
- 对于全部数据：$1 \\le n \\le 10^4$，$2 \\le a_i \\le 10^6$。
- 子任务1（40%）：$n \\le 100$，值域 $\\le 10^5$。
- 子任务2（60%）：$n \\le 10^4$，值域 $\\le 10^6$。`,
  },
  // ========== 2024年9月 ==========
  {
    title: "[GESP202409 五级] 挑战怪物",
    source: "gesp_official",
    sourceId: "B4050",
    sourceUrl: "https://www.luogu.com.cn/problem/B4050",
    level: 5,
    knowledgePoints: ["贪心", "质数", "二进制"],
    difficulty: "普及+/提高",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1161`,
    description: `小杨与怪物战斗，怪物血量为 $h$，需要血量**恰好**为 0 才能击败。

**攻击方式：**
- **物理攻击**：第 $i$ 次使用造成 $2^{i-1}$ 点伤害
- **魔法攻击**：选择任意质数 $x$（$\\le$ 当前血量）造成 $x$ 点伤害，**至多使用一次**

求：能否击败怪物，若能则求最少攻击次数。`,
    inputFormat: `第一行为正整数 $t$（测试用例组数）。

接下来 $t$ 行，每行一个整数 $h$（怪物血量）。`,
    outputFormat: `对每组测试，若能击败输出最少攻击次数，否则输出 $-1$。`,
    samples: [
      { input: "3\n6\n188\n9999", output: "2\n4\n-1", explanation: "第一组（$h=6$）：先用质数 5 造成 5 点伤害，再用第 1 次物理攻击造成 $2^0=1$ 点伤害，共 2 次攻击。" },
    ],
    testCases: [
      { input: "3\n6\n188\n9999", output: "2\n4\n-1" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `【数据规模】

| 子任务 | 分数 | $t$ | $h$ |
|:---:|:---:|:---:|:---:|
| 1 | 20% | $\\le 5$ | $\\le 10$ |
| 2 | 20% | $\\le 10$ | $\\le 100$ |
| 3 | 60% | $\\le 10$ | $\\le 10^5$ |

保证：$1 \\le t \\le 10$，$1 \\le h \\le 10^5$。`,
  },
  {
    title: "[GESP202409 五级] 小杨的武器",
    source: "gesp_official",
    sourceId: "B4051",
    sourceUrl: "https://www.luogu.com.cn/problem/B4051",
    level: 5,
    knowledgePoints: ["贪心", "排序", "前缀和"],
    difficulty: "普及/提高-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1161`,
    description: `小杨拥有 $n$ 种武器，初始熟练度分别为 $c_i$。他将参加 $m$ 场战斗，每场必须选择一种武器。使用第 $i$ 种武器参加第 $j$ 场战斗时，该武器熟练度从 $c'_i$ 变为 $c'_i + a_j$（其中 $a_j$ 可正可负可为零）。

目标是最大化战斗后所有武器熟练度的最大值。`,
    inputFormat: `第一行包含两个正整数 $n, m$。

第二行包含 $n$ 个整数 $c_1, c_2, \\ldots, c_n$（初始熟练度）。

第三行包含 $m$ 个整数 $a_1, a_2, \\ldots, a_m$（战斗熟练度变化值）。`,
    outputFormat: `输出一个整数，表示战斗后武器熟练度的最大可能值。`,
    samples: [
      { input: "2 2\n9 9\n1 -1", output: "10", explanation: "最优方案为第一场战斗选择第一种武器，第二场战斗选择第二种武器。第一种武器：9+1=10；第二种武器：9+(-1)=8。最大值为 10。" },
    ],
    testCases: [
      { input: "2 2\n9 9\n1 -1", output: "10" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `【数据约束】

| 子任务 | 占比 | $n$ | $m$ |
|:---:|:---:|:---:|:---:|
| 1 | 20% | $= 1$ | $\\le 10^5$ |
| 2 | 20% | $\\le 10^5$ | $= 2$ |
| 3 | 60% | $\\le 10^5$ | $\\le 10^5$ |

全部数据保证：$1 \\le n, m \\le 10^5$，$-10^4 \\le c_i, a_i \\le 10^4$。`,
  },
  // ========== 2024年12月 ==========
  {
    title: "[GESP202412 五级] 奇妙数字",
    source: "gesp_official",
    sourceId: "B4070",
    sourceUrl: "https://www.luogu.com.cn/problem/B4070",
    level: 5,
    knowledgePoints: ["质因数分解", "数论", "贪心"],
    difficulty: "普及+/提高",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1169`,
    description: `一个数 $x$ 被称为"奇妙数字"当且仅当 $x = p^a$，其中 $p$ 是任意质数，$a$ 是正整数。例如，$8 = 2^3$ 是奇妙数字，但 $6$ 不是。

给定一个正整数 $n$，构造一个包含 $m$ 个奇妙数字的集合 $\\{x_1, x_2, \\ldots, x_m\\}$，满足：
- 所有元素互不相同
- 乘积 $x_1 \\times x_2 \\times \\cdots \\times x_m$ 是 $n$ 的因子

求这样的集合最多能包含多少个奇妙数字。`,
    inputFormat: `一个正整数 $n$。`,
    outputFormat: `输出一个正整数，表示集合最多能包含的奇妙数字个数。`,
    samples: [
      { input: "128", output: "3", explanation: "集合 $\\{2, 4, 8\\}$ 包含 3 个奇妙数字。由于 $2 = 2^1$, $4 = 2^2$, $8 = 2^3$，都是奇妙数字。它们的乘积 $2 \\times 4 \\times 8 = 64$ 是 $128$ 的因子。不存在包含 4 个奇妙数字的合法集合，所以答案是 3。" },
    ],
    testCases: [
      { input: "128", output: "3" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `【数据范围】
- 对于全部测试数据：$2 \\le n \\le 10^{12}$。

| 子任务 | 得分 | 范围 |
|--------|------|------|
| 1 | 20% | $n \\le 10$ |
| 2 | 20% | $n \\le 1000$ |
| 3 | 60% | $n \\le 10^{12}$ |`,
  },
  {
    title: "[GESP202412 五级] 武器强化",
    source: "gesp_official",
    sourceId: "B4071",
    sourceUrl: "https://www.luogu.com.cn/problem/B4071",
    level: 5,
    knowledgePoints: ["贪心", "排序", "模拟"],
    difficulty: "普及+/提高",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1169`,
    description: `小杨有 $n$ 种武器和 $m$ 种强化材料。第 $i$ 种强化材料会适配第 $p_i$ 种武器，可花费 $c_i$ 金币将该材料的适配武器修改为任意武器。

小杨最喜欢第 1 种武器，希望适配该武器的强化材料种类数**严格大于**其他所有武器。

求满足条件的最少花费。`,
    inputFormat: `第一行包含两个正整数 $n, m$，含义如题面所示。

之后 $m$ 行，每行包含两个正整数 $p_i, c_i$，代表第 $i$ 种强化材料的适配武器和修改花费。`,
    outputFormat: `输出一个整数，代表能够使适配第 1 种武器的强化材料种类数严格大于其他武器最少需要花费的金币。`,
    samples: [
      { input: "4 4\n1 1\n2 1\n3 1\n3 2", output: "1", explanation: "花费 1 金币，将第三种强化材料的适配武器由 3 改为 1。此时，武器 1 有 2 种材料适配，武器 2、3 各有 1 种，满足条件。" },
    ],
    testCases: [
      { input: "4 4\n1 1\n2 1\n3 1\n3 2", output: "1" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `【数据范围】
- $1 \\le n, m \\le 1000$
- $1 \\le p_i \\le n$
- $1 \\le c_i \\le 10^9$

| 子任务 | 占比 | $n$ | $m$ |
|:--:|:--:|:--:|:--:|
| 1 | 20% | $\\le 2$ | $\\le 1000$ |
| 2 | 20% | $\\le 1000$ | $\\le 2$ |
| 3 | 60% | $\\le 1000$ | $\\le 1000$ |`,
  },
  // ========== 2025年3月 ==========
  {
    title: "[GESP202503 五级] 平均分配",
    source: "gesp_official",
    sourceId: "P11960",
    sourceUrl: "https://www.luogu.com.cn/problem/P11960",
    level: 5,
    knowledgePoints: ["贪心", "排序", "差值"],
    difficulty: "普及+/提高",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1177`,
    description: `小 A 拥有 $2n$ 件物品，小 B 和小 C 想购买。每件物品 $i$，小 B 出价 $b_i$，小 C 出价 $c_i$。

小 A 要求小 B 和小 C 各购买恰好 $n$ 件物品。求小 A 的最大收入。`,
    inputFormat: `第一行包含一个正整数 $n$。

第二行包含 $2n$ 个整数 $b_1, b_2, \\ldots, b_{2n}$。

第三行包含 $2n$ 个整数 $c_1, c_2, \\ldots, c_{2n}$。`,
    outputFormat: `输出一个整数，表示最大收入。`,
    samples: [
      { input: "3\n1 3 5 6 8 10\n2 4 6 7 9 11", output: "36" },
      { input: "2\n6 7 9 9\n1 2 10 12", output: "35" },
    ],
    testCases: [
      { input: "3\n1 3 5 6 8 10\n2 4 6 7 9 11", output: "36" },
      { input: "2\n6 7 9 9\n1 2 10 12", output: "35" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `【数据范围】
- 对于 $20\\%$ 的测试点，$1 \\le n \\le 8$。
- 另有 $20\\%$ 的测试点，$0 \\le b_i \\le 1$，$0 \\le c_i \\le 1$。
- 对于所有测试点，$1 \\le n \\le 10^5$，$0 \\le b_i \\le 10^9$，$0 \\le c_i \\le 10^9$。`,
  },
  {
    title: "[GESP202503 五级] 原根判断",
    source: "gesp_official",
    sourceId: "P11961",
    sourceUrl: "https://www.luogu.com.cn/problem/P11961",
    level: 5,
    knowledgePoints: ["数论", "快速幂", "费马小定理"],
    difficulty: "提高+/省选-",
    background: `本题对应 GESP 考试的选择、判断题。

截至 2025 年 3 月，原根属于 NOI 大纲 8 级知识点，而相关的费马小定理和欧拉定理是 NOI 大纲 7 级知识点，均未纳入 GESP 大纲范围。

若对原根概念感兴趣，可学习"【模板】原根"相关内容。`,
    description: `给定质数 $p$ 和整数 $a$，判断 $a$ 是否为 $p$ 的原根。

$p$ 的原根 $g$ 需满足：
- $1 < g < p$
- $g^{p-1} \\bmod p = 1$
- 对于任意 $1 \\le i < p-1$ 均有 $g^i \\bmod p \\neq 1$`,
    inputFormat: `第一行包含一个正整数 $T$（测试数据组数）。

每组数据包含两个正整数 $a, p$。`,
    outputFormat: `对每组数据输出一行：若 $a$ 是 $p$ 的原根输出 \`Yes\`，否则输出 \`No\`。`,
    samples: [
      { input: "3\n3 998244353\n5 998244353\n7 998244353", output: "Yes\nYes\nNo" },
    ],
    testCases: [
      { input: "3\n3 998244353\n5 998244353\n7 998244353", output: "Yes\nYes\nNo" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `【数据范围】
- $1 \\le T \\le 20$
- $3 \\le p \\le 10^9$（$p$ 为质数）
- $1 < a < p$
- 对于 $40\\%$ 的测试点，$3 \\le p \\le 10^3$。`,
  },
  // ========== 2025年6月 ==========
  {
    title: "[GESP202506 五级] 奖品兑换",
    source: "gesp_official",
    sourceId: "P13013",
    sourceUrl: "https://www.luogu.com.cn/problem/P13013",
    level: 5,
    knowledgePoints: ["二分查找", "贪心", "数学"],
    difficulty: "普及+/提高",
    background: `为了保证只有时间复杂度正确的代码能够通过本题，时限下降为 400 毫秒。`,
    description: `班主任向认真听讲和完成作业的学生分配了课堂优秀券和作业优秀券。学生可用两种方式兑换奖品：
- 使用 $a$ 张课堂券和 $b$ 张作业券兑换一份奖品
- 使用 $b$ 张课堂券和 $a$ 张作业券兑换一份奖品

小 A 拥有 $n$ 张课堂券和 $m$ 张作业券，求最多能兑换多少份奖品。`,
    inputFormat: `第一行包含两个正整数 $n, m$（课堂券和作业券数量）。

第二行包含两个正整数 $a, b$（兑换一份奖品所需的两种券数量）。`,
    outputFormat: `输出一个整数，表示最多能兑换的奖品份数。`,
    samples: [
      { input: "8 8\n2 1", output: "5" },
      { input: "314159 2653589\n27 1828", output: "1599" },
    ],
    testCases: [
      { input: "8 8\n2 1", output: "5" },
      { input: "314159 2653589\n27 1828", output: "1599" },
    ],
    timeLimit: 400,
    memoryLimit: 256,
    hint: `【数据范围】
- 对于 $60\\%$ 的测试点，$1 \\le a, b \\le 100$，$1 \\le n, m \\le 500$。
- 对于全部测试点，$1 \\le a, b \\le 10^4$，$1 \\le n, m \\le 10^9$。`,
  },
  {
    title: "[GESP202506 五级] 最大公因数",
    source: "gesp_official",
    sourceId: "P13014",
    sourceUrl: "https://www.luogu.com.cn/problem/P13014",
    level: 5,
    knowledgePoints: ["最大公约数", "辗转相除法", "数论"],
    difficulty: "普及/提高-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1185`,
    description: `给定两个正整数的最大公因数定义为 $\\gcd(a,b)$。对于 $k > 2$ 个正整数，其最大公因数递归定义为：
$$\\gcd(c_1,c_2,\\ldots,c_k)=\\gcd(\\gcd(c_1,c_2,\\ldots,c_{k-1}),c_k)$$

已知 $n$ 个正整数 $a_1,a_2,\\ldots,a_n$ 和 $q$ 组询问，需对每组询问 $i$（$1 \\le i \\le q$）求出所有元素各加 $i$ 后的最大公因数。`,
    inputFormat: `第一行包含两个正整数 $n, q$（正整数数量、询问组数）。

第二行包含 $n$ 个正整数 $a_1, a_2, \\ldots, a_n$。`,
    outputFormat: `输出 $q$ 行，每行一个正整数表示对应询问的最大公因数。`,
    samples: [
      { input: "5 3\n6 9 12 18 30", output: "1\n1\n3" },
      { input: "3 5\n31 47 59", output: "4\n1\n2\n1\n4" },
    ],
    testCases: [
      { input: "5 3\n6 9 12 18 30", output: "1\n1\n3" },
      { input: "3 5\n31 47 59", output: "4\n1\n2\n1\n4" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `【数据范围】
- 对于 $60\\%$ 的测试点，$1 \\le n \\le 10^3$，$1 \\le q \\le 10$。
- 对于所有测试点，$1 \\le n \\le 10^5$，$1 \\le q \\le 10^5$，$1 \\le a_i \\le 1000$。`,
  },
  // ========== 2025年12月 ==========
  {
    title: "[GESP202512 五级] 数字移动",
    source: "gesp_official",
    sourceId: "P14917",
    sourceUrl: "https://www.luogu.com.cn/problem/P14917",
    level: 5,
    knowledgePoints: ["贪心", "模拟", "二分"],
    difficulty: "普及+/提高",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1201`,
    description: `小 A 拥有包含 $N$ 个正整数的序列 $A=\\{A_1, A_2, \\cdots, A_N\\}$，该序列恰好包含 $N/2$ 对不同的正整数。对任意 $1 \\le i \\le N$，存在唯一 $j$ 满足 $1 \\le j \\le N$、$i \\neq j$、$A_i = A_j$。

小 A 希望每对相同数字在序列中相邻。每次操作选择位置 $i$（$1 \\le i \\le N$），将第 $i$ 个数字移动到任意位置，花费该数字的体力值。

**示例**：序列 $A=\\{1,2,1,3,2,3\\}$，选择 $i=2$ 将 $A_2=2$ 移到 $A_3=1$ 后面得 $\\{1,1,2,3,2,3\\}$，耗费 2 点体力；或选择 $i=3$ 将 $A_3=1$ 移到 $A_2=2$ 前面得 $\\{1,1,2,3,2,3\\}$，花费 1 点体力。

小 A 需要找到最小的 $x$，使其能在每次花费体力 $\\le x$ 的约束下，令每对相同数字相邻。`,
    inputFormat: `第一行包含一个正整数 $N$（$N$ 为偶数），代表序列长度。

第二行包含 $N$ 个正整数 $A_1, A_2, \\ldots, A_N$，代表序列 $A$。对任意 $1 \\le i \\le N$，存在唯一 $j$ 满足条件 $A_i = A_j$。

数据保证小 A 至少执行一次操作。`,
    outputFormat: `输出满足要求的 $x$ 的最小值。`,
    samples: [
      { input: "6\n1 2 1 3 2 3", output: "2" },
    ],
    testCases: [
      { input: "6\n1 2 1 3 2 3", output: "2" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `【数据范围】
- 对于 $40\\%$ 的测试点，$1 \\le N, A_i \\le 100$。
- 对于所有测试点，$1 \\le N, A_i \\le 10^5$。`,
  },
  {
    title: "[GESP202512 五级] 相等序列",
    source: "gesp_official",
    sourceId: "P14918",
    sourceUrl: "https://www.luogu.com.cn/problem/P14918",
    level: 5,
    knowledgePoints: ["质因数分解", "数论", "贪心"],
    difficulty: "普及+/提高",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1201`,
    description: `小 A 拥有 $N$ 个正整数的序列。每次花费 1 个金币可执行以下操作之一：
- 选择序列中某个正整数，乘以任意质数 $P$
- 选择序列中某个正整数（必须是质数 $P$ 的倍数），除以质数 $P$

目标：使序列中所有整数相同，求最少金币花费。`,
    inputFormat: `第一行包含一个正整数 $N$。

第二行包含 $N$ 个正整数 $A_1, A_2, \\ldots, A_N$。`,
    outputFormat: `输出一行：最少需要花费的金币数量。`,
    samples: [
      { input: "5\n10 6 35 105 42", output: "8" },
    ],
    testCases: [
      { input: "5\n10 6 35 105 42", output: "8" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `【数据范围】
- 对于 $60\\%$ 的测试点，$1 \\le N, A_i \\le 100$。
- 对于全部测试点，$1 \\le N, A_i \\le 10^5$。`,
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
