/* Abel Automation V16 — static site preflight; not Lighthouse or a remote deployment. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;root.AbelPreflightV16=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
'use strict';
function inspect(files){
 const names=Object.keys(files||{}),missing=[],warnings=[],metrics={pages:0,images:0,links:0};
 const known=new Set(names),pages=names.filter(n=>/^(?:index|nosotros|servicios|galeria|contacto)\.html$/.test(n));
 if(!known.has('index.html'))missing.push('Falta index.html');
 for(const file of ['styles.css','app.js'])if(!known.has(file))missing.push('Falta '+file);
 for(const filename of pages){
  metrics.pages++;const html=files[filename];
  if(typeof html!=='string'){missing.push('No es HTML: '+filename);continue;}
  for(const [needle,what]of [['<title>','Título'],['name="description"','Descripción SEO'],['name="viewport"','Viewport'],['<main','Contenido principal']]){
   if(!html.includes(needle))warnings.push(filename+': falta '+what);
  }
  for(const m of html.matchAll(/\b(?:src|href)="([^"]*)"/g)){
   let target=m[1];if(!target||target.startsWith('#')){if(target.startsWith('#')&&!html.includes('id="'+target.slice(1)+'"'))warnings.push(filename+': ancla local sin destino '+target);continue;}
   if(/^(?:https?:|mailto:|tel:|data:)/i.test(target))continue;
   if(/^[a-z][a-z0-9+.-]*:/i.test(target)||target.startsWith('/')||target.includes('..')){missing.push(filename+': ruta insegura '+target.slice(0,100));continue;}
   metrics.links++;
   const [pathname,hash]=target.split('#'),clean=pathname.split('?')[0];
   if(!known.has(clean)){missing.push(filename+': recurso inexistente '+clean);continue;}
   if(hash&&/\.html$/.test(clean)&&!files[clean].includes('id="'+hash+'"'))warnings.push(filename+': ancla no encontrada en '+target);
  }
  if(/<img\b(?![^>]*\balt=)/i.test(html))warnings.push(filename+': imagen sin texto alternativo');
 }
 metrics.images=names.filter(n=>/^assets\/.*\.(?:png|jpg|webp)$/.test(n)).length;
 return {passed:missing.length===0,errors:[...new Set(missing)],warnings:[...new Set(warnings)],metrics};
}
function report(result){
 const r=result||{passed:false,errors:['No se recibió auditoría'],warnings:[],metrics:{}};
 return ['ABEL AUTOMATION V16 · REVISIÓN AUTOMÁTICA DE ZIP',
  'Resultado de integridad estática: '+(r.passed?'CORRECTO':'ERRORES'),
  'Páginas: '+(r.metrics.pages||0)+' | Imágenes: '+(r.metrics.images||0)+' | Enlaces internos: '+(r.metrics.links||0),
  '',...r.errors.map(x=>'ERROR: '+x),...r.warnings.map(x=>'AVISO: '+x),
  '','Estas pruebas verifican rutas/HTML locales. NO sustituyen Playwright, Lighthouse, RGPD, accesibilidad manual, autorización ni recepción real de formularios.',
  'El ZIP no publica ningún sitio ni autentica aprobaciones.'
 ].join('\n');
}
return {inspect,report};
});
