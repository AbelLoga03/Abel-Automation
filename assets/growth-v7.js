/* Abel Automation · V7 Growth Studio
   Configurador de experiencia, no un editor de sitios publicados.
   Sin seguimiento de visitantes, backend, cookies ni envíos implícitos. */
'use strict';
(() => {
 const $=id=>document.getElementById(id);
 const SECTORS={
  hosteleria:{
    name:'Restaurante o cafetería',tag:'HOSTELERÍA · PRODUCTO DIGITAL',brand:'SABOR & RAÍZ',
    headline:'Cada detalle abre el apetito.',sub:'Una carta que despierta ganas de entrar.',
    base:'restaurante',image:'assets/portfolio-pizzeria.webp',
    service:'Carta digital',second:'Pide información',third:'Nuestra historia',sector:'Restaurante / cafetería'
  },
  comercio:{
    name:'Tienda o comercio',tag:'COMERCIO · CATÁLOGO',brand:'LINO STUDIO',
    headline:'Piezas que cuentan historias.',sub:'Tus productos, como merecen ser mostrados.',
    base:'catalogo',image:'assets/portfolio-joyeria.webp',
    service:'Colección',second:'Ver catálogo',third:'Nosotros',sector:'Comercio / tienda'
  },
  servicios:{
    name:'Servicios profesionales',tag:'SERVICIOS · CONFIANZA',brand:'NORTE ESTUDIO',
    headline:'Claridad desde el primer vistazo.',sub:'Explica lo que haces y facilita que te escriban.',
    base:'profesional',image:'assets/portfolio-taller.webp',
    service:'Servicios',second:'Solicitar consulta',third:'Nuestro método',sector:'Servicios profesionales'
  },
  belleza:{
    name:'Peluquería o estética',tag:'BELLEZA · AGENDA',brand:'AURA CONCEPT',
    headline:'Tu estilo habla por ti.',sub:'Servicios visuales y solicitudes de cita sencillas.',
    base:'reservas',image:'assets/portfolio-barberia.webp',
    service:'Tratamientos',second:'Reservar consulta',third:'El estudio',sector:'Otro'
  },
  turismo:{
    name:'Hotel o alojamiento',tag:'TURISMO · EXPERIENCIA',brand:'SIERRA CALMA',
    headline:'Hay lugares que se sienten.',sub:'Deja que la experiencia empiece online.',
    base:'reservas',image:'assets/portfolio-floristeria.webp',
    service:'Habitaciones',second:'Pedir disponibilidad',third:'El refugio',sector:'Alojamiento / turismo'
  },
  otros:{
    name:'Otro tipo de negocio',tag:'PRESENCIA DIGITAL · A TU MEDIDA',brand:'TU MARCA',
    headline:'Tu idea merece ser vista.',sub:'Una presencia digital clara y reconocible.',
    base:'basica',image:'assets/portfolio-libreria.webp',
    service:'Qué hacemos',second:'Contactar',third:'Conócenos',sector:'Otro'
  }
 };
 const STYLES={
  editorial:{label:'Editorial',bg:'#f7efe5',ink:'#30272d',accent:'#b96553',button:'#fffaf2'},
  bold:{label:'Impacto',bg:'#171e2a',ink:'#f8f7ed',accent:'#ffca8e',button:'#28202b'},
  minimal:{label:'Esencial',bg:'#f4f8f6',ink:'#25363a',accent:'#28857f',button:'#ffffff'}
 };
 const FEATURE_MAP={
  whatsapp:'WhatsApp',gallery:'Galería fotográfica',seo:'SEO inicial',
  'qr-interactive':'Carta QR interactiva',form:'Formulario',n8n:'Automatización n8n'
 };
 const selected={sector:'hosteleria',style:'editorial',device:'desktop',features:new Set(['whatsapp'])};
 const money=n=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
 function getPrices(){
  if(typeof PRICE_DATA==='undefined'||!PRICE_DATA.web||!PRICE_DATA.extras)return null;
  const sector=SECTORS[selected.sector];
  const base=PRICE_DATA.web.find(x=>x.id===sector.base);
  const extras=PRICE_DATA.extras.filter(x=>selected.features.has(x.id));
  if(!base)return null;
  return {base,extras,total:base.price+extras.reduce((n,x)=>n+x.price,0),approx:base.desde||extras.some(x=>x.desde)};
 }
 function setPressed(group,active){
  group.querySelectorAll('[data-select]').forEach(button=>
   button.setAttribute('aria-pressed',String(button.dataset.select===active)));
 }
 function render(){
  const sector=SECTORS[selected.sector],style=STYLES[selected.style],site=$('studio-site'),preview=$('studio-preview');
  $('studio-brand').textContent=sector.brand;
  $('studio-nav-label').textContent=sector.service+' · '+sector.third;
  $('studio-eyebrow').textContent=sector.tag;
  $('studio-headline').textContent=sector.headline;
  $('studio-subtitle').textContent=sector.sub;
  $('studio-preview-action').textContent=sector.second+' ↗';
  $('studio-feature-1').textContent=sector.service;
  $('studio-feature-2').textContent=selected.features.has('whatsapp')?'WhatsApp directo':'Contacto sencillo';
  $('studio-feature-3').textContent=selected.features.has('qr-interactive')?'Carta QR dinámica':selected.features.has('n8n')?'Flujos automáticos':'Diseño adaptable';
  $('studio-image').style.backgroundImage='linear-gradient(155deg,#1a1b2030,#181c2b45),url("'+sector.image+'")';
  $('studio-image').setAttribute('aria-label','Imagen ilustrativa para '+sector.name);
  site.style.setProperty('--site-bg',style.bg);
  site.style.setProperty('--site-ink',style.ink);
  site.style.setProperty('--site-accent',style.accent);
  site.style.setProperty('--site-button',style.button);
  site.dataset.style=selected.style;
  preview.classList.toggle('mobile',selected.device==='mobile');
  $('studio-sector-options')&&setPressed($('studio-sector-options'),selected.sector);
  $('studio-style-options')&&setPressed($('studio-style-options'),selected.style);
  $('studio-device-tabs')&&setPressed($('studio-device-tabs'),selected.device);
  const amount=getPrices();
  $('studio-total').textContent=amount?(amount.approx?'desde ':'')+money(amount.total):'A consultar';
  $('studio-total-description').textContent=amount
   ?amount.base.name+' + '+amount.extras.length+' complemento'+(amount.extras.length===1?'':'s')
   :'Presupuesto según necesidades';
  $('studio-selection-status').textContent='Vista previa: '+sector.name+', estilo '+style.label.toLowerCase()+
    ', '+selected.features.size+' función'+(selected.features.size===1?'':'es')+' adicional'+(selected.features.size===1?'':'es')+'.';
 }
 function applyToCalculator(){
  const sector=SECTORS[selected.sector];
  const base=$('budget-base');if(!base)return false;
  base.value=sector.base;
  base.dispatchEvent(new Event('change',{bubbles:true}));
  const extras=$('budget-extras')?.querySelectorAll('input[type=checkbox]')||[];
  extras.forEach(input=>{
   const want=selected.features.has(input.value);
   if(input.checked!==want){input.checked=want;input.dispatchEvent(new Event('change',{bubbles:true}));}
  });
  return true;
 }
 function description(){
  const sector=SECTORS[selected.sector],style=STYLES[selected.style],amount=getPrices();
  return [
    'Estoy interesado/a en una propuesta digital para '+sector.name.toLowerCase()+'.',
    'Estilo visual de referencia: '+style.label+'.',
    'Funciones solicitadas: '+(selected.features.size?[...selected.features].map(x=>FEATURE_MAP[x]||x).join(', '):'Ninguna adicional')+'.',
    amount?'Estimación orientativa (sin IVA ni servicios externos): '+(amount.approx?'desde ':'')+money(amount.total)+'.':'',
    'Me gustaría confirmar alcance, plazos y presupuesto definitivo.'
  ].filter(Boolean).join('\n');
 }
 function goTo(target){$(target)?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}
 function init(){
  if(!$('studio-site'))return;
  document.querySelectorAll('[data-studio-sector]').forEach(button=>{
   button.addEventListener('click',()=>{selected.sector=button.dataset.studioSector;render();});
  });
  document.querySelectorAll('[data-studio-style]').forEach(button=>{
   button.addEventListener('click',()=>{selected.style=button.dataset.studioStyle;render();});
  });
  document.querySelectorAll('[data-studio-device]').forEach(button=>{
   button.addEventListener('click',()=>{selected.device=button.dataset.studioDevice;render();});
  });
  document.querySelectorAll('[data-studio-feature]').forEach(input=>{
   input.addEventListener('change',()=>{if(input.checked)selected.features.add(input.value);else selected.features.delete(input.value);render();});
  });
  $('studio-budget').addEventListener('click',()=>{
   if(applyToCalculator()){
    $('budget-status').textContent='Configuración del Estudio aplicada. Revisa el presupuesto detallado y el mantenimiento.';
    goTo('presupuesto');
   }
  });
  $('studio-lead').addEventListener('click',()=>{
   applyToCalculator();
   const sector=SECTORS[selected.sector];
   const field=$('client-sector');
   if(field)field.value=sector.sector;
   const message=$('client-message');
   if(message)message.value=description();
   $('contact-status').textContent='Tu idea ya está preparada en el formulario. Revisa los datos y decide si enviarla.';
   goTo('contacto');
   $('client-name')?.focus({preventScroll:true});
  });
  render();
 }
 document.addEventListener('DOMContentLoaded',init);
})();
