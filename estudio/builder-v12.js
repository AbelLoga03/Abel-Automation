/* Abel Automation V12 · editor real de sitios sin servicios externos */
(()=>{
'use strict';
const Core=globalThis.AbelBuilderV9,Engine=globalThis.AbelWebExportV12,Proposal=globalThis.AbelProposalV8,Store=globalThis.AbelProjectsV13,Templates=globalThis.AbelTemplatesV14,Multipage=globalThis.AbelMultipageV14,Pages=globalThis.AbelPageStudioV15;
if(!Core||!Engine||!Proposal)return;
const $=id=>document.getElementById(id);
let state=Engine.defaults(),runtimeCss='',runtimeJs='',tab='brand',renderVersion=0,busy=false;
let past=[],future=[],lastEditKey='',lastEditTime=0,saveTimer=null,selectedText=null;state.v14=Multipage.normalize({});state.v15=Pages.normalize({});
const status=message=>{$('status').textContent=message;};
const el=(tag,text='',className='')=>{const n=document.createElement(tag);if(text)n.textContent=text;if(className)n.className=className;return n;};
function saveFile(content,name,mime){
 const blob=new Blob([content],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;
 document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),7000);
}
function historyUI(){ $('undo').disabled=!past.length;$('redo').disabled=!future.length; }
function saveSoon(){
 clearTimeout(saveTimer);
 $('autosave-status').textContent='Guardando…';
 saveTimer=setTimeout(()=>{$('autosave-status').textContent=Store&&Store.saveDraft(state)?'Guardado local ✓':'No se pudo guardar';},650);
}
function remember(next,key=''){
 const prev=JSON.stringify(state);if(JSON.stringify(next)===prev)return false;
 const now=Date.now();if(!key||key!==lastEditKey||now-lastEditTime>600){past.push(prev);if(past.length>35)past.shift();}
 lastEditKey=key;lastEditTime=now;future=[];historyUI();return true;
}
function update(values,refresh=true,key=''){
 const next=Engine.normalize({...state,...values});next.v14=Multipage.normalize(values.v14||state.v14);next.v15=Pages.normalize(values.v15||state.v15);if(!remember(next,key))return;
 state=next;renderPreview();quote();if(refresh)syncControls();saveSoon();
}
function replaceProject(next,track=true){
 const normalized=Engine.normalize(next);normalized.v14=Multipage.normalize(next.v14||{});normalized.v15=Pages.normalize(next.v15||{});
 if(track)remember(normalized);
 state=normalized;renderPreview();quote();syncControls();saveSoon();historyUI();
}
function stepHistory(stack,to){
 if(!stack.length)return;const item=stack.pop();to.push(JSON.stringify(state));if(to.length>35)to.shift();
 const raw=JSON.parse(item);state=Engine.importProject(item);state.v14=Multipage.normalize(raw.v14||{});state.v15=Pages.normalize(raw.v15||{});lastEditKey='';renderPreview();quote();syncControls();historyUI();saveSoon();
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
 for(const template of Templates.PRESETS)$('v14-template').add(new Option(template.name,template.id));
 for(const image of Engine.IMAGES){
  const label=image.replace('portfolio-','').replace('.webp','').replace(/-/g,' ');
  $('image').add(new Option(label.charAt(0).toUpperCase()+label.slice(1),image));
 }
}
function syncControls(){
 for(const key of ['sector','brand','headline','intro','cta','email','phone','location','theme','font','layout','style','image','maintenance'])$(key).value=state[key];$('v15-form-mode').value=state.formMode||'mailto';
 $('custom').checked=state.custom;$('color-options').hidden=!state.custom;
 const palette=$('palette-preview');palette.replaceChildren();
 for(const key of ['bg','ink','accent','surface']){
  const block=el('span');block.style.background=state.colors[key];block.title=key+': '+state.colors[key];palette.append(block);
  $('color-'+key).value=state.colors[key];
 }
 for(const button of document.querySelectorAll('[data-device]'))button.setAttribute('aria-pressed',String(button.dataset.device===state.device));
 renderBlocks();renderPageControls();renderTemplateGallery();syncPageEditor();
}
function renderTemplateGallery(){
 const box=$('v14-template-gallery');box.replaceChildren();
 for(const preset of Templates.PRESETS.filter(p=>p.sector===state.sector)){
  const btn=el('button','','v14-preset-card');btn.type='button';btn.setAttribute('aria-label','Aplicar '+preset.name);
  const canvas=el('span','','v14-preset-preview'),theme=Core.THEMES[preset.theme];
  canvas.style.background=theme.bg;canvas.style.color=theme.ink;
  const top=el('span','','v14-preset-bar');top.style.background=theme.surface;
  const heading=el('strong',preset.direction==='impacto'?'GRAN IMPACTO':preset.direction==='editorial'?'Estilo editorial':'Minimal');
  const accent=el('span','','v14-preset-accent');accent.style.background=theme.accent;
  canvas.append(top,heading,accent);btn.append(canvas,el('small',preset.name.split(' · ')[1]||preset.name));
  if(state.style===preset.style&&state.layout===preset.layout&&state.theme===preset.theme)btn.classList.add('active');
  btn.addEventListener('click',()=>{replaceProject({...Templates.apply(preset.id,state),v14:state.v14});$('v14-template').value=preset.id;status('Estilo visual '+preset.name+' aplicado.');});
  box.append(btn);
 }
}
function renderPageControls(){
 const cfg=Multipage.normalize(state.v14);$('v14-multipage').checked=cfg.multipage;
 $('v14-pages-list').hidden=!cfg.multipage;const list=$('v14-pages-list');list.replaceChildren();
 const preview=$('v14-page-preview'),prior=preview.value;preview.replaceChildren();
 for(const page of Multipage.PAGE_DEFS){
  const enabled=cfg.pages.includes(page.id);const label=el('label','','v14-page-choice');const check=el('input');check.type='checkbox';check.checked=enabled;check.disabled=page.id==='home';
  check.addEventListener('change',()=>{const set=new Set(cfg.pages);check.checked?set.add(page.id):set.delete(page.id);update({v14:{multipage:true,pages:[...set]}});});
  label.append(check,document.createTextNode(page.name));list.append(label);
  if(!cfg.multipage||enabled)preview.add(new Option(page.name,page.id));
 }
 preview.value=[...preview.options].some(x=>x.value===prior)?prior:'home';
}
function renderBlocks(){
 const box=$('blocks');box.replaceChildren();
 state.order.forEach((id,i)=>{
  const info=Core.SECTION_META.find(x=>x.id===id),row=el('div','','block'),label=el('label');
  row.draggable=i>0;row.dataset.block=id;row.title=i>0?'Arrastra para reordenar la sección':'';
  row.addEventListener('dragstart',e=>{if(i===0){e.preventDefault();return;}e.dataTransfer.setData('text/plain',id);e.dataTransfer.effectAllowed='move';});
  row.addEventListener('dragover',e=>{if(i>0)e.preventDefault();});
  row.addEventListener('drop',e=>{e.preventDefault();const dragged=e.dataTransfer.getData('text/plain');const a=state.order.indexOf(dragged),b=state.order.indexOf(id);if(a<=0||b<=0||a===b)return;const next=[...state.order];next.splice(a,1);next.splice(b,0,dragged);update({order:next});status('Sección reordenada.');});
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
  }
  if(['services','products'].includes(id)){
   const add=el('button','+ Copiar tarjeta'),remove=el('button','− Quitar');add.type='button';remove.type='button';
   add.className='v13-card-tool';remove.className='v13-card-tool';
   add.disabled=state[id].length>=6;remove.disabled=state[id].length<=1;
   add.setAttribute('aria-label','Duplicar tarjeta de '+info.name);remove.setAttribute('aria-label','Quitar última tarjeta de '+info.name);
   add.addEventListener('click',()=>{const items=[...state[id]];items.push(items[items.length-1]);update({[id]:items});status('Tarjeta duplicada. Edita su texto en la vista previa.');});
   remove.addEventListener('click',()=>{update({[id]:state[id].slice(0,-1)});status('Se ha quitado la última tarjeta.');});
   const tools=el('div','','v13-card-tools');tools.append(add,remove);row.append(tools);
  }
  if(['about','services','products','gallery'].includes(id)){
   const wrap=el('label','','v13-photo-block');wrap.append(el('span','Imagen del bloque: '));
   const select=el('select');select.setAttribute('aria-label','Fotografía de '+info.name);
   select.add(new Option('Sin imagen adicional',''));
   for(const name of Engine.IMAGES)select.add(new Option(name.replace('portfolio-','').replace('.webp',''),name));
   select.value=state.sectionImages?.[id]||'';
   select.addEventListener('change',()=>update({sectionImages:{...state.sectionImages,[id]:select.value}}));
   wrap.append(select);row.append(wrap);
  }
  box.append(row);
 });
}
function quote(){
 try{const amount=Core.quote(state,Proposal);
  $('price').textContent=(amount.from?'desde ':'')+Proposal.euro(amount.total);
  $('price-monthly').textContent=amount.maintenance.price?(amount.maintenance.from?'desde ':'')+Proposal.euro(amount.maintenance.price)+'/mes':'Sin mantenimiento';
 }catch{$('price').textContent='Consultar';$('price-monthly').textContent='';}
}

/* V15 independent-page inspector and image library */
function currentPage(){return $('v14-page-preview')?.value||'home';}
function syncPageEditor(){
 if(!$('v15-page-indicator'))return;
 const page=currentPage(),data=Pages.normalize(state.v15),entry=data.pages[page];
 $('v15-page-indicator').textContent=Multipage.PAGE_DEFS.find(p=>p.id===page)?.name||'Inicio';
 for(const field of ['headline','intro','cta','layout'])$('v15-'+field).value=entry[field]||'';
 const select=$('v15-photo-select');select.replaceChildren();
 select.add(new Option('Fotografía de la plantilla','template'));
 select.add(new Option('Fotografía principal anterior','custom'));
 for(const photo of data.media)select.add(new Option(photo.name+' ('+photo.type.toUpperCase()+')',photo.id));
 select.value=entry.image;
 const box=$('v15-photo-library');box.replaceChildren();
 for(const photo of data.media){
  const card=el('div','','v15-photo-card');
  const image=el('img');image.src=photo.data;image.alt='Vista previa de '+photo.name;image.loading='lazy';
  const desc=el('small',photo.name),choose=el('button','Usar aquí'),remove=el('button','Eliminar');
  choose.type='button';remove.type='button';
  choose.addEventListener('click',()=>updatePage({image:photo.id}));
  remove.addEventListener('click',()=>{if(!confirm('¿Eliminar esta fotografía del proyecto y de las páginas que la utilicen?'))return;update({v15:Pages.without(state.v15,photo.id)});});
  card.append(image,desc,choose,remove);box.append(card);
 }
 const sectionBox=$('v15-section-list');sectionBox.replaceChildren();
 for(const id of Core.SECTION_META.map(x=>x.id).filter(id=>id!=='hero'&&id!=='seo')){
  const label=el('label','','v15-section-entry'),check=el('input');check.type='checkbox';
  const list=entry.sections.length?entry.sections:state.sections.filter(x=>x!=='hero'&&x!=='seo');
  check.checked=list.includes(id);
  check.addEventListener('change',()=>{
   const set=new Set(entry.sections.length?entry.sections:list);
   check.checked?set.add(id):set.delete(id);
   updatePage({sections:[...set]});
  });
  label.append(check,document.createTextNode(Core.SECTION_META.find(x=>x.id===id).name));sectionBox.append(label);
 }
}
function updatePage(patch,key=''){
 const id=currentPage(),data=Pages.normalize(state.v15);
 data.pages[id]={...data.pages[id],...patch};
 update({v15:data},true,'v15-'+id+'-'+key);
}
async function optimizedImage(file){
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8_000_000)throw Error('Usa JPG, PNG o WebP de hasta 8 MB de origen.');
 const url=URL.createObjectURL(file);
 try{
  const bitmap=await createImageBitmap(file);
  const width=Math.min(bitmap.width,1200),height=Math.min(bitmap.height,Math.round(width*9/16));
  if(width<20||height<20)throw Error('La fotografía es demasiado pequeña');
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const ctx=canvas.getContext('2d');if(!ctx)throw Error('No hay soporte de imágenes');
  const scale=Math.max(width/bitmap.width,height/bitmap.height),dw=bitmap.width*scale,dh=bitmap.height*scale;
  ctx.drawImage(bitmap,(width-dw)/2,(height-dh)/2,dw,dh);bitmap.close?.();
  let result='';
  for(const q of [.85,.7,.55,.4]){
   result=canvas.toDataURL('image/webp',q);
   if(Pages.summary({media:[{id:'photo-1',data:result,name:'Imagen'}]}).bytes<=Pages.PHOTO_BYTES)break;
  }
  if(!/^data:image\/webp;base64,/.test(result))throw Error('El navegador no permite exportar WebP');
  if(Pages.summary({media:[{id:'photo-1',data:result,name:'Imagen'}]}).bytes>Pages.PHOTO_BYTES)throw Error('La imagen supera el límite de 1,45 MB optimizada');
  return result;
 }finally{URL.revokeObjectURL(url);}
}
function bindPageEditor(){
 for(const field of ['headline','intro','cta','layout']){
  $('v15-'+field).addEventListener(field==='layout'?'change':'input',e=>updatePage({[field]:e.target.value},field));
 }
 $('v15-photo-select').addEventListener('change',e=>updatePage({image:e.target.value}));
 $('v15-reset-sections').addEventListener('click',()=>updatePage({sections:[]}));
 $('v15-photo-upload').addEventListener('change',async e=>{
  const file=e.target.files?.[0];e.target.value='';if(!file)return;
  try{const data=await optimizedImage(file),library=Pages.attach(state.v15,{name:file.name,data});
   update({v15:library});status('Imagen optimizada, recortada a 16:9 y añadida en este navegador. El ZIP contendrá su archivo real.');
  }catch(error){status('No se pudo añadir la foto: '+error.message);}
 });
}

function renderPreview(){
 if(!runtimeCss||!runtimeJs)return;
 const config=Multipage.normalize(state.v14),selected=$('v14-page-preview')?.value||'home';
 $('live-preview').srcdoc=config.multipage?Multipage.makePage(state,{...config,v15:state.v15},config.pages.includes(selected)?selected:'home',true,runtimeCss,runtimeJs):Engine.htmlText(state,true,runtimeCss,runtimeJs);
 $('live-preview').dataset.device=state.device;
}
function bindFields(){
 $('v14-template').addEventListener('change',e=>{if(!e.target.value)return;
  replaceProject({...Templates.apply(e.target.value,state),v14:state.v14});status('Plantilla premium aplicada; puedes modificarla libremente.');});
 $('v14-multipage').addEventListener('change',e=>{update({v14:{...state.v14,multipage:e.target.checked}});status(e.target.checked?'Modo multipágina activado; selecciona las páginas.':'Modo de una sola página activado.');});
 $('v14-page-preview').addEventListener('change',()=>{syncPageEditor();renderPreview();});
 bindPageEditor();
 $('v15-form-mode').addEventListener('change',e=>update({formMode:e.target.value}));
 $('v14-apply-selection').addEventListener('click',()=>{if(!selectedText)return;onInlineEdit({source:$('live-preview').contentWindow,data:{type:'ABEL_V12_EDIT',...selectedText,value:$('v14-selected-input').value}});});
 $('sector').addEventListener('change',e=>{
  const newSector=e.target.value,prev=state;
  replaceProject({...Engine.defaults(newSector),theme:prev.theme,style:prev.style,font:prev.font,layout:prev.layout,
   custom:prev.custom,colors:prev.colors,sections:prev.sections,order:prev.order,maintenance:prev.maintenance,email:prev.email,phone:prev.phone,location:prev.location,v14:prev.v14,v15:prev.v15,formMode:prev.formMode});
  status('Plantilla de sector actualizada. Tus colores, bloques y datos de contacto se han conservado.');
 });
 for(const field of ['brand','headline','intro','cta','email','phone','location','font','layout','style','image','maintenance']){
  $(field).addEventListener(field==='brand'||field==='headline'||field==='intro'||field==='cta'?'input':'change',e=>{
   const val=e.target.value;
   update({[field]:val,...(field==='image'?{customPhoto:''}:{})},false,['brand','headline','intro','cta'].includes(field)?field:'');
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
 $('reset').addEventListener('click',()=>{if(!confirm('¿Restaurar la plantilla? Se perderán los cambios no exportados.'))return;replaceProject(Engine.defaults(state.sector));status('Plantilla restaurada (puedes deshacer).');});
 $('undo').addEventListener('click',()=>stepHistory(past,future));
 $('redo').addEventListener('click',()=>stepHistory(future,past));
 document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&!e.altKey){if(e.key.toLowerCase()==='z'&&!e.shiftKey){e.preventDefault();stepHistory(past,future);}else if(e.key.toLowerCase()==='y'||(e.key.toLowerCase()==='z'&&e.shiftKey)){e.preventDefault();stepHistory(future,past);}}});
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
 if(event.data.type==='ABEL_V14_SELECT'){
  const {kind,key,value}=event.data;if(typeof value!=='string'||value.length>240)return;
  selectedText={kind,key};$('v14-selected-label').textContent='Editando '+kind+' · '+key;
  $('v14-selected-input').value=value;return;
 }
 if(event.data.type==='ABEL_V12_PHOTO_PICK'){setTab('design');$('image').focus();status('Elige una fotografía o sube una imagen propia.');return;}
 if(event.data.type!=='ABEL_V12_EDIT')return;
 const {kind,key,value}=event.data;
 if(typeof value!=='string'||value.length>240)return;
 const independent=state.v14?.multipage===true;
 const data=Pages.normalize(state.v15),entry=data.pages[currentPage()];
 if(kind==='field'&&['brand','headline','intro','cta'].includes(key)){
  if(independent&&key!=='brand')updatePage({[key]:value},key);
  else update({[key]:value});
  status('Texto actualizado en '+(independent?'esta página.':'el proyecto.'));
 }else if(kind==='heading'&&Object.prototype.hasOwnProperty.call(Engine.TITLES,key)){
  if(independent)updatePage({titles:{...entry.titles,[key]:value}});
  else update({titles:{...state.titles,[key]:value}});
  status('Título de sección actualizado.');
 }else if(kind==='card'&&/^(services|products):[0-5]$/.test(key)){
  const [group,index]=key.split(':'),items=[...(independent&&entry[group].length?entry[group]:state[group])];
  items[Number(index)]=value;
  if(independent)updatePage({[group]:items});else update({[group]:items});
  status('Tarjeta actualizada en '+(independent?'esta página.':'el proyecto.'));
 }
}
async function exportZip(){
 if(busy)return;busy=true;$('export').disabled=true;status('Preparando los archivos del proyecto.');
 try{
  if(!runtimeCss||!runtimeJs)throw Error('No se han cargado las plantillas');
  const files=Multipage.generate(state,{...state.v14,v15:state.v15},runtimeCss,runtimeJs);
  const assets=Engine.IMAGES;
  for(const name of assets){
   const response=await fetch('../assets/'+name,{cache:'default'});
   if(!response.ok)throw Error('No se pudo incorporar '+name);
   const bin=new Uint8Array(await response.arrayBuffer());
   files['assets/'+name]=bin;
  }
  if(state.customPhoto)files['assets/'+Engine.imageName(state)]=Engine.imageBytes(state.customPhoto);
  const zip=Engine.buildZip(files);
  saveFile(zip,state.v14?.multipage?'Abel-Automation-Multipagina-V15.zip':'Abel-Automation-Web-V15.zip','application/zip');
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
function saveJson(){saveFile(JSON.stringify({...Engine.normalize(state),v14:Multipage.normalize(state.v14),v15:Pages.normalize(state.v15)},null,2),'Abel-Automation-Proyecto-V15.json','application/json');status('Proyecto completo y estructura de páginas guardados en este dispositivo.');}
function importJson(file){
 if(!file)return;
 if(file.size>4_800_000){status('Archivo demasiado grande.');return;}
 file.text().then(text=>{const raw=JSON.parse(text),base=raw.version===14?raw.project:raw;
  replaceProject({...Engine.importProject(JSON.stringify(base)),v14:Multipage.normalize(raw.v14||raw.pages&&{multipage:true,pages:raw.pages}||{}),v15:Pages.normalize(raw.v15||{})});status('Proyecto importado. Revisa contenidos antes de exportar.');})
 .catch(()=>status('No se pudo abrir un JSON V12 o V9 válido.'));
}
async function init(){
 initOptions();bindFields();window.addEventListener('message',onInlineEdit);
 $('save-project').addEventListener('click',()=>{try{if(!Store)throw Error('Gestor de proyectos no disponible');Store.create(state,state.brand);status('Guardado en Mis proyectos de este navegador. Correo, teléfono, dirección y fotos subidas no se conservan en la biblioteca.');}catch(e){status('No se pudo guardar: '+e.message);}});
 $('export').addEventListener('click',exportZip);
 $('pdf').addEventListener('click',downloadPdf);$('crm').addEventListener('click',crmDraft);
 $('save-json').addEventListener('click',saveJson);
 $('import-json').addEventListener('click',()=>$('project-file').click());
 $('project-file').addEventListener('change',e=>{importJson(e.target.files?.[0]);e.target.value='';});
 try{
  const fromStudio=sessionStorage.getItem('abel-v13-open-project');
  const raw=sessionStorage.getItem('abel-v12-from-v9');
  if(fromStudio){const data=JSON.parse(fromStudio);state=Engine.importProject(fromStudio);state.v14=Multipage.normalize(data.v14||{});state.v15=Pages.normalize(data.v15||{});sessionStorage.removeItem('abel-v13-open-project');}
  else if(raw){const parsed=JSON.parse(raw);state=Engine.fromV9(parsed);sessionStorage.removeItem('abel-v12-from-v9');}
  else if(!new URLSearchParams(location.search).has('new')&&!new URLSearchParams(location.search).has('sector')&&Store?.draft()){state=Store.draft();state.v14=Multipage.normalize(state.v14||{});state.v15=Pages.normalize(state.v15||{});status('Se ha recuperado el diseño autoguardado de este navegador.');}
  else if(new URLSearchParams(location.search).has('sector')){
   const sector=new URLSearchParams(location.search).get('sector');
   if(Object.prototype.hasOwnProperty.call(Core.SECTORS,sector))state=Engine.defaults(sector);
  }
 }catch{status('No se pudo recuperar la configuración anterior. Se usará la plantilla inicial.');}
 state.v14=Multipage.normalize(state.v14||{});state.v15=Pages.normalize(state.v15||{});refresh();historyUI();
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