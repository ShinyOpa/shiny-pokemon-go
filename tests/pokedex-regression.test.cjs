// Run with: node tests/pokedex-regression.test.cjs
// Static checks only; image HTTP and visual checks are separate.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const html = fs.readFileSync('index.html', 'utf8');
const variantsBlock = html.split('const costumeVariants=')[1].split('const otherVariants=')[0];
const variants = [...variantsBlock.matchAll(/\[(\d+),"([^"]+)"\]/g)].map(m => ({
  dex: Number(m[1]), name: m[2],
  id: 'costume-'+m[1]+'-'+m[2].toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
}));
const art = html.split('const automaticCostumeArt=')[1].split('function costumeImage')[0];
const mapped = new Set([...art.matchAll(/"(costume-[^"]+)":"https:\/\/[^"]+"/g)].map(m=>m[1]));
const missing = variants.filter(v => !mapped.has(v.id));
assert.equal(variants.length, 182, 'Unexpected costume catalog change: review additions explicitly');
assert.equal(missing.length, 16, 'Mapping coverage changed: update audited baseline after review');
for(const id of [
 'costume-25-halloween-2026-pikachu-hat-and-capelet',
 'costume-41-halloween-2026-zubat-top-hat',
 'costume-42-halloween-2026-golbat-top-hat',
 'costume-169-halloween-2026-crobat-top-hat',
 'costume-25-varsity-jacket-pikachu',
 'costume-25-baseball-shirt-pikachu',
 'costume-176-flower-crown-togetic',
 'costume-25-pikachu-ph-d'
]) assert(mapped.has(id), 'Missing expected mapping: '+id);
assert(html.includes('const originalCostumeArt={...automaticCostumeArt}'), 'Original mapping fallback removed');
assert(html.includes("const regionEligible=(!x.kind&&!x.form&&x.shinyForm!==true)"), 'Normal-only region filter removed');
assert(html.includes("rf==='Hisui'&&!!x.form"), 'Hisui regional forms excluded');
assert(html.includes("if(active)el('regionFilter').value='all'"), 'Shiny catalog must clear region filter');
assert(html.includes("localStorage.setItem('shinyGO_test_regions_v1'"), 'Existing quantity storage key changed');
console.log('Static checks passed: '+variants.length+' costumes; '+missing.length+' unmapped. Browser and visual checks still required.');
