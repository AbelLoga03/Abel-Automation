/* Abel Automation · V9 Configurator PRO · núcleo puro, reutilizable en browser/Node */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;root.AbelBuilderV9=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';
 const SECTORS={
  restaurante:{name:'Restaurante / cafetería',brand:'CASA BRUMA',headline:'Sabores para recordar.',intro:'Una experiencia que comienza mucho antes de llegar a la mesa.',label:'COCINA DE AUTOR',hero:'portfolio-pizzeria.webp',base:'restaurante',services:['Carta de temporada','Reservas y eventos','Nuestra cocina'],products:['Entrantes artesanos','Platos de la casa','Postres especiales'],cta:'Explorar nuestra carta'},
  comercio:{name:'Tienda / comercio',brand:'ALMA OBJECTS',headline:'Objetos con otra historia.',intro:'Una selección cuidada para encontrar algo especial.',label:'COLECCIÓN INDEPENDIENTE',hero:'portfolio-joyeria.webp',base:'catalogo',services:['Asesoramiento','Selección exclusiva','Atención personalizada'],products:['Nuevas colecciones','Piezas favoritas','Edición especial'],cta:'Ver la colección'},
  belleza:{name:'Belleza / peluquería',brand:'MUSA ATELIER',headline:'Tu estilo, tu momento.',intro:'Cuidado y creatividad en cada detalle.',label:'BELLEZA CON IDENTIDAD',hero:'portfolio-barberia.webp',base:'reservas',services:['Corte y estilo','Coloración','Tratamientos'],products:['Servicios destacados','Rutina capilar','Cuidado personal'],cta:'Pedir una cita'},
  taller:{name:'Taller / reparaciones',brand:'NEXO GARAGE',headline:'Volver a rodar, sin vueltas.',intro:'Servicio técnico claro, directo y profesional.',label:'PRECISIÓN Y CONFIANZA',hero:'portfolio-taller.webp',base:'profesional',services:['Mantenimiento','Diagnóstico','Reparaciones'],products:['Revisión general','Cambio de aceite','Diagnóstico electrónico'],cta:'Solicitar presupuesto'},
  hotel:{name:'Hotel / alojamiento',brand:'MONTE CLARO',headline:'Hay escapadas que se quedan.',intro:'Descubre un lugar para desconectar, respirar y volver.',label:'HOSPITALIDAD CON CARÁCTER',hero:'portfolio-floristeria.webp',base:'reservas',services:['Habitaciones','Experiencias','Rutas locales'],products:['Suite luminosa','Habitación jardín','Escapada en pareja'],cta:'Consultar disponibilidad'},
  profesional:{name:'Servicios profesionales',brand:'NORTE ESTUDIO',headline:'Ideas claras. Resultados sólidos.',intro:'Estrategia y atención cercana para proyectos que importan.',label:'EXPERIENCIA Y CRITERIO',hero:'portfolio-libreria.webp',base:'profesional',services:['Consultoría','Proyectos a medida','Acompañamiento'],products:['Diagnóstico','Plan de acción','Seguimiento'],cta:'Hablemos de tu proyecto'},
  otro:{name:'Otro negocio',brand:'TU PROYECTO',headline:'Haz que tu idea destaque.',intro:'Un espacio digital pensado para lo que quieres construir.',label:'TU ESPACIO DIGITAL',hero:'portfolio-joyeria.webp',base:'basica',services:['Tu servicio estrella','Tu especialidad','Contacto directo'],products:['Producto destacado','Novedades','Favoritos'],cta:'Descubre más'}
 };
 const THEMES={
  sunset:{name:'Coral editorial',bg:'#f8efe7',ink:'#30252c',accent:'#b5634e',surface:'#ffffff'},
  aurora:{name:'Turquesa digital',bg:'#10252b',ink:'#f0fff9',accent:'#7de9dc',surface:'#1b3b40'},
  noir:{name:'Negro & oro',bg:'#111117',ink:'#f3eee1',accent:'#dfbb73',surface:'#24222a'},
  sky:{name:'Azul profesional',bg:'#edf4ff',ink:'#153057',accent:'#3476c8',surface:'#ffffff'},
  forest:{name:'Verde natural',bg:'#f1f5ec',ink:'#203b2d',accent:'#497a57',surface:'#ffffff'},
  clay:{name:'Arcilla & crema',bg:'#f5e9d9',ink:'#483329',accent:'#a96740',surface:'#fff9ed'}
 };
 const STYLES=['editorial','bold','minimal','playful'];
 const FONTS=['sans','serif','rounded','mono'];
 const LAYOUTS=['split','centered','full'];
 const SECTION_META=[
  {id:'hero',name:'Portada',hint:'Título principal',included:true},
  {id:'about',name:'Quiénes somos',hint:'Historia y valores'},
  {id:'services',name:'Servicios',hint:'Lo que ofreces'},
  {id:'products',name:'Productos',hint:'Escaparate conceptual'},
  {id:'gallery',name:'Galería',hint:'+49 €',extra:'gallery'},
  {id:'qr',name:'Carta QR',hint:'+129 €',extra:'qr-interactive'},
  {id:'booking',name:'Reservas',hint:'+99 €',extra:'booking'},
  {id:'testimonials',name:'Testimonios',hint:'Solo ejemplos ficticios'},
  {id:'faq',name:'Preguntas frecuentes',hint:'Resuelve dudas'},
  {id:'map',name:'Mapa',hint:'+25 €',extra:'maps'},
  {id:'contact',name:'Contacto',hint:'Datos de ejemplo'},
  {id:'form',name:'Formulario',hint:'+39 €',extra:'form'},
  {id:'whatsapp',name:'WhatsApp',hint:'+19 €',extra:'whatsapp'},
  {id:'automation',name:'Automatización',hint:'desde 129 €',extra:'n8n'},
  {id:'seo',name:'SEO inicial',hint:'+79 €',extra:'seo'}
 ];
 const DEFAULT_ORDER=SECTION_META.map(x=>x.id);
 const DEFAULT_ACTIVE=['hero','about','services','products','gallery','contact','whatsapp'];
 const MAX_BRIEF_LENGTH=240;
 const safeString=(x,max)=>String(typeof x==='string'?x:'').replace(/[\u0000-\u001F\u007F]/g,' ').trim().slice(0,max);
 const isHex=s=>typeof s==='string'&&/^#[0-9a-fA-F]{6}$/.test(s);
 const includes=(arr,x)=>arr.includes(x);
 const getTheme=name=>THEMES[name]||THEMES.sunset;
 function defaults(sector='restaurante'){
  const k=SECTORS[sector]?sector:'restaurante',entry=SECTORS[k];
  return {version:9,sector:k,theme:'sunset',style:'editorial',font:'sans',layout:'split',
   brand:entry.brand,headline:entry.headline,intro:entry.intro,cta:entry.cta,
   colors:{...THEMES.sunset},custom:false,
   sections:[...DEFAULT_ACTIVE],order:[...DEFAULT_ORDER],device:'desktop',maintenance:'none'};
 }
 function normalize(input){
  const obj=input&&typeof input==='object'&&!Array.isArray(input)?input:{};
  const sector=SECTORS[obj.sector]?obj.sector:'restaurante',base=defaults(sector);
  const theme=THEMES[obj.theme]?obj.theme:'sunset',palette=THEMES[theme];
  const sections=Array.isArray(obj.sections)?[...new Set(obj.sections.filter(x=>DEFAULT_ORDER.includes(x)))]:base.sections;
  if(!sections.includes('hero'))sections.unshift('hero');
  const order=Array.isArray(obj.order)?[...new Set(obj.order.filter(x=>DEFAULT_ORDER.includes(x)))]:base.order;
  for(const s of DEFAULT_ORDER)if(!order.includes(s))order.push(s);
  const custom=Boolean(obj.custom);
  const colors={};
  for(const k of ['bg','ink','accent','surface'])colors[k]=custom&&isHex(obj.colors?.[k])?obj.colors[k]:palette[k];
  return {version:9,sector,theme,style:includes(STYLES,obj.style)?obj.style:base.style,
   font:includes(FONTS,obj.font)?obj.font:base.font,
   layout:includes(LAYOUTS,obj.layout)?obj.layout:base.layout,
   brand:safeString(obj.brand,65)||base.brand,
   headline:safeString(obj.headline,130)||base.headline,
   intro:safeString(obj.intro,MAX_BRIEF_LENGTH)||base.intro,
   cta:safeString(obj.cta,38)||base.cta,
   colors,custom,sections,order,device:includes(['desktop','tablet','mobile'],obj.device)?obj.device:'desktop',
   maintenance:includes(['none','esencial','negocio','profesional','premium'],obj.maintenance)?obj.maintenance:'none'};
 }
 function priceIds(s){
  const x=normalize(s);
  return {base:SECTORS[x.sector].base,
    extras:SECTION_META.filter(z=>z.extra&&x.sections.includes(z.id)).map(z=>z.extra),
    maintenance:x.maintenance};
 }
 function quote(s,engine){
  const p=priceIds(s);
  if(!engine||typeof engine.normalize!=='function')throw Error('Motor de propuestas no disponible');
  return engine.normalize({...p,scope:brief(s)});
 }
 function brief(s){
  const x=normalize(s);
  return [
   'CONFIGURACIÓN VISUAL (propuesta conceptual, no web publicada)',
   'Sector: '+SECTORS[x.sector].name,
   'Marca de ejemplo: '+x.brand,
   'Titular: '+x.headline,
   'Presentación: '+x.intro,
   'Estilo: '+x.style+' · Fuente: '+x.font+' · Estructura: '+x.layout,
   'Paleta: '+x.colors.bg+' / '+x.colors.ink+' / '+x.colors.accent+' / '+x.colors.surface,
   'Secciones: '+x.order.filter(id=>x.sections.includes(id)).map(id=>SECTION_META.find(z=>z.id===id).name).join(', '),
   'La maqueta no supone reserva de funcionalidad compleja. El alcance final se confirmará antes de contratar.'
  ].join('\n');
 }
 function serialize(s){
  const x=normalize(s);
  return JSON.stringify(x);
 }
 function shareToken(s){
  const payload=encodeURIComponent(serialize(s));
  if(payload.length>6500)throw Error('La configuración supera el tamaño para compartirla');
  return payload;
 }
 function parseToken(token){
  if(typeof token!=='string'||token.length>6500)throw Error('Enlace demasiado largo');
  let data;try{data=JSON.parse(decodeURIComponent(token));}catch{throw Error('El enlace no contiene una configuración válida');}
  if(!data||data.version!==9)throw Error('Versión de configuración no compatible');
  return normalize(data);
 }
 function importJson(input){
  if(typeof input!=='string'||input.length>18000)throw Error('Archivo demasiado grande');
  let obj;try{obj=JSON.parse(input)}catch{throw Error('El JSON no es válido');}
  if(!obj||obj.version!==9)throw Error('Archivo de otra versión');
  return normalize(obj);
 }
 return {SECTORS,THEMES,STYLES,FONTS,LAYOUTS,SECTION_META,DEFAULT_ORDER,DEFAULT_ACTIVE,defaults,normalize,priceIds,quote,brief,serialize,shareToken,parseToken,importJson};
});
