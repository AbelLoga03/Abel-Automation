/* Abel Automation V16 — bloques reutilizables e independientes, sin HTML arbitrario. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;root.AbelBlocksV16=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
'use strict';
const PAGES=['home','about','services','gallery','contact'];
const TYPES={
 feature:{name:'Destacado',title:'Lo que nos diferencia',description:'Cuenta qué valor aporta este negocio.',button:'Ver servicios',href:'servicios.html'},
 cta:{name:'Llamada a la acción',title:'¿Hablamos de tu proyecto?',description:'Contacta para conocer las opciones disponibles.',button:'Contactar',href:'contacto.html'},
 steps:{name:'Cómo trabajamos',title:'Nuestro proceso',description:'1. Escuchamos · 2. Proponemos · 3. Entregamos',button:'Saber más',href:'nosotros.html'},
 highlight:{name:'Aviso destacado',title:'Información importante',description:'Añade aquí información real y revisada del negocio.',button:'',href:''}
};
const MAX=8,LIBMAX=10;
const clean=(x,n=170)=>String(typeof x==='string'?x:'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,n);
const idOk=x=>typeof x==='string'&&/^block-[a-z0-9-]{6,50}$/i.test(x);
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeLink=x=>{
 const v=clean(x,130);
 return /^(?:index|nosotros|servicios|galeria|contacto)\.html(?:#[a-z0-9-]+)?$/i.test(v)||/^#[a-z0-9-]{2,40}$/i.test(v)?v:'';
};
function block(raw){
 if(!raw||!Object.hasOwn(TYPES,raw.type))return null;
 const kind=TYPES[raw.type];
 return {id:idOk(raw.id)?raw.id:'block-'+Math.random().toString(36).slice(2,13),
  type:raw.type,title:clean(raw.title,85)||kind.title,
  description:clean(raw.description,280)||kind.description,
  button:clean(raw.button,34),href:safeLink(raw.href),align:raw.align==='center'?'center':'left',
  tone:raw.tone==='soft'?'soft':'accent'};
}
function normalize(input){
 const raw=input&&typeof input==='object'?input:{},pages={};
 for(const id of PAGES)pages[id]=Array.isArray(raw.pages?.[id])?raw.pages[id].slice(0,MAX).map(block).filter(Boolean):[];
 const library=Array.isArray(raw.library)?raw.library.slice(0,LIBMAX).map(block).filter(Boolean):[];
 return {version:16,pages,library};
}
function create(type){
 if(!Object.hasOwn(TYPES,type))throw Error('Tipo de componente desconocido');
 return block({type,...TYPES[type]});
}
function add(state,page,item){
 if(!PAGES.includes(page))throw Error('Página desconocida');
 const next=normalize(state);
 if(next.pages[page].length>=MAX)throw Error('Máximo de ocho componentes por página');
 const b=block(item);if(!b)throw Error('Componente inválido');
 b.id=create(b.type).id; // Independent copy: edits cannot affect the original.
 next.pages[page].push(b);return next;
}
function patch(state,page,id,changes){
 const next=normalize(state),list=next.pages[page];if(!list)throw Error('Página desconocida');
 const pos=list.findIndex(x=>x.id===id);if(pos<0)throw Error('Componente inexistente');
 list[pos]=block({...list[pos],...changes,id});return next;
}
function remove(state,page,id){
 const next=normalize(state);if(!next.pages[page])throw Error('Página desconocida');
 next.pages[page]=next.pages[page].filter(x=>x.id!==id);return next;
}
function move(state,page,id,delta){
 const next=normalize(state),list=next.pages[page];if(!list)throw Error('Página desconocida');
 const from=list.findIndex(x=>x.id===id),to=from+delta;
 if(from<0||to<0||to>=list.length)return next;
 [list[from],list[to]]=[list[to],list[from]];return next;
}
function saveReusable(state,page,id){
 const next=normalize(state),item=next.pages[page]?.find(x=>x.id===id);
 if(!item)throw Error('No se encontró el componente');
 if(next.library.length>=LIBMAX)throw Error('Máximo diez componentes en la biblioteca');
 next.library.push({...item,id:create(item.type).id});return next;
}
function htmlFor(list,preview=false){
 return list.map(item=>{
  const b=block(item);if(!b)return '';
  const edit=preview?' data-v16-block="'+esc(b.id)+'" tabindex="0" role="button" aria-label="Editar bloque '+esc(b.title)+'"':'';
  const link=b.button&&b.href?'<a class="action v16-block-action" href="'+esc(b.href)+'">'+esc(b.button)+'</a>':'';
  return '<section class="section v16-component v16-'+b.type+' tone-'+b.tone+' align-'+b.align+'" id="'+esc(b.id)+'"'+edit+'>'+
   '<div class="wrap"><p class="kicker">COMPONENTE · '+esc(TYPES[b.type].name)+'</p><h2>'+esc(b.title)+'</h2><p class="lead">'+esc(b.description)+'</p>'+link+'</div></section>';
 }).join('');
}
function renderInto(html,state,page,preview=false){
 if(typeof html!=='string'||!html.includes('</main>'))throw Error('Documento HTML incompleto');
 const data=normalize(state);
 let result=html.replace('</main>',htmlFor(data.pages[page]||[],preview)+'</main>');
 if(preview){
  const js="document.addEventListener('click',function(e){var node=e.target.closest('[data-v16-block]');if(!node)return;e.preventDefault();parent.postMessage({type:'ABEL_V16_SELECT',id:node.getAttribute('data-v16-block')},'*');});document.addEventListener('keydown',function(e){var node=e.target.closest('[data-v16-block]');if(!node||!(e.key==='Enter'||e.key===' '))return;e.preventDefault();parent.postMessage({type:'ABEL_V16_SELECT',id:node.getAttribute('data-v16-block')},'*');});";
  result=result.replace('</body>','<script>'+js+'</'+'script></body>');
 }
 return result;
}
function report(state){
 const data=normalize(state);
 return {pages:Object.fromEntries(PAGES.map(id=>[id,data.pages[id].length])),library:data.library.length,total:PAGES.reduce((n,id)=>n+data.pages[id].length,0)};
}
return {TYPES,PAGES,MAX,LIBMAX,normalize,create,add,patch,remove,move,saveReusable,htmlFor,renderInto,report,safeLink};
});
