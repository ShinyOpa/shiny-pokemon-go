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
assert(variants.some(v=>v.dex===854&&v.name==='Antique Sinistea (Halloween bow)'), 'Sinistea must use National Pokédex #854');
assert(!variants.some(v=>v.dex===1001&&v.name.includes('Sinistea')), 'Old incorrect Sinistea dex number returned');
assert(html.includes("legacyKey=kind==='costume'&&dex===854"), 'Legacy Sinistea collection-count migration removed');
const confirmedBlock = html.split('const confirmedShinyCostumes=new Set(')[1].split(');')[0];
const confirmedIds = [...confirmedBlock.matchAll(/"([^"]+)"/g)].map(m=>m[1]);
const variantIds = new Set(variants.map(v=>v.id));
assert.equal(confirmedIds.filter(id=>!variantIds.has(id)).length, 0, 'Confirmed costumes must match actual catalog IDs exactly');
assert(confirmedIds.includes('costume-854-antique-sinistea-halloween-bow'), 'Corrected Sinistea costume must count in Shiny collection');
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
assert(html.includes("const regionEligible=!x.kind&&x.shinyForm!==true&&(!x.form||!!formRegion)"), 'Normal-only regional filter removed');
assert(html.includes("formRegion?formRegion===rf"), 'Regional forms must match their own region, not their national Pokédex number');
for(const [form,region] of [['hisui','Hisui'],['alola','Alola'],['galar','Galar']]) assert(html.includes("String(x.form).toLowerCase().includes('"+form+"')"), 'Missing '+region+' form detection');
assert(html.includes("rf==='all'||(regionEligible"), 'Region filter must reject out-of-region Pokémon');
assert(html.includes("if(active)el('regionFilter').value='all'"), 'Shiny catalog must clear region filter');
assert(html.includes("localStorage.setItem('shinyGO_test_regions_v1'"), 'Existing quantity storage key changed');
// Guard against regressions that previously broke startup or costume fallbacks.
assert(html.includes('function savedCollectionRows(){try{'), 'Safe collection reader removed');
assert(html.includes("data.filter(x=>x&&typeof x==='object'&&!Array.isArray(x))"), 'Malformed saved collection rows must be ignored');
for(const name of ['addRegionals','addShadowVariants','addExpandedVariants','expandDex']){
  const start=html.indexOf('function '+name+'()');
  assert(start>=0, 'Missing function '+name);
  const end=html.indexOf('\nfunction ',start+1);
  const body=html.slice(start,end<0?undefined:end);
  assert(body.includes('savedCollectionRows()'), name+' does not use safe saved-data reader');
}
assert(html.includes('dataset.costumeTried'), 'Costume fallback retry-loop guard removed');
assert(html.includes("if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))saved=parsed"), 'Costume fallback must tolerate invalid localStorage');
assert(html.includes('const next=unique.find(u=>!attempted.includes(u))'), 'Costume fallback must skip previously failed URLs');
const gmaxBlock = html.split('const gigantamaxFormSprites=')[1].split(';')[0];
const gmaxMap = JSON.parse(gmaxBlock);
assert.equal(Object.keys(gmaxMap).length, 30, 'Review any change to the Gigantamax artwork candidates');
for(const [dex,id] of [[3,10195],[6,10196],[9,10197],[12,10198],[25,10199],[52,10200],[68,10201],[94,10202],[99,10203],[131,10204]]) assert.equal(gmaxMap[dex],id, 'Wrong Gigantamax form for dex '+dex);
assert(!gmaxMap[849]&&!gmaxMap[892], 'Do not guess ambiguous Toxtricity or Urshifu forms');
const gmaxCatalog = [...html.matchAll(/\[(\d+),"Gigantamax ([^"]+)"\]/g)].map(m => ({dex:Number(m[1]),name:m[2]}));
assert.equal(gmaxCatalog.length,20,'Review changes to the Gigantamax catalog explicitly');
assert(gmaxCatalog.some(x=>x.name==='Toxtricity (Amped)')&&gmaxCatalog.some(x=>x.name==='Toxtricity (Low Key)'),'Both Toxtricity forms must remain in the catalog');
assert(html.includes('10219')&&html.includes('10228'),'Both distinct Toxtricity form sprites required');
assert(html.includes("x.name==='Gigantamax Toxtricity (Amped)'?10219"),'Amped must resolve to its own sprite');
assert(html.includes("x.name==='Gigantamax Toxtricity (Low Key)'?10228"),'Low Key must resolve to its own sprite');
assert(html.includes('[849,"Gigantamax Toxtricity"],[849,"Gigantamax Toxtricity (Amped)"]'),'Legacy Toxtricity entry must remain until saved counts can be migrated safely');

assert(gmaxCatalog.some(x=>x.dex===133&&x.name==='Eevee'),'Gigantamax Eevee missing from catalog');
assert.deepEqual(gmaxCatalog.filter(x=>!gmaxMap[x.dex]).map(x=>x.name),['Toxtricity','Toxtricity (Amped)','Toxtricity (Low Key)'],'Toxtricity uses dedicated form-specific artwork rather than species mapping');

assert(html.includes('battleArtwork(x,rf!==\'all\'&&regionEligible)'), 'Battle art must use form-aware URL resolver');
assert(html.includes('function hydrateRegionalArtwork()'), 'Regional forms must load their own artwork');
assert(html.includes("encodeURIComponent(slug)"), 'Regional form lookup must use exact form slug');
assert(html.includes("regionalArtCache[x.form]||''"), 'Do not display incorrect base species art for regional forms');
assert(html.includes("if(x.form)return regionalArtCache[x.form]||''"), 'All Pokémon must show actual regional form art too');
assert(html.includes("(x.form?'data-region-form="), 'Every regional form image must be hydrated');
assert(html.includes('hydrateRegionalArtwork()}'), 'Regional artwork must hydrate after rendering');
assert(html.includes("if(img.getAttribute('src')!==regionalArtCache[slug])img.src=regionalArtCache[slug]"), 'Cached regional artwork must be restored after every rerender');
assert(html.includes("note.textContent.replace('Gigantamax-vorm','basisafbeelding')"), 'Failed Gigantamax art must be labeled as fallback');
console.log('Static checks passed: '+variants.length+' costumes; '+missing.length+' unmapped. Browser and visual checks still required.');
