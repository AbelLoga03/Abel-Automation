import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const core=(await import('../assets/builder-v9-core.js')).default;
const pdf=(await import('../assets/proposal-v8.js')).default;
const read=p=>fs.readFileSync(p,'utf8');
let checks=0;
const ok=(condition,message)=>{assert.ok(condition,message);checks++;console.log('OK',message);};
const files=['assets/builder-v9-core.js','estudio/configurador-v9.html','estudio/configurador-v9.js','estudio/configurador-v9.css','assets/proposal-v8.js','herramientas/propuestas-v8.js','herramientas/crm.html'];
for(const f of files)ok(fs.existsSync(f),'Archivo '+f);
for(const f of ['assets/builder-v9-core.js','estudio/configurador-v9.js','herramientas/propuestas-v8.js']){
 new vm.Script(read(f),{filename:f});ok(true,'Sintaxis JS '+f);
}
ok(Object.keys(core.SECTORS).length===7,'7 sectores disponibles');
ok(Object.keys(core.THEMES).length===6,'6 paletas');
ok(core.STYLES.length===4&&core.FONTS.length===4&&core.LAYOUTS.length===3,'Estilos, fuentes y layouts');
ok(core.SECTION_META.length===14,'14 tipos de secciones');
for(const id of Object.keys(core.SECTORS)){
 const d=core.defaults(id);
 ok(d.sector===id&&d.brand===core.SECTORS[id].brand,'Plantilla sectorial '+id);
 const q=core.quote(d,pdf),base=pdf.lookup('web',core.SECTORS[id].base);
 ok(q.base.price===base.price,'Tarifa sector '+id);
 ok(d.sections.includes('hero'),'Hero obligatorio '+id);
}
let d=core.defaults('restaurante');
ok(core.priceIds(d).base==='restaurante','Base de restaurante');
ok(core.priceIds(d).extras.includes('gallery')&&core.priceIds(d).extras.includes('whatsapp'),'Extras iniciales presentes');
ok(core.quote(d,pdf).total===379+49+19,'Precio inicial 447 € coincide con catálogo V8');
d=core.normalize({...d,sections:['hero','qr','booking','seo','form']});
ok(core.quote(d,pdf).total===379+129+99+79+39,'Todos los extras generan coste transparente');
ok(core.quote(d,pdf).extras.length===4,'La portada nunca se cobra como extra');
d=core.normalize({...d,order:['hero','contact','about','hero','xss','booking']});
ok(new Set(d.order).size===14&&d.order.every(id=>core.DEFAULT_ORDER.includes(id)),'Orden sin duplicados ni ids maliciosos');
ok(!d.sections.includes('evil')&&d.sections.includes('hero'),'Lista de bloques filtrada');
const userInput='<img src=x onerror=alert(1)>';
d=core.normalize({...d,brand:userInput,headline:'Málaga y más',colors:{bg:'url(javascript:alert(1))',accent:'#aa5500'},custom:true});
ok(d.colors.bg==='#f8efe7'&&d.colors.accent==='#aa5500','Validación estricta de color #RRGGBB');
ok(d.brand===userInput&&d.headline==='Málaga y más','Los textos se preservan sin usarse como HTML');
const token=core.shareToken(d),restored=core.parseToken(token);
ok(restored.brand===d.brand&&restored.colors.accent===d.colors.accent,'Enlace de compartir conserva Unicode y colores');
ok(core.importJson(core.serialize(d)).headline==='Málaga y más','Importar/exportar JSON conserva textos');
assert.throws(()=>core.parseToken('%xxx'));ok(true,'Enlace incorrecto rechazado');
assert.throws(()=>core.importJson(''.padEnd(19000,'0')));ok(true,'Archivo demasiado grande rechazado');
ok(core.normalize({theme:'no',style:'invento',font:'mal',layout:'foo'}).style==='editorial','Configuración de opciones inválidas filtrada');
ok(core.normalize({custom:false,colors:{accent:'#000000'}}).colors.accent==='#b5634e','Paleta elegida prevalece cuando no está personalizada');
const estimate=core.quote(core.defaults('restaurante'),pdf);
ok(estimate.total===447&&!estimate.from,'Presupuesto incluye extras, sin importes inventados');
const brief=core.brief(d);
ok(brief.includes('Secciones:')&&brief.includes('Marca de ejemplo: '+userInput),'Brief representa la selección y no afirma web publicada');
const bytes=Buffer.from(pdf.pdfDocument({...core.priceIds(d),scope:brief,project:'Propuesta para Málaga'}));
ok(bytes.subarray(0,8).toString('latin1')==='%PDF-1.4','El constructor produce PDF auténtico');
ok(bytes.toString('latin1').includes('/Type /Catalog')&&bytes.toString('latin1').includes('startxref'),'PDF conserva estructura documental');
const html=read('estudio/configurador-v9.html'),js=read('estudio/configurador-v9.js'),css=read('estudio/configurador-v9.css'),home=read('index.html'),crm=read('herramientas/crm.html'),pr=read('herramientas/propuestas-v8.js'),prHtml=read('herramientas/propuestas-v8.html');
for(const id of ['biz-sector','biz-brand','biz-headline','biz-intro','biz-cta','palette-options','custom-toggle','color-bg','color-ink','color-accent','color-surface','style-options','layout-options','font-select','blocks-list','site-canvas','builder-pdf','builder-edit-proposal','builder-crm','save-config','load-config-file','share-config']){
 ok(html.includes('id="'+id+'"'),'Control V9 '+id);
}
ok(html.includes('data-tab="business"')&&html.includes('data-tab="blocks"'),'Pestañas del editor');
ok(js.includes("textContent=String(txt)")&&!/innerHTML\s*=/.test(js),'Textos creados como nodos, sin inyección HTML');
ok(js.includes('file.size>18000')&&js.includes('Core.importJson'),'Límites de importación JSON');
ok(js.includes('Core.parseToken(token)')&&js.includes('Core.shareToken(state)'),'Compartir y restaurar enlaces');
ok(js.includes("sessionStorage.setItem('abel-v9-proposal-draft'")&&js.includes("sessionStorage.setItem('abel-v9-crm-draft'"),'Traspasos locales por acción del usuario');
ok(js.includes("Engine.pdfDocument(data)")&&js.includes("application/pdf"),'PDF directo desde el configurador');
ok(pr.includes("sessionStorage.removeItem('abel-v9-proposal-draft')")&&prHtml.includes('../assets/builder-v9-core.js'),'La propuesta consume y borra el paquete de sesión');
ok(crm.includes("KEY='alstudio-v10-crm-v1'")&&crm.includes('AES-GCM')&&crm.includes('PBKDF2'),'Bóveda original y cifrado conservados');
ok(crm.includes("sessionStorage.removeItem(STUDIO_DRAFT_KEY)")&&crm.includes('id="studio-import"'),'CRM importa explícitamente y borra datos temporales');
ok(crm.includes("'formFeedback').textContent='Formulario rellenado")&&crm.includes("await seal()"),'Revisión antes de guardar cifrado');
ok(css.includes('[data-device=mobile]')&&css.includes('[data-device=tablet]'),'Previsualización adaptable');
ok(css.includes('prefers-reduced-motion')&&css.includes(':focus-visible'),'Accesibilidad básica');
ok(home.includes('estudio/configurador-v9.html'),'Acceso al V9 desde portada');
const localFiles=[...html.matchAll(/<(?:script|link|a)\b[^>]*\b(?:src|href)="([^"]+)"/g)].map(m=>m[1]).filter(x=>!x.startsWith('#')&&!/^https?:|^mailto:/.test(x));
for(const link of localFiles){
 const candidate=path.resolve('estudio',link.split(/[?#]/)[0]);
 ok(fs.existsSync(candidate),'Ruta local constructor '+link);
}
for(const name of ['portfolio-pizzeria.webp','portfolio-joyeria.webp','portfolio-barberia.webp','portfolio-taller.webp','portfolio-floristeria.webp','portfolio-libreria.webp']){
 ok(fs.existsSync('assets/'+name),'Foto local permitida '+name);
}
console.log('V9 Configurator PRO: '+checks+' comprobaciones superadas.');
