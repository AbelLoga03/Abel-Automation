/* Abel Automation V13 · Hub de herramientas y proyectos locales */
(()=>{
'use strict';
const Store=globalThis.AbelProjectsV13,Engine=globalThis.AbelWebExportV12,Core=globalThis.AbelBuilderV9,Ext=globalThis.AbelProjectsV14;
if(!Store||!Engine||!Core)return;
const $=id=>document.getElementById(id);
const tag=(t,s='',cls='')=>{const e=document.createElement(t);e.textContent=s;if(cls)e.className=cls;return e;};
function feedback(message){$('project-feedback').textContent=message;}
function editor(project){
 try{sessionStorage.setItem('abel-v13-open-project',JSON.stringify(project));location.href='builder-v12.html?from=studio-v13';}
 catch{feedback('El navegador no permite abrir este proyecto. Exporta su JSON desde el editor.');}
}
function draw(){
 const list=$('project-list'),all=Store.list(),data=Ext?Ext.visible(all,{search:$('v14-search').value,tag:$('v14-tag').value,favorites:$('v14-favorites').checked}):all;list.replaceChildren();
 $('project-count').textContent=data.length+' / '+Store.MAX+' guardados';
 if(!data.length){list.append(tag('p',all.length?'Ningún proyecto coincide con los filtros.':'Todavía no tienes proyectos guardados. Abre el constructor V14 y usa «Guardar en mis proyectos».','empty'));return;}
 for(const p of data){
  const card=tag('article','','project-card'),extra=Ext?.get(p.id)||{favorite:false,tag:'Sin categoría',history:[]};
  const thumbnail=tag('div','','v14-project-preview');thumbnail.style.background=p.data.colors?.bg||'#253144';thumbnail.style.color=p.data.colors?.ink||'#ffffff';
  const stripe=tag('div','','v14-thumbnail-header');stripe.style.background=p.data.colors?.surface||'#344456';stripe.textContent=p.data.brand.slice(0,27);
  const previewTitle=tag('strong',p.data.headline.slice(0,60));thumbnail.append(stripe,previewTitle);
  const meta=tag('div','','meta');
  meta.append(tag('span',Core.SECTORS[p.data.sector]?.name||'Proyecto'),tag('time',p.updated?p.updated.slice(0,10):'Sin fecha'));
  const title=tag('h3',p.name),desc=tag('p','Plantilla '+(Core.SECTORS[p.data.sector]?.name||'web')+' · '+p.data.sections.length+' secciones seleccionadas');
  card.append(thumbnail);
  const tagLabel=tag('label','','v14-tag-label');tagLabel.textContent='Estado: ';
  const tagSelect=tag('select');for(const name of ['Sin categoría','Por preparar','En diseño','En revisión','Entregado'])tagSelect.add(new Option(name,name));tagSelect.value=extra.tag;
  tagSelect.addEventListener('change',()=>{try{Ext.setMeta(p.id,{tag:tagSelect.value});draw();feedback('Estado de proyecto actualizado.');}catch(e){feedback(e.message)}});tagLabel.append(tagSelect);
  const buttons=tag('div','','controls');
  const open=tag('button','Continuar ↗','open'),copy=tag('button','Duplicar'),rename=tag('button','Renombrar'),del=tag('button','Eliminar','danger');
  const favorite=tag('button',extra.favorite?'★ Favorito':'☆ Favorito'),saveVersion=tag('button','Guardar versión'),restore=tag('button','Restaurar versión ('+extra.history.length+')');
  for(const b of [open,copy,rename,del,favorite,saveVersion,restore])b.type='button';
  favorite.addEventListener('click',()=>{try{Ext.setMeta(p.id,{favorite:!extra.favorite});draw();}catch(e){feedback(e.message)}});
  saveVersion.addEventListener('click',()=>{try{Ext.snapshot(p.id);draw();feedback('Copia de versión local guardada (máximo cuatro).');}catch(e){feedback(e.message)}});
  restore.addEventListener('click',()=>{if(!extra.history.length)return;const names=extra.history.map((v,i)=>(i+1)+'. '+v.date).join('\n');
   const choice=prompt('Elige un número de versión para restaurar:\n'+names,'1');if(choice===null)return;const ix=Number(choice)-1;
   if(!Number.isInteger(ix)||ix<0||ix>=extra.history.length){feedback('Número de versión no válido.');return;}
   if(!confirm('¿Restaurar esta versión? El diseño actual se sustituirá. Guarda antes una versión si necesitas conservarlo.'))return;
   try{Ext.restore(p.id,ix);draw();feedback('Versión recuperada en este navegador.');}catch(e){feedback(e.message)}});
  open.addEventListener('click',()=>editor(Store.open(p.id)));
  copy.addEventListener('click',()=>{try{Store.duplicate(p.id);draw();feedback('Proyecto duplicado en este navegador.');}catch(e){feedback(e.message)}});
  rename.addEventListener('click',()=>{
   const name=prompt('Nombre del proyecto:',p.name);if(name===null)return;
   try{Store.modify(p.id,{name});draw();feedback('Nombre actualizado.');}catch(e){feedback(e.message)}
  });
  del.addEventListener('click',()=>{
   if(!confirm('¿Eliminar el proyecto «'+p.name+'»? Esta acción no se puede deshacer.'))return;
   try{Store.remove(p.id);Ext?.forget(p.id);draw();feedback('Proyecto eliminado de este navegador.');}catch(e){feedback(e.message)}
  });
  buttons.append(open,copy,rename,favorite,saveVersion,restore,del);card.append(meta,title,desc,tagLabel,buttons);list.append(card);
 }
}
document.addEventListener('DOMContentLoaded',()=>{
 for(const id of ['v14-search','v14-tag','v14-favorites'])$(id).addEventListener(id==='v14-search'?'input':'change',draw);
 $('new-project').addEventListener('click',()=>{try{Store.create(Engine.defaults('restaurante'),'Mi primer proyecto');draw();feedback('Plantilla guardada. Pulsa Continuar para editarla.');}catch(e){feedback(e.message)}});
 $('recover-draft').addEventListener('click',()=>{
  const p=Store.draft();
  if(!p){feedback('No hay ningún autoguardado compatible en este navegador.');return;}
  editor(p);
 });
 draw();
});
})();