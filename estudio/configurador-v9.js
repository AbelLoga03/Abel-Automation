/* Abel Automation V9 · Studio Live — vista previa sin acciones reales ni HTML de usuario */
(()=>{
'use strict';
const Core=globalThis.AbelBuilderV9,Engine=globalThis.AbelProposalV8;
if(!Core||!Engine)return;
const $=id=>document.getElementById(id),html=(tag,cls='',txt)=>{
 const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined&&txt!==null)n.textContent=String(txt);return n;
};
let state=Core.defaults(),activeTab='business';
const format=Engine.euro;
const images=['portfolio-pizzeria.webp','portfolio-joyeria.webp','portfolio-barberia.webp','portfolio-taller.webp','portfolio-floristeria.webp','portfolio-libreria.webp'];
const imgpath=name=>'../assets/'+(images.includes(name)?name:'portfolio-joyeria.webp');
function status(msg){$('builder-message').textContent=msg;}
function put(parent,...children){parent.append(...children);return parent;}
function btn(text,className='',attrs={}){const n=html('button',className,text);n.type='button';for(const [k,v]of Object.entries(attrs))n.setAttribute(k,v);return n;}
function setState(change,{rerenderControls=false}={}){state=Core.normalize({...state,...change});renderPreview();updateQuote();if(rerenderControls)syncControls();}
function renderAll(){renderPreview();updateQuote();syncControls();}
function setTab(which,focus=false){
 activeTab=which;
 for(const id of ['business','design','blocks']){
  const on=id===which,tab=$('tab-'+id),panel=$('panel-'+id);
  tab.setAttribute('aria-selected',String(on));tab.tabIndex=on?0:-1;panel.hidden=!on;
 }
 if(focus)$('tab-'+which).focus();
}
function setupTabs(){
 for(const tab of document.querySelectorAll('[data-tab]')){
  tab.addEventListener('click',()=>setTab(tab.dataset.tab));
  tab.addEventListener('keydown',e=>{
   const names=['business','design','blocks'];let i=names.indexOf(activeTab);
   if(e.key==='ArrowRight')i=(i+1)%names.length;
   else if(e.key==='ArrowLeft')i=(i+2)%names.length;
   else if(e.key==='Home')i=0;
   else if(e.key==='End')i=2;
   else return;
   e.preventDefault();setTab(names[i],true);
  });
 }
}
function renderOptions(){
 const sectors=$('biz-sector');sectors.replaceChildren();
 for(const [id,c] of Object.entries(Core.SECTORS))sectors.add(new Option(c.name,id));
 const palettes=$('palette-options');palettes.replaceChildren();
 for(const [id,c] of Object.entries(Core.THEMES)){
  const b=btn('', 'palette-button',{'data-theme':id,'aria-pressed':String(state.theme===id)});
  const sw=html('span','swatches');
  for(const key of ['bg','ink','accent']){const i=html('i');i.style.background=c[key];sw.append(i);}
  put(b,sw,html('strong','',c.name));palettes.append(b);
  b.addEventListener('click',()=>setState({theme:id,custom:false,colors:{...c}},{rerenderControls:true}));
 }
 const styles=[['editorial','Editorial'],['bold','Impacto'],['minimal','Minimalista'],['playful','Creativo']];
 const layouts=[['split','Pantalla dividida'],['centered','Centrada'],['full','Fotografía completa']];
 for(const [id,label] of styles){
  const b=btn(label,'style-btn',{'data-style':id,'aria-pressed':String(state.style===id)});
  $('style-options').append(b);b.addEventListener('click',()=>setState({style:id},{rerenderControls:true}));
 }
 for(const [id,label] of layouts){
  const b=btn(label,'style-btn',{'data-layout':id,'aria-pressed':String(state.layout===id)});
  $('layout-options').append(b);b.addEventListener('click',()=>setState({layout:id},{rerenderControls:true}));
 }
}
function renderBlocks(){
 const list=$('blocks-list');list.replaceChildren();
 for(let index=0;index<state.order.length;index++){
  const id=state.order[index],meta=Core.SECTION_META.find(s=>s.id===id),enabled=state.sections.includes(id);
  const row=html('div','block-item'),label=html('label','block-toggle');
  const input=html('input');input.type='checkbox';input.value=id;input.checked=enabled;input.disabled=id==='hero';input.setAttribute('aria-label','Mostrar '+meta.name);
  input.addEventListener('change',()=>{
   const selected=new Set(state.sections);
   if(input.checked)selected.add(id);else selected.delete(id);
   setState({sections:[...selected]},{rerenderControls:true});
  });
  const metaText=html('span');put(metaText,html('strong','',meta.name),html('small','',meta.hint));
  put(label,input,metaText);
  const up=btn('↑','',{'aria-label':'Subir '+meta.name,'title':'Subir'}),down=btn('↓','',{'aria-label':'Bajar '+meta.name,'title':'Bajar'});
  up.disabled=index===0||id==='hero';down.disabled=index===state.order.length-1||id==='hero'||index===0;
  up.addEventListener('click',()=>move(id,-1));down.addEventListener('click',()=>move(id,1));
  put(row,label,up,down);list.append(row);
 }
}
function move(id,direction){
 if(id==='hero')return;
 const order=[...state.order],i=order.indexOf(id),j=i+direction;
 if(j<1||j>=order.length)return;
 [order[i],order[j]]=[order[j],order[i]];
 setState({order},{rerenderControls:true});
}
function syncControls(){
 $('biz-sector').value=state.sector;
 for(const field of [['biz-brand','brand'],['biz-headline','headline'],['biz-intro','intro'],['biz-cta','cta']])$(field[0]).value=state[field[1]];
 $('brand-count').textContent=state.brand.length+'/65 caracteres';
 $('font-select').value=state.font;
 $('biz-maintenance').value=state.maintenance;
 $('custom-toggle').checked=state.custom;
 $('color-controls').hidden=!state.custom;
 for(const key of ['bg','ink','accent','surface'])$('color-'+key).value=state.colors[key];
 for(const theme of document.querySelectorAll('[data-theme]'))theme.setAttribute('aria-pressed',String(state.theme===theme.dataset.theme&&!state.custom));
 for(const style of document.querySelectorAll('[data-style]'))style.setAttribute('aria-pressed',String(state.style===style.dataset.style));
 for(const layout of document.querySelectorAll('[data-layout]'))layout.setAttribute('aria-pressed',String(state.layout===layout.dataset.layout));
 for(const device of document.querySelectorAll('[data-device]'))device.setAttribute('aria-pressed',String(state.device===device.dataset.device));
 renderBlocks();
}
function controlBindings(){
 $('biz-sector').addEventListener('change',e=>{
  const sector=Core.SECTORS[e.target.value];if(!sector)return;
  setState({sector:e.target.value,brand:sector.brand,headline:sector.headline,intro:sector.intro,cta:sector.cta},{rerenderControls:true});
  status('Sector actualizado. Tus colores y bloques se han conservado.');
 });
 for(const pair of [['biz-brand','brand'],['biz-headline','headline'],['biz-intro','intro'],['biz-cta','cta']]){
  $(pair[0]).addEventListener('input',e=>{setState({[pair[1]]:e.target.value});if(pair[1]==='brand')$('brand-count').textContent=e.target.value.length+'/65 caracteres';});
 }
 $('font-select').addEventListener('change',e=>setState({font:e.target.value},{rerenderControls:true}));
 $('biz-maintenance').addEventListener('change',e=>setState({maintenance:e.target.value}));
 $('custom-toggle').addEventListener('change',e=>{
  const custom=e.target.checked;
  setState({custom},{rerenderControls:true});
 });
 for(const key of ['bg','ink','accent','surface']){
  $('color-'+key).addEventListener('input',e=>setState({custom:true,colors:{...state.colors,[key]:e.target.value}}));
 }
 for(const b of document.querySelectorAll('[data-device]'))b.addEventListener('click',()=>setState({device:b.dataset.device},{rerenderControls:true}));
 $('reset-config').addEventListener('click',()=>{
  if(!confirm('¿Restaurar la configuración inicial? Se perderán los cambios no exportados.'))return;
  state=Core.defaults(state.sector);renderAll();status('Configuración restaurada.');
 });
}
function picture(name,alt){const node=html('img');node.src=imgpath(name);node.alt=alt;node.loading='lazy';return node;}
function section(title,overline){
 const node=html('section','s-section');
 if(overline)node.append(html('p','s-overline',overline));
 if(title)node.append(html('h3','',title));
 return node;
}
function makeCards(labels,sector,withImage=false){
 const cards=html('div','s-cards');
 labels.forEach((item,i)=>{
  const card=html('article','s-card');
  if(withImage)card.append(picture(images[(images.indexOf(sector.hero)+i+images.length)%images.length],'Fotografía ilustrativa de producto'));
  put(card,html('strong','',item),html('p','','Ejemplo visual personalizable para tu negocio.'));
  cards.append(card);
 });return cards;
}
function displaySection(id,sector){
 let p;
 switch(id){
 case 'about':
  p=section('La historia detrás de '+state.brand,'SOBRE NOSOTROS');
  put(p,html('p','',state.intro+' Aquí puedes contar tu historia, equipo o filosofía con tus propios textos e imágenes.'));break;
 case 'services':
  p=section('Mucho más que un servicio','LO QUE HACEMOS');
  p.append(makeCards(sector.services,sector));break;
 case 'products':
  p=section('Descubre nuestros favoritos','CATÁLOGO');
  p.append(makeCards(sector.products,sector,true));break;
 case 'gallery':
  p=section('En imágenes','GALERÍA');
  const gallery=html('div','s-gallery');
  for(let i=0;i<3;i++)gallery.append(picture(images[(i+images.indexOf(sector.hero))%images.length],'Imagen ilustrativa '+(i+1)));
  p.append(gallery);break;
 case 'qr':
  p=section('Nuestra carta digital','CARTA QR');
  put(p,makeCards(sector.products,sector),html('p','s-note','Previsualización ficticia. No genera un QR funcional ni acepta pedidos.'));break;
 case 'booking':
  p=section('Elige tu próximo momento','SOLICITUD DE RESERVA');
  put(p,html('div','s-placeholder','◈ Consulta de disponibilidad · Formulario simulado'),html('p','s-note','No se comprueba disponibilidad ni se confirma una reserva.'));break;
 case 'testimonials':
  p=section('Así nos gustaría hacerte sentir','EXPERIENCIAS');
  put(p,html('p','s-quote','“Aquí irían testimonios reales, publicados únicamente con autorización.”'),html('p','s-note','Texto ilustrativo, no es una reseña de un cliente.'));break;
 case 'faq':
  p=section('Preguntas habituales','PREGUNTAS');
  ['¿Cómo se solicita información?','¿Qué incluye el servicio?','¿Puedo contactar directamente?'].forEach(t=>p.append(html('div','s-accordion',t+'   +')));break;
 case 'map':
  p=section('Dónde encontrarnos','UBICACIÓN');
  put(p,html('div','s-placeholder','⌖ Aquí iría el mapa del negocio'),html('p','s-note','No se muestra ni se comparte ninguna ubicación real.'));break;
 case 'contact':
  p=section('Tu próximo paso comienza aquí','CONTACTO');
  put(p,html('p','','Dirección, horario y teléfono de ejemplo. En el proyecto definitivo se usarán únicamente los datos autorizados.'),html('span','s-pill','Contactar (demo) ↗'));break;
 case 'form':
  p=section('Cuéntanos qué necesitas','SOLICITUD DE INFORMACIÓN');
  const f=html('div','s-form'),a=html('input'),b=html('input'),c=html('textarea');
  a.placeholder='Tu nombre (demo)';b.placeholder='Tu correo (demo)';c.placeholder='Cuéntanos tu idea (demo)';
  for(const x of [a,b,c]){x.disabled=true;x.setAttribute('aria-label',x.placeholder);}
  put(f,a,b,c);put(p,f,html('p','s-note','Formulario visual deshabilitado, no envía información.'));break;
 case 'whatsapp':
  p=section('¿Hablamos?','CONTACTO DIRECTO');
  put(p,html('span','s-pill','WhatsApp (sin conexión en demo)'),html('p','s-note','Para el proyecto real se requiere un teléfono autorizado.'));break;
 default:return null;
 }
 return p;
}
function contrastOn(hex){
 const channels=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
 const luminance=channels.map(c=>c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4)).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);
 return luminance>.48?'#161821':'#ffffff';
}
function renderPreview(){
 const site=$('site-canvas'),sector=Core.SECTORS[state.sector];
 site.dataset.device=state.device;site.dataset.style=state.style;site.dataset.font=state.font;site.dataset.layout=state.layout;
 for(const [key,variable]of [['bg','--c-bg'],['ink','--c-ink'],['accent','--c-accent'],['surface','--c-surface']])site.style.setProperty(variable,state.colors[key]);
 site.style.setProperty('--c-button',contrastOn(state.colors.accent));
 const scrolled=site.scrollTop;
 site.replaceChildren();
 const nav=html('header','s-nav'),logo=html('strong','s-logo',state.brand),navlinks=html('div','s-navlinks');
 for(const text of ['INICIO','SERVICIOS','CONTACTO'])navlinks.append(html('span','',text));
 put(nav,logo,navlinks);site.append(nav);
 const hero=html('section','s-hero'),copy=html('div','s-hero-content');
 put(copy,html('small','s-kicker',sector.label),html('h2','s-title',state.headline),html('p','s-lead',state.intro),html('span','s-btn',state.cta+' ↗'));
 const image=html('div','s-photo');image.style.backgroundImage='url("'+imgpath(sector.hero)+'")';
 image.setAttribute('role','img');image.setAttribute('aria-label','Imagen de demostración del sector');
 put(hero,copy,image);site.append(hero);
 for(const id of state.order){
  if(id==='hero'||id==='seo'||!state.sections.includes(id))continue;
  const block=displaySection(id,sector);if(block)site.append(block);
 }
 const footer=html('footer','s-sitefooter');
 put(footer,html('strong','',state.brand),html('span','','CONCEPTO DIGITAL · DEMO NO OFICIAL'));
 site.append(footer);
 site.scrollTop=scrolled;
 $('preview-summary').textContent=sector.name+' · '+state.sections.length+' bloques seleccionados';
}
function updateQuote(){
 try{
  const q=Core.quote(state,Engine);
  $('builder-price').textContent=(q.from?'desde ':'')+format(q.total);
  $('builder-price-detail').textContent=q.base.name+' · '+q.extras.length+' extra'+(q.extras.length===1?'':'s')+
   (q.maintenance.price?' · '+(q.maintenance.from?'desde ':'')+format(q.maintenance.price)+'/mes':' · sin mantenimiento');
 }catch(e){$('builder-price').textContent='Consultar';$('builder-price-detail').textContent='El presupuesto no está disponible.';}
}
function download(bytes,filename,mime){
 const blob=new Blob([bytes],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),6000);
}
function createPdf(){
 try{
  const selection=Core.priceIds(state),quote=Core.quote(state,Engine);
  const data={...selection,client:'Cliente por definir',project:'Propuesta para '+state.brand,scope:Core.brief(state),
   notes:'Prototipo conceptual no publicado. Las secciones visuales que no formen parte del plan base se valorarán aparte según el alcance final.'};
  download(Engine.pdfDocument(data),'Abel-Automation-V9-'+new Date().toISOString().slice(0,10)+'.pdf','application/pdf');
  status('Propuesta PDF generada. Confirma el alcance y las condiciones antes de enviarla.');
 }catch(e){status('No se pudo crear el PDF. Revisa la configuración.');}
}
function editProposal(){
 try{
  const packet={version:9,config:Core.normalize(state)};
  sessionStorage.setItem('abel-v9-proposal-draft',JSON.stringify(packet));
  location.href='../herramientas/propuestas-v8.html?studio=v9';
 }catch{status('No se pudo abrir el editor de propuesta. Inténtalo desde la página de presupuestos.');}
}
function moveToCrm(){
 try{
  const quote=Core.quote(state,Engine),p={version:9,name:state.brand,sector:Core.SECTORS[state.sector].name,estimate:quote.total,notes:Core.brief(state)};
  sessionStorage.setItem('abel-v9-crm-draft',JSON.stringify(p));
  location.href='../herramientas/crm.html#studio-v9';
 }catch{status('No se pudo preparar el traspaso local. Comprueba que el navegador permite almacenamiento de sesión.');}
}
function saveJson(){download(Core.serialize(state),'abel-automation-concepto-v9.json','application/json');status('JSON generado con tu configuración visual. No contiene contactos del CRM.');}
function loadJson(file){
 if(!file)return;
 if(file.size>18000){status('El JSON es demasiado grande (máximo 18 KB).');return;}
 file.text().then(text=>{state=Core.importJson(text);renderAll();status('Configuración importada. Revisa la vista y los precios.');})
 .catch(()=>status('El archivo no es un JSON de configuración V9 válido.'));
}
function share(){
 try{
  const link=location.origin+location.pathname+'#config='+Core.shareToken(state);
  if(link.length>8500)throw Error('Enlace demasiado largo');
  navigator.clipboard.writeText(link).then(()=>status('Enlace copiado. Recuerda que cualquier persona con el enlace podrá ver la marca y los textos de este diseño.'))
   .catch(()=>{location.hash='config='+Core.shareToken(state);status('El navegador no permitió copiar. La URL de esta pestaña contiene ahora la configuración.');});
 }catch{status('No se pudo generar el enlace. Prueba a exportar el JSON.');}
}
function restoreLink(){
 const token=location.hash.startsWith('#config=')?location.hash.slice(8):null;
 if(!token)return;
 try{state=Core.parseToken(token);status('Configuración restaurada desde un enlace compartido.');}
 catch{status('El enlace no contiene una configuración válida. Se cargó la plantilla inicial.');}
}
function init(){
 setupTabs();renderOptions();
 const sectorParam=new URLSearchParams(location.search).get('sector');
 if(!location.hash.startsWith('#config=')&&Object.prototype.hasOwnProperty.call(Core.SECTORS,sectorParam))state=Core.defaults(sectorParam);
 restoreLink();renderAll();
 controlBindings();
 $('builder-pdf').addEventListener('click',createPdf);
 $('builder-edit-proposal').addEventListener('click',editProposal);
 $('builder-crm').addEventListener('click',moveToCrm);
 $('save-config').addEventListener('click',saveJson);
 $('load-config').addEventListener('click',()=>$('load-config-file').click());
 $('load-config-file').addEventListener('change',e=>{loadJson(e.target.files[0]);e.target.value='';});
 $('share-config').addEventListener('click',share);
 window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#config=')){restoreLink();renderAll();}});
}
document.addEventListener('DOMContentLoaded',init);
})();
