/* V14: metadatos y versiones locales, aislados del formato V13 y sin datos sensibles. */
(function(root,factory){const api=factory(root.AbelProjectsV13);if(typeof module!=='undefined'&&module.exports)module.exports=api;root.AbelProjectsV14=api;})(typeof globalThis!=='undefined'?globalThis:this,(Store)=>{
'use strict';
const KEY='abel-automation-v14-project-history',MAX_HISTORY=4;
const safeId=id=>typeof id==='string'&&/^[a-z0-9-]{8,80}$/i.test(id);
function read(storage=localStorage){
 try{const obj=JSON.parse(storage.getItem(KEY)||'{}');
  return obj&&typeof obj==='object'&&!Array.isArray(obj)?obj:{};
 }catch{return {};}
}
function write(obj,storage=localStorage){
 try{storage.setItem(KEY,JSON.stringify(obj));return true;}catch{return false;}
}
function get(id,storage=localStorage){
 if(!safeId(id))return {favorite:false,tag:'Sin categoría',history:[]};
 const found=read(storage)[id],p=found&&typeof found==='object'?found:{};
 return {favorite:p.favorite===true,tag:['Sin categoría','Por preparar','En diseño','En revisión','Entregado'].includes(p.tag)?p.tag:'Sin categoría',
  history:Array.isArray(p.history)?p.history.slice(0,MAX_HISTORY).filter(x=>x&&typeof x==='object'&&x.data).map(x=>({
   date:String(x.date||'').slice(0,24),data:Store.safeProject(x.data)
  })):[]};
}
function setMeta(id,values,storage=localStorage){
 if(!safeId(id)||!Store.list(storage).some(x=>x.id===id))throw Error('Proyecto inexistente');
 const obj=read(storage),prior=get(id,storage),next={...prior};
 if(Object.hasOwn(values,'favorite'))next.favorite=values.favorite===true;
 if(Object.hasOwn(values,'tag')&&['Sin categoría','Por preparar','En diseño','En revisión','Entregado'].includes(values.tag))next.tag=values.tag;
 obj[id]=next;if(!write(obj,storage))throw Error('No se pudo guardar la categoría');
 return next;
}
function snapshot(id,storage=localStorage){
 const item=Store.list(storage).find(x=>x.id===id);if(!item)throw Error('Proyecto inexistente');
 const obj=read(storage),prev=get(id,storage),version={date:new Date().toISOString(),data:Store.safeProject(item.data)};
 const history=[version,...prev.history].slice(0,MAX_HISTORY);
 obj[id]={...prev,history};
 if(!write(obj,storage))throw Error('No se pudo guardar la versión');
 return history;
}
function restore(id,index,storage=localStorage){
 const historic=get(id,storage).history[index];
 if(!historic)throw Error('Versión no encontrada');
 const current=Store.list(storage).find(x=>x.id===id);
 if(!current)throw Error('Proyecto inexistente');
 Store.modify(id,{data:historic.data},storage);
 return Store.open(id,storage);
}
function forget(id,storage=localStorage){
 const obj=read(storage);delete obj[id];return write(obj,storage);
}
function visible(records,{search='',tag='all',favorites=false}={},storage=localStorage){
 const q=String(search).toLocaleLowerCase('es').slice(0,80);
 return (Array.isArray(records)?records:[]).filter(item=>{
  const meta=get(item.id,storage);
  return (!q||[item.name,item.data?.brand,item.data?.sector].some(x=>String(x||'').toLocaleLowerCase('es').includes(q)))&&
   (tag==='all'||meta.tag===tag)&&(!favorites||meta.favorite);
 });
}
return {KEY,MAX_HISTORY,get,setMeta,snapshot,restore,forget,visible};
});
