import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';
const root=process.cwd();const must=['index.html','assets/brand-v9.css','assets/brand-v9.js','assets/brand-v10.css','assets/ionos-inspired-v11.css','assets/ionos-inspired-v11.js','assets/blue-fix-v13.css','assets/site-v14.css','demos/fictional-v14.css','demos/fictional-v14.js','privacidad.html','gracias.html','assets/og-al-studio.png','robots.txt','sitemap.xml','herramientas/presupuestos.html','herramientas/automatizaciones.html','herramientas/crm.html','herramientas/marca.html','servicios/landing.css','servicios/landing.js','assets/selector-v12.js',...['web','catalogos','automatizaciones','comparar'].map(n=>'servicios/'+n+'.html')];
const demoNames=['pasteleria','joyeria','taller','barberia','libreria','pizzeria','fruteria','floristeria','auto-mecanica-reco','peluqueria-r-munoz','taberna-lo-nuestro','cafeteria-rocio','mascotas','estetica','cafeteria'];
const fictional=['bruma-cafe','pulso-club','nido-mascotas','lumen-home','horizonte-escapes','orbita-creativa'];
for(const n of [...demoNames,...fictional])must.push('demos/'+n+'.html');
let failed=0;const check=(ok,msg)=>{console.log((ok?'OK  ':'FAIL  ')+msg);if(!ok)failed++};
for(const item of must)check(fs.existsSync(path.join(root,item)),'Existe '+item);
const pages=['index.html',...[...demoNames,...fictional].map(x=>'demos/'+x+'.html'),...['presupuestos','automatizaciones','crm','marca'].map(x=>'herramientas/'+x+'.html'),...['web','catalogos','automatizaciones','comparar'].map(x=>'servicios/'+x+'.html'),'privacidad.html','gracias.html'];
for(const file of pages){const full=path.join(root,file);if(!fs.existsSync(full))continue;const html=fs.readFileSync(full,'utf8');for(const match of html.matchAll(/<(?:a|link|script|img)\b[^>]*?(?:href|src)=["']([^"']+)["']/gi)){const u=match[1];if(/^(?:https?:|mailto:|tel:|data:|#|javascript:)/i.test(u))continue;if(u.includes('${')||u.includes('{{'))continue;const noFragment=u.split(/[?#]/)[0];if(!noFragment)continue;const local=path.resolve(path.dirname(full),decodeURIComponent(noFragment));check(fs.existsSync(local),'Ruta '+file+' → '+u)}for(const block of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)){if(!block[1].trim()||/type=["']application\/(?:ld\+json|json)["']/i.test(block[0].slice(0,block[0].indexOf('>')+1)))continue;try{new vm.Script(block[1],{filename:file});}catch(e){check(false,'JS inválido '+file+' '+e.message)}}}
// La V14 permanece íntegra para evitar regresiones; la V6 tiene pruebas independientes.
const index=fs.readFileSync(path.join(root,'index-v14.html'),'utf8');for(const name of demoNames)check(index.includes('demos/'+name+'.html'),'Demo enlazada '+name);
check(index.includes('og:image')&&index.includes('canonical'),'SEO y redes');
check(index.length<150000,'Portada optimizada (<150 KB)');
const files=[...fs.readdirSync(path.join(root,'assets')).filter(x=>x.startsWith('portfolio-')&&x.endsWith('.webp'))];check(files.length===8,'8 fotografías externas cacheables');
// Validar imagen PNG social (firma, dimensiones y datos comprimidos)
try{const png=fs.readFileSync(path.join(root,'assets/og-al-studio.png'));const width=png.readUInt32BE(16),height=png.readUInt32BE(20);let offset=8;const chunks=[];while(offset<png.length){const len=png.readUInt32BE(offset),tag=png.toString('ascii',offset+4,offset+8);if(tag==='IDAT')chunks.push(png.subarray(offset+8,offset+8+len));offset+=12+len;if(tag==='IEND')break}const inflated=(await import('node:zlib')).inflateSync(Buffer.concat(chunks));check(width===1200&&height===630,'Dimensiones Open Graph 1200×630');check(inflated.length===(width+1)*height,'PNG social descomprimible y completo')}catch(e){check(false,'Imagen social PNG inválida: '+e.message)}
// Pruebas del rediseño comercial V11
for(const anchor of ['inicio','soluciones','dominios','precios','proyectos','herramientas','preguntas','contacto'])check(index.includes('id="'+anchor+'"'),'V11 sección '+anchor);
check((index.match(/id="precios"/g)||[]).length===1,'Única sección de planes');
check(index.includes('ion-domain-form')&&index.includes('ni confirma disponibilidad'),'Buscador de ideas sin fingir disponibilidad');
check(index.includes('ion-mobile-toggle')&&index.includes('ion-menu'),'Navegación móvil accesible');
check(demoNames.length===15&&fictional.length===6&&index.includes('21'),'21 demostraciones: 15 anteriores y 6 nuevas');
for(const src of ['assets/brand-v9.js','assets/ionos-inspired-v11.js']){try{new vm.Script(fs.readFileSync(path.join(root,src),'utf8'),{filename:src});check(true,'JS externo válido '+src)}catch(e){check(false,'JS externo '+src+': '+e.message)}}
// V12 · verificar ampliación de servicios sin afectar al portfolio existente.
for(const n of ['web','catalogos','automatizaciones','comparar']){check(index.includes('servicios/'+n+'.html'),'Servicio comercial enlazado '+n);check(fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').includes('servicios/'+n+'.html'),'Servicio indexado en sitemap '+n)}
check(index.includes('id="v12-finder"')&&index.includes('data-v12-kind="web"'),'Selector comercial interactivo');
const demoCatalog=fs.readFileSync(path.join(root,'servicios/catalogos.html'),'utf8');
check(demoCatalog.includes('data-product-card')&&demoCatalog.includes('id="basket-list"'),'Catálogo interactivo de prueba');
const demoWeb=fs.readFileSync(path.join(root,'servicios/web.html'),'utf8');
check(demoWeb.includes('id="live-frame"')&&demoWeb.includes('data-device="mobile"'),'Visor de demos móvil/ordenador');
const demoAuto=fs.readFileSync(path.join(root,'servicios/automatizaciones.html'),'utf8');
check(demoAuto.includes('id="flow-start"')&&demoAuto.includes('data-flow="taller"'),'Simulador visual sectorial');
const compare=fs.readFileSync(path.join(root,'servicios/comparar.html'),'utf8');
check(compare.includes('id="recommended-title"')&&compare.includes('data-need="productos"'),'Comparador y recomendador de plan');
for(const src of ['assets/selector-v12.js','servicios/landing.js']){try{new vm.Script(fs.readFileSync(path.join(root,src),'utf8'),{filename:src});check(true,'JS V12 válido '+src)}catch(e){check(false,'JS V12 inválido '+src+': '+e.message)}}
// V13: cobertura de identidad azul y de la sección que podía quedar invisible.
const css13=fs.readFileSync(path.join(root,'assets/blue-fix-v13.css'),'utf8');
const icon=fs.readFileSync(path.join(root,'assets/al-studio-mark.svg'),'utf8');
const logo=fs.readFileSync(path.join(root,'assets/al-studio-logo.svg'),'utf8');
const motion=fs.readFileSync(path.join(root,'assets/brand-v9.js'),'utf8');
check(index.includes('href="assets/blue-fix-v13.css"'),'Corrección azul V13 cargada en portada');
check(icon.includes('#1973DA')&&logo.includes('#1973DA')&&!icon.includes('#d9ff8d'),'Logo y favicon de marca en azul');
check(css13.includes('.v10-enter,.v9-reveal{opacity:1!important;transform:none!important}'),'Bloques V9/V10 nunca invisibles sin JS');
check(motion.includes('.v9-reveal, .v10-enter')&&motion.includes('v10-visible'),'Animación de V10 conectada');
check(css13.includes('#casos{background:linear-gradient')&&css13.includes('#casos .mini-v9-card .content h3'),'Zona antigua oscura y títulos corregidos');
check(index.includes('#2CCBE9 · CIAN')&&index.includes('#0A3772 · AZUL'),'Muestrario en azul actualizado');
// V14: leads form, fictional portfolio and privacy.
const landings=[...fictional.map(n=>'demos/'+n+'.html')];const siteMap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
for(const n of fictional){check(index.includes('demos/'+n+'.html'),'Nueva demo ficticia enlazada: '+n);check(siteMap.includes('demos/'+n+'.html'),'Nueva demo ficticia en sitemap: '+n)}
check(index.includes('id="servicios-v14"')&&index.includes('id="proyectos-ficticios"'),'Doce servicios y nuevo escaparate V14');
check(index.includes('href="assets/site-v14.css"'),'CSS V14 cargado');
check(index.includes('method="POST"')&&index.includes('action="https://formsubmit.co/abellopezgarcia27@gmail.com"'),'Formulario de contacto con envío externo real');
check(index.includes('name="email"')&&index.includes('name="privacidad_aceptada"')&&index.includes('type="checkbox"'),'Email, privacidad y consentimiento');
check(!index.includes("$('#contact-form').addEventListener('submit'"),'Antiguo interceptador mailto eliminado');
check(index.includes('privacidad.html')&&index.includes('gracias.html'),'Privacidad y página de retorno incluidas');
check(!['Auto Mecánica Reco','Peluquería R. Muñoz','Taberna Lo Nuestro','Cafetería Rocío','Café Trassierra'].some(n=>index.includes(n)),'Portada sin lugares o negocios reales');
for(const src of ['demos/fictional-v14.js']){try{new vm.Script(fs.readFileSync(path.join(root,src),'utf8'),{filename:src});check(true,'JS V14 válido '+src)}catch(e){check(false,'JS V14 inválido '+src+': '+e.message)}}
for(const name of fictional){const html=fs.readFileSync(path.join(root,'demos/'+name+'.html'),'utf8');const data=html.match(/<script id="demo-data" type="application\/json">([\s\S]+?)<\/script>/);try{const parsed=JSON.parse(data?.[1]||'null');check(!!parsed&&parsed.items.length===6&&parsed.steps.length===3,'Datos demo V14 válidos '+name)}catch(e){check(false,'Config JSON de demo '+name+': '+e.message)}}
if(failed){console.error(failed+' comprobaciones fallidas');process.exit(1)}else console.log('Todas las pruebas básicas superadas');
