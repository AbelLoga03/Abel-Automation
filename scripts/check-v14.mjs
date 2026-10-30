/* V14 Ultimate: pruebas del generador multipágina, preset, proyectos y seguridad. */
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import vm from 'node:vm';
import {execFileSync} from 'node:child_process';import assert from 'node:assert/strict';
const B=(await import('../assets/builder-v9-core.js')).default;
const E=(await import('../assets/web-export-v12.js')).default;
const M=(await import('../assets/multipage-v14.js')).default;
const T=(await import('../assets/templates-v14.js')).default;
const S=(await import('../assets/projects-v13.js')).default;
const X=(await import('../assets/projects-v14.js')).default;
let count=0;const ok=(x,name)=>{assert.ok(x,name);console.log('OK',name);count++};
const file=f=>fs.readFileSync(f,'utf8');
const files=['assets/multipage-v14.js','assets/templates-v14.js','assets/projects-v14.js','estudio/builder-v12.js','estudio/studio-v13.js','scripts/audit-live-v13.mjs','assets/web-export-v12.js'];
for(const name of files){ok(fs.existsSync(name),'Archivo V14 '+name);if(!name.endsWith('.mjs')){new vm.Script(file(name),{filename:name});ok(true,'Sintaxis '+name)}}
ok(T.PRESETS.length===21,'21 combinaciones de plantilla (7 sectores x 3 estilos)');
ok(new Set(T.PRESETS.map(x=>x.id)).size===21,'Identificadores de plantilla únicos');
for(const preset of T.PRESETS){
 const a=T.apply(preset.id);
 ok(a.sector===preset.sector&&a.style===preset.style&&a.layout===preset.layout,'Preset '+preset.id+' con composición diferenciada');
}
assert.throws(()=>T.apply('plantilla-falsa'));ok(true,'Plantillas desconocidas bloqueadas');
const project=E.normalize({...E.defaults('restaurante'),brand:'Casa <Bruma>',headline:'Nuestra carta y equipo',
 email:'contacto@ejemplo.es',sections:['hero','about','services','gallery','products','faq','contact','form','seo']});
const selected=M.normalize({multipage:true,pages:['home','about','services','gallery','contact','other']});
ok(selected.pages.length===5&&!selected.pages.includes('other'),'Se eliminan páginas desconocidas');
ok(M.normalize({multipage:true,pages:['services']}).pages.includes('home'),'Inicio es obligatorio');
const css=file('assets/site-runtime-v12.css'),js=file('assets/site-runtime-v12.js');
const output=M.generate(project,selected,css,js);
for(const page of M.PAGE_DEFS){
 ok(output[page.file].startsWith('<!doctype html>'),'HTML real para '+page.file);
 const html=output[page.file];
 for(const target of M.PAGE_DEFS)ok(html.includes('href="'+target.file+'"'),'Enlaces relativos '+page.file+' → '+target.file);
 ok(html.includes('styles.css')&&html.includes('app.js'),'CSS y JS compartidos en '+page.file);
 ok(!html.includes('https://abelloga03.github.io/Abel-Automation/assets/'),'Sin dependencia del portfolio en '+page.file);
}
ok(output['servicios.html'].includes('id="services"')&&output['nosotros.html'].includes('id="about"'),'Contenido colocado en página correcta');
ok(output['contacto.html'].includes('id="contact"')&&output['galeria.html'].includes('id="gallery"'),'Contacto y galería reales');
ok(output['estructura-v14.json'].includes('"version": 14'),'Configuración multipágina exportada');
ok(!Object.keys(M.generate(project,{multipage:false},css,js)).includes('servicios.html'),'Exportación de página única retrocompatible');
ok(M.makePage(project,selected,'about',true,css,js).includes('contenteditable="true"'),'Edición sobre vista previa multipágina');
assert.throws(()=>M.makePage(project,selected,'evil'));ok(true,'No permite páginas arbitrarias');
const zipfiles={...output};for(const name of E.IMAGES)zipfiles['assets/'+name]=new Uint8Array(fs.readFileSync('assets/'+name));
const zip=E.buildZip(zipfiles),folder=fs.mkdtempSync(path.join(os.tmpdir(),'v14-test-'));
try{
 const target=path.join(folder,'v14.zip');fs.writeFileSync(target,zip);
 ok(execFileSync('unzip',['-t',target],{encoding:'utf8'}).includes('No errors detected'),'ZIP real multipágina pasa unzip -t');
 const list=execFileSync('unzip',['-Z','-1',target],{encoding:'utf8'});
 ok(list.includes('contacto.html')&&list.includes('nosotros.html')&&list.includes('styles.css'),'ZIP incluye todos los archivos');
 const extracted=execFileSync('unzip',['-p',target,'servicios.html'],{encoding:'utf8'});
 ok(extracted.includes('id="services"')&&extracted.includes('href="contacto.html"'),'HTML extraído conectado con páginas');
}finally{fs.rmSync(folder,{recursive:true,force:true})}
assert.throws(()=>E.buildZip({'../hacker.html':'X'}));ok(true,'ZIP prohíbe rutas arbitrarias');
const fake=()=>{const map=new Map();return {getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)}};
const storage=fake(),saved=S.create({...project,v14:selected},'Sitio multipágina',storage);
ok(S.open(saved.id,storage).v14.multipage,'V13 conserva metadatos V14 al guardar');
ok(S.open(saved.id,storage).email===''&&S.open(saved.id,storage).customPhoto==='','Privacidad en localStorage conservada');
ok(X.visible(S.list(storage),{search:'mult',tag:'all'},storage).length===1,'Búsqueda de proyectos');
ok(X.visible(S.list(storage),{search:'no coincide'},storage).length===0,'Búsqueda filtra correctamente');
X.setMeta(saved.id,{tag:'En diseño',favorite:true},storage);
ok(X.get(saved.id,storage).favorite&&X.get(saved.id,storage).tag==='En diseño','Favoritos y etiquetas');
ok(X.visible(S.list(storage),{tag:'En diseño',favorites:true},storage).length===1,'Combinación de filtros');
X.snapshot(saved.id,storage);
S.modify(saved.id,{data:{...project,brand:'Cambio de marca'}},storage);
const restored=X.restore(saved.id,0,storage);
ok(restored.brand===project.brand,'Historial restaurado');
for(let i=0;i<6;i++)X.snapshot(saved.id,storage);
ok(X.get(saved.id,storage).history.length===4,'Historial de versiones limitado');
S.remove(saved.id,storage);X.forget(saved.id,storage);
ok(X.get(saved.id,storage).history.length===0,'Metadatos eliminables');
const editor=file('estudio/builder-v12.js'),html=file('estudio/builder-v12.html'),studio=file('estudio/studio-v13.js'),hub=file('estudio/studio-v13.html');
for(const id of ['v14-template','v14-multipage','v14-pages-list','v14-page-preview','v14-apply-selection'])
 ok(html.includes('id="'+id+'"')&&editor.includes("'"+id+"'"),'Editor V14 conecta '+id);
ok(editor.includes('Multipage.generate(')&&editor.includes('Multipage.makePage('),'Vista y ZIP multipágina integrados');
ok(editor.includes('Templates.apply('),'Plantillas aplicadas al editor');
ok(file('assets/web-export-v12.js').includes('ABEL_V14_SELECT'),'Selección contextual desde iframe');
for(const id of ['v14-search','v14-tag','v14-favorites'])ok(hub.includes('id="'+id+'"')&&studio.includes("'"+id+"'"),'Filtro proyectos '+id);
ok(studio.includes('Ext.snapshot(')&&studio.includes('Ext.restore('),'Versiones de proyectos en UI');
ok(file('index.html').includes('estudio/studio-v13.html')&&file('scripts/check-v6.mjs').includes('data.DEMOS.length===25'),'Portfolio y 25 demos se conservan');
console.log('V14 Ultimate: '+count+' validaciones automatizadas correctas.');
