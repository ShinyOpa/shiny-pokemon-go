const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');
const core=require('./sync-core.js');
const remote={quantities:{'1':2,'4':3},backgrounds:[]};
assert.deepEqual({...core.merge(remote,{'1':0},[]).quantities},{'1':0,'4':3});
assert.equal(core.merge(remote,{'7':5},[]).quantities['4'],3);
assert.throws(()=>core.validate({quantities:{'1':-1},backgrounds:[]}));
assert.throws(()=>core.validate({quantities:{'1':1.5},backgrounds:[]}));
assert.throws(()=>core.validate({quantities:{'1':0},backgrounds:[{id:'background-1-test',dex:1,name:'<img onerror=alert(1)>'}]}));
assert.equal(core.merge(remote,{},[{id:'background-1-event',dex:1,name:'Bulbasaur · Event'}]).backgrounds.length,1);
assert.equal(core.merge(core.merge(remote,{},[{id:'background-1-event',dex:1,name:'Event'}]),{},[{id:'background-1-event',dex:1,name:'Event'}]).backgrounds.length,1);
let cloud={ok:true,revision:1,payload:{quantities:{'1':2,'4':3},backgrounds:[]}}, fail=false, conflict=false, injectedEdit;
const cfg={url:'https://example.supabase.co',key:'sb_publishable_test',secret:'a'.repeat(64),pending:{},backgrounds:[]};
function device(initial,cfgOverride=cfg){
 const local=new Map([['pokedex-sync-v1',JSON.stringify(cfgOverride)]]), elements=new Map();
 const get=id=>{if(!elements.has(id))elements.set(id,{textContent:'',value:'',hidden:true,disabled:false});return elements.get(id)};
 const context={PokedexSyncCore:core,rows:structuredClone(initial),render(){},save(){local.set('shinyGO_test_regions_v1',JSON.stringify(context.rows))},document:{getElementById:get,visibilityState:'visible',addEventListener(){}},navigator:{onLine:true},localStorage:{getItem:k=>local.get(k)||null,setItem:(k,v)=>local.set(k,v),removeItem:k=>local.delete(k)},window:{addEventListener(){}},setTimeout,clearTimeout,setInterval(){},AbortController,console,crypto:require('node:crypto').webcrypto,confirm:()=>true,atob,btoa,Blob,URL,Date,location:{reload(){}},fetch:async(url,opts)=>{
  if(fail)throw Error('Offline');
  const body=JSON.parse(opts.body);
  if(body.p_action==='read')return {ok:true,json:async()=>structuredClone(cloud)};
  if(body.p_action==='write'){
   if(conflict){cloud.revision++;cloud.payload.quantities['4']=9;conflict=false;return {ok:true,json:async()=>({...structuredClone(cloud),ok:false})}}
   if(body.p_revision!==cloud.revision)return {ok:true,json:async()=>({...structuredClone(cloud),ok:false})};
   cloud={ok:true,revision:cloud.revision+1,payload:body.p_payload};
   if(injectedEdit){const run=injectedEdit;injectedEdit=null;run()}
   return {ok:true,json:async()=>structuredClone(cloud)};
  }
  throw Error('unexpected action');
 }};
 vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/sync.js','utf8'),context);
 return {context,get,local};
}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
(async()=>{
 const a=device([{id:1,qty:2},{id:4,qty:3}]);await tick();
 a.context.rows[0].qty=7;a.context.save();conflict=true;
 await a.get('syncNow').onclick();
 assert.equal(cloud.payload.quantities['1'],7);assert.equal(cloud.payload.quantities['4'],9,'CAS retry preserves other device changes');
 assert.equal(a.context.rows[1].qty,9);
 const b=device([{id:1,qty:0},{id:4,qty:0}]);await tick();assert.equal(b.context.rows[0].qty,7,'second device downloads');
 fail=true;b.context.rows[0].qty=0;b.context.save();await b.get('syncNow').onclick();
 assert.equal(JSON.parse(b.local.get('pokedex-sync-v1')).pending['1'],0,'offline zero survives');
 assert.match(b.get('syncStatus').textContent,/Lokale aantallen/);
 fail=false;await b.get('syncNow').onclick();assert.equal(cloud.payload.quantities['1'],0);
 b.context.rows[0].qty=5;b.context.save();injectedEdit=()=>{b.context.rows[0].qty=8;b.context.save()};
 await b.get('syncNow').onclick();assert.equal(cloud.payload.quantities['1'],8,'edit during upload retained');
 await a.get('syncNow').onclick();assert.equal(a.context.rows[0].qty,8);
 const pendingCfg={...cfg,pending:{'4':12}};
 const c=device([{id:1,qty:8},{id:4,qty:12}],pendingCfg);await tick();await tick();assert.equal(cloud.payload.quantities['4'],12,'pending queue resumes after reload');
 c.get('syncDisconnect').onclick();assert.equal(c.local.has('pokedex-sync-v1'),false);assert.equal(c.context.rows[1].qty,12);
 console.log('PASS: validation, merge, CAS retry, two devices, offline zero, concurrent edit, reload recovery, disconnect');
 process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
