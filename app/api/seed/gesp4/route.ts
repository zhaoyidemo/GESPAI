import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GESP 4级完整题库 - 来源：洛谷 CCF GESP C++ 四级上机题
// 共24道题目，内容100%来自洛谷原文
// 难度标签采用洛谷评级：
// - "入门" = 洛谷难度1
// - "普及-" = 洛谷难度2
// - "普及/提高-" = 洛谷难度3
// - "普及+/提高" = 洛谷难度4
// - "提高+/省选-" = 洛谷难度5及以上

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
    description: `如果一个两位数是素数，且它的数字位置经过对换后仍为素数，则称为绝对素数，例如 $13$。给定两个正整数 $A, B$，请求出大于等于 $A$、小于等于 $B$ 的所有绝对素数。`,
    inputFormat: `输入 $1$ 行，包含两个正整数 $A$ 和 $B$。保证 $10<A<B<100$。`,
    outputFormat: `若干行，每行一个绝对素数，从小到大输出。`,
    samples: [
      { input: "11 20", output: "11\n13\n17" }
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
    description: `在一个 $N\\times N$ 的正方形网格中，每个格子分别填上从 1 到 $N×N$ 的正整数，使得正方形中任一行、任一列及对角线的几个数之和都相等，则这种正方形图案就称为“幻方”（输出样例中展示了一个 $3×3$ 的幻方）。我国古代称为“河图”、“洛书”，又叫“纵横图”。

幻方看似神奇，但当 $N$ 为奇数时有很方便的填法：
1. 一开始正方形中没有填任何数字。首先，在第一行的正中央填上 $1$。
2. 从上次填数字的位置向上移动一格，如果已经在第一行，则移到同一列的最后一行；再向右移动一格，如果已经在最右一列，则移动至同一行的第一列。如果移动后的位置没有填数字，则把上次填写的数字的下一个数字填到这个位置。
3. 如果第 2 步填写失败，则从上次填数字的位置向下移动一格，如果已经在最下一行，则移到同一列的第一行。这个位置一定是空的（这可太神奇了！）。把上次填写的数字的下一个数字填到这个位置。
4. 重复 2、3 步骤，直到所有格子都被填满，幻方就完成了！

快来编写一个程序，按上述规则，制作一个 $N\\times N$ 的幻方吧。`,
    inputFormat: `输入为一个正奇数 $N$，保证 $3 \\leq N \\leq 21$。`,
    outputFormat: `输出 $N$ 行，每行 $N$ 个空格分隔的正整数，内容为 $N×N$ 的幻方。`,
    samples: [
      { input: "3", output: "8 1 6\n3 5 7\n4 9 2" }
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
    description: `小明发明了一种 “幸运数”。一个正整数，其偶数位不变（个位为第 $1$ 位，十位为第 $2$ 位，以此类推），奇数位做如下变换：将数字乘以 $7$，如果不大于 $9$ 则作为变换结果，否则把结果的各位数相加，如果结果不大于 $9$ 则作为变换结果，否则（结果仍大于 $9$）继续把各位数相加，直到结果不大于 $9$，作为变换结果。变换结束后，把变换结果的各位数相加，如果得到的和是 $8$ 的倍数，则称一开始的正整数为幸运数。

例如，$16347$：第 $1$ 位为 $7$，乘以 $7$ 结果为 $49$，大于 $9$，各位数相加为 $13$，仍大于 $9$，继续各位数相加，最后结果为 $4$；第 $3$ 位为 $3$，变换结果为 $3$；第 $5$ 位为 $1$，变换结果为 $7$。最后变化结果为 $76344$，对于结果 $76344$ 其各位数之和为 $24$，是 $8$ 的倍数。因此 $16347$ 是幸运数。`,
    inputFormat: `输入第一行为正整数 $N$，表示有 $N$ 个待判断的正整数。约定 $1 \\le N \\le 20$。

从第 $2$ 行开始的 $N$ 行，每行一个正整数，为待判断的正整数。约定这些正整数小于 $10^{12}$。`,
    outputFormat: `输出 $N$ 行，对应 $N$ 个正整数是否为幸运数，如是则输出 \`T\`，否则输出 \`F\`。

提示：不需要等到所有输入结束再依次输出，可以输入一个数就判断一个数并输出，再输入下一个数。`,
    samples: [
      { input: "2\n16347\n76344", output: "T\nF" }
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: ``,
  },

  {
    title: "[GESP202306 四级] 图像压缩",
    source: "gesp_official",
    sourceId: "B3851",
    sourceUrl: "https://www.luogu.com.cn/problem/B3851",
    level: 4,
    knowledgePoints: ["模拟", "排序", "哈希", "字符串处理"],
    difficulty: "普及/提高-", // 洛谷难度3
    description: `图像是由很多的像素点组成的。如果用 $0$ 表示黑，$255$ 表示白，$0$ 和 $255$ 之间的值代表不同程度的灰色，则可以用一个字节表达一个像素（取值范围为十进制 \`0-255\`、十六进制 \`00-FF\`）。这样的像素组成的图像，称为 $256$ 级灰阶的灰度图像。

现在希望将 $256$ 级灰阶的灰度图像压缩为 $16$ 级灰阶，即每个像素的取值范围为十进制 \`0-15\`、十六进制 \`0-F\`。压缩规则为：统计出每种灰阶的数量，取数量最多的前 $16$ 种灰阶（如某种灰阶的数量与另外一种灰阶的数量相同，则以灰阶值从小到大为序），分别编号 \`0-F\`（最多的编号为 \`0\`，以此类推）。其他灰阶转换到最近的 $16$ 种灰阶之一，将某个点的灰阶值（灰度，而非次数）与 $16$ 种灰阶中的一种相减，绝对值最小即为最近，如果绝对值相等，则编号较小的灰阶更近。`,
    inputFormat: `输入第 $1$ 行为一个正整数 $n(10\\le n \\le 20)$，表示接下来有 $n$ 行数据组成一副 $256$ 级灰阶的灰度图像。

第 $2$ 行开始的 $n$ 行，每行为长度相等且为偶数的字符串，每两个字符用十六进制表示一个像素。约定输入的灰度图像至少有 $16$ 种灰阶。约定每行最多 $20$ 个像素。`,
    outputFormat: `第一行输出压缩选定的 $16$ 种灰阶的十六进制编码，共计 $32$ 个字符。

第二行开始的 $n$ 行，输出压缩后的图像，每个像素一位十六进制数表示压缩后的灰阶值。`,
    samples: [
      { input: "10\n00FFCFAB00FFAC09071B5CCFAB76\n00AFCBAB11FFAB09981D34CFAF56\n01BFCEAB00FFAC0907F25FCFBA65\n10FBCBAB11FFAB09981DF4CFCA67\n00FFCBFB00FFAC0907A25CCFFC76\n00FFCBAB1CFFCB09FC1AC4CFCF67\n01FCCBAB00FFAC0F071A54CFBA65\n10EFCBAB11FFAB09981B34CFCF67\n01FFCBAB00FFAC0F071054CFAC76\n1000CBAB11FFAB0A981B84CFCF66", output: "ABCFFF00CB09AC07101198011B6776FC\n321032657CD10E\n36409205ACC16D\nB41032657FD16D\n8F409205ACF14D\n324F326570D1FE\n3240C245FC411D\nBF4032687CD16D\n8F409205ACC11D\nB240326878D16E\n83409205ACE11D" }
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `【样例 $1$ 解释】

灰阶 \`AB\`、\`CF\` 和 \`FF\` 出现 $14$ 次，\`00\` 出现 $10$ 次，\`CB\` 出现
$9$ 次，\`09\` 出现 $7$ 次，\`AC\` 出现 $6$ 次，\`07\` 出现 $5$ 次，\`10\`、\`11\`
和 \`98\` 出现 $4$ 次，\`01\`、\`1B\`、\`67\`、\`76\` 和 \`FC\` 出现 $3$ 次。`,
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
    description: `$N$ 进制数指的是逢 $N$ 进一的计数制。例如，人们日常生活中大多使用十进制计数，而计算机底层则一般使用二进制。除此之外，八进制和十六进制在一些场合也是常用的计数制（十六进制中，一般使用字母 A 至 F 表示十至十五；本题中，十一进制到十五进制也是类似的）。

在本题中，我们将给出 $N$ 个不同进制的数。你需要分别把它们转换成十进制数。`,
    inputFormat: `输入的第一行为一个十进制表示的整数 $N$。接下来 $N$ 行，每行一个整数 $K$，随后是一个空格，紧接着是一个 $K$ 进制数，表示需要转换的数。保证所有 $K$ 进制数均由数字和大写字母组成，且不以 $0$ 开头。保证 $K$ 进制数合法。

保证 $N \\le 1000$；保证 $2 \\le K \\le 16$。

保证所有 $K$ 进制数的位数不超过 $9$。`,
    outputFormat: `输出 $N$ 行，每一个十进制数，表示对应 $K$ 进制数的十进制数值。`,
    samples: [
      { input: "2\n8 1362\n16 3F0", output: "754\n1008" },
      { input: "2\n2 11011\n10 123456789", output: "27\n123456789" }
    ],
    timeLimit: 1000,
    memoryLimit: 128,
    hint: `对于任意一个 $L$ 位 $K$ 进制数，假设其最右边的数位为第 $0$ 位，最左边的数位为第 $L-1$ 位，我们只需要将其第 $i$ 位的数码乘以权值 $K^i$，再将每位的结果相加，即可得到原 $K$ 进制数对应的十进制数。下面是两个例子：

1. 八进制数 \`1362\` 对应的十进制数为：$1×8^3+3×8^2+6×8^1+2×8^0=754$；

2. 十六进制数 \`3F0\` 对应的十进制数为：$3×16^2+15×16^1+0×16^0=1008$。`,
  },

  {
    title: "[GESP202309 四级] 变长编码",
    source: "gesp_official",
    sourceId: "B3870",
    sourceUrl: "https://www.luogu.com.cn/problem/B3870",
    level: 4,
    knowledgePoints: ["进制转换", "位运算", "编码"],
    difficulty: "普及-", // 洛谷难度2
    description: `小明刚刚学习了三种整数编码方式：原码、反码、补码，并了解到计算机存储整数通常使用补码。但他总是觉得，生活中很少用到 $2^{31}-1$ 这么大的数，生活中常用的 $0\\sim 100$ 这种数也同样需要用 $4$ 个字节的补码表示，太浪费了些。
热爱学习的小明通过搜索，发现了一种正整数的变长编码方式。这种编码方式的规则如下：

1. 对于给定的正整数，首先将其表达为二进制形式。例如，$(0)_{\\{10\\}}=(0)_{\\{2\\}}$，$(926)_{\\{10\\}}=(1110011110)_{\\{2\\}}$。

2. 将二进制数从低位到高位切分成每组 $7$ bit，不足 $7$bit 的在高位用 $0$ 填补。例如，$(0)_{\\{2\\}}$ 变为$0000000$ 的一组，$(1110011110)_{\\{2\\}}$ 变为 $0011110$ 和 $0000111$ 的两组。

3. 由代表低位的组开始，为其加入最高位。如果这组是最后一组，则在最高位填上 $0$，否则在最高位填上 $1$。于是，$0$ 的变长编码为 $00000000$ 一个字节， $926$ 的变长编码为 $10011110$ 和 $00000111$ 两个字节。

这种编码方式可以用更少的字节表达比较小的数，也可以用很多的字节表达非常大的数。例如，$987654321012345678$ 的二进制为 $(0001101 \\ 1011010 \\ 0110110 \\ 1001011 \\ 1110100 \\ 0100110 \\ 1001000 \\ 0010110 \\ 1001110)_{\\{2\\}}$，于是它的变长编码为（十六进制表示） \`CE 96 C8 A6 F4 CB B6 DA 0D\`，共 $9$ 个字节。

你能通过编写程序，找到一个正整数的变长编码吗？`,
    inputFormat: `输入第一行，包含一个正整数 $N$。约定 $0\\le N \\le 10^{18}$。`,
    outputFormat: `输出一行，输出 $N$ 对应的变长编码的每个字节，每个字节均以 $2$ 位十六进制表示（其中， \`A-F\` 使用大写字母表示），两个字节间以空格分隔。`,
    samples: [
      { input: "0", output: "00" },
      { input: "926", output: "9E 07" },
      { input: "987654321012345678", output: "CE 96 C8 A6 F4 CB B6 DA 0D" }
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
    description: `在遥远的星球，有两个国家 A 国和 B 国，他们使用着不同的语言：A 语言和 B 语言。小杨是 B 国的翻译官，他的工作是将 A 语言的文章翻译成 B 语言的文章。

为了顺利完成工作，小杨制作了一本字典，里面记录了 $N$ 个 A 语言单词对应的 B 语言单词，巧合的是，这些单词都由地球上的 26 个小写英文字母组成。

小杨希望你写一个程序，帮助他根据这本字典翻译一段 A 语言文章。这段文章由标点符号 \`!()-[]{}\\|;:'",./?<>\` 和一些 A 语言单词构成，每个单词之间必定由至少一个标点符号分割，你的程序需要把这段话中的所有 A 语言单词替换成它的 B 语言翻译。特别地，如果遇到不在字典中的单词，请使用大写 UNK 来替换它。

例如，小杨的字典中包含 $2$ 个 A 语言单词 \`abc\` 和 \`d\`，它们的 B 语言翻译分别为 \`a\` 和 \`def\`，那么我们可以把 A 语言文章 \`abc.d.d.abc.abcd.\` 翻译成 B 语言文章 \`a.def.def.a.UNK.\` 其中，单词 \`abcd\` 不在词典内，因此我们需要使用 UNK 来替换它。`,
    inputFormat: `第一行一个整数 $N$，表示词典中的条目数。保证  $N \\le 100$。

接下来  $N$ 行，每行两个用单个空格隔开的字符串  $A$， $B$ ,分别表示字典中的一个 A 语言单词以及它对应的 B 语言翻译。保证所有 $A$ 不重复；保证 $A$ 和 $B$ 的长度不超过 $10$。

最后一行一个字符串 $S$ ，表示需要翻译的 A 语言文章。保证字符串 $S$ 的长度不超过 $1000$，保证字符串 $S$ 只包含小写字母以及标点符号 \`!()-[]{}\\|;:'",./?<>\` 。`,
    outputFormat: `输出一行，表示翻译后的结果。`,
    samples: [
      { input: "2\nabc a\nd def\nabc.d.d.abc.abcd", output: "a.def.def.a.UNK" },
      { input: "3\nabc a\nd def\nabcd xxxx\nabc,(d)d!-abc?abcd", output: "a,(def)def!-a?xxxx" },
      { input: "1\nabcdefghij klmnopqrst\n!()-[]{}\\|;:'\",./?<>abcdefghijklmnopqrstuvwxyz", output: "!()-[]{}\\|;:'\",./?<>UNK" }
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
    description: `你要和田忌赛马。你们各自有 $N$ 匹马，并且要进行 $N$ 轮比赛，每轮比赛，你们都要各派出一匹马决出胜负。

你的马匹的速度分别为 $u_1,u_2,\\cdots，u_n$，田忌的马匹的速度分别为 $v_1,v_2,\\cdots,v_n$。田忌会按顺序派出他的马匹，请问你要如何排兵布阵，才能赢得最多轮次的比赛？巧合的是，你和田忌的所有马匹的速度两两不同，因此不可能出现平局。`,
    inputFormat: `第一行一个整数 $N$。保证 $1\\le N \\le 5\\times 10^4$

接下来一行 $N$ 个用空格隔开的整数，依次为 $u_1,u_2,\\cdots,u_n$，表示你的马匹们的速度。保证 $1\\le u_i\\le 2N$。

接下来一行 $N$ 个用空格隔开的整数，依次为 $v_1,v_2,\\cdots,v_n$，表示田忌的马匹们的速度。保证 $1\\le v_i\\le 2N$。`,
    outputFormat: `输出一行，表示你最多能获胜几轮。`,
    samples: [
      { input: "3\n1 3 5\n2 4 6", output: "2" },
      { input: "5\n10 3 5 8 7\n4 6 1 2 9", output: "5" }
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `**样例解释 1**

第 1 轮，田忌派出速度为 2 的马匹，你可以派出速度为 3 的马匹迎战，本轮你获胜。

第 2 轮，田忌派出速度为 4 的马匹，你可以派出速度为 5 的马匹迎战，本轮你获胜。

第 3 轮，田忌派出速度为 6 的马匹，你可以派出速度为 1 的马匹迎战，本轮田忌获胜。

如此，你可以赢得 2 轮比赛。
`,
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
    description: `
对于两个字符串 $A$ 和 $B$，如果 $A$ 可以通过删除一个字符，**或**插入一个字符，**或**修改一个字符变成 $B$，那么我们说 $A$ 和 $B$ 是相似的。

比如 $\\texttt{apple}$ 可以通过插入一个字符变成 $\\texttt{applee}$，可以通过删除一个字符变成 $\\texttt{appe}$，也可以通过修改一个字符变成 $\\texttt{bpple}$。因此 $\\texttt{apple}$ 和 $\\texttt{applee}$、$\\texttt{appe}$、$\\texttt{bpple}$ 都是相似的。但 $\\texttt{applee}$ 并不能 通过任意一个操作变成 $\\texttt{bpple}$，因此它们并不相似。

特别地，两个完全相同的字符串也是相似的。

给定 $T$ 组 $A,B$，请你分别判断它们是否相似。`,
    inputFormat: `第一行一个正整数 $T$。  
接下来 $T$ 行，每行两个用空格隔开的字符串 $A$ 和 $B$。  `,
    outputFormat: `对组 $A,B$，如果他们相似，输出 \`\`similar\`\`，否则输出 \`\`not similar\`\`。`,
    samples: [
      { input: "5\napple applee\napple appe\napple bpple\napplee bpple\napple apple", output: "similar\nsimilar\nsimilar\nnot similar\nsimilar" }
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对全部的测试数据，保证 $1 \\leq T \\leq 100$，$A$ 和 $B$ 的长度不超过 $50$，仅含小写字母。`,
  },

  {
    title: "[GESP202403 四级] 做题",
    source: "gesp_official",
    sourceId: "B3959",
    sourceUrl: "https://www.luogu.com.cn/problem/B3959",
    level: 4,
    knowledgePoints: ["贪心算法", "排序"],
    difficulty: "普及-", // 洛谷难度2
    description: `小杨同学为了提高自己的实力制定了做题计划，在第 $k$ 天时，他必须要完成 $k$ 道题，否则他就会偷懒。

小杨同学现在找到了一个题库，一共有 $n$ 套题单，每一套题单中有一定数量的题目。但是他十分挑剔，每套题单他只会使用一次，每一天也只能使用一套题单里的题目，之后那套题单就会弃之不用。对于每套题单，他不必完成题单内所有的题。

那么问题来了，小杨同学最多做题几天才偷懒呢？`,
    inputFormat: `第一行，一个整数为 $n$，表示有多少套题单。  
第二行 $n$ 个整数 $a_1, a_2, \\dots a_n$，分别表示每套题单有多少道题。`,
    outputFormat: `输出一行一个整数表示答案。`,
    samples: [
      { input: "4\n3 1 4 1\n", output: "3" }
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `### 数据规模与约定
对全部的测试数据，保证 $1 \\leq n \\leq 10^6$，$1 \\leq a_i \\leq 10^9$。`,
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
    description: `小杨有一个 $n$ 行 $m$ 列的网格图，其中每个格子要么是白色，要么是黑色。对于网格图中的一个子矩形，小杨认为它是平衡的当且仅当其中黑色格子与白色格子数量相同。小杨想知道最大的平衡子矩形包含了多少个格子。`,
    inputFormat: `第一行包含两个正整数 $n,m$，含义如题面所示。

之后 $n$ 行，每行一个长度为 $m$ 的 $01$ 串，代表网格图第 $i$ 行格子的颜色，如果为 $0$，则对应格子为白色，否则为黑色。`,
    outputFormat: `输出一个整数，代表最大的平衡子矩形包含格子的数量，如果不存在则输出 $0$。`,
    samples: [
      { input: "4 5\n00000\n01111\n00011\n00011", output: "16" }
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `**【样例解释】**

对于样例 $1$，假设 $(i,j)$ 代表第 $i$ 行第 $j$ 列，最大的平衡子矩形的四个顶点分别为 $(1,2),(1,5),(4,2),(4,5)$。

**【数据范围】**

对于全部数据，保证有 $1\\leq n,m\\leq 10$。`,
  },

  {
    title: "[GESP202406 四级] 宝箱",
    source: "gesp_official",
    sourceId: "B4006",
    sourceUrl: "https://www.luogu.com.cn/problem/B4006",
    level: 4,
    knowledgePoints: ["贪心算法", "排序", "滑动窗口"],
    difficulty: "普及-", // 洛谷难度2
    description: `小杨发现了 $n$ 个宝箱，其中第 $i$ 个宝箱的价值是 $a_i$。

小杨可以选择一些宝箱放入背包并带走，但是小杨的背包比较特殊，假设小杨选择的宝箱中最大价值为 $x$，最小价值为 $y$，小杨需要保证 $x-y\\leq k$，否则小杨的背包会损坏。

小杨想知道背包不损坏的情况下，自己能够带走宝箱的总价值最大是多少。`,
    inputFormat: `第一行包含两个正整数 $n,k$，含义如题面所示。

第二行包含 $n$ 个正整数 $a_1,a_2,\\dots,a_n$，代表宝箱的价值。`,
    outputFormat: `输出一个整数，代表带走宝箱的最大总价值。`,
    samples: [
      { input: "5 1\n1 2 3 1 2", output: "7" }
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `**【样例解释】**

在背包不损坏的情况下，小杨可以拿走两个价值为 $2$ 的宝箱和一个价值为 $3$ 的宝箱。

**【数据范围】**

对于全部数据，保证有 $1\\leq n\\leq 1000$，$0\\leq k\\leq 1000$，$1\\leq a_i\\leq 1000$。`,
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
    description: `小杨有一个 $n$ 行 $m$ 列的网格图，其中每个格子要么是白色，要么是黑色。
小杨想知道网格图中是否存在一个满足如下条件的子矩形：
- 子矩形由 $4$ 行 $4$ 列组成；
- 子矩形的第 $1$ 行和第 $4$ 行只包含白色格子；
- 对于子矩形的第 $2$ 行和第 $3$ 行，只有第 $1$ 个和第 $4$ 个格子是白色的，其余格子都是黑色的；

请你编写程序帮助小杨判断。`,
    inputFormat: `第一行包含一个正整数 $t$，代表测试用例组数。  
接下来是 $t$ 组测试用例。对于每组测试用例，一共 $n+1$ 行。  
第一行包含两个正整数 $n,m$，含义如题面所示。  
之后 $n$ 行，每行一个长度为 $m$ 的 $01$ 串，代表网格图第 $i$ 行格子的颜色，如果为 $0$，则对应格子为白色，否则为黑色。`,
    outputFormat: `对于每组测试用例，如果存在，输出 Yes，否则输出 No。`,
    samples: [
      { input: "3\n1 4\n0110\n5 5\n00000\n01100\n01100\n00001\n01100\n5 5\n00000\n01100\n01110\n00001\n01100", output: "No\nYes\nNo" }
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `### 样例 1 解释

\`\`\`plain
0000
0110
0110
0000
\`\`\`

### 数据规模与约定

对全部的测试数据，保证 $1 \\leq t\\leq 10$，$1 \\leq n,m \\leq 100$。`,
  },

  {
    title: "[GESP202409 四级] 区间排序",
    source: "gesp_official",
    sourceId: "B4041",
    sourceUrl: "https://www.luogu.com.cn/problem/B4041",
    level: 4,
    knowledgePoints: ["排序", "数组", "模拟"],
    difficulty: "普及-", // 洛谷难度2
    description: `小杨有一个包含 $n$ 个正整数的序列 $a$。

小杨计划对序列进行多次升序排序，每次升序排序小杨会选择一个区间 $[l,r]$（$l \\leq r$）并对区间内所有数字，即进行升序 $a_l, a_{l + 1}, \\dots a_r$ 排序。每次升序排序会在上一次升序排序的结果上进行。

小杨想请你计算出多次升序排序后的序列。`,
    inputFormat: `第一行包含一个正整数 $n$，含义如题面所示。   
第二行包含 $n$ 个正整数 $a_1, a_2, \\dots a_n$，代表序列 $a$。  
第三行包含一个正整数 $q$，代表排序次数。  
之后 $q$ 行，每行包含两个正整数 $l, r$，代表将区间 $[l_i, r_i]$ 内所有数字进行升序排序。`,
    outputFormat: `输出一行包含 $n$ 个正整数，代表多次升序排序后的序列。`,
    samples: [
      { input: "5\n3 4 5 2 1\n3\n4 5\n3 4\n1 3\n", output: "1 3 4 5 2" }
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `### 样例 1 解释

- 第一次升序排序后，序列为 $[3,4,5,1,2]$；
- 第二次升序排序后，序列为 $[3,4,1,5,2]$；
- 第三次升序排序后，序列为 $[1,3,4,5,2]$；

### 数据规模与约定

对于全部的测试数据，保证 $1 \\leq n, a_i, q \\leq 100$，$1 \\leq l_i \\leq r_i \\leq n$。`,
  },

  // ========== 2024年12月 ==========
  {
    title: "[GESP202412 四级] Recamán",
    source: "gesp_official",
    sourceId: "B4068",
    sourceUrl: "https://www.luogu.com.cn/problem/B4068",
    level: 4,
    knowledgePoints: ["递推", "集合", "STL容器"],
    difficulty: "普及-", // 洛谷难度2
    description: `小杨最近发现了有趣的 Recamán 数列，这个数列是这样生成的：

- 数列的第一项 $a_1$ 是 $1$；
- 如果 $a_{k-1}-k$ 是正整数并且没有在数列中出现过，那么数列的第 $k$ 项 $a_k$ 为 $a_{k-1}-k$，否则为 $a_{k-1}+k$。

小杨想知道 Recamán 数列的前 $n$ 项从小到大排序后的结果。手动计算非常困难，小杨希望你能帮他解决这个问题。`,
    inputFormat: `第一行，一个正整数 $n$。`,
    outputFormat: `一行，$n$ 个空格分隔的整数，表示 Recamán 数列的前 $n$ 项从小到大排序后的结果。`,
    samples: [
      { input: "5", output: "1 2 3 6 7" },
      { input: "8", output: "1 2 3 6 7 12 13 20" }
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `#### 样例解释

对于样例 1，$n=5$：
- $a_1=1$；
- $a_1-2=-1$，不是正整数，因此 $a_2=a_1+2=3$；
- $a_2-3=0$，不是正整数，因此 $a_3=a_2+3=6$；
- $a_3-4=2$，是正整数，且没有在数列中出现过，因此  $a_4=a_3-4=2$；
- $a_4-5=-3$，不是正整数，因此 $a_5=a_4+5=7$。

$a_1,a_2,a_3,a_4,a_5$ 从小到大排序的结果为 $1,2,3,6,7$。

#### 数据范围

对于所有数据点，保证 $1\\le n\\le 3\\, 000$。`,
  },

  {
    title: "[GESP202412 四级] 字符排序",
    source: "gesp_official",
    sourceId: "B4069",
    sourceUrl: "https://www.luogu.com.cn/problem/B4069",
    level: 4,
    knowledgePoints: ["字符串", "排序", "贪心"],
    difficulty: "普及-", // 洛谷难度2
    description: `小杨有 $n$ 个仅包含小写字母的字符串 $s_1,s_2,\\ldots,s_n$，小杨想将这些字符串按一定顺序排列后拼接到一起构成字符串 $t$。小杨希望最后构成的字符串 $t$ 满足：

- 假设 $t_i$ 为字符串 $t$ 的第 $i$ 个字符，对于所有的 $j\\lt i$ 均有 $t_j\\le t_i$。两个字符的大小关系与其在字母表中的顺序一致，例如 $\\texttt{e}\\lt \\texttt{g}\\lt \\texttt{p} \\lt \\texttt{s}$。

小杨想知道是否存在满足条件的字符串排列顺序。`,
    inputFormat: `第一行包含一个正整数 $T$，代表测试数据组数。

对于每组测试数据，第一行包含一个正整数 $n$，含义如题面所示。

之后 $n$ 行，每行包含一个字符串 $s_i$。`,
    outputFormat: `对于每组测试数据，如果存在满足条件的排列顺序，输出（一行一个）$\\texttt{1}$，否则输出（一行一个） $\\texttt{0}$。`,
    samples: [
      { input: "3\n3\naa\nac\nde\n2\naac\nbc\n1\ngesp", output: "1\n0\n0" }
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `#### 样例解释

对于第一组测试数据，一种可行的排列顺序为 $\\texttt{aa}+\\texttt{ac}+\\texttt{de}$，构成的字符串 $t$ 为 $\\texttt{aaacde}$，满足条件。

对于全部数据，保证有 $1\\le T,n\\le 100$，每个字符串的长度不超过 $10$。`,
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
    description: `小杨有一大片荒地，可以表示为一个 $n$ 行 $m$ 列的网格图。

小杨想要开垦这块荒地，但荒地中一些位置存在杂物，对于一块不存在杂物的荒地，该荒地可以开垦当且仅当其上下左右四个方向相邻的格子均不存在杂物。

小杨可以选择至多一个位置，清除该位置的杂物，移除杂物后该位置变为荒地。小杨想知道在清除至多一个位置的杂物的情况下，最多能够开垦多少块荒地。`,
    inputFormat: `第一行包含两个正整数 $n, m$，含义如题面所示。

之后 $n$ 行，每行包含一个长度为 $m$ 且仅包含字符 \`.\` 和 \`#\` 的字符串。如果为 \`.\`，代表该位置为荒地；如果为 \`#\`，代表该位置为杂物。`,
    outputFormat: `输出一个整数，代表在清除至多一个位置的杂物的情况下，最多能够开垦的荒地块数。`,
    samples: [
      { input: "3 5\n.....\n.#..#\n.....", output: "11" }
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `### 样例解释

移除第二行从左数第二块空地的杂物后：

\`\`\`
.....
....#
.....
\`\`\`

第一行从左数前 $4$ 块荒地，第二行从左数前 $3$ 块荒地，第三行从左数前 $4$ 块荒地，均可开垦，$4+3+4=11$。

### 数据范围

对于全部数据，有 $1\\leq n,m\\leq 1000$。`,
  },

  {
    title: "[GESP202503 四级] 二阶矩阵",
    source: "gesp_official",
    sourceId: "B4264",
    sourceUrl: "https://www.luogu.com.cn/problem/B4264",
    level: 4,
    knowledgePoints: ["二维数组", "枚举", "数学"],
    difficulty: "入门", // 洛谷难度1
    description: `小 A 有一个 $n$ 行 $m$ 列的矩阵 $A$。

小 A 认为一个 $2 \\times 2$ 的矩阵 $D$ 是好的，当且仅当 $D_{1,1} \\times D_{2,2} = D_{1,2} \\times D_{2,1}$。其中 $D_{i,j}$ 表示矩阵 $D$ 的第 $i$ 行第 $j$ 列的元素。

小 A 想知道 $A$ 中有多少个好的子矩阵。`,
    inputFormat: `第一行，两个正整数 $n, m$。

接下来 $n$ 行，每行 $m$ 个整数 $A_{i,1}, A_{i,2}, \\ldots, A_{i,m}$。`,
    outputFormat: `一行，一个整数，表示 $A$ 中好的子矩阵的数量。`,
    samples: [
      { input: "3 4\n1 2 1 0\n2 4 2 1\n0 3 3 0", output: "2" }
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `### 样例解释

样例中好的子矩阵如下：

![](https://cdn.luogu.com.cn/upload/image_hosting/lcdtefnp.png)

### 数据范围

对于所有测试点，保证 $1\\leq n\\leq 500$，$1\\leq m\\leq 500$，$-100\\leq A_{i,j}\\leq 100$`,
  },

  // ========== 2025年6月 ==========
  {
    title: "[GESP202506 四级] 画布裁剪",
    source: "gesp_official",
    sourceId: "B4360",
    sourceUrl: "https://www.luogu.com.cn/problem/B4360",
    level: 4,
    knowledgePoints: ["二维数组", "字符串", "模拟"],
    difficulty: "入门", // 洛谷难度1
    description: `小 A 在高为 $h$ 宽为 $w$ 的矩形画布上绘制了一幅画。由于画布边缘留白太多，小 A 想适当地裁剪画布，只保留画的主体。具体来说，画布可以视为 $h$ 行 $w$ 列的字符矩阵，其中的字符均为 ASCII 码位于 $33 \\sim 126$ 之间的可见字符，小 A 只保留画布中由第 $x_1$ 行到第 $x_2$ 行、第 $y_1$ 列到第 $y_2$ 列构成的子矩阵。

小 A 将画布交给了你，你能帮他完成画布的裁剪吗？`,
    inputFormat: `第一行，两个正整数 $h, w$，分别表示画布的行数与列数。

第二行，四个正整数 $x_1, x_2, y_1, y_2$，表示保留的行列边界。

接下来 $h$ 行，每行一个长度为 $w$ 的字符串，表示画布内容。
`,
    outputFormat: `输出共 $x_2 - x_1 + 1$ 行，每行一个长度为 $y_2 - y_1 + 1$ 的字符串，表示裁剪后的画布。`,
    samples: [
      { input: "3 5\n2 2 2 4\n.....\n.>_<.\n.....", output: ">_<" },
      { input: "5 5\n1 2 3 4\nAbCdE\nfGhIk\nLmNoP\nqRsTu\nVwXyZ", output: "Cd\nhI" }
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于所有测试点，保证 $1 \\leq h, w \\leq 100$，$1 \\leq x_1 \\leq x_2 \\leq h$，$1 \\leq y_1 \\leq y_2 \\leq w$。
`,
  },

  {
    title: "[GESP202506 四级] 排序",
    source: "gesp_official",
    sourceId: "B4361",
    sourceUrl: "https://www.luogu.com.cn/problem/B4361",
    level: 4,
    knowledgePoints: ["排序", "逆序对", "冒泡排序"],
    difficulty: "普及-", // 洛谷难度2
    description: `体育课上有 $n$ 名同学排成一队，从前往后数第 $i$ 位同学的身高为 $h_i$，体重为 $w_i$。目前排成的队伍看起来参差不齐，老师希望同学们能按照身高从高到低的顺序排队，如果身高相同则按照体重从重到轻排序。在调整队伍时，每次只能交换相邻两位同学的位置。老师想知道，最少需要多少次交换操作，才能将队伍调整成目标顺序。`,
    inputFormat: `第一行，一个正整数 $n$，表示队伍人数。

接下来 $n$ 行，每行两个正整数 $h_i$ 和 $w_i$，分别表示第 $i$ 位同学的身高和体重。`,
    outputFormat: `输出一行，一个整数，表示最少需要的交换次数。`,
    samples: [
      { input: "5\n1 60\n3 70\n2 80\n4 55\n4 50", output: "8" },
      { input: "5\n4 0\n4 0\n2 0\n3 0\n1 0", output: "1" }
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于所有测试点，保证 $1 \\leq n \\leq 3000$，$0 \\leq h_i, w_i \\leq 10^9$。
`,
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
    description: `作为将军，你自然需要合理地排兵布阵。地图可以视为 $n$ 行 $m$ 列的网格，适合排兵的网格以 1 标注，不适合排兵的网格以 0 标注。现在你需要在地图上选择一个矩形区域排兵，这个矩形区域内不能包含不适合排兵的网格。请问可选择的矩形区域最多能包含多少网格？
`,
    inputFormat: `第一行，两个正整数 $n, m$，分别表示地图网格的行数与列数。

接下来 $n$ 行，每行 $m$ 个整数 $a_{i,1}, a_{i,2}, \\ldots, a_{i,m}$，表示各行中的网格是否适合排兵。
`,
    outputFormat: `一行，一个整数，表示适合排兵的矩形区域包含的最大网格数。`,
    samples: [
      { input: "4 3\n0 1 1\n1 0 1\n0 1 1\n1 1 1", output: "4" },
      { input: "3 5\n1 0 1 0 1\n0 1 0 1 0\n0 1 1 1 0", output: "3" }
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于所有测试点，保证 $1 \\leq n, m \\leq 12$，$0 \\leq a_{i,j} \\leq 1$。
`,
  },

  {
    title: "[GESP202509 四级] 最长连续段",
    source: "gesp_official",
    sourceId: "B4416",
    sourceUrl: "https://www.luogu.com.cn/problem/B4416",
    level: 4,
    knowledgePoints: ["排序", "贪心", "连续序列"],
    difficulty: "普及-", // 洛谷难度2
    description: `对于 $k$ 个整数构成的数组 $[b_1, b_2, \\ldots, b_k]$，如果对 $1 \\leq i < k$ 都有 $b_{i+1} = b_i + 1$，那么称数组 $b$ 是一个连续段。

给定由 $n$ 个整数构成的数组 $[a_1, a_2, \\ldots, a_n]$，你可以任意重排数组 $a$ 中元素顺序。请问在重排顺序之后，$a$ 所有是连续段的子数组中，最长的子数组长度是多少？

例如，对于数组 $[1, 0, 2, 4]$，可以将其重排为 $[4, 0, 1, 2]$，有以下 $10$ 个子数组：

$$[4], [0], [1], [2], [4, 0], [0, 1], [1, 2], [4, 0, 1], [0, 1, 2], [4, 0, 1, 2]$$

其中除 $[4, 0], [4, 0, 1], [4, 0, 1, 2]$ 以外的子数组均是连续段，因此是连续段的子数组中，最长子数组长度为 3。
`,
    inputFormat: `第一行，一个正整数 $n$，表示数组长度。

第二行，$n$ 个整数 $a_1, a_2, \\ldots, a_n$，表示数组中的整数。
`,
    outputFormat: `一行，一个整数，表示数组 $a$ 重排顺序后，所有是连续段的子数组的最长长度。`,
    samples: [
      { input: "4\n1 0 2 4", output: "3" },
      { input: "9\n9 9 8 2 4 4 3 5 3", output: "4" }
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `对于 $40\\%$ 的测试点，保证 $1 \\leq n \\leq 8$。

对于所有测试点，保证 $1 \\leq n \\leq 10^5$，$-10^9 \\leq a_i \\leq 10^9$。`,
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
    description: `小 A 有一张 $M$ 行 $N$ 列的地形图，其中第 $i$ 行第 $j$ 列的数字 $a_{ij}$ 代表坐标 $(i, j)$ 的海拔高度。

停机坪为一个 $3 \\times 3$ 的区域，且内部所有 $9$ 个点的最大高度和最小高度之差不超过 $H$。

小 A 想请你计算出，在所有适合建造停机坪的区域中，区域内部 $9$ 个点海拔之和最大是多少。`,
    inputFormat: `第一行三个正整数 $M, N, H$，含义如题面所示。

之后 $M$ 行，第 $i$ 行包含 $N$ 个整数 $a_{i1}, a_{i2}, \\dots, a_{iN}$，代表坐标 $(i, j)$ 的高度。

数据保证总存在一个适合建造停机坪的区域。`,
    outputFormat: `输出一行，代表最大的海拔之和。`,
    samples: [
      { input: "5 5 3\n5 5 5 5 5\n5 1 5 1 5\n5 5 5 5 5\n5 2 5 2 5\n3 5 5 5 2", output: "40" }
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `### 数据范围

对于所有测试点，保证 $1 \\leq M, N \\leq 10^3$，$1 \\leq H, a_{ij} \\leq 10^5$。`,
  },

  {
    title: "[GESP202512 四级] 优先购买",
    source: "gesp_official",
    sourceId: "B4452",
    sourceUrl: "https://www.luogu.com.cn/problem/B4452",
    level: 4,
    knowledgePoints: ["排序", "贪心", "模拟", "STL容器"],
    difficulty: "普及-", // 洛谷难度2
    description: `小 A 有 $M$ 元预算。商店有 $N$ 个商品，每个商品有商品名 $S$、价格 $P$ 和优先级 $V$ 三种属性，其中 $V$ 为正整数，且 $V$ 越小代表商品的优先级越高。

小 A 的购物策略为：

- 总是优先买优先级最高的东西；
- 如果有多个最高优先级商品，购买价格最低的；
- 如果有多个优先级最高且价格最低的商品，购买商品名字典序最小的。

小 A 想知道能购买哪些商品。`,
    inputFormat: `第一行两个正整数 $M, N$，代表预算和商品数。

之后 $N$ 行，每行一个商品，依次为 $S_i\\ P_i\\ V_i$，代表第 $i$ 个商品的商品名、价格、优先级。

数据保证不存在两个名字相同的商品。`,
    outputFormat: `按照字典序从小到大的顺序，输出所有购买商品的商品名。`,
    samples: [
      { input: "20 4\napple 6 8\nbus 15 1\ncab 1 10\nwater 4 8", output: "bus\ncab\nwater" }
    ],
    timeLimit: 1000,
    memoryLimit: 512,
    hint: `### 数据范围

对于所有测试点，保证 $1 \\leq |S_i| \\leq 10$，$1 \\leq M, P_i \\leq 10^5$，$1 \\leq N \\leq 10^3$，$1 \\leq V_i \\leq 10$。商品名仅由小写字母组成且不存在两个相同的商品名。`,
  },

];

async function seedGesp4() {
  try {
    // 删除现有的GESP4题目，重新导入
    await prisma.problem.deleteMany({
      where: {
        sourceId: {
          in: gesp4Problems.map(p => p.sourceId).filter(Boolean) as string[]
        }
      }
    });

    // 添加所有题目（testCases 复用 samples）
    const problemsWithTestCases = gesp4Problems.map(p => ({
      ...p,
      testCases: p.samples,
    }));

    const result = await prisma.problem.createMany({
      data: problemsWithTestCases,
    });

    return NextResponse.json({
      success: true,
      message: `成功导入 ${result.count} 道 GESP 4级题目`,
      count: result.count
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
