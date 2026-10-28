/* Interfaz V8 de propuestas. No se envían datos externos. */
(()=>{
'use strict';
const $=id=>document.getElementById(id),engine=globalThis.AbelProposalV8;
if(!engine)return;
const params=new URLSearchParams(location.search);
function paramIn(name,list,defaultId){const id=params.get(name);return list.some(x=>x[0]===id)?id:defaultId;}
function build(){
 const base=$('q-base'),maint=$('q-maintenance');
 for(const item of engine.CATALOG.web){const opt=new Option(item[1]+' · '+(item[4]?'desde ':'')+engine.euro(item[2]),item[0]);base.add(opt);}
 for(const item of engine.CATALOG.maintenance){maint.add(new Option(item[1]+(item[2]?' · '+(item[4]?'desde ':'')+engine.euro(item[2])+'/mes':''),item[0]));}
 for(const item of engine.CATALOG.extras){
  const lab=document.createElement('label');lab.className='addon';
  const check=document.createElement('input');check.type='checkbox';check.value=item[0];check.name='extras';
  const text=document.createElement('span');text.textContent=item[1];const price=document.createElement('strong');price.textContent=(item[4]?'desde ':'')+engine.euro(item[2]);lab.append(check,text,price);$('q-extras').append(lab);
 }
 base.value=paramIn('base',engine.CATALOG.web,'profesional');
 maint.value=paramIn('maintenance',engine.CATALOG.maintenance,'none');
 const allowed=new Set(engine.CATALOG.extras.map(x=>x[0]));
 const selected=new Set((params.get('extras')||'').split(',').filter(x=>allowed.has(x)));
 $('q-extras').querySelectorAll('input').forEach(input=>input.checked=selected.has(input.value));
 const offers={
  local:{base:'basica',extras:['whatsapp','maps'],total:239},
  restaurante:{base:'restaurante',extras:['qr-basic','whatsapp'],total:409},
  empresa:{base:'profesional',extras:['form','seo'],total:389}
 };
 const offer=offers[params.get('pack')];
 if(offer&&base.value===offer.base&&selected.size===offer.extras.length&&offer.extras.every(id=>selected.has(id))){
  const initial=engine.normalize({base:base.value,extras:[...selected]});
  $('q-discount').value=String(Math.max(0,initial.gross-offer.total));
 }
 const today=new Date();$('q-date').value=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
 if(params.get('project'))$('q-project').value=params.get('project').slice(0,150);
 $('editor').addEventListener('input',render);
 $('editor').addEventListener('change',render);
 $('q-copy').addEventListener('click',copy);
 $('q-print').addEventListener('click',()=>window.print());
 $('q-pdf').addEventListener('click',downloadPdf);
 render();
}
function collect(){
 const extras=[...$('q-extras').querySelectorAll('input:checked')].map(x=>x.value);
 return {client:$('q-client').value,company:$('q-company').value,project:$('q-project').value,
 date:$('q-date').value,validity:$('q-validity').value,base:$('q-base').value,
 maintenance:$('q-maintenance').value,extras,discount:$('q-discount').value,
 scope:$('q-scope').value,notes:$('q-notes').value};
}
function render(){
 const m=engine.normalize(collect()),root=$('q-lines');root.replaceChildren();
 const row=(name,price)=>{
  const div=document.createElement('div');div.className='detail';const a=document.createElement('span'),b=document.createElement('strong');a.textContent=name;b.textContent=price;div.append(a,b);root.append(div);
 };
 $('q-base-desc').textContent=m.base.description;
 $('q-recipient').textContent=m.client+(m.company?' · '+m.company:'');
 $('q-project-preview').textContent=m.project+' · '+m.date;
 row(m.base.name,(m.base.from?'desde ':'')+engine.euro(m.base.price));
 for(const x of m.extras)row(x.name,(x.from?'desde ':'')+engine.euro(x.price));
 if(m.discount)row('Descuento aplicado','−'+engine.euro(m.discount));
 $('q-total').textContent=(m.from?'desde ':'')+engine.euro(m.total);
 $('q-monthly').textContent=m.maintenance.price?(m.maintenance.from?'Desde ':'')+engine.euro(m.maintenance.price)+'/mes · '+m.maintenance.name:'Sin mantenimiento mensual';
}
async function copy(){
 try{
  await navigator.clipboard.writeText(engine.format(collect()));
  $('q-feedback').textContent='Resumen copiado al portapapeles.';
 }catch{
  $('q-feedback').textContent='El portapapeles no está disponible. Utiliza la descarga PDF.';
 }
}
function downloadPdf(){
 try{
  const bytes=engine.pdfDocument(collect());
  const blob=new Blob([bytes],{type:'application/pdf'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='Abel-Automation-Propuesta-'+$('q-date').value+'.pdf';
  document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),5000);
  $('q-feedback').textContent='PDF creado y descargado en este dispositivo.';
 }catch(e){$('q-feedback').textContent='No se pudo generar el PDF: revisa los campos e inténtalo de nuevo.';}
}
document.addEventListener('DOMContentLoaded',build);
})();
