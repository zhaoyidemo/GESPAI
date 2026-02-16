const fs = require('fs');
const path = require('path');

const problems = ['P2957', 'CF3A', 'P4995', 'P1208', 'P1601', 'P2142', 'P1303', 'P1480', 'P1387', 'P1540', 'P1223', 'P3817'];

for (const pid of problems) {
  const filePath = path.join(__dirname, `${pid}.json`);
  try {
    const html = fs.readFileSync(filePath, 'utf8');

    // Try to extract JSON from <script id="lentille-context" type="application/json">
    const match = html.match(/<script\s+id="lentille-context"\s+type="application\/json">([\s\S]*?)<\/script>/);
    if (!match) {
      // Try alternate pattern
      const match2 = html.match(/<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/);
      if (!match2) {
        console.log(`\n=== ${pid}: No JSON script tag found ===`);
        // Try to find any JSON-like content
        const jsonMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});/);
        if (jsonMatch) {
          console.log(`Found __INITIAL_STATE__`);
        }
        continue;
      }
      console.log(`\n=== ${pid}: Found alternate JSON tag ===`);
      try {
        const json = JSON.parse(match2[1]);
        processJson(pid, json);
      } catch(e) {
        console.log(`Parse error: ${e.message}`);
      }
      continue;
    }

    const json = JSON.parse(match[1]);
    processJson(pid, json);
  } catch (e) {
    console.log(`\n=== ${pid}: ERROR ===`, e.message);
  }
}

function processJson(pid, json) {
  // Navigate to problem data - try various paths
  let problem = null;
  if (json.currentData?.problem) problem = json.currentData.problem;
  else if (json.data?.problem) problem = json.data.problem;
  else if (json.problem) problem = json.problem;

  if (!problem) {
    console.log(`\n=== ${pid}: No problem in JSON ===`);
    console.log('Top keys:', Object.keys(json));
    if (json.currentData) console.log('currentData keys:', Object.keys(json.currentData));
    return;
  }

  const contenu = problem.contenu || problem.content || {};
  const samples = problem.samples || [];
  const limits = problem.limits || {};
  const difficulty = problem.difficulty || 0;

  console.log(`\n${'='.repeat(80)}`);
  console.log(`=== ${pid} ===`);
  console.log(`Title: ${contenu.name || problem.title || 'N/A'}`);
  console.log(`Difficulty: ${difficulty}`);
  console.log(`Time Limit: ${JSON.stringify(limits.time)}`);
  console.log(`Memory Limit: ${JSON.stringify(limits.memory)}`);
  console.log(`\n--- description ---`);
  console.log(contenu.description || 'N/A');
  console.log(`\n--- inputFormat ---`);
  console.log(contenu.formatI || 'N/A');
  console.log(`\n--- outputFormat ---`);
  console.log(contenu.formatO || 'N/A');
  console.log(`\n--- samples ---`);
  console.log(JSON.stringify(samples, null, 2));
  console.log(`\n--- hint ---`);
  console.log(contenu.hint || 'N/A');
  console.log(`${'='.repeat(80)}`);
}
