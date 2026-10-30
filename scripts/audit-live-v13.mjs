/* Auditoría pública real V13: usa HTTP desde GitHub Actions, no simula navegador. */
import assert from 'node:assert/strict';
const root='https://abelloga03.github.io/Abel-Automation/';
const pages=[
 ['','studio-v13','id="studio-v13"'],
 ['estudio/studio-v13.html','projects','id="project-list"'],
 ['estudio/builder-v12.html','builder','id="live-preview"'],
 ['estudio/publicar-v13.html','publishing','id="project-file"'],
 ['novedades.html','news','V13']
];
let errors=0;
for(const [path,label,needle] of pages){
 try{
  const controller=new AbortController();
  const cancel=setTimeout(()=>controller.abort(),15000);
  let response;
  try{response=await fetch(new URL(path,root),{signal:controller.signal,headers:{'cache-control':'no-cache'}});}
  finally{clearTimeout(cancel);}
  const text=await response.text(),passed=response.ok&&text.includes(needle);
  console.log(JSON.stringify({page:label,url:new URL(path,root).href,status:response.status,bytes:text.length,verifiedMarker:passed}));
  if(!passed)errors++;
 }catch(e){errors++;console.error(JSON.stringify({page:label,failed:e.message}));}
}
assert.equal(errors,0,'Una o más páginas públicas V13 no son accesibles o no contienen el contenido publicado');
console.log('Auditoría HTTP pública V13: '+pages.length+' páginas comprobadas. No equivale a una prueba visual ni valida FormSubmit.');
