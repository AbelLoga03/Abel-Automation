/* Abel Automation V12: plantillas y exportador ZIP real, sin dependencias ni red externa */
(function(root,factory){const api=factory(root.AbelBuilderV9);if(typeof module!=='undefined'&&module.exports)module.exports=api;root.AbelWebExportV12=api;})(typeof globalThis!=='undefined'?globalThis:this,(B)=>{
'use strict';
const IMAGES=['portfolio-pizzeria.webp','portfolio-joyeria.webp','portfolio-barberia.webp','portfolio-taller.webp','portfolio-floristeria.webp','portfolio-libreria.webp'];
const TITLES={about:'Nuestra historia',services:'Nuestros servicios',products:'Nuestros productos',gallery:'Galería',qr:'Carta digital',booking:'Consulta de disponibilidad',testimonials:'Opiniones de clientes',faq:'Preguntas frecuentes',map:'Dónde encontrarnos',contact:'Contacta',form:'Escríbenos',whatsapp:'WhatsApp',automation:'Automatización'};
const text=(value,max=250)=>String(typeof value==='string'?value:'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max);
const escapeHtml=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isEmail=x=>typeof x==='string'&&x.length<=150&&/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(x);
const isPhone=x=>typeof x==='string'&&/^\+[1-9]\d{7,14}$/.test(x);
const isPhoto=x=>typeof x==='string'&&x.length<4500000&&/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(x);
function defaults(sector='restaurante'){const base=B.defaults(sector),s=B.SECTORS[base.sector];return {...base,version:12,email:'',phone:'',location:'',image:s.hero,customPhoto:'',titles:{...TITLES},services:[...s.services],products:[...s.products]};}
function normalize(raw){
 const x=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{},b=B.normalize(x),s=B.SECTORS[b.sector];
 const titles={};for(const id of Object.keys(TITLES))titles[id]=text(x.titles?.[id],85)||TITLES[id];
 const tri=(v,fallback)=>Array.from({length:3},(_,i)=>text(Array.isArray(v)?v[i]:fallback[i],75)||fallback[i]);
 return {...b,version:12,email:isEmail(x.email)?x.email:'',phone:isPhone(x.phone)?x.phone:'',
 location:text(x.location,150),image:IMAGES.includes(x.image)?x.image:s.hero,customPhoto:isPhoto(x.customPhoto)?x.customPhoto:'',
 titles,services:tri(x.services,s.services),products:tri(x.products,s.products)};
}
function fromV9(config){if(config?.version!==9)throw Error('Proyecto V9 inválido');return normalize(config);}
function imageName(x){const p=normalize(x);if(!p.customPhoto)return p.image;const type=p.customPhoto.slice(11,p.customPhoto.indexOf(';'));return 'hero-personalizada.'+(type==='jpeg'?'jpg':type);}
const path=(name,preview)=> (preview?'../assets/':'assets/')+name;
const edit=(enabled,key,id)=>enabled?' data-'+key+'="'+id+'" contenteditable="true" spellcheck="true"':'';
function cards(list,id,preview){
 return '<div class="cards">'+list.map((name,i)=>'<article class="card"><small>0'+(i+1)+'</small><h3'+edit(preview,'card',id+':'+i)+'>'+escapeHtml(name)+'</h3><p>Texto de ejemplo que podrás sustituir por información de tu negocio.</p></article>').join('')+'</div>';
}
function section(id,p,preview){
 const heading='<p class="kicker">'+escapeHtml(id.toUpperCase())+'</p><h2'+edit(preview,'heading',id)+'>'+escapeHtml(p.titles[id]||TITLES[id])+'</h2>';
 let body='';
 if(id==='about')body='<p class="lead">'+escapeHtml(p.intro)+'</p><p>Tu historia, tu equipo y tus valores pueden aparecer aquí.</p>';
 else if(id==='services')body=cards(p.services,id,preview);
 else if(id==='products'||id==='qr')body=cards(p.products,id,preview)+(id==='qr'?'<p class="note">Carta visual: no genera códigos QR ni procesa pedidos.</p>':'');
 else if(id==='gallery')body='<div class="gallery">'+IMAGES.slice(0,3).map((img,i)=>'<button type="button" data-photo="'+i+'" aria-label="Ampliar imagen '+(i+1)+'"><img src="'+path(img,preview)+'" alt="Fotografía ilustrativa '+(i+1)+'" loading="lazy"></button>').join('')+'</div><p class="note">Sustituye estas imágenes por fotografías autorizadas.</p>';
 else if(id==='booking')body='<p>Consulta disponibilidad; no se confirma ninguna reserva de forma automática.</p>'+(p.email?'<a class="action" href="mailto:'+encodeURIComponent(p.email)+'?subject=Consulta%20de%20disponibilidad">Consultar ↗</a>':'<p class="note">Añade un correo para activar consultas.</p>');
 else if(id==='testimonials')body='<p>Añade únicamente opiniones reales que tengas autorización para publicar. No se inventan testimonios.</p>';
 else if(id==='faq')body='<details><summary>¿Cómo puedo contactar?</summary><p>Utiliza los canales indicados en esta web.</p></details><details><summary>¿Cómo solicito un presupuesto?</summary><p>Escríbenos indicando qué necesitas.</p></details>';
 else if(id==='map')body=p.location?'<p class="lead">'+escapeHtml(p.location)+'</p><p class="note">Dirección de texto, sin integración de mapas externos.</p>':'<p>Añade una dirección pública autorizada.</p>';
 else if(id==='contact')body=(p.email?'<a class="action" href="mailto:'+encodeURIComponent(p.email)+'">Enviar correo ↗</a>':'<p>Correo no configurado.</p>')+(p.phone?'<p>Teléfono: '+escapeHtml(p.phone)+'</p>':'');
 else if(id==='form')body='<p>Este formulario prepara un mensaje para tu aplicación de correo; no transmite nada a un servidor.</p><form id="site-contact-form"><label>Nombre<input name="name" maxlength="90" autocomplete="name" required></label><label>Correo<input name="reply" type="email" maxlength="150" autocomplete="email" required></label><label>Mensaje<textarea name="message" rows="4" maxlength="1500" minlength="10" required></textarea></label><button class="action" type="submit" '+(!p.email?'disabled':'')+'>Preparar correo ↗</button><p id="form-status" role="status">'+(p.email?'Revisa y confirma el envío desde tu correo.':'Configura primero un correo válido.')+'</p></form>';
 else if(id==='whatsapp')body=p.phone?'<a class="action" href="https://wa.me/'+p.phone.slice(1)+'" target="_blank" rel="noopener noreferrer">Abrir WhatsApp ↗</a>':'<p>Configura un teléfono autorizado en formato internacional.</p>';
 else if(id==='automation')body='<p>Ideas de automatización. Esta página no ejecuta conexiones ni tareas externas.</p>';
 else return '';
 return '<section class="section" id="'+id+'"><div class="wrap">'+heading+body+'</div></section>';
}
function htmlText(raw,preview=false,css='',js=''){
 const p=normalize(raw),s=B.SECTORS[p.sector],shown=p.order.filter(id=>p.sections.includes(id)&&id!=='hero'&&id!=='seo');
 const src=p.customPhoto&&preview?p.customPhoto:path(imageName(p),preview);
 const html='<header class="header"><div class="wrap nav"><a href="#inicio" class="brand"'+edit(preview,'field','brand')+'>'+escapeHtml(p.brand)+'</a><button type="button" class="menu-toggle" aria-controls="links" aria-expanded="false" aria-label="Abrir menú">☰</button><nav id="links" class="links" aria-label="Navegación">'+shown.slice(0,4).map(id=>'<a href="#'+id+'">'+escapeHtml(p.titles[id]||id)+'</a>').join('')+'</nav></div></header>'+
 '<main id="inicio"><section class="hero layout-'+p.layout+'"><div class="hero-copy"><p class="kicker">'+escapeHtml(s.label)+'</p><h1'+edit(preview,'field','headline')+'>'+escapeHtml(p.headline)+'</h1><p class="lead"'+edit(preview,'field','intro')+'>'+escapeHtml(p.intro)+'</p><a class="action" href="'+(shown.length?'#'+shown[0]:'#inicio')+'"'+edit(preview,'field','cta')+'>'+escapeHtml(p.cta)+'</a></div><div class="hero-photo"><img src="'+escapeHtml(src)+'" alt="Fotografía ilustrativa de '+escapeHtml(s.name)+'"></div></section>'+shown.map(id=>section(id,p,preview)).join('')+'</main>'+
 '<footer class="footer"><div class="wrap"><strong>'+escapeHtml(p.brand)+'</strong><small>Sitio generado desde una plantilla. Revisa textos, fotografías y condiciones antes de publicarlo.</small></div></footer>'+
 '<dialog id="lightbox" aria-label="Imagen ampliada"><button id="close-photo" type="button">Cerrar ×</button><img id="full-photo" src="" alt="Imagen ampliada"></dialog>';
 const prefix=':root{--bg:'+p.colors.bg+';--ink:'+p.colors.ink+';--accent:'+p.colors.accent+';--surface:'+p.colors.surface+';--head:'+
 ({sans:'system-ui,sans-serif',serif:'Georgia,serif',rounded:'"Trebuchet MS",system-ui,sans-serif',mono:'ui-monospace,monospace'}[p.font])+';}';
 const bridge="document.body.classList.add('editor-preview');document.addEventListener('blur',e=>{const t=e.target;if(!(t instanceof HTMLElement))return;const field=t.dataset.field,heading=t.dataset.heading,card=t.dataset.card;if(!field&&!heading&&!card)return;const kind=field?'field':heading?'heading':'card';parent.postMessage({type:'ABEL_V12_EDIT',kind,key:field||heading||card,value:(t.textContent||'').replace(/[\\r\\n\\t]+/g,' ').trim().slice(0,240)},'*');},true);document.addEventListener('click',e=>{if(e.target.closest('a'))e.preventDefault();});document.querySelector('.hero-photo img')?.addEventListener('click',()=>parent.postMessage({type:'ABEL_V12_PHOTO_PICK'},'*'));";
 return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escapeHtml(p.brand)+'</title><meta name="description" content="'+escapeHtml(p.intro)+'"><meta name="contact-email" content="'+escapeHtml(p.email)+'"><meta name="theme-color" content="'+p.colors.bg+'">'+
 (preview?'<style>'+prefix+css+'</style>':'<link rel="stylesheet" href="styles.css">')+'</head><body class="style-'+p.style+'"><a class="skip" href="#inicio">Saltar al contenido</a>'+html+
 (preview?'<script>'+js+'</'+'script><script>'+bridge+'</'+'script>':'<script src="app.js" defer></'+'script>')+'</body></html>';
}
function filesForProject(project,css,js){
 if(typeof css!=='string'||typeof js!=='string'||css.length<500||js.length<100)throw Error('Faltan los archivos del sitio');
 const p=normalize(project),prefix=':root{--bg:'+p.colors.bg+';--ink:'+p.colors.ink+';--accent:'+p.colors.accent+';--surface:'+p.colors.surface+';--head:'+
 ({sans:'system-ui,sans-serif',serif:'Georgia,serif',rounded:'"Trebuchet MS",system-ui,sans-serif',mono:'ui-monospace,monospace'}[p.font])+';}';
 return {'index.html':htmlText(p,false),'styles.css':prefix+css,'app.js':js,
  'configuracion-v12.json':JSON.stringify(p,null,2),
  'README.txt':['ABEL AUTOMATION · WEB ESTÁTICA V12','Archivos: index.html, styles.css, app.js, assets/*.webp y configuracion-v12.json.',
   'Abre index.html en tu navegador; para un servidor local puedes usar python -m http.server 8000.',
   'Menú, galería y secciones son funcionales. Formulario y reservas solo preparan correos, sin backend.',
   'Carta QR, mapa y automatizaciones son representaciones, no integraciones operativas.',
   'Revisa derechos de imagen, textos, datos de contacto, privacidad, accesibilidad y hosting antes de publicar.',
   'Esta descarga no publica nada ni incluye CRM ni datos de clientes.'].join('\n')};
}
const crcTable=(()=>{const t=new Uint32Array(256);for(let i=0;i<256;i++){let v=i;for(let j=0;j<8;j++)v=v&1?0xedb88320^(v>>>1):v>>>1;t[i]=v>>>0;}return t;})();
function crc32(bytes){let c=0xffffffff;for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
const encoder=new TextEncoder();
function buildZip(files){
 const entries=Object.entries(files);if(!entries.length||entries.length>40)throw Error('Cantidad de archivos inválida');
 let total=0;const seen=new Set();
 const prepared=entries.map(([name,content])=>{
  if(!/^(?:assets\/[A-Za-z0-9_-]+\.(?:webp|jpg|png)|(?:index\.html|styles\.css|app\.js|README\.txt|configuracion-v12\.json))$/.test(name)||seen.has(name))throw Error('Nombre ZIP inseguro');seen.add(name);
  const bytes=typeof content==='string'?encoder.encode(content):content;if(!(bytes instanceof Uint8Array)||bytes.length>5500000)throw Error('Archivo ZIP inválido');
  total+=bytes.length;if(total>18000000)throw Error('Exportación demasiado grande');return {bytes,name:encoder.encode(name),crc:crc32(bytes)};
 });
 const locals=[],centrals=[];let offset=0;
 const view=n=>new DataView(new ArrayBuffer(n)),u8=x=>new Uint8Array(x.buffer);
 for(const e of prepared){
  const h=view(30);h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x800,true);h.setUint32(14,e.crc,true);h.setUint32(18,e.bytes.length,true);h.setUint32(22,e.bytes.length,true);h.setUint16(26,e.name.length,true);locals.push(u8(h),e.name,e.bytes);
  const c=view(46);c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x800,true);c.setUint32(16,e.crc,true);c.setUint32(20,e.bytes.length,true);c.setUint32(24,e.bytes.length,true);c.setUint16(28,e.name.length,true);c.setUint32(42,offset,true);centrals.push(u8(c),e.name);
  offset+=30+e.name.length+e.bytes.length;
 }
 let centralSize=0;for(const part of centrals)centralSize+=part.length;
 const end=view(22);end.setUint32(0,0x06054b50,true);end.setUint16(8,prepared.length,true);end.setUint16(10,prepared.length,true);end.setUint32(12,centralSize,true);end.setUint32(16,offset,true);
 const result=new Uint8Array(offset+centralSize+22);let position=0;for(const part of [...locals,...centrals,u8(end)]){result.set(part,position);position+=part.length;}return result;
}
function imageBytes(url){if(!isPhoto(url)||typeof atob!=='function')throw Error('Fotografía inválida');return Uint8Array.from(atob(url.split(',')[1]),x=>x.charCodeAt(0));}
function importProject(raw){if(typeof raw!=='string'||raw.length>4800000)throw Error('Proyecto demasiado grande');let x;try{x=JSON.parse(raw);}catch{throw Error('JSON incorrecto');}if(x?.version===9)return fromV9(x);if(x?.version!==12)throw Error('Versión incompatible');return normalize(x);}
return {IMAGES,TITLES,defaults,normalize,fromV9,imageName,htmlText,filesForProject,buildZip,imageBytes,importProject,projectJson:p=>JSON.stringify(normalize(p)),isEmail,isPhone,isPhoto};
});
