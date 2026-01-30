import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GESP 3级完整题库 - 来源：洛谷 CCF GESP C++ 三级上机题
// 官方题单：https://www.luogu.com.cn/training/553
// 所有内容与洛谷100%一致

const gesp3Problems = [
  // ========== 样题 ==========
  {
    title: "[GESP样题 三级] 逛商场",
    source: "gesp_official",
    sourceId: "B3848",
    sourceUrl: "https://www.luogu.com.cn/problem/B3848",
    level: 3,
    knowledgePoints: ["数组", "循环", "模拟"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1103`,
    description: `小明是个不太有计划的孩子。刚到手的零花钱，就全部拿着逛商场去了。小明的原则很简单，见到想买的物品，只要能买得起，就一定会买下来之后才会继续往前走；如果买不起就直接跳过。一天下来，小明到底买了多少物品呢？`,
    inputFormat: `输入共3行：第一行是整数N，表示商场中共有N种小明想买的物品（1≤N≤100）；第二行共有N个整数，分别表示小明先后见到想买的物品的价格；第三行是整数X，表示开始时小明共有X元零花钱。`,
    outputFormat: `输出1行，包含一个整数，表示小明买到的物品数。`,
    samples: [
      { input: "6\n7 5 9 10 7 4\n30", output: "4" },
    ],
    testCases: [
      { input: "6\n7 5 9 10 7 4\n30", output: "4" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `数据范围：对于100%的数据满足1≤N≤100且0≤aᵢ≤100000。`,
  },
  {
    title: "[GESP样题 三级] 进制转换",
    source: "gesp_official",
    sourceId: "B3849",
    sourceUrl: "https://www.luogu.com.cn/problem/B3849",
    level: 3,
    knowledgePoints: ["进制转换", "数学", "字符串"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1103`,
    description: `小美学习了十六进制，想探索更大的进制。在十六进制中，A表示10、F表示15。若用Z表示35，就能表示36进制。需要编写程序完成十进制转R进制（2≤R≤36）的转换。`,
    inputFormat: `两行输入：第一行为正整数N，第二行为正整数R，其中1≤N≤10⁶。`,
    outputFormat: `输出N的R进制表示。`,
    samples: [
      { input: "123\n25", output: "4N" },
    ],
    testCases: [
      { input: "123\n25", output: "4N" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: ``,
  },
  // ========== 2023年6月 ==========
  {
    title: "[GESP202306 三级] 春游",
    source: "gesp_official",
    sourceId: "B3842",
    sourceUrl: "https://www.luogu.com.cn/problem/B3842",
    level: 3,
    knowledgePoints: ["数组", "标记数组", "模拟"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1125`,
    description: `A teacher leads students on a spring outing. There are N students, each with a unique ID from 0 to N-1. At assembly time, the teacher asks students to report their IDs to confirm all have arrived. Present students report their own ID only, but some mischievous students report multiple times. Identify which students failed to arrive.`,
    inputFormat: `Two lines: First line contains integers N and M (2 ≤ N,M ≤ 1000), representing N students and M total reports. Second line contains M integers representing the reported IDs, all less than N and non-negative.`,
    outputFormat: `Output one line. If all students arrived, output N; otherwise output missing student IDs in ascending order, space-separated.`,
    samples: [
      { input: "3 3\n0 2 1", output: "3" },
      { input: "3 5\n0 0 0 0 0", output: "1 2" },
    ],
    testCases: [
      { input: "3 3\n0 2 1", output: "3" },
      { input: "3 5\n0 0 0 0 0", output: "1 2" },
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
    knowledgePoints: ["字符串", "条件判断"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1125`,
    description: `网站注册需要有用户名和密码，编写程序以检查用户输入密码的有效性。合规的密码应满足以下要求：

1. 只能由 a~z 之间 26 个小写字母、A~Z 之间 26 个大写字母、0~9 之间 10 个数字以及 !@#$ 四个特殊字符构成。

2. 密码最短长度：6 个字符，密码最大长度：12 个字符。

3. 大写字母，小写字母和数字必须至少有其中两种，以及至少有四个特殊字符中的一个。`,
    inputFormat: `输入一行不含空格的字符串。约定长度不超过 100。该字符串被英文逗号分隔为多段，作为多组被检测密码。`,
    outputFormat: `输出若干行，每行输出一组合规的密码。输出顺序以输入先后为序，即先输入则先输出。`,
    samples: [
      { input: "seHJ12!@,sjdkffH$123,sdf!@&12HDHa!,123&^YUhg@!", output: "seHJ12!@\nsjdkffH$123" },
    ],
    testCases: [
      { input: "seHJ12!@,sjdkffH$123,sdf!@&12HDHa!,123&^YUhg@!", output: "seHJ12!@\nsjdkffH$123" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `【样例 1 解释】输入被逗号分为四组密码：seHJ12!@、sjdkffH$123、sdf!@&12HDHa!、123&^YUhg@!。其中 sdf!@&12HDHa! 长度超过 12 个字符，不合规；123&^YUhg@! 包含四个特殊字符之外的字符不合规。`,
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
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1129`,
    description: `小杨拥有N个编号从0到N-1的储蓄罐。从第1天起，每天他选择一个罐子存入对应天数的金额。在D天后，需要计算每个罐子中的总存款。`,
    inputFormat: `第一行包含两个整数N和D；第二行包含D个整数，第i个表示第i天选择的罐子编号a_i（范围：0 ≤ a_i ≤ N-1）。`,
    outputFormat: `输出N个空格分隔的整数，第i个表示编号i-1的罐子中的金额（i=1,…,N）`,
    samples: [
      { input: "2 3\n0 1 0", output: "4 2" },
      { input: "3 5\n0 0 0 2 0", output: "11 0 4" },
    ],
    testCases: [
      { input: "2 3\n0 1 0", output: "4 2" },
      { input: "3 5\n0 0 0 2 0", output: "11 0 4" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `在样例1中，第1、2、3天分别向0号、1号、0号罐存入1、2、3元，故0号罐共4元，1号罐共2元。`,
  },
  {
    title: "[GESP202309 三级] 进制判断",
    source: "gesp_official",
    sourceId: "B3868",
    sourceUrl: "https://www.luogu.com.cn/problem/B3868",
    level: 3,
    knowledgePoints: ["字符串", "进制"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1129`,
    description: `N进制数指的是逢N进一的计数制。需判断N个数是否可能为二进制、八进制、十进制、十六进制。例如，15A6F只可能是十六进制，而1011则四种进制皆有可能。`,
    inputFormat: `第一行为十进制整数N。接下来N行各一字符串，由数字和大写字母组成，可能以0开头。1≤N≤1000，字符串长度不超过10。`,
    outputFormat: `N行，每行4个数用空格隔开，分别表示是否可能为二进制、八进制、十进制、十六进制。用1表示可能，0表示不可能。`,
    samples: [
      { input: "2\n15A6F\n1011", output: "0 0 0 1\n1 1 1 1" },
      { input: "4\n1234567\n12345678\nFF\nGG", output: "0 1 1 1\n0 0 1 1\n0 0 0 1\n0 0 0 0" },
    ],
    testCases: [
      { input: "2\n15A6F\n1011", output: "0 0 0 1\n1 1 1 1" },
      { input: "4\n1234567\n12345678\nFF\nGG", output: "0 1 1 1\n0 0 1 1\n0 0 0 1\n0 0 0 0" },
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
    knowledgePoints: ["数学", "模拟", "逆向思维"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1135`,
    description: `海滩上有一堆鱼，N只小猫来分。第一只小猫把这堆鱼平均分为N份，多了i<N个，这只小猫把多的i个扔入海中，拿走了一份。第二只小猫接着把剩下的鱼平均分成N份，又多了i个，小猫同样把多的i个扔入海中，拿走了一份。第三、第四、……，第N只小猫仍是最终剩下的鱼分成N份，扔掉多了的i个，并拿走一份。编写程序，输入小猫的数量N以及每次扔到海里的鱼的数量i，输出海滩上最少的鱼数，使得每只小猫都可吃到鱼。`,
    inputFormat: `总共2行。第一行一个整数N，第二行一个整数i。保证0<N<10；i<N。`,
    outputFormat: `一行一个整数，表示满足要求的海滩上最少的鱼数。`,
    samples: [
      { input: "2\n1", output: "7" },
      { input: "3\n1", output: "25" },
    ],
    testCases: [
      { input: "2\n1", output: "7" },
      { input: "3\n1", output: "25" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `三只小猫来分鱼N=3，每次扔掉鱼的数量为i=1，为了每只小猫都可吃到鱼，可令第三只小猫需要拿走3条鱼，则此时待分配的有10条鱼。第二只小猫待分配的鱼有10×3/2+1=16条。第一只小猫待分配的鱼有16×3/2+1=25条。`,
  },
  {
    title: "[GESP202312 三级] 单位转换",
    source: "gesp_official",
    sourceId: "B3926",
    sourceUrl: "https://www.luogu.com.cn/problem/B3926",
    level: 3,
    knowledgePoints: ["字符串", "模拟"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1135`,
    description: `小杨需要完成单位转换作业。长度单位：1km=1000m=1000000mm；重量单位：1kg=1000g=1000000mg。作业仅涉及大单位转小单位的6种题型。`,
    inputFormat: `第一行为整数N表示题目数量。接下来N行为转换题目，格式为「x 单位1 = ? 单位2」，其中x为不超过1000的非负整数，单位均为英文缩写，且单位1比单位2更大。`,
    outputFormat: `输出N行答案，将「?」替换为计算结果，其余部分保持原样。由于只涉及大转小且x为整数，答案必为整数。`,
    samples: [
      { input: "2\n1 km = ? mm\n1 m = ? mm", output: "1 km = 1000000 mm\n1 m = 1000 mm" },
      { input: "5\n100 m = ? mm\n1000 km = ? m\n20 kg = ? g\n200 g = ? mg\n0 kg = ? mg", output: "100 m = 100000 mm\n1000 km = 1000000 m\n20 kg = 20000 g\n200 g = 200000 mg\n0 kg = 0 mg" },
    ],
    testCases: [
      { input: "2\n1 km = ? mm\n1 m = ? mm", output: "1 km = 1000000 mm\n1 m = 1000 mm" },
      { input: "5\n100 m = ? mm\n1000 km = ? m\n20 kg = ? g\n200 g = ? mg\n0 kg = ? mg", output: "100 m = 100000 mm\n1000 km = 1000000 m\n20 kg = 20000 g\n200 g = 200000 mg\n0 kg = 0 mg" },
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
    knowledgePoints: ["字符串", "ASCII码"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1143`,
    description: `小杨同学发明了一种密码系统：小写字母代表其在字母表中的位置（a=1, b=2等），大写字母代表其ASCII码的相反数（A=-65等）。给定一个混合大小写字母的字符串，需要计算所有字母代表数字的总和。例如'aAc'对应1+(-65)+3=-61。`,
    inputFormat: `第一行：正整数n（字符串中字母个数）；第二行：由大小写字母组成的字符串T`,
    outputFormat: `输出一行整数，代表加密前的整数`,
    samples: [
      { input: "3\naAc", output: "-61" },
    ],
    testCases: [
      { input: "3\naAc", output: "-61" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `对全部的测试数据，保证 1 ≤ n ≤ 10^5`,
  },
  {
    title: "[GESP202403 三级] 完全平方数",
    source: "gesp_official",
    sourceId: "B3957",
    sourceUrl: "https://www.luogu.com.cn/problem/B3957",
    level: 3,
    knowledgePoints: ["数组", "枚举", "数学"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1143`,
    description: `小杨同学有一个包含 n 个非负整数的序列 A，他想要知道其中有多少对下标组合 ⟨i,j⟩（1 ≤ i < j ≤ n），使得 A_i + A_j 是完全平方数。如果 x 是完全平方数，则存在非负整数 y 使得 y × y = x。`,
    inputFormat: `第一行一个非负整数 n，表示非负整数个数。第二行包含 n 个非负整数 A_1, A_2, …, A_n，表示序列 A 包含的非负整数。`,
    outputFormat: `输出一行一个整数表示答案。`,
    samples: [
      { input: "5\n1 4 3 3 5", output: "3" },
    ],
    testCases: [
      { input: "5\n1 4 3 3 5", output: "3" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `对全部的测试数据，保证 1 ≤ n ≤ 1000，0 ≤ A_i ≤ 10^5。`,
  },
  // ========== 2024年6月 ==========
  {
    title: "[GESP202406 三级] 移位",
    source: "gesp_official",
    sourceId: "B4003",
    sourceUrl: "https://www.luogu.com.cn/problem/B4003",
    level: 3,
    knowledgePoints: ["字符串", "加密"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1151`,
    description: `小杨学习了加密技术移位，所有大写字母都向后按照一个固定数目进行偏移。偏移过程会将字母表视作首尾相接的环，例如，当偏移量是 3 的时候，大写字母 A 会替换成 D，大写字母 Z 会替换成 C，总体来看，大写字母表 ABCDEFGHIJKLMNOPQRSTUVWXYZ 会被替换成 DEFGHIJKLMNOPQRSTUVWXYZABC。注：当偏移量是 26 的倍数时，每个大写字母经过偏移后会恰好回到原来的位置。`,
    inputFormat: `第一行包含一个正整数 n。`,
    outputFormat: `输出在偏移量为 n 的情况下，大写字母表 ABCDEFGHIJKLMNOPQRSTUVWXYZ 移位替换后的结果。`,
    samples: [
      { input: "3", output: "DEFGHIJKLMNOPQRSTUVWXYZABC" },
    ],
    testCases: [
      { input: "3", output: "DEFGHIJKLMNOPQRSTUVWXYZABC" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `当偏移量是 3 的时候，大写字母 A 会替换成 D，大写字母 Z 会替换成 C，总体来看，大写字母表 ABCDEFGHIJKLMNOPQRSTUVWXYZ 会被替换成 DEFGHIJKLMNOPQRSTUVWXYZABC。数据范围：1≤n≤100。`,
  },
  {
    title: "[GESP202406 三级] 寻找倍数",
    source: "gesp_official",
    sourceId: "B4004",
    sourceUrl: "https://www.luogu.com.cn/problem/B4004",
    level: 3,
    knowledgePoints: ["数组", "数学"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1151`,
    description: `小杨有一个包含 n 个正整数的序列 A=[a₁,a₂,…,aₙ]，他想知道是否存在 i(1≤i≤n) 使得 aᵢ 是序列 A 中所有数的倍数。`,
    inputFormat: `第一行包含正整数 t，代表测试用例组数。接下来是 t 组测试用例。对于每组测试用例，一共两行。第一行包含正整数 n；第二行包含 n 个正整数，代表序列 A。`,
    outputFormat: `对于每组测试用例，如果存在 i(1≤i≤n)，满足对于所有 k(1≤k≤n) aᵢ 是 aₖ 的倍数，输出 Yes，否则输出 No。`,
    samples: [
      { input: "2\n3\n1 2 4\n5\n1 2 3 4 5", output: "Yes\nNo" },
    ],
    testCases: [
      { input: "2\n3\n1 2 4\n5\n1 2 3 4 5", output: "Yes\nNo" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `对于第一组数据，对于 a₃=4，满足 a₃ 是 a₁ 和 a₂ 的倍数。数据范围：1≤t≤10，1≤n≤10⁵，1≤aᵢ≤10⁹。`,
  },
  // ========== 2024年9月 ==========
  {
    title: "[GESP202409 三级] 平衡序列",
    source: "gesp_official",
    sourceId: "B4038",
    sourceUrl: "https://www.luogu.com.cn/problem/B4038",
    level: 3,
    knowledgePoints: ["数组", "前缀和"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1159`,
    description: `小杨有一个包含 n 个正整数的序列 a。序列是平衡的当且仅当存在正整数 i（1 ≤ i < n）使得第 1 到第 i 个数字的总和等于第 i+1 到第 n 个数字的总和。判断序列 a 是否平衡。`,
    inputFormat: `本题单个测试点内包含多组测试数据。第一行是正整数 t 表示测试用例组数。接下来 t 组，每组两行：第一行包含正整数 n 表示序列长度；第二行包含 n 个正整数代表序列 a。`,
    outputFormat: `对每组测试用例输出一行字符串。若 a 是平衡的，输出 Yes，否则输出 No。`,
    samples: [
      { input: "3\n3\n1 2 3\n4\n2 3 1 4\n5\n1 2 3 4 5", output: "Yes\nYes\nNo" },
    ],
    testCases: [
      { input: "3\n3\n1 2 3\n4\n2 3 1 4\n5\n1 2 3 4 5", output: "Yes\nYes\nNo" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `样例解释：第一组令 i=2，有 1+2=3；第二组令 i=2，有 2+3=1+4；第三组不存在满足要求的 i。数据范围：1≤t≤100，1≤n,aᵢ≤10000。`,
  },
  {
    title: "[GESP202409 三级] 回文拼接",
    source: "gesp_official",
    sourceId: "B4039",
    sourceUrl: "https://www.luogu.com.cn/problem/B4039",
    level: 3,
    knowledgePoints: ["字符串", "回文"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1159`,
    description: `一个字符串是回文串，当且仅当该字符串从前往后读和从后往前读是一样的，例如，aabaa 和 ccddcc 都是回文串，但 abcd 不是。小杨有 n 个仅包含小写字母的字符串，他想请你编写程序判断每个字符串是否由两个长度至少为 2 的回文串前后拼接而成。`,
    inputFormat: `第一行包含一个正整数 n，代表字符串数量。接下来 n 行，每行一个仅包含小写字母的字符串。`,
    outputFormat: `对于每个字符串输出一行，如果该字符串由两个长度至少为 2 的回文串前后拼接而成则输出 Yes，否则输出 No。`,
    samples: [
      { input: "4\nabcd\naabbb\naaac\nabcdd", output: "No\nYes\nNo\nNo" },
    ],
    testCases: [
      { input: "4\nabcd\naabbb\naaac\nabcdd", output: "No\nYes\nNo\nNo" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `对于第 1,3,4 个字符串，都不是由两个长度至少为 2 的回文串前后拼接而成。第 2 个字符串由回文串 aa 和 bbb 前后拼接而成，并且两个回文串长度都至少为 2。数据规模：1 ≤ n ≤ 10，每个字符串长度不超过 100。`,
  },
  // ========== 2024年12月 ==========
  {
    title: "[GESP202412 三级] 数字替换",
    source: "gesp_official",
    sourceId: "B4066",
    sourceUrl: "https://www.luogu.com.cn/problem/B4066",
    level: 3,
    knowledgePoints: ["数组", "模拟"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1167`,
    description: `小杨有一个包含 n 个数字的序列 A，即 A=[a_1,a_2,...,a_n]，他想将其中大于 k 的数字都替换为序列的最大值，将其中小于 k 的数字都替换为序列的最小值，请你帮他计算出替换后的序列。`,
    inputFormat: `第一行包含两个正整数 n,k，含义如题面所示。第二行包含 n 个数字，代表序列 A。`,
    outputFormat: `输出 n 个整数，代表替换后的结果。`,
    samples: [
      { input: "5 0\n-2 -1 0 1 2", output: "-2 -2 0 2 2" },
    ],
    testCases: [
      { input: "5 0\n-2 -1 0 1 2", output: "-2 -2 0 2 2" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `对于全部数据，保证有 1≤n≤10^5，|k|,|a_i|≤10^5。`,
  },
  {
    title: "[GESP202412 三级] 打印数字",
    source: "gesp_official",
    sourceId: "B4067",
    sourceUrl: "https://www.luogu.com.cn/problem/B4067",
    level: 3,
    knowledgePoints: ["字符串", "模拟"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1167`,
    description: `小杨为数字0,1,2和3设计了表示形式，每个数字占用5×5网格。需要将给定数字n转换为对应的表示形式。数字表示为由点号和星号组成的5行图案。`,
    inputFormat: `第一行包含一个非负整数代表n。`,
    outputFormat: `输出对应的表示形式。`,
    samples: [
      { input: "12230", output: "****.....................\n****.****.****.****..***. \n****.................***.\\n****..****.****.****..**. \n****....................." },
    ],
    testCases: [
      { input: "12230", output: "****.....................\n****.****.****.****..***. \n****.................***.\\n****..****.****.****..**. \n****....................." },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `对于全部数据，保证0≤n≤10⁶，且n仅由数字0,1,2,3组成。`,
  },
  // ========== 2025年3月 ==========
  {
    title: "[GESP202503 三级] 2025",
    source: "gesp_official",
    sourceId: "B4261",
    sourceUrl: "https://www.luogu.com.cn/problem/B4261",
    level: 3,
    knowledgePoints: ["位运算", "数学"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1175`,
    description: `小 A 有一个整数 x，他想找到最小的正整数 y 使得下式成立：(x and y) + (x or y) = 2025，其中 and 表示二进制按位与运算，or 表示二进制按位或运算。如果不存在满足条件的 y，则输出 -1。`,
    inputFormat: `一行，一个整数 x。`,
    outputFormat: `一行，一个整数，若满足条件的 y 存在则输出 y，否则输出 -1。`,
    samples: [
      { input: "1025", output: "1000" },
    ],
    testCases: [
      { input: "1025", output: "1000" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `对于所有测试点，保证 0 ≤ x < 2025。and 表示按位与运算，运算符为 &。or 表示按位或运算，运算符为 |。`,
  },
  {
    title: "[GESP202503 三级] 词频统计",
    source: "gesp_official",
    sourceId: "B4262",
    sourceUrl: "https://www.luogu.com.cn/problem/B4262",
    level: 3,
    knowledgePoints: ["字符串", "统计"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1175`,
    description: `在文本处理中，统计单词出现的频率是一个常见的任务。现在，给定 n 个单词，你需要找出其中出现次数最多的单词。在本题中，忽略单词中字母的大小写（即 Apple、apple、APPLE、aPPle 等均视为同一个单词）。请你编写一个程序，输入 n 个单词，输出其中出现次数最多的单词。`,
    inputFormat: `第一行，一个整数 n，表示单词的个数；接下来 n 行，每行包含一个单词，单词由大小写英文字母组成。输入保证，出现次数最多的单词只会有一个。`,
    outputFormat: `输出一行，包含出现次数最多的单词（输出单词为小写形式）。`,
    samples: [
      { input: "6\nApple\nbanana\napple\nOrange\nbanana\napple", output: "apple" },
    ],
    testCases: [
      { input: "6\nApple\nbanana\napple\nOrange\nbanana\napple", output: "apple" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `对于所有测试点，1≤n≤100，每个单词的长度不超过 30，且仅由大小写字母组成。`,
  },
  // ========== 2025年6月 ==========
  {
    title: "[GESP202506 三级] 奇偶校验",
    source: "gesp_official",
    sourceId: "B4358",
    sourceUrl: "https://www.luogu.com.cn/problem/B4358",
    level: 3,
    knowledgePoints: ["位运算", "数学"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1183`,
    description: `数据在传输过程中可能出错，因此接收方收到数据后通常会校验传输的数据是否正确，奇偶校验是经典的校验方式之一。给定 n 个非负整数 c₁, c₂, …, cₙ 代表所传输的数据，它们的校验码取决于这些整数在二进制下 1 的数量之和的奇偶性。如果这些整数在二进制下共有奇数个 1，那么校验码为 1；否则校验码为 0。`,
    inputFormat: `第一行，一个正整数 n，表示所传输的数据量。第二行，n 个非负整数 c₁, c₂, …, cₙ，表示所传输的数据。`,
    outputFormat: `输出一行，两个整数，以一个空格分隔：第一个整数表示 c₁, c₂, …, cₙ 在二进制下 1 的总数量；第二个整数表示校验码（0 或 1）。`,
    samples: [
      { input: "4\n71 69 83 80", output: "13 1" },
      { input: "6\n1 2 4 8 16 32", output: "6 0" },
    ],
    testCases: [
      { input: "4\n71 69 83 80", output: "13 1" },
      { input: "6\n1 2 4 8 16 32", output: "6 0" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `对于所有测试点，保证 1 ≤ n ≤ 100，0 ≤ cᵢ ≤ 255。`,
  },
  {
    title: "[GESP202506 三级] 分糖果",
    source: "gesp_official",
    sourceId: "B4359",
    sourceUrl: "https://www.luogu.com.cn/problem/B4359",
    level: 3,
    knowledgePoints: ["贪心", "模拟"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1183`,
    description: `有 n 位小朋友排成一队等待老师分糖果。第 i 位小朋友想要至少 a_i 颗糖果，并且分给他的糖果数量必须比分给前一位小朋友的糖果数量更多，不然他就会不开心。老师想知道至少需要准备多少颗糖果才能让所有小朋友都开心。`,
    inputFormat: `第一行：正整数 n（小朋友人数）。第二行：n 个正整数 a_1, a_2, ..., a_n（每位小朋友至少需要的糖果数量）。`,
    outputFormat: `输出一行整数，表示最少需要准备的糖果总数。`,
    samples: [
      { input: "4\n1 4 3 3", output: "16" },
      { input: "15\n314 15926 53589793 238462643 383279502 8 8 4 1 9 7 1 6 9 3", output: "4508143253" },
    ],
    testCases: [
      { input: "4\n1 4 3 3", output: "16" },
      { input: "15\n314 15926 53589793 238462643 383279502 8 8 4 1 9 7 1 6 9 3", output: "4508143253" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `对于所有测试点，保证 1 ≤ n ≤ 1000，1 ≤ a_i ≤ 10^9。`,
  },
  // ========== 2025年9月 ==========
  {
    title: "[GESP202509 三级] 数组清零",
    source: "gesp_official",
    sourceId: "B4413",
    sourceUrl: "https://www.luogu.com.cn/problem/B4413",
    level: 3,
    knowledgePoints: ["数组", "模拟"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1191`,
    description: `小 A 有一个由 n 个非负整数构成的数组。他重复进行操作直到数组只包含 0。每次操作：(1)找最大整数，下标记为 k，多个最大值选下标最大的；(2)从所有非零整数中找最小的 $a_j$；(3)将 $a_k$ 减去 $a_j$。例：[2,3,4] 需 7 次操作变成 [0,0,0]。求需要多少次操作使数组全变为 0。`,
    inputFormat: `第一行：正整数 n（数组长度）。第二行：n 个非负整数 $a_1, a_2, \\ldots, a_n$（数组元素）。`,
    outputFormat: `一行，一个正整数，表示数组中整数全部变成 0 所需的操作次数。`,
    samples: [
      { input: "3\n2 3 4", output: "7" },
      { input: "5\n1 3 2 2 5", output: "13" },
    ],
    testCases: [
      { input: "3\n2 3 4", output: "7" },
      { input: "5\n1 3 2 2 5", output: "13" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `对所有测试点，保证 $1 \\leq n \\leq 100$，$0 \\leq a_i \\leq 100$。`,
  },
  {
    title: "[GESP202509 三级] 日历制作",
    source: "gesp_official",
    sourceId: "B4414",
    sourceUrl: "https://www.luogu.com.cn/problem/B4414",
    level: 3,
    knowledgePoints: ["模拟", "日期"],
    difficulty: "普及-",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1191`,
    description: `小A想制作2025年每个月的日历。需要编写程序按格式输出给定月份的日历。第一行输出MON TUE WED THU FRI SAT SUN表示星期一到星期日。接下来若干行依次输出该月日期，日期个位需和对应星期几缩写最后字母对齐。`,
    inputFormat: `一行，一个正整数m，表示需要按照格式输出2025年m月的日历。`,
    outputFormat: `输出包含若干行，表示2025年m月的日历。`,
    samples: [
      { input: "9", output: "MON TUE WED THU FRI SAT SUN\n  1   2   3   4   5   6   7\n  8   9  10  11  12  13  14\n 15  16  17  18  19  20  21\n 22  23  24  25  26  27  28\n 29  30" },
      { input: "6", output: "MON TUE WED THU FRI SAT SUN\n                          1\n  2   3   4   5   6   7   8\n  9  10  11  12  13  14  15\n 16  17  18  19  20  21  22\n 23  24  25  26  27  28  29\n 30" },
    ],
    testCases: [
      { input: "9", output: "MON TUE WED THU FRI SAT SUN\n  1   2   3   4   5   6   7\n  8   9  10  11  12  13  14\n 15  16  17  18  19  20  21\n 22  23  24  25  26  27  28\n 29  30" },
      { input: "6", output: "MON TUE WED THU FRI SAT SUN\n                          1\n  2   3   4   5   6   7   8\n  9  10  11  12  13  14  15\n 16  17  18  19  20  21  22\n 23  24  25  26  27  28  29\n 30" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `对于所有测试点，保证1≤m≤12。`,
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
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1199`,
    description: `设计一个密码强度检测器。安全密码需满足：至少8个字符，至少包含一个大写字母(A-Z)，至少包含一个数字(0-9)。`,
    inputFormat: `第一行正整数T(测试用例数)。接下来T行，每行一个待检测的密码字符串。`,
    outputFormat: `对每组密码输出一行。满足强度要求输出Y，否则输出N。`,
    samples: [
      { input: "6\nPAs1s2an\n1a2bCq13\nPa12bsna\nab1da3cd\nPaabdbcd\nPa2", output: "Y\nY\nY\nN\nN\nN" },
    ],
    testCases: [
      { input: "6\nPAs1s2an\n1a2bCq13\nPa12bsna\nab1da3cd\nPaabdbcd\nPa2", output: "Y\nY\nY\nN\nN\nN" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `密码PAs1s2an安全(8位含大写字母P、A和数字1、2)；1a2bCq13安全(8位含大写C和数字1、2、3)；Pa12bsna安全(8位含大写P和数字1、2)；ab1da5cd不安全(无大写字母)；Paabdbcd不安全(无数字)；Pa2不安全(仅3位)。数据范围：1≤T≤100，密码长度1-100，仅含大小写字母和数字。`,
  },
  {
    title: "[GESP202512 三级] 小杨的智慧购物",
    source: "gesp_official",
    sourceId: "B4450",
    sourceUrl: "https://www.luogu.com.cn/problem/B4450",
    level: 3,
    knowledgePoints: ["数组", "模拟"],
    difficulty: "入门",
    background: `对应的选择、判断题：https://ti.luogu.com.cn/problemset/1199`,
    description: `小杨需要购买M种文具。商店有N件文具，每件有种类编号和价格。对于每种文具，小杨只购买最便宜的一件。求购齐所有M种文具的总花费。`,
    inputFormat: `第一行两个正整数M, N，代表文具种类数和总数。之后N行，每行两个正整数K_i和P_i，分别代表第i件文具的种类编号和价格。`,
    outputFormat: `输出一行，代表购买文具的总价。`,
    samples: [
      { input: "2 5\n1 1\n1 2\n1 1\n2 3\n2 10", output: "4" },
    ],
    testCases: [
      { input: "2 5\n1 1\n1 2\n1 1\n2 3\n2 10", output: "4" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `种类1有三件商品，价格为1、2、1，最便宜为1。种类2有两件商品，价格为3、10，最便宜为3。总花费为1+3=4。`,
  },
];

export async function GET() {
  try {
    let created = 0;
    let updated = 0;

    for (const problem of gesp3Problems) {
      const existing = await prisma.problem.findFirst({
        where: { sourceId: problem.sourceId },
      });

      if (existing) {
        await prisma.problem.update({
          where: { id: existing.id },
          data: problem,
        });
        updated++;
      } else {
        await prisma.problem.create({
          data: problem,
        });
        created++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `GESP 3级题库同步完成`,
      total: gesp3Problems.length,
      created,
      updated,
    });
  } catch (error) {
    console.error("Seed GESP3 error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
