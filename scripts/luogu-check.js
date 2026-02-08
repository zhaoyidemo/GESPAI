/**
 * 批量从洛谷 API 抓取题目原文，与种子文件逐字段对比
 * 用法: node scripts/luogu-check.js
 */
const fs = require('fs');
const https = require('https');
const http = require('http');

const SEED_FILE = 'app/api/seed/gesp5/route.ts';
const seed = fs.readFileSync(SEED_FILE, 'utf-8');

// 提取所有 sourceId
const sourceIds = [...seed.matchAll(/sourceId: "([^"]+)"/g)].map(m => m[1]);

// 从种子文件提取某题某字段的运行时值
function extractSeedValue(sourceId, fieldName) {
  const idPos = seed.indexOf(`sourceId: "${sourceId}"`);
  if (idPos === -1) return null;
  const blockStart = seed.lastIndexOf('{', idPos);
  const blockEndSearch = seed.indexOf('\n  },', idPos);
  const block = seed.substring(blockStart, blockEndSearch + 4);

  // 模板字符串 `...`
  let re = new RegExp(fieldName + ': `([\\s\\S]*?)`');
  let match = block.match(re);
  if (match) return match[1].replace(/\\\\/g, '\\');

  // 双引号字符串 "..."
  re = new RegExp(fieldName + ': "([^"]*)"');
  match = block.match(re);
  if (match) return match[1].replace(/\\n/g, '\n').replace(/\\\\/g, '\\');

  return null;
}

// 从种子文件提取 samples
function extractSeedSamples(sourceId) {
  const idPos = seed.indexOf(`sourceId: "${sourceId}"`);
  const blockStart = seed.lastIndexOf('{', idPos);
  const blockEnd = seed.indexOf('\n  },', idPos);
  const block = seed.substring(blockStart, blockEnd + 4);

  const samplesMatch = block.match(/samples: \[([\s\S]*?)\],\s*\n\s*testCases/);
  if (!samplesMatch) return [];
  const pairs = [...samplesMatch[1].matchAll(/\{ input: "([^"]*)", output: "([^"]*)" \}/g)];
  return pairs.map(p => [
    p[1].replace(/\\n/g, '\n'),
    p[2].replace(/\\n/g, '\n')
  ]);
}

// 提取种子中的 title
function extractSeedTitle(sourceId) {
  const idPos = seed.indexOf(`sourceId: "${sourceId}"`);
  const blockStart = seed.lastIndexOf('{', idPos);
  const block = seed.substring(blockStart, blockStart + 500);
  const m = block.match(/title: "([^"]+)"/);
  return m ? m[1] : null;
}

// 下载洛谷页面
function fetchLuogu(pid) {
  return new Promise((resolve, reject) => {
    const url = `https://www.luogu.com.cn/problem/${pid}?_contentOnly=1`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 302) {
        const redir = res.headers.location;
        const getter = redir.startsWith('https') ? https : http;
        getter.get(redir, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
          let d = '';
          res2.on('data', chunk => d += chunk);
          res2.on('end', () => resolve(d));
        }).on('error', reject);
        return;
      }
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => resolve(d));
    }).on('error', reject);
  });
}

// 从 HTML 提取题目数据
function parseLuogu(html) {
  const m = html.match(/<script id="lentille-context" type="application\/json">([\s\S]*?)<\/script>/);
  if (!m) return null;
  const data = JSON.parse(m[1]);
  return data.data.problem;
}

function trimNewlines(s) {
  return (s || '').replace(/^\n+/, '').replace(/\n+$/, '');
}

async function main() {
  console.log(`检查 ${sourceIds.length} 道题...\n`);

  let totalDiffs = 0;
  const results = [];

  for (const pid of sourceIds) {
    process.stdout.write(`[${pid}] 获取中...`);

    try {
      const html = await fetchLuogu(pid);
      const problem = parseLuogu(html);

      if (!problem) {
        console.log(' ✗ 无法解析');
        results.push({ pid, error: '无法解析' });
        continue;
      }

      const c = problem.contenu;
      const diffs = [];

      // title
      const seedTitle = extractSeedTitle(pid);
      if (seedTitle !== c.name) {
        diffs.push({ field: 'title', luogu: c.name, seed: seedTitle });
      }

      // description, inputFormat, outputFormat, hint
      const fieldMap = [
        ['description', c.description],
        ['inputFormat', c.formatI],
        ['outputFormat', c.formatO],
        ['hint', c.hint || ''],
      ];

      for (const [field, luoguVal] of fieldMap) {
        const seedVal = extractSeedValue(pid, field);
        const trimmedLuogu = trimNewlines(luoguVal);
        if (seedVal === null) {
          diffs.push({ field, issue: '种子中未找到该字段' });
        } else if (trimmedLuogu !== seedVal) {
          // 计算差异百分比
          const maxLen = Math.max(trimmedLuogu.length, seedVal.length);
          let matchCount = 0;
          for (let i = 0; i < Math.min(trimmedLuogu.length, seedVal.length); i++) {
            if (trimmedLuogu[i] === seedVal[i]) matchCount++;
          }
          const similarity = maxLen > 0 ? Math.round(matchCount / maxLen * 100) : 100;

          // 找首处差异
          let firstDiffPos = -1;
          for (let i = 0; i < Math.min(trimmedLuogu.length, seedVal.length); i++) {
            if (trimmedLuogu[i] !== seedVal[i]) { firstDiffPos = i; break; }
          }
          if (firstDiffPos === -1) firstDiffPos = Math.min(trimmedLuogu.length, seedVal.length);

          diffs.push({
            field,
            similarity,
            luoguLen: trimmedLuogu.length,
            seedLen: seedVal.length,
            firstDiff: firstDiffPos,
            luoguCtx: JSON.stringify(trimmedLuogu.substring(Math.max(0, firstDiffPos - 10), firstDiffPos + 20)),
            seedCtx: JSON.stringify(seedVal.substring(Math.max(0, firstDiffPos - 10), firstDiffPos + 20)),
          });
        }
      }

      // samples
      const luoguSamples = problem.samples || [];
      const seedSamples = extractSeedSamples(pid);
      if (luoguSamples.length !== seedSamples.length) {
        diffs.push({ field: 'samples', issue: `数量不同: 洛谷${luoguSamples.length} vs 种子${seedSamples.length}` });
      } else {
        for (let i = 0; i < luoguSamples.length; i++) {
          if (luoguSamples[i][0] !== seedSamples[i][0]) {
            diffs.push({ field: `samples[${i}].input`, issue: '输入不一致' });
          }
          if (luoguSamples[i][1] !== seedSamples[i][1]) {
            diffs.push({ field: `samples[${i}].output`, issue: '输出不一致' });
          }
        }
      }

      if (diffs.length === 0) {
        console.log(' ✓ 全部一致');
      } else {
        totalDiffs += diffs.length;
        console.log(` ✗ ${diffs.length} 处差异`);
        for (const d of diffs) {
          if (d.issue) {
            console.log(`    ${d.field}: ${d.issue}`);
          } else if (d.field === 'title') {
            console.log(`    title: 洛谷="${d.luogu}" vs 种子="${d.seed}"`);
          } else {
            console.log(`    ${d.field}: 相似度${d.similarity}%, 洛谷${d.luoguLen}字符 vs 种子${d.seedLen}字符`);
            console.log(`      首差@${d.firstDiff}: 洛谷=${d.luoguCtx}`);
            console.log(`      首差@${d.firstDiff}: 种子=${d.seedCtx}`);
          }
        }
      }

      results.push({ pid, diffs });

      // 避免请求过快
      await new Promise(r => setTimeout(r, 300));

    } catch (err) {
      console.log(` ✗ 请求失败: ${err.message}`);
      results.push({ pid, error: err.message });
    }
  }

  console.log(`\n========== 汇总 ==========`);
  const ok = results.filter(r => !r.error && r.diffs.length === 0);
  const bad = results.filter(r => !r.error && r.diffs.length > 0);
  const fail = results.filter(r => r.error);
  console.log(`✓ 完全一致: ${ok.length} 道`);
  console.log(`✗ 有差异: ${bad.length} 道 (共 ${totalDiffs} 处)`);
  if (fail.length) console.log(`⚠ 请求失败: ${fail.length} 道`);

  if (bad.length > 0) {
    console.log('\n需要修复的题目:');
    for (const r of bad) {
      const fields = r.diffs.map(d => d.field).join(', ');
      console.log(`  ${r.pid}: ${fields}`);
    }
  }
}

main().catch(console.error);
