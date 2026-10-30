/* Abel Automation V13 · Proyectos del navegador.
   No sincroniza ni envía datos. Por privacidad, elimina contacto y foto en base64. */
(function(root,factory){const api=factory(root.AbelWebExportV12);if(typeof module!=='undefined'&&module.exports)module.exports=api;root.AbelProjectsV13=api;})(typeof globalThis!=='undefined'?globalThis:this,(E)=>{
'use strict';
const KEY='abel-automation-v13-projects',DRAFT_KEY='abel-automation-v13-draft';
const MAX=12,MAX_SIZE=180000;
function safeProject(raw){
 if(!E)throw Error('Motor V12 no disponible');
 const p=E.normalize(raw);
 // Almacenamiento NO cifrado: nunca guardar correos, teléfonos, direcciones ni fotografías personales.
 const available=['home','about','services','gallery','contact'];
 const rawPages=Array.isArray(raw?.v14?.pages)?raw.v14.pages:available;
 const pages=available.filter(id=>rawPages.includes(id));if(!pages.includes('home'))pages.unshift('home');
 const v14={multipage:raw?.v14?.multipage===true,pages};
 const V15=root.AbelPageStudioV15;
 const v15=V15?V15.normalize(raw?.v15||{}):undefined;
 if(v15)v15.media=[]; // This local library is not encrypted. Images stay in explicit export only.
 return {...p,email:'',phone:'',location:'',customPhoto:'',v14,...(v15?{v15}:{})};
}
const cleanName=x=>String(x||'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,65)||'Proyecto sin nombre';
function safeRecord(x){
 if(!x||typeof x!=='object'||!(/^[a-z0-9-]{8,80}$/i).test(x.id))return null;
 const data=safeProject(x.data);
 const item={id:x.id,name:cleanName(x.name),updated:typeof x.updated==='string'?x.updated.slice(0,24):'',data};
 return JSON.stringify(item).length>MAX_SIZE?null:item;
}
function list(store=localStorage){
 try{const parsed=JSON.parse(store.getItem(KEY)||'[]');
  if(!Array.isArray(parsed))return [];
  return parsed.slice(0,MAX).map(safeRecord).filter(Boolean);
 }catch{return [];}
}
function write(records,store=localStorage){
 try{store.setItem(KEY,JSON.stringify(records.slice(0,MAX)));return true;}catch{return false;}
}
function create(data,name,store=localStorage){
 const now=new Date().toISOString();
 const id=typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():'project-'+Date.now()+'-'+Math.random().toString(36).slice(2,10);
 const record=safeRecord({id,name:name||data?.brand||'Proyecto',updated:now,data});
 if(!record)throw Error('Proyecto demasiado grande o incorrecto');
 const others=list(store);
 const all=[record,...others.filter(x=>x.id!==id)].slice(0,MAX);
 if(!write(all,store))throw Error('Almacenamiento local no disponible o lleno');
 return record;
}
function modify(id,update,store=localStorage){
 const all=list(store),idx=all.findIndex(x=>x.id===id);
 if(idx<0)throw Error('Proyecto no encontrado');
 const current=all[idx],next=safeRecord({...current,...update,id,updated:new Date().toISOString()});
 if(!next)throw Error('Contenido inválido');
 all.splice(idx,1);all.unshift(next);
 if(!write(all,store))throw Error('No hay espacio en el navegador');
 return next;
}
function remove(id,store=localStorage){
 const all=list(store),rest=all.filter(x=>x.id!==id);
 if(rest.length===all.length)return false;
 if(!write(rest,store))throw Error('No se pudieron guardar los cambios');
 return true;
}
function duplicate(id,store=localStorage){
 const old=list(store).find(x=>x.id===id);if(!old)throw Error('Proyecto no encontrado');
 return create(old.data,old.name+' · copia',store);
}
function saveDraft(data,store=localStorage){
 try{const value=JSON.stringify(safeProject(data));
  if(value.length>MAX_SIZE)return false;
  store.setItem(DRAFT_KEY,value);return true;
 }catch{return false;}
}
function draft(store=localStorage){
 try{const data=store.getItem(DRAFT_KEY);if(!data||data.length>MAX_SIZE)return null;
  const parsed=JSON.parse(data);if(parsed?.version!==12)return null;
  return safeProject(parsed);
 }catch{return null;}
}
function clearDraft(store=localStorage){try{store.removeItem(DRAFT_KEY);return true;}catch{return false;}}
function open(id,store=localStorage){
 const found=list(store).find(x=>x.id===id);return found?safeProject(found.data):null;
}
return {KEY,DRAFT_KEY,MAX,safeProject,list,create,modify,remove,duplicate,saveDraft,draft,clearDraft,open};
});
