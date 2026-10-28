/* Abel Automation V10 · Asistente de proyecto. Reglas públicas, no IA ni auditoría remota. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;root.AbelJourneyV10=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
'use strict';
const SECTORS={
 restaurante:{label:'Restaurante o cafetería',builder:'restaurante',contact:'Restaurante / cafetería',base:'restaurante'},
 comercio:{label:'Comercio o tienda',builder:'comercio',contact:'Comercio / tienda',base:'catalogo'},
 belleza:{label:'Peluquería o estética',builder:'belleza',contact:'Otro',base:'reservas'},
 taller:{label:'Taller o reparación',builder:'taller',contact:'Servicios profesionales',base:'profesional'},
 hotel:{label:'Alojamiento o turismo',builder:'hotel',contact:'Alojamiento / turismo',base:'reservas'},
 profesional:{label:'Servicio profesional',builder:'profesional',contact:'Servicios profesionales',base:'profesional'},
 otro:{label:'Otro proyecto',builder:'otro',contact:'Otro',base:'basica'}
};
const GOALS={
 contactos:{label:'Recibir más consultas',tip:'Facilita el contacto desde el móvil'},
 productos:{label:'Mostrar productos o trabajos',tip:'Un escaparate fácil de explorar'},
 reservas:{label:'Recibir solicitudes de cita',tip:'Sin confirmación automática de disponibilidad'},
 imagen:{label:'Mejorar la imagen del negocio',tip:'Una presentación coherente con tu marca'},
 tiempo:{label:'Ahorrar tiempo en tareas repetitivas',tip:'Automatización sencilla sujeta a estudio'}
};
const FEATURES={
 whatsapp:{label:'Acceso por WhatsApp',extra:'whatsapp'},
 galeria:{label:'Galería de imágenes',extra:'gallery'},
 seo:{label:'SEO inicial',extra:'seo'},
 qr:{label:'Carta QR interactiva',extra:'qr-interactive'},
 form:{label:'Formulario de contacto',extra:'form'},
 reservas:{label:'Solicitudes de reserva',extra:'booking'},
 mapa:{label:'Mapa de ubicación',extra:'maps'},
 automatizacion:{label:'Automatización sencilla',extra:'n8n'}
};
const STAGES={sinweb:'Todavía no tengo web',antigua:'Tengo web, pero quiero mejorarla',redes:'Solo uso redes sociales',nueva:'Proyecto de negocio nuevo'};
const READINESS={preparado:'Tengo textos y fotografías',parcial:'Tengo parte del contenido',ayuda:'Necesitaré ayuda con el contenido'};
const TIMING={flexible:'Sin fecha cerrada',mes:'En las próximas semanas',urgente:'Necesito revisar la viabilidad de una entrega urgente'};
const BUDGET={sin:'Aún no tengo presupuesto definido',bajo:'Hasta 250 €',medio:'Entre 250 y 500 €',alto:'Más de 500 €'};
const validKey=(group,x,fallback)=>Object.prototype.hasOwnProperty.call(group,x)?x:fallback;
const unique=(group,list)=>Array.isArray(list)?[...new Set(list.filter(x=>Object.prototype.hasOwnProperty.call(group,x)))]:[];
const trim=(v,max)=>String(typeof v==='string'?v:'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max);
function defaults(sector='restaurante'){return {version:10,sector:validKey(SECTORS,sector,'restaurante'),stage:'sinweb',goals:['contactos'],features:[],readiness:'parcial',timing:'flexible',budget:'sin',brand:'',details:''};}
function normalize(v){
 const x=v&&typeof v==='object'&&!Array.isArray(v)?v:{},base=defaults(x.sector);
 return {version:10,sector:base.sector,stage:validKey(STAGES,x.stage,'sinweb'),
  goals:unique(GOALS,x.goals),features:unique(FEATURES,x.features),
  readiness:validKey(READINESS,x.readiness,'parcial'),
  timing:validKey(TIMING,x.timing,'flexible'),budget:validKey(BUDGET,x.budget,'sin'),
  brand:trim(x.brand,65),details:trim(x.details,850)};
}
// Solo sugerimos extras relacionados con necesidades elegidas, sin atribuir resultados a negocios reales.
// Complementos opcionales añadidos explícitamente permanecen en el presupuesto; nunca se cobran dos veces.
function recommend(input){
 const x=normalize(input),chosen=new Set(x.features.map(k=>FEATURES[k].extra)),reasons=[];
 const add=(id,reason)=>{if(!chosen.has(id)){chosen.add(id);reasons.push({id,reason});}};
 if(x.goals.includes('contactos'))add('whatsapp','Quieres facilitar las consultas desde móvil; WhatsApp es una opción simple.');
 if(x.goals.includes('productos'))add('gallery','Quieres enseñar productos o trabajos; una galería ayuda a presentarlos.');
 if(x.goals.includes('reservas'))add('booking','Has indicado interés en solicitudes de cita sin confirmar disponibilidad.');
 if(x.goals.includes('tiempo'))add('n8n','Quieres ahorrar tareas repetitivas; conviene revisar un flujo inicial de automatización.');
 const sector=SECTORS[x.sector];
 const base=sector.base;
 const extras=[...chosen],notes=[];
 if(x.budget==='bajo')notes.push('Has indicado hasta 250 €. La estimación puede superarlo: se puede revisar el alcance y priorizar funciones.');
 if(x.timing==='urgente')notes.push('La fecha urgente requiere confirmar disponibilidad y alcance; no está garantizada.');
 if(x.readiness==='ayuda')notes.push('La preparación de contenidos puede requerir un trabajo y un precio adicionales.');
 if(x.stage==='antigua')notes.push('Para mejorar una web existente hay que revisar la tecnología, accesos y materiales antes de migrar.');
 if(x.goals.includes('tiempo'))notes.push('El coste de plataformas, APIs y servicios externos de automatización no está incluido.');
 return {data:x,sector,base,extras,reasons,notes,maintenance:'none'};
}
function withPrice(input,engine){
 const r=recommend(input);if(!engine||typeof engine.normalize!=='function')throw Error('Motor de precios no disponible');
 const quote=engine.normalize({base:r.base,extras:r.extras,maintenance:'none',project:'Propuesta digital '+(r.data.brand||r.sector.label),scope:brief(input)});
 return {...r,quote};
}
function brief(input){
 const {data,sector,base,extras,reasons,notes}=recommend(input);
 const lookup=(arr,k)=>arr[k]||'Sin especificar';
 return [
 'BRIEF COMERCIAL · ABEL AUTOMATION V10',
 'Proyecto: '+(data.brand||'Nombre por definir'),
 'Sector: '+sector.label,
 'Situación actual: '+lookup(STAGES,data.stage),
 'Objetivos: '+(data.goals.map(g=>GOALS[g].label).join(', ')||'Pendientes de concretar'),
 'Funciones consideradas: '+(extras.map(e=>Object.values(FEATURES).find(f=>f.extra===e)?.label||e).join(', ')||'Ninguna'),
 'Servicio principal orientativo: '+base,
 'Contenidos: '+lookup(READINESS,data.readiness),
 'Plazo deseado: '+lookup(TIMING,data.timing),
 'Presupuesto indicado: '+lookup(BUDGET,data.budget),
 'Información adicional: '+(data.details||'Sin observaciones'),
 ...notes.map(n=>'Importante: '+n),
 ...reasons.map(x=>'Sugerencia: '+x.reason),
 'Este diagnóstico se basa únicamente en las respuestas del formulario; no analiza sitios web ni garantiza resultados.'
 ].join('\n');
}
function builderPreset(input,core){
 const r=recommend(input);if(!core)throw Error('Constructor V9 no disponible');
 const state=core.defaults(r.sector.builder);
 const extraToBlock={whatsapp:'whatsapp',gallery:'gallery',seo:'seo','qr-interactive':'qr',form:'form',booking:'booking',maps:'map',n8n:'automation'};
 const selected=new Set(state.sections.filter(id=>!core.SECTION_META.some(m=>m.id===id&&m.extra)));
 for(const id of r.extras){const section=extraToBlock[id];if(section)selected.add(section);}
 return core.normalize({...state,brand:r.data.brand||state.brand,sections:[...selected]});
}
function toJson(input){return JSON.stringify(normalize(input));}
function fromJson(input){
 if(typeof input!=='string'||input.length>7000)throw Error('Archivo demasiado grande');
 let data;try{data=JSON.parse(input);}catch{throw Error('Archivo JSON incorrecto');}
 if(data?.version!==10)throw Error('Versión no compatible');
 return normalize(data);
}
return {SECTORS,GOALS,FEATURES,STAGES,READINESS,TIMING,BUDGET,defaults,normalize,recommend,withPrice,brief,builderPreset,toJson,fromJson};
});
