// More verifications
// P4995: n=2, [1, 10000]
function maxEnergy(heights) {
  heights.sort((a, b) => a - b);
  const n = heights.length;
  let result = BigInt(0);
  let sorted = [...heights];
  let left = 0, right = n - 1;
  let prev = 0;
  let useRight = true;
  while (left <= right) {
    let next;
    if (useRight) {
      next = sorted[right--];
    } else {
      next = sorted[left++];
    }
    result += BigInt((next - prev) * (next - prev));
    prev = next;
    useRight = !useRight;
  }
  return result.toString();
}

console.log("P4995: n=2, [1,10000]:", maxEnergy([1, 10000]));
// 0→10000→1: 10000^2 + (10000-1)^2 = 100000000 + 99980001 = 199980001

// P3817 小A的糖果
function candy(n, x, a) {
  let eaten = 0;
  for (let i = 0; i < n; i++) {
    if (i === 0) {
      if (a[i] > x) {
        eaten += a[i] - x;
        a[i] = x;
      }
    }
    if (i < n - 1) {
      const sum = a[i] + a[i + 1];
      if (sum > x) {
        const diff = sum - x;
        const reduce = Math.min(diff, a[i + 1]);
        a[i + 1] -= reduce;
        eaten += reduce;
        if (diff > reduce) {
          a[i] -= (diff - reduce);
          eaten += (diff - reduce);
        }
      }
    }
  }
  return eaten;
}

console.log("\nP3817 tests:");
console.log("3 3 [2,2,2]:", candy(3, 3, [2, 2, 2]));
console.log("6 1 [1,6,1,2,0,4]:", candy(6, 1, [1, 6, 1, 2, 0, 4]));
console.log("5 9 [3,1,4,1,5]:", candy(5, 9, [3, 1, 4, 1, 5]));

// P1540 机器翻译
function translate(M, words) {
  let memory = [];
  let lookups = 0;
  for (const word of words) {
    if (memory.includes(word)) continue;
    lookups++;
    if (memory.length >= M) {
      memory.shift();
    }
    memory.push(word);
  }
  return lookups;
}

console.log("\nP1540 tests:");
console.log("3 [1,2,1,5,4,4,1]:", translate(3, [1, 2, 1, 5, 4, 4, 1]));

// P1223 排队接水
function queueWater(times) {
  const n = times.length;
  const indexed = times.map((t, i) => ({ time: t, idx: i + 1 }));
  indexed.sort((a, b) => a.time - b.time || a.idx - b.idx);
  let totalWait = 0;
  let cumTime = 0;
  for (let i = 0; i < n; i++) {
    totalWait += cumTime;
    cumTime += indexed[i].time;
  }
  const avg = totalWait / n;
  return {
    order: indexed.map(x => x.idx).join(' '),
    avg: avg.toFixed(2)
  };
}

console.log("\nP1223 tests:");
console.log("10 [56,12,1,99,1000,234,33,55,99,812]:", queueWater([56, 12, 1, 99, 1000, 234, 33, 55, 99, 812]));

// P1387 最大正方形
function maxSquare(grid) {
  const n = grid.length;
  const m = grid[0].length;
  const dp = Array.from({ length: n }, () => Array(m).fill(0));
  let maxSide = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (grid[i][j] === 1) {
        if (i === 0 || j === 0) {
          dp[i][j] = 1;
        } else {
          dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1;
        }
        maxSide = Math.max(maxSide, dp[i][j]);
      }
    }
  }
  return maxSide;
}

console.log("\nP1387 tests:");
console.log("4x4:", maxSquare([
  [0, 1, 1, 1],
  [1, 1, 1, 0],
  [0, 1, 1, 0],
  [1, 1, 0, 1]
]));
// Test: 3x3 all 1s
console.log("3x3 all 1:", maxSquare([
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1]
]));
// Test: 1x1
console.log("1x1 [1]:", maxSquare([[1]]));
// Test: 2x2 mixed
console.log("2x2 [[1,0],[0,1]]:", maxSquare([[1, 0], [0, 1]]));
// Test: 5x5 with 3x3 square
console.log("5x5:", maxSquare([
  [1, 0, 1, 1, 1],
  [1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 0, 0, 1, 0],
  [1, 0, 0, 1, 0]
]));
