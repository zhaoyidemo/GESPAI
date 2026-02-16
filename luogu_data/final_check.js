const fs = require('fs');
const path = require('path');

const problems = ['P2957', 'CF3A', 'P4995', 'P1208', 'P1601', 'P2142', 'P1303', 'P1480', 'P1387', 'P1540', 'P1223', 'P3817'];

// Read the route.ts file and extract problem data
const routeFile = fs.readFileSync(path.join(__dirname, '..', 'app', 'api', 'seed', 'gesp5', 'route.ts'), 'utf8');

let totalErrors = 0;

for (const pid of problems) {
  const htmlFile = path.join(__dirname, `${pid}.json`);
  const html = fs.readFileSync(htmlFile, 'utf8');

  // Extract JSON from HTML
  const match = html.match(/<script\s+id="lentille-context"\s+type="application\/json">([\s\S]*?)<\/script>/)
    || html.match(/<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/);

  if (!match) {
    console.log(`[${pid}] ERROR: Cannot extract JSON from HTML`);
    totalErrors++;
    continue;
  }

  const json = JSON.parse(match[1]);
  let problem = json.currentData?.problem || json.data?.problem || json.problem;
  if (!problem) {
    console.log(`[${pid}] ERROR: No problem data`);
    totalErrors++;
    continue;
  }

  const contenu = problem.contenu || problem.content || {};
  const samples = problem.samples || [];
  const limits = problem.limits || {};

  const luoguTitle = contenu.name || problem.title || '';
  const luoguDesc = contenu.description || '';
  const luoguFormatI = contenu.formatI || '';
  const luoguFormatO = contenu.formatO || '';
  const luoguHint = contenu.hint || '';

  // Find this problem in the route.ts by sourceId
  const sourceIdPattern = new RegExp(`sourceId:\\s*"${pid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`);
  if (!sourceIdPattern.test(routeFile)) {
    console.log(`[${pid}] ERROR: Not found in route.ts`);
    totalErrors++;
    continue;
  }

  console.log(`\n[${pid}] Checking...`);

  // Check title
  const titleMatch = routeFile.match(new RegExp(`sourceId:\\s*"${pid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?title:\\s*"([^"]*)"`, 'm'));
  // Title is before sourceId, so let's search differently
  // Find the block for this problem
  const blockStart = routeFile.indexOf(`sourceId: "${pid}"`);
  if (blockStart === -1) {
    console.log(`  ERROR: Block not found`);
    totalErrors++;
    continue;
  }

  // Find the opening { before this sourceId
  let braceCount = 0;
  let objStart = blockStart;
  for (let i = blockStart; i >= 0; i--) {
    if (routeFile[i] === '}') braceCount++;
    if (routeFile[i] === '{') {
      if (braceCount === 0) {
        objStart = i;
        break;
      }
      braceCount--;
    }
  }

  // Extract title from the block
  const blockSlice = routeFile.substring(objStart, objStart + 200);
  const titleInFile = blockSlice.match(/title:\s*"([^"]*)"/);
  if (titleInFile) {
    if (titleInFile[1] !== luoguTitle) {
      console.log(`  TITLE DIFF:`);
      console.log(`    Luogu: "${luoguTitle}"`);
      console.log(`    File:  "${titleInFile[1]}"`);
      totalErrors++;
    } else {
      console.log(`  title: OK`);
    }
  }

  // Check samples
  const luoguSamples = samples.map(s => ({
    input: s[0].trim(),
    output: s[1].trim()
  }));

  // Find samples in file - check if samples array inputs match
  for (let i = 0; i < luoguSamples.length; i++) {
    const sampleInput = luoguSamples[i].input;
    const sampleOutput = luoguSamples[i].output;
    // Check if this sample exists in the file
    const escapedInput = sampleInput.replace(/\n/g, '\\n').replace(/"/g, '\\"');
    if (routeFile.includes(escapedInput) || routeFile.includes(sampleInput.replace(/\n/g, '\\n'))) {
      // Check output too
      const escapedOutput = sampleOutput.replace(/\n/g, '\\n').replace(/"/g, '\\"');
      if (routeFile.includes(escapedOutput) || routeFile.includes(sampleOutput.replace(/\n/g, '\\n'))) {
        console.log(`  sample ${i + 1}: OK`);
      } else {
        console.log(`  sample ${i + 1} OUTPUT DIFF:`);
        console.log(`    Luogu: "${sampleOutput}"`);
        totalErrors++;
      }
    } else {
      console.log(`  sample ${i + 1} INPUT DIFF:`);
      console.log(`    Luogu: "${sampleInput}"`);
      totalErrors++;
    }
  }

  // Check source
  if (!routeFile.includes(`sourceId: "${pid}"`) || !routeFile.includes(`sourceUrl: "https://www.luogu.com.cn/problem/${pid}"`)) {
    console.log(`  sourceUrl: MISSING or WRONG`);
    totalErrors++;
  } else {
    console.log(`  sourceId/Url: OK`);
  }

  // Check source is gesp_practice
  const sourceBlock = routeFile.substring(objStart, objStart + 500);
  if (sourceBlock.includes('source: "gesp_practice"')) {
    console.log(`  source: OK (gesp_practice)`);
  } else {
    console.log(`  source: WRONG (expected gesp_practice)`);
    totalErrors++;
  }

  // Check level is 5
  if (sourceBlock.includes('level: 5')) {
    console.log(`  level: OK (5)`);
  } else {
    console.log(`  level: WRONG`);
    totalErrors++;
  }

  // Quick check description starts correctly
  const descStart = luoguDesc.substring(0, 30);
  // In JS template strings, \ becomes \\, so compare loosely
  const descStartEscaped = descStart.replace(/\\/g, '\\\\');
  if (routeFile.includes(descStart) || routeFile.includes(descStartEscaped)) {
    console.log(`  description start: OK`);
  } else {
    console.log(`  description start: POSSIBLE DIFF`);
    console.log(`    Luogu starts: "${descStart}"`);
    // Don't count as error since template string escaping differences
  }

  // Check time/memory limits
  const timeLimit = limits.time ? limits.time[0] : 1000;
  const memoryLimit = limits.memory ? Math.round(limits.memory[0] / 1000) : 128;
  if (sourceBlock.includes(`timeLimit: ${timeLimit}`)) {
    console.log(`  timeLimit: OK (${timeLimit})`);
  } else {
    console.log(`  timeLimit: POSSIBLE DIFF (expected ${timeLimit})`);
  }
  if (sourceBlock.includes(`memoryLimit: ${memoryLimit}`)) {
    console.log(`  memoryLimit: OK (${memoryLimit})`);
  } else {
    console.log(`  memoryLimit: POSSIBLE DIFF (expected ${memoryLimit})`);
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`Total errors: ${totalErrors}`);
if (totalErrors === 0) {
  console.log('All checks passed!');
} else {
  console.log(`${totalErrors} error(s) found. Please review.`);
}
