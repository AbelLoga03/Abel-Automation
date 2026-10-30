/* Read actual Lighthouse outputs; do not invent or conceal failed audits. */
import fs from 'node:fs';import assert from 'node:assert/strict';
for(const name of ['studio','builder']){
 const filename='lighthouse-v15/'+name+'.json';
 assert.ok(fs.existsSync(filename),'Falta el informe '+filename);
 const data=JSON.parse(fs.readFileSync(filename,'utf8'));
 const scores={};
 for(const id of ['performance','accessibility','best-practices','seo']){
  const score=data.categories?.[id]?.score;
  assert.ok(typeof score==='number','No hay puntuación válida '+id+' en '+filename);
  scores[id]=Math.round(score*100);
 }
 console.log(JSON.stringify({name,url:data.finalDisplayedUrl||data.finalUrl,scores,runTimestamp:data.fetchTime}));
}
console.log('Se han leído informes Lighthouse reales. Sus puntuaciones son orientativas y no garantizan calidad legal o accesibilidad total.');
