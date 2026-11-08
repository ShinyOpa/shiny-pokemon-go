/* Pure merge/validation functions shared by the browser and regression tests. */
(function(root){
  'use strict';
  function validQty(q){return Number.isSafeInteger(q)&&q>=0&&q<=1000000;}
  function validate(payload){
    if(!payload||typeof payload!=='object'||Array.isArray(payload)||!payload.quantities||typeof payload.quantities!=='object'||Array.isArray(payload.quantities)||!Array.isArray(payload.backgrounds))throw Error('Ongeldige online verzameling');
    const quantities=Object.create(null);
    for(const [id,q] of Object.entries(payload.quantities)){
      if(!/^[a-zA-Z0-9-]{1,180}$/.test(id)||!validQty(q))throw Error('Ongeldige online aantallen');
      quantities[id]=q;
    }
    if(Object.keys(quantities).length>12000||payload.backgrounds.length>3000)throw Error('Verzameling te groot');
    const backgrounds=payload.backgrounds.map(b=>{
      if(!b||typeof b.id!=='string'||!/^background-[a-zA-Z0-9-]{1,160}$/.test(b.id)||!Number.isInteger(b.dex)||b.dex<1||b.dex>1025||typeof b.name!=='string'||b.name.length>200||/[<>]/.test(b.name))throw Error('Ongeldige online achtergrond');
      return {id:b.id,dex:b.dex,name:b.name,kind:'background',qty:quantities[b.id]||0};
    });
    return {quantities,backgrounds};
  }
  function snapshot(rows){
    const quantities=Object.create(null);
    for(const r of rows)quantities[String(r.id)]=r.qty;
    return validate({quantities,backgrounds:rows.filter(r=>r.kind==='background').map(r=>({id:r.id,dex:r.dex,name:r.name}))});
  }
  function merge(remote,pending,backgrounds){
    const clean=validate(remote), quantities=Object.assign(Object.create(null),clean.quantities,pending);
    const byId=new Map(clean.backgrounds.map(b=>[b.id,b]));
    for(const b of backgrounds)byId.set(b.id,b);
    return validate({quantities,backgrounds:[...byId.values()]});
  }
  const api={validate,snapshot,merge,validQty};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.PokedexSyncCore=api;
})(globalThis);
