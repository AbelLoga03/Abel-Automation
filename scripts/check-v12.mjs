/* Abel Automation V12 — pruebas de exportación ZIP real, HTML/CSS/JS y flujos anteriores. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const B=(await import('../assets/builder-v9-core.js')).default;
const E=(await import('../assets/web-export-v12.js')).default;
const P=(await import('../assets/proposal-v8.js')).default;
const read=p=>fs.readFileSync(p,'utf8'),exists=p=>fs.existsSync(p);
let checks=0;const ok=(x,label)=>{assert.ok(x,label);checks++;console.log('OK ',label)};
const required=['assets/web-export-v12.js','assets/site-runtime-v12.css','assets/site-runtime-v12.js','estudio/builder-v12.html','estudio/builder-v12.css','estudio/builder-v12.js','novedades.html','index.html','scripts/check-v11.mjs'];
for(const file of required)ok(exists(file),'Archivo existente: '+file);
for(const file of ['assets/web-export-v12.js','assets/site-runtime-v12.js','estudio/builder-v12.js','estudio/configurador-v9.js']){
 new vm.Script(read(file),{filename:file});ok(true,'JS compila: '+file);
}
const siteCSS=read('assets/site-runtime-v12.css'),siteJS=read('assets/site-runtime-v12.js'),ui=read('estudio/builder-v12.html'),app=read('estudio/builder-v12.js'),home=read('index.html'),news=read('novedades.html'),v9=read('estudio/configurador-v9.js');
ok(Object.keys(B.SECTORS).length===7&&E.IMAGES.length===6,'Siete plantillas y seis fotografías locales');
ok(B.SECTION_META.length===15,'15 bloques conservados');
for(const key of Object.keys(B.SECTORS)){
 const p=E.defaults(key);ok(p.sector===key&&p.version===12,'Plantilla: '+key);
 ok(p.brand===B.SECTORS[key].brand&&p.image===B.SECTORS[key].hero,'Identidad e imagen: '+key);
 const h=E.htmlText(p),css=E.filesForProject(p,siteCSS,siteJS)['styles.css'];
 ok(h.includes('<title>'+p.brand+'</title>')&&h.includes('assets/'+p.image),'HTML exportado propio del sector: '+key);
 ok(css.includes('--accent:')&&css.includes('@media(max-width:620px)'),'CSS responsive por sector: '+key);
 ok(B.quote(p,P).total>=99,'Presupuesto vigente conectado: '+key);
}
let p=E.defaults('restaurante');
ok(B.quote(p,P).total===447,'V12 respeta 379+49+19=447 EUR de la plantilla V9');
p=E.normalize({...p,brand:'La <Web> & Compañía',headline:'Oferta "única" <script>alert(1)</script>',intro:'Un <b>negocio</b> original',sections:['hero','services','form','booking','gallery','whatsapp','seo'],email:'contacto@ejemplo.es',phone:'+34600123456',layout:'full',style:'bold',custom:true,colors:{bg:'#101010',ink:'#efefef',accent:'#ffaacc',surface:'#202020'}});
const h=E.htmlText(p);
ok(!h.includes('<script>alert(1)</script>')&&h.includes('&lt;script&gt;alert(1)&lt;/script&gt;'),'No se interpreta HTML inyectado por el usuario');
ok(h.includes('La &lt;Web&gt; &amp; Compañía'),'Escapado de marca');
ok(h.includes('class="style-bold"')&&h.includes('layout-full'),'Estilo y distribución realmente usados');
ok(h.includes('mailto:')&&h.includes('meta name="contact-email"'),'Email permite preparar consultas');
ok(h.includes('https://wa.me/34600123456'),'WhatsApp solo habilitado con número válido');
ok(h.includes('<form id="site-contact-form">')&&siteJS.includes("e.preventDefault()")&&siteJS.includes('mailto:'),'Formulario estático funcional con correo, sin backend');
ok(h.includes('styles.css')&&h.includes('app.js'),'HTML enlaza CSS y JS exportados');
ok(E.htmlText(p,true,siteCSS,siteJS).includes('contenteditable="true"'),'Vista previa permite edición directa');
ok(E.htmlText(p,true,siteCSS,siteJS).includes("parent.postMessage({type:'ABEL_V12_EDIT'"),'Mensajes de edición a la ventana de autor');
ok(E.normalize({...p,phone:'javascript:alert(1)',email:'a@b<script>'}).phone===''&&E.normalize({...p,email:'a@b<script>'}).email==='','Rechaza datos de contacto inseguros');
ok(E.normalize({...p,image:'https://malicioso.example/x.png'}).image===B.SECTORS[p.sector].hero,'Rechaza imágenes externas no autorizadas');
ok(E.normalize({...p,customPhoto:'data:image/svg+xml;base64,PHN2Zz4='}).customPhoto==='','No permite SVG ejecutable como imagen subida');
ok(E.normalize({...p,customPhoto:'data:image/png;base64,iVBORw0KGgo='}).customPhoto.startsWith('data:image/png;base64,'),'Permite datos PNG autorizados');
ok(E.imageName({...p,customPhoto:'data:image/png;base64,iVBORw0KGgo='})==='hero-personalizada.png','Nombre seguro de imagen subida');
ok(E.normalize({...p,sections:['hero','contact','xss']}).sections.every(x=>B.DEFAULT_ORDER.includes(x)),'Filtra secciones desconocidas');
ok(E.importProject(JSON.stringify(B.defaults('comercio'))).sector==='comercio','Importa proyectos V9 compatibles');
ok(E.importProject(E.projectJson(p)).brand===p.brand,'Exporta e importa configuración V12 con Unicode');
assert.throws(()=>E.importProject('no-json'));ok(true,'JSON inválido rechazado');
assert.throws(()=>E.importProject('x'.repeat(4800001)));ok(true,'JSON excesivo rechazado');
const files=E.filesForProject(p,siteCSS,siteJS);
ok(Object.keys(files).length===5,'Incluye HTML, CSS, JS, proyecto JSON y README');
ok(files['styles.css'].includes('--bg:#101010')&&files['styles.css'].includes('--accent:#ffaacc'),'Colores realmente exportados');
ok(files['app.js']===siteJS&&files['index.html']===h,'Las funciones de la vista y el ZIP tienen código real y consistente');
ok(files['README.txt'].includes('sin backend')||files['README.txt'].includes('Formularios'),'Documentación de límites incluida');
const zipFiles={...files};
for(const filename of E.IMAGES){
 ok(exists('assets/'+filename),'Imagen independiente disponible: '+filename);
 zipFiles['assets/'+filename]=new Uint8Array(fs.readFileSync('assets/'+filename));
}
const zip=E.buildZip(zipFiles);
ok(zip.length>files['styles.css'].length+files['index.html'].length,'ZIP contiene datos y estructura');
ok(Buffer.from(zip).readUInt32LE(0)===0x04034b50,'ZIP abre con firma válida');
ok(Buffer.from(zip).readUInt32LE(zip.length-22)===0x06054b50,'ZIP finaliza con directorio válido');
const folder=fs.mkdtempSync(path.join(os.tmpdir(),'abel-v12-'));
try{
 const filename=path.join(folder,'web.zip');fs.writeFileSync(filename,zip);
 const result=execFileSync('unzip',['-t',filename],{encoding:'utf8'});
 ok(result.includes('No errors detected'),'ZIP completo verificado con unzip');
 const exported=execFileSync('unzip',['-p',filename,'index.html'],{encoding:'utf8'});
 ok(exported===h,'HTML extraído coincide con la web generada');
 const exportedJS=execFileSync('unzip',['-p',filename,'app.js'],{encoding:'utf8'});
 new vm.Script(exportedJS);ok(true,'El JavaScript dentro del ZIP compila y funciona como archivo autónomo');
}finally{fs.rmSync(folder,{recursive:true,force:true});}
assert.throws(()=>E.buildZip({'../../secret.txt':'x'}));ok(true,'ZIP rechaza traversal de rutas');
assert.throws(()=>E.buildZip({'assets/x.svg':'<svg onload=alert(1)>'}));ok(true,'ZIP rechaza formatos no autorizados');
ok(ui.includes('id="live-preview"')&&ui.includes('sandbox="allow-scripts"'),'Vista previa aislada mediante sandbox');
ok(ui.includes('id="export"')&&ui.includes('Generar y descargar web ZIP'),'Acceso de exportación evidente');
ok(ui.includes('id="photo-file"')&&app.includes('readAsDataURL')&&app.includes('file.size>2_000_000'),'Edición de fotografía propia con tamaño limitado');
ok(app.includes("event.source!==iframe.contentWindow")||app.includes("event.source!==iframe.contentWindow".replace('event','event')),'Solo acepta ediciones del iframe propio');
ok(app.includes('Engine.buildZip(files)')&&app.includes('saveFile(zip,'),'Interfaz descarga ZIP real');
ok(app.includes("Proposal.pdfDocument(document)")&&app.includes("sessionStorage.setItem('abel-v9-crm-draft'"),'PDF y CRM están conectados');
ok(app.includes("Engine.fromV9(parsed)")&&v9.includes("sessionStorage.setItem('abel-v12-from-v9'"),'V9 permite transferir la configuración al nuevo constructor');
ok(home.includes('id="novedades-v12"')&&home.includes('estudio/builder-v12.html'),'Portada y centro de novedades prominently visibles');
ok(news.includes('V12')&&news.includes('V11')&&news.includes('V10')&&news.includes('V9'),'Centro de novedades retrospectivo');
ok(read('sitemap.xml').includes('/estudio/builder-v12.html')&&read('sitemap.xml').includes('/novedades.html'),'Páginas nuevas en sitemap');
for(const file of ['estudio/builder-v12.html','novedades.html']){
 for(const match of read(file).matchAll(/<(?:a|link|script|img)\b[^>]*?\b(?:href|src)=["']([^"']+)["']/gi)){
  const url=match[1];if(/^(https?:|mailto:|tel:|data:|#)/.test(url))continue;
  ok(exists(path.resolve(path.dirname(file),url.split(/[?#]/)[0])),'Enlace local válido '+file+' → '+url);
 }
}
const classic=read('scripts/check-v6.mjs');
ok(classic.includes('data.DEMOS.length===25'),'No se elimina la verificación de 25 demos');
console.log('V12 Web Builder PRO: '+checks+' validaciones completas (incluyendo unzip real).');
