/* Abel Automation V15 · regresiones de negocio y ZIP verificable. */
import assert from 'node:assert/strict';
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
const B=(await import('../assets/builder-v9-core.js')).default;
const E=(await import('../assets/web-export-v12.js')).default;
const V15=(await import('../assets/page-studio-v15.js')).default;
const M=(await import('../assets/multipage-v14.js')).default;
const Store=(await import('../assets/projects-v13.js')).default;
let n=0;function ok(c,label){assert.ok(c,label);console.log('OK',label);n++;}
const read=p=>fs.readFileSync(p,'utf8');
for(const p of ['assets/page-studio-v15.js','assets/multipage-v14.js','assets/web-export-v12.js','estudio/builder-v12.js','estudio/builder-v12.html','assets/site-runtime-v12.js']){
 ok(fs.existsSync(p),'Existe '+p);if(p.endsWith('.js')){new vm.Script(read(p),{filename:p});ok(true,'Sintaxis de JavaScript '+p);}
}
const cfg={multipage:true,pages:['home','about','services','gallery','contact']};
const photo='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL/nwAAAABJRU5ErkJggg==';
let editor=V15.normalize({});
ok(Object.keys(editor.pages).length===5,'Cinco páginas independientes inicializadas');
ok(editor.media.length===0,'Sin imágenes personales de inicio');
editor=V15.attach(editor,{name:'Mi foto',data:photo});
ok(editor.media.length===1,'La fototeca acepta PNG real');
ok(V15.summary(editor).bytes>50,'Contabiliza bytes de fotografía');
editor.pages.home.headline='Inicio de mi negocio';
editor.pages.about.headline='Nuestra historia propia';
editor.pages.services.headline='Servicios especializados';
editor.pages.gallery.headline='Imágenes con autorización';
editor.pages.contact.headline='Ponte en contacto';
editor.pages.services.sections=['services','faq'];
editor.pages.services.services=['Presupuesto','Diseño','Entrega'];
editor.pages.services.titles.services='Nuestros trabajos reales';
editor.pages.services.image='photo-1';
editor.pages.gallery.image='photo-1';
editor.pages.contact.layout='centered';
const project=E.normalize({...E.defaults('restaurante'),brand:'Prueba <script>alert(1)</script>',formMode:'formsubmit',email:'hola@ejemplo.es',
 sections:['hero','about','services','gallery','contact','form','faq','seo']});
const files=M.generate(project,{...cfg,v15:editor},read('assets/site-runtime-v12.css'),read('assets/site-runtime-v12.js'));
ok(Object.keys(files).includes('PAGINAS-V15.json')&&Object.keys(files).includes('ENTREGA-V15.txt'),'Paquete incluye modelo y documentación V15');
ok(Object.keys(files).some(x=>x.startsWith('assets/v15-photo-')),'Foto propia empaquetada como fichero');
ok(files['index.html'].includes('Inicio de mi negocio')&&!files['index.html'].includes('Nuestra historia propia'),'Inicio independiente de Nosotros');
ok(files['nosotros.html'].includes('Nuestra historia propia')&&!files['nosotros.html'].includes('Servicios especializados'),'Nosotros independiente de Servicios');
ok(files['servicios.html'].includes('Servicios especializados')&&files['servicios.html'].includes('Nuestros trabajos reales'),'Titular y bloque personalizados de Servicios');
ok(files['servicios.html'].includes('Presupuesto')&&files['servicios.html'].includes('id="faq"'),'Servicios y bloques exclusivos de página');
ok(files['contacto.html'].includes('Ponte en contacto')&&files['contacto.html'].includes('layout-centered'),'Contacto independiente con distribución propia');
ok(files['galeria.html'].includes('Imágenes con autorización'),'Galería con titular propio');
ok(files['servicios.html'].includes('assets/v15-photo-photo-1.png'),'Página apunta a archivo local de fotografía');
ok(files['galeria.html'].includes('assets/v15-photo-photo-1.png'),'Foto reutilizada sin crear duplicados');
ok(!files['nosotros.html'].includes('assets/v15-photo-photo-1.png'),'Fotos por página aisladas');
ok(files['contacto.html'].includes('https://formsubmit.co/hola%40ejemplo.es'),'FormSubmit opt-in genera URL de proveedor externo');
ok(files['contacto.html'].includes('name="consentimiento"')&&files['contacto.html'].includes('name="_honey"'),'Consentimiento y honeypot');
ok(files['contacto.html'].includes('data-provider="formsubmit"')&&read('assets/site-runtime-v12.js').includes("form.dataset.provider==='formsubmit'"),'POST externo no es interceptado por mailto');
ok(!files['contacto.html'].includes('<script>alert(1)</script>'),'Marca inyectada se escapa en HTML');
ok(files['contacto.html'].includes('href="servicios.html"'),'Links multipágina relativos');
const old=E.normalize({...project,formMode:'mailto'});
const mail=M.generate(old,{...cfg,v15:editor},read('assets/site-runtime-v12.css'),read('assets/site-runtime-v12.js'));
ok(!mail['contacto.html'].includes('data-provider="formsubmit"'),'Modo mailto permanece disponible sin transmisión');
ok(!mail['contacto.html'].includes('action="https://formsubmit.co/'),'Modo tradicional no expone endpoint');
const zipSet={...files};
for(const name of E.IMAGES)zipSet['assets/'+name]=new Uint8Array(fs.readFileSync('assets/'+name));
const zip=E.buildZip(zipSet),dir=fs.mkdtempSync(path.join(os.tmpdir(),'abel-v15-'));
try{
 const file=path.join(dir,'entrega.zip');fs.writeFileSync(file,zip);
 ok(execFileSync('unzip',['-t',file],{encoding:'utf8'}).includes('No errors detected'),'ZIP completo válido en unzip');
 const extracted=execFileSync('unzip',['-p',file,'servicios.html'],{encoding:'utf8'});
 ok(extracted.includes('Servicios especializados'),'Extracción HTML personalizado real');
 const photoBytes=execFileSync('unzip',['-p',file,'assets/v15-photo-photo-1.png']);
 ok(photoBytes.length>50,'Fotografía PNG incluida como bytes');
}finally{fs.rmSync(dir,{recursive:true,force:true})}
assert.throws(()=>E.buildZip({'../../hack.sh':'x'}));ok(true,'Rechaza path traversal');
assert.throws(()=>V15.attach(editor,{name:'Malicioso',data:'data:image/svg+xml;base64,PHN2Zz4='}));ok(true,'Rechaza SVG ejecutable');
const redacted=Store.safeProject({...project,v14:cfg,v15:editor,phone:'+34600000000',location:'Privado'});
ok(redacted.v15.pages.services.headline==='Servicios especializados','El autoguardado conserva edición independiente');
ok(redacted.v15.media.length===0&&redacted.email===''&&redacted.phone===''&&redacted.location==='','Guardado local sin cifrar excluye fotos y contacto');
const ui=read('estudio/builder-v12.html'),js=read('estudio/builder-v12.js');
for(const id of ['v15-page-editor','v15-form-mode','v15-headline','v15-intro','v15-cta','v15-layout','v15-photo-select','v15-photo-upload','v15-section-list']){
 ok(ui.includes('id="'+id+'"'),'Control visible: '+id);
}
ok(js.includes('function updatePage(')&&js.includes('Pages.attach(')&&js.includes('Multipage.generate(state,{...state.v14,v15:state.v15}'),'Editor conecta motor V15');
ok(js.includes('if(independent)updatePage({titles:')&&js.includes('if(independent)updatePage({[group]:items})'),'Edición directa independiente de títulos y tarjetas');
ok(read('scripts/check-v6.mjs').includes('data.DEMOS.length===25'),'Se mantiene la comprobación de 25 demos');
console.log('V15 Studio Business PRO: '+n+' verificaciones correctas; recepción real FormSubmit no comprobada.');
