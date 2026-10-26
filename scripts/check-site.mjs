import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';
const root=process.cwd();const must=['index.html','assets/brand-v9.css','assets/brand-v9.js','assets/brand-v10.css','assets/og-al-studio.png','robots.txt','sitemap.xml','herramientas/presupuestos.html','herramientas/automatizaciones.html','herramientas/crm.html','herramientas/marca.html'];
const demoNames=['pasteleria','joyeria','taller','barberia','libreria','pizzeria','fruteria','floristeria','auto-mecanica-reco','peluqueria-r-munoz','taberna-lo-nuestro','cafeteria-rocio','mascotas','estetica','cafeteria'];
for(const n of demoNames)must.push('demos/'+n+'.html');
let failed=0;const check=(ok,msg)=>{console.log((ok?'OK  ':'FAIL  ')+msg);if(!ok)failed++};
for(const item of must)check(fs.existsSync(path.join(root,item)),'Existe '+item);
const pages=['index.html',...demoNames.map(x=>'demos/'+x+'.html'),...['presupuestos','automatizaciones','crm','marca'].map(x=>'herramientas/'+x+'.html')];
for(const file of pages){const full=path.join(root,file);if(!fs.existsSync(full))continue;const html=fs.readFileSync(full,'utf8');for(const match of html.matchAll(/<(?:a|link|script|img)\b[^>]*?(?:href|src)=["']([^"']+)["']/gi)){const u=match[1];if(/^(?:https?:|mailto:|tel:|data:|#|javascript:)/i.test(u))continue;const noFragment=u.split(/[?#]/)[0];if(!noFragment)continue;const local=path.resolve(path.dirname(full),decodeURIComponent(noFragment));check(fs.existsSync(local),'Ruta '+file+' → '+u)}for(const block of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)){if(!block[1].trim()||/application\/ld\+json/i.test(block[0].slice(0,block[0].indexOf('>')+1)))continue;try{new vm.Script(block[1],{filename:file});}catch(e){check(false,'JS inválido '+file+' '+e.message)}}}
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const name of demoNames)check(index.includes('demos/'+name+'.html'),'Demo enlazada '+name);
check(index.includes('og:image')&&index.includes('canonical'),'SEO y redes');
check(index.length<150000,'Portada optimizada (<150 KB)');
const files=[...fs.readdirSync(path.join(root,'assets')).filter(x=>x.startsWith('portfolio-')&&x.endsWith('.webp'))];check(files.length===8,'8 fotografías externas cacheables');
if(failed){console.error(failed+' comprobaciones fallidas');process.exit(1)}else console.log('Todas las pruebas básicas superadas');
