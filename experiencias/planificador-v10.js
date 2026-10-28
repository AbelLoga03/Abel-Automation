/* Abel Automation · V10 Client Journey · sin llamadas a red ni datos enviados automáticamente */
(()=>{
'use strict';
const Core=globalThis.AbelJourneyV10,Engine=globalThis.AbelProposalV8,Builder=globalThis.AbelBuilderV9;
if(!Core||!Engine||!Builder)return;
const $=id=>document.getElementById(id),el=(tag,text='',cls='')=>{const x=document.createElement(tag);if(text)x.textContent=text;if(cls)x.className=cls;return x;};
const values={sector:Core.SECTORS,stage:Core.STAGES,goals:Core.GOALS,features:Core.FEATURES,readiness:Core.READINESS,timing:Core.TIMING,budget:Core.BUDGET};
const names=['Tu negocio','Tus objetivos','Funciones que te interesan','Detalles de la propuesta'];
let state=Core.defaults(),step=0;
function status(message){$('wizard-status').textContent=message;}
function row(parent,...children){parent.append(...children);return parent;}
function question(title,intro){const area=$('step-content');area.replaceChildren();row(area,el('h2',title),el('p',intro));return area;}
function label(text,field){const l=el('label','', 'field-label');l.textContent=text;l.htmlFor=field;return l;}
function inputField(parent,id,text,value,max=65,kind='input'){
 parent.append(label(text,id));
 const x=el(kind,'',''+(kind==='textarea'?'textarea':'input'));
 x.id=id;x.value=value;x.maxLength=max;x.placeholder=kind==='textarea'?'Detalla lo que te gustaría conseguir (opcional)': 'Nombre comercial (opcional)';
 x.addEventListener('input',e=>{state=Core.normalize({...state,[id==='business-name'?'brand':'details']:e.target.value});refreshAside();});
 parent.append(x);return x;
}
function options(parent,field,list,multiple=false){
 const group=el('div','','option-grid');group.setAttribute('role','group');group.setAttribute('aria-label',field);
 for(const [key,value] of Object.entries(list)){
  const opt=el('label','','option'+(multiple?'':' single')),input=el('input'),span=el('span');
  input.type=multiple?'checkbox':'radio';input.name=field;input.value=key;
  input.checked=multiple?state[field].includes(key):state[field]===key;
  span.textContent=value.label||value;
  if(multiple&&field==='features'&&value.extra){const p=Engine.lookup('extras',value.extra);if(p){const small=el('small','Complemento '+(p.from?'desde ':'')+Engine.euro(p.price));span.append(small);}}
  input.addEventListener('change',()=>{
   if(multiple){const s=new Set(state[field]);if(input.checked)s.add(key);else s.delete(key);state=Core.normalize({...state,[field]:[...s]});}
   else state=Core.normalize({...state,[field]:key});
   refreshAside();status('');
  });
  row(opt,input,span);group.append(opt);
 }
 parent.append(group);
}
function showStep(){
 const result=step===4;
 $('step-content').hidden=result;$('result-content').hidden=!result;$('wizard-actions').hidden=result;
 $('step-label').textContent=result?'Tu propuesta orientativa':'Paso '+(step+1)+' de 4';
 $('step-name').textContent=result?'Lista para revisar':names[step];
 $('step-progress').setAttribute('aria-valuenow',String(Math.min(4,step+1)));
 $('step-fill').style.width=(result?100:(step+1)*25)+'%';
 $('prev-step').disabled=step===0;
 $('next-step').textContent=step===3?'Ver mi propuesta ↗':'Siguiente →';
 status('');
 if(step===0){
  const a=question('¿Qué negocio estás construyendo?','Selecciona un sector y cuéntanos brevemente en qué punto se encuentra tu presencia digital.');
  a.append(label('Sector','business-sector'));
  const select=el('select','','input');select.id='business-sector';
  for(const [key,value]of Object.entries(Core.SECTORS)){const opt=el('option',value.label);opt.value=key;select.append(opt);}
  select.value=state.sector;select.addEventListener('change',e=>{state=Core.normalize({...state,sector:e.target.value});refreshAside();});
  a.append(select);
  a.append(label('Situación actual','current-stage'));
  options(a,'stage',Core.STAGES);
  inputField(a,'business-name','Nombre de tu negocio (si ya lo tienes)',state.brand);
 }else if(step===1){
  options(question('¿Qué quieres conseguir?','Puedes elegir varios objetivos. El sistema sugerirá funciones relacionadas y explicará por qué.'),'goals',Core.GOALS,true);
 }else if(step===2){
  options(question('¿Qué funciones te interesan?','Son complementos opcionales. Verás sus precios orientativos antes de aceptar nada.'),'features',Core.FEATURES,true);
 }else if(step===3){
  const a=question('Vamos a concretar los detalles.','Cuéntanos si tienes contenidos preparados, cuándo te gustaría avanzar y qué presupuesto estás considerando.');
  a.append(label('Estado del contenido','readiness-section'));options(a,'readiness',Core.READINESS);
  a.append(label('Plazo deseado','timing-section'));options(a,'timing',Core.TIMING);
  a.append(label('Presupuesto disponible','budget-section'));options(a,'budget',Core.BUDGET);
  inputField(a,'project-details','Algo más que debamos saber',state.details,850,'textarea');
 }else renderResults();
 if(!result)$('step-content').querySelector('select, input:not([type=hidden]), textarea')?.focus({preventScroll:true});
 else $('results-heading').focus?.({preventScroll:true});
 refreshAside();
}
function refreshAside(){
 $('side-sector').textContent=Core.SECTORS[state.sector].label;
 $('side-stage').textContent=Core.STAGES[state.stage];
 $('side-goals').textContent=state.goals.length?state.goals.map(x=>Core.GOALS[x].label).join(', '):'Sin seleccionar';
 $('side-features').textContent=String(state.features.length)+' seleccionadas';
 $('side-budget').textContent=Core.BUDGET[state.budget];
}
function next(){
 if(step===1&&!state.goals.length){status('Selecciona al menos un objetivo para recibir una propuesta útil.');return;}
 if(step>=4)return;
 step++;showStep();
}
function previous(){if(step>0){step--;showStep();}}
function resultStatus(msg){$('result-status').textContent=msg;}
function renderResults(){
 const data=Core.withPrice(state,Engine),q=data.quote,container=$('result-lines');container.replaceChildren();
 $('result-price').textContent=(q.from?'desde ':'')+Engine.euro(q.total);
 $('result-base').textContent=q.base.name+' · '+q.extras.length+' complementos';
 for(const entry of [q.base,...q.extras]){
  const line=el('div','','result-line');row(line,el('span',entry.name),el('b',(entry.from?'desde ':'')+Engine.euro(entry.price)));container.append(line);
 }
 const why=$('result-reasons');why.replaceChildren();
 why.append(el('h3','Por qué hemos considerado estas opciones'));
 if(!data.reasons.length)why.append(el('p','Se han incluido únicamente los complementos que marcaste. Puedes cambiar las respuestas en cualquier momento.'));
 for(const reason of data.reasons)why.append(el('p','✓ '+reason.reason));
 const alert=$('result-alerts');alert.replaceChildren();
 for(const note of data.notes)alert.append(el('p',note,'result-alert'));
 alert.append(el('p','No se garantiza más tráfico, reservas ni ventas. El cálculo es orientativo y no incluye IVA, hosting, dominio o integraciones complejas.','result-alert'));
}
function download(bytes,filename,type){
 const blob=new Blob([bytes],{type}),u=URL.createObjectURL(blob),a=el('a');
 a.href=u;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),6000);
}
function proposalPdf(){
 try{
  const r=Core.withPrice(state,Engine);
  const data={base:r.base,extras:r.extras,maintenance:'none',client:'Cliente por concretar',project:'Proyecto digital '+(state.brand||r.sector.label),scope:Core.brief(state)};
  const bytes=Engine.pdfDocument(data);
  download(bytes,'Abel-Automation-Plan-V10.pdf','application/pdf');
  resultStatus('PDF generado localmente. Comprueba el alcance antes de enviar una propuesta definitiva.');
 }catch{resultStatus('No se pudo crear el PDF. Revisa tus respuestas.');}
}
function openBuilder(){
 try{
  const preset=Core.builderPreset(state,Builder);
  sessionStorage.setItem('abel-v10-builder-draft',JSON.stringify({version:10,config:preset}));
  location.href='../estudio/configurador-v9.html?source=v10';
 }catch{resultStatus('El constructor no está disponible en esta sesión.');}
}
function openContact(){
 try{
  const data={version:10,sector:Core.SECTORS[state.sector].contact,message:Core.brief(state)};
  sessionStorage.setItem('abel-v10-contact-draft',JSON.stringify(data));
  location.href='../index.html#contacto';
 }catch{resultStatus('No se pudo preparar el borrador. Descarga el PDF y copia los detalles al contacto.');}
}
function openCRM(){
 try{
  const q=Core.withPrice(state,Engine).quote;
  const data={version:9,name:state.brand||'Proyecto web por concretar',sector:Core.SECTORS[state.sector].label,estimate:q.total,notes:Core.brief(state)};
  sessionStorage.setItem('abel-v9-crm-draft',JSON.stringify(data));
  location.href='../herramientas/crm.html#studio-v9';
 }catch{resultStatus('No se pudo preparar el CRM. Puedes exportar el resumen.');}
}
function exportJson(){
 try{download(Core.toJson(state),'abel-automation-plan-v10.json','application/json');resultStatus('Resumen descargado sin datos de contacto personales.');}
 catch{resultStatus('No se pudo exportar el resumen.');}
}
function init(){
 const sector=new URLSearchParams(location.search).get('sector');
 if(sector&&Object.prototype.hasOwnProperty.call(Core.SECTORS,sector))state=Core.defaults(sector);
 $('prev-step').addEventListener('click',previous);$('next-step').addEventListener('click',next);
 $('result-pdf').addEventListener('click',proposalPdf);$('result-builder').addEventListener('click',openBuilder);
 $('result-contact').addEventListener('click',openContact);$('result-crm').addEventListener('click',openCRM);
 $('result-json').addEventListener('click',exportJson);
 $('result-edit').addEventListener('click',()=>{step=0;showStep();});
 showStep();
}
document.addEventListener('DOMContentLoaded',init);
})();
