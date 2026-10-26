/* AL Studio Digital V12 · herramientas comerciales demostrativas, sin operaciones reales */
(()=>{'use strict';
const $=(selector,root=document)=>root.querySelector(selector),$$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const header=$('.header'),toggle=$('.mobile-toggle');
if(header&&toggle){function close(){header.dataset.menuOpen='false';toggle.setAttribute('aria-expanded','false')}
toggle.addEventListener('click',()=>{const open=header.dataset.menuOpen!=='true';header.dataset.menuOpen=String(open);toggle.setAttribute('aria-expanded',String(open))});
$$('.menu a').forEach(a=>a.addEventListener('click',close));document.addEventListener('keydown',e=>{if(e.key==='Escape')close()})}
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals=$$('.scroll-reveal');
if('IntersectionObserver' in window&&!reduced){const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');observer.unobserve(e.target)}})},{threshold:.08});reveals.forEach(el=>observer.observe(el))}else reveals.forEach(el=>el.classList.add('show'));
// Visor de otras demos, enlazadas a páginas locales del mismo portfolio.
const frame=$('#live-frame'),frameTitle=$('#frame-title'),frameShell=$('#frame-shell');
$$('[data-preview]').forEach(btn=>btn.addEventListener('click',()=>{
$$('[data-preview]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn))});
const link=btn.dataset.preview||'';if(!/^\.\.\/demos\/[a-z0-9-]+\.html$/.test(link))return;
if(frame){frame.src=link;frame.title='Demostración ficticia '+(btn.dataset.title||'web')}if(frameTitle)frameTitle.textContent=btn.dataset.title||'Demostración';
}));
$$('[data-device]').forEach(btn=>btn.addEventListener('click',()=>{
$$('[data-device]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn))});
if(frameShell)frameShell.classList.toggle('mobile',btn.dataset.device==='mobile');
}));
// Demostrador de carta de productos, sin ventas reales, backend, ni pagos.
const filterBtns=$$('[data-category]'),products=$$('[data-product-card]'),basket=$('#basket-list'),basketCount=$('#basket-count'),basketText=$('#basket-text');
let entries=[];
function drawCart(){if(!basket)return;basket.replaceChildren();
for(const [i,item] of entries.entries()){const li=document.createElement('li'),label=document.createElement('span'),remove=document.createElement('button');label.textContent=item;remove.textContent='×';remove.title='Quitar '+item;remove.type='button';remove.addEventListener('click',()=>{entries.splice(i,1);drawCart()});li.append(label,remove);basket.append(li)}
if(basketCount)basketCount.textContent=String(entries.length);if(basketText)basketText.textContent=entries.length?'Selección de ejemplo · no se envía ni se cobra':'Añade productos para preparar una selección ficticia.';
const copy=$('#basket-copy');if(copy)copy.disabled=entries.length===0;}
filterBtns.forEach(btn=>btn.addEventListener('click',()=>{const cat=btn.dataset.category;filterBtns.forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn))});products.forEach(card=>{card.hidden=cat!=='todos'&&card.dataset.productCard!==cat})}));
$$('[data-add]').forEach(btn=>btn.addEventListener('click',()=>{entries.push(btn.dataset.add||'Producto');drawCart()}));
const basketCopy=$('#basket-copy');if(basketCopy)basketCopy.addEventListener('click',async()=>{const text='Selección ilustrativa de catálogo (SIN PEDIDO):\n'+entries.map((x,i)=>`${i+1}. ${x}`).join('\n');try{await navigator.clipboard.writeText(text);basketCopy.textContent='Selección copiada ✓'}catch{basketCopy.textContent='No se ha podido copiar'}});
drawCart();
// Flujo animado: no es una integración ni envía solicitudes.
const flowInfo={hosteleria:[['Nueva consulta','El visitante indica el encargo'],['Aviso interno','Se prepara una notificación de ejemplo'],['Revisión humana','El negocio confirma si puede atenderlo']],peluqueria:[['Solicitud de cita','Se solicita servicio y preferencia'],['Organización','Se clasifica la solicitud'],['Confirmación','El profesional revisa y contesta']],taller:[['Consulta técnica','El cliente describe su necesidad'],['Clasificación','Se prepara el registro de ejemplo'],['Respuesta','El taller responde cuando lo revise']]};
let flowKind='hosteleria',flowToken=0;
function selectFlow(kind){if(!flowInfo[kind])return;flowKind=kind;flowToken++;$$('[data-flow]').forEach(btn=>{btn.classList.toggle('active',btn.dataset.flow===kind);btn.setAttribute('aria-pressed',String(btn.dataset.flow===kind))});$$('.flow .step').forEach((node,i)=>{node.classList.remove('current');const info=flowInfo[kind][i];const title=$('strong',node),desc=$('p',node);if(title)title.textContent=info[0];if(desc)desc.textContent=info[1]});const log=$('#flow-log');if(log)log.textContent='Demostración preparada. Pulsa «Simular el proceso».';const start=$('#flow-start');if(start)start.disabled=false}
$$('[data-flow]').forEach(btn=>btn.addEventListener('click',()=>selectFlow(btn.dataset.flow)));const flowStart=$('#flow-start');
if(flowStart)flowStart.addEventListener('click',()=>{const token=++flowToken,steps=$$('.flow .step'),log=$('#flow-log'),data=flowInfo[flowKind];flowStart.disabled=true;let i=0;if(log)log.textContent='INICIO · Flujo de '+flowKind+' (simulación)\n';steps.forEach(n=>n.classList.remove('current'));
function next(){if(token!==flowToken)return;if(i>=steps.length){if(log)log.textContent+='\n✔ Simulación terminada. No se ha realizado ninguna operación real.';flowStart.disabled=false;return}steps.forEach(n=>n.classList.remove('current'));steps[i].classList.add('current');if(log)log.textContent+=`\nPaso ${i+1}: ${data[i][0]} — ${data[i][1]}`;i++;setTimeout(next,reduced?20:750)}next()});if(flowStart)selectFlow(flowKind);
// Selector de plan para visitantes que quieran comparar opciones.
const needs={presentacion:{plan:'Web esencial',price:'199 €',text:'Adecuada para una página informativa sencilla con datos de contacto. Extras no incluidos.'},productos:{plan:'Web visual + catálogo',price:'349 €',text:'Como referencia, hasta cinco secciones y una galería o catálogo básico.'},avanzada:{plan:'Web premium',price:'499 €',text:'Como punto de partida para catálogos con filtros e interacciones adicionales.'}};
$$('[data-need]').forEach(btn=>btn.addEventListener('click',()=>{const need=needs[btn.dataset.need];if(!need)return;$$('[data-need]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn))});const title=$('#recommended-title'),price=$('#recommended-price'),desc=$('#recommended-desc');if(title)title.textContent=need.plan;if(price)price.textContent=need.price;if(desc)desc.textContent=need.text}));
})();
