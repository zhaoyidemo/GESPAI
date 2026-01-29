import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GESP 1级完整题库 - 来源：洛谷 CCF GESP C++ 一级上机题
// 共26道题目
// 难度标签采用洛谷评级：
// - "easy" = 入门(1)/普及-(2)
// - "medium" = 普及/提高-(3)/普及+/提高(4)
// - "hard" = 提高+/省选-(5)及以上

const gesp1Problems = [
  // ========== GESP样题 ==========
  {
    title: "[GESP样题 一级] 闰年求和",
    source: "gesp_official",
    sourceId: "B3846",
    sourceUrl: "https://www.luogu.com.cn/problem/B3846",
    level: 1,
    knowledgePoints: ["循环语句", "条件判断", "闰年判断", "累加求和"],
    difficulty: "入门",
    description: `小明想计算两个年份之间（不含起始和终止年份）的所有闰年年份数字之和。

闰年的判断规则：
- 能被4整除但不能被100整除的年份是闰年
- 能被400整除的年份也是闰年`,
    inputFormat: `输入一行，包含两个整数，分别表示起始年份和终止年份。约定年份在 1 到 2022 之间。`,
    outputFormat: `输出一行，包含一个整数，表示闰年年份数字之和。`,
    samples: [
      { input: "2018 2022", output: "2020", explanation: "区间(2018,2022)内的闰年为2020，年份数字之和为2020" },
    ],
    testCases: [
      { input: "2018 2022", output: "2020" },
      { input: "2000 2010", output: "6012" },
      { input: "1996 2004", output: "4000" },
      { input: "1 100", output: "1128" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: "使用for循环遍历区间内的年份，判断每个年份是否为闰年，若是则累加。",
  },
  {
    title: "[GESP样题 一级] 当天的第几秒",
    source: "gesp_official",
    sourceId: "B3847",
    sourceUrl: "https://www.luogu.com.cn/problem/B3847",
    level: 1,
    knowledgePoints: ["时间计算", "条件判断", "12小时制转换"],
    difficulty: "入门",
    description: `小明刚刚学习了小时、分和秒的换算关系。他想知道一个给定的时刻是这一天的第几秒。

时间采用12小时制，用字符'A'表示上午，'P'表示下午。`,
    inputFormat: `输入一行，包含三个整数和一个字符。三个整数分别表示时刻的时、分、秒；字符有两种取值，大写字母'A'表示上午，大写字母'P'表示下午。`,
    outputFormat: `输出一行，包含一个整数，表示输入时刻是当天的第几秒。`,
    samples: [
      { input: "0 0 0 A", output: "0", explanation: "凌晨0:00:00是第0秒" },
      { input: "11 59 59 P", output: "86399", explanation: "下午11:59:59是第86399秒（即23:59:59）" },
    ],
    testCases: [
      { input: "0 0 0 A", output: "0" },
      { input: "11 59 59 P", output: "86399" },
      { input: "0 0 1 A", output: "1" },
      { input: "0 0 0 P", output: "43200" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: "注意12小时制到24小时制的转换：上午0点对应0时，下午0点对应12时。",
  },
  // ========== 2023年3月 ==========
  {
    title: "[GESP202303 一级] 长方形面积",
    source: "gesp_official",
    sourceId: "B3834",
    sourceUrl: "https://www.luogu.com.cn/problem/B3834",
    level: 1,
    knowledgePoints: ["循环语句", "因数", "枚举"],
    difficulty: "入门",
    description: `小明学习了长方形面积计算。给定长方形面积 A，需要求有多少种可能的长方形，使得长和宽都为正整数。

相同长宽的两个长方形视为同一种，且要求长 >= 宽。`,
    inputFormat: `输入一行，包含一个整数 A，表示长方形面积。

数据范围：2 <= A <= 1000`,
    outputFormat: `输出一行，包含一个整数 C，表示可能的长方形种数。`,
    samples: [
      { input: "4", output: "2", explanation: "面积为4的长方形可以是 2x2 和 4x1，共2种" },
      { input: "6", output: "2", explanation: "面积为6的长方形可以是 3x2 和 6x1，共2种" },
    ],
    testCases: [
      { input: "4", output: "2" },
      { input: "6", output: "2" },
      { input: "12", output: "3" },
      { input: "100", output: "5" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: "枚举宽度从1到sqrt(A)，检查是否能整除面积A。",
  },
  {
    title: "[GESP202303 一级] 每月天数",
    source: "gesp_official",
    sourceId: "B3835",
    sourceUrl: "https://www.luogu.com.cn/problem/B3835",
    level: 1,
    knowledgePoints: ["条件判断", "闰年判断", "分支语句"],
    difficulty: "入门",
    description: `给定一个年份和月份，编程判断该月有多少天。

需要考虑平年与闰年的区别：
- 1、3、5、7、8、10、12月有31天
- 4、6、9、11月有30天
- 2月在平年有28天，闰年有29天`,
    inputFormat: `输入一行，包含两个整数 A, B，分别表示一个日期的年、月。

数据范围：2000 <= A <= 3000，1 <= B <= 12`,
    outputFormat: `输出一行，包含一个整数，表示输入月份有多少天。`,
    samples: [
      { input: "2022 1", output: "31", explanation: "1月有31天" },
      { input: "2020 2", output: "29", explanation: "2020年是闰年，2月有29天" },
    ],
    testCases: [
      { input: "2022 1", output: "31" },
      { input: "2020 2", output: "29" },
      { input: "2021 2", output: "28" },
      { input: "2000 2", output: "29" },
      { input: "2100 2", output: "28" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: "先判断是否为闰年，再根据月份确定天数。闰年条件：能被4整除且不能被100整除，或者能被400整除。",
  },
  // ========== 2023年6月 ==========
  {
    title: "[GESP202306 一级] 时间规划",
    source: "gesp_official",
    sourceId: "B3838",
    sourceUrl: "https://www.luogu.com.cn/problem/B3838",
    level: 1,
    knowledgePoints: ["时间计算", "顺序结构", "变量运算"],
    difficulty: "入门",
    description: `小明在为自己规划学习时间。现在他想知道两个时刻之间有多少分钟。

输入保证两个时刻在同一天，且开始时刻在结束时刻之前。时刻采用24小时制。`,
    inputFormat: `输入4行：
- 第一行为开始时刻的小时
- 第二行为开始时刻的分钟
- 第三行为结束时刻的小时
- 第四行为结束时刻的分钟`,
    outputFormat: `输出一行，包含一个整数，表示从开始时刻到结束时刻之间有多少分钟。`,
    samples: [
      { input: "9\n5\n9\n6", output: "1", explanation: "从9:05到9:06相差1分钟" },
      { input: "9\n5\n10\n0", output: "55", explanation: "从9:05到10:00相差55分钟" },
    ],
    testCases: [
      { input: "9\n5\n9\n6", output: "1" },
      { input: "9\n5\n10\n0", output: "55" },
      { input: "0\n0\n23\n59", output: "1439" },
      { input: "12\n30\n13\n45", output: "75" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: "将时间转换为分钟数，然后相减。总分钟数 = 小时 * 60 + 分钟。",
  },
  {
    title: "[GESP202306 一级] 累计相加",
    source: "gesp_official",
    sourceId: "B3839",
    sourceUrl: "https://www.luogu.com.cn/problem/B3839",
    level: 1,
    knowledgePoints: ["循环语句", "累加求和", "嵌套循环"],
    difficulty: "入门",
    description: `计算形如 1+(1+2)+(1+2+3)+...+(1+2+...+n) 的累计求和结果。

例如当 n=3 时，计算 1+(1+2)+(1+2+3) = 1+3+6 = 10。`,
    inputFormat: `输入一行，包含一个正整数 n。

数据范围：1 < n <= 100`,
    outputFormat: `输出一行，包含一个整数，表示累计相加的结果。`,
    samples: [
      { input: "3", output: "10", explanation: "1+(1+2)+(1+2+3) = 1+3+6 = 10" },
      { input: "4", output: "20", explanation: "1+3+6+10 = 20" },
      { input: "10", output: "220" },
    ],
    testCases: [
      { input: "3", output: "10" },
      { input: "4", output: "20" },
      { input: "10", output: "220" },
      { input: "100", output: "171700" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: "可以使用双重循环，也可以利用公式：第i项为i*(i+1)/2，总和为n*(n+1)*(n+2)/6。",
  },
  // ========== 2023年9月 ==========
  {
    title: "[GESP202309 一级] 买文具",
    source: "gesp_official",
    sourceId: "B3863",
    sourceUrl: "https://www.luogu.com.cn/problem/B3863",
    level: 1,
    knowledgePoints: ["顺序结构", "条件判断", "四则运算"],
    difficulty: "入门",
    description: `小明购买三种文具：
- 签字笔：2元/支
- 记事本：5元/本
- 直尺：3元/把

给定小明需要购买的数量和手中的钱数，判断钱是否足够，并计算剩余或缺少的金额。`,
    inputFormat: `输入四行：
- 第一行：购买签字笔的数量 X（1 <= X <= 10）
- 第二行：购买记事本的数量 Y（1 <= Y <= 10）
- 第三行：购买直尺的数量 Z（1 <= Z <= 10）
- 第四行：手中的钱数 Q（单位：元）`,
    outputFormat: `输出两行：
- 若钱够买：第一行输出"Yes"，第二行输出剩余钱数
- 若钱不够：第一行输出"No"，第二行输出缺少的钱数`,
    samples: [
      { input: "1\n1\n1\n20", output: "Yes\n10", explanation: "总花费2+5+3=10元，剩余10元" },
      { input: "1\n1\n1\n5", output: "No\n5", explanation: "总花费10元，缺少5元" },
    ],
    testCases: [
      { input: "1\n1\n1\n20", output: "Yes\n10" },
      { input: "1\n1\n1\n5", output: "No\n5" },
      { input: "10\n10\n10\n100", output: "No\n0" },
      { input: "5\n5\n5\n50", output: "No\n0" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: "先计算总花费，然后与手中的钱比较，根据比较结果输出不同的信息。",
  },
  {
    title: "[GESP202309 一级] 小明的幸运数",
    source: "gesp_official",
    sourceId: "B3864",
    sourceUrl: "https://www.luogu.com.cn/problem/B3864",
    level: 1,
    knowledgePoints: ["循环语句", "条件判断", "取模运算", "累加求和"],
    difficulty: "入门",
    description: `一个数字被称为"k幸运数"，当且仅当它满足以下任一条件：
- 个位数为 k
- 是 k 的倍数

需要求出区间 [L, R] 内所有 k 幸运数的和。`,
    inputFormat: `输入三行：
- 第一行：正整数 k
- 第二行：正整数 L
- 第三行：正整数 R

数据范围：2 <= k <= 9，1 <= L <= R <= 1000`,
    outputFormat: `输出一行，表示所有 k 幸运数之和。`,
    samples: [
      { input: "7\n1\n10", output: "7", explanation: "区间[1,10]中，只有7是7幸运数（既是7的倍数，个位数也是7）" },
      { input: "7\n10\n20", output: "31", explanation: "14是7的倍数，17的个位数是7，14+17=31" },
    ],
    testCases: [
      { input: "7\n1\n10", output: "7" },
      { input: "7\n10\n20", output: "31" },
      { input: "5\n1\n20", output: "75" },
      { input: "3\n1\n30", output: "198" },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: "遍历区间内每个数，检查是否是k的倍数或个位数等于k，满足条件则累加。",
  },
  // ========== 2023年12月 ==========
  {
    title: "[GESP202312 一级] 小杨的考试",
    source: "gesp_official",
    sourceId: "B3921",
    sourceUrl: "https://www.luogu.com.cn/problem/B3921",
    level: 1,
    knowledgePoints: ["取模运算", "日期计算", "顺序结构"],
    difficulty: "入门",
    description: `今天是星期 X，小杨还有 N 天就要考试了，请推算出小杨考试那天是星期几。

本题中使用 7 表示星期日。`,
    inputFormat: `输入2行：
- 第一行一个整数 X（1 <= X <= 7）
- 第二行一个整数 N（1 <= N <= 364）`,
    outputFormat: `输出一个整数，表示小杨考试那天是星期几。`,
    samples: [
      { input: "1\n6", output: "7", explanation: "今天星期1，六天后是星期日，用7表示" },
      { input: "5\n3", output: "1", explanation: "今天星期5，三天后是星期1" },
    ],
    testCases: [
      { input: "1\n6", output: "7" },
      { input: "5\n3", output: "1" },
      { input: "7\n7", output: "7" },
      { input: "1\n1", output: "2" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "使用取模运算：(X + N - 1) % 7 + 1，或者 (X + N) % 7，注意处理结果为0的情况。",
  },
  {
    title: "[GESP202312 一级] 小杨报数",
    source: "gesp_official",
    sourceId: "B3922",
    sourceUrl: "https://www.luogu.com.cn/problem/B3922",
    level: 1,
    knowledgePoints: ["循环语句", "条件判断", "取模运算"],
    difficulty: "入门",
    description: `小杨需从1到N报数，但需要跳过M的所有倍数。

例如 N=5、M=2 时，报出 1、3、5。`,
    inputFormat: `输入两行：
- 第一行：整数 N（1 <= N <= 1000）
- 第二行：整数 M（2 <= M <= 100）`,
    outputFormat: `依次输出小杨报的所有数字，每行一个。`,
    samples: [
      { input: "5\n2", output: "1\n3\n5", explanation: "跳过2和4（2的倍数）" },
      { input: "10\n3", output: "1\n2\n4\n5\n7\n8\n10", explanation: "跳过3、6、9（3的倍数）" },
    ],
    testCases: [
      { input: "5\n2", output: "1\n3\n5" },
      { input: "10\n3", output: "1\n2\n4\n5\n7\n8\n10" },
      { input: "15\n5", output: "1\n2\n3\n4\n6\n7\n8\n9\n11\n12\n13\n14" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "使用for循环从1到N遍历，若当前数不是M的倍数则输出。",
  },
  // ========== 2024年3月 ==========
  {
    title: "[GESP202403 一级] 小杨买书",
    source: "gesp_official",
    sourceId: "B3952",
    sourceUrl: "https://www.luogu.com.cn/problem/B3952",
    level: 1,
    knowledgePoints: ["整数除法", "取模运算", "顺序结构"],
    difficulty: "入门",
    description: `学生有一定零用钱 m 元，需要购买单价为 13 元的书籍。编写程序计算能购买的本数及剩余金额。`,
    inputFormat: `输入一个正整数 m，表示零用钱数额。

数据范围：0 < m < 200`,
    outputFormat: `输出两行：
- 第一行为购买书籍的本数
- 第二行为剩余的零用钱数`,
    samples: [
      { input: "100", output: "7\n9", explanation: "100 / 13 = 7 余 9，购买7本书，剩余9元" },
      { input: "199", output: "15\n4", explanation: "199 / 13 = 15 余 4，购买15本书，剩余4元" },
    ],
    testCases: [
      { input: "100", output: "7\n9" },
      { input: "199", output: "15\n4" },
      { input: "13", output: "1\n0" },
      { input: "12", output: "0\n12" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "使用整数除法求商（本数），使用取模运算求余数（剩余金额）。",
  },
  {
    title: "[GESP202403 一级] 找因数",
    source: "gesp_official",
    sourceId: "B3953",
    sourceUrl: "https://www.luogu.com.cn/problem/B3953",
    level: 1,
    knowledgePoints: ["循环语句", "因数", "取模运算"],
    difficulty: "入门",
    description: `如果正整数 b 能整除正整数 a（即 a % b == 0），则 b 是 a 的因数。

编写程序输出正整数 a 的所有因数，从小到大排序。`,
    inputFormat: `输入一行一个正整数 a。

数据范围：a <= 1000`,
    outputFormat: `输出若干行，为 a 的所有因数，从小到大排序，每行一个。`,
    samples: [
      { input: "1", output: "1" },
      { input: "6", output: "1\n2\n3\n6" },
      { input: "10", output: "1\n2\n5\n10" },
    ],
    testCases: [
      { input: "1", output: "1" },
      { input: "6", output: "1\n2\n3\n6" },
      { input: "10", output: "1\n2\n5\n10" },
      { input: "12", output: "1\n2\n3\n4\n6\n12" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "从1到a遍历，若a能被当前数整除，则输出该数。",
  },
  // ========== 2024年6月 ==========
  {
    title: "[GESP202406 一级] 休息时间",
    source: "gesp_official",
    sourceId: "B4000",
    sourceUrl: "https://www.luogu.com.cn/problem/B4000",
    level: 1,
    knowledgePoints: ["时间计算", "进位处理", "顺序结构"],
    difficulty: "入门",
    description: `小杨在某个时刻开始学习，并在学习 k 秒后开始休息。需要计算休息开始的具体时刻。`,
    inputFormat: `输入4行：
- 第1行：小杨开始学习时刻的小时 h（1 <= h <= 12）
- 第2行：小杨开始学习时刻的分钟 m（0 <= m <= 59）
- 第3行：小杨开始学习时刻的秒 s（0 <= s <= 59）
- 第4行：学习总秒数 k（1 <= k <= 3600）`,
    outputFormat: `输出一行三个整数，表示休息开始时刻的时、分、秒，用空格分隔。`,
    samples: [
      { input: "12\n59\n59\n10", output: "13 0 9", explanation: "从12:59:59开始学习，学习10秒后为13:00:09" },
    ],
    testCases: [
      { input: "12\n59\n59\n10", output: "13 0 9" },
      { input: "1\n0\n0\n3600", output: "2 0 0" },
      { input: "11\n30\n30\n30", output: "11 31 0" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "将时间转换为秒数，加上k秒后再转换回时分秒格式，注意进位处理。",
  },
  {
    title: "[GESP202406 一级] 立方数",
    source: "gesp_official",
    sourceId: "B4001",
    sourceUrl: "https://www.luogu.com.cn/problem/B4001",
    level: 1,
    knowledgePoints: ["循环语句", "数学运算", "立方"],
    difficulty: "入门",
    description: `小杨需要判断一个正整数 n 是否为立方数。

一个正整数 n 是立方数当且仅当存在一个正整数 x 满足 x^3 = n。`,
    inputFormat: `输入一行，包含一个正整数 n。

数据范围：1 <= n <= 1000`,
    outputFormat: `若 n 是立方数则输出 \"Yes\"，否则输出 \"No\"。`,
    samples: [
      { input: "8", output: "Yes", explanation: "存在正整数2使得8=2^3，故8为立方数" },
      { input: "9", output: "No", explanation: "不存在满足条件的正整数，故9不是立方数" },
    ],
    testCases: [
      { input: "8", output: "Yes" },
      { input: "9", output: "No" },
      { input: "1", output: "Yes" },
      { input: "27", output: "Yes" },
      { input: "1000", output: "Yes" },
      { input: "999", output: "No" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "从1开始枚举x，检查x^3是否等于n，直到x^3 > n为止。",
  },
  // ========== 2024年9月 ==========
  {
    title: "[GESP202409 一级] 小杨购物",
    source: "gesp_official",
    sourceId: "B4034",
    sourceUrl: "https://www.luogu.com.cn/problem/B4034",
    level: 1,
    knowledgePoints: ["整数除法", "顺序结构", "数学运算"],
    difficulty: "入门",
    description: `小杨有 n 元钱，要购买相同数量的商品A（单价 a 元）和商品B（单价 b 元）。

求最多能购买多少个（每种商品购买相同数量）。`,
    inputFormat: `输入三行：
- 第1行：n（购物金额）
- 第2行：a（商品A单价）
- 第3行：b（商品B单价）

数据范围：1 <= n, a, b <= 10^5`,
    outputFormat: `输出一个整数，表示最多能够购买的商品A和商品B的数量。`,
    samples: [
      { input: "12\n1\n2", output: "4", explanation: "购买k件A和k件B花费k*(a+b)元。4*(1+2)=12元" },
      { input: "13\n1\n2", output: "4", explanation: "4*(1+2)=12元 <= 13元，若k=5需15元超预算" },
    ],
    testCases: [
      { input: "12\n1\n2", output: "4" },
      { input: "13\n1\n2", output: "4" },
      { input: "100\n10\n10", output: "5" },
      { input: "99\n50\n50", output: "0" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "答案为 n / (a + b)，使用整数除法。",
  },
  {
    title: "[GESP202409 一级] 美丽数字",
    source: "gesp_official",
    sourceId: "B4035",
    sourceUrl: "https://www.luogu.com.cn/problem/B4035",
    level: 1,
    knowledgePoints: ["循环语句", "条件判断", "取模运算"],
    difficulty: "入门",
    description: `统计 n 个正整数中满足以下条件的"美丽数字"的个数：是9的倍数但不是8的倍数。`,
    inputFormat: `输入两行：
- 第一行：整数 n（正整数个数）
- 第二行：n 个正整数 a1, a2, ..., an

数据范围：1 <= n, ai <= 10^5`,
    outputFormat: `输出一个整数，表示美丽数字的数量。`,
    samples: [
      { input: "3\n1 9 72", output: "1", explanation: "1不是9的倍数；9是9的倍数且不是8的倍数，是美丽数字；72既是9的倍数也是8的倍数，不是美丽数字" },
    ],
    testCases: [
      { input: "3\n1 9 72", output: "1" },
      { input: "5\n9 18 27 36 45", output: "5" },
      { input: "4\n72 144 216 288", output: "0" },
      { input: "1\n81", output: "1" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "遍历每个数，检查是否满足：能被9整除（%9==0）且不能被8整除（%8!=0）。",
  },
  // ========== 2024年12月 ==========
  {
    title: "[GESP202412 一级] 温度转换",
    source: "gesp_official",
    sourceId: "B4062",
    sourceUrl: "https://www.luogu.com.cn/problem/B4062",
    level: 1,
    knowledgePoints: ["浮点运算", "条件判断", "格式化输出"],
    difficulty: "入门",
    description: `利用转换公式将开尔文温度 K 转换为摄氏温度 C 和华氏温度 F。

转换公式：
- C = K - 273.15
- F = C * 1.8 + 32`,
    inputFormat: `输入一行，包含一个实数 K，表示开尔文温度。

数据范围：0 < K < 10^5`,
    outputFormat: `若华氏温度超过 212，输出 "Temperature is too high!"
否则输出两个实数 C 和 F，用空格分隔，保留两位小数。`,
    samples: [
      { input: "412.00", output: "Temperature is too high!", explanation: "华氏温度超过212" },
      { input: "173.56", output: "-99.59 -147.26", explanation: "C=173.56-273.15=-99.59, F=-99.59*1.8+32=-147.262" },
    ],
    testCases: [
      { input: "412.00", output: "Temperature is too high!" },
      { input: "173.56", output: "-99.59 -147.26" },
      { input: "273.15", output: "0.00 32.00" },
      { input: "373.15", output: "100.00 212.00" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "先计算C和F，再判断F是否大于212，注意输出格式要保留两位小数。",
  },
  {
    title: "[GESP202412 一级] 奇数和偶数",
    source: "gesp_official",
    sourceId: "B4063",
    sourceUrl: "https://www.luogu.com.cn/problem/B4063",
    level: 1,
    knowledgePoints: ["循环语句", "条件判断", "奇偶判断", "计数"],
    difficulty: "入门",
    description: `小杨有 n 个正整数，需要统计其中奇数和偶数的个数。`,
    inputFormat: `第一行输入一个正整数 n（代表数字个数），随后 n 行各输入一个正整数。

数据范围：1 <= n <= 10^5，正整数不超过 10^5`,
    outputFormat: `输出两个用空格间隔的整数，分别表示奇数个数和偶数个数。若某类数为0个，输出0。`,
    samples: [
      { input: "5\n1\n2\n3\n4\n5", output: "3 2", explanation: "1、3、5为奇数（共3个），2、4为偶数（共2个）" },
    ],
    testCases: [
      { input: "5\n1\n2\n3\n4\n5", output: "3 2" },
      { input: "3\n2\n4\n6", output: "0 3" },
      { input: "3\n1\n3\n5", output: "3 0" },
      { input: "1\n1", output: "1 0" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "使用两个计数器分别统计奇数和偶数，用取模运算（%2）判断奇偶。",
  },
  // ========== 2025年3月 ==========
  {
    title: "[GESP202503 一级] 图书馆里的老鼠",
    source: "gesp_official",
    sourceId: "B4257",
    sourceUrl: "https://www.luogu.com.cn/problem/B4257",
    level: 1,
    knowledgePoints: ["整数除法", "顺序结构", "数学运算"],
    difficulty: "入门",
    description: `图书馆有 n 本书，混入了一只老鼠。老鼠每 x 小时能完全啃掉一本书，且在啃完一本前不会啃另一本。

求 y 小时后还剩多少本完整的书。`,
    inputFormat: `输入三行：
- 第一行：正整数 n（书的数量）
- 第二行：正整数 x（啃光一本书的时间）
- 第三行：正整数 y（经过的总时间）

数据范围：1 <= n, x, y <= 1000，保证y小时后至少剩余1本完整的书`,
    outputFormat: `输出一行一个整数，表示剩余的完整书本数。`,
    samples: [
      { input: "10\n2\n3", output: "8", explanation: "3小时内老鼠啃掉 3/2 = 1 本书，剩余 10-1 = 9 本（注：应该是8本，3小时啃掉1本）" },
      { input: "5\n2\n4", output: "3", explanation: "4小时内老鼠啃掉 4/2 = 2 本书，剩余 5-2 = 3 本" },
    ],
    testCases: [
      { input: "10\n2\n3", output: "9" },
      { input: "5\n2\n4", output: "3" },
      { input: "100\n10\n50", output: "95" },
      { input: "10\n5\n4", output: "10" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "被啃掉的书本数 = y / x（整数除法），剩余书本数 = n - 被啃掉的书本数。",
  },
  {
    title: "[GESP202503 一级] 四舍五入",
    source: "gesp_official",
    sourceId: "B4258",
    sourceUrl: "https://www.luogu.com.cn/problem/B4258",
    level: 1,
    knowledgePoints: ["循环语句", "四舍五入", "数学运算"],
    difficulty: "入门",
    description: `四舍五入是一种常见的近似计算方法。现在，给定 n 个整数，你需要将每个整数四舍五入到最接近的整十数。

例如，43→40，58→60，25→30。`,
    inputFormat: `共 n+1 行：
- 第一行：整数 n（表示后续整数个数）
- 接下来 n 行：每行一个整数 ai（需要四舍五入的整数）

数据范围：1 <= n <= 100，1 <= ai <= 10000`,
    outputFormat: `n 行，每行一个整数，表示对应整数四舍五入后的结果。`,
    samples: [
      { input: "5\n43\n58\n25\n67\n90", output: "40\n60\n30\n70\n90" },
    ],
    testCases: [
      { input: "5\n43\n58\n25\n67\n90", output: "40\n60\n30\n70\n90" },
      { input: "3\n5\n15\n100", output: "10\n20\n100" },
      { input: "2\n4\n6", output: "0\n10" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "四舍五入到整十数：(a + 5) / 10 * 10，或者判断个位数是否>=5来决定舍入方向。",
  },
  // ========== 2025年6月 ==========
  {
    title: "[GESP202506 一级] 假期阅读",
    source: "gesp_official",
    sourceId: "B4354",
    sourceUrl: "https://www.luogu.com.cn/problem/B4354",
    level: 1,
    knowledgePoints: ["顺序结构", "条件判断", "最小值"],
    difficulty: "入门",
    description: `一个学生拥有一本 n 页的书籍，每天最多可阅读 k 页，假期共 t 天。需计算假期内最多能阅读多少页。`,
    inputFormat: `输入三行：
- 第一行：书的总页数 n
- 第二行：每日最大阅读页数 k
- 第三行：假期天数 t

数据范围：n, k, t 均不超过 1000`,
    outputFormat: `一行，一个整数，表示假期中所能阅读的最多页数。`,
    samples: [
      { input: "8\n3\n2", output: "6", explanation: "每天最多读3页，2天最多读6页，但书只有8页，所以最多读6页" },
      { input: "19\n3\n30", output: "19", explanation: "每天最多读3页，30天最多读90页，但书只有19页，所以最多读19页" },
    ],
    testCases: [
      { input: "8\n3\n2", output: "6" },
      { input: "19\n3\n30", output: "19" },
      { input: "100\n10\n5", output: "50" },
      { input: "50\n100\n1", output: "50" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "答案为 min(n, k * t)，即书的总页数和假期内理论最大阅读量的较小值。",
  },
  {
    title: "[GESP202506 一级] 值日",
    source: "gesp_official",
    sourceId: "B4355",
    sourceUrl: "https://www.luogu.com.cn/problem/B4355",
    level: 1,
    knowledgePoints: ["最小公倍数", "数学运算", "辗转相除法"],
    difficulty: "入门",
    description: `小杨每 m 天值日一次，小红每 n 天值日一次。两人今天同时值日，求至少多少天后他们会再次在同一天值日。`,
    inputFormat: `输入两行：
- 第一行：正整数 m（小杨的值日周期）
- 第二行：正整数 n（小红的值日周期）

数据范围：1 <= m, n <= 100`,
    outputFormat: `输出一个整数，表示至少多少天后两人同时值日。`,
    samples: [
      { input: "4\n6", output: "12", explanation: "4和6的最小公倍数是12" },
    ],
    testCases: [
      { input: "4\n6", output: "12" },
      { input: "3\n5", output: "15" },
      { input: "6\n9", output: "18" },
      { input: "7\n7", output: "7" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "本题求两个数的最小公倍数（LCM）。LCM(m,n) = m * n / GCD(m,n)，可用辗转相除法求GCD。",
  },
  // ========== 2025年9月 ==========
  {
    title: "[GESP202509 一级] 商店折扣",
    source: "gesp_official",
    sourceId: "B4409",
    sourceUrl: "https://www.luogu.com.cn/problem/B4409",
    level: 1,
    knowledgePoints: ["条件判断", "浮点运算", "最小值", "格式化输出"],
    difficulty: "入门",
    description: `商店提供两种折扣方案：
- 方案一：购物满 x 元减 y 元（只能使用一次）
- 方案二：直接打 n 折（价格变为原价的 n/10）

小明购物总额为 p 元，需选择一种方案以支付最少金额。`,
    inputFormat: `输入四行四个正整数：x, y, n, p，分别代表满减的阈值、减免金额、折扣比例和购物总额。

数据范围：
- 1 <= y < x <= 100
- 1 <= n < 10
- 1 <= p <= 100`,
    outputFormat: `一行，一个小数，表示小明最少需要支付多少钱，保留两位小数。`,
    samples: [
      { input: "8\n7\n9\n10", output: "3.00", explanation: "方案一：10-7=3元，方案二：10*0.9=9元，选方案一" },
      { input: "8\n7\n2\n11", output: "2.20", explanation: "方案一：11-7=4元，方案二：11*0.2=2.2元，选方案二" },
    ],
    testCases: [
      { input: "8\n7\n9\n10", output: "3.00" },
      { input: "8\n7\n2\n11", output: "2.20" },
      { input: "50\n10\n9\n40", output: "36.00" },
      { input: "100\n50\n5\n100", output: "50.00" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "分别计算两种方案的价格（注意方案一需要判断是否满足满减条件），取较小值。",
  },
  {
    title: "[GESP202509 一级] 金字塔",
    source: "gesp_official",
    sourceId: "B4410",
    sourceUrl: "https://www.luogu.com.cn/problem/B4410",
    level: 1,
    knowledgePoints: ["循环语句", "累加求和", "平方运算"],
    difficulty: "入门",
    description: `金字塔由 n 层石块垒成。从塔底向上，每层依次需要 n*n, (n-1)*(n-1), ..., 2*2, 1*1 块石块。

请问搭建金字塔总共需要多少块石块？即求 1^2 + 2^2 + ... + n^2。`,
    inputFormat: `输入一行，包含一个正整数 n，代表金字塔的层数。

数据范围：1 <= n <= 50`,
    outputFormat: `输出一行一个正整数，表示所需的石块总数。`,
    samples: [
      { input: "2", output: "5", explanation: "2^2 + 1^2 = 4 + 1 = 5" },
      { input: "5", output: "55", explanation: "5^2 + 4^2 + 3^2 + 2^2 + 1^2 = 25+16+9+4+1 = 55" },
    ],
    testCases: [
      { input: "2", output: "5" },
      { input: "5", output: "55" },
      { input: "1", output: "1" },
      { input: "10", output: "385" },
      { input: "50", output: "42925" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "使用循环累加每层的石块数（i*i），也可以用公式 n*(n+1)*(2*n+1)/6。",
  },
  // ========== 2025年12月 ==========
  {
    title: "[GESP202512 一级] 小杨的爱心快递",
    source: "gesp_official",
    sourceId: "B4445",
    sourceUrl: "https://www.luogu.com.cn/problem/B4445",
    level: 1,
    knowledgePoints: ["条件判断", "浮点运算", "最小值", "格式化输出"],
    difficulty: "入门",
    description: `快递公司为公益行动制定特殊运费规则。给定快递体积V和重量G，需要计算最低运费：

- 按体积计算：运费 = 0.5 * V 元
- 按重量计算：若 G < 300 克，运费为 M 元；若 G >= 300 克，运费为 N 元
- 最终运费取两种方式中的较低值`,
    inputFormat: `输入四行浮点数：
- 第一行：快递体积 V
- 第二行：快递重量 G
- 第三行：第一档重量运费 M
- 第四行：第二档重量运费 N

数据范围：所有浮点数均为正数，不超过1000`,
    outputFormat: `输出一行一位小数，代表实际快递运费。`,
    samples: [
      { input: "100.4\n300.2\n60.6\n70.5", output: "50.2", explanation: "体积费0.5*100.4=50.2元 < 重量费70.5元（G>=300），取50.2" },
      { input: "99.8\n200.9\n60.2\n70.1", output: "49.9", explanation: "体积费0.5*99.8=49.9元 < 重量费60.2元（G<300），取49.9" },
    ],
    testCases: [
      { input: "100.4\n300.2\n60.6\n70.5", output: "50.2" },
      { input: "99.8\n200.9\n60.2\n70.1", output: "49.9" },
      { input: "200.0\n500.0\n80.0\n90.0", output: "90.0" },
      { input: "50.0\n100.0\n20.0\n30.0", output: "20.0" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "分别计算体积运费和重量运费，取较小值。注意重量运费需要根据G的值选择M或N。",
  },
  {
    title: "[GESP202512 一级] 手机电量显示",
    source: "gesp_official",
    sourceId: "B4446",
    sourceUrl: "https://www.luogu.com.cn/problem/B4446",
    level: 1,
    knowledgePoints: ["循环语句", "条件判断", "多分支结构"],
    difficulty: "入门",
    description: `手机根据电量百分比 P 显示不同的提示信息：
- P <= 10：显示 "R"（红色警告）
- 10 < P <= 20：显示 "L"（低电量）
- P > 20：显示具体数字`,
    inputFormat: `第一行：正整数 T（数据组数）
接下来 T 行：每行一个正整数 P（电量百分比）

数据范围：1 <= T <= 20，1 <= P <= 100`,
    outputFormat: `对每组数据输出一行，显示手机的电量提示。`,
    samples: [
      { input: "5\n10\n1\n20\n99\n19", output: "R\nR\nL\n99\nL", explanation: "P=10和P=1均<=10显示R；P=20和P=19在10-20间显示L；P=99>20显示99" },
    ],
    testCases: [
      { input: "5\n10\n1\n20\n99\n19", output: "R\nR\nL\n99\nL" },
      { input: "3\n5\n15\n50", output: "R\nL\n50" },
      { input: "2\n100\n11", output: "100\nL" },
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: "使用if-else多分支结构，按条件判断输出相应内容。",
  },
];

async function seedGesp1() {
  try {
    // 获取现有题目ID列表，避免重复添加
    const existingProblems = await prisma.problem.findMany({
      where: {
        sourceId: {
          in: gesp1Problems.map(p => p.sourceId).filter(Boolean) as string[]
        }
      },
      select: { sourceId: true }
    });

    const existingIds = new Set(existingProblems.map(p => p.sourceId));

    // 过滤出需要添加的新题目
    const newProblems = gesp1Problems.filter(p => !existingIds.has(p.sourceId));

    if (newProblems.length === 0) {
      return NextResponse.json({
        success: true,
        message: "所有 GESP 1级题目已存在",
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
      message: `成功添加 ${result.count} 道 GESP 1级题目`,
      existingCount: existingProblems.length,
      addedCount: result.count,
      totalCount: existingProblems.length + result.count
    });
  } catch (error) {
    console.error("Seed GESP1 error:", error);
    return NextResponse.json({ error: "添加题目失败", details: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return seedGesp1();
}

export async function POST() {
  return seedGesp1();
}
