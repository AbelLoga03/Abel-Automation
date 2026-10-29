/* V13 — QA de biblioteca local, editor UX, imágenes por sección y asistente de publicación */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const E=(await import('../assets/web-export-v12.js')).default;
const B=(await import('../assets/builder-v9-core.js')).default;
const S=(await import('../assets/projects-v13.js')).default;
const A=(await import('../assets/publish-v13.js')).default;
const txt=p=>fs.readFileSync(p,'utf8');
let counter=0;const ok=(v,name)=>{assert.ok(v,name);console.log('OK '+name);counter++};
const files=['estudio/studio-v13.html','estudio/studio-v13.css','estudio/studio-v13.js','estudio/publicar-v13.html','assets/projects-v13.js','assets/publish-v13.js','estudio/builder-v12.js','assets/web-export-v12.js'];
for(const f of files)ok(fs.existsSync(f),'Archivo V13: '+f);
for(const f of ['estudio/studio-v13.js','estudio/builder-v12.js','assets/projects-v13.js','assets/publish-v13.js','assets/web-export-v12.js']){
 new vm.Script(txt(f),{filename:f});ok(true,'Sintaxis JS: '+f);
}
const fake=()=>{const values=new Map();return {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)}};
const storage=fake();
ok(S.MAX===12,'Límite de doce proyectos locales');
ok(S.list(storage).length===0,'Biblioteca vacía inicialmente');
const original=E.normalize({...E.defaults('restaurante'),brand:'Prueba de tienda',email:'cliente@ejemplo.es',phone:'+34600111222',location:'Calle de ejemplo',customPhoto:'data:image/png;base64,iVBORw0KGgo='});
const first=S.create(original,'Prueba local',storage);
ok(S.list(storage).length===1,'Guardado de proyecto funciona');
ok(!S.list(storage)[0].data.email&&!S.list(storage)[0].data.phone&&!S.list(storage)[0].data.location&&!S.list(storage)[0].data.customPhoto,'Sin contacto ni fotografía en almacenamiento sin cifrar');
ok(S.open(first.id,storage)?.brand==='Prueba de tienda','Apertura restaura el nombre');
ok(S.saveDraft(original,storage),'Autoguardado válido');
ok(S.draft(storage)?.brand==='Prueba de tienda','Borrador recuperable');
ok(!S.draft(storage)?.email&&!S.draft(storage)?.customPhoto,'El borrador tampoco conserva datos sensibles');
ok(S.clearDraft(storage)&&S.draft(storage)===null,'Limpieza de autoguardado');
const copy=S.duplicate(first.id,storage);
ok(copy.id!==first.id&&S.list(storage).length===2,'Duplicación con nuevo ID');
S.modify(copy.id,{name:'Segundo proyecto'},storage);
ok(S.list(storage)[0].name==='Segundo proyecto','Renombrar proyecto');
ok(S.remove(copy.id,storage)&&S.list(storage).length===1,'Eliminación explícita');
const fakeCorrupted=fake();fakeCorrupted.setItem(S.KEY,'not-json');
ok(S.list(fakeCorrupted).length===0,'Almacenamiento corrupto no rompe la UI');
const images=E.IMAGES;
let project=E.normalize({...E.defaults('comercio'),sections:['hero','about','services','products','gallery','contact'],sectionImages:{about:images[1],services:images[2],products:images[3],gallery:images[4],xss:'evil.svg'},
 services:['Compra','Asesoría','Arreglos','Pedidos','Entrega','Otros'],products:['Uno','Dos','Tres','Cuatro']});
ok(project.services.length===6&&project.products.length===4,'Duplicación de tarjetas hasta seis');
ok(project.sectionImages.about===images[1]&&!(project.sectionImages).xss,'Fotos por sección validadas');
const rendered=E.htmlText(project);
ok(rendered.includes('assets/'+images[1])&&rendered.includes('assets/'+images[4]),'Imágenes individuales incluidas en HTML exportado');
ok(rendered.includes('Otros')&&rendered.includes('Cuatro'),'Tarjetas duplicadas aparecen exportadas');
ok(!rendered.includes('evil.svg'),'Archivos de imágenes no permitidos rechazados');
const saved=E.importProject(E.projectJson(project));
ok(saved.sectionImages.gallery===images[4]&&saved.services.length===6,'JSON conserva imágenes por sección y tarjetas añadidas');
const builder=txt('estudio/builder-v12.js'),builderHTML=txt('estudio/builder-v12.html'),builderCSS=txt('estudio/builder-v12.css'),hubHTML=txt('estudio/studio-v13.html'),hubJS=txt('estudio/studio-v13.js');
for(const id of ['undo','redo','autosave-status','save-project'])ok(builderHTML.includes('id="'+id+'"'),'Control editor '+id);
ok(builder.includes('function stepHistory(')&&builder.includes('function remember(')&&builder.includes("stepHistory(past,future)")&&builder.includes("stepHistory(future,past)"),'Deshacer y rehacer conectados');
ok(builder.includes("row.addEventListener('dragstart'")&&builder.includes("row.addEventListener('drop'"),'Arrastrar y soltar bloques');
ok(builder.includes("'Duplicar tarjeta de '")&&builder.includes("'Quitar última tarjeta de '"),'Duplicar/quitar tarjetas desde editor');
ok(builder.includes('sectionImages:{...state.sectionImages')&&builderCSS.includes('.v13-photo-block'),'Selector de imagen por bloque');
ok(builder.includes('Store.saveDraft(state)')&&builder.includes('Store.create(state,state.brand)'),'Autoguardado y guardado de proyectos implementados');
ok(builder.includes("sessionStorage.removeItem('abel-v13-open-project')"),'El editor consume sesión de proyecto');
ok(hubJS.includes('Store.duplicate(')&&hubJS.includes('Store.modify(')&&hubJS.includes('Store.remove('),'Biblioteca permite duplicar/renombrar/eliminar');
ok(hubJS.includes('Store.open(')&&hubJS.includes('Store.draft('),'Biblioteca permite abrir y recuperar');
ok(hubHTML.includes('href="builder-v12.html?new=1"')&&hubHTML.includes('href="publicar-v13.html"'),'Inicio claro y prepublicación accesible');
ok(hubHTML.includes('25 demos')&&hubHTML.includes('CRM cifrado'),'Accesos a demos y CRM visibles');
ok(hubHTML.includes('correo, teléfono, dirección y fotos subidas'),'Privacidad del autoguardado explicada');
const publish=txt('estudio/publicar-v13.html');
ok(publish.includes('noindex,nofollow'),'Guía interna no indexada');
ok(publish.includes('type="file"')&&publish.includes('E.importProject(await file.text())'),'Auditoría de JSON ejecutada localmente');
ok(publish.includes('no publica')||publish.includes('no realiza cambios'),'No finge subir proyectos al servidor');
const issues=A.audit(E.defaults('restaurante'));
ok(issues.canPublishAutomatically===false&&issues.criticalPending>0,'No existe publicación automática y se identifican puntos críticos');
ok(issues.issues.some(x=>x.id==='images'&&!x.ok)&&issues.issues.some(x=>x.id==='legal'&&!x.ok),'Derechos y privacidad requieren revisión humana');
ok(A.report(E.defaults()).includes('No se publica automáticamente')||A.report(E.defaults()).includes('Ningún sitio se publica automáticamente'),'Informe impide afirmar despliegue');
const home=txt('index.html'),news=txt('novedades.html'),sitemap=txt('sitemap.xml');
ok(home.includes('id="studio-v13"')&&home.includes('href="estudio/studio-v13.html"'),'Sección Studio V13 destacada en portada');
ok(home.includes('id="novedades-v12"'),'Novedades antiguas preservadas');
ok(news.includes('V13')&&news.includes('V12')&&news.includes('V11')&&news.includes('V10'),'Historial de novedades visible');
ok(sitemap.includes('/estudio/studio-v13.html')&&!sitemap.includes('/estudio/publicar-v13.html'),'Sitemap solo indexa panel público');
for(const file of ['estudio/studio-v13.html','estudio/publicar-v13.html']){
 const doc=txt(file);
 for(const match of doc.matchAll(/<(?:a|script|link)\b[^>]*?\b(?:href|src)="([^"]+)"/g)){
  const raw=match[1];
  if(/^(?:https?:|mailto:|tel:|#)/.test(raw))continue;
  const target=path.resolve(path.dirname(file),raw.split(/[?#]/)[0]);
  ok(fs.existsSync(target),'Ruta válida: '+file+' → '+raw);
 }
}
ok(txt('scripts/check-v6.mjs').includes('data.DEMOS.length===25'),'Prueba de preservación de 25 demos sin cambios');
console.log('V13 Studio: '+counter+' comprobaciones correctas.');
