import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import assert from 'node:assert/strict';
const read=p=>fs.readFileSync(path.resolve(p),'utf8');
let passed=0;
function verify(ok,label){assert.ok(ok,label);console.log('OK ',label);passed++;}
const P=(await import('../assets/proposal-v8.js')).default;
verify(!!P,'Motor de propuestas cargado');
for(const f of ['herramientas/propuestas-v8.html','herramientas/propuestas-v8.js','assets/proposal-v8.js','sectores/sectores-v8.css',
 ...['restaurantes','peluquerias','talleres','comercios','alojamientos'].map(x=>'sectores/'+x+'.html')])verify(fs.existsSync(f),'Archivo '+f);
new vm.Script(read('herramientas/propuestas-v8.js'));verify(true,'JS del editor compila');
const v6=read('assets/v6-pro.js');
const beforeBoot=v6.slice(0,v6.lastIndexOf("document.addEventListener('DOMContentLoaded'"));
const old=vm.runInNewContext(beforeBoot+'\nPRICE_DATA', {Intl,Date});
for(const name of ['web','extras','maintenance']){
 const oldList=old[name],newList=P.CATALOG[name];
 verify(oldList.length===newList.length,'Misma longitud de catálogo '+name);
 for(let i=0;i<newList.length;i++){
  const [id,title,price,desc,from]=newList[i],v=oldList[i];
  verify(v.id===id&&v.price===price&&!!v.desde===!!from,'Precio sincronizado '+name+' '+id);
 }
}
const base=P.normalize({base:'profesional',extras:['whatsapp','seo','whatsapp'],maintenance:'negocio',discount:20});
verify(base.gross===397&&base.discount===20&&base.total===377,'397 menos 20 = 377, sin duplicar extras');
verify(base.maintenance.price===29&&base.total===377,'Mantenimiento fuera del total inicial');
verify(P.normalize({base:'contacto',discount:9999}).total===0,'Descuento acotado a importe bruto');
verify(P.normalize({base:'tienda',extras:['n8n']}).from===true,'Precio desde señalado como orientativo');
verify(P.winHex('Málaga, año 2026 · 99 €').includes('80'),'Euro y acentos WinAnsi');
let buf=Buffer.from(P.pdfDocument({base:'profesional',extras:['gallery'],client:'Clínica El Álamo',scope:'Web con información en español, presupuesto de 348 €.'}));
verify(buf.subarray(0,8).toString('latin1')==='%PDF-1.4','PDF generado con cabecera 1.4');
verify(buf.toString('latin1').includes('/Type /Catalog')&&buf.toString('latin1').includes('/Type /Pages'),'Estructura del PDF');
verify(buf.toString('latin1').includes('/WinAnsiEncoding')&&buf.toString('latin1').includes('startxref'),'Fuentes y referencias PDF');
const pageMatch=buf.toString('latin1').match(/\/Type \/Pages \/Count (\d+)/);
verify(pageMatch&&Number(pageMatch[1])>=1,'Conteo de páginas PDF');
function verifyOffsets(buffer){
 const s=buffer.toString('latin1');
 const xref=Number(s.match(/startxref\n(\d+)\n%%EOF/)[1]);assert.equal(s.slice(xref,xref+4),'xref');
 const arr=s.slice(xref).split('\n');const count=Number(arr[1].split(' ')[1]);let found=0;
 for(let i=3;i<3+count-1;i++){
  const off=Number(arr[i].slice(0,10));
  if(off>0&&s.slice(off).startsWith((i-2)+' 0 obj'))found++;
 }
 return found===count-1;
}
verify(verifyOffsets(buf),'Offsets xref coherentes con objetos PDF');
const long=P.pdfDocument({base:'premium',scope:'Texto largo para validar paginación. '.repeat(170),notes:'Condiciones del proyecto. '.repeat(115)});
verify(Number(Buffer.from(long).toString('latin1').match(/\/Type \/Pages \/Count (\d+)/)[1])>1,'PDF multipágina con textos largos');
verify(verifyOffsets(Buffer.from(long)),'Offsets PDF multipágina correctos');
fs.writeFileSync('/tmp/abel-automation-v8-qa.pdf',buf); // PDF de prueba con datos FICTICIOS
const main=read('index.html'),css=read('assets/growth-v7.css'),crm=read('herramientas/crm.html'),site=read('sitemap.xml');
verify(main.includes('id="sectores"')&&main.includes('id="budget-proposal"'),'Portada enlaza sectores y PDF');
verify(v6.includes("new URLSearchParams({base:state.base,maintenance:state.maintenance})"),'Presupuestador V6 transmite selección');
verify(main.includes('herramientas/crm.html')&&main.includes('herramientas/propuestas-v8.html'),'Acceso a herramientas V8');
verify(css.includes('.sector-grid')&&css.includes('@media(max-width:470px)'),'Estilos adaptables de V8');
verify(crm.includes("KEY='alstudio-v10-crm-v1'"),'Identificador de datos CRM previo intacto');
verify(crm.includes("PBKDF2")&&crm.includes("AES-GCM")&&crm.includes('crypto.subtle'),'Cifrado del CRM mantenido');
verify(crm.includes('id="estimate"')&&crm.includes("estimate:Math.min("),'Campo de oportunidad integrado');
verify(crm.includes("pipeline-value")&&crm.includes("Volumen orientativo"),'Valor del pipeline marcado como orientativo');
const inline=[...crm.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(Boolean);
inline.forEach(src=>new vm.Script(src));verify(true,'Scripts de CRM compilan');
for(const sec of ['restaurantes','peluquerias','talleres','comercios','alojamientos']){
 const file='sectores/'+sec+'.html',html=read(file);
 verify(site.includes('/sectores/'+sec+'.html'),'Sitemap indexa '+sec);
 verify(html.includes('rel="canonical"')&&html.includes('name="description"')&&html.includes('lang="es"'),'SEO sector '+sec);
 verify(html.includes('DEMO')&&html.includes('herramientas/propuestas-v8.html'),'Propuesta y demo sector '+sec);
 for(const match of html.matchAll(/<(?:a|img|link)\b[^>]*\b(?:href|src)="([^"]+)"/g)){
  const u=match[1];if(/^(https?:|#|mailto:)/.test(u))continue;
  const local=path.resolve(path.dirname(file),u.split(/[?#]/)[0]);
  verify(fs.existsSync(local),'Ruta sector '+sec+' → '+u.slice(0,55));
 }
}
console.log('V8: '+passed+' verificaciones superadas.');
