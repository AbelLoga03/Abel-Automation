/* Offline client-review artifact. No accounts, no network, no remote approvals. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;root.AbelReviewV16=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
'use strict';
const PAGES={home:'Inicio',about:'Nosotros',services:'Servicios',gallery:'Galería',contact:'Contacto'};
const clean=(x,n)=>String(typeof x==='string'?x:'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,n);
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function normalizeReview(input){
 const raw=input&&typeof input==='object'?input:{};
 const entries=Array.isArray(raw.entries)?raw.entries.slice(0,25):[];
 return {version:16,type:'abel-offline-review',project:clean(raw.project,85),
  entries:entries.filter(x=>x&&Object.hasOwn(PAGES,x.page)).map(x=>({
   page:x.page,decision:['pending','changes','approved'].includes(x.decision)?x.decision:'pending',
   note:clean(x.note,1400)
  }))};
}
function makeReviewFile(project,enabledPages){
 const brand=clean(project?.brand||'Proyecto web',80);
 const pages=enabledPages.filter(x=>Object.hasOwn(PAGES,x));
 const select=pages.map(id=>'<option value="'+id+'">'+PAGES[id]+'</option>').join('');
 const script="(function(){'use strict';"+
 "const entries=[],status=document.getElementById('status'),list=document.getElementById('list');"+
 "document.getElementById('add').addEventListener('click',()=>{const page=document.getElementById('page').value,decision=document.getElementById('decision').value,note=document.getElementById('note').value.trim().slice(0,1400);"+
 "if(!note&&decision==='pending'){status.textContent='Añade un comentario o selecciona un estado.';return;}entries.push({page,decision,note});"+
 "const item=document.createElement('li');item.textContent=page+' · '+decision+' · '+note;list.append(item);document.getElementById('note').value='';status.textContent='Comentario añadido en este navegador.';});"+
 "document.getElementById('download').addEventListener('click',()=>{if(!entries.length){status.textContent='Añade al menos una revisión antes de exportar.';return;}"+
 "const data={version:16,type:'abel-offline-review',project:document.getElementById('project').value,entries};"+
 "const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));"+
 "const a=document.createElement('a');a.href=url;a.download='COMENTARIOS-V16.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);status.textContent='Archivo creado; envíalo por el canal acordado.';});})();";
 return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Revisión offline · '+esc(brand)+'</title><style>:root{font-family:system-ui;color-scheme:dark}body{margin:0;background:#111724;color:#fff4ec}main{max-width:740px;margin:5vh auto;padding:25px}h1{font-size:clamp(32px,5vw,48px)}p{color:#b9c7d1}label{display:grid;gap:8px;margin:18px 0;font-weight:800}select,textarea{font:inherit;width:100%;padding:13px;background:#243146;color:white;border:1px solid #8eafb6;border-radius:8px}textarea{min-height:120px;resize:vertical}button{font:inherit;font-weight:900;background:#ffb38e;color:#251b28;padding:13px 19px;border:0;border-radius:8px;margin:8px 8px 8px 0}button:focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid #91e9dd}li{overflow-wrap:anywhere;margin:13px 0}</style></head><body><main><p>ABEL AUTOMATION · REVISIÓN LOCAL V16</p><h1>Revisa este proyecto</h1><p>Es una hoja de comentarios independiente. No abre una sesión ni envía comentarios a servidores. Devuelve el archivo JSON al creador por un medio acordado. No escribas datos personales ni confidenciales.</p><input type="hidden" id="project" value="'+esc(brand)+'"><label>Página<select id="page">'+select+'</select></label><label>Estado<select id="decision"><option value="pending">Pendiente</option><option value="changes">Solicitar cambios</option><option value="approved">Aprobación propuesta, pendiente de confirmación formal</option></select></label><label>Comentario<textarea id="note" maxlength="1400" placeholder="Qué debe cambiar y dónde"></textarea></label><button id="add" type="button">Añadir comentario</button><button id="download" type="button">Descargar comentarios JSON ↓</button><p id="status" role="status"></p><ol id="list"></ol><p>Este archivo no tiene validez como firma contractual ni verifica la identidad del revisor.</p></main><script>'+script+'</'+'script></body></html>';
}
return {PAGES,normalizeReview,makeReviewFile};
});
