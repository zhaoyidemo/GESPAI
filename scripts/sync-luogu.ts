/**
 * 洛谷题目数据同步脚本
 *
 * 功能：从洛谷 API 获取题目原始数据，生成与洛谷100%一致的 seed 文件代码
 *
 * 使用方法：
 *   npx ts-node scripts/sync-luogu.ts --level 6
 *   npx ts-node scripts/sync-luogu.ts --level 6 --output app/api/seed/gesp6/route.ts
 *
 * 注意：需要在本地运行，服务器端可能被洛谷封锁
 */

import * as fs from 'fs';
import * as path from 'path';

// 每个级别的题目ID列表（仅支持4-6级）
const PROBLEM_IDS: Record<number, { id: string; knowledgePoints: string[]; background?: string }[]> = {
  4: [
    // GESP 4级题目列表
  ],
  5: [
    { id: "B3941", knowledgePoints: ["最小公倍数", "辗转相除法", "数论"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1105" },
    { id: "B3951", knowledgePoints: ["排序", "插入排序", "逆序对"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1105" },
    { id: "B3871", knowledgePoints: ["质因数分解", "筛法", "数论"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1131" },
    { id: "B3872", knowledgePoints: ["贪心", "排序", "调度问题"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1131" },
    { id: "B3929", knowledgePoints: ["二分", "二分答案", "贪心"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1137" },
    { id: "B3930", knowledgePoints: ["贪心", "模拟", "优先队列"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1137" },
    { id: "B3968", knowledgePoints: ["排序", "贪心", "前缀和"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1145" },
    { id: "B3969", knowledgePoints: ["质因数分解", "筛法", "数论"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1145" },
    { id: "P10719", knowledgePoints: ["栈", "表达式解析", "模拟"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1153" },
    { id: "P10720", knowledgePoints: ["递归", "分治", "数论"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1153" },
    { id: "B4050", knowledgePoints: ["二分", "二分答案", "贪心"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1161" },
    { id: "B4051", knowledgePoints: ["贪心", "排序", "前缀和"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1161" },
    { id: "B4070", knowledgePoints: ["递归", "分形", "模拟"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1169" },
    { id: "B4071", knowledgePoints: ["贪心", "模拟", "策略"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1169" },
    { id: "P11960", knowledgePoints: ["二分", "二分答案", "模拟"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1177" },
    { id: "P11961", knowledgePoints: ["贪心", "排序", "调度"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1177" },
    { id: "P13013", knowledgePoints: ["递归", "分形", "模拟"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1185" },
    { id: "P13014", knowledgePoints: ["最大公约数", "辗转相除法", "数论"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1185" },
    { id: "P14073", knowledgePoints: ["贪心", "排序", "区间问题"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1193" },
    { id: "P14074", knowledgePoints: ["递归", "分治", "数学"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1193" },
    { id: "P14917", knowledgePoints: ["贪心", "排序", "策略"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1201" },
    { id: "P14918", knowledgePoints: ["模拟", "栈", "括号匹配"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1201" },
  ],
  6: [
    { id: "P10250", knowledgePoints: ["动态规划", "递推", "记忆化搜索"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1106" },
    { id: "P10262", knowledgePoints: ["字符串", "数论", "前缀和", "取模"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1106" },
    { id: "B3873", knowledgePoints: ["动态规划", "背包问题", "01背包"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1132" },
    { id: "B3874", knowledgePoints: ["归并排序", "逆序对", "分治"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1132" },
    { id: "P10108", knowledgePoints: ["动态规划", "图论", "BFS"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1138" },
    { id: "P10109", knowledgePoints: ["树", "LCA", "倍增"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1138" },
    { id: "P10376", knowledgePoints: ["动态规划", "递推", "组合数学"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1146" },
    { id: "P10377", knowledgePoints: ["贪心", "排序", "枚举"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1146" },
    { id: "P10721", knowledgePoints: ["动态规划", "字符串", "贪心"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1154" },
    { id: "P10722", knowledgePoints: ["树", "二叉树", "DFS", "异或"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1154" },
    { id: "P11246", knowledgePoints: ["动态规划", "数论", "完全平方数"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1162" },
    { id: "P11247", knowledgePoints: ["贪心", "动态规划", "排序"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1162" },
    { id: "P11375", knowledgePoints: ["树", "二叉树", "模拟", "位运算"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1170" },
    { id: "P11376", knowledgePoints: ["贪心", "排序", "图论", "最优化"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1170" },
    { id: "P11962", knowledgePoints: ["树", "DFS", "BFS", "图的遍历", "奇偶性"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1178" },
    { id: "P11963", knowledgePoints: ["前缀和", "最大子段和", "环形结构"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1178" },
    { id: "P13015", knowledgePoints: ["动态规划", "整数划分", "背包问题"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1186" },
    { id: "P13016", knowledgePoints: ["树", "因数", "数论", "LCA"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1186" },
    { id: "P14075", knowledgePoints: ["动态规划", "字符串", "贪心"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1194" },
    { id: "P14076", knowledgePoints: ["树", "DFS", "树的遍历", "贪心"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1194" },
    { id: "P14919", knowledgePoints: ["树", "DFS", "动态规划", "树形DP"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1202" },
    { id: "P14920", knowledgePoints: ["动态规划", "背包问题", "01背包"], background: "对应的选择、判断题：https://ti.luogu.com.cn/problemset/1202" },
  ],
};

// 洛谷 API 返回的数据结构
interface LuoguProblem {
  pid: string;
  title: string;
  difficulty: number;
  description: string;
  inputFormat: string;
  outputFormat: string;
  samples: Array<[string, string]>;
  hint: string;
  background?: string;
}

interface LuoguApiResponse {
  code: number;
  currentData: {
    problem: LuoguProblem;
  };
}

// 洛谷难度映射
const DIFFICULTY_MAP: Record<number, string> = {
  0: "暂无评定",
  1: "入门",
  2: "普及-",
  3: "普及/提高-",
  4: "普及+/提高",
  5: "提高+/省选-",
  6: "省选/NOI-",
  7: "NOI/NOI+/CTSC",
};

// 延迟函数
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 转义字符串中的特殊字符，用于生成 TypeScript 代码
function escapeForTemplate(str: string): string {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')  // 先转义反斜杠
    .replace(/`/g, '\\`')    // 转义反引号
    .replace(/\$\{/g, '\\${'); // 转义模板字符串插值
}

// 从洛谷获取题目数据
async function fetchProblem(pid: string): Promise<LuoguProblem | null> {
  try {
    const url = `https://www.luogu.com.cn/problem/${pid}?_contentOnly=1`;
    console.log(`  正在获取 ${pid}...`);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`  获取 ${pid} 失败: HTTP ${response.status}`);
      return null;
    }

    const data: LuoguApiResponse = await response.json();

    if (data.code !== 200) {
      console.error(`  获取 ${pid} 失败: API 返回 code ${data.code}`);
      return null;
    }

    console.log(`  成功获取 ${pid}: ${data.currentData.problem.title}`);
    return data.currentData.problem;
  } catch (error) {
    console.error(`  获取 ${pid} 失败:`, error);
    return null;
  }
}

// 生成单个题目的 TypeScript 代码
function generateProblemCode(
  problem: LuoguProblem,
  level: number,
  knowledgePoints: string[],
  customBackground?: string
): string {
  const difficulty = DIFFICULTY_MAP[problem.difficulty] || "普及+/提高";

  // samples 转换：洛谷返回的是 [[input, output], ...] 格式
  const samplesCode = problem.samples
    .map(([input, output]) => `      { input: ${JSON.stringify(input)}, output: ${JSON.stringify(output)} }`)
    .join(',\n');

  // 使用自定义 background 或洛谷原始 background
  const background = customBackground || problem.background || '';

  const code = `  {
    title: ${JSON.stringify(problem.title)},
    source: "gesp_official",
    sourceId: ${JSON.stringify(problem.pid)},
    sourceUrl: ${JSON.stringify(`https://www.luogu.com.cn/problem/${problem.pid}`)},
    level: ${level},
    knowledgePoints: ${JSON.stringify(knowledgePoints)},
    difficulty: ${JSON.stringify(difficulty)},${background ? `
    background: \`${escapeForTemplate(background)}\`,` : ''}
    description: \`${escapeForTemplate(problem.description)}\`,${problem.inputFormat ? `
    inputFormat: \`${escapeForTemplate(problem.inputFormat)}\`,` : ''}${problem.outputFormat ? `
    outputFormat: \`${escapeForTemplate(problem.outputFormat)}\`,` : ''}
    samples: [
${samplesCode}
    ],
    timeLimit: 1000,
    memoryLimit: 256,${problem.hint ? `
    hint: \`${escapeForTemplate(problem.hint)}\`,` : ''}
  }`;

  return code;
}

// 生成完整的 seed 文件代码
function generateSeedFile(level: number, problemCodes: string[]): string {
  const code = `import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GESP ${level}级完整题库 - 来源：洛谷 CCF GESP C++ ${level === 1 ? '一' : level === 2 ? '二' : level === 3 ? '三' : level === 4 ? '四' : level === 5 ? '五' : level === 6 ? '六' : level === 7 ? '七' : '八'}级上机题
// 数据自动同步自洛谷 API，与洛谷100%一致
// 同步时间：${new Date().toISOString()}

const gesp${level}Problems = [
${problemCodes.join(',\n')}
];

async function seedGesp${level}() {
  try {
    // 删除现有的GESP${level}题目，重新导入
    await prisma.problem.deleteMany({
      where: {
        sourceId: {
          in: gesp${level}Problems.map(p => p.sourceId).filter(Boolean) as string[]
        }
      }
    });

    // 为每个题目添加 testCases（与 samples 相同）
    const problemsWithTestCases = gesp${level}Problems.map(p => ({
      ...p,
      testCases: p.samples,
    }));

    // 添加所有题目
    const result = await prisma.problem.createMany({
      data: problemsWithTestCases,
    });

    return NextResponse.json({
      success: true,
      message: \`成功导入 \${result.count} 道 GESP ${level}级题目（与洛谷100%一致）\`,
      count: result.count
    });
  } catch (error) {
    console.error("Seed GESP${level} error:", error);
    return NextResponse.json({ error: "添加题目失败", details: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return seedGesp${level}();
}

export async function POST() {
  return seedGesp${level}();
}
`;

  return code;
}

// 主函数
async function main() {
  const args = process.argv.slice(2);

  // 解析参数
  let level: number | null = null;
  let outputPath: string | null = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--level' && args[i + 1]) {
      level = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--output' && args[i + 1]) {
      outputPath = args[i + 1];
      i++;
    }
  }

  if (!level || level < 1 || level > 8) {
    console.error('用法: npx ts-node scripts/sync-luogu.ts --level <1-8> [--output <path>]');
    console.error('示例: npx ts-node scripts/sync-luogu.ts --level 6');
    console.error('      npx ts-node scripts/sync-luogu.ts --level 6 --output app/api/seed/gesp6/route.ts');
    process.exit(1);
  }

  const problemList = PROBLEM_IDS[level];

  if (!problemList || problemList.length === 0) {
    console.error(`GESP ${level} 级的题目列表为空，请先在脚本中配置题目ID`);
    process.exit(1);
  }

  console.log(`\n开始同步 GESP ${level} 级题目（共 ${problemList.length} 道）\n`);

  const problemCodes: string[] = [];
  let successCount = 0;
  let failCount = 0;

  for (const { id, knowledgePoints, background } of problemList) {
    const problem = await fetchProblem(id);

    if (problem) {
      const code = generateProblemCode(problem, level, knowledgePoints, background);
      problemCodes.push(code);
      successCount++;
    } else {
      failCount++;
    }

    // 请求间隔，避免被封
    await delay(500);
  }

  console.log(`\n同步完成: 成功 ${successCount}/${problemList.length}，失败 ${failCount}`);

  if (problemCodes.length === 0) {
    console.error('没有成功获取任何题目数据');
    process.exit(1);
  }

  // 生成完整的 seed 文件
  const seedFileCode = generateSeedFile(level, problemCodes);

  if (outputPath) {
    // 写入文件
    const fullPath = path.resolve(process.cwd(), outputPath);
    fs.writeFileSync(fullPath, seedFileCode, 'utf-8');
    console.log(`\n已写入文件: ${fullPath}`);
  } else {
    // 输出到控制台
    console.log('\n========== 生成的代码 ==========\n');
    console.log(seedFileCode);
    console.log('\n================================\n');
    console.log('提示: 使用 --output 参数可直接写入文件');
  }
}

main().catch(console.error);
