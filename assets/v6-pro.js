/* Abel Automation V6 PRO — sin frameworks ni recopilación automática de datos */
'use strict';
const PRICE_DATA={
 web:[
  {id:'contacto',name:'Página de contacto',price:99,limit:'1 página con contacto y datos básicos; 1 revisión.'},
  {id:'landing',name:'Landing page',price:149,limit:'Página promocional, una llamada a la acción; 1 revisión.'},
  {id:'basica',name:'Web básica',price:199,limit:'Hasta 3 secciones, responsive; 1 revisión.'},
  {id:'profesional',name:'Web profesional',price:299,limit:'Hasta 5 secciones, formulario simple; 2 revisiones.'},
  {id:'catalogo',name:'Web con catálogo',price:349,limit:'Hasta 20 referencias, catálogo sin pagos; 2 revisiones.'},
  {id:'restaurante',name:'Web para restaurantes',price:379,limit:'Horarios, información y carta sencilla de hasta 20 platos; 2 revisiones.'},
  {id:'reservas',name:'Web con reservas',price:449,limit:'Solicitud de cita sin confirmación automática; 2 revisiones.'},
  {id:'premium',name:'Web premium',price:499,limit:'Diseño personalizado, hasta 8 secciones; 3 revisiones.'},
  {id:'tienda',name:'Tienda online básica',price:599,desde:true,limit:'Desde 599 €: catálogo y alcance a definir; pagos, comisiones e integraciones se valoran aparte.'},
  {id:'corporativa',name:'Web corporativa avanzada',price:799,desde:true,limit:'Desde 799 €: estructura avanzada por concretar, sin integraciones complejas incluidas.'}
 ],
 extras:[
  {id:'qr-basic',name:'Carta QR básica',price:49,limit:'Carta digital textual.'},
  {id:'qr-photos',name:'Carta QR con fotografías',price:89,limit:'Hasta 20 referencias con fotografías facilitadas.'},
  {id:'qr-interactive',name:'Carta QR interactiva',price:129,limit:'Categorías y filtros sencillos.'},
  {id:'digital-catalog',name:'Catálogo digital',price:119,limit:'Hasta 20 fichas, sin venta online.'},
  {id:'form',name:'Formulario',price:39,limit:'Formulario básico; envío sujeto a proveedor o backend.'},
  {id:'whatsapp',name:'Botón WhatsApp',price:19,limit:'Acceso directo a un número autorizado.'},
  {id:'maps',name:'Google Maps',price:25,limit:'Integración de mapa público sin funcionalidades premium.'},
  {id:'gallery',name:'Galería fotográfica',price:49,limit:'Hasta 12 fotos proporcionadas.'},
  {id:'booking',name:'Reservas básicas',price:99,limit:'Formulario de solicitud, sin confirmación automática.'},
  {id:'seo',name:'SEO inicial',price:79,limit:'Metadatos, encabezados y estructura básica.'},
  {id:'n8n',name:'Automatizaciones n8n',price:129,desde:true,limit:'Desde 129 €: flujo simple; infraestructura, API y cuotas externas no incluidas.'}
 ],
 maintenance:[
  {id:'none',name:'Sin mantenimiento',price:0,limit:'El servicio se entrega sin asistencia periódica contratada.'},
  {id:'esencial',name:'Esencial',price:15,limit:'Hasta 1 modificación pequeña/mes; sin nuevas secciones.'},
  {id:'negocio',name:'Negocio',price:29,limit:'Hasta 3 modificaciones pequeñas/mes.'},
  {id:'profesional',name:'Profesional',price:49,limit:'Hasta 5 cambios pequeños/mes, revisión básica.'},
  {id:'premium',name:'Premium',price:79,desde:true,limit:'Desde 79 €/mes; alcance y soporte por definir.'}
 ],
 bundles:{
  local:{label:'Presencia Local',base:'basica',extras:['whatsapp','maps'],price:239},
  restaurante:{label:'Carta y Negocio',base:'restaurante',extras:['qr-basic','whatsapp'],price:409},
  empresa:{label:'Negocio Plus',base:'profesional',extras:['form','seo'],price:389}
 }
};
const DEMOS=[
 ['Pastelería artesanal','pasteleria','Hostelería','portfolio-pasteleria.webp','Una experiencia dulce con catálogo visual.'],
 ['Joyería boutique','joyeria','Comercio','portfolio-joyeria.webp','Piezas con una presentación elegante.'],
 ['Taller mecánico','taller','Servicios','portfolio-taller.webp','Servicios y solicitudes de cita.'],
 ['Barbería moderna','barberia','Belleza','portfolio-barberia.webp','Estilo, servicios y atención al cliente.'],
 ['Librería','libreria','Comercio','portfolio-libreria.webp','Libros y descubrimiento editorial.'],
 ['Pizzería','pizzeria','Hostelería','portfolio-pizzeria.webp','Carta y presentación gastronómica.'],
 ['Frutería','fruteria','Comercio','portfolio-fruteria.webp','Productos frescos y catálogo de temporada.'],
 ['Floristería','floristeria','Comercio','portfolio-floristeria.webp','Flores y arreglos personalizados.'],
 ['Cafetería','cafeteria','Hostelería','portfolio-pasteleria.webp','Un rincón para desayunos y meriendas.'],
 ['Centro de estética','estetica','Belleza','portfolio-barberia.webp','Tratamientos y servicios estéticos.'],
 ['Tienda de mascotas','mascotas','Comercio','portfolio-fruteria.webp','Productos para mascotas.'],
 ['Taller de automoción · concepto','auto-mecanica-reco','Servicios','portfolio-taller.webp','Concepto de negocio de motor.'],
 ['Cafetería artesanal · concepto','cafeteria-rocio','Hostelería','portfolio-pasteleria.webp','Ejemplo de cafetería independiente.'],
 ['Peluquería · concepto','peluqueria-r-munoz','Belleza','portfolio-barberia.webp','Muestra de servicios de peluquería.'],
 ['Taberna · concepto','taberna-lo-nuestro','Hostelería','portfolio-pizzeria.webp','Carta y esencia de cocina tradicional.'],
 ['Bruma Café','bruma-cafe','Hostelería','portfolio-pasteleria.webp','Prototipo de cafetería ficticia.'],
 ['Pulso Club','pulso-club','Otros','portfolio-barberia.webp','Ejemplo de club deportivo ficticio.'],
 ['Nido Mascotas','nido-mascotas','Comercio','portfolio-fruteria.webp','Prototipo de accesorios para mascotas.'],
 ['Lumen Home','lumen-home','Comercio','portfolio-floristeria.webp','Concepto de decoración y hogar.'],
 ['Horizonte Escapes','horizonte-escapes','Turismo','portfolio-taller.webp','Experiencias y viajes ficticios.'],
 ['Órbita Creativa','orbita-creativa','Otros','portfolio-joyeria.webp','Estudio creativo conceptual.'],
 ['Lumbre · Carta QR','restaurante-qr-v6','Hostelería','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=960&q=78','Carta interactiva, filtros y pedido de prueba.',true],
 ['Refugio Sierra · Hotel','hotel-rural-v6','Turismo','https://images.unsplash.com/photo-1566073771259-6a8506099945?w=960&q=78','Simulador de estancia con cálculo por noches.',true],
 ['Aura Studio · Peluquería','peluqueria-agenda-v6','Belleza','https://images.unsplash.com/photo-1560066984-138dadb4c035?w=960&q=78','Agenda simulada con servicios y horarios.',true],
 ['Nexo Repair · Informática','reparaciones-it-v6','Servicios','https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=960&q=78','Diagnóstico guiado y presupuesto de reparación.',true]
];
const eur=n=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',minimumFractionDigits:0,maximumFractionDigits:0}).format(n);
const el=id=>document.getElementById(id);
const byId=(list,id)=>list.find(x=>x.id===id);
const state={base:'profesional',extras:new Set(),maintenance:'none',bundle:null,filter:'Todos',query:''};
function initNav(){const b=el('menu-toggle'),nav=el('menu');b.addEventListener('click',()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);b.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');b.setAttribute('aria-expanded','false');}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');b.setAttribute('aria-expanded','false');}});}
function initMotion(){if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.querySelectorAll('.reveal').forEach(x=>x.classList.add('visible'));return;}const obs=new IntersectionObserver(items=>items.forEach(item=>{if(item.isIntersecting){item.target.classList.add('visible');obs.unobserve(item.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(x=>obs.observe(x));}
function demoUrl(d){return 'demos/'+d[1]+'.html';}
function initDemos(){const filters=['Todos','Hostelería','Comercio','Belleza','Servicios','Turismo','Otros'];
 filters.forEach(f=>{const b=document.createElement('button');b.className='filter-button';b.type='button';b.textContent=f;b.setAttribute('aria-pressed',String(f===state.filter));b.addEventListener('click',()=>{state.filter=f;renderDemos();});el('filters').append(b);});
 el('search').addEventListener('input',e=>{state.query=e.target.value.trim().toLocaleLowerCase('es');renderDemos();});renderDemos();
 const dialog=el('demo-preview');el('preview-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{el('preview-frame').removeAttribute('src');});dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
}
function renderDemos(){
 el('filters').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===state.filter)));
 const list=DEMOS.filter(d=>(state.filter==='Todos'||d[2]===state.filter)&&(!state.query||(d[0]+' '+d[2]+' '+d[4]).toLocaleLowerCase('es').includes(state.query)));
 el('result-count').textContent=list.length+' de '+DEMOS.length+' demos disponibles';el('no-results').hidden=!!list.length;
 const grid=el('project-grid');grid.replaceChildren();
 list.forEach(d=>{
  const article=document.createElement('article');article.className='project-card';
  const link=document.createElement('a');link.className='project-image';link.href=demoUrl(d);link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label','Abrir demo '+d[0]);
  const img=document.createElement('img');img.src=d[3].startsWith('https:')?d[3]:'assets/'+d[3];img.alt='Vista previa conceptual de '+d[0];img.loading='lazy';img.decoding='async';img.onerror=()=>{img.style.opacity='0';};link.append(img);
  const badge=document.createElement('span');badge.className='demo-badge';badge.textContent=d[5]?'DEMO NUEVA · NO OFICIAL':'DEMO NO OFICIAL';link.append(badge);
  const info=document.createElement('div');info.className='project-info';
  const sector=document.createElement('small');sector.textContent=d[2];const h=document.createElement('h3');h.textContent=d[0];const desc=document.createElement('p');desc.textContent=d[4];
  const acts=document.createElement('div');acts.className='project-actions';const open=document.createElement('a');open.href=demoUrl(d);open.target='_blank';open.rel='noopener noreferrer';open.textContent='Explorar página completa ↗';
  const preview=document.createElement('button');preview.type='button';preview.textContent='Vista previa';preview.setAttribute('aria-label','Vista previa de '+d[0]);preview.addEventListener('click',()=>{el('preview-title').textContent=d[0]+' · DEMO NO OFICIAL';el('preview-open').href=demoUrl(d);el('preview-frame').src=demoUrl(d);el('demo-preview').showModal();});
  acts.append(open,preview);info.append(sector,h,desc,acts);article.append(link,info);grid.append(article);
 });
}
function initPrices(){
 document.querySelectorAll('[data-tab]').forEach(btn=>{btn.addEventListener('click',()=>renderPrices(btn.dataset.tab));btn.addEventListener('keydown',e=>{if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;const tabs=[...document.querySelectorAll('[data-tab]')];const i=tabs.indexOf(btn),next=tabs[(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];next.focus();renderPrices(next.dataset.tab);});});renderPrices('web');
 document.querySelectorAll('[data-bundle]').forEach(btn=>btn.addEventListener('click',()=>selectBundle(btn.dataset.bundle)));
}
function renderPrices(type){
 const label={web:'Páginas web',extras:'Servicios extra',maintenance:'Mantenimiento'}[type];const list=PRICE_DATA[type];
 document.querySelectorAll('[data-tab]').forEach(btn=>{const active=btn.dataset.tab===type;btn.setAttribute('aria-selected',String(active));btn.tabIndex=active?0:-1;});el('pricing-content').setAttribute('aria-labelledby','tab-'+type);
 el('pricing-content').replaceChildren(...list.map(item=>{const article=document.createElement('article');article.className='price-item';const left=document.createElement('div');const h=document.createElement('h3');h.textContent=item.name;const p=document.createElement('p');p.textContent=item.limit;left.append(h,p);const strong=document.createElement('strong');strong.textContent=(item.desde?'desde ':'')+eur(item.price)+(type==='maintenance'?'/mes':'');article.append(left,strong);return article;}));
}
function initBudget(){
 const base=el('budget-base'),maint=el('budget-maintenance');
 PRICE_DATA.web.forEach(x=>base.add(new Option(x.name+' · '+(x.desde?'desde ':'')+eur(x.price),x.id)));
 PRICE_DATA.maintenance.forEach(x=>maint.add(new Option(x.name+(x.price?' · '+(x.desde?'desde ':'')+eur(x.price)+'/mes':''),x.id)));
 for(const extra of PRICE_DATA.extras){const label=document.createElement('label');label.className='extra-option';label.title=extra.limit;const check=document.createElement('input');check.type='checkbox';check.value=extra.id;check.name='extras';const span=document.createElement('span');span.textContent=extra.name;const strong=document.createElement('strong');strong.textContent=(extra.desde?'desde ':'')+eur(extra.price);label.append(check,span,strong);el('budget-extras').append(label);check.addEventListener('change',()=>{if(check.checked)state.extras.add(extra.id);else state.extras.delete(extra.id);state.bundle=null;renderBudget();});}
 base.addEventListener('change',()=>{state.base=base.value;state.bundle=null;renderBudget();});maint.addEventListener('change',()=>{state.maintenance=maint.value;renderBudget();});
 el('reset-budget').addEventListener('click',()=>{state.base='profesional';state.extras.clear();state.maintenance='none';state.bundle=null;renderBudget();});
 el('budget-copy').addEventListener('click',async()=>{const ok=await copyText(budgetText());el('budget-status').textContent=ok?'Presupuesto copiado al portapapeles.':'No se pudo copiar; prueba la descarga TXT.';});
 el('budget-download').addEventListener('click',()=>{const blob=new Blob([budgetText()],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='abel-automation-presupuesto.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);el('budget-status').textContent='Presupuesto descargado en formato TXT.';});
 el('budget-print').addEventListener('click',()=>window.print());
 el('budget-contact').addEventListener('click',()=>{el('client-message').value='Me gustaría solicitar información sobre el siguiente proyecto:\n\n'+budgetText();el('contacto').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});el('client-name').focus({preventScroll:true});});
 renderBudget();
}
function selectBundle(id){
 const pack=PRICE_DATA.bundles[id];if(!pack)return;state.base=pack.base;state.extras=new Set(pack.extras);state.bundle=id;renderBudget();el('presupuesto').scrollIntoView({behavior:'smooth'});el('budget-status').textContent='Pack '+pack.label+' seleccionado. Si modificas extras o web se recalcula como presupuesto individual.';
}
function budgetNumbers(){
 const base=byId(PRICE_DATA.web,state.base),extras=PRICE_DATA.extras.filter(x=>state.extras.has(x.id)),maint=byId(PRICE_DATA.maintenance,state.maintenance);
 const subtotal=base.price+extras.reduce((sum,x)=>sum+x.price,0);
 const pack=state.bundle?PRICE_DATA.bundles[state.bundle]:null;
 const discount=pack?subtotal-pack.price:0;
 return {base,extras,maint,pack,discount,subtotal,total:subtotal-discount,approx:[base,...extras,maint].some(x=>x.desde)};
}
function renderBudget(){
 el('budget-base').value=state.base;el('budget-maintenance').value=state.maintenance;
 el('budget-extras').querySelectorAll('input').forEach(x=>x.checked=state.extras.has(x.value));
 const b=budgetNumbers();el('base-details').textContent=b.base.limit;
 el('budget-total').textContent=(b.approx?'desde ':'')+eur(b.total);
 el('budget-monthly').textContent=b.maint.price?(b.maint.desde?'Desde ':'')+eur(b.maint.price)+'/mes de mantenimiento':'Sin mantenimiento mensual';
 const br=el('budget-breakdown');br.replaceChildren();
 function addLine(label,value,description,cls){const row=document.createElement('div');if(cls)row.className=cls;const left=document.createElement('span');left.textContent=label;if(description){const small=document.createElement('small');small.textContent=description;left.append(small);}const right=document.createElement('strong');right.textContent=value;row.append(left,right);br.append(row);}
 addLine(b.base.name,(b.base.desde?'desde ':'')+eur(b.base.price),b.base.limit);
 b.extras.forEach(x=>addLine(x.name,(x.desde?'desde ':'')+eur(x.price),x.limit));
 if(b.pack)addLine('Descuento pack · '+b.pack.label,'−'+eur(b.discount),'Pack orientativo con alcance limitado.','discount');
 if(b.maint.price)addLine('Mantenimiento · '+b.maint.name,(b.maint.desde?'desde ':'')+eur(b.maint.price)+'/mes',b.maint.limit);
 else addLine('Mantenimiento','No seleccionado');
}
function budgetText(){
 const b=budgetNumbers();const lines=[
 'ABEL AUTOMATION · PRESUPUESTO ORIENTATIVO','Fecha: '+new Date().toLocaleDateString('es-ES'),'',
 'PROYECTO','• '+b.base.name+': '+(b.base.desde?'desde ':'')+eur(b.base.price),...b.extras.map(x=>'• '+x.name+': '+(x.desde?'desde ':'')+eur(x.price))];
 if(b.pack)lines.push('• Descuento pack '+b.pack.label+': −'+eur(b.discount));
 lines.push('','INVERSIÓN INICIAL ESTIMADA: '+(b.approx?'DESDE ':'')+eur(b.total),'MANTENIMIENTO: '+(b.maint.price?(b.maint.desde?'desde ':'')+eur(b.maint.price)+'/mes':'No seleccionado'),'');
 lines.push('ALCANCE','• '+b.base.limit,...b.extras.map(x=>'• '+x.limit),b.maint.price?'• '+b.maint.limit:'');
 lines.push('','IMPORTANTE: Estimación no vinculante. IVA, dominio, hosting, licencias, servicios externos y contenidos adicionales no incluidos. Propuesta final sujeta a revisión de necesidades.','No se ha efectuado ningún pago ni contratación.');return lines.filter(x=>x!==undefined).join('\n');
}
async function copyText(t){
 try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(t);return true;}}catch(e){}
 const area=document.createElement('textarea');area.value=t;area.style.position='fixed';area.style.left='-9999px';document.body.append(area);area.select();let ok=false;try{ok=document.execCommand('copy');}catch(e){}area.remove();return ok;
}
function initContact(){
 const form=el('contact-form');form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;
 const name=el('client-name').value.trim(),email=el('client-email').value.trim(),sector=el('client-sector').value,message=el('client-message').value.trim();
 if(!name||!email||message.length<12){el('contact-status').textContent='Revisa los datos y describe el proyecto con algo más de detalle.';return;}
 const lines=['SOLICITUD DE INFORMACIÓN · ABEL AUTOMATION','Nombre: '+name,'Email: '+email,'Sector: '+(sector||'No especificado'),'','Mi proyecto:',message,'','Preparado localmente desde el portfolio. No enviado automáticamente.'];
 el('contact-draft').value=lines.join('\n');el('contact-output').hidden=false;el('contact-status').textContent='Borrador generado. Cópialo y envíalo utilizando el formulario de contacto disponible.';el('contact-output').scrollIntoView({block:'nearest'});
 });
 el('copy-contact').addEventListener('click',async()=>{el('contact-status').textContent=await copyText(el('contact-draft').value)?'Solicitud copiada. Puedes enviarla desde el formulario anterior.':'Selecciona el borrador y cópialo manualmente.';});
}
document.addEventListener('DOMContentLoaded',()=>{initNav();initMotion();initDemos();initPrices();initBudget();initContact();});
