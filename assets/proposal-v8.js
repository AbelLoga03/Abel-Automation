/* Abel Automation V8 · PDFs locales, sin dependencias. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;root.AbelProposalV8=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const CATALOG={
web:[
['contacto','Página de contacto',99,'Presentación y contacto.'],['landing','Landing page',149,'Página promocional.'],['basica','Web básica',199,'Hasta 3 secciones.'],['profesional','Web profesional',299,'Hasta 5 secciones, formulario.'],['catalogo','Web con catálogo',349,'Hasta 20 fichas sin pago online.'],['restaurante','Web para restaurante',379,'Carta, horarios y consultas.'],['reservas','Web con reservas',449,'Solicitudes sin confirmación automática.'],['premium','Web premium',499,'Hasta 8 secciones y animaciones.'],['tienda','Tienda online básica',599,'Alcance y pagos por definir.',true],['corporativa','Web corporativa avanzada',799,'Integraciones por definir.',true]],
extras:[
['qr-basic','Carta QR básica',49,'Carta digital textual.'],['qr-photos','Carta QR con fotografías',89,'Hasta 20 referencias.'],['qr-interactive','Carta QR interactiva',129,'Categorías y filtros.'],['digital-catalog','Catálogo digital',119,'Hasta 20 fichas.'],['form','Formulario',39,'Envío con servicio autorizado.'],['whatsapp','Botón WhatsApp',19,'Con número autorizado.'],['maps','Google Maps',25,'Mapa público.'],['gallery','Galería fotográfica',49,'Hasta 12 imágenes.'],['booking','Reservas básicas',99,'Solicitudes sin confirmación.'],['seo','SEO inicial',79,'Metadatos y estructura.'],['n8n','Automatización n8n',129,'Flujo simple, infraestructura aparte.',true]],
maintenance:[['none','Sin mantenimiento',0,'Sin servicio periódico.'],['esencial','Esencial',15,'1 cambio pequeño/mes.'],['negocio','Negocio',29,'3 cambios pequeños/mes.'],['profesional','Profesional',49,'5 cambios pequeños/mes.'],['premium','Premium',79,'Alcance por definir.',true]]};
const lookup=(kind,id)=>{const x=CATALOG[kind].find(y=>y[0]===id);return x?{id:x[0],name:x[1],price:x[2],description:x[3],from:!!x[4]}:null;};
const euro=n=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(n);
function normalize(c){
 const base=lookup('web',c.base||'profesional');if(!base)throw Error('Servicio no válido');
 const extras=[...new Set(c.extras||[])].map(id=>lookup('extras',id)).filter(Boolean);
 const maintenance=lookup('maintenance',c.maintenance||'none')||lookup('maintenance','none');
 const gross=base.price+extras.reduce((s,x)=>s+x.price,0),input=Number(c.discount||0);
 const discount=Number.isFinite(input)?Math.min(gross,Math.max(0,Math.round(input*100)/100)):0;
 return {base,extras,maintenance,gross,discount,total:Math.round((gross-discount)*100)/100,from:base.from||extras.some(x=>x.from),
 client:String(c.client||'Cliente por concretar').trim().slice(0,120),company:String(c.company||'').trim().slice(0,120),
 project:String(c.project||'Proyecto web').trim().slice(0,150),date:String(c.date||new Date().toISOString().slice(0,10)).slice(0,10),
 validity:Math.min(90,Math.max(1,Math.floor(Number(c.validity)||15))),scope:String(c.scope||'Alcance sujeto a confirmación.').trim().slice(0,3000),
 notes:String(c.notes||'Entregables, revisiones y calendario a concretar.').trim().slice(0,3000)};
}
function format(c){
 const m=normalize(c);
 return ['ABEL AUTOMATION · PROPUESTA ORIENTATIVA','Cliente: '+m.client+(m.company?' · '+m.company:''),'Proyecto: '+m.project,'Fecha: '+m.date+' · Vigencia orientativa: '+m.validity+' días',
 '','SERVICIOS',m.base.name+': '+(m.base.from?'desde ':'')+euro(m.base.price),
 ...m.extras.map(x=>x.name+': '+(x.from?'desde ':'')+euro(x.price)),
 m.discount?'Descuento: -'+euro(m.discount):'',
 'INVERSIÓN INICIAL: '+(m.from?'DESDE ':'')+euro(m.total),
 'MANTENIMIENTO: '+(m.maintenance.price?(m.maintenance.from?'desde ':'')+euro(m.maintenance.price)+'/mes':'No contratado'),
 '','ALCANCE: '+m.scope,'OBSERVACIONES: '+m.notes,
 'CONDICIONES: Presupuesto no vinculante. IVA, dominio, hosting, servicios y licencias externos se presupuestan por separado. La contratación requiere acuerdo expreso.'].filter(x=>x!=='').join('\n');
}
const special={'€':128,'‚':130,'ƒ':131,'„':132,'…':133,'†':134,'‡':135,'ˆ':136,'‰':137,'Š':138,'‹':139,'Œ':140,'Ž':142,'‘':145,'’':146,'“':147,'”':148,'•':149,'–':150,'—':151,'˜':152,'™':153,'š':154,'›':155,'œ':156,'ž':158,'Ÿ':159};
function winHex(text){let out='';for(const ch of String(text).normalize('NFC')){let n=special[ch]??ch.codePointAt(0);if(n>255)n=63;out+=n.toString(16).padStart(2,'0');}return out;}
function wrap(text,max=83){const out=[];for(const p of String(text).split(/\r?\n/)){if(!p.trim()){out.push('');continue;}let l='';for(const word of p.replace(/\s+/g,' ').split(' ')){if(word.length>max){if(l)out.push(l);l='';for(let i=0;i<word.length;i+=max)out.push(word.slice(i,i+max));continue;}if((l+' '+word).trim().length>max){out.push(l);l=word;}else l+=(l?' ':'')+word;}if(l)out.push(l);}return out;}
function pdfDocument(c){
 const m=normalize(c),lines=[],add=(s,style='body')=>wrap(s,style==='title'?35:style==='heading'?65:style==='total'?58:83).forEach(text=>lines.push({text,style}));
 add('ABEL AUTOMATION','title');add('PROPUESTA DIGITAL · NO VINCULANTE','label');add('');add('PARA','heading');
 add(m.client+(m.company?' · '+m.company:''));add('Proyecto: '+m.project);add('Fecha: '+m.date+'   |   Validez: '+m.validity+' días');
 add('');add('SERVICIOS Y DESGLOSE','heading');
 add(m.base.name+': '+(m.base.from?'desde ':'')+euro(m.base.price));
 m.extras.forEach(x=>add(' + '+x.name+': '+(x.from?'desde ':'')+euro(x.price)));
 if(m.discount)add('Descuento: -'+euro(m.discount));
 add('');add('INVERSIÓN INICIAL '+(m.from?'DESDE ':'')+euro(m.total),'total');
 add('Mantenimiento opcional: '+(m.maintenance.price?(m.maintenance.from?'desde ':'')+euro(m.maintenance.price)+'/mes':'No contratado'),'small');
 add('');add('ALCANCE DEL PROYECTO','heading');add(m.scope);
 add('OBSERVACIONES','heading');add(m.notes);
 add('');add('CONDICIONES','heading');
 add('Importe orientativo no vinculante. IVA, dominio, alojamiento, licencias, herramientas, integraciones no pactadas y servicios externos se presupuestan aparte.','small');
 add('El alcance y condiciones definitivas necesitan aceptación expresa antes del trabajo. Este documento no es una factura ni un contrato.','small');
 add('Abel Automation · Servicios digitales independientes.','small');
 const pages=[[]];let y=720;
 for(const line of lines){const step={title:34,heading:25,total:31,label:20,small:16,body:18}[line.style];if(y-step<73){pages.push([]);y=720;}pages[pages.length-1].push({...line,y});y-=step;}
 const objs=[null],put=s=>(objs.push(s),objs.length-1);
 const catalog=put(''),pagesId=put('');
 const f1=put('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
 const f2=put('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
 const ids=[];
 for(let i=0;i<pages.length;i++){
  let stream='q\n0.07 0.08 0.12 rg\n0 765 595 77 re f\n1.0 0.66 0.48 rg\n45 747 105 5 re f\nQ\n';
  for(const line of pages[i]){
   const font=['title','heading','total'].includes(line.style)?'F2':'F1';
   const size={title:25,heading:12,total:18,label:9,small:9,body:10}[line.style];
   const color=line.style==='total'?'0.67 0.28 0.21':line.style==='heading'?'0.12 0.31 0.34':'0.16 0.20 0.25';
   stream+='BT /'+font+' '+size+' Tf '+color+' rg 1 0 0 1 45 '+line.y+' Tm <'+winHex(line.text)+'> Tj ET\n';
  }
  stream+='BT /F1 8 Tf 0.43 0.45 0.48 rg 1 0 0 1 45 43 Tm <'+winHex('Propuesta orientativa · Página '+(i+1)+' de '+pages.length)+'> Tj ET\n';
  const cId=put('<< /Length '+stream.length+' >>\nstream\n'+stream+'endstream');
  const pId=put('<< /Type /Page /Parent '+pagesId+' 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 '+f1+' 0 R /F2 '+f2+' 0 R >> >> /Contents '+cId+' 0 R >>');
  ids.push(pId);
 }
 objs[catalog]='<< /Type /Catalog /Pages '+pagesId+' 0 R >>';
 objs[pagesId]='<< /Type /Pages /Count '+ids.length+' /Kids ['+ids.map(x=>x+' 0 R').join(' ')+'] >>';
 let s='%PDF-1.4\n%AbelAutomation\n',offset=[0];
 for(let i=1;i<objs.length;i++){offset[i]=s.length;s+=i+' 0 obj\n'+objs[i]+'\nendobj\n';}
 const pos=s.length;s+='xref\n0 '+objs.length+'\n0000000000 65535 f \n';
 for(let i=1;i<objs.length;i++)s+=String(offset[i]).padStart(10,'0')+' 00000 n \n';
 s+='trailer\n<< /Root '+catalog+' 0 R /Size '+objs.length+' >>\nstartxref\n'+pos+'\n%%EOF\n';
 const bytes=new Uint8Array(s.length);for(let i=0;i<s.length;i++)bytes[i]=s.charCodeAt(i)&255;return bytes;
}
return {CATALOG,lookup,normalize,format,pdfDocument,winHex,wrap,euro};
});
