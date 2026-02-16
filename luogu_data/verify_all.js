// ============================================================
// 最终验证：从 route.ts 提取测试用例，独立求解后比对答案
// ============================================================
const fs = require('fs');
const path = require('path');

const routeFile = fs.readFileSync(
  path.join(__dirname, '..', 'app', 'api', 'seed', 'gesp5', 'route.ts'),
  'utf8'
);

// 提取所有 gesp_practice 题的 sourceId 和 testCases
function extractTestCases(sourceId) {
  const idx = routeFile.indexOf(`sourceId: "${sourceId}"`);
  if (idx === -1) return null;

  // 找到 testCases: [ 开始位置
  const tcStart = routeFile.indexOf('testCases: [', idx);
  if (tcStart === -1) return null;

  // 找到匹配的 ]
  let depth = 0;
  let tcEnd = tcStart + 'testCases: '.length;
  for (let i = tcEnd; i < routeFile.length; i++) {
    if (routeFile[i] === '[') depth++;
    if (routeFile[i] === ']') {
      depth--;
      if (depth === 0) { tcEnd = i + 1; break; }
    }
  }

  const tcStr = routeFile.substring(tcStart + 'testCases: '.length, tcEnd);

  // Parse using eval (safe here since we control the file)
  const cases = eval(tcStr);
  return cases;
}

// ---- 求解器 ----
function solveP2957(input) {
  const [s1, s2] = input.split('\n');
  let max = 0;
  const len = Math.min(s1.length, s2.length);
  for (let k = 1; k <= len; k++) {
    if (s1.substring(0, k) === s2.substring(s2.length - k)) max = Math.max(max, k);
    if (s2.substring(0, k) === s1.substring(s1.length - k)) max = Math.max(max, k);
  }
  return String(max);
}

function solveCF3A(input) {
  const [s, t] = input.split('\n');
  let sx = s.charCodeAt(0) - 97 + 1, sy = parseInt(s[1]);
  let tx = t.charCodeAt(0) - 97 + 1, ty = parseInt(t[1]);
  const steps = [];
  while (sx !== tx || sy !== ty) {
    let m = "";
    if (sx < tx) { sx++; m += "R"; } else if (sx > tx) { sx--; m += "L"; }
    if (sy < ty) { sy++; m += "U"; } else if (sy > ty) { sy--; m += "D"; }
    steps.push(m);
  }
  // 只验证步数（路径不唯一）
  return steps.length === 0 ? "0" : steps.length + "\n" + steps.join("\n");
}

function solveP4995(input) {
  const lines = input.split('\n');
  const n = parseInt(lines[0]);
  const h = lines[1].split(' ').map(Number);
  h.sort((a, b) => a - b);
  let result = BigInt(0);
  let left = 0, right = n - 1, prev = 0, useRight = true;
  while (left <= right) {
    const next = useRight ? h[right--] : h[left++];
    result += BigInt(next - prev) * BigInt(next - prev);
    prev = next;
    useRight = !useRight;
  }
  return result.toString();
}

function solveP1208(input) {
  const lines = input.split('\n');
  const [need, m] = lines[0].split(' ').map(Number);
  const farmers = [];
  for (let i = 1; i <= m; i++) {
    const [p, a] = lines[i].split(' ').map(Number);
    farmers.push([p, a]);
  }
  farmers.sort((a, b) => a[0] - b[0]);
  let cost = 0, rem = need;
  for (const [p, a] of farmers) {
    if (rem <= 0) break;
    const buy = Math.min(rem, a);
    cost += p * buy;
    rem -= buy;
  }
  return String(cost);
}

function solveP1601(input) {
  const [a, b] = input.split('\n');
  return (BigInt(a) + BigInt(b)).toString();
}

function solveP2142(input) {
  const [a, b] = input.split('\n');
  return (BigInt(a) - BigInt(b)).toString();
}

function solveP1303(input) {
  const [a, b] = input.split('\n');
  return (BigInt(a) * BigInt(b)).toString();
}

function solveP1480(input) {
  const [a, b] = input.split('\n');
  return (BigInt(a) / BigInt(b)).toString();
}

function solveP1387(input) {
  const lines = input.split('\n');
  const [n, m] = lines[0].split(' ').map(Number);
  const grid = [];
  for (let i = 1; i <= n; i++) {
    grid.push(lines[i].split(' ').map(Number));
  }
  const dp = Array.from({length: n}, () => Array(m).fill(0));
  let max = 0;
  for (let i = 0; i < n; i++)
    for (let j = 0; j < m; j++) {
      if (grid[i][j] === 1) {
        dp[i][j] = (i === 0 || j === 0) ? 1 : Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1;
        max = Math.max(max, dp[i][j]);
      }
    }
  return String(max);
}

function solveP1540(input) {
  const lines = input.split('\n');
  const [M] = lines[0].split(' ').map(Number);
  const words = lines[1].split(' ').map(Number);
  const mem = [];
  let lookups = 0;
  for (const w of words) {
    if (mem.includes(w)) continue;
    lookups++;
    if (mem.length >= M) mem.shift();
    mem.push(w);
  }
  return String(lookups);
}

function solveP1223(input) {
  const lines = input.split('\n');
  const n = parseInt(lines[0]);
  const times = lines[1].split(' ').map(Number);
  const indexed = times.map((t, i) => ({ time: t, idx: i + 1 }));
  indexed.sort((a, b) => a.time - b.time || a.idx - b.idx);
  let totalWait = 0, cumTime = 0;
  for (let i = 0; i < n; i++) {
    totalWait += cumTime;
    cumTime += indexed[i].time;
  }
  return indexed.map(x => x.idx).join(' ') + "\n" + (totalWait / n).toFixed(2);
}

function solveP3817(input) {
  const lines = input.split('\n');
  const [n, x] = lines[0].split(' ').map(Number);
  const a = lines[1].split(' ').map(Number);
  let eaten = BigInt(0);
  if (a[0] > x) { eaten += BigInt(a[0] - x); a[0] = x; }
  for (let i = 0; i < n - 1; i++) {
    const sum = a[i] + a[i + 1];
    if (sum > x) {
      const diff = sum - x;
      const reduce = Math.min(diff, a[i + 1]);
      a[i + 1] -= reduce;
      eaten += BigInt(reduce);
      if (diff > reduce) { a[i] -= (diff - reduce); eaten += BigInt(diff - reduce); }
    }
  }
  return eaten.toString();
}

// ---- 验证 ----
const solvers = {
  P2957: solveP2957,
  CF3A: solveCF3A,
  P4995: solveP4995,
  P1208: solveP1208,
  P1601: solveP1601,
  P2142: solveP2142,
  P1303: solveP1303,
  P1480: solveP1480,
  P1387: solveP1387,
  P1540: solveP1540,
  P1223: solveP1223,
  P3817: solveP3817,
};

let totalErrors = 0;
let totalCases = 0;

for (const [pid, solver] of Object.entries(solvers)) {
  const cases = extractTestCases(pid);
  if (!cases) {
    console.log(`[${pid}] ERROR: Cannot extract test cases`);
    totalErrors++;
    continue;
  }

  console.log(`\n[${pid}] ${cases.length} test cases:`);
  let errors = 0;

  for (let i = 0; i < cases.length; i++) {
    const { input, output } = cases[i];
    totalCases++;

    try {
      const expected = output.trim();
      const computed = solver(input).trim();

      // CF3A 特殊处理：路径不唯一，只比较步数
      if (pid === 'CF3A') {
        const expSteps = expected === '0' ? 0 : parseInt(expected.split('\n')[0]);
        const compSteps = computed === '0' ? 0 : parseInt(computed.split('\n')[0]);
        if (expSteps !== compSteps) {
          console.log(`  case ${i + 1}: FAIL (steps: expected ${expSteps}, got ${compSteps})`);
          console.log(`    input: ${JSON.stringify(input)}`);
          errors++;
          totalErrors++;
        } else {
          // 验证路径是否合法
          const [s, t] = input.split('\n');
          let cx = s.charCodeAt(0) - 97 + 1, cy = parseInt(s[1]);
          const tx = t.charCodeAt(0) - 97 + 1, ty = parseInt(t[1]);
          const moves = expected === '0' ? [] : expected.split('\n').slice(1);
          let valid = true;
          for (const move of moves) {
            if (move.includes('R')) cx++;
            if (move.includes('L')) cx--;
            if (move.includes('U')) cy++;
            if (move.includes('D')) cy--;
            if (cx < 1 || cx > 8 || cy < 1 || cy > 8) { valid = false; break; }
          }
          if (!valid || cx !== tx || cy !== ty) {
            console.log(`  case ${i + 1}: FAIL (invalid path)`);
            errors++;
            totalErrors++;
          }
        }
      } else {
        if (expected !== computed) {
          console.log(`  case ${i + 1}: FAIL`);
          console.log(`    input:    ${JSON.stringify(input)}`);
          console.log(`    expected: ${JSON.stringify(expected)}`);
          console.log(`    computed: ${JSON.stringify(computed)}`);
          errors++;
          totalErrors++;
        }
      }
    } catch (e) {
      console.log(`  case ${i + 1}: ERROR - ${e.message}`);
      console.log(`    input: ${JSON.stringify(input)}`);
      errors++;
      totalErrors++;
    }
  }

  if (errors === 0) {
    console.log(`  ALL ${cases.length} PASSED ✓`);
  } else {
    console.log(`  ${errors}/${cases.length} FAILED`);
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`Total: ${totalCases} cases, ${totalErrors} errors`);
if (totalErrors === 0) {
  console.log('ALL TEST CASES VERIFIED SUCCESSFULLY!');
} else {
  console.log(`${totalErrors} ERROR(S) FOUND!`);
  process.exit(1);
}
