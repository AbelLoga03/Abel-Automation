/* Abel Automation V11 · checklist de lanzamiento, solo confirmaciones manuales. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;root.AbelLaunchV11=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
'use strict';
const KEY='abel-launch-v11-checklist';
const CHECKS=[
 {id:'ci',category:'Código y pruebas',critical:true,title:'GitHub Actions en verde para la rama exacta de publicación',help:'Verifica la última ejecución, no una anterior. Seis suites heredadas + pruebas V11 y ningún error.'},
 {id:'demos',category:'Código y pruebas',critical:true,title:'25 demos, configurador y PDFs probados',help:'Abre ejemplos antiguos y nuevos; verifica navegación, cálculo y descarga de PDF en un navegador real.'},
 {id:'mobile',category:'Experiencia y accesibilidad',critical:true,title:'Revisión manual móvil, tablet y escritorio',help:'Prueba menú, formulario, contraste, teclado, lector de pantalla básico y enlaces en dispositivos reales.'},
 {id:'mail',category:'Consultas y privacidad',critical:true,title:'Correo receptor de FormSubmit activado y envío de prueba recibido',help:'Confirma activación, realiza una consulta ficticia con consentimiento y comprueba bandeja y spam. El retorno «gracias» no prueba entrega.'},
 {id:'privacy',category:'Consultas y privacidad',critical:true,title:'Privacidad, condiciones y proveedor del formulario revisados',help:'Revisa la base legal, el proveedor FormSubmit, la información a usuarios, la retención y las condiciones antes de usar datos reales.'},
 {id:'alternate',category:'Consultas y privacidad',critical:true,title:'Borrador y canal alternativo de contacto comprobados',help:'Comprueba que el modo borrador no envía nada y que el mailto alternativo funciona.'},
 {id:'seo',category:'Publicación',critical:true,title:'SEO local, enlaces y sitemap accesibles en el dominio definitivo',help:'Revisa títulos/canonicals, sitemap, robots.txt y que no haya redirecciones ni errores 404 tras desplegar.'},
 {id:'crm',category:'Publicación',critical:true,title:'Copia cifrada del CRM guardada y restauración ensayada',help:'Antes de usar datos reales, guarda una copia cifrada y prueba restauración en un perfil de prueba; no subas archivos con clientes al repositorio.'},
 {id:'fonts',category:'Experiencia y accesibilidad',critical:false,title:'Fuentes e imágenes revisadas con red lenta',help:'La página debe conservar legibilidad, textos y navegación si tardan en cargar recursos externos.'},
 {id:'legal',category:'Publicación',critical:false,title:'Impuestos, actividad profesional y textos comerciales revisados',help:'Verifica que las ofertas y propuestas no afirman condiciones, clientes, ingresos o capacidades que no puedas sostener.'},
 {id:'security',category:'Código y pruebas',critical:false,title:'Claves, contraseñas y datos reales ausentes del repositorio',help:'Revisa commits, archivos y ejemplos de prueba para asegurar que todo es ficticio.'}
];
function sanitize(raw){const set=new Set(Array.isArray(raw)?raw:[]);return CHECKS.filter(c=>set.has(c.id)).map(c=>c.id);}
function progress(raw){
 const marked=new Set(sanitize(raw)),critical=CHECKS.filter(c=>c.critical);
 return {marked:[...marked],checked:critical.filter(c=>marked.has(c.id)).length,total:critical.length,ready:critical.every(c=>marked.has(c.id)),remaining:critical.filter(c=>!marked.has(c.id)).map(c=>c.id)};
}
function report(raw,date=new Date()){
 const marked=new Set(sanitize(raw)),p=progress(raw);
 return ['ABEL AUTOMATION · V11 LAUNCH READINESS','Fecha: '+date.toISOString(),'Estado declarado manualmente: '+(p.ready?'TODOS LOS PUNTOS CRÍTICOS MARCADOS':'NO PREPARADO'),'Críticos marcados: '+p.checked+'/'+p.total,'',
 ...CHECKS.map(c=>(marked.has(c.id)?'[X]':'[ ]')+' '+(c.critical?'[CRÍTICO] ':'')+c.title+' - '+c.help),'',
 'IMPORTANTE: documento declarativo, no prueba automática de recepción de email, legalidad, accesibilidad ni despliegue.',
 'No autoriza ni realiza ninguna publicación.'].join('\n');
}
function init(){
 const $=id=>document.getElementById(id),container=$('checklist');if(!container)return;
 let marked=[];
 try{marked=sanitize(JSON.parse(localStorage.getItem(KEY)||'[]'));}catch{marked=[];}
 const groupNames=[...new Set(CHECKS.map(x=>x.category))];
 function render(){
  container.replaceChildren();
  for(const category of groupNames){
   const section=document.createElement('section');section.className='check-group';
   const heading=document.createElement('h2');heading.textContent=category;section.append(heading);
   for(const c of CHECKS.filter(x=>x.category===category)){
    const label=document.createElement('label');label.className='check-row';
    const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=marked.includes(c.id);checkbox.value=c.id;
    checkbox.setAttribute('aria-label',(c.critical?'Crítico: ':'')+c.title);
    const desc=document.createElement('span'),title=document.createElement('strong'),help=document.createElement('small');
    title.textContent=(c.critical?'● ':'')+c.title;help.textContent=c.help;desc.append(title,help);
    label.append(checkbox,desc);section.append(label);
    checkbox.addEventListener('change',()=>{
     const next=new Set(marked);if(checkbox.checked)next.add(c.id);else next.delete(c.id);
     marked=sanitize([...next]);try{localStorage.setItem(KEY,JSON.stringify(marked));}catch{$('checklist-status').textContent='El navegador no ha podido conservar las marcas.';}
     refresh();
    });
   }container.append(section);
  }refresh();
 }
 function refresh(){
  const p=progress(marked);$('ready-count').textContent=p.checked+' / '+p.total;
  $('ready-label').textContent=p.ready?'Puntos críticos marcados; requiere revisión final y aprobación expresa.':'No está preparado para publicar: quedan '+p.remaining.length+' puntos críticos.';
  $('ready-progress').setAttribute('aria-valuemax',String(p.total));
  $('ready-progress').setAttribute('aria-valuenow',String(p.checked));
  $('ready-fill').style.width=String(Math.round(p.checked/p.total*100))+'%';
 }
 $('reset-checklist').addEventListener('click',()=>{
  if(!confirm('¿Borrar todas las marcas de esta lista en este navegador?'))return;
  marked=[];try{localStorage.removeItem(KEY);}catch{}
  render();$('checklist-status').textContent='Marcas locales borradas.';
 });
 $('export-checklist').addEventListener('click',()=>{
  const blob=new Blob([report(marked)],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='Abel-Automation-V11-Checklist.txt';document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),5000);
  $('checklist-status').textContent='Informe generado en tu dispositivo. Las marcas son autodeclaradas.';
 });
 render();
}
if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',init);
return {CHECKS,progress,report,sanitize};
});
