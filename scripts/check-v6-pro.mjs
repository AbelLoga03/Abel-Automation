import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
let failures=0;
const check=(ok,description)=>{console.log((ok?'OK  ':'FAIL  ')+description);if(!ok)failures++};
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const required=['index.html','explorar-demos.html','herramientas/configurador-v6-pro.html','assets/v6-pro.css','sitemap.xml'];
for(const p of required)check(fs.existsSync(path.join(root,p)),'Archivo V6 PRO: '+p);
if(required.some(p=>!fs.existsSync(path.join(root,p))))process.exit(1);

const index=read('index.html'),gallery=read('explorar-demos.html'),calculator=read('herramientas/configurador-v6-pro.html'),css=read('assets/v6-pro.css'),sitemap=read('sitemap.xml');
check(index.includes('id="v6-pro"'),'Portada conserva sección V6 PRO');
check(index.includes('href="assets/v6-pro.css"'),'Estilos V6 PRO cargados');
check(index.includes('href="explorar-demos.html"'),'Galería enlazada desde portada');
check(index.includes('href="herramientas/configurador-v6-pro.html"'),'Configurador enlazado desde portada');
check(css.includes('.v6pro-card')&&css.includes('@media(max-width:600px)'),'Diseño responsive V6 PRO');
check(index.length<150000,'Portada bajo 150 KB');

for(const p of ['explorar-demos.html','herramientas/configurador-v6-pro.html']){
 const html=read(p);
 for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)){
  try{new vm.Script(match[1],{filename:p});check(true,'Sintaxis JS '+p)}catch(e){check(false,'Sintaxis JS '+p+': '+e.message)}
 }
 for(const match of html.matchAll(/<(?:a|link|script|img)\b[^>]*?(?:href|src)=["']([^"']+)["']/gi)){
  const url=match[1];if(/^(?:https?:|mailto:|tel:|data:|#)/i.test(url))continue;
  const local=path.resolve(root,path.dirname(p),decodeURIComponent(url.split(/[?#]/)[0]));
  check(fs.existsSync(local),'Ruta local '+p+' → '+url);
 }
}
const dm=gallery.match(/const data=(\[[\s\S]*?\]);\s*const \$=/);
check(!!dm,'Catálogo de demos disponible');
if(dm){try{
 const data=vm.runInNewContext(dm[1]);const ids=data.map(x=>x[0]);
 check(data.length===21,'21 demos V14 preservadas');
 check(new Set(ids).size===21,'Sin demos duplicadas');
 for(const n of ids)check(fs.existsSync(path.join(root,'demos',n+'.html')),'Demo preservada: '+n);
 for(const n of ['pasteleria','joyeria','taller','barberia','libreria','pizzeria','fruteria','floristeria','auto-mecanica-reco','peluqueria-r-munoz','taberna-lo-nuestro','cafeteria-rocio','mascotas','estetica','cafeteria','bruma-cafe','pulso-club','nido-mascotas','lumen-home','horizonte-escapes','orbita-creativa'])check(ids.includes(n),'Demo V14 incluida en el buscador: '+n);
 }catch(e){check(false,'Configuración de demos: '+e.message)}}
const packages=calculator.match(/const bases=(\[[\s\S]*?\]);\s*const extras=/);
const features=calculator.match(/const extras=(\[[\s\S]*?\]);\s*const \$=/);
check(!!packages&&!!features,'Tarifas y extras definidas');
if(packages&&features)try{
const b=vm.runInNewContext(packages[1]),e=vm.runInNewContext(features[1]);
check(b.length===11,'11 planes con modo personalizado');
check(e.length===20,'20 servicios adicionales disponibles');
check(new Set(b.map(x=>x.id)).size===b.length&&new Set(e.map(x=>x.id)).size===e.length,'Identificadores únicos');
check(b.every(x=>Number.isInteger(x.price)&&x.price>=0)&&e.every(x=>Number.isInteger(x.price)&&x.price>=0),'Precios numéricos válidos');
check(b.some(x=>x.price===199)&&b.some(x=>x.price===349)&&b.some(x=>x.price===499),'Tarifas originales conservadas');
}catch(e){check(false,'Catálogo de precios '+e.message)}
check(calculator.includes('id="maintenance"')&&calculator.includes('id="include-tax"'),'Mensualidad e IVA separados');
for(const control of ['copy','download','print','email','feedback'])check(calculator.includes('id="'+control+'"'),'Control de presupuestos '+control);
check(calculator.includes('type="text/plain')===false,'Exportación por Blob y no por servidor');
check(calculator.includes('new Blob')&&calculator.includes('window.print()'),'Descarga y PDF local disponibles');
check(gallery.includes('aria-pressed')&&gallery.includes('type="search"'),'Filtros y búsqueda accesible');
for(const p of ['explorar-demos.html','herramientas/configurador-v6-pro.html'])check(sitemap.includes('/Abel-Automation/'+p),'Sitemap incluye '+p);
if(failures)process.exitCode=1;else console.log('V6 PRO: todas las comprobaciones superadas');
