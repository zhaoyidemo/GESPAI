const fs = require('fs');
const path = require('path');

const problems = ['P2957', 'CF3A', 'P4995', 'P1208', 'P1601', 'P2142', 'P1303', 'P1480', 'P1387', 'P1540', 'P1223', 'P3817'];

for (const pid of problems) {
  const filePath = path.join(__dirname, `${pid}.json`);
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(raw);

    const problem = json.currentData?.problem || json.data?.problem;
    if (!problem) {
      console.log(`\n=== ${pid}: ERROR - no problem data found ===`);
      console.log('Keys:', Object.keys(json));
      if (json.currentData) console.log('currentData keys:', Object.keys(json.currentData));
      continue;
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
  } catch (e) {
    console.log(`\n=== ${pid}: ERROR reading file ===`, e.message);
  }
}
