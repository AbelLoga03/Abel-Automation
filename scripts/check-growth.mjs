import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html'),growth=read('assets/growth-v7.js'),css=read('assets/growth-v7.css'),original=read('assets/v6-pro.js');
let count=0;
const check=(ok,label)=>{if(!ok)throw Error('FAIL: '+label);count++;console.log('OK  '+label);};
for(const p of ['assets/growth-v7.css','assets/growth-v7.js','index-v14.html','scripts/check-v6.mjs'])check(fs.existsSync(path.join(root,p)),'Archivo '+p);
for(const file of ['assets/growth-v7.js','assets/v6-pro.js']){new vm.Script(read(file),{filename:file});check(true,'JavaScript válido '+file);}
for(const id of ['estudio','studio-site','studio-sector-options','studio-style-options','studio-device-tabs','studio-budget','studio-lead','studio-total','contact-send','contact-draft-button'])check(html.includes('id="'+id+'"'),'Elemento '+id);
check(html.includes('href="assets/growth-v7.css"')&&html.includes('src="assets/growth-v7.js"'),'CSS y JS Growth cargados');
check(html.includes('method="POST" action="https://formsubmit.co/'),'Formulario con transporte FormSubmit configurado');
check(html.includes('name="email"')&&html.includes('name="message"')&&html.includes('name="sector"'),'Campos contacto enviados con nombres correctos');
check(html.includes('name="_honey"')&&html.includes('name="_subject"'),'Honeypot y asunto');
check(html.includes('id="contact-send"')&&html.includes('type="button" id="contact-send"'),'Envio no es submit implícito');
check(html.includes('name="privacidad_aceptada"')&&html.includes('privacidad.html'),'Privacidad explícita');
check(original.includes("HTMLFormElement.prototype.submit.call(form)")&&original.includes("el('contact-consent').checked"),'Envío se solicita por click con consentimiento');
check(css.includes('prefers-reduced-motion')&&css.includes('max-width:530px'),'Responsive y movimiento reducido');
check(html.includes('aria-live="polite"')&&html.includes('aria-pressed='),'Accesibilidad interactiva');
const start=original.indexOf('const PRICE_DATA='),end=original.indexOf('\nconst DEMOS=');
const PRICE_DATA=vm.runInNewContext(original.slice(start,end)+';\nPRICE_DATA');
const made=new Map();const listeners=new Map();
function fake(id){
 if(made.has(id))return made.get(id);
 const item={
  id, value:'',textContent:'',innerHTML:'',checked:false,dataset:{},
  attrs:{},style:{backgroundImage:'',props:{},setProperty(k,v){this.props[k]=v;}},
  classList:{list:new Set(),toggle(cls,on){if(on)this.list.add(cls);else this.list.delete(cls);},contains(cls){return this.list.has(cls);}},
  addEventListener(type,fn){let ls=listeners.get(id+'|'+type)||[];ls.push(fn);listeners.set(id+'|'+type,ls);},
  setAttribute(key,v){this.attrs[key]=v;},
  dispatchEvent(e){for(const fn of listeners.get(id+'|'+e.type)||[])fn({type:e.type,target:item});},
  click(){item.dispatchEvent({type:'click'});},scrollIntoView(){item.didScroll=true;},focus(){item.didFocus=true;},
  querySelectorAll(selector){if(selector==='[data-select]')return groups[id]||[];if(selector==='input[type=checkbox]')return inputs;return [];}
 };
 made.set(id,item);return item;
}
const mk=(id,dataset)=>{const e=fake(id);e.dataset=dataset;return e;};
const sectorNames=['hosteleria','comercio','servicios','belleza','turismo','otros'];
const styleNames=['editorial','bold','minimal'],deviceNames=['desktop','mobile'];
const sectors=sectorNames.map(s=>mk('sector-'+s,{select:s,studioSector:s}));
const styles=styleNames.map(s=>mk('style-'+s,{select:s,studioStyle:s}));
const devices=deviceNames.map(s=>mk('device-'+s,{select:s,studioDevice:s}));
const featureNames=['whatsapp','gallery','form','seo','qr-interactive','n8n'];
const features=featureNames.map(s=>{const e=mk('feature-'+s,{});e.value=s;e.checked=s==='whatsapp';return e;});
const inputs=featureNames.map(s=>{const e=mk('input-'+s,{});e.value=s;return e;});
const groups={'studio-sector-options':sectors,'studio-style-options':styles,'studio-device-tabs':devices};
const document={
 getElementById(id){return fake(id);},
 querySelectorAll(selector){if(selector==='[data-studio-sector]')return sectors;if(selector==='[data-studio-style]')return styles;if(selector==='[data-studio-device]')return devices;if(selector==='[data-studio-feature]')return features;return [];},
 addEventListener(name,fn){if(name==='DOMContentLoaded')this.start=fn;}
};
const window={matchMedia(){return {matches:true};}};
const Event=class{constructor(type,opts){this.type=type;this.bubbles=!!opts?.bubbles;}};
const ctx={document,window,Event,Intl,PRICE_DATA};
vm.runInNewContext(growth,ctx,{filename:'assets/growth-v7.js'});document.start();
check(fake('studio-total').textContent==='398 €'||fake('studio-total').textContent==='398 €','Restaurante 379 € + WhatsApp 19 € = 398 €');
sectors[1].click();
check(fake('studio-total').textContent.includes('368'),'Comercio 349 € + WhatsApp 19 € = 368 €');
features[5].checked=true;features[5].dispatchEvent({type:'change'});
check(fake('studio-total').textContent.includes('497'),'Añadir automatización 129 € = 497 €');
styles[1].click();
check(fake('studio-site').dataset.style==='bold'&&fake('studio-site').style.props['--site-accent']==='#ffca8e','Cambio visual Impacto');
devices[1].click();check(fake('studio-preview').classList.contains('mobile'),'Vista móvil');
fake('studio-budget').click();
check(fake('budget-base').value==='catalogo','Traspaso de sector al presupuestador');
check(inputs.find(x=>x.value==='whatsapp').checked&&inputs.find(x=>x.value==='n8n').checked,'Traspaso de extras seleccionados');
check(!inputs.find(x=>x.value==='seo').checked,'Extras no marcados sin añadir');
fake('studio-lead').click();
check(fake('client-sector').value==='Comercio / tienda','Sector en el contacto');
check(fake('client-message').value.includes('497'),'Descripción y estimación en contacto');
check(fake('client-name').didFocus===true,'Enlace al formulario y foco');
check(!html.includes('clientes satisfechos')&&!html.includes('ventas garantizadas'),'Sin pruebas sociales ni ganancias inventadas');
console.log('Growth Studio: '+count+' verificaciones superadas.');
