import { createSeedHandler, type SeedProblem } from "@/lib/seed-problems";

// GESP 3级完整题库 - 来源：洛谷 CCF GESP C++ 三级上机题
// 官方题单：https://www.luogu.com.cn/training/553
// 共24道题目，内容100%来自洛谷原文

const gesp3Problems: SeedProblem[] = [
  // ========== 2023年3月 ==========
  {
    title: "[GESP202306 三级] 春游",
    source: "gesp_official",
    sourceId: "B3842",
    sourceUrl: "https://www.luogu.com.cn/problem/B3842",
    level: 3,
    knowledgePoints: ["数组", "集合", "去重"],
    difficulty: "普及-",
    description: `老师带领同学们春游。已知班上有 $N$ 位同学，每位同学有从 $0$ 到 $N-1$ 的唯一编号。到了集合时间，老师确认是否所有同学都到达了集合地点，就让同学们报出自己的编号。到达的同学都会报出自己的编号，不会报出别人的编号，但有的同学很顽皮，会多次报出。你能帮老师找出有哪些同学没有到达吗 ?。`,
    inputFormat: `输入包含 $2$ 行。第一行包含两个整数 $N$ 和 $M$，表示班级有 $N$ 位同学，同学们共有 $M$ 次报出编号。约定 $2 \\le N,M \\le 1000$。  \n第二行包含 $M$ 个整数，分别为 $M$ 次报出的编号。约定所有编号是小于 $N$ 的非负整数。`,
    outputFormat: `输出一行。如果所有同学都到达，则输出 $N$；否则由小到大输出所有未到达的同学编号，空格分隔。`,
    samples: [
      { input: "3 3\n0 2 1", output: "3" },
      { input: "3 5\n0 0 0 0 0", output: "1 2" },
    ],
    testCases: [
      // 原始样例
      { input: "3 3\n0 2 1", output: "3" },
      { input: "3 5\n0 0 0 0 0", output: "1 2" },
      // 边界值测试 - 最小规模
      { input: "2 2\n0 1", output: "2" },
      { input: "2 1\n0", output: "1" },
      // 全部到达
      { input: "5 5\n0 1 2 3 4", output: "5" },
      { input: "5 10\n0 1 2 3 4 0 1 2 3 4", output: "5" },
      // 只有一个人缺席
      { input: "5 4\n0 1 2 3", output: "4" },
      { input: "5 4\n1 2 3 4", output: "0" },
      // 多人缺席
      { input: "5 2\n0 4", output: "1 2 3" },
      { input: "6 3\n0 2 4", output: "1 3 5" },
      // 重复报号测试
      { input: "4 8\n0 0 1 1 2 2 3 3", output: "4" },
      { input: "4 6\n0 0 0 1 1 1", output: "2 3" },
      // 较大规模
      { input: "10 5\n0 1 2 3 4", output: "5 6 7 8 9" },
      { input: "10 10\n0 1 2 3 4 5 6 7 8 9", output: "10" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: ``,
  },
  {
    title: "[GESP202306 三级] 密码合规",
    source: "gesp_official",
    sourceId: "B3843",
    sourceUrl: "https://www.luogu.com.cn/problem/B3843",
    level: 3,
    knowledgePoints: ["字符串", "字符判断", "条件组合"],
    difficulty: "普及-",
    description: `网站注册需要有用户名和密码，编写程序以检查用户输入密码的有效性。合规的密码应满足以下要求 :

1. 只能由 $\\texttt a \\sim \\texttt z$ 之间 $26$ 个小写字母、$\\texttt A \\sim \\texttt Z$ 之间 $26$ 个大写字母、$0 \\sim 9$ 之间 $10$ 个数字以及 \`!@#$\` 四个特殊字符构成。

2. 密码最短长度 $:6$ 个字符，密码最大长度 $:12$ 个字符。

3. 大写字母，小写字母和数字必须至少有其中两种，以及至少有四个特殊字符中的一个。`,
    inputFormat: `输入一行不含空格的字符串。约定长度不超过 $100$。该字符串被英文逗号分隔为多段，作为多组被检测密码。`,
    outputFormat: `输出若干行，每行输出一组合规的密码。输出顺序以输入先后为序，即先输入则先输出。`,
    samples: [
      { input: "seHJ12!@,sjdkffH$123,sdf!@&12HDHa!,123&^YUhg@!", output: "seHJ12!@\nsjdkffH$123" },
    ],
    testCases: [
      // 原始样例
      { input: "seHJ12!@,sjdkffH$123,sdf!@#12HDHa!,123&^YUhg@!", output: "seHJ12!@\nsjdkffH$123" },
      // 边界值测试 - 长度刚好6位
      { input: "Aa1!ab", output: "Aa1!ab" },
      // 边界值测试 - 长度刚好12位
      { input: "Aa1!abcdefgh", output: "Aa1!abcdefgh" },
      // 长度不足6位
      { input: "Aa1!a", output: "" },
      // 长度超过12位
      { input: "Aa1!abcdefghi", output: "" },
      // 小写和数字+特殊字符（满足至少两种+特殊字符）
      { input: "abc123!@", output: "abc123!@" },
      // 大写和数字+特殊字符（满足至少两种+特殊字符）
      { input: "ABC123!@", output: "ABC123!@" },
      // 大写和小写+特殊字符（满足至少两种+特殊字符）
      { input: "ABCabc!@", output: "ABCabc!@" },
      // 缺少特殊字符
      { input: "ABCabc12", output: "" },
      // 包含非法字符
      { input: "Aa1!ab%c", output: "" },
      { input: "Aa1!ab^c", output: "" },
      // 多个合规密码
      { input: "Ab12!@,Cd34#$,Ef56!@", output: "Ab12!@\nCd34#$\nEf56!@" },
      // 全部不合规
      { input: "abc,ABC,12345,!@#$", output: "" },
      // 四种特殊字符测试
      { input: "Aa1!bcde,Bb2@cdef,Cc3#defg,Dd4$efgh", output: "Aa1!bcde\nBb2@cdef\nCc3#defg\nDd4$efgh" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `【样例 1 解释】

输入被英文逗号分为了四组被检测密码：\`seHJ12!@\`、\`sjdkffH$123\`、\`sdf!@&12HDHa!\`、\`123&^YUhg@!\`。其中 \`sdf!@&12HDHa!\` 长度超过 12 个字符，不合规；\`123&^YUhg@!\` 包含四个特殊字符之外的字符不合规。`,
  },

  // ========== 2023年6月 ==========
  {
    title: "[GESP样题 三级] 逛商场",
    source: "gesp_official",
    sourceId: "B3848",
    sourceUrl: "https://www.luogu.com.cn/problem/B3848",
    level: 3,
    knowledgePoints: ["数组", "模拟", "贪心"],
    difficulty: "入门",
    description: `小明是个不太有计划的孩子。这不，刚到手的零花钱，就全部拿着逛商场去了。  \n\n小明的原则很简单，见到想买的物品，只要能买得起，就一定会买下来之后才会继续往前走；如果买不起就直接跳过。\n\n一天下来，小明到底买了多少物品呢？`,
    inputFormat: `输入共 $3$ 行：

第一行是一个整数 $N$，表示商场中共有 $N$ 种小明想买的物品（$1≤N≤100$）；

第二行共有 $N$ 个整数，分别表示小明先后见到想买的物品的价格；

第三行是一个整数 $X$，表示开始时小明共有 $X$ 元零花钱。`,
    outputFormat: `输出 $1$ 行，包含一个整数，表示小明买到的物品数。`,
    samples: [
      { input: "6\n7 5 9 10 7 4\n30", output: "4" },
    ],
    testCases: [
      // 原始样例
      { input: "6\n7 5 9 10 7 4\n30", output: "4" },
      // 边界值测试 - 最小规模
      { input: "1\n5\n10", output: "1" },
      { input: "1\n5\n4", output: "0" },
      { input: "1\n5\n5", output: "1" },
      // 钱刚好够
      { input: "3\n10 10 10\n30", output: "3" },
      // 钱不够买任何东西
      { input: "3\n10 20 30\n5", output: "0" },
      // 钱为0
      { input: "3\n1 2 3\n0", output: "0" },
      // 物品价格为0
      { input: "3\n0 0 0\n0", output: "3" },
      // 全部买得起
      { input: "5\n1 1 1 1 1\n100", output: "5" },
      // 买到一半没钱
      { input: "5\n5 5 5 5 5\n12", output: "2" },
      // 价格递增
      { input: "4\n1 2 3 4\n10", output: "4" },
      // 价格递减
      { input: "4\n4 3 2 1\n10", output: "4" },
      // 较大金额
      { input: "3\n100000 100000 100000\n300000", output: "3" },
      // 混合测试
      { input: "5\n10 5 8 12 3\n25", output: "3" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `**数据范围：**

对于 $100\\%$ 的数据满足 $1≤N≤100$ 且 $0\\le a_i \\le 100000$。`,
  },
  {
    title: "[GESP样题 三级] 进制转换",
    source: "gesp_official",
    sourceId: "B3849",
    sourceUrl: "https://www.luogu.com.cn/problem/B3849",
    level: 3,
    knowledgePoints: ["进制转换", "数学", "字符串"],
    difficulty: "普及-",
    description: `小美刚刚学习了十六进制，她觉得很有趣，想到是不是还有更大的进制呢？在十六进制中，用 \`A\` 表示 $10$、\`F\` 表示 $15$。如果扩展到用 \`Z\` 表示 $35$，岂不是可以表示 $36$ 进制数了嘛！\n\n所以，你需要帮助她写一个程序，完成十进制转 $R$ 进制（$2\\le R\\le 36$）的工作。`,
    inputFormat: `输入两行，第一行包含一个正整数 $N$，第二行包含一个正整数 $R$，保证 $1\\le N\\le 10^6$。`,
    outputFormat: `输出一行，为 $N$ 的 $R$ 进制表示。`,
    samples: [
      { input: "123\n25", output: "4N" },
    ],
    testCases: [
      // 原始样例
      { input: "123\n25", output: "4N" },
      // 边界值测试 - 最小值
      { input: "1\n2", output: "1" },
      { input: "1\n10", output: "1" },
      { input: "1\n36", output: "1" },
      // 二进制转换
      { input: "10\n2", output: "1010" },
      { input: "255\n2", output: "11111111" },
      // 八进制转换
      { input: "64\n8", output: "100" },
      { input: "100\n8", output: "144" },
      // 十进制转换
      { input: "123\n10", output: "123" },
      // 十六进制转换
      { input: "255\n16", output: "FF" },
      { input: "16\n16", output: "10" },
      { input: "10\n16", output: "A" },
      // 36进制转换（最大进制）
      { input: "35\n36", output: "Z" },
      { input: "36\n36", output: "10" },
      { input: "1000000\n36", output: "LFLS" },
      // 较大数值
      { input: "1000000\n2", output: "11110100001001000000" },
      { input: "999999\n16", output: "F423F" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: ``,
  },

  // ========== 2023年9月 ==========
  {
    title: "[GESP202309 三级] 小杨的储蓄",
    source: "gesp_official",
    sourceId: "B3867",
    sourceUrl: "https://www.luogu.com.cn/problem/B3867",
    level: 3,
    knowledgePoints: ["数组", "模拟"],
    difficulty: "入门",
    description: `小杨共有 $N$ 个储蓄罐，编号从 $0$ 到 $N-1$。从第 $1$ 天开始，小杨每天都会往存钱罐里存钱。具体来说，第 $i$ 天他会挑选一个存钱罐 $a_i$，并存入 $i$ 元钱。过了 $D$ 天后，他已经忘记每个储蓄罐里都存了多少钱了，你能帮帮他吗？`,
    inputFormat: `输入 $2$ 行，第一行两个整数 $N,D$；第二行 $D$ 个整数，其中第 $i$ 个整数为 \${a_i}$（保证 $0 \\le a_i \\le N-1$）。\n\n每行的各个整数之间用单个空格分隔。\n\n保证 $1 \\le N \\le 1,000$；$1 \\le D \\le 1,000$。`,
    outputFormat: `输出 $N$ 个用单个空格隔开的整数，其中第 $i$ 个整数表示编号为 $i-1$ 的存钱罐中有多少钱（$i=1, \\cdots ,N$）。`,
    samples: [
      { input: "2 3\n0 1 0", output: "4 2" },
      { input: "3 5\n0 0 0 2 0", output: "11 0 4" },
    ],
    testCases: [
      // 原始样例
      { input: "2 3\n0 1 0", output: "4 2" },
      { input: "3 5\n0 0 0 2 0", output: "11 0 4" },
      // 边界值测试 - 最小规模
      { input: "1 1\n0", output: "1" },
      { input: "1 2\n0 0", output: "3" },
      // 只存一个罐子
      { input: "3 3\n0 0 0", output: "6 0 0" },
      { input: "3 3\n2 2 2", output: "0 0 6" },
      // 每个罐子存一次
      { input: "3 3\n0 1 2", output: "1 2 3" },
      { input: "4 4\n0 1 2 3", output: "1 2 3 4" },
      // 逆序存
      { input: "3 3\n2 1 0", output: "3 2 1" },
      // 交替存
      { input: "2 4\n0 1 0 1", output: "4 6" },
      // 较大规模
      { input: "5 5\n0 1 2 3 4", output: "1 2 3 4 5" },
      { input: "5 10\n0 0 0 0 0 0 0 0 0 0", output: "55 0 0 0 0" },
      // 全部存到最后一个罐子
      { input: "4 5\n3 3 3 3 3", output: "0 0 0 15" },
      // 复杂模式
      { input: "3 6\n0 1 2 0 1 2", output: "5 7 9" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `**样例解释 1：**\n\n小杨在第 $1$ 天、第 $2$ 天、第 $3$ 天分别向 $0$ 号、 $1$ 号、 $0$ 号存钱罐存了 $1$ 元钱、 $2$ 元钱、 $3$ 元钱，因此 $0$ 号存钱罐有 $1+3=4$ 元钱，而 $1$ 号存钱罐有 $2$ 元钱。`,
  },
  {
    title: "[GESP202309 三级] 进制判断",
    source: "gesp_official",
    sourceId: "B3868",
    sourceUrl: "https://www.luogu.com.cn/problem/B3868",
    level: 3,
    knowledgePoints: ["进制", "字符串", "条件判断"],
    difficulty: "入门",
    description: `$N$ 进制数指的是逢 $N$ 进一的计数制。例如，人们日常生活中大多使用十进制计数，而计算机底层则一般使用二进制。除此之外，八进制和十六进制在一些场合也是常用的计数制（十六进制中，一般使用字母 A 至 F 表示十至十五）。

现在有 $N$ 个数，请你分别判断他们是否可能是二进制、八进制、十进制、十六进制。例如，\`15A6F\` 就只可能是十六进制，而 \`1011\` 则是四种进制皆有可能。`,
    inputFormat: `输入的第一行为一个十进制表示的整数 $N$。接下来 $N$ 行，每行一个字符串，表示需要判断的数。保证所有字符串均由数字和大写字母组成，**可能以 $0$ 开头**。保证不会出现空行。

保证 $1 \\le N \\le 1000$，保证所有字符串长度不超过 $10$。`,
    outputFormat: `输出 $N$ 行，每行 $4$ 个数，用空格隔开，分别表示给定的字符串是否可能表示一个二进制数、八进制数、十进制数、十六进制数。使用 $1$ 表示可能，使用 $0$ 表示不可能。

例如，对于只可能是十六进制数的 \`15A6F\`，就需要输出 \`0 0 0 1\`；而对于四者皆有可能的 \`1011\`，则需要输出 \`1 1 1 1\`。`,
    samples: [
      { input: "2\n15A6F\n1011", output: "0 0 0 1\n1 1 1 1" },
      { input: "4\n1234567\n12345678\nFF\nGG", output: "0 1 1 1\n0 0 1 1\n0 0 0 1\n0 0 0 0" },
    ],
    testCases: [
      // 原始样例
      { input: "2\n15A6F\n1011", output: "0 0 0 1\n1 1 1 1" },
      { input: "4\n1234567\n12345678\nFF\nGG", output: "0 1 1 1\n0 0 1 1\n0 0 0 1\n0 0 0 0" },
      // 纯二进制数
      { input: "1\n0", output: "1 1 1 1" },
      { input: "1\n1", output: "1 1 1 1" },
      { input: "1\n10", output: "1 1 1 1" },
      { input: "1\n1111", output: "1 1 1 1" },
      // 八进制边界
      { input: "1\n7", output: "0 1 1 1" },
      { input: "1\n8", output: "0 0 1 1" },
      { input: "1\n77777", output: "0 1 1 1" },
      // 十进制边界
      { input: "1\n9", output: "0 0 1 1" },
      { input: "1\n99999", output: "0 0 1 1" },
      // 十六进制特有
      { input: "1\nA", output: "0 0 0 1" },
      { input: "1\nABCDEF", output: "0 0 0 1" },
      // 超出十六进制范围
      { input: "1\nG", output: "0 0 0 0" },
      { input: "1\nZ", output: "0 0 0 0" },
      // 前导零
      { input: "1\n007", output: "0 1 1 1" },
      { input: "1\n00A", output: "0 0 0 1" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: ``,
  },

  // ========== 2023年12月 ==========
  {
    title: "[GESP202312 三级] 小猫分鱼",
    source: "gesp_official",
    sourceId: "B3925",
    sourceUrl: "https://www.luogu.com.cn/problem/B3925",
    level: 3,
    knowledgePoints: ["数学", "逆推", "模拟"],
    difficulty: "普及-",
    description: `海滩上有一堆鱼，$N$ 只小猫来分。第一只小猫把这堆鱼平均分为 $N$ 份，多了 $i<N$ 个，这只小猫把多的 $i$ 个扔入海中，拿走了一份。第二只小猫接着把剩下的鱼平均分成 $N$ 份，又多了 $i$ 个，小猫同样把多的 $i$ 个扔入海中，拿走了一份。第三、第四、……，第 $N$ 只小猫仍是最终剩下的鱼分成 $N$ 份，扔掉多了的 $i$ 个，并拿走一份。\n\n编写程序，输入小猫的数量 $N$ 以及每次扔到海里的鱼的数量 $i$，输出海滩上最少的鱼数，使得每只小猫都可吃到鱼。\n\n例如：两只小猫来分鱼 $N=2$，每次扔掉鱼的数量为 $i=1$，为了每只小猫都可吃到鱼，可令第二只小猫需要拿走 $1$ 条鱼，则此时待分配的有 $3$ 条鱼。第一只小猫待分配的鱼有  $3\\times 2+1=7$ 条。`,
    inputFormat: `总共 $2$ 行。第一行一个整数 $N$，第二行一个整数 $i$。\n\n保证 $0<N<10$；$i<N$ 。`,
    outputFormat: `一行一个整数，表示满足要求的海滩上最少的鱼数。`,
    samples: [
      { input: "2\n1", output: "7" },
      { input: "3\n1", output: "25" },
    ],
    testCases: [
      // 原始样例
      { input: "2\n1", output: "7" },
      { input: "3\n1", output: "25" },
      // 边界值测试 - N=1（只有1只猫）
      { input: "1\n0", output: "1" },
      // N=2的不同i值
      { input: "2\n0", output: "4" },
      // N=3的不同i值
      { input: "3\n0", output: "27" },
      { input: "3\n2", output: "23" },
      // N=4的情况
      { input: "4\n0", output: "256" },
      { input: "4\n1", output: "253" },
      { input: "4\n2", output: "250" },
      { input: "4\n3", output: "247" },
      // N=5的情况
      { input: "5\n0", output: "3125" },
      { input: "5\n1", output: "3121" },
      { input: "5\n4", output: "3109" },
      // 较大N值
      { input: "9\n0", output: "387420489" },
      { input: "9\n8", output: "387420425" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `**样例解释 2**\n\n三只小猫来分鱼 $N=3$，每次扔掉鱼的数量为 $i=1$，为了每只小猫都可吃到鱼，可令第三只小猫需要拿走 $3$ 条鱼（拿走 $1$ 条和 $2$ 条不满足要求），则此时待分配的有 $10$ 条鱼。第二只小猫待分配的鱼有 $10×3/2+1 = 16$ 条。第一只小猫待分配的鱼有 $16×3/2+1 = 25$ 条。`,
  },
  {
    title: "[GESP202312 三级] 单位转换",
    source: "gesp_official",
    sourceId: "B3926",
    sourceUrl: "https://www.luogu.com.cn/problem/B3926",
    level: 3,
    knowledgePoints: ["字符串", "单位换算", "解析"],
    difficulty: "入门",
    description: `小杨这周的数学作业是做单位转换，喜欢编程的小杨决定编程帮他解决这些问题。

小杨只学了长度单位和重量单位，具体来说：

- 长度单位包括千米（\`km\`）、米（\`m\`）、毫米（\`mm\`），它们之间的关系是：$1\\text{km} = 1000\\text{m} = 1000000\\text{mm}$。

- 重量单位包括千克（\`kg\`）、克（\`g\`）、毫克（\`mg\`），它们之间的关系是：$1\\text{kg} = 1000\\text{g} = 1000000\\text{mg}$。

小杨的作业只涉及将更大的单位转换为更小的单位，也就是说，小杨的作业只会包含如下题型：米转换为毫米，千米转换为毫米，千米转换为米，克转换为毫克，千克转换为毫克，千克转换为克。

现在，请你帮忙完成单位转换的程序。`,
    inputFormat: `输入的第一行为一个整数，表示题目数量。

接下来 $N$ 行，每行一个字符串，表示转换单位的题目，格式为 $x$ 单位 $1 = ?$ 单位 $2$。其中，$x$ 为一个不超过 $1000$ 的非负整数， 单位 $1$ 和 单位 $2$ 分别为两个单位的英文缩写，保证它们都是长度单位或都是重量单位，且 **单位 1** 比 **单位 2** 更大。

例如，如果题目需要你将 $1\\text{km}$ 转换为 $\\text{mm}$，则输入为 \`1 km = ? mm\`。

保证 $1\\le N \\le 1000$。`,
    outputFormat: `输出 $N$ 行，依次输出所有题目的答案，输出时，只需要将输入中的 $?$ 代入答案，其余部分一字不差地输出即可。由于小杨的题目只涉及将更大的单位转换为更小的单位，并且输入的 $x$ 是整数，因此答案一定也是整数。

例如，如果题目需要你将 $1\\text{km}$ 转换为 $\\text{mm}$，则输入为 \`1 km = ? mm\`。则你需要输出 \`1 km = 1000000 mm\`。`,
    samples: [
      { input: "2\n1 km = ? mm\n1 m = ? mm", output: "1 km = 1000000 mm\n1 m = 1000 mm" },
      { input: "5\n100 m = ? mm\n1000 km = ? m\n20 kg = ? g\n200 g = ? mg\n0 kg = ? mg", output: "100 m = 100000 mm\n1000 km = 1000000 m\n20 kg = 20000 g\n200 g = 200000 mg\n0 kg = 0 mg" },
    ],
    testCases: [
      // 原始样例
      { input: "2\n1 km = ? mm\n1 m = ? mm", output: "1 km = 1000000 mm\n1 m = 1000 mm" },
      { input: "5\n100 m = ? mm\n1000 km = ? m\n20 kg = ? g\n200 g = ? mg\n0 kg = ? mg", output: "100 m = 100000 mm\n1000 km = 1000000 m\n20 kg = 20000 g\n200 g = 200000 mg\n0 kg = 0 mg" },
      // 边界值测试 - 0值
      { input: "1\n0 km = ? m", output: "0 km = 0 m" },
      { input: "1\n0 g = ? mg", output: "0 g = 0 mg" },
      // 长度单位 - km转换
      { input: "1\n1 km = ? m", output: "1 km = 1000 m" },
      { input: "1\n1 km = ? mm", output: "1 km = 1000000 mm" },
      { input: "1\n500 km = ? m", output: "500 km = 500000 m" },
      // 长度单位 - m转换
      { input: "1\n1 m = ? mm", output: "1 m = 1000 mm" },
      { input: "1\n999 m = ? mm", output: "999 m = 999000 mm" },
      // 重量单位 - kg转换
      { input: "1\n1 kg = ? g", output: "1 kg = 1000 g" },
      { input: "1\n1 kg = ? mg", output: "1 kg = 1000000 mg" },
      { input: "1\n1000 kg = ? g", output: "1000 kg = 1000000 g" },
      // 重量单位 - g转换
      { input: "1\n1 g = ? mg", output: "1 g = 1000 mg" },
      { input: "1\n500 g = ? mg", output: "500 g = 500000 mg" },
      // 最大值测试
      { input: "1\n1000 km = ? mm", output: "1000 km = 1000000000 mm" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: ``,
  },

  // ========== 2024年3月 ==========
  {
    title: "[GESP202403 三级] 字母求和",
    source: "gesp_official",
    sourceId: "B3956",
    sourceUrl: "https://www.luogu.com.cn/problem/B3956",
    level: 3,
    knowledgePoints: ["字符串", "ASCII码", "累加"],
    difficulty: "入门",
    description: `小杨同学发明了一种新型密码，对于每一个小写英文字母，该小写字母代表了一个正整数，即该字母在字母顺序中的位置，例如字母 \`a\` 代表了正整数 $1$，字母 \`b\` 代表了正整数 $2$；对于每一个大写英文字母，该大写字母代表了一个负整数，即该字母的 ASCII 码的相反数，例如字母 \`A\` 代表了负整数 $-65$。小杨同学利用这种放缩对一个整数进行了加密并得到了一个由大写字母和小写字母组成的字符串，该字符串中每个字母所代表数字的总和即为加密前的整数，例如 \`aAc\` 对应的加密前的整数为 $1+(-65)+3=-61$。\n\n对于给定的字符串，请你计算出它对应的加密前的整数是多少。`,
    inputFormat: `第一行一个正整数 $n$，表示字符串中字母的个数。  \n第二行一个由大写字母和小写字母的字符串 \`T\`，代表加密后得到的字符串。`,
    outputFormat: `输出一行一个整数，代表加密前的整数。`,
    samples: [
      { input: "3\naAc", output: "-61" },
    ],
    testCases: [
      // 原始样例
      { input: "3\naAc", output: "-61" },
      // 边界值测试 - 单个字符
      { input: "1\na", output: "1" },
      { input: "1\nz", output: "26" },
      { input: "1\nA", output: "-65" },
      { input: "1\nZ", output: "-90" },
      // 全小写
      { input: "5\nabcde", output: "15" },
      { input: "26\nabcdefghijklmnopqrstuvwxyz", output: "351" },
      // 全大写
      { input: "3\nABC", output: "-198" },
      { input: "5\nABCDE", output: "-335" },
      // 混合测试
      { input: "2\naA", output: "-64" },
      { input: "4\naBcD", output: "-130" },
      // 相同字符
      { input: "5\naaaaa", output: "5" },
      { input: "5\nAAAAA", output: "-325" },
      // 结果为0的情况（难以构造，跳过）
      // 较长字符串
      { input: "10\nabcdeABCDE", output: "-320" },
      { input: "6\nzZaAyY", output: "-192" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对全部的测试数据，保证 $1 \\leq n \\leq 10^5$。`,
  },
  {
    title: "[GESP202403 三级] 完全平方数",
    source: "gesp_official",
    sourceId: "B3957",
    sourceUrl: "https://www.luogu.com.cn/problem/B3957",
    level: 3,
    knowledgePoints: ["枚举", "完全平方数", "数对"],
    difficulty: "入门",
    description: `小杨同学有一个包含 $n$ 个非负整数的序列 $A$，他想要知道其中有多少对下标组合 $\\langle i,j\\rangle$（$1 \\leq i < j \\leq n$），使得 $A_i + A_j$ 是完全平方数。

如果 $x$ 是完全平方数，则存在非负整数 $y$ 使得 $y \\times y = x$。`,
    inputFormat: `第一行一个非负整数 $n$，表示非负整数个数。  
第二入行包含 $n$ 个非负整数 $A_1, A_2, \\dots A_n$，表示序列 $A$ 包含的非负整数。`,
    outputFormat: `输出一行一个整数表示答案。`,
    samples: [
      { input: "5\n1 4 3 3 5", output: "3" },
    ],
    testCases: [
      // 原始样例
      { input: "5\n1 4 3 3 5", output: "3" },
      // 边界值测试 - 最小规模
      { input: "2\n0 0", output: "1" },
      { input: "2\n0 1", output: "1" },
      { input: "2\n0 4", output: "1" },
      // 全是0（0+0=0是完全平方数）
      { input: "3\n0 0 0", output: "3" },
      // 没有完全平方数对
      { input: "3\n2 3 5", output: "0" },
      { input: "4\n2 3 6 7", output: "2" },
      // 多对完全平方数
      { input: "4\n0 1 3 4", output: "3" },
      // 全相同且和为完全平方数
      { input: "4\n2 2 2 2", output: "6" },
      // 较大数
      { input: "3\n100 0 21", output: "2" },
      // 0和完全平方数
      { input: "5\n0 1 4 9 16", output: "5" },
      // 复杂测试
      { input: "6\n1 3 6 10 15 21", output: "6" },
      { input: "5\n5 4 11 20 0", output: "4" },
      // 边界值 - n=1
      { input: "1\n5", output: "0" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对全部的测试数据，保证 $1 \\leq n \\leq 1000$，$0 \\leq A_i \\leq 10^5$。`,
  },

  // ========== 2024年6月 ==========
  {
    title: "[GESP202406 三级] 移位",
    source: "gesp_official",
    sourceId: "B4003",
    sourceUrl: "https://www.luogu.com.cn/problem/B4003",
    level: 3,
    knowledgePoints: ["字符串", "移位", "取模"],
    difficulty: "入门",
    description: `小杨学习了加密技术移位，所有大写字母都向后按照一个固定数目进行偏移。偏移过程会将字母表视作首尾相接的环，例如，当偏移量是 $3$ 的时候，大写字母 A 会替换成 D，大写字母 Z 会替换成 C，总体来看，大写字母表 ABCDEFGHIJKLMNOPQRSTUVWXYZ 会被替换成 DEFGHIJKLMNOPQRSTUVWXYZABC。

注：当偏移量是 $26$ 的倍数时，每个大写字母经过偏移后会恰好回到原来的位置，即大写字母表 ABCDEFGHIJKLMNOPQRSTUVWXYZ 经过偏移后会保持不变。`,
    inputFormat: `第一行包含一个正整数 $n$。`,
    outputFormat: `输出在偏移量为 $n$ 的情况下，大写字母表 ABCDEFGHIJKLMNOPQRSTUVWXYZ 移位替换后的结果。`,
    samples: [
      { input: "3", output: "DEFGHIJKLMNOPQRSTUVWXYZABC" },
    ],
    testCases: [
      // 原始样例
      { input: "3", output: "DEFGHIJKLMNOPQRSTUVWXYZABC" },
      // 边界值测试 - 最小偏移
      { input: "1", output: "BCDEFGHIJKLMNOPQRSTUVWXYZA" },
      // 偏移为26的倍数（回到原位）
      { input: "26", output: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
      { input: "52", output: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
      // 偏移超过26
      { input: "27", output: "BCDEFGHIJKLMNOPQRSTUVWXYZA" },
      { input: "29", output: "DEFGHIJKLMNOPQRSTUVWXYZABC" },
      // 常见偏移量
      { input: "13", output: "NOPQRSTUVWXYZABCDEFGHIJKLM" },
      { input: "25", output: "ZABCDEFGHIJKLMNOPQRSTUVWXY" },
      // 较大偏移
      { input: "100", output: "WXYZABCDEFGHIJKLMNOPQRSTUV" },
      { input: "78", output: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
      // 其他测试
      { input: "5", output: "FGHIJKLMNOPQRSTUVWXYZABCDE" },
      { input: "10", output: "KLMNOPQRSTUVWXYZABCDEFGHIJ" },
      { input: "15", output: "PQRSTUVWXYZABCDEFGHIJKLMNO" },
      { input: "20", output: "UVWXYZABCDEFGHIJKLMNOPQRST" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `**【样例解释】**

当偏移量是 $3$ 的时候，大写字母 A 会替换成 D，大写字母 Z 会替换成 C，总体来看，大写字母表 ABCDEFGHIJKLMNOPQRSTUVWXYZ 会被替换成 DEFGHIJKLMNOPQRSTUVWXYZABC。

**【数据范围】**

对于全部数据，保证有 $1\\leq n\\leq 100$。`,
  },
  {
    title: "[GESP202406 三级] 寻找倍数",
    source: "gesp_official",
    sourceId: "B4004",
    sourceUrl: "https://www.luogu.com.cn/problem/B4004",
    level: 3,
    knowledgePoints: ["数组", "倍数", "最大值"],
    difficulty: "普及-",
    description: `小杨有一个包含 $n$ 个正整数的序列 $A=[a_1,a_2,\\dots,a_n]$，他想知道是否存在 $i(1\\leq i\\leq n)$ 使得 $a_i$ 是序列 $A$ 中所有数的倍数。`,
    inputFormat: `第一行包含一个正整数 $t$，代表测试用例组数。\n\n接下来是 $t$ 组测试用例。对于每组测试用例，一共两行。\n\n其中，第一行包含一个正整数 $n$；第二行包含 $n$ 个正整数，代表序列 $A$。`,
    outputFormat: `对于每组测试用例，如果存在 $i(1\\leq i\\leq n)$ ，满足对于所有 $k(1\\leq k\\leq n)$ $a_i$ 是 $a_k$ 的倍数，输出 \`Yes\`，否则输出 \`No\`。`,
    samples: [
      { input: "2\n3\n1 2 4\n5\n1 2 3 4 5", output: "Yes\nNo" },
    ],
    testCases: [
      // 原始样例
      { input: "2\n3\n1 2 4\n5\n1 2 3 4 5", output: "Yes\nNo" },
      // 边界值测试 - 只有一个数
      { input: "1\n1\n5", output: "Yes" },
      { input: "1\n1\n1", output: "Yes" },
      // 全相同的数
      { input: "1\n3\n6 6 6", output: "Yes" },
      { input: "1\n4\n12 12 12 12", output: "Yes" },
      // 包含1
      { input: "1\n3\n1 5 10", output: "Yes" },
      { input: "1\n4\n1 2 3 6", output: "Yes" },
      // 互质的数（无公倍数在序列中）
      { input: "1\n3\n2 3 5", output: "No" },
      { input: "1\n4\n3 5 7 11", output: "No" },
      // 最大值是其他所有数的倍数
      { input: "1\n4\n1 2 3 6", output: "Yes" },
      { input: "1\n5\n2 4 8 16 32", output: "Yes" },
      // 最大值不是所有数的倍数
      { input: "1\n4\n2 3 4 12", output: "Yes" },
      { input: "1\n4\n2 3 5 30", output: "Yes" },
      // 多组测试
      { input: "3\n2\n3 6\n2\n4 5\n3\n2 4 8", output: "Yes\nNo\nYes" },
      // 较大数值
      { input: "1\n3\n1000000000 1 1000000000", output: "Yes" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `**【样例解释】**\n\n对于第一组数据，对于 $a_3=4$，满足 $a_3$ 是 $a_1$ 和 $a_2$ 的倍数。\n\n**【数据范围】**\n\n对于全部数据，保证有 $1\\leq t\\leq 10$，$1\\leq n\\leq 10^5$，$1\\leq a_i\\leq 10^9$。`,
  },

  // ========== 2024年9月 ==========
  {
    title: "[GESP202409 三级] 平衡序列",
    source: "gesp_official",
    sourceId: "B4038",
    sourceUrl: "https://www.luogu.com.cn/problem/B4038",
    level: 3,
    knowledgePoints: ["数组", "前缀和", "枚举"],
    difficulty: "普及-",
    description: `小杨有一个包含 $n$ 个正整数的序列 $a$。他认为一个序列是平衡的当且仅当存在一个正整数 $i$（$1 \\leq i < n$）使得序列第 $1$ 到第 $i$ 个数字的总和等于第 $i + 1$ 到第 $n$ 个数字的总和。\n\n小杨想请你判断序列 $a$ 是否是平衡的。`,
    inputFormat: `**本题单个测试点内包含多组测试数据**。第一行是一个正整数 $t$，表示测试用例组数。\n\n接下来是 $t$ 组测试用例。对每组测试用例，一共两行。\n\n第一行包含一个正整数 $n$，表示序列长度。  \n第二行包含 $n$ 个正整数，代表序列 $a$。`,
    outputFormat: `对每组测试用例输出一行一个字符串。如果 $a$ 是平衡的，输出 $\\texttt{Yes}$，否则输出 $\\texttt{No}$。`,
    samples: [
      { input: "3\n3\n1 2 3\n4\n2 3 1 4\n5\n1 2 3 4 5", output: "Yes\nYes\nNo" },
    ],
    testCases: [
      // 原始样例
      { input: "3\n3\n1 2 3\n4\n2 3 1 4\n5\n1 2 3 4 5", output: "Yes\nYes\nNo" },
      // 边界值测试 - 最小规模（n=2）
      { input: "1\n2\n1 1", output: "Yes" },
      { input: "1\n2\n1 2", output: "No" },
      { input: "1\n2\n5 5", output: "Yes" },
      // 全相同
      { input: "1\n4\n2 2 2 2", output: "Yes" },
      { input: "1\n5\n3 3 3 3 3", output: "No" },
      // 对称序列
      { input: "1\n4\n1 2 2 1", output: "Yes" },
      { input: "1\n6\n1 2 3 3 2 1", output: "Yes" },
      // 总和为奇数（不可能平衡）
      { input: "1\n3\n1 1 1", output: "No" },
      { input: "1\n4\n1 2 3 5", output: "No" },
      // 较长序列
      { input: "1\n6\n1 1 1 1 1 1", output: "Yes" },
      { input: "1\n8\n1 2 3 4 4 3 2 1", output: "Yes" },
      // 多组测试
      { input: "2\n3\n5 5 5\n4\n1 3 3 1", output: "No\nYes" },
      // 第一个位置就平衡
      { input: "1\n4\n10 5 3 2", output: "Yes" },
      // 最后一个位置平衡
      { input: "1\n4\n2 3 5 10", output: "Yes" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `### 样例 1 解释\n\n- 对第一组测试用例，令 $i = 2$，有 $1 + 2 = 3$，因此序列是平衡的。\n- 对第二组测试用例，令 $i = 2$，有 $2 + 3 = 1 + 4$，因此序列是平衡的。\n- 对第三组测试用例，不存在满足要求的 $i$。\n\n### 数据规模与约定\n\n对全部的测试数据，保证 $1 \\leq t \\leq 100$，$1 \\leq n, a_i \\leq 10000$。`,
  },
  {
    title: "[GESP202409 三级] 回文拼接",
    source: "gesp_official",
    sourceId: "B4039",
    sourceUrl: "https://www.luogu.com.cn/problem/B4039",
    level: 3,
    knowledgePoints: ["字符串", "回文", "枚举"],
    difficulty: "普及-",
    description: `一个字符串是回文串，当且仅当该字符串从前往后读和从后往前读是一样的，例如，$\\texttt{aabaa}$ 和 $\\texttt{ccddcc}$ 都是回文串，但 $\\texttt{abcd}$ 不是。\n\n小杨有 $n$ 个仅包含小写字母的字符串，他想请你编写程序判断每个字符串是否由两个长度至少为 $2$ 的回文串前后拼接而成。`,
    inputFormat: `第一行包含一个正整数 $n$，代表字符串数量。  \n接下来 $n$ 行，每行一个仅包含小写字母的字符串。`,
    outputFormat: `对于每个字符串输出一行，如果该字符串由两个长度至少为 $2$ 的回文串前后拼接而成则输出 Yes，否则输出 No。`,
    samples: [
      { input: "4\nabcd\naabbb\naaac\nabcdd", output: "No\nYes\nNo\nNo" },
    ],
    testCases: [
      // 原始样例
      { input: "4\nabcd\naabbb\naaac\nabcdd", output: "No\nYes\nNo\nNo" },
      // 边界值测试 - 最短可能长度（4个字符，2+2）
      { input: "1\naaaa", output: "Yes" },
      { input: "1\naabb", output: "Yes" },
      { input: "1\nabba", output: "No" },
      { input: "1\nabcd", output: "No" },
      // 长度不够
      { input: "1\nabc", output: "No" },
      { input: "1\naa", output: "No" },
      // 两个简单回文拼接
      { input: "1\naaabb", output: "Yes" },
      { input: "1\nababb", output: "Yes" },
      { input: "1\ncccddd", output: "Yes" },
      // 全相同字符
      { input: "1\naaaaa", output: "Yes" },
      { input: "1\naaaaaa", output: "Yes" },
      // 前半部分不是回文
      { input: "1\nabcaa", output: "No" },
      { input: "1\nabcdd", output: "No" },
      // 后半部分不是回文
      { input: "1\naaabc", output: "No" },
      // 复杂回文
      { input: "1\nabacc", output: "Yes" },
      { input: "1\nabacdc", output: "Yes" },
      // 多组测试
      { input: "3\nxxxyy\nxyyx\nabba", output: "Yes\nNo\nNo" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `### 样例 1 解释

对于第 $1,3,4$ 个字符串，都不是由两个长度至少为 $2$ 的回文串前后拼接而成。
第 $2$ 个字符串由回文串 $\\texttt{aa}$ 和 $\\texttt{bbb}$ 前后拼接而成，并且两个回文串长度都至少为 $2$。

### 数据规模与约定

对全部的测试数据，保证 $1 \\leq n \\leq 10$，且每个字符串的长度均不超过 $100$。`,
  },

  // ========== 2024年12月 ==========
  {
    title: "[GESP202412 三级] 数字替换",
    source: "gesp_official",
    sourceId: "B4066",
    sourceUrl: "https://www.luogu.com.cn/problem/B4066",
    level: 3,
    knowledgePoints: ["数组", "条件判断", "最值"],
    difficulty: "入门",
    description: `小杨有一个包含 $n$ 个数字的序列 $A$，即 $A=[a_1,a_2,\\ldots,a_n]$，他想将其中大于 $k$ 的数字都替换为序列的最大值，将其中小于 $k$ 的数字都替换为序列的最小值，请你帮他计算出替换后的序列。`,
    inputFormat: `第一行包含两个正整数 $n,k$，含义如题面所示。

第二行包含 $n$ 个数字，代表序列 $A$。`,
    outputFormat: `输出 $n$ 个整数，代表替换后的结果。`,
    samples: [
      { input: "5 0\n-2 -1 0 1 2", output: "-2 -2 0 2 2" },
    ],
    testCases: [
      // 原始样例
      { input: "5 0\n-2 -1 0 1 2", output: "-2 -2 0 2 2" },
      // 边界值测试 - 只有一个数
      { input: "1 0\n5", output: "5" },
      { input: "1 5\n5", output: "5" },
      { input: "1 10\n5", output: "5" },
      // 全部等于k
      { input: "3 5\n5 5 5", output: "5 5 5" },
      // 全部大于k
      { input: "3 0\n1 2 3", output: "3 3 3" },
      // 全部小于k
      { input: "3 10\n1 2 3", output: "1 1 1" },
      // 负数测试
      { input: "4 -5\n-10 -5 0 5", output: "-10 -5 5 5" },
      { input: "3 0\n-3 -2 -1", output: "-3 -3 -3" },
      // 最大最小值相同
      { input: "4 5\n10 10 10 10", output: "10 10 10 10" },
      // 包含k的序列
      { input: "5 3\n1 2 3 4 5", output: "1 1 3 5 5" },
      // 极端值
      { input: "3 0\n-100000 0 100000", output: "-100000 0 100000" },
      // k不在序列范围内
      { input: "3 100\n1 2 3", output: "1 1 1" },
      { input: "3 -100\n1 2 3", output: "3 3 3" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于全部数据，保证有 $1\\le n\\le 10^5$，$|k|,|a_i|\\le 10^5$。`,
  },
  {
    title: "[GESP202412 三级] 打印数字",
    source: "gesp_official",
    sourceId: "B4067",
    sourceUrl: "https://www.luogu.com.cn/problem/B4067",
    level: 3,
    knowledgePoints: ["字符图形", "二维数组", "字符串"],
    difficulty: "普及-",
    description: `小杨为数字 $0,1,2$ 和 $3$ 设计了一款表示形式，每个数字占用了 $5\\times 5$ 的网格。数字 $0,1,2$ 和 $3$ 的表示形式如下：

\`\`\`plain
..... ****. ..... .....
.***. ****. ****. ****.
.***. ****. ..... .....
.***. ****. .**** ****.
..... ****. ..... .....
\`\`\`

小杨想请你将给定的数字 $n$ 转换为对应的表示形式。`,
    inputFormat: `第一行包含一个非负整数代表 $n$。`,
    outputFormat: `输出对应的表示形式。`,
    samples: [
      { input: "12230", output: "****.....................\n****.****.****.****..***.\n****.................***.\n****..****.********..***.\n****....................." },
    ],
    testCases: [
      // 原始样例
      { input: "12230", output: "****.....................\n****.****.****.****..***.\n****.................***.\n****..****.********..***.\n****....................." },
      // 单个数字测试
      { input: "0", output: ".....\n.***.\n.***.\n.***.\n....." },
      { input: "1", output: "****.\n****.\n****.\n****.\n****." },
      { input: "2", output: ".....\n****.\n.....\n.****\n....." },
      { input: "3", output: ".....\n****.\n.....\n****.\n....." },
      // 两位数
      { input: "01", output: ".....****.\n.***.****.\n.***.****.\n.***.****.\n.....****." },
      { input: "10", output: "****......\n****..***.\n****..***.\n****..***.\n****......" },
      { input: "23", output: "..........\n****.****.\n..........\n.********.\n.........." },
      // 全相同数字
      { input: "00", output: "..........\n.***..***.\n.***..***.\n.***..***.\n.........." },
      { input: "11", output: "****.****.\n****.****.\n****.****.\n****.****.\n****.****." },
      { input: "22", output: "..........\n****.****.\n..........\n.****.****\n.........." },
      { input: "33", output: "..........\n****.****.\n..........\n****.****.\n.........." },
      // 三位数
      { input: "123", output: "****...........\n****.****.****.\n****...........\n****..********.\n****..........." },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于全部数据，保证有 $0\\le n\\le 10^6$，且 $n$ 仅由数字 $0,1,2,3$ 组成。`,
  },

  // ========== 2025年3月 ==========
  {
    title: "[GESP202503 三级] 2025",
    source: "gesp_official",
    sourceId: "B4261",
    sourceUrl: "https://www.luogu.com.cn/problem/B4261",
    level: 3,
    knowledgePoints: ["位运算", "数学"],
    difficulty: "入门",
    description: `小 A 有一个整数 $x$，他想找到最小的正整数 $y$ 使得下式成立：\n\n$$(x \\ \\operatorname{and} \\ y) + (x \\ \\operatorname{or} \\ y) = 2025$$\n\n其中 $\\operatorname{and}$ 表示二进制按位与运算，$\\operatorname{or}$ 表示二进制按位或运算。如果不存在满足条件的 $y$，则输出 $-1$。`,
    inputFormat: `一行，一个整数 $x$。`,
    outputFormat: `一行，一个整数，若满足条件的 $y$ 存在则输出 $y$，否则输出 $-1$。`,
    samples: [
      { input: "1025", output: "1000" },
    ],
    testCases: [
      // 原始样例
      { input: "1025", output: "1000" },
      // 边界值测试
      { input: "0", output: "2025" },
      { input: "1", output: "2024" },
      { input: "2024", output: "1" },
      // x+y=2025的情况（(x AND y) + (x OR y) = x + y）
      { input: "1000", output: "1025" },
      { input: "1012", output: "1013" },
      { input: "1013", output: "1012" },
      // 特殊值
      { input: "512", output: "1513" },
      { input: "1024", output: "1001" },
      // 中间值
      { input: "500", output: "1525" },
      { input: "800", output: "1225" },
      // 接近2025的值
      { input: "2000", output: "25" },
      { input: "2020", output: "5" },
      // 小值
      { input: "10", output: "2015" },
      { input: "100", output: "1925" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于所有测试点，保证 $0 \\leq x < 2025$。\n\n$$(x \\ \\operatorname{and} \\ y) + (x \\ \\operatorname{or} \\ y) = 2025$$\n\n其中：\n\n- $\\operatorname{and}$ 表示按位与运算，运算符为 $\\&$。\n- $\\operatorname{or}$ 表示按位或运算，运算符为 $|$。`,
  },
  {
    title: "[GESP202503 三级] 词频统计",
    source: "gesp_official",
    sourceId: "B4262",
    sourceUrl: "https://www.luogu.com.cn/problem/B4262",
    level: 3,
    knowledgePoints: ["字符串", "哈希", "计数"],
    difficulty: "普及-",
    description: `在文本处理中，统计单词出现的频率是一个常见的任务。现在，给定 $n$ 个单词，你需要找出其中出现次数最多的单词。在本题中，忽略单词中字母的大小写（即 \`Apple\`、\`apple\`、\`APPLE\`、\`aPPle\` 等均视为同一个单词）。

请你编写一个程序，输入 $n$ 个单词，输出其中出现次数最多的单词。`,
    inputFormat: `第一行，一个整数 $n$，表示单词的个数；

接下来 $n$ 行，每行包含一个单词，单词由大小写英文字母组成。

输入保证，出现次数最多的单词只会有一个。`,
    outputFormat: `输出一行，包含出现次数最多的单词（输出单词为小写形式）。`,
    samples: [
      { input: "6\nApple\nbanana\napple\nOrange\nbanana\napple", output: "apple" },
    ],
    testCases: [
      // 原始样例
      { input: "6\nApple\nbanana\napple\nOrange\nbanana\napple", output: "apple" },
      // 边界值测试 - 只有一个单词
      { input: "1\nHello", output: "hello" },
      { input: "1\nWORLD", output: "world" },
      // 全相同（不同大小写）
      { input: "3\nTest\nTEST\ntest", output: "test" },
      { input: "4\nABC\nabc\nAbc\naBc", output: "abc" },
      // 大部分不同，只有一个出现两次
      { input: "4\na\nb\nc\na", output: "a" },
      // 大写转小写测试
      { input: "2\nABCDEFG\nabcdefg", output: "abcdefg" },
      // 混合大小写
      { input: "5\nHeLLo\nhEllO\nWorld\nworld\nhello", output: "hello" },
      // 长单词
      { input: "3\nProgramming\nprogramming\nPROGRAMMING", output: "programming" },
      // 多个单词，一个明显最多
      { input: "7\ncat\ndog\ncat\nbird\ncat\ndog\ncat", output: "cat" },
      // 全大写输入
      { input: "4\nTEST\nTEST\nTEST\nOTHER", output: "test" },
      // 全小写输入
      { input: "4\nhello\nhello\nworld\nhello", output: "hello" },
      // 单字符单词
      { input: "5\na\nA\na\nb\nB", output: "a" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于所有测试点，$1\\leq n\\leq 100$，每个单词的长度不超过 $30$，且仅由大小写字母组成。`,
  },

  // ========== 2025年6月 ==========
  {
    title: "[GESP202506 三级] 奇偶校验",
    source: "gesp_official",
    sourceId: "B4358",
    sourceUrl: "https://www.luogu.com.cn/problem/B4358",
    level: 3,
    knowledgePoints: ["位运算", "二进制", "计数"],
    difficulty: "普及-",
    description: `数据在传输过程中可能出错，因此接收方收到数据后通常会校验传输的数据是否正确，奇偶校验是经典的校验方式之一。\n\n给定 $n$ 个非负整数 $c_1, c_2, \\ldots, c_n$ 代表所传输的数据，它们的校验码取决于这些整数在二进制下 1 的数量之和的奇偶性。如果这些整数在二进制下共有奇数个 1，那么校验码为 1；否则校验码为 0。你能求出这些整数的校验码吗？`,
    inputFormat: `第一行，一个正整数 $n$，表示所传输的数据量。

第二行，$n$ 个非负整数 $c_1, c_2, \\ldots, c_n$，表示所传输的数据。`,
    outputFormat: `输出一行，两个整数，以一个空格分隔：

第一个整数表示 $c_1, c_2, \\ldots, c_n$ 在二进制下 1 的总数量；

第二个整数表示校验码（0 或 1）。`,
    samples: [
      { input: "4\n71 69 83 80", output: "13 1" },
      { input: "6\n1 2 4 8 16 32", output: "6 0" },
    ],
    testCases: [
      // 原始样例
      { input: "4\n71 69 83 80", output: "13 1" },
      { input: "6\n1 2 4 8 16 32", output: "6 0" },
      // 边界值测试 - 只有一个数
      { input: "1\n0", output: "0 0" },
      { input: "1\n1", output: "1 1" },
      { input: "1\n255", output: "8 0" },
      // 全0
      { input: "3\n0 0 0", output: "0 0" },
      // 全是同一个数
      { input: "3\n7 7 7", output: "9 1" },
      { input: "4\n15 15 15 15", output: "16 0" },
      // 2的幂次（只有1个1）
      { input: "4\n1 2 4 8", output: "4 0" },
      { input: "5\n1 2 4 8 16", output: "5 1" },
      // 255（二进制全1，8个1）
      { input: "1\n255", output: "8 0" },
      { input: "2\n255 255", output: "16 0" },
      // 混合测试
      { input: "3\n1 3 7", output: "6 0" },
      { input: "4\n0 1 2 3", output: "4 0" },
      // 奇数个1
      { input: "3\n1 1 1", output: "3 1" },
      { input: "5\n1 1 1 1 1", output: "5 1" },
      // 偶数个1
      { input: "4\n1 1 1 1", output: "4 0" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于所有测试点，保证 $1 \\leq n \\leq 100$，$0 \\leq c_i \\leq 255$。`,
  },
  {
    title: "[GESP202506 三级] 分糖果",
    source: "gesp_official",
    sourceId: "B4359",
    sourceUrl: "https://www.luogu.com.cn/problem/B4359",
    level: 3,
    knowledgePoints: ["贪心", "模拟"],
    difficulty: "普及-",
    description: `有 $n$ 位小朋友排成一队等待老师分糖果。第 $i$ 位小朋友想要至少 $a_i$ 颗糖果，并且分给他的糖果数量必须比分给前一位小朋友的糖果数量更多，不然他就会不开心。\n\n老师想知道至少需要准备多少颗糖果才能让所有小朋友都开心。你能帮帮老师吗？`,
    inputFormat: `第一行，一个正整数 $n$，表示小朋友的人数。

第二行，$n$ 个正整数 $a_1, a_2, \\ldots, a_n$，依次表示每位小朋友至少需要的糖果数量。`,
    outputFormat: `输出一行，一个整数，表示最少需要准备的糖果数量。`,
    samples: [
      { input: "4\n1 4 3 3", output: "16" },
      { input: "15\n314 15926 53589793 238462643 383279502 8 8 4 1 9 7 1 6 9 3", output: "4508143253" },
    ],
    testCases: [
      // 原始样例
      { input: "4\n1 4 3 3", output: "16" },
      { input: "15\n314 15926 53589793 238462643 383279502 8 8 4 1 9 7 1 6 9 3", output: "4508143253" },
      // 边界值测试 - 只有一个小朋友
      { input: "1\n1", output: "1" },
      { input: "1\n100", output: "100" },
      // 递增序列（每个人刚好满足）
      { input: "3\n1 2 3", output: "6" },
      { input: "4\n1 2 3 4", output: "10" },
      // 递减序列（需要调整）
      { input: "3\n3 2 1", output: "12" },
      { input: "4\n4 3 2 1", output: "22" },
      // 全相同
      { input: "3\n5 5 5", output: "18" },
      { input: "4\n10 10 10 10", output: "46" },
      // 需要大幅调整的情况
      { input: "3\n1 100 1", output: "202" },
      { input: "4\n100 1 1 1", output: "303" },
      // 边界：全是1
      { input: "5\n1 1 1 1 1", output: "15" },
      // 交替模式
      { input: "4\n1 10 1 10", output: "34" },
      // 较大数值
      { input: "3\n1000000000 1 1", output: "3000000003" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于所有测试点，保证 $1 \\leq n \\leq 1000$，$1 \\leq a_i \\leq 10^9$。`,
  },

  // ========== 2025年9月 ==========
  {
    title: "[GESP202509 三级] 数组清零",
    source: "gesp_official",
    sourceId: "B4413",
    sourceUrl: "https://www.luogu.com.cn/problem/B4413",
    level: 3,
    knowledgePoints: ["数组", "模拟", "最值"],
    difficulty: "入门",
    description: `小 A 有一个由 $n$ 个非负整数构成的数组 $a = [a_1, a_2, \\ldots, a_n]$。他会对阵组 $a$ 重复进行以下操作，直到数组 $a$ 只包含 0。在一次操作中，小 A 会依次完成以下三个步骤：

1. 在数组 $a$ 中找到最大的整数，记其下标为 $k$。如果有多个最大值，那么选择其中下标最大的。
2. 从数组 $a$ 所有不为零的整数中找到最小的整数 $a_j$。
3. 将第一步找出的 $a_k$ 减去 $a_j$。

例如，数组 $a = [2, 3, 4]$ 需要 7 次操作变成 $[0, 0, 0]$：

$$
[2, 3, 4] \\rightarrow [2, 3, 2] \\rightarrow [2, 1, 2] \\rightarrow [2, 1, 1] \\rightarrow [1, 1, 1] \\rightarrow [1, 1, 0] \\rightarrow [1, 0, 0] \\rightarrow [0, 0, 0]
$$

小 A 想知道，对于给定的数组 $a$，需要多少次操作才能使得 $a$ 中的整数全部变成 0。可以证明，$a$ 中整数必然可以在有限次操作后全部变成 0。你能帮他计算出答案吗？`,
    inputFormat: `第一行，一个正整数 $n$，表示数组 $a$ 的长度。

第二行，$n$ 个非负整数 $a_1, a_2, \\ldots, a_n$，表示数组 $a$ 中的整数。`,
    outputFormat: `一行，一个正整数，表示 $a$ 中整数全部变成 0 所需要的操作次数。`,
    samples: [
      { input: "3\n2 3 4", output: "7" },
      { input: "5\n1 3 2 2 5", output: "13" },
    ],
    testCases: [
      // 原始样例
      { input: "3\n2 3 4", output: "7" },
      { input: "5\n1 3 2 2 5", output: "13" },
      // 边界值测试 - 只有一个元素
      { input: "1\n0", output: "0" },
      { input: "1\n1", output: "1" },
      { input: "1\n100", output: "1" },
      // 全0
      { input: "3\n0 0 0", output: "0" },
      // 全相同
      { input: "3\n5 5 5", output: "3" },
      { input: "4\n3 3 3 3", output: "4" },
      // 递增序列
      { input: "4\n1 2 3 4", output: "10" },
      { input: "5\n1 2 3 4 5", output: "15" },
      // 递减序列
      { input: "4\n4 3 2 1", output: "10" },
      // 包含0
      { input: "4\n0 1 2 3", output: "6" },
      { input: "3\n0 0 5", output: "1" },
      // 只有两个元素
      { input: "2\n3 5", output: "5" },
      { input: "2\n5 3", output: "5" },
      // 较大值
      { input: "3\n100 100 100", output: "3" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于所有测试点，保证 $1 \\leq n \\leq 100$，$0 \\leq a_i \\leq 100$。`,
  },
  {
    title: "[GESP202509 三级] 日历制作",
    source: "gesp_official",
    sourceId: "B4414",
    sourceUrl: "https://www.luogu.com.cn/problem/B4414",
    level: 3,
    knowledgePoints: ["日期计算", "格式化输出", "二维数组"],
    difficulty: "普及-",
    description: `小 A 想制作 $2025$ 年每个月的日历。他希望你能编写一个程序，按照格式输出给定月份的日历。\n\n具体来说，第一行需要输出 MON TUE WED THU FRI SAT SUN，分别表示星期一到星期日。接下来若干行中依次输出这个月所包含的日期，日期的个位需要和对应星期几的缩写最后一个字母对齐。例如，$2025$ 年 $9$ 月 $1$ 日是星期一，在输出九月的日历时，$1$ 号的个位 $1$ 就需要与星期一 MON 的最后一个字母 N 对齐。九月的日历输出效果如下:\n\n\`\`\`\nMON TUE WED THU FRI SAT SUN\n  1   2   3   4   5   6   7\n  8   9  10  11  12  13  14\n 15  16  17  18  19  20  21\n 22  23  24  25  26  27  28\n 29  30\n\`\`\`\n\n你能帮助小 A 完成日历的制作吗?`,
    inputFormat: `一行，一个正整数 $m$，表示需要按照格式输出 $2025$ 年 $m$ 月的日历。`,
    outputFormat: `输出包含若干行，表示 $2025$ 年 $m$ 月的日历。`,
    samples: [
      { input: "9", output: "MON TUE WED THU FRI SAT SUN\n  1   2   3   4   5   6   7\n  8   9  10  11  12  13  14\n 15  16  17  18  19  20  21\n 22  23  24  25  26  27  28\n 29  30" },
      { input: "6", output: "MON TUE WED THU FRI SAT SUN\n                          1\n  2   3   4   5   6   7   8\n  9  10  11  12  13  14  15\n 16  17  18  19  20  21  22\n 23  24  25  26  27  28  29\n 30" },
    ],
    testCases: [
      // 原始样例
      { input: "9", output: "MON TUE WED THU FRI SAT SUN\n  1   2   3   4   5   6   7\n  8   9  10  11  12  13  14\n 15  16  17  18  19  20  21\n 22  23  24  25  26  27  28\n 29  30" },
      // 2025年1月（周三开始，31天）
      { input: "1", output: "MON TUE WED THU FRI SAT SUN\n          1   2   3   4   5\n  6   7   8   9  10  11  12\n 13  14  15  16  17  18  19\n 20  21  22  23  24  25  26\n 27  28  29  30  31" },
      // 2025年2月（非闰年，28天，周六开始）
      { input: "2", output: "MON TUE WED THU FRI SAT SUN\n                      1   2\n  3   4   5   6   7   8   9\n 10  11  12  13  14  15  16\n 17  18  19  20  21  22  23\n 24  25  26  27  28" },
      // 2025年3月（周六开始，31天）
      { input: "3", output: "MON TUE WED THU FRI SAT SUN\n                      1   2\n  3   4   5   6   7   8   9\n 10  11  12  13  14  15  16\n 17  18  19  20  21  22  23\n 24  25  26  27  28  29  30\n 31" },
      // 2025年4月（周二开始，30天）
      { input: "4", output: "MON TUE WED THU FRI SAT SUN\n      1   2   3   4   5   6\n  7   8   9  10  11  12  13\n 14  15  16  17  18  19  20\n 21  22  23  24  25  26  27\n 28  29  30" },
      // 2025年5月（周四开始，31天）
      { input: "5", output: "MON TUE WED THU FRI SAT SUN\n              1   2   3   4\n  5   6   7   8   9  10  11\n 12  13  14  15  16  17  18\n 19  20  21  22  23  24  25\n 26  27  28  29  30  31" },
      // 2025年6月（周日开始，30天）
      { input: "6", output: "MON TUE WED THU FRI SAT SUN\n                          1\n  2   3   4   5   6   7   8\n  9  10  11  12  13  14  15\n 16  17  18  19  20  21  22\n 23  24  25  26  27  28  29\n 30" },
      // 2025年7月（周二开始，31天）
      { input: "7", output: "MON TUE WED THU FRI SAT SUN\n      1   2   3   4   5   6\n  7   8   9  10  11  12  13\n 14  15  16  17  18  19  20\n 21  22  23  24  25  26  27\n 28  29  30  31" },
      // 2025年8月（周五开始，31天）
      { input: "8", output: "MON TUE WED THU FRI SAT SUN\n                  1   2   3\n  4   5   6   7   8   9  10\n 11  12  13  14  15  16  17\n 18  19  20  21  22  23  24\n 25  26  27  28  29  30  31" },
      // 2025年10月（周三开始，31天）
      { input: "10", output: "MON TUE WED THU FRI SAT SUN\n          1   2   3   4   5\n  6   7   8   9  10  11  12\n 13  14  15  16  17  18  19\n 20  21  22  23  24  25  26\n 27  28  29  30  31" },
      // 2025年11月（周六开始，30天）
      { input: "11", output: "MON TUE WED THU FRI SAT SUN\n                      1   2\n  3   4   5   6   7   8   9\n 10  11  12  13  14  15  16\n 17  18  19  20  21  22  23\n 24  25  26  27  28  29  30" },
      // 2025年12月（周一开始，31天）
      { input: "12", output: "MON TUE WED THU FRI SAT SUN\n  1   2   3   4   5   6   7\n  8   9  10  11  12  13  14\n 15  16  17  18  19  20  21\n 22  23  24  25  26  27  28\n 29  30  31" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于所有测试点，保证 $1 \\leq m \\leq 12$。`,
  },

  // ========== 2025年12月 ==========
  {
    title: "[GESP202512 三级] 密码强度",
    source: "gesp_official",
    sourceId: "B4449",
    sourceUrl: "https://www.luogu.com.cn/problem/B4449",
    level: 3,
    knowledgePoints: ["字符串", "条件判断"],
    difficulty: "入门",
    description: `小杨是学校网络安全小组的成员，今天他的任务是设计一个“密码强度检测器”，帮助同学们检查自己的密码是否足够安全。一个安全的密码需要满足以下条件：

- 密码至少包含 $8$ 个字符（太短的密码容易被猜出来哦！）。
- 密码至少包含一个大写字母（A、B、C、...、Z 都可以）。
- 密码至少包含一个数字（0、1、2、3、...、9 都可以）。

例如：

- 密码 \`PAs1s2an\` 是安全密码（有 $8$ 位、包含大写字母 \`P\`、\`A\` 和数字 \`1\`、\`2\`）。
- 密码 \`ab1da3cd\` 不是安全密码（没有大写字母）。
- 密码 \`Paabdbcd\` 不是安全密码（没有数字）。
- 密码 \`Pa2\` 不是安全密码（只有 $3$ 位，太短了）。`,
    inputFormat: `第一行一个正整数 $T$，代表需要安全检测的密码组数。

对于每组密码，一行包含一个字符串，代表需要安全检测的密码。`,
    outputFormat: `对于每组密码，输出一行，如果满足强度要求输出 Y，否则输出 N。`,
    samples: [
      { input: "6\nPAs1s2an\n1a2bCql3\nPa12bsna\nab1da3cd\nPaabdbcd\nPa2", output: "Y\nY\nY\nN\nN\nN" },
    ],
    testCases: [
      // 原始样例
      { input: "6\nPAs1s2an\n1a2bCq13\nPa12bsna\nab1da3cd\nPaabdbcd\nPa2", output: "Y\nY\nY\nN\nN\nN" },
      // 边界值测试 - 刚好8位
      { input: "1\nAa123456", output: "Y" },
      { input: "1\n1234567A", output: "Y" },
      // 长度不足8位
      { input: "1\nAa12345", output: "N" },
      { input: "1\nAa1", output: "N" },
      { input: "1\nA", output: "N" },
      // 缺少大写字母
      { input: "1\nabcd1234", output: "N" },
      { input: "1\n12345678a", output: "N" },
      // 缺少数字
      { input: "1\nABCDEFGH", output: "N" },
      { input: "1\nAbcdefgh", output: "N" },
      // 只有数字
      { input: "1\n12345678", output: "N" },
      // 只有小写字母
      { input: "1\nabcdefgh", output: "N" },
      // 只有大写字母
      { input: "1\nABCDEFGH", output: "N" },
      // 较长密码
      { input: "1\nAa1234567890abcdefg", output: "Y" },
      // 多组测试
      { input: "3\nPassword1\n12345678\nABCDabcd", output: "Y\nN\nN" },
      // 恰好满足条件
      { input: "1\naaaaaA1a", output: "Y" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `### 样例解释

- 密码 \`PAs1s2an\` 是安全密码（有 $8$ 位、包含大写字母 \`P\`、\`A\` 和数字 \`1\`、\`2\`）。
- 密码 \`1a2bCq13\` 是安全密码（有 $8$ 位、包含大写字母 \`C\` 和数字 \`1\`、\`2\`、\`3\`）。
- 密码 \`Pa12bsna\` 是安全密码（有 $8$ 位、包含大写字母 \`P\` 和数字 \`1\`、\`2\`）。
- 密码 \`ab1da5cd\` 不是安全密码（没有大写字母）。
- 密码 \`Paabdbcd\` 不是安全密码（没有数字）。
- 密码 \`Pa2\` 不是安全密码（只有 $3$ 位，太短了）。

### 数据范围

对于所有测试点，保证 $1 \\leq T \\leq 100$，并且每组密码长度不超过 $100$ 且至少为 $1$，每组密码仅由大小写字母和数字组成。`,
  },
  {
    title: "[GESP202512 三级] 小杨的智慧购物",
    source: "gesp_official",
    sourceId: "B4450",
    sourceUrl: "https://www.luogu.com.cn/problem/B4450",
    level: 3,
    knowledgePoints: ["数组", "最小值", "分类"],
    difficulty: "入门",
    description: `小杨的班级要举办一个环保手工作品展览，老师请小杨去文具店购买 $M$ 种不同的文具（例如：铅笔、橡皮、尺子等）。\n\n商店里共有 $N$ 件文具，每件文具都有一个种类编号（从 $1$ 到 $M$）和价格。\n\n小杨的预算有限，他想了一个聪明的办法：对于每种文具，他只买最便宜的那一件（如果同种文具有多件价格相同且都是最便宜的，他只会购买其中的一件）。请你帮小杨计算出，买齐这 $M$ 种文具一共需要花费多少钱。`,
    inputFormat: `第一行两个正整数 $M, N$，代表文具的种类数和总数。\n\n之后 $N$ 行，每行两个正整数 $K_i$ 和 $P_i$，分别代表第 $i$ 件文具的种类编号和它的价格。数据保证每个种类至少有一件文具可供购买。`,
    outputFormat: `输出一行，代表购买文具的总价。`,
    samples: [
      { input: "2 5\n1 1\n1 2\n1 1\n2 3\n2 10", output: "4" },
    ],
    testCases: [
      // 原始样例
      { input: "2 5\n1 1\n1 2\n1 1\n2 3\n2 10", output: "4" },
      // 边界值测试 - 只有一种文具
      { input: "1 1\n1 5", output: "5" },
      { input: "1 3\n1 10\n1 5\n1 8", output: "5" },
      // 每种文具只有一件
      { input: "3 3\n1 10\n2 20\n3 30", output: "60" },
      // 全相同价格
      { input: "2 4\n1 5\n1 5\n2 5\n2 5", output: "10" },
      // 价格递增
      { input: "3 6\n1 1\n1 2\n2 3\n2 4\n3 5\n3 6", output: "9" },
      // 价格递减
      { input: "2 4\n1 10\n1 5\n2 20\n2 15", output: "20" },
      // 大量同类文具
      { input: "1 5\n1 100\n1 50\n1 30\n1 20\n1 10", output: "10" },
      // 多种文具
      { input: "4 8\n1 10\n2 20\n3 30\n4 40\n1 5\n2 15\n3 25\n4 35", output: "80" },
      // 最小价格为1
      { input: "3 6\n1 1\n2 1\n3 1\n1 100\n2 100\n3 100", output: "3" },
      // 较大价格
      { input: "2 4\n1 1000000000\n1 1\n2 1000000000\n2 2", output: "3" },
      // 交替种类
      { input: "2 6\n1 5\n2 10\n1 3\n2 8\n1 4\n2 6", output: "9" },
      // 只选最便宜
      { input: "3 9\n1 100\n1 50\n1 1\n2 200\n2 100\n2 2\n3 300\n3 150\n3 3", output: "6" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `### 样例解释\n\n文具清单如下：\n\n- 文具 1：种类 1，价格 $1$\n- 文具 2：种类 1，价格 $2$\n- 文具 3：种类 1，价格 $1$\n- 文具 4：种类 2，价格 $3$\n- 文具 5：种类 2，价格 $10$\n\n小杨的选择过程：对于种类 1：有三件商品，价格分别为 $1, 2, 1$。其中最便宜的价格是 $1$。对于种类 2：有两件商品，价格分别为 $3, 10$。其中最便宜的价格是 $3$。\n\n计算总价：小杨购买这两类文具的总花费为 $1 + 3 = 4$。\n\n### 数据范围\n\n对于所有测试点，保证 $1 \\leq M \\leq N \\leq 10^5$，$1 \\leq K_i \\leq M$，$1 \\leq P_i \\leq 10^3$。`,
  },
];

export const { GET, POST } = createSeedHandler(gesp3Problems, "GESP 3级");
