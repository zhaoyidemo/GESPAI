// Verify test case calculations

// P4995 跳跳！
// Greedy: sort, then alternate between highest remaining and lowest remaining from ground
function maxEnergy(heights) {
  heights.sort((a, b) => a - b);
  const n = heights.length;
  let result = BigInt(0);

  // Strategy: from ground (0), jump to max, then min, then max, etc.
  // More precisely: sort the heights, then greedily alternate
  // The optimal is: 0 → max → min → 2nd_max → 2nd_min → ...
  let sorted = [...heights];
  let left = 0, right = n - 1;
  let prev = 0;
  let order = [];
  let useRight = true;
  while (left <= right) {
    let next;
    if (useRight) {
      next = sorted[right--];
    } else {
      next = sorted[left++];
    }
    order.push(next);
    result += BigInt((next - prev) * (next - prev));
    prev = next;
    useRight = !useRight;
  }
  return result.toString();
}

console.log("P4995 tests:");
console.log("n=2, [2,1]:", maxEnergy([2,1]));  // expect 5
console.log("n=3, [6,3,5]:", maxEnergy([6,3,5]));  // expect 49
console.log("n=1, [1]:", maxEnergy([1]));  // expect 1
console.log("n=1, [10000]:", maxEnergy([10000]));  // expect 100000000
console.log("n=3, [1,2,3]:", maxEnergy([1,2,3]));  // 0→3→1→2: 9+4+1=14
console.log("n=4, [1,2,3,4]:", maxEnergy([1,2,3,4]));
console.log("n=2, [5,5]:", maxEnergy([5,5]));  // 25+0=25 if different, but they're same
console.log("n=3, [1,1,1]:", maxEnergy([1,1,1]));
console.log("n=5, [1,2,3,4,5]:", maxEnergy([1,2,3,4,5]));

// P1208 混合牛奶
function mixingMilk(need, farmers) {
  farmers.sort((a, b) => a[0] - b[0]);
  let cost = 0;
  let remaining = need;
  for (const [price, amount] of farmers) {
    if (remaining <= 0) break;
    const buy = Math.min(remaining, amount);
    cost += price * buy;
    remaining -= buy;
  }
  return cost;
}

console.log("\nP1208 tests:");
console.log("100, [[5,20],[9,40],[3,10],[8,80],[6,30]]:", mixingMilk(100, [[5,20],[9,40],[3,10],[8,80],[6,30]]));
console.log("10, [[1,5],[2,5],[3,5]]:", mixingMilk(10, [[1,5],[2,5],[3,5]]));
console.log("15, [[10,10],[1,10],[5,10]]:", mixingMilk(15, [[10,10],[1,10],[5,10]]));
console.log("30, [[10,10],[1,10],[5,10]]:", mixingMilk(30, [[10,10],[1,10],[5,10]]));

// P1601 高精度加法
console.log("\nP1601 tests:");
console.log("123456789012345678901234567890 + 987654321098765432109876543210 =");
console.log((BigInt("123456789012345678901234567890") + BigInt("987654321098765432109876543210")).toString());
console.log("99999999999999999999 + 99999999999999999999 =");
console.log((BigInt("99999999999999999999") + BigInt("99999999999999999999")).toString());

// P2142 高精度减法
console.log("\nP2142 tests:");
console.log("1000000000000000000 - 1 =");
console.log((BigInt("1000000000000000000") - BigInt("1")).toString());
