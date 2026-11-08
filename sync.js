(function(){
  'use strict';
  const KEY='pokedex-sync-v1', core=PokedexSyncCore, $=id=>document.getElementById(id);
  let state=null, busy=false, timer, generation=0;
  try{state=JSON.parse(localStorage.getItem(KEY)||'null');}catch{}
  function status(message){$('syncStatus').textContent=message;}
  function persist(){localStorage.setItem(KEY,JSON.stringify(state));}
  function enabled(){return !!(state&&state.url&&state.key&&state.secret);}
  let observed=core.snapshot(rows);
  function apply(payload){
    const clean=core.validate(payload);
    for(const b of clean.backgrounds)if(!rows.some(r=>String(r.id)===b.id))rows.push({...b});
    for(const r of rows)r.qty=clean.quantities[String(r.id)]||0;
    localStorage.setItem('shinyGO_test_regions_v1',JSON.stringify(rows));
    observed=core.snapshot(rows);render();
  }
  function track(){
    const next=core.snapshot(rows);
    if(enabled()){
      state.pending=state.pending||{};
      for(const [id,q] of Object.entries(next.quantities))if(observed.quantities[id]!==q)state.pending[id]=q;
      state.backgrounds=next.backgrounds.filter(b=>!observed.backgrounds.some(o=>o.id===b.id)).concat(state.backgrounds||[]);
      persist();status(navigator.onLine?'Wijzigingen worden gesynchroniseerd…':'Offline — wijzigingen staan op dit apparaat klaar.');schedule();
    }
    observed=next;
  }
  const originalSave=save;
  save=function(){originalSave();try{track();}catch(e){status('Synchronisatie: '+e.message);}};
  function config(){
    const url=$('syncUrl').value.trim().replace(/\/$/,'');
    const key=$('syncKey').value.trim();
    if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url))throw Error('Vul de Supabase Project URL in (https://….supabase.co).');
    let anonymous=false;
    if(key.startsWith('eyJ')){try{anonymous=JSON.parse(atob(key.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).role==='anon';}catch{}}
    if(!/^sb_publishable_[A-Za-z0-9_-]+$/.test(key)&&!anonymous)throw Error('Gebruik uitsluitend de publishable key of anon key.');
    return {url,key};
  }
  async function rpc(cfg,action,revision=null,payload=null){
    const controller=new AbortController(), timeout=setTimeout(()=>controller.abort(),15000);
    try{
      const response=await fetch(cfg.url+'/rest/v1/rpc/pokedex_sync',{
        method:'POST',headers:{'Content-Type':'application/json',apikey:cfg.key},
        body:JSON.stringify({p_secret:cfg.secret,p_action:action,p_revision:revision,p_payload:payload}),signal:controller.signal
      });
      const data=await response.json();
      if(!response.ok)throw Error(response.status===404?'Voer eerst de database-instelling uit.':(data.message||'Online opslag niet bereikbaar'));
      if(!Number.isSafeInteger(data.revision)||data.revision<1)throw Error('Ongeldig antwoord van online opslag');
      data.payload=core.validate(data.payload);return data;
    }finally{clearTimeout(timeout);}
  }
  function schedule(){clearTimeout(timer);timer=setTimeout(sync,900);}
  async function sync(){
    if(!enabled()||busy)return;
    if(!navigator.onLine){status('Offline — wijzigingen staan op dit apparaat klaar.');return;}
    busy=true;const active=state, epoch=generation;
    try{
      status('Synchroniseren…');
      let remote=await rpc(active,'read');
      for(let attempt=0;attempt<5;attempt++){
        if(epoch!==generation)return;
        const pending={...(active.pending||{})}, backgrounds=[...(active.backgrounds||[])];
        if(!Object.keys(pending).length&&!backgrounds.length){
          apply(remote.payload);active.lastSync=new Date().toISOString();persist();
          status('Bijgewerkt om '+new Date(active.lastSync).toLocaleTimeString('nl-NL',{hour:'2-digit',minute:'2-digit'}));return;
        }
        const merged=core.merge(remote.payload,pending,backgrounds);
        const result=await rpc(active,'write',remote.revision,merged);
        if(epoch!==generation)return;
        if(result.ok){
          for(const [id,q] of Object.entries(pending))if(active.pending[id]===q)delete active.pending[id];
          active.backgrounds=(active.backgrounds||[]).filter(b=>!backgrounds.some(sent=>sent.id===b.id&&sent.name===b.name));
          persist();remote=result;
        }else remote=result;
      }
      status('Nog wijzigingen in de wachtrij; nieuwe poging volgt.');schedule();
    }catch(e){if(epoch===generation)status('Nog niet gesynchroniseerd — '+(e.name==='AbortError'?'verbinding duurde te lang.':e.message)+'. Lokale aantallen blijven bewaard.');}
    finally{busy=false;}
  }
  function lock(value){for(const id of ['syncCreate','syncJoin','syncDisconnect','syncNow'])$(id).disabled=value;}
  function makeSecret(){return Array.from(crypto.getRandomValues(new Uint8Array(32)),x=>x.toString(16).padStart(2,'0')).join('');}
  function pairingCode(cfg){return 'PGO1.'+btoa(JSON.stringify({url:cfg.url,key:cfg.key,secret:cfg.secret}));}
  function showCode(){
    if(!enabled()){status('Maak eerst een koppeling.');return;}
    $('syncCode').value=pairingCode(state);$('syncCodeArea').hidden=false;
  }
  $('syncCreate').onclick=async()=>{
    if(busy||enabled()){status('Verbreek eerst de huidige koppeling om een nieuwe te maken.');return;}
    busy=true;lock(true);
    try{
      const cfg={...config(),secret:makeSecret()}, initial=core.snapshot(rows);
      status('Online verzameling aanmaken…');await rpc(cfg,'create',null,initial);
      state={...cfg,pending:{},backgrounds:[],lastSync:new Date().toISOString()};generation++;persist();
      observed=initial;track();showCode();status('Gekoppeld. Gebruik de koppelcode op je andere apparaat.');
    }catch(e){status('Koppelen niet gelukt: '+e.message);}finally{busy=false;lock(false);}
  };
  $('syncJoin').onclick=async()=>{
    if(busy||enabled()){status('Verbreek eerst de huidige koppeling om een andere te gebruiken.');return;}
    busy=true;lock(true);
    try{
      const code=$('syncImportCode').value.trim();if(!code.startsWith('PGO1.')||code.length>5000)throw Error('Ongeldige koppelcode');
      const cfg=JSON.parse(atob(code.slice(5)));
      $('syncUrl').value=cfg.url;$('syncKey').value=cfg.key;
      const checked={...config(),secret:cfg.secret};
      if(!/^[a-f0-9]{64}$/.test(checked.secret))throw Error('Ongeldige koppelcode');
      status('Verzameling controleren…');const remote=await rpc(checked,'read');
      if(!confirm('Dit apparaat neemt de online aantallen over. De huidige aantallen worden eerst als lokale herstelkopie bewaard. Doorgaan?')){status('Koppelen geannuleerd.');return;}
      localStorage.setItem('pokedex-before-sync',JSON.stringify(rows));
      state={...checked,pending:{},backgrounds:[]};generation++;persist();apply(remote.payload);
      $('syncImportCode').value='';status('Gekoppeld. Automatische synchronisatie staat aan.');
    }catch(e){status('Koppelen niet gelukt: '+e.message);}finally{busy=false;lock(false);}
  };
  $('syncDisconnect').onclick=()=>{
    if(busy)return;
    if(!confirm('Synchronisatie op dit apparaat uitzetten? Je lokale aantallen blijven staan.'))return;
    generation++;state=null;localStorage.removeItem(KEY);$('syncCode').value='';$('syncCodeArea').hidden=true;
    status('Niet gekoppeld. Je aantallen worden lokaal bewaard.');
  };
  $('syncShowCode').onclick=showCode;
  $('syncCopyCode').onclick=async()=>{
    try{await navigator.clipboard.writeText($('syncCode').value);status('Koppelcode gekopieerd. Bewaar deze privé.');}
    catch{$('syncCode').select();status('Selecteer en kopieer de koppelcode.');}
  };
  $('syncNow').onclick=sync;
  $('syncRecover').onclick=()=>{
    const backup=localStorage.getItem('pokedex-before-sync');
    if(!backup){status('Geen herstelkopie aanwezig.');return;}
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([backup],{type:'application/json'}));a.download='pokedex-voor-koppelen.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  };
  if(enabled()){$('syncUrl').value=state.url;$('syncKey').value=state.key;status('Gekoppeld — synchronisatie controleren…');sync();}
  else status('Nog niet gekoppeld — eenmalige online instelling nodig.');
  setInterval(()=>{if(document.visibilityState==='visible')sync();},15000);
  window.addEventListener('online',sync);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')sync();});
  window.addEventListener('storage',e=>{
    if(e.key===KEY){try{state=JSON.parse(e.newValue||'null');generation++;}catch{}schedule();}
    if(e.key==='shinyGO_test_regions_v1'){location.reload();}
  });
})();
