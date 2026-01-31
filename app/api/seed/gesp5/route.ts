import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GESP 5级完整题库 - 来源：洛谷 CCF GESP C++ 五级上机题
// 官方题单：https://www.luogu.com.cn/training/555
// 所有内容与洛谷100%一致

const gesp5Problems = [
  // ========== 样题 ==========
  {
    title: "[GESP样题 五级] 小杨的锻炼",
    source: "gesp_official",
    sourceId: "B3941",
    sourceUrl: "https://www.luogu.com.cn/problem/B3941",
    level: 5,
    knowledgePoints: ["最小公倍数", "最大公约数", "数论"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1105`,
    description: `小杨的班级里共有 $n$ 名同学，每位同学都有各自的锻炼习惯。具体来说，第 $i$ 位同学每隔 $a\\_i$ 天就会进行一次锻炼（也就是说，每次锻炼会在上一次锻炼的 $a\\_i$ 天后进行）。某一天，班上的 $n$ 名同学恰好都来进行了锻炼。他们对此兴奋不已，想要计算出下一次所有同学都来锻炼，至少要过多少天。`,
    inputFormat: `第一行一个整数 $n$，表示同学的数量。

第二行 $n$ 个用空格隔开的正整数，依次为 $a\\_0, a\\_1, \\ldots, a\\_{n-1}$。`,
    outputFormat: `输出一个整数，表示下一次所有同学都来锻炼，至少要过多少天。`,
    samples: [
      { input: "3\n1 2 3", output: "6" },
      { input: "4\n2 4 8 16", output: "16" },
      { input: "4\n2 4 6 8", output: "24" },
    ],
    testCases: [
      { input: "3\n1 2 3", output: "6" },
      { input: "4\n2 4 8 16", output: "16" },
      { input: "4\n2 4 6 8", output: "24" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `**【样例解释 #1】**

第一位同学每天都要锻炼，第二位同学每隔两天会锻炼一次，第三位同学每隔三天会锻炼一次。在 $6$ 天后，三位同学都会来锻炼。可以证明，在第 $6$ 天前，不存在一天满足三位同学都会进行锻炼。

**【样例解释 #2】**

第四位同学每隔 $16$ 天锻炼一次，$16$ 天后他来锻炼，其他三位同学也恰好会来锻炼。

**【数据范围】**

对于 $20\\%$ 的数据，$n = 2$。

对于 $50\\%$ 的数据，$n = 4$。

对于 $100\\%$ 的数据，$2 \\le n \\le 10$，$1 \\le a\\_i \\le 50$。`,
  },
  {
    title: "[GESP样题 五级] 小杨的队列",
    source: "gesp_official",
    sourceId: "B3951",
    sourceUrl: "https://www.luogu.com.cn/problem/B3951",
    level: 5,
    knowledgePoints: ["逆序对", "排序", "冒泡排序"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1105`,
    description: `小杨是班级的体育委员。在一节体育课上，老师让小杨组织 $N$ 名同学（学号为 $0$ 至 $N - 1$）排成一列做体操。老师要求同学们按照身高从低到高排列。

老师会依次点名 $M$ 次，每次点名一名同学。该同学需要加入队伍。为保持身高顺序，同学们会通过两两交换位置的方式重新排列。每次交换只能交换相邻两位同学的位置。

小杨作为体育委员，需要在每一名同学加入队伍后，计算最少需要多少次交换才能使整个队伍恢复成身高从低到高的顺序。

需要注意的是，每次点名的同学会站到队伍的最后一位，然后队伍才会开始重新排序。`,
    inputFormat: `第一行包含一个整数 $N$，表示同学数量。

第二行包含 $N$ 个空格隔开的正整数，依次表示学号 $0$ 至 $N-1$ 的同学的身高。身高不超过 $2,147,483,647$。

第三行包含一个整数 $M$，表示点名次数。

接下来 $M$ 行，每行一个整数 $x$（$0 \\le x < N$），表示点名学号为 $x$ 的同学。`,
    outputFormat: `输出 $M$ 行，依次表示每次点名后，最少需要多少次交换才能使整个队伍保持身高从低到高的顺序。`,
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
    hint: `**【数据范围】**

对于所有测试点，$1 \\le M \\le N \\le 2000$。

对于 $50\\%$ 的测试点，所有同学身高互不相同。`,
  },
  // ========== 2023年9月 ==========
  {
    title: "[GESP202309 五级] 因数分解",
    source: "gesp_official",
    sourceId: "B3871",
    sourceUrl: "https://www.luogu.com.cn/problem/B3871",
    level: 5,
    knowledgePoints: ["质因数分解", "数论"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1131`,
    description: `每个正整数都可以表示成素数（质数）的乘积。例如，$6 = 2 \\times 3$，$20 = 2^2 \\times 5$。现在，给定一个正整数，请输出它的因数分解式。`,
    inputFormat: `输入第一行，包含一个正整数 $N$。约定 $2 \\le N \\le 10^{12}$。`,
    outputFormat: `输出一行，为 $N$ 的因数分解式。要求按素数由小到大排列；乘号用星号 \`*\` 表示，星号左右各空一格；当且仅当一个素数出现多次时，将它们合并为指数形式，指数用上箭头 \`^\` 表示，箭头左右不空格。`,
    samples: [
      { input: "6", output: "2 * 3" },
      { input: "20", output: "2^2 * 5" },
      { input: "23", output: "23" },
    ],
    testCases: [
      { input: "6", output: "2 * 3" },
      { input: "20", output: "2^2 * 5" },
      { input: "23", output: "23" },
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
    difficulty: "普及/提高-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1131`,
    description: `小明参加一档名为"巧夺大奖"的综艺节目，游戏规则如下：

1. 整个游戏分为 $n$ 个时间段。每个时间段，小明可以选择一个小游戏参加（也可以不参加）。
2. 共有 $n$ 个小游戏可供选择。
3. 第 $i$ 个小游戏需要在第 $T\\_i$ 个时间段结束之前（包括第 $T\\_i$ 个时间段）完成，否则不能领取奖励。完成第 $i$ 个小游戏可获得奖励 $R\\_i$。

假设小明足够聪明，每个小游戏都在一个时间段内完成。请问小明最多可获得多少奖励？`,
    inputFormat: `第一行包含一个正整数 $n$，表示时间段数和小游戏数。$1 \\le n \\le 500$。

第二行包含 $n$ 个正整数 $T\\_i$，表示第 $i$ 个小游戏的完成期限。$1 \\le T\\_i \\le n$。

第三行包含 $n$ 个正整数 $R\\_i$，表示第 $i$ 个小游戏的奖励。$1 \\le R\\_i \\le 1000$。`,
    outputFormat: `输出一个正整数 $C$，表示小明最高可以获得的奖励。`,
    samples: [
      { input: "7\n4 2 4 3 1 4 6\n70 60 50 40 30 20 10", output: "230" },
    ],
    testCases: [
      { input: "7\n4 2 4 3 1 4 6\n70 60 50 40 30 20 10", output: "230" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `**【样例解释】**

$7$ 个时间段分别完成第 $4$、$2$、$3$、$1$、$6$、$7$、$5$ 个小游戏。其中，第 $4$、$2$、$3$、$1$、$7$ 个小游戏在期限内完成，可以获得奖励。奖励总计 $40 + 60 + 50 + 70 + 10 = 230$。`,
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
    description: `小杨认为，所有大于等于 $a$ 的完全平方数都是他的超级幸运数。

小杨还认为，所有超级幸运数的倍数都是他的幸运数。自然地，小杨的所有超级幸运数也都是幸运数。

对于一个非幸运数，小杨规定，可以将它一直 $+1$，直到它变成一个幸运数。我们把这个过程叫做幸运化。例如，如果 $a=4$，那么 $4$ 是最小的幸运数，而 $1$ 不是，但我们可以连续对 $1$ 做 $3$ 次 $+1$ 操作，使其变为 $4$，所以我们可以说， $1$ 幸运化后的结果是 $4$。

现在，小杨给出 $N$ 个数，请你首先判断它们是不是幸运数；接着，对于非幸运数，请你将它们幸运化。`,
    inputFormat: `第一行 $2$ 个正整数 $a, N$。

接下来 $N$ 行，每行一个正整数 $x$ ，表示需要判断（幸运化）的数。`,
    outputFormat: `输出 $N$ 行，对于每个给定的 $x$ ，如果它是幸运数，请输出 \`lucky\`，否则请输出将其幸运化后的结果。`,
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
    hint: `**样例解释 1**

$1$ 虽然是完全平方数，但它小于 $a$，因此它并不是超级幸运数，也不是幸运数。将其进行 $3$ 次 $+1$ 操作后，最终得到幸运数 $4$。

$4$ 是幸运数，因此直接输出 \`lucky\`。

$5$ 不是幸运数，将其进行 $3$ 次 $+1$ 操作后，最终得到幸运数 $8$。

$9$ 是幸运数，因此直接输出 \`lucky\` 。

**数据规模**

对于 $30\\%$ 的测试点，保证 $a,x \\le 100,N \\le 100$。

对于 $60\\%$ 的测试点，保证 $a,x \\le 10^6$。

对于所有测试点，保证 $a \\le 1,000,000$；保证 $N \\le 2 \\times 10^5$；保证 $1 \\le x \\le 1,000,001$。`,
  },
  {
    title: "[GESP202312 五级] 烹饪问题",
    source: "gesp_official",
    sourceId: "B3930",
    sourceUrl: "https://www.luogu.com.cn/problem/B3930",
    level: 5,
    knowledgePoints: ["位运算", "按位与", "枚举"],
    difficulty: "普及/提高-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1137`,
    description: `有 $N$ 种食材，编号从 $1$ 至 $N$，其中第 $i$ 种食材的美味度为 $a\\_i$。

不同食材之间的组合可能产生奇妙的化学反应。具体来说，如果两种食材的美味度分别为 $x$ 和 $y$ ，那么它们的契合度为 $x\\ \\text{and}\\ y $。

其中，$\\text{and}$ 运算为按位与运算，需要先将两个运算数转换为二进制，然后在高位补足，再逐位进行与运算。例如，$12$ 与 $6$ 的二进制表示分别为 $1100$ 和 $0110$，将它们逐位进行与运算，得到 $0100$，转换为十进制得到 4，因此 $12\\ \\text{and}\\ 6 = 4$。**在 C++ 或 Python 中，可以直接使用 \`&\` 运算符表示与运算。**

现在，请你找到契合度最高的两种食材，并输出它们的契合度。`,
    inputFormat: `第一行一个整数 $N$，表示食材的种数。

接下来一行 $N$ 个用空格隔开的整数，依次为 $a\\_1,\\cdots,a\\_N$，表示各种食材的美味度。`,
    outputFormat: `输出一行一个整数，表示最高的契合度。`,
    samples: [
      { input: "3\n1 2 3", output: "2" },
      { input: "5\n5 6 2 10 13", output: "8" },
    ],
    testCases: [
      { input: "3\n1 2 3", output: "2" },
      { input: "5\n5 6 2 10 13", output: "8" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `**【样例解释 #1】**

编号为 $2,3$ 的食材之间的契合度为 $2\\ \\text{and}\\ 3=2$，是所有食材两两之间最高的契合度。

**【样例解释 #2】**

编号为 $4,5$ 的食材之间的契合度为 $10\\ \\text{and}\\ 13=8$，是所有食材两两之间最高的契合度。

**【数据范围】**

对于 $40\\%$ 的测试点，保证 $N \\le 1,000$。

对于所有测试点，保证 $N \\le 10^6$，$0 \\le a\\_i \\le 2,147,483,647$。`,
  },
  // ========== 2024年3月 ==========
  {
    title: "[GESP202403 五级] 成绩排序",
    source: "gesp_official",
    sourceId: "B3968",
    sourceUrl: "https://www.luogu.com.cn/problem/B3968",
    level: 5,
    knowledgePoints: ["排序", "多关键字排序", "模拟"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1145`,
    description: `有 $n$ 名同学，每名同学有语文、数学、英语三科成绩，你需要按照如下规则对所有同学的成绩从高到低排序：

1. 比较总分，高者靠前；
2. 如果总分相同，则比较语文和数学两科的总分，高者靠前；
3. 如果仍相同，则比较语文和数学两科的最高分，高者靠前；
4. 如果仍相同，则二人并列。

现在请你输出每位同学的排名。如果有 $x$ 人并列，那么这 $x$ 人的排名相同，并且需要把后面的 $x - 1$ 个名次空出来。`,
    inputFormat: `第一行一个整数 $N$，表示同学的人数。

接下来 $N$ 行，每行三个非负整数 $c\\_i, m\\_i, e\\_i$ 分别表示该名同学的语文、数学、英语成绩。`,
    outputFormat: `输出 $N$ 行，按输入同学的顺序，输出他们的排名。**注意：请不要按排名输出同学的序号，而是按同学的顺序输出他们各自的排名。**`,
    samples: [
      { input: "6\n140 140 150\n140 149 140\n148 141 140\n141 148 140\n145 145 139\n0 0 0", output: "1\n3\n4\n4\n2\n6" },
    ],
    testCases: [
      { input: "6\n140 140 150\n140 149 140\n148 141 140\n141 148 140\n145 145 139\n0 0 0", output: "1\n3\n4\n4\n2\n6" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对 $30\\%$ 的数据，$N \\leq 100$，且所有同学总分各不相同。

对全部的测试数据，保证 $2 \\leq N \\leq 10^4$，$0 \\leq c\\_i, m\\_i, e\\_i \\leq 150$。`,
  },
  {
    title: "[GESP202403 五级] B-smooth 数",
    source: "gesp_official",
    sourceId: "B3969",
    sourceUrl: "https://www.luogu.com.cn/problem/B3969",
    level: 5,
    knowledgePoints: ["质因数分解", "筛法", "数论"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1145`,
    description: `小杨同学想寻找一种名为 $ B $-smooth 数的正整数。

如果一个正整数的最大质因子不超过 $ B $，则该正整数为 $ B $-smooth 数。

特别地，$1$ 没有质因子，我们认为 $1$ 是 $ B $-smooth 数。

小杨同学想知道，对于给定的 $ n $ 和 $ B $，有多少个不超过 $ n $ 的 $ B $-smooth 数。`,
    inputFormat: `第一行包含两个正整数 $ n $ 和 $ B $，含义如题面所示。`,
    outputFormat: `输出一个非负整数，表示不超过 $ n $ 的 $ B $-smooth 数的数量。`,
    samples: [
      { input: "10 3", output: "7" },
    ],
    testCases: [
      { input: "10 3", output: "7" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `### 样例解释

在不超过 $10$ 的正整数中，$3$-smooth 数有 $\\{1,2,3,4,6,8,9\\}$，共 $7$ 个。

### 数据规模与约定

| 子任务 | 得分 | $n \\leq $ | $B$ |
| :-: | :-: | :-: | :-: |
| $1$ | $30$ | $10^3$ | $1 \\leq B \\leq 10^3$ |
| $2$ | $30$ | $10^6$ | $\\sqrt n \\leq B \\leq 10^6$ |
| $3$ | $40$ | $10^6$ | $1 \\leq B \\leq 10^6$ |

对全部的测试数据，保证 $1 \\leq n, B \\leq 10^6$。`,
  },
  // ========== 2024年6月 ==========
  {
    title: "[GESP202406 五级] 黑白格",
    source: "gesp_official",
    sourceId: "P10719",
    sourceUrl: "https://www.luogu.com.cn/problem/P10719",
    level: 5,
    knowledgePoints: ["二维前缀和", "枚举", "子矩阵"],
    difficulty: "普及/提高-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1153`,
    description: `小杨有一个 $n$ 行 $m$ 列的网格图，其中每个格子要么是白色，要么是黑色。小杨想知道至少包含 $k$ 个黑色格子的最小子矩形包含了多少个格子。`,
    inputFormat: `第一行包含三个正整数 $n,m,k$，含义如题面所示。

之后 $n$ 行，每行一个长度为 $m$ 的 $\\texttt{01}$ 串，代表网格图第 $i$ 行格子的颜色，如果为 $\\texttt{0}$，则对应格子为白色，否则为黑色。`,
    outputFormat: `输出一个整数，代表至少包含 $k$ 个黑色格子的最小子矩形包含格子的数量，如果不存在则输出 $0$。`,
    samples: [
      { input: "4 5 5\n00000\n01111\n00011\n00011", output: "6" },
    ],
    testCases: [
      { input: "4 5 5\n00000\n01111\n00011\n00011", output: "6" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `**【样例解释】**

至少包含 $5$ 个黑色格子的最小子矩形的四个顶点为 $(2,4)$，$(2,5)$，$(4,4)$，$(4,5)$，共包含 $6$ 个格子。

**【数据范围】**

对于全部数据，$1 \\le n,m \\le 100$，$1 \\le k \\le n \\times m$。

| 子任务 | 得分 | $n,m$ |
|:---:|:---:|:---:|
| 1 | 20 | $\\le 10$ |
| 2 | 40 | $n=1$，$1 \\le m \\le 100$ |
| 3 | 40 | $\\le 100$ |`,
  },
  {
    title: "[GESP202406 五级] 小杨的幸运数字",
    source: "gesp_official",
    sourceId: "P10720",
    sourceUrl: "https://www.luogu.com.cn/problem/P10720",
    level: 5,
    knowledgePoints: ["质因数分解", "数论"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1153`,
    description: `小杨认为他的幸运数字应该恰好有两种不同的质因子，例如，$12=2\\times 2\\times 3$ 的质因子有 $2,3$，恰好为两种不同的质因子，因此 $12$ 是幸运数字。而 $30=2\\times 3\\times 5$有 $2,3,5$ 共三种不同的质因子，因此 $30$ 不是幸运数字。

现在给定 $n$ 个正整数，请你依次判断他们是否是幸运数字。`,
    inputFormat: `第一行包含一个正整数 $n$，代表正整数个数。

之后 $n$ 行，每行一个正整数。`,
    outputFormat: `输出 $n$ 行，对于每个正整数，如果是幸运数字，输出 $1$，否则输出 $0$。`,
    samples: [
      { input: "3\n7\n12\n30", output: "0\n1\n0" },
    ],
    testCases: [
      { input: "3\n7\n12\n30", output: "0\n1\n0" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `**【样例解释】**

$7$ 的质因子仅有 $7$，因此不是幸运数字。

$12$ 的质因子有 $2,3$，因此是幸运数字。

$30$ 的质因子有 $2,3,5$，因此不是幸运数字。

**【数据范围】**

对于全部数据，$1 \\le n \\le 10^4$，$2 \\le a\\_i \\le 10^6$。

| 子任务 | 得分 | $n$ | 值域 |
|:---:|:---:|:---:|:---:|
| 1 | 40% | $\\le 100$ | $\\le 10^5$ |
| 2 | 60% | $\\le 10^4$ | $\\le 10^6$ |`,
  },
  // ========== 2024年9月 ==========
  {
    title: "[GESP202409 五级] 挑战怪物",
    source: "gesp_official",
    sourceId: "B4050",
    sourceUrl: "https://www.luogu.com.cn/problem/B4050",
    level: 5,
    knowledgePoints: ["贪心", "质数", "二进制"],
    difficulty: "普及/提高-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1161`,
    description: `小杨正在和一个怪物战斗，怪物的血量为 $h$，只有当怪物的血量**恰好**为 $0$ 时小杨才能够成功击败怪物。

小杨有两种攻击怪物的方式：
- 物理攻击。假设当前为小杨第 $i$ 次使用物理攻击，则会对怪物造成 $2^{i - 1}$ 点伤害。
- 魔法攻击。小杨选择任意一个质数 $x$（ 不能超过怪物当前血量），对怪物造成 $x$ 点伤害。由于小杨并不擅长魔法，他只能使用**至多一次**魔法攻击。

小杨想知道自己能否击败怪物，如果能，小杨想知道自己最少需要多少次攻击。`,
    inputFormat: `**本题单个测试点内有多组测试数据**。第一行包含一个正整数 $t$，代表测试用例组数。

接下来是 $t$ 组测试用例。对于每组测试用例，只有一行一个整数 $h$，代表怪物血量。`,
    outputFormat: `对于每组测试用例，如果小杨能够击败怪物，输出一个整数，代表小杨需要的最少攻击次数，如果不能击败怪物，输出 $-1$。`,
    samples: [
      { input: "3\n6\n188\n9999", output: "2\n4\n-1" },
    ],
    testCases: [
      { input: "3\n6\n188\n9999", output: "2\n4\n-1" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `### 样例 1 解释

对于第一组测试用例，一种可能的最优方案为，小杨先对怪物使用魔法攻击，选择质数 $5$ 造成 $5$ 点伤害，之后对怪物使用第 $1$ 次物理攻击，造成 $2^{1 - 1} = 1$ 点伤害，怪物血量恰好为 $0$，小杨成功击败怪物。

### 数据规模与约定

| 子任务编号 | 分数占比 | $t$ | $h$ |
| :-: | :-: | :-: | :-: |
| $1$ | $20\\%$ | $\\leq 5$ | $\\leq 10$ |
| $2$ | $20\\%$ | $\\leq 10$ | $\\leq 100$ |
| $3$ | $60\\%$ | $\\leq 10$ | $\\leq 10^5$ |

对于全部的测试数据，保证 $1 \\leq t \\leq 10$，$1 \\leq h \\leq 10^5$。`,
  },
  {
    title: "[GESP202409 五级] 小杨的武器",
    source: "gesp_official",
    sourceId: "B4051",
    sourceUrl: "https://www.luogu.com.cn/problem/B4051",
    level: 5,
    knowledgePoints: ["贪心", "排序", "前缀和"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1161`,
    description: `小杨有 $n$ 种不同的武器，他对第 $i$ 种武器的初始熟练度为 $c\\_i$。小杨会依次参加 $m$ 场战斗，每场战斗小杨只能且必须选择一种武器使用，假设小杨使用了第 $i$ 种武器参加了第 $j$ 场战斗，战斗前该武器的熟练度为 $c'\\_i$，则战斗后小杨对该武器的熟练度会变为 $c'\\_i + a\\_j$。需要注意的是，$a\\_j$ 可能是正数，$0$ 或负数，这意味着小杨参加战斗后对武器的熟练度可能会提高，也可能会不变，还有可能降低。小杨想请你编写程序帮他计算出如何选择武器才能使得 $m$ 场战斗后，自己对 $n$ 种武器的熟练度的**最大值尽可能大**。`,
    inputFormat: `第一行包含两个正整数 $n, m$，分别表示武器种数和战斗场数。

第二行包含 $n$ 个整数 $c\\_1, c\\_2, \\ldots, c\\_n$，其中 $c\\_i$ 表示小杨对第 $i$ 种武器的初始熟练度。

第三行包含 $m$ 个整数 $a\\_1, a\\_2, \\ldots, a\\_m$，其中 $a\\_j$ 表示参加第 $j$ 场战斗后小杨对所用武器的熟练度变化值。`,
    outputFormat: `输出一个整数，代表 $m$ 场战斗后小杨对 $n$ 种武器的熟练度的最大值最大是多少。`,
    samples: [
      { input: "2 2\n9 9\n1 -1", output: "10" },
    ],
    testCases: [
      { input: "2 2\n9 9\n1 -1", output: "10" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `### 样例 1 解释

一种最优的选择方案为，第一场战斗小杨选择第一种武器，第二场战斗小杨选择第二种武器。

### 数据规模与约定

对全部的测试数据，保证 $1 \\leq n, m \\leq 10^5$，$-10^4 \\leq c\\_i, a\\_i \\leq 10^4$。`,
  },
  // ========== 2024年12月 ==========
  {
    title: "[GESP202412 五级] 奇妙数字",
    source: "gesp_official",
    sourceId: "B4070",
    sourceUrl: "https://www.luogu.com.cn/problem/B4070",
    level: 5,
    knowledgePoints: ["质因数分解", "数论", "贪心"],
    difficulty: "普及/提高-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1169`,
    description: `小杨定义一个数 $x$ 为"奇妙数字"当且仅当 $x=p^a$，其中 $p$ 是任意质数，$a$ 是正整数。例如，$8=2^3$ 是奇妙数字，但 $6$ 不是。

对于一个正整数 $n$，小杨想构造一个包含 $m$ 个奇妙数字的集合 $\\{x\\_1,x\\_2,\\cdots,x\\_m\\}$，满足：

- 集合中没有重复数字
- 乘积 $x\\_1 \\times x\\_2 \\times \\cdots \\times x\\_m$ 是 $n$ 的因子

求这样的集合最多能包含多少个奇妙数字。`,
    inputFormat: `一个正整数 $n$。`,
    outputFormat: `输出一个正整数，表示集合最多能包含的奇妙数字个数。`,
    samples: [
      { input: "128", output: "3" },
    ],
    testCases: [
      { input: "128", output: "3" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `**【样例解释】**

一个包含 $3$ 个奇妙数字的合法集合是 $\\{2,4,8\\}$。因为 $2=2^1$，$4=2^2$，$8=2^3$ 都是奇妙数字，且 $2 \\times 4 \\times 8=64$ 整除 128，答案为 3。

**【数据范围】**

对于 $100\\%$ 的测试数据：$2 \\le n \\le 10^{12}$。

| 子任务 | 得分 | $n$ |
|:---:|:---:|:---:|
| 1 | 20% | $\\le 10$ |
| 2 | 20% | $\\le 1000$ |
| 3 | 60% | $\\le 10^{12}$ |`,
  },
  {
    title: "[GESP202412 五级] 武器强化",
    source: "gesp_official",
    sourceId: "B4071",
    sourceUrl: "https://www.luogu.com.cn/problem/B4071",
    level: 5,
    knowledgePoints: ["贪心", "排序", "模拟"],
    difficulty: "普及/提高-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1169`,
    description: `小杨有 $n$ 种武器和 $m$ 种强化材料。第 $i$ 种强化材料会适配第 $p\\_i$ 种武器，小杨可以花费 $c\\_i$ 金币将该材料对应的适配武器修改为任意武器。

小杨最喜欢第 $1$ 种武器，因此他希望适配该武器的强化材料种类数**严格大于**其他的武器，请你帮小杨计算为了满足该条件最少需要花费多少金币。`,
    inputFormat: `第一行包含两个正整数 $n,m$，含义如题面所示。

之后 $m$ 行，每行包含两个正整数 $p\\_i,c\\_i$，代表第 $i$ 种强化材料的适配武器和修改花费。`,
    outputFormat: `输出一个整数，代表能够使适配第 $1$ 种武器的强化材料种类数**严格大于**其他的武器最少需要花费的金币。`,
    samples: [
      { input: "4 4\n1 1\n2 1\n3 1\n3 2", output: "1" },
    ],
    testCases: [
      { input: "4 4\n1 1\n2 1\n3 1\n3 2", output: "1" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `**【样例解释】**

花费 $1$，将第三种强化材料的适配武器由 $3$ 改为 $1$。此时，武器 $1$ 有 $2$ 种强化材料适配，武器 $2$ 和武器 $3$ 都各有 $1$ 种强化材料适配，满足条件。

**【数据范围】**

对于 $100\\%$ 的数据：$1 \\le n,m \\le 1000$，$1 \\le p\\_i \\le n$，$1 \\le c\\_i \\le 10^9$。

| 子任务编号 | 得分占比 | $n$ | $m$ |
|:---:|:---:|:---:|:---:|
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
    difficulty: "普及/提高-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1177`,
    description: `小 A 有 $2n$ 件物品，小 B 和小 C 想从小 A 手上买走这些物品。对于第 $i$ 件物品，小 B 会以 $b\\_i$ 的价格购买，而小 C 会以 $c\\_i$ 的价格购买。为了平均分配这 $2n$ 件物品，小 A 决定小 B 和小 C 各自只能买走恰好 $n$ 件物品。你能帮小 A 求出他卖出这 $2n$ 件物品所能获得的最大收入吗？`,
    inputFormat: `第一行，一个正整数 $n$。

第二行，$2n$ 个整数 $b\\_1,b\\_2,\\dots,b\\_{2n}$。

第三行，$2n$ 个整数 $c\\_1,c\\_2,\\dots,c\\_{2n}$。`,
    outputFormat: `一行，一个整数，表示答案。`,
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
    hint: `#### 数据范围

对于 $20\\%$ 的测试点，保证 $1\\le n\\le8$。

对于另外 $20\\%$ 的测试点，保证 $0\\le b\\_i\\le1$，$0\\le c\\_i\\le1$。

对于所有测试点，保证 $1\\le n\\le10^5$，$0\\le b\\_i\\le10^9$，$0\\le c\\_i\\le10^9$。`,
  },
  {
    title: "[GESP202503 五级] 原根判断",
    source: "gesp_official",
    sourceId: "P11961",
    sourceUrl: "https://www.luogu.com.cn/problem/P11961",
    level: 5,
    knowledgePoints: ["数论", "快速幂", "费马小定理"],
    difficulty: "提高+/省选-",
    background: `截止 2025 年 3 月，本题可能超出了 GESP 考纲范围。原根属于 NOI 大纲 8 级知识点，费马小定理与欧拉定理属于 NOI 大纲 7 级知识点，均未在 GESP 大纲中明确说明。`,
    description: `小 A 知道，对于质数 $p$ 而言，$p$ 的原根 $g$ 是满足以下条件的正整数：

- $1<g<p$；
- $g^{p-1}\\bmod{p}=1$；
- 对于任意 $1\\le i<p-1$ 均有 $g^i\\bmod{p}\\neq1$。

其中 $a\\bmod{p}$ 表示 $a$ 除以 $p$ 的余数。小 A 现在有一个整数 $a$，请你帮他判断 $a$ 是不是 $p$ 的原根。`,
    inputFormat: `第一行，一个正整数 $T$，表示测试数据组数。

每组测试数据包含一行，两个正整数 $a,p$。`,
    outputFormat: `对于每组测试数据，输出一行，如果 $a$ 是 $p$ 的原根则输出 \`Yes\`，否则输出 \`No\`。`,
    samples: [
      { input: "3\n3 998244353\n5 998244353\n7 998244353", output: "Yes\nYes\nNo" },
    ],
    testCases: [
      { input: "3\n3 998244353\n5 998244353\n7 998244353", output: "Yes\nYes\nNo" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于 $40\\%$ 的测试点，保证 $3\\le p\\le10^3$。

对于所有测试点，保证 $1\\le T\\le20$，$3\\le p\\le10^9$，$1<a<p$，$p$ 为质数。`,
  },
  // ========== 2025年6月 ==========
  {
    title: "[GESP202506 五级] 奖品兑换",
    source: "gesp_official",
    sourceId: "P13013",
    sourceUrl: "https://www.luogu.com.cn/problem/P13013",
    level: 5,
    knowledgePoints: ["二分查找", "贪心", "数学"],
    difficulty: "普及/提高-",
    background: `为了保证只有时间复杂度正确的代码能够通过本题，时限下降为 400 毫秒。

对应的选择、判断题：https://ti.luogu.com.cn/problemset/1185`,
    description: `班主任给上课专心听讲、认真完成作业的同学们分别发放了若干张课堂优秀券和作业优秀券。同学们可以使用这两种券找班主任兑换奖品。具体来说，可以使用 $a$ 张课堂优秀券和 $b$ 张作业优秀券兑换一份奖品，或者使用 $b$ 张课堂优秀券和 $a$ 张作业优秀券兑换一份奖品。

现在小 A 有 $n$ 张课堂优秀券和 $m$ 张作业优秀券，他最多能兑换多少份奖品呢？`,
    inputFormat: `第一行，两个正整数 $n,m$，分别表示小 A 持有的课堂优秀券和作业优秀券的数量。

第二行，两个正整数 $a,b$，表示兑换一份奖品所需的两种券的数量。`,
    outputFormat: `输出共一行，一个整数，表示最多能兑换的奖品份数。`,
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
    hint: `对于 $60\\%$ 的测试点，保证 $1 \\le a,b \\le 100$，$1 \\le n,m \\le 500$。

对于所有测试点，保证 $1 \\le a,b \\le 10^4$，$1 \\le n,m \\le 10^9$。`,
  },
  {
    title: "[GESP202506 五级] 最大公因数",
    source: "gesp_official",
    sourceId: "P13014",
    sourceUrl: "https://www.luogu.com.cn/problem/P13014",
    level: 5,
    knowledgePoints: ["最大公约数", "辗转相除法", "数论"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1185`,
    description: `对于两个正整数 $a,b$，他们的最大公因数记为 $\\gcd(a,b)$。对于 $k > 2$ 个正整数 $c\\_1,c\\_2,\\dots,c\\_k$，他们的最大公因数为：

$$\\gcd(c\\_1,c\\_2,\\dots,c\\_k)=\\gcd(\\gcd(c\\_1,c\\_2,\\dots,c\\_{k-1}),c\\_k)$$

给定 $n$ 个正整数 $a\\_1,a\\_2,\\dots,a\\_n$ 以及 $q$ 组询问。对于第 $i$（$1 \\le i \\le q$）组询问，请求出 $a\\_1+i,a\\_2+i,\\dots,a\\_n+i$ 的最大公因数，也即 $\\gcd(a\\_1+i,a\\_2+i,\\dots,a\\_n+i)$。`,
    inputFormat: `第一行，两个正整数 $n,q$，分别表示给定正整数的数量，以及询问组数。

第二行，$n$ 个正整数 $a\\_1,a\\_2,\\dots,a\\_n$。`,
    outputFormat: `输出共 $q$ 行，第 $i$ 行包含一个正整数，表示 $a\\_1+i,a\\_2+i,\\dots,a\\_n+i$ 的最大公因数。`,
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
    hint: `对于 $60\\%$ 的测试点，保证 $1 \\le n \\le 10^3$，$1 \\le q \\le 10$。

对于所有测试点，保证 $1 \\le n \\le 10^5$，$1 \\le q \\le 10^5$，$1 \\le a\\_i \\le 1000$。`,
  },
  // ========== 2025年9月 ==========
  {
    title: "[GESP202509 五级] 数字选择",
    source: "gesp_official",
    sourceId: "P14073",
    sourceUrl: "https://www.luogu.com.cn/problem/P14073",
    level: 5,
    knowledgePoints: ["数论", "互质", "贪心"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1193`,
    description: `给定正整数 $n$，现在有 $1,2,\\ldots,n$ 共计 $n$ 个整数。你需要从这 $n$ 个整数中选取一些整数，使得所选取的整数中任意两个不同的整数均互质。

请你求出所选取整数的最大数量。`,
    inputFormat: `一行，一个正整数 $n$，表示给定的正整数。`,
    outputFormat: `一行，一个正整数，表示所选取整数的最大数量。`,
    samples: [
      { input: "6", output: "4" },
      { input: "9", output: "5" },
    ],
    testCases: [
      { input: "6", output: "4" },
      { input: "9", output: "5" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于 $40\\%$ 的测试点，保证 $1\\le n\\le 1000$。

对于所有测试点，保证 $1\\le n\\le 10^5$。`,
  },
  {
    title: "[GESP202509 五级] 有趣数求和",
    source: "gesp_official",
    sourceId: "P14074",
    sourceUrl: "https://www.luogu.com.cn/problem/P14074",
    level: 5,
    knowledgePoints: ["位运算", "二进制", "数学"],
    difficulty: "普及/提高-",
    background: `为了保证只有时间复杂度正确的代码能够通过本题，时限有所下降。

对应的选择、判断题：https://ti.luogu.com.cn/problemset/1193`,
    description: `如果一个正整数的二进制表示包含奇数个 $1$，那么小 A 就会认为这个正整数是有趣的。

例如，$7$ 的二进制表示为 $111$，包含 $3$ 个 $1$，所以 $7$ 是有趣的。$9$ 的二进制表示为 $1001$，包含 $2$ 个 $1$，所以 $9$ 不是有趣的。

给定正整数 $l,r$，请你求出 $l,l+1,\\ldots,r$ 之间所有有趣的整数之和。`,
    inputFormat: `一行，两个正整数 $l,r$，表示给定的正整数。`,
    outputFormat: `一行，一个正整数，表示 $l,r$ 之间有趣的整数之和。`,
    samples: [
      { input: "3 8", output: "19" },
      { input: "65 36248", output: "328505490" },
    ],
    testCases: [
      { input: "3 8", output: "19" },
      { input: "65 36248", output: "328505490" },
    ],
    timeLimit: 500,
    memoryLimit: 256,
    hint: `**【数据范围】**

对于 $40\\%$ 的测试点，保证 $1\\le l\\le r\\le 10^4$。

对于另外 $30\\%$ 的测试点，保证 $l=1$ 并且 $r=2^k-1$，其中 $k$ 是大于 $1$ 的正整数。

对于所有测试点，保证 $1 \\le l\\le r\\le 10^9$。

**注意**：由于数据范围较大，请使用 \`long long\` 类型存储整数。`,
  },
  // ========== 2025年12月 ==========
  {
    title: "[GESP202512 五级] 数字移动",
    source: "gesp_official",
    sourceId: "P14917",
    sourceUrl: "https://www.luogu.com.cn/problem/P14917",
    level: 5,
    knowledgePoints: ["贪心", "模拟", "二分"],
    difficulty: "普及/提高-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1201`,
    description: `小 A 有一个包含 $N$ 个正整数的序列 $A=\\{A\\_1,A\\_2,\\cdots,A\\_N\\}$，序列 $A$ 恰好包含 $\\frac{N}{2}$ 对不同的正整数。形式化地，对于任意 $1 \\le i \\le N$，存在唯一一个 $j$ 满足 $1\\le j \\le N, i\\neq j, A\\_i=A\\_j$。

小 A 希望每对相同的数字在序列中相邻，为了实现这一目的，小 A 每次操作会选择任意 $i$（$1\\le i\\le N$），将当前序列的第 $i$ 个数字移动到任意位置，并花费对应数字的体力。

例如，假设序列 $A=\\{1,2,1,3,2,3\\}$，小 A 可以选择 $i=2$，将 $A\\_2=2$ 移动到 $A\\_3=1$ 的后面，此时序列变为 $\\{1,1,2,3,2,3\\}$，耗费 $2$ 点体力。小 A 也可以选择 $i=3$，将 $A\\_3=1$ 移动到 $A\\_2=2$ 的前面，此时序列变为 $\\{1,1,2,3,2,3\\}$，花费 $1$ 点体力。

小 A 可以执行任意次操作，但他希望自己每次花费的体力尽可能小。小 A 希望你能帮他计算出一个最小的 $x$，使得他能够在每次花费的体力均不超过 $x$ 的情况下令每对相同的数字在序列中相邻。`,
    inputFormat: `第一行一个正整数 $N$，代表序列长度，保证 $N$ 为偶数。

第二行包含 $N$ 个正整数 $A\\_1,A\\_2,\\ldots,A\\_N$，代表序列 $A$。且对于任意 $1\\le i\\le N$，存在唯一一个 $j$ 满足 $1\\le j\\le N,i\\neq j,A\\_i=A\\_j$。

数据保证小 A 至少需要执行一次操作。`,
    outputFormat: `输出一行，代表满足要求的 $x$ 的最小值。`,
    samples: [
      { input: "6\n1 2 1 3 2 3", output: "2" },
    ],
    testCases: [
      { input: "6\n1 2 1 3 2 3", output: "2" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于 $40\\%$ 的测试点，保证 $1\\le N,A\\_i\\le 100$。

对于所有测试点，保证 $1\\le N,A\\_i\\le 10^5$。`,
  },
  {
    title: "[GESP202512 五级] 相等序列",
    source: "gesp_official",
    sourceId: "P14918",
    sourceUrl: "https://www.luogu.com.cn/problem/P14918",
    level: 5,
    knowledgePoints: ["质因数分解", "数论", "贪心"],
    difficulty: "普及/提高-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1201`,
    description: `小 A 有一个包含 $N$ 个正整数的序列 $A=\\{A\\_1,A\\_2,\\ldots,A\\_N\\}$。小 A 每次可以花费 $1$ 个金币执行以下任意一种操作：

- 选择序列中一个正整数 $A\\_i$（$1\\le i\\le N$），将 $A\\_i$ 变为 $A\\_i\\times P$，$P$ 为任意质数；
- 选择序列中一个正整数 $A\\_i$（$1\\le i\\le N$），将 $A\\_i$ 变为 $\\frac{A\\_i}{P}$，$P$ 为任意质数，要求 $A\\_i$ 是 $P$ 的倍数。

小 A 想请你帮他计算出令序列中所有整数都相同，最少需要花费多少金币。`,
    inputFormat: `第一行一个正整数 $N$，含义如题面所示。

第二行包含 $N$ 个正整数 $A\\_1,A\\_2,\\ldots,A\\_N$，代表序列 $A$。`,
    outputFormat: `输出一行，代表最少需要花费的金币数量。`,
    samples: [
      { input: "5\n10 6 35 105 42", output: "8" },
    ],
    testCases: [
      { input: "5\n10 6 35 105 42", output: "8" },
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    hint: `对于 $60\\%$ 的测试点，保证 $1\\le N,A\\_i\\le 100$。

对于所有测试点，保证 $1\\le N,A\\_i\\le 10^5$。`,
  },
];

async function seedGesp5() {
  try {
    // 删除现有的GESP5题目，重新导入
    await prisma.problem.deleteMany({
      where: {
        sourceId: {
          in: gesp5Problems.map(p => p.sourceId).filter(Boolean) as string[]
        }
      }
    });

    // 添加所有题目
    const result = await prisma.problem.createMany({
      data: gesp5Problems,
    });

    return NextResponse.json({
      success: true,
      message: `成功导入 ${result.count} 道 GESP 5级题目（已更新为与洛谷100%一致）`,
      count: result.count
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
