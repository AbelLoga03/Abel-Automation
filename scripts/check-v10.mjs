import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const J=(await import('../assets/journey-v10-core.js')).default;
const B=(await import('../assets/builder-v9-core.js')).default;
const P=(await import('../assets/proposal-v8.js')).default;
let passed=0;
const check=(yes,why)=>{assert.ok(yes,why);passed++;console.log('OK '+why);};
const read=p=>fs.readFileSync(p,'utf8');
for(const p of ['assets/journey-v10-core.js','experiencias/journey-v10.css','experiencias/planificador-v10.html','experiencias/planificador-v10.js','experiencias/comparador-v10.html','experiencias/comparador-v10.js'])
 check(fs.existsSync(p),'Archivo '+p);
for(const p of ['assets/journey-v10-core.js','experiencias/planificador-v10.js','experiencias/comparador-v10.js','assets/v6-pro.js','estudio/configurador-v9.js']){new vm.Script(read(p));check(true,'JS compila '+p);}
check(Object.keys(J.SECTORS).length===7,'Siete sectores');
check(Object.keys(J.GOALS).length===5,'Cinco metas explícitas');
check(Object.keys(J.FEATURES).length===8,'Ocho funciones opcionales');
for(const key of Object.keys(J.SECTORS)){
 const d=J.defaults(key),r=J.recommend(d),q=J.withPrice(d,P);
 check(d.sector===key&&r.base===J.SECTORS[key].base,'Sector: '+key);
 check(q.quote.base.id===r.base,'Servicio base correcto '+key);
 check(q.quote.total>=q.quote.base.price,'Precio no inferior a la base '+key);
 const builder=J.builderPreset(d,B),prices=B.priceIds(builder);
 check(prices.base===r.base,'Servicio conservado en V9 para '+key);
 check(new Set(prices.extras).size===prices.extras.length,'Extras V9 sin duplicados '+key);
 check(JSON.stringify([...prices.extras].sort())===JSON.stringify([...r.extras].sort()),'V10 y V9 muestran exactamente los mismos extras '+key);
 check(B.quote(builder,P).total===q.quote.total,'Precio V10 coincide con V9 para '+key);
}
let d=J.defaults('restaurante');
check(J.withPrice(d,P).quote.total===398,'Restaurante + contacto WhatsApp recomendado = 398 €');
d=J.normalize({...d,goals:['productos','reservas','tiempo'],features:['qr','galeria','automatizacion','qr'],budget:'bajo',timing:'urgente',readiness:'ayuda'});
const r=J.recommend(d);
check(r.extras.length===4,'Deduplicación de extras elegidos y sugeridos');
check(r.extras.includes('n8n')&&r.extras.includes('qr-interactive')&&r.extras.includes('gallery')&&r.extras.includes('booking'),'Mantiene funciones sugeridas y elegidas');
check(J.withPrice(d,P).quote.total===785,'Total complejo 379+129+49+129+99=785');
check(B.quote(J.builderPreset(d,B),P).total===785,'Precio complejo trasladado V9 sin desviación');
check(J.builderPreset(d,B).sections.includes('automation'),'Automatización visible en V9');
check(r.notes.some(x=>x.includes('250'))&&r.notes.some(x=>x.includes('urgente'))&&r.notes.some(x=>x.includes('contenidos')),'Alertas sobre presupuesto, plazo y contenidos');
check(J.brief(d).includes('No se garantiza')===false&&J.brief(d).includes('ni garantiza resultados'),'Brief expresa límites y no garantías');
const pdfInput=J.withPrice(d,P);
const buf=Buffer.from(P.pdfDocument({base:pdfInput.base,extras:r.extras,scope:J.brief(d),project:'Propuesta V10 de ejemplo'}));
check(buf.subarray(0,8).toString('latin1')==='%PDF-1.4','PDF válido generado desde V10');
check(buf.toString('latin1').includes('startxref')&&buf.toString('latin1').includes('/Type /Catalog'),'PDF con referencias y catálogo');
check(J.fromJson(J.toJson(d)).features.length===3,'JSON exportado/importado conserva funciones y descarta duplicados');
check(J.normalize({sector:'false',stage:'x',goals:['x'],features:['bad'],readiness:'x'}).sector==='restaurante','Entrada inválida filtrada');
const malicious='<svg onload=alert(1)>';
check(J.normalize({...d,brand:malicious,details:malicious}).brand===malicious,'Texto no se ejecuta durante normalización');
check(J.normalize({...d,details:'A'.repeat(10000)}).details.length===850,'Tamaño máximo de observaciones');
assert.throws(()=>J.fromJson('a'.repeat(7100)));check(true,'Archivo grande rechazado');
const home=read('index.html'),planner=read('experiencias/planificador-v10.html'),cmp=read('experiencias/comparador-v10.html'),
 plannerJS=read('experiencias/planificador-v10.js'),cmpJS=read('experiencias/comparador-v10.js'),v9=read('estudio/configurador-v9.js'),
 contact=read('assets/v6-pro.js'),crm=read('herramientas/crm.html'),sitemap=read('sitemap.xml'),css=read('experiencias/journey-v10.css');
check(home.includes('experiencias/planificador-v10.html')&&home.includes('experiencias/comparador-v10.html'),'Nueva experiencia accesible en la portada');
check(!/innerHTML\s*=/.test(plannerJS)&&!/innerHTML\s*=/.test(cmpJS),'El interfaz no interpreta HTML suministrado');
check(plannerJS.includes('Engine.pdfDocument(data)'),'Descarga PDF a través del motor oficial');
check(plannerJS.includes('extras:Core.recommend(state).extras'),'PDF usa ids de extras, no objetos (sin perder líneas)');
check(plannerJS.includes("sessionStorage.setItem('abel-v10-builder-draft'")&&plannerJS.includes("sessionStorage.setItem('abel-v10-contact-draft'"),'Handoff de sesión explícito a V9 y contacto');
check(plannerJS.includes("sessionStorage.setItem('abel-v9-crm-draft'")&&crm.includes('studio-import-apply'),'CRM requiere desbloqueo y revisión');
check(v9.includes("sessionStorage.removeItem('abel-v10-builder-draft')"),'V9 consume borrador de sesión');
check(contact.includes("sessionStorage.removeItem('abel-v10-contact-draft')")&&!contact.includes('fetch('),'Contacto prepara el borrador sin enviarlo en segundo plano');
check(crm.includes("KEY='alstudio-v10-crm-v1'")&&crm.includes('AES-GCM'),'El cifrado y almacenamiento CRM previo permanecen');
check(cmp.includes('type="range"')&&cmp.includes('aria-label="Porcentaje'),'Comparador controlable con teclado');
check(cmpJS.includes("style.setProperty('--split'")&&cmpJS.includes("data-compare-sector"),'Comparación visual dinámica por sectores');
check(cmp.includes('Todos los negocios, textos y escenas son ejemplos ficticios'),'No se presentan casos de éxito inventados');
check(css.includes('@media(max-width:630px)')&&css.includes('prefers-reduced-motion'),'Responsive y preferencia de movimiento');
for(const name of ['planificador-v10.html','comparador-v10.html'])check(sitemap.includes('/experiencias/'+name),'Sitemap '+name);
for(const filename of ['experiencias/planificador-v10.html','experiencias/comparador-v10.html']){
 const page=read(filename);
 check(page.includes('rel="canonical"')&&page.includes('name="description"'),'Metadata SEO '+filename);
 const links=[...page.matchAll(/<(?:script|link|a)\b[^>]*?\b(?:src|href)="([^"]+)"/g)].map(m=>m[1]).filter(v=>!v.startsWith('#')&&!/^https?:|^mailto:/.test(v));
 for(const link of links)check(fs.existsSync(path.resolve('experiencias',link.split(/[?#]/)[0])),'Ruta '+filename+' → '+link);
}
const sectorMap=['restaurantes','peluquerias','talleres','comercios','alojamientos'];
for(const s of sectorMap){
 const text=read('sectores/'+s+'.html');
 check(text.includes('../experiencias/planificador-v10.html?sector='),'Landing enlaza asistente: '+s);
 check(text.includes('../experiencias/comparador-v10.html?sector='),'Landing enlaza antes/después: '+s);
}
check(B.SECTION_META.some(x=>x.id==='automation'&&x.extra==='n8n'),'V9 soporta bloque extra de automatización');
console.log('Client Journey V10: '+passed+' verificaciones superadas.');
