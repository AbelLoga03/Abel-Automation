import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=process.cwd();
let passed=0,failed=0;
const check=(ok,label)=>{console.log((ok?'OK   ':'FAIL ')+label);ok?passed++:failed++;};
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const exists=name=>fs.existsSync(path.join(root,name));
const main='index.html',page=read(main),code=read('assets/v6-pro.js');
const four=['restaurante-qr-v6','hotel-rural-v6','peluqueria-agenda-v6','reparaciones-it-v6'];
const older=['pasteleria','joyeria','taller','barberia','libreria','pizzeria','fruteria','floristeria','cafeteria','estetica','mascotas','auto-mecanica-reco','cafeteria-rocio','peluqueria-r-munoz','taberna-lo-nuestro','bruma-cafe','pulso-club','nido-mascotas','lumen-home','horizonte-escapes','orbita-creativa'];
for(const file of [main,'index-v14.html','legacy/index-v14.html','legacy/v6-pro-original.html','assets/v6-pro.css','assets/v6-pro.js','demos/v6-demo.css','demos/v6-demo.js',...four.map(s=>'demos/'+s+'.html')])check(exists(file),'Archivo: '+file);
for(const codefile of ['assets/v6-pro.js','demos/v6-demo.js'])try{new vm.Script(read(codefile));check(true,'Sintaxis JS: '+codefile)}catch(e){check(false,'Sintaxis JS: '+codefile+' · '+e.message)}
for(const section of ['inicio','servicios','proyectos','precios','presupuesto','proceso','faq','contacto'])check(page.includes('id="'+section+'"'),'Sección: '+section);
check(page.includes('name="description"')&&page.includes('rel="canonical"'),'Metadatos SEO de portada');
check(page.includes('prefers-reduced-motion')||read('assets/v6-pro.css').includes('prefers-reduced-motion'),'Movimiento reducido');
check(page.includes('aria-controls="menu"'),'Menú accesible');
check(page.includes('id="budget-copy"')&&page.includes('id="budget-download"')&&page.includes('id="budget-print"'),'Exportación del presupuesto');
check(page.includes('id="contact-form"')&&page.includes('required'),'Formulario local validable');
check(page.includes('index-v14.html'),'Acceso a V14 preservada');
const jsWithoutBoot=code.slice(0,code.lastIndexOf("document.addEventListener('DOMContentLoaded'"));
let data;
try{data=vm.runInNewContext(jsWithoutBoot+'\n({PRICE_DATA,DEMOS,state,budgetNumbers,budgetText})',{Intl,Date});check(data.DEMOS.length===25,'25 demos en catálogo');}catch(e){check(false,'Modelos de presupuesto ejecutables: '+e.message);}
if(data){
 for(const slug of [...older,...four])check(data.DEMOS.some(x=>x[1]===slug)&&exists('demos/'+slug+'.html'),'Demo preservada: '+slug);
 const basePrices=[99,149,199,299,349,379,449,499,599,799];check(JSON.stringify(data.PRICE_DATA.web.map(x=>x.price))===JSON.stringify(basePrices),'10 precios web exactos');
 const extraPrices=[49,89,129,119,39,19,25,49,99,79,129];check(JSON.stringify(data.PRICE_DATA.extras.map(x=>x.price))===JSON.stringify(extraPrices),'11 precios de extras exactos');
 const maintenance=[0,15,29,49,79];check(JSON.stringify(data.PRICE_DATA.maintenance.map(x=>x.price))===JSON.stringify(maintenance),'5 modalidades mantenimiento');
 check(data.budgetNumbers().total===299,'Presupuesto inicial 299 €');
 data.state.extras.add('whatsapp');check(data.budgetNumbers().total===318,'299 € + WhatsApp 19 € = 318 €');
 data.state.maintenance='negocio';check(data.budgetNumbers().total===318&&data.budgetNumbers().maint.price===29,'Mantenimiento separado del pago inicial');
 data.state.base='restaurante';data.state.extras=new Set(['qr-basic','whatsapp']);data.state.bundle='restaurante';const pack=data.budgetNumbers();check(pack.total===409&&pack.discount===38,'Descuento pack restaurante 447 € → 409 €');
 data.state.bundle=null;check(data.budgetNumbers().total===447,'Sin pack no se aplica descuento');
 data.state.base='tienda';check(data.budgetNumbers().approx,'Servicio desde marcado como orientativo');
 check(data.budgetText().includes('IVA')&&data.budgetText().includes('MANTENIMIENTO'),'Exportación incluye condiciones y mantenimiento');
}
for(const p of [main,...four.map(s=>'demos/'+s+'.html')]){
 const html=read(p),dir=path.dirname(p);
 for(const m of html.matchAll(/<(?:a|link|script|img)\b[^>]*?\b(?:href|src)=["']([^"']+)["']/gi)){
  const url=m[1];if(/^(?:https?:|mailto:|tel:|#|data:)/.test(url))continue;
  const clean=url.split(/[?#]/)[0];if(!clean)continue;
  check(exists(path.normalize(path.join(dir,clean))),'Ruta local: '+p+' → '+clean);
 }
}
for(const p of four.map(s=>'demos/'+s+'.html')){
 const html=read(p);check(html.includes('DEMO NO OFICIAL')&&html.includes('NEGOCIO FICTICIO'),'Aviso no oficial '+p);
 check(html.includes('name="robots" content="noindex,follow"'),'No indexar negocio ficticio '+p);
 check(html.includes('window.V6_DEMO_CONFIG='),'Datos interactivos '+p);
 check(html.includes('id="demo-items"')&&html.includes('id="interactivo"'),'Secciones navegables '+p);
 check(html.includes('alt=')||read('demos/v6-demo.js').includes('img.alt='),'Imágenes con textos alternativos '+p);
 const match=html.match(/window\.V6_DEMO_CONFIG=(\{.*\});<\/script>/);try{const d=JSON.parse(match?.[1]??'null');check(d?.items?.length>=3,'Productos demo '+p);}catch(e){check(false,'JSON correcto '+p);}
}
console.log('\nV6 PRO: '+passed+' comprobaciones correctas; '+failed+' fallidas.');
if(failed)process.exit(1);
