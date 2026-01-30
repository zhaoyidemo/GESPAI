import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GESP 4级完整题库 - 来源：洛谷 CCF GESP C++ 四级上机题
// 共24道题目
// 难度标签采用洛谷评级：
// - "easy" = 入门(1)/普及-(2)
// - "medium" = 普及/提高-(3)/普及+/提高(4)
// - "hard" = 提高+/省选-(5)及以上

const gesp4Problems = [
  // ========== GESP 样卷 ==========
  {
    title: "[GESP样题 四级] 绝对素数",
    source: "gesp_official",
    sourceId: "B3939",
    sourceUrl: "https://www.luogu.com.cn/problem/B3939",
    level: 4,
    knowledgePoints: ["素数", "数学", "模拟"],
    difficulty: "普及-", // 洛谷难度2
    description: `绝对素数是指一个两位数的素数，当交换其十位和个位数字后得到的数仍然是素数时，这个数就被称为绝对素数。例如，13是绝对素数，因为13和31都是素数。

给定两个正整数 A 和 B，请找出所有满足 A ≤ 数字 ≤ B 的绝对素数。`,
    inputFormat: `一行，包含两个正整数 A 和 B，其中 10 < A < B < 100。`,
    outputFormat: `多行，每行包含一个绝对素数，按从小到大的顺序输出。`,
    samples: [
      { input: "11 20", output: "11\n13\n17" },
    ],
    testCases: [
      { input: "11 20", output: "11\n13\n17" },
      { input: "30 40", output: "31\n37" },
      { input: "70 80", output: "71\n73\n79" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: ``,
  },
  {
    title: "[GESP样题 四级] 填幻方",
    source: "gesp_official",
    sourceId: "B3940",
    sourceUrl: "https://www.luogu.com.cn/problem/B3940",
    level: 4,
    knowledgePoints: ["模拟", "二维数组", "数学"],
    difficulty: "普及-", // 洛谷难度2
    description: `将 1 到 N² 的整数填入一个 N×N 的网格中，使得每行、每列以及两条对角线上的数字之和都相等，这样的网格称为"幻方"。

对于奇数 N，可以使用以下算法填充幻方：

1. 将 1 放在第一行的中间位置
2. 向上移动一格（如果在第一行则移动到最底行），然后向右移动一格（如果在最右列则移动到最左列）。如果该位置为空，则在此放置下一个数字
3. 如果第2步中的位置已被占用，则从上一个数字的位置向下移动一格（如果在最底行则移动到最顶行），在此放置下一个数字
4. 重复步骤2和3，直到所有 N² 个数字都被放置

请按照此算法，输出一个 N×N 的幻方。`,
    inputFormat: `一个奇数整数 N，其中 3 ≤ N ≤ 21。`,
    outputFormat: `N 行，每行包含 N 个空格分隔的整数，表示填充后的幻方。`,
    samples: [
      { input: "3", output: "8 1 6\n3 5 7\n4 9 2" },
    ],
    testCases: [
      { input: "3", output: "8 1 6\n3 5 7\n4 9 2" },
      { input: "5", output: "17 24 1 8 15\n23 5 7 14 16\n4 6 13 20 22\n10 12 19 21 3\n11 18 25 2 9" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: ``,
  },

  // ========== 2023年6月 ==========
  {
    title: "[GESP202306 四级] 幸运数",
    source: "gesp_official",
    sourceId: "B3850",
    sourceUrl: "https://www.luogu.com.cn/problem/B3850",
    level: 4,
    knowledgePoints: ["模拟", "数位处理", "字符串"],
    difficulty: "普及-", // 洛谷难度2
    description: `"幸运数"的定义是通过一个数位变换过程来判断的。对于一个正整数的每一位数字：
- 偶数位置（第2、4、6...位）的数字保持不变
- 奇数位置（第1、3、5...位）的数字：先乘以7，然后不断将各位数字相加，直到结果 ≤ 9

变换完所有数字后，将变换结果的各位数字求和。如果这个和能被8整除，则原来的数是"幸运数"。

例如，对于 16347：
- 第1位（奇数位）：1×7=7
- 第2位（偶数位）：6（保持不变）
- 第3位（奇数位）：3×7=21→2+1=3
- 第4位（偶数位）：4（保持不变）
- 第5位（奇数位）：7×7=49→4+9=13→1+3=4

变换后得到 76344，各位数字之和 = 7+6+3+4+4 = 24，24能被8整除，所以 16347 是幸运数。`,
    inputFormat: `第一行：整数 N（1 ≤ N ≤ 20）

接下来 N 行：每行一个正整数（每个数 < 10^12）`,
    outputFormat: `N 行，每行输出 \"T\"（是幸运数）或 \"F\"（不是幸运数）

提示：可以边读入边处理并输出。`,
    samples: [
      { input: "2\n16347\n76344", output: "T\nF" },
    ],
    testCases: [
      { input: "2\n16347\n76344", output: "T\nF" },
      { input: "3\n1\n8\n16", output: "F\nT\nT" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `可以输入一个数就判断一个数并输出，无需等待所有输入结束`,
  },
  {
    title: "[GESP202306 四级] 图像压缩",
    source: "gesp_official",
    sourceId: "B3851",
    sourceUrl: "https://www.luogu.com.cn/problem/B3851",
    level: 4,
    knowledgePoints: ["模拟", "排序", "哈希", "字符串处理"],
    difficulty: "普及/提高-", // 洛谷难度3
    description: `将一幅256级灰度图像压缩为16级灰度图像。每个像素的灰度值原本范围是 0-255（十六进制 00-FF），需要压缩到 0-15（十六进制 0-F）。

压缩规则：
1. 统计每个灰度值出现的次数
2. 选择出现次数最多的16个灰度值（次数相同时，灰度值小的优先）
3. 将这16个灰度值按出现次数从多到少编码为 0-F（最常出现的编码为0）
4. 其余灰度值映射到最接近的已选灰度值（距离相同时选编码小的）`,
    inputFormat: `第一行：整数 n（10 ≤ n ≤ 20），表示图像行数

接下来 n 行：每行一个偶数长度的十六进制字符串，表示一行像素（每两个十六进制字符表示一个像素的灰度值）

保证图像中至少有16种不同的灰度值，每行最多20个像素。`,
    outputFormat: `第一行：32个十六进制字符，表示选中的16个灰度值

接下来 n 行：压缩后的图像，每个像素用一个十六进制数字表示`,
    samples: [
      { input: "10\n00FFCFAB00FFAC09071B5CCFAB76\n00AFCBAB11FFAB09981D34CFAF56\n01BFCEAB00FFAC0907F25FCFBA65\n10FBCBAB11FFAB09981DF4CFCA67\n00FFCBFB00FFAC0907A25CCFFC76\n00FFCBAB1CFFCB09FC1AC4CFCF67\n01FCCBAB00FFAC0F071A54CFBA65\n10EFCBAB11FFAB09981B34CFCF67\n01FFCBAB00FFAC0F071054CFAC76\n1000CBAB11FFAB0A981B84CFCF66", output: "ABCFFF00CB09AC07101198011B6776FC\n321032657CD10E\n36409205ACC16D\nB41032657FD16D\n8F409205ACF14D\n324F326570D1FE\n3240C245FC411D\nBF4032687CD16D\n8F409205ACC11D\nB240326878D16E\n83409205ACE11D" },
    ],
    testCases: [
      { input: "10\nABCF00FF\nABCF00FF\nABCF00FF\nABCF00FF\nABCF00FF\nABCF00FF\nABCF00FF\n0102030405060708090A0B0C0D0E0F10\n1112131415161718191A1B1C1D1E1F20\n2122232425262728292A2B2C2D2E2F30", output: "请参考洛谷原题" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `灰阶AB、CF和FF出现14次；00出现10次；CB出现9次；09出现7次；AC出现6次；07出现5次；10、11和98出现4次；01、1B、67、76和FC出现3次。`,
  },

  // ========== 2023年9月 ==========
  {
    title: "[GESP202309 四级] 进制转换",
    source: "gesp_official",
    sourceId: "B3869",
    sourceUrl: "https://www.luogu.com.cn/problem/B3869",
    level: 4,
    knowledgePoints: ["进制转换", "数学", "字符串"],
    difficulty: "普及-", // 洛谷难度2
    description: `N进制是一种计数系统，每 N 个单位进一位。对于大于10的进制，使用字母 A-F 分别表示数值 10-15。

给定多个不同进制的数，请将它们转换为十进制。

对于一个 K 进制的 L 位数，可以使用以下公式转换为十进制：
将每一位的数值乘以 K 的相应次幂，然后求和。`,
    inputFormat: `第一行：整数 N（N ≤ 1000），表示要转换的数的个数

接下来 N 行：每行包含一个整数 K（2 ≤ K ≤ 16）和一个 K 进制数，用空格分隔

保证所有数由数字和大写字母组成，不以0开头，且是合法的 K 进制数。`,
    outputFormat: `N 行，每行一个十进制整数，对应输入中的 K 进制数的转换结果。`,
    samples: [
      { input: "2\n8 1362\n16 3F0", output: "754\n1008" },
      { input: "2\n2 11011\n10 123456789", output: "27\n123456789" },
    ],
    testCases: [
      { input: "2\n8 1362\n16 3F0", output: "754\n1008" },
      { input: "2\n2 11011\n10 123456789", output: "27\n123456789" },
      { input: "3\n16 FF\n2 1111\n8 77", output: "255\n15\n63" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `对L位K进制数，将第i位数码乘以权值K^i，再相加得十进制值。例：八进制1362=1×8³+3×8²+6×8¹+2×8⁰=754；十六进制3F0=3×16²+15×16¹+0×16⁰=1008。`,
  },
  {
    title: "[GESP202309 四级] 变长编码",
    source: "gesp_official",
    sourceId: "B3870",
    sourceUrl: "https://www.luogu.com.cn/problem/B3870",
    level: 4,
    knowledgePoints: ["进制转换", "位运算", "编码"],
    difficulty: "普及-", // 洛谷难度2
    description: `变长编码是一种将正整数编码为字节序列的方式：

1. 将数字转换为二进制
2. 从低位到高位将二进制数分成7位一组，高位不足7位时补0
3. 为每组添加一个前导位：如果后面还有更多组则添加 \"1\"，如果是最后一组则添加 \"0\"

例如：
- N=0：二进制是0，一组 \"0000000\"，添加前导0得到 \"00000000\"，即十六进制 00
- N=926：二进制是 \"1110011110\"，分成 \"0011110\" 和 \"0000111\"，添加前导位得到 \"10011110\" 和 \"00000111\"，即十六进制 9E 07`,
    inputFormat: `一个非负整数 N，其中 0 ≤ N ≤ 10^18。`,
    outputFormat: `编码结果的每个字节用2位十六进制数表示（使用大写字母A-F），字节之间用空格分隔。`,
    samples: [
      { input: "0", output: "00" },
      { input: "926", output: "9E 07" },
      { input: "987654321012345678", output: "CE 96 C8 A6 F4 CB B6 DA 0D" },
    ],
    testCases: [
      { input: "0", output: "00" },
      { input: "926", output: "9E 07" },
      { input: "127", output: "7F" },
      { input: "128", output: "80 01" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: ``,
  },

  // ========== 2023年12月 ==========
  {
    title: "[GESP202312 四级] 小杨的字典",
    source: "gesp_official",
    sourceId: "B3927",
    sourceUrl: "https://www.luogu.com.cn/problem/B3927",
    level: 4,
    knowledgePoints: ["字符串处理", "map", "STL容器", "模拟"],
    difficulty: "普及-", // 洛谷难度2
    description: `一个翻译官需要根据提供的字典将A语言文章翻译成B语言。

文章由标点符号和一些A语言单词构成，每个单词之间必定由至少一个标点符号分割。

翻译规则：
- 字典中存在的单词翻译为对应的B语言单词
- 字典中不存在的单词翻译为"UNK"
- 标点符号保持不变`,
    inputFormat: `第一行：整数 N（词典条目数，N ≤ 100）

接下来 N 行：两个空格分隔的字符串 A 和 B（表示A语言单词和对应的B语言翻译）

最后一行：需要翻译的字符串 S（长度 ≤ 1000）`,
    outputFormat: `输出翻译后的一行结果。`,
    samples: [
      { input: "2\nabc a\nd def\nabc.d.d.abc.abcd", output: "a.def.def.a.UNK" },
      { input: "3\nabc a\nd def\nabcd xxxx\nabc,(d)d!-abc?abcd", output: "a,(def)def!-a?xxxx" },
      { input: "1\nabcdefghij klmnopqrst\n!()-[]{}\\|;:'\",./?\n<>abcdefghijklmnopqrstuvwxyz", output: "!()-[]{}\\|;:'\",./?\n<>UNK" },
    ],
    testCases: [
      { input: "2\nabc a\nd def\nabc.d.d.abc.abcd.", output: "a.def.def.a.UNK." },
      { input: "3\nabc a\nd def\nabcd xxxx\nabc,(d)d!-abc?abcd", output: "a,(def)def!-a?xxxx" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: ``,
  },
  {
    title: "[GESP202312 四级] 田忌赛马",
    source: "gesp_official",
    sourceId: "B3928",
    sourceUrl: "https://www.luogu.com.cn/problem/B3928",
    level: 4,
    knowledgePoints: ["贪心算法", "排序", "双指针"],
    difficulty: "普及-", // 洛谷难度2
    description: `你与田忌进行赛马比赛。你们各有 N 匹马，进行 N 轮比赛。每轮比赛双方各派出一匹马参赛。

你的马的速度为 u₁, u₂, ..., uₙ；田忌的马的速度为 v₁, v₂, ..., vₙ。

田忌按顺序派出他的马（第 i 轮派出第 i 匹马）。请你确定最优的出场顺序，使你赢得的轮数最多。

所有马的速度都不相同，因此不会出现平局。`,
    inputFormat: `第一行：整数 N（1 ≤ N ≤ 5×10⁴）

第二行：N 个空格分隔的整数，表示你的马的速度（1 ≤ uᵢ ≤ 2N）

第三行：N 个空格分隔的整数，表示田忌的马的速度（1 ≤ vᵢ ≤ 2N）`,
    outputFormat: `输出一个整数，表示你最多能赢的轮数。`,
    samples: [
      { input: "3\n1 3 5\n2 4 6", output: "2" },
      { input: "5\n10 3 5 8 7\n4 6 1 2 9", output: "5" },
    ],
    testCases: [
      { input: "3\n1 3 5\n2 4 6", output: "2" },
      { input: "5\n10 3 5 8 7\n4 6 1 2 9", output: "5" },
      { input: "4\n1 2 3 4\n5 6 7 8", output: "0" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `样例解释：第1轮田忌派速度2，你派速度3获胜。第2轮田忌派速度4，你派速度5获胜。第3轮田忌派速度6，你派速度1失败。总共赢得2轮。`,
  },

  // ========== 2024年3月 ==========
  {
    title: "[GESP202403 四级] 相似字符串",
    source: "gesp_official",
    sourceId: "B3958",
    sourceUrl: "https://www.luogu.com.cn/problem/B3958",
    level: 4,
    knowledgePoints: ["字符串", "编辑距离", "模拟"],
    difficulty: "普及-", // 洛谷难度2
    description: `两个字符串 A 和 B 被认为是"相似的"，当且仅当 A 可以通过恰好一次操作变成 B。操作可以是：删除一个字符、插入一个字符、或修改一个字符。

此外，完全相同的两个字符串也被认为是相似的。

例如：
- "apple" 与 "applee" 相似（插入）
- "apple" 与 "appe" 相似（删除）
- "apple" 与 "bpple" 相似（修改）
- "applee" 与 "bpple" 不相似（需要超过一次操作）`,
    inputFormat: `第一行：整数 T（测试用例数）

接下来 T 行：每行包含两个空格分隔的字符串 A 和 B`,
    outputFormat: `对于每对字符串，如果它们相似则输出 \"similar\"，否则输出 \"not similar\"。`,
    samples: [
      { input: "5\napple applee\napple appe\napple bpple\napplee bpple\napple apple", output: "similar\nsimilar\nsimilar\nnot similar\nsimilar" },
    ],
    testCases: [
      { input: "5\napple applee\napple appe\napple bpple\napplee bpple\napple apple", output: "similar\nsimilar\nsimilar\nnot similar\nsimilar" },
      { input: "2\na aa\nabc abc", output: "similar\nsimilar" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `1 ≤ T ≤ 100，A和B的长度不超过50，仅含小写字母。`,
  },
  {
    title: "[GESP202403 四级] 做题",
    source: "gesp_official",
    sourceId: "B3959",
    sourceUrl: "https://www.luogu.com.cn/problem/B3959",
    level: 4,
    knowledgePoints: ["贪心算法", "排序"],
    difficulty: "普及-", // 洛谷难度2
    description: `一个学生计划每天做题，第 k 天需要做 k 道题。他有 n 本题集，每本题集包含一定数量的题目。

规则：
- 每本题集只能使用一次
- 每天只能使用一本题集
- 不需要做完题集中的所有题目

请问他最多能连续做多少天题目？`,
    inputFormat: `第一行：整数 n（题集数量）

第二行：n 个整数 a₁, a₂, ..., aₙ（每本题集的题目数量）`,
    outputFormat: `一个整数，表示最多能连续做题的天数。`,
    samples: [
      { input: "4\n3 1 4 1", output: "3" },
    ],
    testCases: [
      { input: "4\n3 1 4 1", output: "3" },
      { input: "5\n1 2 3 4 5", output: "5" },
      { input: "3\n10 10 10", output: "3" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `数据规模：1 ≤ n ≤ 10⁶，1 ≤ aᵢ ≤ 10⁹`,
  },

  // ========== 2024年6月 ==========
  {
    title: "[GESP202406 四级] 黑白方块",
    source: "gesp_official",
    sourceId: "B4005",
    sourceUrl: "https://www.luogu.com.cn/problem/B4005",
    level: 4,
    knowledgePoints: ["二维数组", "枚举", "前缀和"],
    difficulty: "普及-", // 洛谷难度2
    description: `小杨有一个 n×m 的网格，每个格子是白色（0）或黑色（1）。

一个矩形子区域被称为"平衡的"，当且仅当它包含的黑色格子数量等于白色格子数量。

请找出最大的平衡子矩形，并输出它包含的格子数量。`,
    inputFormat: `第一行：两个正整数 n, m

接下来 n 行：每行一个长度为 m 的01字符串，表示网格的颜色（0=白色，1=黑色）`,
    outputFormat: `一个整数：最大平衡子矩形的格子数量，如果不存在则输出0。`,
    samples: [
      { input: "4 5\n00000\n01111\n00011\n00011", output: "16" },
    ],
    testCases: [
      { input: "4 5\n00000\n01111\n00011\n00011", output: "16" },
      { input: "2 2\n00\n00", output: "0" },
      { input: "2 2\n01\n10", output: "4" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于样例 1，假设 (i,j) 代表第 i 行第 j 列，最大的平衡子矩形的四个顶点分别为 (1,2),(1,5),(4,2),(4,5)。数据范围：对于全部数据，保证有 1≤n,m≤10。`,
  },
  {
    title: "[GESP202406 四级] 宝箱",
    source: "gesp_official",
    sourceId: "B4006",
    sourceUrl: "https://www.luogu.com.cn/problem/B4006",
    level: 4,
    knowledgePoints: ["贪心算法", "排序", "滑动窗口"],
    difficulty: "普及-", // 洛谷难度2
    description: `小杨发现了 n 个宝箱，第 i 个宝箱的价值是 aᵢ。他可以选择一些宝箱放入背包中带走。

但是背包有一个限制：如果选中的宝箱中最大价值为 x，最小价值为 y，则必须满足 x - y ≤ k，否则背包会破裂。

请找出小杨能带走的宝箱的最大总价值。`,
    inputFormat: `第一行：两个整数 n, k

第二行：n 个正整数 a₁, a₂, ..., aₙ（宝箱价值）`,
    outputFormat: `一个整数，表示能带走的宝箱的最大总价值。`,
    samples: [
      { input: "5 1\n1 2 3 1 2", output: "7" },
    ],
    testCases: [
      { input: "5 1\n1 2 3 1 2", output: "7" },
      { input: "3 0\n5 5 5", output: "15" },
      { input: "4 10\n1 2 3 4", output: "10" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `在背包不损坏的情况下，小杨可以拿走两个价值为2的宝箱和一个价值为3的宝箱。数据范围：1≤n≤1000，0≤k≤1000，1≤a_i≤1000。`,
  },

  // ========== 2024年9月 ==========
  {
    title: "[GESP202409 四级] 黑白方块",
    source: "gesp_official",
    sourceId: "B4040",
    sourceUrl: "https://www.luogu.com.cn/problem/B4040",
    level: 4,
    knowledgePoints: ["二维数组", "模式匹配", "模拟"],
    difficulty: "普及-", // 洛谷难度2
    description: `给定一个由0（白色）和1（黑色）组成的网格。需要检测网格中是否存在特定的 4×4 子矩形图案。

要求的图案：
- 第1行和第4行：全部是白色（0）
- 第2行和第3行：第1和第4位置是白色（0），第2和第3位置是黑色（1）

即图案为：
\`\`\`
0000
0110
0110
0000
\`\`\``,
    inputFormat: `第一行：整数 t（测试用例数）

对于每个测试用例：
- 第一行：整数 n, m（网格尺寸）
- 接下来 n 行：长度为 m 的01字符串`,
    outputFormat: `对于每个测试用例，如果图案存在则输出 \"Yes\"，否则输出 \"No\"。`,
    samples: [
      { input: "3\n1 4\n0110\n5 5\n00000\n01100\n01100\n00001\n01100\n5 5\n00000\n01100\n01110\n00001\n01100", output: "No\nYes\nNo" },
    ],
    testCases: [
      { input: "3\n1 4\n0110\n5 5\n00000\n01100\n01100\n00001\n01100\n5 5\n00000\n01100\n01110\n00001\n01100", output: "No\nYes\nNo" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `示例1展示了标准的4×4匹配模式：0000、0110、0110、0000。数据范围：1≤t≤10，1≤n,m≤100。`,
  },
  {
    title: "[GESP202409 四级] 区间排序",
    source: "gesp_official",
    sourceId: "B4041",
    sourceUrl: "https://www.luogu.com.cn/problem/B4041",
    level: 4,
    knowledgePoints: ["排序", "数组", "模拟"],
    difficulty: "普及-", // 洛谷难度2
    description: `小杨有一个包含 n 个正整数的序列。他计划对指定的区间进行多次升序排序。

每次操作选择一个区间 [l, r]，将该区间内的元素升序排序（基于前一次操作后的状态）。

请输出所有操作完成后的最终序列。`,
    inputFormat: `第一行：整数 n（序列长度）

第二行：n 个整数，表示序列 a

第三行：整数 q（排序操作次数）

接下来 q 行：每行两个整数 lᵢ, rᵢ（区间边界）`,
    outputFormat: `一行 n 个整数，表示所有操作完成后的序列。`,
    samples: [
      { input: "5\n3 4 5 2 1\n3\n4 5\n3 4\n1 3", output: "1 3 4 5 2" },
    ],
    testCases: [
      { input: "5\n3 4 5 2 1\n3\n4 5\n3 4\n1 3", output: "1 3 4 5 2" },
      { input: "4\n4 3 2 1\n1\n1 4", output: "1 2 3 4" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `样例1解释：第一次升序排序后，序列为[3,4,5,1,2]；第二次升序排序后，序列为[3,4,1,5,2]；第三次升序排序后，序列为[1,3,4,5,2]。约定：1 ≤ n, aᵢ, q ≤ 100，1 ≤ lᵢ ≤ rᵢ ≤ n。`,
  },

  // ========== 2024年12月 ==========
  {
    title: "[GESP202412 四级] Recaman",
    source: "gesp_official",
    sourceId: "B4068",
    sourceUrl: "https://www.luogu.com.cn/problem/B4068",
    level: 4,
    knowledgePoints: ["递推", "集合", "STL容器"],
    difficulty: "普及-", // 洛谷难度2
    description: `生成 Recaman 序列的前 n 项，规则如下：

- 第一项：a₁ = 1
- 对于后续每一项：如果 (aₖ₋₁ - k) 是正整数且不在序列中出现过，则 aₖ = aₖ₋₁ - k；否则 aₖ = aₖ₋₁ + k

输出前 n 项按升序排列的结果。`,
    inputFormat: `一个正整数 n（1 ≤ n ≤ 3000）`,
    outputFormat: `n 个空格分隔的整数，表示排序后的前 n 项。`,
    samples: [
      { input: "5", output: "1 2 3 6 7" },
      { input: "8", output: "1 2 3 6 7 12 13 20" },
    ],
    testCases: [
      { input: "5", output: "1 2 3 6 7" },
      { input: "8", output: "1 2 3 6 7 12 13 20" },
      { input: "1", output: "1" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对n=5：a_1=1; a_1-2=-1(非正整数)→a_2=3; a_2-3=0(非正整数)→a_3=6; a_3-4=2(正整数且未出现)→a_4=2; a_4-5=-3(非正整数)→a_5=7。排序结果：1,2,3,6,7。数据范围：1≤n≤3000。`,
  },
  {
    title: "[GESP202412 四级] 字符排序",
    source: "gesp_official",
    sourceId: "B4069",
    sourceUrl: "https://www.luogu.com.cn/problem/B4069",
    level: 4,
    knowledgePoints: ["字符串", "排序", "贪心"],
    difficulty: "普及-", // 洛谷难度2
    description: `给定 n 个仅包含小写字母的字符串，判断是否存在一种排列顺序，使得拼接后的字符串 t 是非递减的（每个字符都大于等于它前面的所有字符）。`,
    inputFormat: `第一行：整数 T（测试用例数）

对于每个测试用例：
- 第一行：整数 n（字符串数量）
- 接下来 n 行：每行一个字符串`,
    outputFormat: `对于每个测试用例，如果存在有效排列则输出 \"1\"，否则输出 \"0\"。`,
    samples: [
      { input: "3\n3\naa\nac\nde\n2\naac\nbc\n1\ngesp", output: "1\n0\n0" },
    ],
    testCases: [
      { input: "3\n3\naa\nac\nde\n2\naac\nbc\n1\ngesp", output: "1\n0\n0" },
      { input: "2\n2\na\nb\n1\naaa", output: "1\n1" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `For the first test case, arranging as 'aa' + 'ac' + 'de' produces 'aaacde', which satisfies the condition where each character is greater than or equal to all previous characters.`,
  },

  // ========== 2025年3月 ==========
  {
    title: "[GESP202503 四级] 荒地开垦",
    source: "gesp_official",
    sourceId: "B4263",
    sourceUrl: "https://www.luogu.com.cn/problem/B4263",
    level: 4,
    knowledgePoints: ["二维数组", "枚举", "模拟"],
    difficulty: "普及-", // 洛谷难度2
    description: `小杨有一块荒地，表示为 n×m 的网格。一块荒地可以被开垦当且仅当"它的四个相邻格子都没有障碍物"。

某些位置有障碍物（#），其他位置是空地（.）。

小杨可以最多移除一个位置的障碍物，移除后该格子变为可用土地。请找出在此限制下能开垦的最大荒地数量。`,
    inputFormat: `第一行：两个正整数 n 和 m（网格尺寸）

接下来 n 行：长度为 m 的字符串，包含'.'（荒地）和'#'（障碍物）`,
    outputFormat: `一个整数，表示能开垦的最大荒地数量。`,
    samples: [
      { input: "3 5\n.....\n.#..#\n.....", output: "11" },
    ],
    testCases: [
      { input: "3 5\n.....\n.#..#\n.....", output: "11" },
      { input: "3 3\n...\n...\n...", output: "1" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `After removing the debris at row 2, column 2: cells from row 1 (leftmost 4), row 2 (leftmost 3), and row 3 (leftmost 4) become reclaimable. Total: 4+3+4=11`,
  },
  {
    title: "[GESP202503 四级] 二阶矩阵",
    source: "gesp_official",
    sourceId: "B4264",
    sourceUrl: "https://www.luogu.com.cn/problem/B4264",
    level: 4,
    knowledgePoints: ["二维数组", "枚举", "数学"],
    difficulty: "普及/提高-", // 洛谷难度4
    description: `小A有一个 n×m 的矩阵。一个 2×2 的子矩阵 D 被称为"好的"，当且仅当满足条件：

D₁,₁ × D₂,₂ = D₁,₂ × D₂,₁

即对角线元素的乘积等于反对角线元素的乘积。

请统计矩阵中有多少个"好的" 2×2 子矩阵。`,
    inputFormat: `第一行：两个正整数 n, m

接下来 n 行：每行 m 个整数，表示矩阵 A`,
    outputFormat: `一个整数，表示"好的"子矩阵的数量。`,
    samples: [
      { input: "3 4\n1 2 1 0\n2 4 2 1\n0 3 3 0", output: "2" },
    ],
    testCases: [
      { input: "3 4\n1 2 1 0\n2 4 2 1\n0 3 3 0", output: "2" },
      { input: "2 2\n1 1\n1 1", output: "1" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `样例中好的子矩阵如下：[image]\n数据范围：1≤n≤500，1≤m≤500，-100≤Aᵢ,ⱼ≤100`,
  },

  // ========== 2025年6月 ==========
  {
    title: "[GESP202506 四级] 画布裁剪",
    source: "gesp_official",
    sourceId: "B4360",
    sourceUrl: "https://www.luogu.com.cn/problem/B4360",
    level: 4,
    knowledgePoints: ["二维数组", "字符串", "模拟"],
    difficulty: "普及-", // 洛谷难度1
    description: `小A在 h×w 的矩形画布上绘制了一幅画。需要通过指定行列范围来裁剪画布。

保留从第 x₁ 行到第 x₂ 行、第 y₁ 列到第 y₂ 列构成的子矩阵。`,
    inputFormat: `第一行：两个正整数 h、w（画布行数与列数）

第二行：四个正整数 x₁、x₂、y₁、y₂（保留范围的边界）

接下来 h 行：每行长度为 w 的字符串（画布内容）`,
    outputFormat: `输出 (x₂ - x₁ + 1) 行，每行 (y₂ - y₁ + 1) 个字符的字符串，表示裁剪后的画布。`,
    samples: [
      { input: "3 5\n2 2 2 4\n.....\n.>_<.\n.....", output: ">_<" },
      { input: "5 5\n1 2 3 4\nAbCdE\nfGhIk\nLmNoP\nqRsTu\nVwXyZ", output: "Cd\nhI" },
    ],
    testCases: [
      { input: "3 5\n2 2 2 4\n.....\n.>_<.\n.....", output: ">_<" },
      { input: "5 5\n1 2 3 4\nAbCdE\nfGhIk\nLmNoP\nqRsTu\nVwXyZ", output: "Cd\nhI" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于所有测试点，保证 1 ≤ h, w ≤ 100，1 ≤ x₁ ≤ x₂ ≤ h，1 ≤ y₁ ≤ y₂ ≤ w。`,
  },
  {
    title: "[GESP202506 四级] 排序",
    source: "gesp_official",
    sourceId: "B4361",
    sourceUrl: "https://www.luogu.com.cn/problem/B4361",
    level: 4,
    knowledgePoints: ["排序", "逆序对", "冒泡排序"],
    difficulty: "普及-", // 洛谷难度2
    description: `体育课上有 n 名同学排成一队，每位同学有身高和体重两个属性。

老师要求按照以下规则重新排序：
- 身高从高到低排列
- 身高相同时，体重从重到轻排列

每次操作只能交换相邻的两位同学。

请问最少需要多少次交换操作？`,
    inputFormat: `第一行：正整数 n（队伍人数）

接下来 n 行：两个正整数 hᵢ 和 wᵢ（第 i 位同学的身高和体重）`,
    outputFormat: `一个整数，表示最少需要的交换次数。`,
    samples: [
      { input: "5\n1 60\n3 70\n2 80\n4 55\n4 50", output: "8" },
      { input: "5\n4 0\n4 0\n2 0\n3 0\n1 0", output: "1" },
    ],
    testCases: [
      { input: "5\n1 60\n3 70\n2 80\n4 55\n4 50", output: "8" },
      { input: "5\n4 0\n4 0\n2 0\n3 0\n1 0", output: "1" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于所有测试点，保证1≤n≤3000，0≤h_i, w_i≤10^9。`,
  },

  // ========== 2025年9月 ==========
  {
    title: "[GESP202509 四级] 排兵布阵",
    source: "gesp_official",
    sourceId: "B4415",
    sourceUrl: "https://www.luogu.com.cn/problem/B4415",
    level: 4,
    knowledgePoints: ["二维数组", "枚举", "最大子矩形"],
    difficulty: "普及-", // 洛谷难度2
    description: `作为将军，你需要在 n×m 的网格地图上布置部队。标记为1的格子适合部署，标记为0的格子不适合。

你需要找到只包含1的最大矩形区域。`,
    inputFormat: `第一行：两个正整数 n, m（网格尺寸）

接下来 n 行：每行 m 个整数（0或1），表示每个格子是否适合部署`,
    outputFormat: `一个整数，表示最大有效矩形区域包含的格子数量。`,
    samples: [
      { input: "4 3\n0 1 1\n1 0 1\n0 1 1\n1 1 1", output: "4" },
      { input: "3 5\n1 0 1 0 1\n0 1 0 1 0\n0 1 1 1 0", output: "3" },
    ],
    testCases: [
      { input: "4 3\n0 1 1\n1 0 1\n0 1 1\n1 1 1", output: "4" },
      { input: "3 5\n1 0 1 0 1\n0 1 0 1 0\n0 1 1 1 0", output: "3" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `所有测试点保证 1 ≤ n, m ≤ 12，0 ≤ a_{i,j} ≤ 1。`,
  },
  {
    title: "[GESP202509 四级] 最长连续段",
    source: "gesp_official",
    sourceId: "B4416",
    sourceUrl: "https://www.luogu.com.cn/problem/B4416",
    level: 4,
    knowledgePoints: ["排序", "贪心", "连续序列"],
    difficulty: "普及-", // 洛谷难度2
    description: `"连续段"是指数组中每个元素都等于前一个元素加1的子数组。

给定一个包含 n 个整数的数组，你可以重新排列元素。请找出重排后任意连续子数组能形成的最长连续段的长度。`,
    inputFormat: `第一行：整数 n（数组长度）

第二行：n 个整数，表示数组元素`,
    outputFormat: `一个整数，表示连续段子数组的最大长度。`,
    samples: [
      { input: "4\n1 0 2 4", output: "3" },
      { input: "9\n9 9 8 2 4 4 3 5 3", output: "4" },
    ],
    testCases: [
      { input: "4\n1 0 2 4", output: "3" },
      { input: "9\n9 9 8 2 4 4 3 5 3", output: "4" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `40%的测试点：1 ≤ n ≤ 8。所有测试点：1 ≤ n ≤ 10^5，-10^9 ≤ a_i ≤ 10^9。`,
  },

  // ========== 2025年12月 ==========
  {
    title: "[GESP202512 四级] 建造",
    source: "gesp_official",
    sourceId: "B4451",
    sourceUrl: "https://www.luogu.com.cn/problem/B4451",
    level: 4,
    knowledgePoints: ["二维数组", "枚举", "滑动窗口"],
    difficulty: "普及-", // 洛谷难度2
    description: `小A有一张 M 行 N 列的地形图，每个格子 (i,j) 有一个海拔值 aᵢⱼ。

一个"降落台"是一个 3×3 的区域，要求"这9个点中最高和最低的海拔差不超过 H"。

请找出所有有效降落台位置中，海拔总和的最大值。`,
    inputFormat: `第一行：三个整数 M, N, H（尺寸和高度限制）

接下来 M 行：每行 N 个整数，表示海拔值`,
    outputFormat: `一个整数，表示有效 3×3 区域中海拔总和的最大值。`,
    samples: [
      { input: "5 5 3\n5 5 5 5 5\n5 1 5 1 5\n5 5 5 5 5\n5 2 5 2 5\n3 5 5 5 2", output: "40" },
    ],
    testCases: [
      { input: "5 5 3\n5 5 5 5 5\n5 1 5 1 5\n5 5 5 5 5\n5 2 5 2 5\n3 5 5 5 2", output: "40" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对所有测试点，保证1≤M, N≤10³，1≤H, a_{ij}≤10⁵。`,
  },
  {
    title: "[GESP202512 四级] 优先购买",
    source: "gesp_official",
    sourceId: "B4452",
    sourceUrl: "https://www.luogu.com.cn/problem/B4452",
    level: 4,
    knowledgePoints: ["排序", "贪心", "模拟", "STL容器"],
    difficulty: "普及-", // 洛谷难度2
    description: `小A有 M 元预算。商店有 N 件商品，每件商品有三个属性：名称 S、价格 P、优先级 V（正整数，V越小优先级越高）。

购物策略：
- 总是优先购买优先级最高的商品
- 如果多件商品优先级相同，购买价格最低的
- 如果优先级和价格都相同，购买名称字典序最小的

请输出所有购买的商品名称，按字典序从小到大排列。`,
    inputFormat: `第一行：两个正整数 M, N（预算和商品数量）

接下来 N 行：Sᵢ Pᵢ Vᵢ（商品名称、价格、优先级）

保证没有重复的商品名称。`,
    outputFormat: `输出所有购买的商品名称，按字典序排列，每行一个。`,
    samples: [
      { input: "20 4\napple 6 8\nbus 15 1\ncab 1 10\nwater 4 8", output: "bus\ncab\nwater" },
    ],
    testCases: [
      { input: "20 4\napple 6 8\nbus 15 1\ncab 1 10\nwater 4 8", output: "bus\ncab\nwater" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对所有测试点：1 ≤ |Si| ≤ 10，1 ≤ M, Pi ≤ 10^5，1 ≤ N ≤ 10^3，1 ≤ Vi ≤ 10。商品名仅由小写字母组成且不存在相同商品名。`,
  },
];

async function seedGesp4() {
  try {
    // 获取现有题目ID列表，避免重复添加
    const existingProblems = await prisma.problem.findMany({
      where: {
        sourceId: {
          in: gesp4Problems.map(p => p.sourceId).filter(Boolean) as string[]
        }
      },
      select: { sourceId: true }
    });

    const existingIds = new Set(existingProblems.map(p => p.sourceId));

    // 过滤出需要添加的新题目
    const newProblems = gesp4Problems.filter(p => !existingIds.has(p.sourceId));

    if (newProblems.length === 0) {
      return NextResponse.json({
        success: true,
        message: "所有 GESP 4级题目已存在",
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
      message: `成功添加 ${result.count} 道 GESP 4级题目`,
      existingCount: existingProblems.length,
      addedCount: result.count,
      totalCount: existingProblems.length + result.count
    });
  } catch (error) {
    console.error("Seed GESP4 error:", error);
    return NextResponse.json({ error: "添加题目失败", details: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return seedGesp4();
}

export async function POST() {
  return seedGesp4();
}
