/* Abel Automation V13 · Hub de herramientas y proyectos locales */
(()=>{
'use strict';
const Store=globalThis.AbelProjectsV13,Engine=globalThis.AbelWebExportV12,Core=globalThis.AbelBuilderV9;
if(!Store||!Engine||!Core)return;
const $=id=>document.getElementById(id);
const tag=(t,s='',cls='')=>{const e=document.createElement(t);e.textContent=s;if(cls)e.className=cls;return e;};
function feedback(message){$('project-feedback').textContent=message;}
function editor(project){
 try{sessionStorage.setItem('abel-v13-open-project',JSON.stringify(project));location.href='builder-v12.html?from=studio-v13';}
 catch{feedback('El navegador no permite abrir este proyecto. Exporta su JSON desde el editor.');}
}
function draw(){
 const list=$('project-list'),data=Store.list();list.replaceChildren();
 $('project-count').textContent=data.length+' / '+Store.MAX+' guardados';
 if(!data.length){list.append(tag('p','Todavía no tienes proyectos guardados. Abre el constructor V12 y usa «Guardar en mis proyectos».','empty'));return;}
 for(const p of data){
  const card=tag('article','','project-card');const meta=tag('div','','meta');
  meta.append(tag('span',Core.SECTORS[p.data.sector]?.name||'Proyecto'),tag('time',p.updated?p.updated.slice(0,10):'Sin fecha'));
  const title=tag('h3',p.name),desc=tag('p','Plantilla '+(Core.SECTORS[p.data.sector]?.name||'web')+' · '+p.data.sections.length+' secciones seleccionadas');
  const buttons=tag('div','','controls');
  const open=tag('button','Continuar ↗','open'),copy=tag('button','Duplicar'),rename=tag('button','Renombrar'),del=tag('button','Eliminar','danger');
  for(const b of [open,copy,rename,del])b.type='button';
  open.addEventListener('click',()=>editor(Store.open(p.id)));
  copy.addEventListener('click',()=>{try{Store.duplicate(p.id);draw();feedback('Proyecto duplicado en este navegador.');}catch(e){feedback(e.message)}});
  rename.addEventListener('click',()=>{
   const name=prompt('Nombre del proyecto:',p.name);if(name===null)return;
   try{Store.modify(p.id,{name});draw();feedback('Nombre actualizado.');}catch(e){feedback(e.message)}
  });
  del.addEventListener('click',()=>{
   if(!confirm('¿Eliminar el proyecto «'+p.name+'»? Esta acción no se puede deshacer.'))return;
   try{Store.remove(p.id);draw();feedback('Proyecto eliminado de este navegador.');}catch(e){feedback(e.message)}
  });
  buttons.append(open,copy,rename,del);card.append(meta,title,desc,buttons);list.append(card);
 }
}
document.addEventListener('DOMContentLoaded',()=>{
 $('new-project').addEventListener('click',()=>{try{Store.create(Engine.defaults('restaurante'),'Mi primer proyecto');draw();feedback('Plantilla guardada. Pulsa Continuar para editarla.');}catch(e){feedback(e.message)}});
 $('recover-draft').addEventListener('click',()=>{
  const p=Store.draft();
  if(!p){feedback('No hay ningún autoguardado compatible en este navegador.');return;}
  editor(p);
 });
 draw();
});
})();