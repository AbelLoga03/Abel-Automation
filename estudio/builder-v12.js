/* Abel Automation V12 · editor real de sitios sin servicios externos */
(()=>{
'use strict';
const Core=globalThis.AbelBuilderV9,Engine=globalThis.AbelWebExportV12,Proposal=globalThis.AbelProposalV8;
if(!Core||!Engine||!Proposal)return;
const $=id=>document.getElementById(id);
let state=Engine.defaults(),runtimeCss='',runtimeJs='',tab='brand',renderVersion=0,busy=false;
const status=message=>{$('status').textContent=message;};
const el=(tag,text='',className='')=>{const n=document.createElement(tag);if(text)n.textContent=text;if(className)n.className=className;return n;};
function saveFile(content,name,mime){
 const blob=new Blob([content],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;
 document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),7000);
}
function update(values,refresh=true){
 state=Engine.normalize({...state,...values});
 renderPreview();quote();
 if(refresh)syncControls();
}
function setTab(which,focus=false){
 tab=which;
 for(const id of ['brand','design','sections']){
  const on=id===tab,button=$('tab-'+id),panel=$('panel-'+id);
  button.setAttribute('aria-selected',String(on));button.tabIndex=on?0:-1;panel.hidden=!on;
 }
 if(focus)$('tab-'+tab).focus();
}
function initOptions(){
 for(const [key,value] of Object.entries(Core.SECTORS))$('sector').add(new Option(value.name,key));
 for(const [key,value] of Object.entries(Core.THEMES))$('theme').add(new Option(value.name,key));
 for(const image of Engine.IMAGES){
  const label=image.replace('portfolio-','').replace('.webp','').replace(/-/g,' ');
  $('image').add(new Option(label.charAt(0).toUpperCase()+label.slice(1),image));
 }
}
function syncControls(){
 for(const key of ['sector','brand','headline','intro','cta','email','phone','location','theme','font','layout','style','image','maintenance'])$(key).value=state[key];
 $('custom').checked=state.custom;$('color-options').hidden=!state.custom;
 const palette=$('palette-preview');palette.replaceChildren();
 for(const key of ['bg','ink','accent','surface']){
  const block=el('span');block.style.background=state.colors[key];block.title=key+': '+state.colors[key];palette.append(block);
  $('color-'+key).value=state.colors[key];
 }
 for(const button of document.querySelectorAll('[data-device]'))button.setAttribute('aria-pressed',String(button.dataset.device===state.device));
 renderBlocks();
}
function renderBlocks(){
 const box=$('blocks');box.replaceChildren();
 state.order.forEach((id,i)=>{
  const info=Core.SECTION_META.find(x=>x.id===id),row=el('div','','block'),label=el('label');
  const checked=el('input');checked.type='checkbox';checked.value=id;checked.checked=state.sections.includes(id);checked.disabled=id==='hero';checked.setAttribute('aria-label','Mostrar '+info.name);
  const description=el('span');description.append(el('strong',info.name),el('small',info.hint||''));
  label.append(checked,description);row.append(label);
  checked.addEventListener('change',()=>{
   const selected=new Set(state.sections);checked.checked?selected.add(id):selected.delete(id);
   update({sections:[...selected]});
  });
  const move=(direction)=>{
   const next=[...state.order],target=i+direction;if(i===0||target<1||target>=next.length)return;
   [next[i],next[target]]=[next[target],next[i]];update({order:next});
  };
  for(const [text,dir]of [['↑',-1],['↓',1]]){
   const button=el('button',text);button.type='button';button.disabled=i===0||(dir<0?i<=1:i===state.order.length-1);
   button.setAttribute('aria-label',(dir===-1?'Subir ':'Bajar ')+info.name);button.addEventListener('click',()=>move(dir));row.append(button);
  }box.append(row);
 });
}
function quote(){
 try{const amount=Core.quote(state,Proposal);
  $('price').textContent=(amount.from?'desde ':'')+Proposal.euro(amount.total);
  $('price-monthly').textContent=amount.maintenance.price?(amount.maintenance.from?'desde ':'')+Proposal.euro(amount.maintenance.price)+'/mes':'Sin mantenimiento';
 }catch{$('price').textContent='Consultar';$('price-monthly').textContent='';}
}
function renderPreview(){
 if(!runtimeCss||!runtimeJs)return;
 $('live-preview').srcdoc=Engine.htmlText(state,true,runtimeCss,runtimeJs);
 $('live-preview').dataset.device=state.device;
}
function bindFields(){
 $('sector').addEventListener('change',e=>{
  const newSector=e.target.value,prev=state;
  state=Engine.normalize({...Engine.defaults(newSector),theme:prev.theme,style:prev.style,font:prev.font,layout:prev.layout,
   custom:prev.custom,colors:prev.colors,sections:prev.sections,order:prev.order,maintenance:prev.maintenance,email:prev.email,phone:prev.phone,location:prev.location});
  renderPreview();quote();syncControls();status('Plantilla de sector actualizada. Tus colores, bloques y datos de contacto se han conservado.');
 });
 for(const field of ['brand','headline','intro','cta','email','phone','location','font','layout','style','image','maintenance']){
  $(field).addEventListener(field==='brand'||field==='headline'||field==='intro'||field==='cta'?'input':'change',e=>{
   const val=e.target.value;
   update({[field]:val,...(field==='image'?{customPhoto:''}:{})},false);
   if((field==='email'&&val&&!Engine.isEmail(val))||(field==='phone'&&val&&!Engine.isPhone(val)))status('Comprueba el formato. Para WhatsApp usa + seguido del código de país y número.');
  });
 }
 $('theme').addEventListener('change',e=>update({theme:e.target.value,custom:false}));
 $('custom').addEventListener('change',e=>update({custom:e.target.checked}));
 for(const color of ['bg','ink','accent','surface'])$('color-'+color).addEventListener('input',e=>update({custom:true,colors:{...state.colors,[color]:e.target.value}},false));
 for(const button of document.querySelectorAll('[data-device]'))button.addEventListener('click',()=>update({device:button.dataset.device}));
 $('photo-file').addEventListener('change',async e=>{
  const file=e.target.files?.[0];e.target.value='';if(!file)return;
  if(file.size>2_000_000||!['image/jpeg','image/png','image/webp'].includes(file.type)){status('La imagen debe ser JPG, PNG o WebP y ocupar como máximo 2 MB.');return;}
  try{
   const url=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});
   if(!Engine.isPhoto(url))throw Error('Foto no admitida');
   update({customPhoto:url});status('Imagen propia añadida. También se incluirá en tu ZIP.');
  }catch{status('No fue posible incorporar la imagen.');}
 });
 $('remove-photo').addEventListener('click',()=>{update({customPhoto:''});status('Fotografía restaurada desde la plantilla.');});
 $('reset').addEventListener('click',()=>{if(!confirm('¿Restaurar la plantilla? Se perderán los cambios no exportados.'))return;state=Engine.defaults(state.sector);refresh();status('Plantilla restaurada.');});
 for(const b of document.querySelectorAll('[data-tab]')){
  b.addEventListener('click',()=>setTab(b.dataset.tab));
  b.addEventListener('keydown',e=>{
   const ids=['brand','design','sections'];let index=ids.indexOf(tab);
   if(e.key==='ArrowRight')index=(index+1)%3;else if(e.key==='ArrowLeft')index=(index+2)%3;
   else if(e.key==='Home')index=0;else if(e.key==='End')index=2;else return;
   e.preventDefault();setTab(ids[index],true);
  });
 }
}
function refresh(){renderPreview();quote();syncControls();}
function onInlineEdit(event){
 const iframe=$('live-preview');if(event.source!==iframe.contentWindow||!event.data)return;
 if(event.data.type==='ABEL_V12_PHOTO_PICK'){setTab('design');$('image').focus();status('Elige una fotografía o sube una imagen propia.');return;}
 if(event.data.type!=='ABEL_V12_EDIT')return;
 const {kind,key,value}=event.data;
 if(typeof value!=='string'||value.length>240)return;
 if(kind==='field'&&['brand','headline','intro','cta'].includes(key)){
  update({[key]:value});status('Texto actualizado dentro del proyecto.');
 }else if(kind==='heading'&&Object.prototype.hasOwnProperty.call(Engine.TITLES,key)){
  update({titles:{...state.titles,[key]:value}});status('Título de sección actualizado.');
 }else if(kind==='card'&&/^(services|products):[012]$/.test(key)){
  const [group,index]=key.split(':'),items=[...state[group]];items[Number(index)]=value;update({[group]:items});status('Tarjeta actualizada.');
 }
}
async function exportZip(){
 if(busy)return;busy=true;$('export').disabled=true;status('Preparando los archivos del proyecto.');
 try{
  if(!runtimeCss||!runtimeJs)throw Error('No se han cargado las plantillas');
  const files=Engine.filesForProject(state,runtimeCss,runtimeJs);
  const assets=Engine.IMAGES;
  for(const name of assets){
   const response=await fetch('../assets/'+name,{cache:'default'});
   if(!response.ok)throw Error('No se pudo incorporar '+name);
   const bin=new Uint8Array(await response.arrayBuffer());
   files['assets/'+name]=bin;
  }
  if(state.customPhoto)files['assets/'+Engine.imageName(state)]=Engine.imageBytes(state.customPhoto);
  const zip=Engine.buildZip(files);
  saveFile(zip,'Abel-Automation-Web-V12.zip','application/zip');
  status('Web real exportada en ZIP con '+Object.keys(files).length+' archivos. No se ha publicado nada.');
 }catch(e){status('No se pudo exportar: '+(e?.message||'error desconocido')+'. Ejecuta el proyecto desde un servidor local.');}
 finally{busy=false;$('export').disabled=false;}
}
function downloadPdf(){
 try{
  const ids=Core.priceIds(state);
  const document={...ids,client:'Por definir',project:'Web para '+state.brand,scope:Core.brief(state)+
   '\nV12: web estática exportable. Contacto: '+(state.email?'correo configurado':'sin correo')+'. Reservas, QR, mapas y automatizaciones sujetos a desarrollo adicional.'};
  saveFile(Proposal.pdfDocument(document),'Propuesta-Abel-Automation-V12.pdf','application/pdf');
  status('Propuesta PDF descargada con los precios orientativos actuales.');
 }catch{status('No se pudo crear el presupuesto PDF.');}
}
function crmDraft(){
 try{
  const q=Core.quote(state,Proposal),draft={version:9,name:state.brand,sector:Core.SECTORS[state.sector].name,estimate:q.total,
   notes:(Core.brief(state)+'\nCódigo exportable: Web Builder V12.').slice(0,3500)};
  sessionStorage.setItem('abel-v9-crm-draft',JSON.stringify(draft));
  location.href='../herramientas/crm.html#studio-v9';
 }catch{status('No se pudo preparar el CRM en esta sesión.');}
}
function saveJson(){saveFile(Engine.projectJson(state),'Abel-Automation-Proyecto-V12.json','application/json');status('Archivo de configuración guardado en el dispositivo.');}
function importJson(file){
 if(!file)return;
 if(file.size>4_800_000){status('Archivo demasiado grande.');return;}
 file.text().then(text=>{state=Engine.importProject(text);refresh();status('Proyecto importado. Revisa contenidos antes de exportar.');})
 .catch(()=>status('No se pudo abrir un JSON V12 o V9 válido.'));
}
async function init(){
 initOptions();bindFields();window.addEventListener('message',onInlineEdit);
 $('export').addEventListener('click',exportZip);
 $('pdf').addEventListener('click',downloadPdf);$('crm').addEventListener('click',crmDraft);
 $('save-json').addEventListener('click',saveJson);
 $('import-json').addEventListener('click',()=>$('project-file').click());
 $('project-file').addEventListener('change',e=>{importJson(e.target.files?.[0]);e.target.value='';});
 try{
  const raw=sessionStorage.getItem('abel-v12-from-v9');
  if(raw){const parsed=JSON.parse(raw);state=Engine.fromV9(parsed);sessionStorage.removeItem('abel-v12-from-v9');}
  else if(new URLSearchParams(location.search).has('sector')){
   const sector=new URLSearchParams(location.search).get('sector');
   if(Object.prototype.hasOwnProperty.call(Core.SECTORS,sector))state=Engine.defaults(sector);
  }
 }catch{status('No se pudo recuperar la configuración anterior. Se usará la plantilla inicial.');}
 refresh();
 try{
  const [css,js]=await Promise.all(['../assets/site-runtime-v12.css','../assets/site-runtime-v12.js'].map(async url=>{
   const r=await fetch(url);if(!r.ok)throw Error('No se pudo cargar '+url);return r.text();
  }));
  runtimeCss=css;runtimeJs=js;renderPreview();
  status('Listo: edita la vista y descarga tu web cuando quieras.');
 }catch{status('No se han podido cargar las plantillas. Abre el proyecto con un servidor local, como python -m http.server 8000.');}
}
document.addEventListener('DOMContentLoaded',init);
})();