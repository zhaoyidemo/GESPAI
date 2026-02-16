// P1303 A*B Problem - high precision multiplication
console.log("P1303 tests:");
console.log("1*2:", (BigInt("1") * BigInt("2")).toString());
console.log("0*12345:", (BigInt("0") * BigInt("12345")).toString());
console.log("999*999:", (BigInt("999") * BigInt("999")).toString());
console.log("123456789*987654321:", (BigInt("123456789") * BigInt("987654321")).toString());
console.log("100*100:", (BigInt("100") * BigInt("100")).toString());

// P1480 A/B Problem - high precision division
console.log("\nP1480 tests:");
console.log("10/2:", (BigInt("10") / BigInt("2")).toString());
console.log("0/5:", (BigInt("0") / BigInt("5")).toString());
console.log("7/2:", (BigInt("7") / BigInt("2")).toString());
console.log("100/3:", (BigInt("100") / BigInt("3")).toString());
console.log("999999999999999999/7:", (BigInt("999999999999999999") / BigInt("7")).toString());
console.log("1000000000000000000/1000000000:", (BigInt("1000000000000000000") / BigInt("1000000000")).toString());
console.log("1/1:", (BigInt("1") / BigInt("1")).toString());
console.log("123456789012345678901234567890/1:", (BigInt("123456789012345678901234567890") / BigInt("1")).toString());
console.log("123456789012345678901234567890/999999999:", (BigInt("123456789012345678901234567890") / BigInt("999999999")).toString());

// P1223 more test cases
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
console.log("1 [5]:", queueWater([5]));
console.log("2 [3,1]:", queueWater([3, 1]));
console.log("3 [1,1,1]:", queueWater([1, 1, 1]));
console.log("3 [3,2,1]:", queueWater([3, 2, 1]));
console.log("5 [5,4,3,2,1]:", queueWater([5, 4, 3, 2, 1]));

// P3817 more test cases
function candy(n, x, arr) {
  let a = [...arr];
  let eaten = 0;
  for (let i = 0; i < n; i++) {
    if (i === 0 && a[i] > x) {
      eaten += a[i] - x;
      a[i] = x;
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
console.log("2 0 [0,0]:", candy(2, 0, [0, 0]));
console.log("2 0 [5,3]:", candy(2, 0, [5, 3]));
console.log("2 10 [5,3]:", candy(2, 10, [5, 3]));
console.log("4 3 [1,2,3,4]:", candy(4, 3, [1, 2, 3, 4]));
console.log("2 1000000000 [1000000000,1000000000]:", candy(2, 1000000000, [1000000000, 1000000000]));
console.log("3 0 [1000000000,1000000000,1000000000]:", candy(3, 0, [1000000000, 1000000000, 1000000000]));

// P1387 more test cases
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

console.log("\nP1387 more tests:");
console.log("2x3 [[1,1,1],[1,1,1]]:", maxSquare([[1,1,1],[1,1,1]]));
console.log("3x3 diag:", maxSquare([[1,0,0],[0,1,0],[0,0,1]]));
console.log("1x5 all 1:", maxSquare([[1,1,1,1,1]]));

// P1540 more tests
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

console.log("\nP1540 more tests:");
console.log("1 [1,2,1,2]:", translate(1, [1,2,1,2]));
console.log("2 [1,2,1,2]:", translate(2, [1,2,1,2]));
console.log("100 [1,2,3,4,5]:", translate(100, [1,2,3,4,5]));
console.log("1 [1,1,1,1]:", translate(1, [1,1,1,1]));
console.log("2 [1,2,3,1,2,3]:", translate(2, [1,2,3,1,2,3]));
