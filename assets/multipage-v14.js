/* V14 multipágina: genera páginas HTML independientes con navegación relativa y assets compartidos. */
(function(root,factory){const api=factory(root.AbelWebExportV12);if(typeof module!=='undefined'&&module.exports)module.exports=api;root.AbelMultipageV14=api;})(typeof globalThis!=='undefined'?globalThis:this,E=>{
'use strict';
const PAGE_DEFS=[
 {id:'home',file:'index.html',name:'Inicio',sections:['faq','testimonials','booking','qr','automation']},
 {id:'about',file:'nosotros.html',name:'Nosotros',sections:['about']},
 {id:'services',file:'servicios.html',name:'Servicios',sections:['services','products']},
 {id:'gallery',file:'galeria.html',name:'Galería',sections:['gallery']},
 {id:'contact',file:'contacto.html',name:'Contacto',sections:['contact','form','whatsapp','map']}
];
const lookup=Object.fromEntries(PAGE_DEFS.map(p=>[p.id,p]));
const SECTION_OWNER=Object.fromEntries(PAGE_DEFS.flatMap(p=>p.sections.map(id=>[id,p.id])));
function normalize(config){
 const raw=config&&typeof config==='object'?config:{};
 const pages=Array.isArray(raw.pages)?[...new Set(raw.pages.filter(x=>Object.hasOwn(lookup,x)))]:PAGE_DEFS.map(x=>x.id);
 if(!pages.includes('home'))pages.unshift('home');
 return {multipage:raw.multipage===true,pages:PAGE_DEFS.map(x=>x.id).filter(x=>pages.includes(x))};
}
function links(config,active){
 const cfg=normalize(config);
 return cfg.pages.map(id=>{
  const page=lookup[id];return '<a '+(id===active?'aria-current="page" ':'')+'href="'+page.file+'">'+page.name+'</a>';
 }).join('');
}
function makePage(project,config,pageId,preview=false,css="",js=""){
 const cfg=normalize(config);
 if(!cfg.pages.includes(pageId))throw Error('Página no seleccionada');
 const base=E.normalize(project),page=lookup[pageId];
 const chosen=page.sections.filter(id=>base.sections.includes(id));
 // El apartado no queda vacío cuando la plantilla original omitía su sección base.
 const required={about:'about',services:'services',gallery:'gallery',contact:'contact'}[pageId];
 if(required&&!chosen.includes(required))chosen.unshift(required);
 const scoped=pageId==='home'?{...base,sections:['hero',...chosen]}:{
  ...base,sections:['hero',...chosen],headline:page.name+' · '+base.brand,
  intro:pageId==='contact'?'Puedes comunicarte mediante los canales configurados para este proyecto.':
  'Descubre '+page.name.toLowerCase()+' de '+base.brand+'.'
 };
 let html=E.htmlText(scoped,preview,css,js);
 const marker=/<nav id="links" class="links" aria-label="Navegación">[\s\S]*?<\/nav>/;
 if(!marker.test(html))throw Error('No se encontró navegación del motor V12');
 html=html.replace(marker,'<nav id="links" class="links" aria-label="Navegación principal">'+links(cfg,pageId)+'</nav>');
 // Reparar enlaces a secciones que estén en otras páginas.
 html=html.replace(/href="#(about|services|products|gallery|contact|form|whatsapp|map|faq|testimonials|booking|qr|automation)"/g,(full,id)=>{
  const owner=SECTION_OWNER[id],target=cfg.pages.includes(owner)?lookup[owner].file:'index.html';
  return 'href="'+target+'#'+id+'"';
 });
 // En cada portada, el enlace de marca lleva al inicio de la web multipágina.
 html=html.replace('href="#inicio" class="brand"','href="index.html" class="brand"');
 // Cambiar CTA de subpáginas a un enlace válido al contacto.
 if(pageId!=='home')html=html.replace(/(<a class="action" href=")[^"]+(")/,(_,a,b)=>a+(cfg.pages.includes('contact')?'contacto.html#contact':'index.html')+b);
 const description=base.intro;
 // Meta description por página, sin crear datos externos ni dominios ficticios.
 html=html.replace(/<title>[\s\S]*?<\/title>/,'<title>'+E.normalize({...base,brand:page.name+' | '+base.brand}).brand.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</title>');
 return html;
}
function generate(project,config,css,js){
 const cfg=normalize(config),p=E.normalize(project),files=E.filesForProject(p,css,js);
 if(!cfg.multipage)return files;
 for(const id of cfg.pages)files[lookup[id].file]=makePage(p,cfg,id);
 files['estructura-v14.json']=JSON.stringify({version:14,layout:'multipage',pages:cfg.pages,project:p},null,2);
 files['ENTREGA-V14.txt']=[
  'ABEL AUTOMATION · WEB MULTIPÁGINA V14','',
  'Abre index.html. Páginas creadas: '+cfg.pages.map(id=>lookup[id].file).join(', '),
  'Archivos CSS y JS compartidos; enlaces relativos, sin rutas absolutas al portfolio.',
  'La galería funciona localmente. Los formularios abren el correo del visitante; no envían sin confirmación.',
  'Revisa enlaces, fotografías, privacidad, accesibilidad y contenido en un navegador antes de publicar.',
  'Este ZIP no incluye un servidor ni realiza despliegues automáticos.',
  'estructura-v14.json describe las páginas, configuracion-v12.json conserva el proyecto base.'
 ].join('\n');
 return files;
}
return {PAGE_DEFS,normalize,makePage,generate};
});
