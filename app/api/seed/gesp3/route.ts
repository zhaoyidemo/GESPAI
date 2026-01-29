import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GESP 3级完整题库 - 来源：洛谷 CCF GESP C++ 三级上机题
// 共24道题目
// 难度标签采用洛谷评级：
// - "easy" = 入门(1)/普及-(2)
// - "medium" = 普及/提高-(3)/普及+/提高(4)
// - "hard" = 提高+/省选-(5)及以上

const gesp3Problems = [
  // ========== 样题 ==========
  {
    title: "[GESP样题 三级] 逛商场",
    source: "gesp_official",
    sourceId: "B3848",
    sourceUrl: "https://www.luogu.com.cn/problem/B3848",
    level: 3,
    knowledgePoints: ["数组", "循环", "条件判断", "模拟"],
    difficulty: "普及-", // 洛谷难度1
    description: `小明拥有一定数额的零花钱，他在商场里按顺序依次看到了 N 种物品。他的购物原则是：如果看到的物品是他想买的，并且他现有的零花钱足够买这件物品，他就会立即购买；否则他就跳过这件物品继续向前逛。

请你帮小明计算一下，他一天下来一共买了多少件物品。`,
    inputFormat: `第一行包含一个整数 N，表示物品的种类数。

第二行包含 N 个整数，表示每种物品的价格。

第三行包含一个整数 X，表示小明初始拥有的零花钱。

数据范围：
- 1 ≤ N ≤ 100
- 0 ≤ 物品价格 ≤ 100000`,
    outputFormat: `输出一行，包含一个整数，表示小明买到的物品数。`,
    samples: [
      { input: "6\n7 5 9 10 7 4\n30", output: "4", explanation: "小明依次购买了价格为7、5、9、4的物品，共4件，花费25元" },
    ],
    testCases: [
      { input: "6\n7 5 9 10 7 4\n30", output: "4" },
      { input: "3\n10 20 30\n50", output: "2" },
      { input: "5\n1 2 3 4 5\n15", output: "5" },
      { input: "4\n100 100 100 100\n10", output: "0" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: "遍历每件物品，若当前余额大于等于价格则购买（余额减少、计数加1），否则跳过。",
  },
  {
    title: "[GESP样题 三级] 进制转换",
    source: "gesp_official",
    sourceId: "B3849",
    sourceUrl: "https://www.luogu.com.cn/problem/B3849",
    level: 3,
    knowledgePoints: ["进制转换", "数学", "字符串", "函数"],
    difficulty: "普及-", // 洛谷难度2
    description: `我们日常生活中最常使用的是十进制整数，而在计算机科学与技术中，经常用到二进制、八进制、十六进制等。

在十六进制中，使用字母 A-F 分别表示数字 10-15。以此类推，我们可以用更多的字母来表示更大的数字，从而支持更高进制的表示。具体地，使用 A-Z 分别表示数字 10-35，这样我们最多可以支持 36 进制的表示。

现在请你编写一个程序，将一个十进制正整数 N 转换为 R 进制表示。`,
    inputFormat: `第一行包含一个正整数 N，表示要转换的十进制数。

第二行包含一个正整数 R，表示目标进制。

数据范围：
- 1 ≤ N ≤ 10^6
- 2 ≤ R ≤ 36`,
    outputFormat: `输出一行，表示 N 的 R 进制表示。`,
    samples: [
      { input: "123\n25", output: "4N", explanation: "123 = 4×25 + 23，23对应字母N" },
    ],
    testCases: [
      { input: "123\n25", output: "4N" },
      { input: "255\n16", output: "FF" },
      { input: "100\n2", output: "1100100" },
      { input: "35\n36", output: "Z" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: "使用除R取余法，注意余数大于等于10时要用字母表示。",
  },
  // ========== 2023年6月 ==========
  {
    title: "[GESP202306 三级] 春游",
    source: "gesp_official",
    sourceId: "B3842",
    sourceUrl: "https://www.luogu.com.cn/problem/B3842",
    level: 3,
    knowledgePoints: ["数组", "标记数组", "循环", "模拟"],
    difficulty: "普及-", // 洛谷难度2
    description: `老师带领同学们春游。班上有 N 位同学，编号从 0 到 N-1。到了集合时间，同学们开始报自己的编号。

到达的同学会报出自己的编号，有的同学可能会多次报出自己的编号。

请你帮老师找出哪些同学没有到达集合地点。`,
    inputFormat: `第一行包含两个整数 N 和 M，分别表示班级同学数和报出编号的总次数。

第二行包含 M 个整数，表示报出的编号。

数据范围：
- 2 ≤ N, M ≤ 1000
- 所有编号都是小于 N 的非负整数`,
    outputFormat: `若全部同学都到达，输出 N；否则，由小到大输出所有未到达同学的编号，用空格分隔。`,
    samples: [
      { input: "3 3\n0 2 1", output: "3", explanation: "所有同学都到了" },
      { input: "3 5\n0 0 0 0 0", output: "1 2", explanation: "编号1和2的同学没到" },
    ],
    testCases: [
      { input: "3 3\n0 2 1", output: "3" },
      { input: "3 5\n0 0 0 0 0", output: "1 2" },
      { input: "5 3\n0 2 4", output: "1 3" },
      { input: "4 10\n0 1 2 3 0 1 2 3 2 1", output: "4" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: "使用标记数组记录每个编号是否出现过。",
  },
  {
    title: "[GESP202306 三级] 密码合规",
    source: "gesp_official",
    sourceId: "B3843",
    sourceUrl: "https://www.luogu.com.cn/problem/B3843",
    level: 3,
    knowledgePoints: ["字符串", "条件判断", "字符分类", "函数"],
    difficulty: "普及-", // 洛谷难度2
    description: `编写程序检查密码的有效性。合规的密码需要满足以下所有条件：
1. 仅由小写字母(a-z)、大写字母(A-Z)、数字(0-9)和特殊字符(!@#$)组成
2. 长度为6-12个字符
3. 大写字母、小写字母、数字中至少有两种，且至少包含一个特殊字符`,
    inputFormat: `输入一行，包含一个不含空格的字符串，多个待检测的密码用逗号分隔。

字符串总长度不超过100。`,
    outputFormat: `逐行输出所有合规的密码，按输入顺序。`,
    samples: [
      { input: "seHJ12!@,sjdkffH$123,sdf!@&12HDHa!,123&^YUhg@!", output: "seHJ12!@\nsjdkffH$123", explanation: "第三个密码长度超过12，第四个包含非法字符&^" },
    ],
    testCases: [
      { input: "seHJ12!@,sjdkffH$123,sdf!@&12HDHa!,123&^YUhg@!", output: "seHJ12!@\nsjdkffH$123" },
      { input: "Abc123!,abc!@#,ABC123$", output: "Abc123!" },
      { input: "aA1!aA1!", output: "aA1!aA1!" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "分别检查每个条件：字符合法性、长度、字符类型多样性。",
  },
  // ========== 2023年9月 ==========
  {
    title: "[GESP202309 三级] 小杨的储蓄",
    source: "gesp_official",
    sourceId: "B3867",
    sourceUrl: "https://www.luogu.com.cn/problem/B3867",
    level: 3,
    knowledgePoints: ["数组", "累加", "循环", "模拟"],
    difficulty: "普及-", // 洛谷难度1
    description: `小杨有 N 个储蓄罐，编号从 0 到 N-1。

小杨计划进行 D 天的储蓄。第 i 天，小杨会存入 i 元钱到指定的储蓄罐 a_i 中。

D 天后，请帮小杨计算每个储蓄罐中分别有多少钱。`,
    inputFormat: `第一行包含两个整数 N 和 D，分别表示储蓄罐数量和储蓄天数。

第二行包含 D 个整数 a_1, a_2, ..., a_D，表示第 i 天选择的储蓄罐编号。

数据范围：
- 1 ≤ N ≤ 1000
- 1 ≤ D ≤ 1000
- 0 ≤ a_i ≤ N-1`,
    outputFormat: `输出 N 个整数，表示编号 0 到 N-1 的各储蓄罐中的金额，用空格分隔。`,
    samples: [
      { input: "2 3\n0 1 0", output: "4 2", explanation: "第1天存1元到罐0，第2天存2元到罐1，第3天存3元到罐0" },
      { input: "3 5\n0 0 0 2 0", output: "11 0 4", explanation: "罐0：1+2+3+5=11，罐1：0，罐2：4" },
    ],
    testCases: [
      { input: "2 3\n0 1 0", output: "4 2" },
      { input: "3 5\n0 0 0 2 0", output: "11 0 4" },
      { input: "1 5\n0 0 0 0 0", output: "15" },
      { input: "5 5\n0 1 2 3 4", output: "1 2 3 4 5" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: "使用数组记录每个储蓄罐的金额，遍历每一天累加即可。",
  },
  {
    title: "[GESP202309 三级] 进制判断",
    source: "gesp_official",
    sourceId: "B3868",
    sourceUrl: "https://www.luogu.com.cn/problem/B3868",
    level: 3,
    knowledgePoints: ["进制", "字符串", "条件判断", "函数"],
    difficulty: "普及-", // 洛谷难度1
    description: `给定 N 个字符串，判断每个字符串是否可以表示一个有效的二进制、八进制、十进制或十六进制数。

例如，"15A6F" 只能作为十六进制数，而 "1011" 可以作为任意一种进制的数。

注意：字符串可能以 0 开头。`,
    inputFormat: `第一行包含一个整数 N，表示字符串数量。

接下来 N 行，每行包含一个由数字和大写字母组成的字符串。

数据范围：
- 1 ≤ N ≤ 1000
- 字符串长度 ≤ 10`,
    outputFormat: `输出 N 行，每行包含 4 个用空格分隔的数字（1 表示可以，0 表示不可以），分别表示该字符串是否可以作为二进制、八进制、十进制、十六进制数。`,
    samples: [
      { input: "2\n15A6F\n1011", output: "0 0 0 1\n1 1 1 1", explanation: "15A6F只能是十六进制，1011都可以" },
      { input: "4\n1234567\n12345678\nFF\nGG", output: "0 1 1 1\n0 0 1 1\n0 0 0 1\n0 0 0 0", explanation: "GG超出了十六进制范围" },
    ],
    testCases: [
      { input: "2\n15A6F\n1011", output: "0 0 0 1\n1 1 1 1" },
      { input: "4\n1234567\n12345678\nFF\nGG", output: "0 1 1 1\n0 0 1 1\n0 0 0 1\n0 0 0 0" },
      { input: "3\n0\n1\n01", output: "1 1 1 1\n1 1 1 1\n1 1 1 1" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: "二进制只能包含0-1，八进制只能包含0-7，十进制只能包含0-9，十六进制可以包含0-9和A-F。",
  },
  // ========== 2023年12月 ==========
  {
    title: "[GESP202312 三级] 小猫分鱼",
    source: "gesp_official",
    sourceId: "B3925",
    sourceUrl: "https://www.luogu.com.cn/problem/B3925",
    level: 3,
    knowledgePoints: ["数学", "模拟", "递推", "枚举"],
    difficulty: "普及-", // 洛谷难度2
    description: `海滩上有一堆鱼，N 只小猫依次来分鱼。

每只小猫来到后，会将剩余的鱼平均分成 N 份，如果多出 i 条鱼（i 是这只小猫的编号，从 1 开始），就将多出的鱼扔入海中，然后自己拿走其中的一份离开。

请问：使得每只小猫都能分到至少 1 条鱼的情况下，初始最少需要多少条鱼？`,
    inputFormat: `第一行包含一个整数 N，表示小猫数量。

第二行包含一个整数 i，表示每次扔掉的鱼数（与小猫编号相关的固定值）。

数据范围：
- 0 < N < 10
- i < N`,
    outputFormat: `输出一个整数，表示满足要求的最少鱼数。`,
    samples: [
      { input: "2\n1", output: "7", explanation: "7条鱼：第1只猫扔1条分成2份各3条，拿走3条剩3条；第2只猫扔1条分成2份各1条，拿走1条" },
      { input: "3\n1", output: "25", explanation: "需要25条鱼才能让3只猫都分到至少1条" },
    ],
    testCases: [
      { input: "2\n1", output: "7" },
      { input: "3\n1", output: "25" },
      { input: "3\n2", output: "26" },
      { input: "4\n1", output: "125" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "从最后一只猫反推，或者从小到大枚举初始鱼数进行模拟验证。",
  },
  {
    title: "[GESP202312 三级] 单位转换",
    source: "gesp_official",
    sourceId: "B3926",
    sourceUrl: "https://www.luogu.com.cn/problem/B3926",
    level: 3,
    knowledgePoints: ["字符串", "条件判断", "数学", "模拟"],
    difficulty: "普及-", // 洛谷难度1
    description: `小杨需要编程完成单位转换作业。支持以下单位转换：
- 长度单位：1 km = 1000 m = 1000000 mm
- 重量单位：1 kg = 1000 g = 1000000 mg

本题仅涉及大单位转小单位的六种转换类型。`,
    inputFormat: `第一行包含一个整数 N，表示题目数量。

接下来 N 行，每行格式为 "x 单位1 = ? 单位2"，其中 x 为不超过 1000 的非负整数。

数据范围：
- 1 ≤ N ≤ 1000`,
    outputFormat: `输出 N 行答案，将 "?" 替换为计算结果，其余部分保持不变。`,
    samples: [
      { input: "2\n1 km = ? mm\n1 m = ? mm", output: "1 km = 1000000 mm\n1 m = 1000 mm" },
      { input: "5\n100 m = ? mm\n1000 km = ? m\n20 kg = ? g\n200 g = ? mg\n0 kg = ? mg", output: "100 m = 100000 mm\n1000 km = 1000000 m\n20 kg = 20000 g\n200 g = 200000 mg\n0 kg = 0 mg" },
    ],
    testCases: [
      { input: "2\n1 km = ? mm\n1 m = ? mm", output: "1 km = 1000000 mm\n1 m = 1000 mm" },
      { input: "5\n100 m = ? mm\n1000 km = ? m\n20 kg = ? g\n200 g = ? mg\n0 kg = ? mg", output: "100 m = 100000 mm\n1000 km = 1000000 m\n20 kg = 20000 g\n200 g = 200000 mg\n0 kg = 0 mg" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "根据单位类型确定转换倍率，然后进行计算和字符串格式化输出。",
  },
  // ========== 2024年3月 ==========
  {
    title: "[GESP202403 三级] 字母求和",
    source: "gesp_official",
    sourceId: "B3956",
    sourceUrl: "https://www.luogu.com.cn/problem/B3956",
    level: 3,
    knowledgePoints: ["字符串", "ASCII码", "循环", "条件判断"],
    difficulty: "普及-", // 洛谷难度1
    description: `一个密码系统将字母转换为数字：
- 小写字母代表其在字母表中的位置（a=1, b=2, ..., z=26）
- 大写字母代表其 ASCII 码的负值（A=-65, B=-66, ..., Z=-90）

给定一个由大小写英文字母组成的字符串，计算所有字母代表的数字之和。`,
    inputFormat: `第一行包含一个正整数 n，表示字符串长度。

第二行包含一个由大小写英文字母组成的字符串 T。

数据范围：
- 1 ≤ n ≤ 10^5`,
    outputFormat: `输出一个整数，表示所有字母代表的数字之和。`,
    samples: [
      { input: "3\naAc", output: "-61", explanation: "a=1, A=-65, c=3，总和为 1+(-65)+3=-61" },
    ],
    testCases: [
      { input: "3\naAc", output: "-61" },
      { input: "1\na", output: "1" },
      { input: "1\nZ", output: "-90" },
      { input: "5\nabcde", output: "15" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "遍历字符串，判断每个字符是大写还是小写，然后按规则计算并累加。",
  },
  {
    title: "[GESP202403 三级] 完全平方数",
    source: "gesp_official",
    sourceId: "B3957",
    sourceUrl: "https://www.luogu.com.cn/problem/B3957",
    level: 3,
    knowledgePoints: ["数学", "完全平方数", "枚举", "双重循环"],
    difficulty: "普及-", // 洛谷难度1
    description: `给定一个包含 n 个非负整数的序列，找出有多少对下标组合 <i, j>（1 ≤ i < j ≤ n），使得两个元素之和为完全平方数。

完全平方数是指存在非负整数 y 使得 y² = x 的数。例如 0, 1, 4, 9, 16 等都是完全平方数。`,
    inputFormat: `第一行包含一个整数 n，表示序列长度。

第二行包含 n 个非负整数 A_1, A_2, ..., A_n。

数据范围：
- 1 ≤ n ≤ 1000
- 0 ≤ A_i ≤ 10^5`,
    outputFormat: `输出一个整数，表示满足条件的数对个数。`,
    samples: [
      { input: "5\n1 4 3 3 5", output: "3", explanation: "满足条件的数对：(1,3)和为4，(4,5)和为9，(3,1)不算因为要求i<j" },
    ],
    testCases: [
      { input: "5\n1 4 3 3 5", output: "3" },
      { input: "3\n0 0 0", output: "3" },
      { input: "4\n1 3 6 10", output: "2" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "双重循环枚举所有数对，判断和是否为完全平方数。可以用sqrt函数判断。",
  },
  // ========== 2024年6月 ==========
  {
    title: "[GESP202406 三级] 移位",
    source: "gesp_official",
    sourceId: "B4003",
    sourceUrl: "https://www.luogu.com.cn/problem/B4003",
    level: 3,
    knowledgePoints: ["字符串", "取模运算", "循环", "凯撒密码"],
    difficulty: "普及-", // 洛谷难度1
    description: `实现一个移位加密算法。所有大写字母按固定数目向后偏移，字母表视作首尾相接的环。

例如，偏移量为 3 时，字母表 ABCDEFGHIJKLMNOPQRSTUVWXYZ 会变成 DEFGHIJKLMNOPQRSTUVWXYZABC。

当偏移量是 26 的倍数时，字母表保持不变。`,
    inputFormat: `第一行包含一个正整数 n，表示偏移量。

数据范围：
- 1 ≤ n ≤ 100`,
    outputFormat: `输出在偏移量为 n 的情况下，大写字母表移位替换后的结果。`,
    samples: [
      { input: "3", output: "DEFGHIJKLMNOPQRSTUVWXYZABC", explanation: "每个字母向后移动3位" },
    ],
    testCases: [
      { input: "3", output: "DEFGHIJKLMNOPQRSTUVWXYZABC" },
      { input: "26", output: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
      { input: "1", output: "BCDEFGHIJKLMNOPQRSTUVWXYZA" },
      { input: "25", output: "ZABCDEFGHIJKLMNOPQRSTUVWXY" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "使用取模运算处理循环移位：新字母 = (原字母 - 'A' + n) % 26 + 'A'",
  },
  {
    title: "[GESP202406 三级] 寻找倍数",
    source: "gesp_official",
    sourceId: "B4004",
    sourceUrl: "https://www.luogu.com.cn/problem/B4004",
    level: 3,
    knowledgePoints: ["数学", "整除", "枚举", "条件判断"],
    difficulty: "普及-", // 洛谷难度2
    description: `判断是否存在序列中的某个元素，它是该序列所有其他元素的倍数。

换句话说，找是否存在一个数 x，使得序列中的每个数都能整除 x。`,
    inputFormat: `第一行包含一个整数 t，表示测试用例组数。

每组测试用例包含两行：
- 第一行包含一个正整数 n，表示序列长度
- 第二行包含 n 个正整数，表示序列 A

数据范围：
- 1 ≤ t ≤ 10
- 1 ≤ n ≤ 10^5
- 1 ≤ a_i ≤ 10^9`,
    outputFormat: `每组测试用例输出一行：如果存在满足条件的元素，输出 \"Yes\"；否则输出 \"No\"。`,
    samples: [
      { input: "2\n3\n1 2 4\n5\n1 2 3 4 5", output: "Yes\nNo", explanation: "第一组中4是1和2的倍数；第二组不存在这样的数" },
    ],
    testCases: [
      { input: "2\n3\n1 2 4\n5\n1 2 3 4 5", output: "Yes\nNo" },
      { input: "1\n3\n6 2 3", output: "Yes" },
      { input: "1\n4\n12 4 6 3", output: "Yes" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "如果存在这样的数，它一定是序列中的最大值。只需检查最大值是否能被所有其他数整除。",
  },
  // ========== 2024年9月 ==========
  {
    title: "[GESP202409 三级] 平衡序列",
    source: "gesp_official",
    sourceId: "B4038",
    sourceUrl: "https://www.luogu.com.cn/problem/B4038",
    level: 3,
    knowledgePoints: ["数组", "前缀和", "循环", "枚举"],
    difficulty: "普及-", // 洛谷难度2
    description: `给定包含 n 个正整数的序列 a，判断是否存在位置 i（1 ≤ i < n），使得第 1 到第 i 个数之和等于第 i+1 到第 n 个数之和。

如果存在这样的位置，称这个序列为"平衡序列"。`,
    inputFormat: `第一行包含一个整数 t，表示测试用例组数。

每组测试用例包含两行：
- 第一行包含一个整数 n，表示序列长度
- 第二行包含 n 个正整数 a_i

数据范围：
- 1 ≤ t ≤ 100
- 1 ≤ n ≤ 10000
- 1 ≤ a_i ≤ 10000`,
    outputFormat: `每组测试用例输出一行，输出 \"Yes\" 或 \"No\"。`,
    samples: [
      { input: "3\n3\n1 2 3\n4\n2 3 1 4\n5\n1 2 3 4 5", output: "Yes\nYes\nNo", explanation: "第一组：1+2=3；第二组：2+3=1+4" },
    ],
    testCases: [
      { input: "3\n3\n1 2 3\n4\n2 3 1 4\n5\n1 2 3 4 5", output: "Yes\nYes\nNo" },
      { input: "2\n2\n5 5\n4\n1 1 1 1", output: "Yes\nYes" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "先计算总和，然后枚举分割点i，检查左半部分是否等于总和的一半。",
  },
  {
    title: "[GESP202409 三级] 回文拼接",
    source: "gesp_official",
    sourceId: "B4039",
    sourceUrl: "https://www.luogu.com.cn/problem/B4039",
    level: 3,
    knowledgePoints: ["字符串", "回文", "枚举", "函数"],
    difficulty: "普及-", // 洛谷难度2
    description: `判断每个字符串是否由两个长度至少为 2 的回文串前后拼接而成。

回文串定义为从前往后读和从后往前读相同的字符串。例如 "aa"、"aba"、"abba" 都是回文串。`,
    inputFormat: `第一行包含一个正整数 n，表示字符串数量。

接下来 n 行，每行包含一个仅由小写字母组成的字符串。

数据范围：
- 1 ≤ n ≤ 10
- 每个字符串长度 ≤ 100`,
    outputFormat: `对每个字符串输出一行：如果由两个长度至少为 2 的回文串拼接而成，输出 \"Yes\"；否则输出 \"No\"。`,
    samples: [
      { input: "4\nabcd\naabbb\naaac\nabcdd", output: "No\nYes\nNo\nNo", explanation: "aabbb可以分成aa和bbb两个回文串" },
    ],
    testCases: [
      { input: "4\nabcd\naabbb\naaac\nabcdd", output: "No\nYes\nNo\nNo" },
      { input: "3\naaaa\nabba\nxyyx", output: "Yes\nNo\nNo" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "枚举所有可能的分割点，判断左右两部分是否都是回文且长度都至少为2。",
  },
  // ========== 2024年12月 ==========
  {
    title: "[GESP202412 三级] 数字替换",
    source: "gesp_official",
    sourceId: "B4066",
    sourceUrl: "https://www.luogu.com.cn/problem/B4066",
    level: 3,
    knowledgePoints: ["数组", "最大值最小值", "条件判断", "循环"],
    difficulty: "普及-", // 洛谷难度1
    description: `给定一个包含 n 个数字的序列 A，需要将大于 k 的数字替换为序列的最大值，小于 k 的数字替换为序列的最小值，等于 k 的数字保持不变。`,
    inputFormat: `第一行包含两个整数 n 和 k。

第二行包含 n 个整数，表示序列 A。

数据范围：
- 1 ≤ n ≤ 10^5
- |k|, |a_i| ≤ 10^5`,
    outputFormat: `输出 n 个整数，表示替换后的结果，用空格分隔。`,
    samples: [
      { input: "5 0\n-2 -1 0 1 2", output: "-2 -2 0 2 2", explanation: "最小值-2，最大值2。-2和-1小于0替换为-2，1和2大于0替换为2" },
    ],
    testCases: [
      { input: "5 0\n-2 -1 0 1 2", output: "-2 -2 0 2 2" },
      { input: "3 5\n1 5 10", output: "1 5 10" },
      { input: "4 0\n1 2 3 4", output: "4 4 4 4" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "先遍历一次找出最大值和最小值，再遍历一次进行替换。",
  },
  {
    title: "[GESP202412 三级] 打印数字",
    source: "gesp_official",
    sourceId: "B4067",
    sourceUrl: "https://www.luogu.com.cn/problem/B4067",
    level: 3,
    knowledgePoints: ["字符串", "二维数组", "模拟", "数字图形"],
    difficulty: "普及-", // 洛谷难度2
    description: `小杨为数字 0、1、2、3 设计了 5×5 网格的表示形式，使用 '*' 和 '.' 组成特定图案。

需要将给定的数字 n 转换为对应的图形表示形式。多个数字并排显示，数字之间用一列 '.' 分隔。`,
    inputFormat: `第一行包含一个非负整数 n。

数据范围：
- 0 ≤ n ≤ 10^6
- n 仅由数字 0, 1, 2, 3 组成`,
    outputFormat: `输出对应的图形表示形式，共 5 行。`,
    samples: [
      { input: "12230", output: ".*..***.***.***\n**..*.....*.*..\n.*..***.***.***\n.*..*.....*.*..\n.*..***.***.***" },
    ],
    testCases: [
      { input: "0", output: "***\n*.*\n*.*\n*.*\n***" },
      { input: "1", output: ".*\n**\n.*\n.*\n.*" },
      { input: "23", output: "***.***\n...*...\n***.*.*\n*...*.*\n***.***" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "预先定义0-3每个数字的5×n点阵图案，按位提取数字并拼接输出。",
  },
  // ========== 2025年3月 ==========
  {
    title: "[GESP202503 三级] 2025",
    source: "gesp_official",
    sourceId: "B4261",
    sourceUrl: "https://www.luogu.com.cn/problem/B4261",
    level: 3,
    knowledgePoints: ["位运算", "按位与", "按位或", "数学"],
    difficulty: "普及-", // 洛谷难度1
    description: `小A有一个整数 x，需要找到最小的正整数 y，使得 (x & y) + (x | y) = 2025 成立。

其中 & 表示按位与运算，| 表示按位或运算。

如果不存在这样的 y，输出 -1。`,
    inputFormat: `输入一行，包含一个整数 x。

数据范围：
- 0 ≤ x < 2025`,
    outputFormat: `输出一行整数，如果存在满足条件的 y 则输出 y，否则输出 -1。`,
    samples: [
      { input: "1025", output: "1000", explanation: "(1025 & 1000) + (1025 | 1000) = 1000 + 1025 = 2025" },
    ],
    testCases: [
      { input: "1025", output: "1000" },
      { input: "0", output: "2025" },
      { input: "2025", output: "-1" },
      { input: "1", output: "2024" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "数学性质：(x & y) + (x | y) = x + y。所以只需要找最小的正整数 y 使得 x + y = 2025。",
  },
  {
    title: "[GESP202503 三级] 词频统计",
    source: "gesp_official",
    sourceId: "B4262",
    sourceUrl: "https://www.luogu.com.cn/problem/B4262",
    level: 3,
    knowledgePoints: ["字符串", "哈希表", "统计", "大小写转换"],
    difficulty: "普及-", // 洛谷难度2
    description: `统计 n 个单词中出现频率最高的单词。

注意：忽略单词中字母的大小写，即不同大小写形式的同一单词应视为相同。

输出时以小写形式输出。`,
    inputFormat: `第一行包含一个整数 n，表示单词个数。

接下来 n 行，每行包含一个单词，仅由英文大小写字母组成。

数据范围：
- 1 ≤ n ≤ 100
- 每个单词长度不超过 30 字符
- 出现次数最多的单词唯一`,
    outputFormat: `输出出现次数最多的单词（以小写形式输出）。`,
    samples: [
      { input: "6\nApple\nbanana\napple\nOrange\nbanana\napple", output: "apple", explanation: "apple出现3次（包括Apple和apple），banana出现2次" },
    ],
    testCases: [
      { input: "6\nApple\nbanana\napple\nOrange\nbanana\napple", output: "apple" },
      { input: "3\nABC\nabc\nABC", output: "abc" },
      { input: "1\nHello", output: "hello" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "将所有单词转为小写后统计频率，可以使用map或数组。",
  },
  // ========== 2025年6月 ==========
  {
    title: "[GESP202506 三级] 奇偶校验",
    source: "gesp_official",
    sourceId: "B4358",
    sourceUrl: "https://www.luogu.com.cn/problem/B4358",
    level: 3,
    knowledgePoints: ["位运算", "二进制", "统计", "循环"],
    difficulty: "普及-", // 洛谷难度2
    description: `计算多个非负整数在二进制表示下所有 1 的总数量，以及根据这个总数量的奇偶性输出校验码。

数据在传输过程中可能出错，因此接收方收到数据后通常会校验传输的数据是否正确。奇偶校验是一种常见的方法。`,
    inputFormat: `第一行包含一个正整数 n，表示数据量。

第二行包含 n 个非负整数 c_1, c_2, ..., c_n，表示传输的数据。

数据范围：
- 1 ≤ n ≤ 100
- 0 ≤ c_i ≤ 255`,
    outputFormat: `输出一行两个整数，用空格分隔：
1. 二进制下 1 的总数量
2. 校验码（1 表示奇数个 1，0 表示偶数个 1）`,
    samples: [
      { input: "4\n71 69 83 80", output: "13 1", explanation: "71=1000111(4个1)，69=1000101(3个1)，83=1010011(4个1)，80=1010000(2个1)，共13个1，奇数" },
      { input: "6\n1 2 4 8 16 32", output: "6 0", explanation: "每个数都只有1个1，共6个，偶数" },
    ],
    testCases: [
      { input: "4\n71 69 83 80", output: "13 1" },
      { input: "6\n1 2 4 8 16 32", output: "6 0" },
      { input: "1\n0", output: "0 0" },
      { input: "1\n255", output: "8 0" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "统计每个数的二进制中1的个数，可以用位运算 n & 1 判断最低位，然后右移。",
  },
  {
    title: "[GESP202506 三级] 分糖果",
    source: "gesp_official",
    sourceId: "B4359",
    sourceUrl: "https://www.luogu.com.cn/problem/B4359",
    level: 3,
    knowledgePoints: ["贪心", "数组", "循环", "递推"],
    difficulty: "普及-", // 洛谷难度2
    description: `n 位小朋友排队等待分糖果。第 i 位小朋友至少需要 a_i 颗糖果，且每位小朋友获得的糖果数必须严格多于前一位，否则他就会不开心。

求满足所有条件的最少糖果总数。`,
    inputFormat: `第一行包含一个正整数 n，表示小朋友人数。

第二行包含 n 个正整数 a_1, a_2, ..., a_n，表示各小朋友的最少需求。

数据范围：
- 1 ≤ n ≤ 1000
- 1 ≤ a_i ≤ 10^9`,
    outputFormat: `输出一个整数，表示最少需要准备的糖果数量。`,
    samples: [
      { input: "4\n1 4 3 3", output: "16", explanation: "分配1,4,5,6颗糖果，总共16颗" },
    ],
    testCases: [
      { input: "4\n1 4 3 3", output: "16" },
      { input: "3\n1 2 3", output: "6" },
      { input: "3\n5 5 5", output: "18" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "贪心：每个小朋友的糖果数 = max(a_i, 前一个小朋友的糖果数 + 1)。注意使用long long避免溢出。",
  },
  // ========== 2025年9月 ==========
  {
    title: "[GESP202509 三级] 数组清零",
    source: "gesp_official",
    sourceId: "B4413",
    sourceUrl: "https://www.luogu.com.cn/problem/B4413",
    level: 3,
    knowledgePoints: ["数组", "模拟", "循环", "最值"],
    difficulty: "普及-", // 洛谷难度1
    description: `对数组执行重复操作直至所有元素变为 0。

每次操作：找到最大值所在位置（如果有多个，取下标最大的），记为位置 k；找到最小的非零值 a_j，将 a_k 减去 a_j。

计算需要多少次操作才能使数组全部变为 0。`,
    inputFormat: `第一行包含一个正整数 n，表示数组长度。

第二行包含 n 个非负整数 a_1, a_2, ..., a_n。

数据范围：
- 1 ≤ n ≤ 100
- 0 ≤ a_i ≤ 100`,
    outputFormat: `输出一个正整数，表示达成全 0 所需的操作次数。`,
    samples: [
      { input: "3\n2 3 4", output: "7" },
      { input: "5\n1 3 2 2 5", output: "13" },
    ],
    testCases: [
      { input: "3\n2 3 4", output: "7" },
      { input: "5\n1 3 2 2 5", output: "13" },
      { input: "1\n5", output: "5" },
      { input: "3\n0 0 0", output: "0" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "模拟整个过程，每次找最大值位置和最小非零值，执行减法操作。",
  },
  {
    title: "[GESP202509 三级] 日历制作",
    source: "gesp_official",
    sourceId: "B4414",
    sourceUrl: "https://www.luogu.com.cn/problem/B4414",
    level: 3,
    knowledgePoints: ["日期计算", "格式输出", "循环", "条件判断"],
    difficulty: "普及-", // 洛谷难度2
    description: `编写程序输出 2025 年指定月份的日历。

第一行输出 "MON TUE WED THU FRI SAT SUN" 表示周一至周日，随后各行显示该月的日期。

日期的个位需要和对应星期几的缩写最后一个字母对齐。`,
    inputFormat: `输入一行，包含一个正整数 m，表示月份。

数据范围：
- 1 ≤ m ≤ 12`,
    outputFormat: `若干行表示 2025 年 m 月的日历。`,
    samples: [
      { input: "9", output: "MON TUE WED THU FRI SAT SUN\n  1   2   3   4   5   6   7\n  8   9  10  11  12  13  14\n 15  16  17  18  19  20  21\n 22  23  24  25  26  27  28\n 29  30", explanation: "2025年9月1日是周一" },
    ],
    testCases: [
      { input: "1", output: "MON TUE WED THU FRI SAT SUN\n          1   2   3   4   5\n  6   7   8   9  10  11  12\n 13  14  15  16  17  18  19\n 20  21  22  23  24  25  26\n 27  28  29  30  31" },
      { input: "2", output: "MON TUE WED THU FRI SAT SUN\n                          1\n  2   3   4   5   6   7   8\n  9  10  11  12  13  14  15\n 16  17  18  19  20  21  22\n 23  24  25  26  27  28" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "需要知道2025年各月的天数和第一天是星期几。2025年1月1日是星期三。",
  },
  // ========== 2025年12月 ==========
  {
    title: "[GESP202512 三级] 密码强度",
    source: "gesp_official",
    sourceId: "B4449",
    sourceUrl: "https://www.luogu.com.cn/problem/B4449",
    level: 3,
    knowledgePoints: ["字符串", "条件判断", "字符分类", "函数"],
    difficulty: "普及-", // 洛谷难度1
    description: `设计一个密码强度检测器。安全的密码需满足以下三个条件：
1. 密码至少包含 8 个字符
2. 密码至少包含一个大写字母
3. 密码至少包含一个数字`,
    inputFormat: `第一行包含一个正整数 T，表示测试组数。

接下来 T 行，每行包含一个待检测的密码字符串。

数据范围：
- 1 ≤ T ≤ 100
- 每组密码长度：1 至 100 字符
- 密码仅由大小写字母和数字组成`,
    outputFormat: `对每组密码，满足要求输出 \"Y\"，否则输出 \"N\"。`,
    samples: [
      { input: "6\nPAs1s2an\n1a2bCq13\nPa12bsna\nab1da3cd\nPaabdbcd\nPa2", output: "Y\nY\nY\nN\nN\nN", explanation: "第4个没有大写字母，第5个没有数字，第6个长度不够" },
    ],
    testCases: [
      { input: "6\nPAs1s2an\n1a2bCq13\nPa12bsna\nab1da3cd\nPaabdbcd\nPa2", output: "Y\nY\nY\nN\nN\nN" },
      { input: "2\nABCDEFG1\nabcdefg1", output: "Y\nN" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "分别检查三个条件：长度、是否有大写字母、是否有数字。",
  },
  {
    title: "[GESP202512 三级] 小杨的智慧购物",
    source: "gesp_official",
    sourceId: "B4450",
    sourceUrl: "https://www.luogu.com.cn/problem/B4450",
    level: 3,
    knowledgePoints: ["数组", "最小值", "分组统计", "循环"],
    difficulty: "普及-", // 洛谷难度2
    description: `小杨需要购买 M 种文具。商店有 N 件文具，每件都有种类编号和价格。

小杨的策略是：对于每种文具，他只买最便宜的那一件。

计算购买所有 M 种文具的总价。`,
    inputFormat: `第一行包含两个正整数 M 和 N，分别表示文具种类数和商店文具总数。

接下来 N 行，每行包含两个正整数 K_i 和 P_i，分别表示文具的种类编号和价格。

数据范围：
- 1 ≤ M ≤ N ≤ 10^5
- 1 ≤ K_i ≤ M
- 1 ≤ P_i ≤ 10^3`,
    outputFormat: `输出购买所有 M 种文具的总价。`,
    samples: [
      { input: "2 5\n1 1\n1 2\n1 1\n2 3\n2 10", output: "4", explanation: "种类1最便宜是1元，种类2最便宜是3元，总价4元" },
    ],
    testCases: [
      { input: "2 5\n1 1\n1 2\n1 1\n2 3\n2 10", output: "4" },
      { input: "3 6\n1 5\n2 3\n3 4\n1 2\n2 6\n3 1", output: "6" },
      { input: "1 3\n1 10\n1 5\n1 8", output: "5" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "使用数组记录每种文具的最低价格，最后求和。",
  },
];

async function seedGesp3() {
  try {
    // 获取现有题目ID列表，避免重复添加
    const existingProblems = await prisma.problem.findMany({
      where: {
        sourceId: {
          in: gesp3Problems.map(p => p.sourceId).filter(Boolean) as string[]
        }
      },
      select: { sourceId: true }
    });

    const existingIds = new Set(existingProblems.map(p => p.sourceId));

    // 过滤出需要添加的新题目
    const newProblems = gesp3Problems.filter(p => !existingIds.has(p.sourceId));

    if (newProblems.length === 0) {
      return NextResponse.json({
        success: true,
        message: "所有 GESP 3级题目已存在",
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
      message: `成功添加 ${result.count} 道 GESP 3级题目`,
      existingCount: existingProblems.length,
      addedCount: result.count,
      totalCount: existingProblems.length + result.count
    });
  } catch (error) {
    console.error("Seed GESP3 error:", error);
    return NextResponse.json({ error: "添加题目失败", details: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return seedGesp3();
}

export async function POST() {
  return seedGesp3();
}
