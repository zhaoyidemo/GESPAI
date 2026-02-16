// ============================================================
// 为 12 道题生成并验证测试用例，每题 15 个
// ============================================================

// ---- P2957: Barn Echoes G ----
// 求两个字符串最长的"一个前缀=另一个后缀"的长度（双向取 max）
function solveP2957(s1, s2) {
  let maxLen = 0;
  // s1 的前缀 = s2 的后缀
  const len1 = Math.min(s1.length, s2.length);
  for (let k = 1; k <= len1; k++) {
    if (s1.substring(0, k) === s2.substring(s2.length - k)) {
      maxLen = Math.max(maxLen, k);
    }
  }
  // s2 的前缀 = s1 的后缀
  for (let k = 1; k <= len1; k++) {
    if (s2.substring(0, k) === s1.substring(s1.length - k)) {
      maxLen = Math.max(maxLen, k);
    }
  }
  return maxLen;
}

const p2957_cases = [
  ["abcxxxxabcxabcd", "abcdxabcxxxxabcx"],       // 原始样例
  ["a", "a"],                                      // 单字符相同
  ["a", "b"],                                      // 单字符不同
  ["ab", "ba"],                                    // 前后缀各1字符
  ["abc", "abc"],                                  // 完全相同
  ["abcdef", "defabc"],                            // 交叉3
  ["aaaa", "aaaa"],                                // 全相同字符
  ["xyz", "abc"],                                  // 完全不匹配
  ["aaaaab", "baaaaa"],                            // 仅1字符: s1前缀a=s2后缀a → 5? No, s2后缀: s2="baaaaa", suffix of len 1="a", s1 prefix "a" → match 1. suffix len 2="aa", s1 prefix "aa"? s1="aaaaab", prefix "aa" → yes match 2, ...5="aaaaa", s1 prefix "aaaaa" → yes match 5. s1 suffix = s2 prefix: s1 suffix of len 1="b", s2 prefix "b" → match 1.
  ["abcabcabc", "abcabc"],                         // 重复模式
  ["aaaaaaaaaa", "aaaaaaaaaa"],                    // 10个a=10个a
  ["abcxyz", "xyzabc"],                            // 前缀=后缀 3
  ["hello", "world"],                              // 无匹配
  ["abababab", "abababab"],                        // 交替重复，完全相同
  ["zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzza", "azzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"], // 长串：79个z+a vs a+79个z
];

console.log("=== P2957 ===");
const p2957_results = p2957_cases.map(([s1, s2]) => {
  const ans = solveP2957(s1, s2);
  console.log(`  "${s1}" | "${s2}" => ${ans}`);
  return { input: `${s1}\n${s2}`, output: String(ans) };
});

// ---- CF3A: Shortest path of the king ----
// 国王棋步数 = max(|dx|, |dy|)，路径：贪心走对角再走直线
function solveCF3A(s, t) {
  let sx = s.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
  let sy = parseInt(s[1]);
  let tx = t.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
  let ty = parseInt(t[1]);
  const steps = [];
  while (sx !== tx || sy !== ty) {
    let move = "";
    if (sx < tx) { sx++; move += "R"; }
    else if (sx > tx) { sx--; move += "L"; }
    if (sy < ty) { sy++; move += "U"; }
    else if (sy > ty) { sy--; move += "D"; }
    steps.push(move);
  }
  if (steps.length === 0) return "0";
  return steps.length + "\n" + steps.join("\n");
}

const cf3a_cases = [
  ["a8", "h1"],   // 原始样例
  ["a1", "a1"],   // 起点=终点
  ["a1", "a2"],   // 上移1
  ["a1", "b1"],   // 右移1
  ["a1", "b2"],   // 对角1
  ["a1", "h8"],   // 左下→右上，最远对角
  ["h8", "a1"],   // 右上→左下
  ["a1", "a8"],   // 纯上，7步
  ["a1", "h1"],   // 纯右，7步
  ["h1", "a8"],   // 左上角方向
  ["d4", "e6"],   // 中部短距离
  ["e4", "e4"],   // 中心自到自
  ["a1", "c5"],   // 距离max(2,4)=4
  ["h8", "h1"],   // 纯下
  ["b2", "g7"],   // max(5,5)=5 纯对角
];

console.log("\n=== CF3A ===");
const cf3a_results = cf3a_cases.map(([s, t]) => {
  const ans = solveCF3A(s, t);
  const steps = ans === "0" ? 0 : parseInt(ans.split("\n")[0]);
  console.log(`  ${s} -> ${t} => ${steps} steps`);
  return { input: `${s}\n${t}`, output: ans };
});

// ---- P4995: 跳跳！----
// 贪心：排序后交替 max/min 跳，从地面开始
function solveP4995(n, h) {
  h.sort((a, b) => a - b);
  let result = BigInt(0);
  let left = 0, right = n - 1;
  let prev = 0;
  let useRight = true;
  while (left <= right) {
    let next = useRight ? h[right--] : h[left++];
    result += BigInt(next - prev) * BigInt(next - prev);
    prev = next;
    useRight = !useRight;
  }
  return result.toString();
}

const p4995_cases = [
  [2, [2, 1]],               // 原始样例1
  [3, [6, 3, 5]],            // 原始样例2
  [1, [1]],                   // 最小n
  [1, [10000]],               // 单块最高
  [2, [1, 10000]],            // 两块极端
  [3, [1, 2, 3]],             // 连续小数
  [4, [1, 2, 3, 4]],          // 4个连续
  [5, [1, 2, 3, 4, 5]],       // 5个连续
  [2, [9999, 10000]],         // 两块接近极值
  [3, [1, 5000, 10000]],      // 三块均匀分布
  [4, [1, 2, 9999, 10000]],   // 两端极值
  [5, [100, 200, 300, 400, 500]], // 等差
  [6, [1, 10, 100, 1000, 5000, 10000]], // 跨度大
  [3, [3333, 6666, 9999]],    // 等差大数
  [10, [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000]], // n=10等差
];

console.log("\n=== P4995 ===");
const p4995_results = p4995_cases.map(([n, h]) => {
  const ans = solveP4995(n, [...h]);
  console.log(`  n=${n} h=[${h.join(',')}] => ${ans}`);
  return { input: `${n}\n${h.join(' ')}`, output: ans };
});

// ---- P1208: 混合牛奶 ----
function solveP1208(need, farmers) {
  farmers.sort((a, b) => a[0] - b[0]);
  let cost = 0, rem = need;
  for (const [p, a] of farmers) {
    if (rem <= 0) break;
    const buy = Math.min(rem, a);
    cost += p * buy;
    rem -= buy;
  }
  return cost;
}

const p1208_cases = [
  [100, [[5,20],[9,40],[3,10],[8,80],[6,30]]],     // 原始样例
  [0, [[5,20]]],                                    // 需求0
  [1, [[1000,2000000]]],                             // 只买1
  [10, [[1,5],[2,5],[3,5]]],                          // 刚好买完前两家
  [20, [[5,10],[5,10]]],                              // 价格相同
  [5, [[10,10],[1,10],[5,10]]],                       // 最便宜够用
  [15, [[10,10],[1,10],[5,10]]],                      // 两家
  [30, [[10,10],[1,10],[5,10]]],                      // 三家全买
  [2000000, [[1000,2000000]]],                        // 大数据
  [1000000, [[1,500000],[2,500000],[3,500000]]],      // 大需求
  [3, [[100,1],[200,1],[300,1]]],                     // 每家只1个
  [0, [[0,0]]],                                       // 全0
  [1, [[0,2000000]]],                                 // 免费牛奶
  [10, [[1,10],[1,10],[1,10]]],                       // 全同价
  [2000000, [[1,1000000],[2,1000000]]],               // 先全买便宜再买贵
];

console.log("\n=== P1208 ===");
const p1208_results = p1208_cases.map(([need, farmers]) => {
  const ans = solveP1208(need, farmers.map(f => [...f]));
  const input = `${need} ${farmers.length}\n${farmers.map(f => f.join(' ')).join('\n')}`;
  console.log(`  need=${need} => ${ans}`);
  return { input, output: String(ans) };
});

// ---- P1601: 高精度加法 ----
function solveP1601(a, b) {
  return (BigInt(a) + BigInt(b)).toString();
}

const p1601_cases = [
  ["1", "1"],
  ["1001", "9099"],
  ["0", "0"],
  ["0", "999999999999999999999999"],
  ["999", "1"],
  ["999999999999999999", "1"],
  ["123456789012345678901234567890", "987654321098765432109876543210"],
  ["99999999999999999999", "99999999999999999999"],
  ["1", "0"],
  ["100000000000000000000", "1"],
  ["99999999999999999999999999999999999999999999999999", "1"],
  ["55555555555555555555", "44444444444444444445"],
  ["11111111111111111111", "88888888888888888889"],
  ["50000000000000000000", "50000000000000000000"],
  ["999999999", "999999999"],
];

console.log("\n=== P1601 ===");
const p1601_results = p1601_cases.map(([a, b]) => {
  const ans = solveP1601(a, b);
  console.log(`  ${a} + ${b} = ${ans}`);
  return { input: `${a}\n${b}`, output: ans };
});

// ---- P2142: 高精度减法 ----
function solveP2142(a, b) {
  const result = BigInt(a) - BigInt(b);
  return result.toString();
}

const p2142_cases = [
  ["2", "1"],
  ["1", "2"],
  ["100", "100"],
  ["1000", "1"],
  ["1000000000000000000", "1"],
  ["1", "1000000000000000000"],
  ["999999999999999999999999999999", "1"],
  ["1", "999999999999999999999999999999"],
  ["10000000000", "9999999999"],
  ["123456789", "123456780"],
  ["100000000000000000000000000000", "99999999999999999999999999999"],
  ["1000000000000000000000", "999999999999999999999"],
  ["2", "2"],
  ["99999999999999999999999999999999999999999999999999", "1"],
  ["50000000000000000000", "49999999999999999999"],
];

console.log("\n=== P2142 ===");
const p2142_results = p2142_cases.map(([a, b]) => {
  const ans = solveP2142(a, b);
  console.log(`  ${a} - ${b} = ${ans}`);
  return { input: `${a}\n${b}`, output: ans };
});

// ---- P1303: A*B Problem ----
function solveP1303(a, b) {
  return (BigInt(a) * BigInt(b)).toString();
}

const p1303_cases = [
  ["1", "2"],
  ["0", "12345"],
  ["0", "0"],
  ["1", "99999"],
  ["999", "999"],
  ["123456789", "987654321"],
  ["100", "100"],
  ["99999999999999999999", "1"],
  ["11111", "11111"],
  ["2", "2"],
  ["99999999999999999999", "99999999999999999999"],
  ["12345678901234567890", "10"],
  ["99999999999999999999", "2"],
  ["55555555555555555555", "2"],
  ["33333333333333333333", "3"],
];

console.log("\n=== P1303 ===");
const p1303_results = p1303_cases.map(([a, b]) => {
  const ans = solveP1303(a, b);
  console.log(`  ${a} * ${b} = ${ans}`);
  return { input: `${a}\n${b}`, output: ans };
});

// ---- P1480: A/B Problem ----
// 注意：b <= 10^9 (普通整数)
function solveP1480(a, b) {
  return (BigInt(a) / BigInt(b)).toString();
}

const p1480_cases = [
  ["10", "2"],
  ["0", "5"],
  ["7", "2"],
  ["100", "3"],
  ["1", "1"],
  ["999999999999999999", "7"],
  ["1000000000000000000", "1000000000"],
  ["123456789012345678901234567890", "1"],
  ["1", "1000000000"],
  ["999999999", "999999999"],
  ["1000000000000000000000000000000", "999999999"],
  ["99999999999999999999999999999", "2"],
  ["123456789012345678901234567890", "123456789"],
  ["1000000000", "3"],
  ["999999999999999999999999999999", "1000000000"],
];

console.log("\n=== P1480 ===");
const p1480_results = p1480_cases.map(([a, b]) => {
  const ans = solveP1480(a, b);
  console.log(`  ${a} / ${b} = ${ans}`);
  return { input: `${a}\n${b}`, output: ans };
});

// ---- P1387: 最大正方形 ----
function solveP1387(grid) {
  const n = grid.length, m = grid[0].length;
  const dp = Array.from({length: n}, () => Array(m).fill(0));
  let max = 0;
  for (let i = 0; i < n; i++)
    for (let j = 0; j < m; j++) {
      if (grid[i][j] === 1) {
        dp[i][j] = (i === 0 || j === 0) ? 1 : Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1;
        max = Math.max(max, dp[i][j]);
      }
    }
  return max;
}

const p1387_cases = [
  [[0,1,1,1],[1,1,1,0],[0,1,1,0],[1,1,0,1]],                          // 原始样例 4x4
  [[1]],                                                                 // 1x1
  [[1,1,1],[1,1,1],[1,1,1]],                                            // 3x3全1
  [[1,0,0],[0,1,0],[0,0,1]],                                            // 对角线
  [[1,1,1],[1,1,1]],                                                     // 2x3全1
  [[1,1,1,1,1]],                                                         // 1x5
  [[1],[1],[1],[1],[1]],                                                  // 5x1
  [[1,0,1,1,1],[1,0,1,1,1],[1,1,1,1,1],[1,0,0,1,0],[1,0,0,1,0]],       // 5x5含3x3
  [[1,0],[0,1]],                                                         // 2x2对角
  [[1,1],[1,1]],                                                         // 2x2全1
  [[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]],                            // 4x4全1
  [[0,0,0,1],[0,0,1,1],[0,1,1,1],[1,1,1,1]],                            // 阶梯形
  [[1,1,0,1,1],[1,1,0,1,1],[0,0,0,0,0],[1,1,0,1,1],[1,1,0,1,1]],       // 十字分割
  [[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1]],       // 空心框
  [[0,1,1,1,0],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[0,1,1,1,0]],       // 菱形填充
];

console.log("\n=== P1387 ===");
const p1387_results = p1387_cases.map((grid, idx) => {
  const n = grid.length, m = grid[0].length;
  const ans = solveP1387(grid);
  const inputStr = `${n} ${m}\n${grid.map(row => row.join(' ')).join('\n')}`;
  console.log(`  ${n}x${m} => ${ans}`);
  return { input: inputStr, output: String(ans) };
});

// ---- P1540: 机器翻译 ----
function solveP1540(M, words) {
  const mem = [];
  let lookups = 0;
  for (const w of words) {
    if (mem.includes(w)) continue;
    lookups++;
    if (mem.length >= M) mem.shift();
    mem.push(w);
  }
  return lookups;
}

const p1540_cases = [
  [3, [1,2,1,5,4,4,1]],                              // 原始样例
  [1, [1,2,1,2]],                                     // 容量1全替换
  [2, [1,2,1,2]],                                     // 容量2全命中
  [100, [1,2,3,4,5]],                                 // 容量远大
  [1, [1,1,1,1]],                                     // 全相同
  [2, [1,2,3,1,2,3]],                                 // 循环替换
  [1, [0]],                                            // 最短
  [3, [1,1,1]],                                        // 全相同容量3
  [100, [999]],                                        // 单词1个
  [5, [1,2,3,4,5,1,2,3,4,5]],                          // 刚好装满再重复
  [3, [1,2,3,4,5,6,7,8,9,10]],                         // 10个不同词容量3
  [2, [0,1,0,1,0,1,0,1]],                              // 交替2词容量2
  [1, [0,1,0,1,0,1,0,1]],                              // 交替2词容量1
  [4, [1,2,3,4,1,2,3,4,5]],                            // 先满后替换
  [3, [10,20,30,10,20,40,10,20,30]],                    // 混合模式
];

console.log("\n=== P1540 ===");
const p1540_results = p1540_cases.map(([M, words]) => {
  const ans = solveP1540(M, words);
  const input = `${M} ${words.length}\n${words.join(' ')}`;
  console.log(`  M=${M} N=${words.length} => ${ans}`);
  return { input, output: String(ans) };
});

// ---- P1223: 排队接水 ----
function solveP1223(times) {
  const n = times.length;
  const indexed = times.map((t, i) => ({ time: t, idx: i + 1 }));
  indexed.sort((a, b) => a.time - b.time || a.idx - b.idx);
  let totalWait = 0, cumTime = 0;
  for (let i = 0; i < n; i++) {
    totalWait += cumTime;
    cumTime += indexed[i].time;
  }
  const avg = totalWait / n;
  return indexed.map(x => x.idx).join(' ') + "\n" + avg.toFixed(2);
}

const p1223_cases = [
  [56, 12, 1, 99, 1000, 234, 33, 55, 99, 812],   // 原始样例
  [5],                                              // 1人
  [3, 1],                                           // 2人
  [1, 1, 1],                                        // 全相同
  [3, 2, 1],                                        // 逆序
  [5, 4, 3, 2, 1],                                  // 5人逆序
  [1, 1],                                           // 2人相同
  [10, 10, 10, 10],                                 // 4人相同
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],                 // 10人顺序
  [1000000, 1],                                     // 大值和小值
  [100, 100, 1, 1],                                 // 两组相同
  [7, 7, 7, 7, 7, 7, 7],                           // 7人全相同
  [1, 1000000],                                     // 极端两人
  [999999, 999998, 999997],                         // 3个大数
  [1, 2, 1, 2, 1],                                  // 交替
];

console.log("\n=== P1223 ===");
const p1223_results = p1223_cases.map((times) => {
  const ans = solveP1223(times);
  const input = `${times.length}\n${times.join(' ')}`;
  console.log(`  n=${times.length} => ${ans.split('\n')[1]}`);
  return { input, output: ans };
});

// ---- P3817: 小A的糖果 ----
// 贪心：从左到右扫描，如果 a[i]+a[i+1]>x，优先减少右边的（对后续有利）
function solveP3817(n, x, arr) {
  const a = [...arr];
  let eaten = BigInt(0);
  // 首先处理第一个盒子：如果 a[0] > x，它单独就超了（因为与 a[1] 之和必然超）
  if (a[0] > x) {
    eaten += BigInt(a[0] - x);
    a[0] = x;
  }
  for (let i = 0; i < n - 1; i++) {
    const sum = a[i] + a[i + 1];
    if (sum > x) {
      const diff = sum - x;
      // 优先从 a[i+1] 减（贪心：减右边对后面的检查更有利）
      const reduce = Math.min(diff, a[i + 1]);
      a[i + 1] -= reduce;
      eaten += BigInt(reduce);
      if (diff > reduce) {
        a[i] -= (diff - reduce);
        eaten += BigInt(diff - reduce);
      }
    }
  }
  return eaten.toString();
}

const p3817_cases = [
  [3, 3, [2, 2, 2]],                                  // 原始样例1
  [6, 1, [1, 6, 1, 2, 0, 4]],                          // 原始样例2
  [5, 9, [3, 1, 4, 1, 5]],                             // 原始样例3
  [2, 0, [0, 0]],                                      // 全0
  [2, 0, [5, 3]],                                      // x=0需全吃
  [2, 10, [5, 3]],                                     // 已满足
  [4, 3, [1, 2, 3, 4]],                                // 需调整
  [2, 1000000000, [1000000000, 1000000000]],            // 大数据边界
  [3, 0, [1000000000, 1000000000, 1000000000]],         // x=0大数
  [2, 5, [3, 3]],                                      // 刚好多1
  [3, 10, [0, 0, 0]],                                  // 全0
  [5, 5, [5, 5, 5, 5, 5]],                             // 全相同刚好超
  [4, 10, [10, 10, 10, 10]],                           // 相邻都超
  [2, 1, [1000000000, 1000000000]],                     // x=1大数
  [5, 100, [50, 60, 70, 80, 90]],                       // 递增序列
];

console.log("\n=== P3817 ===");
const p3817_results = p3817_cases.map(([n, x, arr]) => {
  const ans = solveP3817(n, x, [...arr]);
  const input = `${n} ${x}\n${arr.join(' ')}`;
  console.log(`  n=${n} x=${x} a=[${arr.join(',')}] => ${ans}`);
  return { input, output: ans };
});

// ===== 输出所有结果为 JSON，方便后续使用 =====
const allResults = {
  P2957: p2957_results,
  CF3A: cf3a_results,
  P4995: p4995_results,
  P1208: p1208_results,
  P1601: p1601_results,
  P2142: p2142_results,
  P1303: p1303_results,
  P1480: p1480_results,
  P1387: p1387_results,
  P1540: p1540_results,
  P1223: p1223_results,
  P3817: p3817_results,
};

require('fs').writeFileSync(
  require('path').join(__dirname, 'all_testcases.json'),
  JSON.stringify(allResults, null, 2)
);
console.log("\n\nAll test cases written to all_testcases.json");
