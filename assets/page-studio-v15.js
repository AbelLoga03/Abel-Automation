/* Abel Automation V15 · páginas independientes y biblioteca de imágenes local.
 * El JSON/ZIP exportado puede contener datos privados: no se sincroniza ni publica.
 * Los autoguardados V13/V14 excluyen la biblioteca de imágenes. */
(function(root,factory){const api=factory(root.AbelWebExportV12);if(typeof module!=='undefined'&&module.exports)module.exports=api;root.AbelPageStudioV15=api;})(typeof globalThis!=='undefined'?globalThis:this,E=>{
'use strict';
const IDS=['home','about','services','gallery','contact'];
const PHOTO_LIMIT=4,PHOTO_BYTES=1450000;
const VALID_TYPES={jpeg:'jpg',png:'png',webp:'webp'};
const safe=(x,n=220)=>String(typeof x==='string'?x:'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,n);
const goodImage=x=>typeof x==='string'&&x.length<PHOTO_BYTES*1.38+150&&/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(x);
const ext=x=>(String(x).match(/^data:image\/(png|jpeg|webp);/)||[])[1];
const assetName=(id,mime)=>'assets/v15-photo-'+id+'.'+VALID_TYPES[mime];
function normalize(x){
 const raw=x&&typeof x==='object'?x:{},pages={};
 for(const id of IDS){
  const item=raw.pages?.[id],p=item&&typeof item==='object'?item:{};
  const titles={};
  for(const [key,value]of Object.entries(p.titles||{})){
   if(Object.hasOwn(E.TITLES,key))titles[key]=safe(value,85);
  }
  const list=(items)=>Array.isArray(items)?items.slice(0,6).map(t=>safe(t,75)).filter(Boolean):[];
  pages[id]={
   headline:safe(p.headline,130),intro:safe(p.intro,240),cta:safe(p.cta,38),
   image:['template','custom',...Array.from({length:PHOTO_LIMIT},(_,i)=>'photo-'+(i+1))].includes(p.image)?p.image:'template',
   layout:['split','full','centered'].includes(p.layout)?p.layout:'',
   titles,services:list(p.services),products:list(p.products),
   sections:Array.isArray(p.sections)?[...new Set(p.sections.filter(s=>Object.hasOwn(E.TITLES,s)))].slice(0,15):[]
  };
 }
 const media=[];
 for(const entry of (Array.isArray(raw.media)?raw.media:[]).slice(0,PHOTO_LIMIT)){
  if(!entry||typeof entry!=='object'||!/^photo-[1-4]$/.test(entry.id)||!goodImage(entry.data))continue;
  if(media.some(x=>x.id===entry.id))continue;
  const type=ext(entry.data);
  if(!type)continue;
  media.push({id:entry.id,name:safe(entry.name,65)||'Fotografía',type,data:entry.data});
 }
 return {version:15,pages,media};
}
function effective(project,data,pageId){
 if(!IDS.includes(pageId))throw Error('Página inexistente');
 const base=E.normalize(project),studio=normalize(data),entry=studio.pages[pageId];
 const chosen=entry.sections.length?entry.sections:base.sections.filter(id=>id!=='hero'&&id!=='seo');
 const sects=['hero',...chosen];
 const page={...base,
  headline:entry.headline||base.headline,
  intro:entry.intro||base.intro,
  cta:entry.cta||base.cta,
  titles:{...base.titles,...entry.titles},
  sections:sects,layout:entry.layout||base.layout,
  services:entry.services.length?entry.services:base.services,
  products:entry.products.length?entry.products:base.products
 };
 return page;
}
function mediaFor(data,pageId){
 const model=normalize(data),name=model.pages[pageId]?.image;
 return model.media.find(x=>x.id===name)||null;
}
function attach(data,entry){
 const state=normalize(data);
 if(!entry||!goodImage(entry.data))throw Error('Imagen inválida; usa JPG, PNG o WebP de tamaño reducido');
 let i=1;while(i<=PHOTO_LIMIT&&state.media.some(x=>x.id==='photo-'+i))i++;
 if(i>PHOTO_LIMIT)throw Error('La biblioteca admite hasta cuatro fotos');
 const item={id:'photo-'+i,name:safe(entry.name,65)||'Imagen propia',type:ext(entry.data),data:entry.data};
 state.media.push(item);
 return state;
}
function without(data,id){
 const state=normalize(data);state.media=state.media.filter(x=>x.id!==id);
 for(const key of IDS)if(state.pages[key].image===id)state.pages[key].image='template';
 return state;
}
function byteLength(item){
 const data=item.data.split(',')[1]||'';
 return Math.floor(data.length*3/4)-(data.endsWith('==')?2:data.endsWith('=')?1:0);
}
function mediaFiles(data){
 const state=normalize(data),files={};
 if(typeof atob!=='function')throw Error('Se necesita un navegador con soporte para base64');
 for(const item of state.media){
  if(byteLength(item)>PHOTO_BYTES)throw Error('Fotografía demasiado grande');
  files[assetName(item.id,item.type)]=Uint8Array.from(atob(item.data.split(',')[1]),x=>x.charCodeAt(0));
 }
 return files;
}
function photoLink(data,pageId,preview){
 const media=mediaFor(data,pageId);
 if(!media)return null;
 return preview?media.data:assetName(media.id,media.type);
}
function summary(data){
 const model=normalize(data);
 return {count:model.media.length,bytes:model.media.reduce((n,x)=>n+byteLength(x),0)};
}
return {IDS,PHOTO_LIMIT,PHOTO_BYTES,normalize,effective,mediaFor,mediaFiles,photoLink,attach,without,summary,assetName};
});
