'use strict';
/* Cada operación en estas demos ocurre solo en el navegador. Sin backend, pagos ni reservas reales. */
const config=window.V6_DEMO_CONFIG||{};
const get=id=>document.getElementById(id);
const euros=n=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
const getLocalDate=(offset=0)=>{const d=new Date();d.setDate(d.getDate()+offset);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');};
const days=(a,b)=>(Date.parse(b+'T00:00:00Z')-Date.parse(a+'T00:00:00Z'))/86400000;
const categoryList=['Todas',...new Set((config.items||[]).map(x=>x.category))];
let filter='Todas',cart=new Map(),slot='';
const sourceItems=()=>config.items||[];
function renderItems(){
 const holder=get('demo-items');if(!holder)return;holder.replaceChildren();
 sourceItems().filter(x=>filter==='Todas'||x.category===filter).forEach(item=>{
 const card=document.createElement('article');card.className='item';
 const photo=document.createElement('div');photo.className='item-photo';const img=document.createElement('img');img.loading='lazy';img.decoding='async';img.alt='Imagen ilustrativa de '+item.name;img.src=item.image;img.onerror=()=>{img.style.display='none';};photo.append(img);
 const body=document.createElement('div');body.className='item-body';const small=document.createElement('small');small.textContent=item.category;const title=document.createElement('h3');title.textContent=item.name;const desc=document.createElement('p');desc.textContent=item.description;
 const foot=document.createElement('div');foot.className='item-foot';const price=document.createElement('strong');price.textContent=(item.from?'Desde ':'')+euros(item.price)+(config.type==='hotel'?'/noche':'');const button=document.createElement('button');button.type='button';button.textContent=config.type==='restaurant'?'Añadir +':'Seleccionar ↗';
 button.addEventListener('click',()=>onSelect(item));foot.append(price,button);body.append(small,title,desc,foot);card.append(photo,body);holder.append(card);
 });
}
function initFilter(){const holder=get('demo-categories');if(!holder)return;categoryList.forEach(cat=>{const b=document.createElement('button');b.type='button';b.className='pill';b.textContent=cat;b.setAttribute('aria-pressed',String(cat===filter));b.addEventListener('click',()=>{filter=cat;holder.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderItems();});holder.append(b);});}
function onSelect(item){
 if(config.type==='restaurant'){cart.set(item.id,(cart.get(item.id)||0)+1);renderCart();get('interactivo').scrollIntoView({behavior:'smooth'});}
 if(config.type==='hotel'){get('room-select').value=item.id;calculateHotel();get('interactivo').scrollIntoView({behavior:'smooth'});}
 if(config.type==='salon'){get('service-select').value=item.id;get('interactivo').scrollIntoView({behavior:'smooth'});get('booking-result').textContent='Servicio seleccionado: '+item.name+'. Elige fecha y hora para simular una cita.';}
 if(config.type==='it'){get('device-select').value=item.id;calculateIT();get('interactivo').scrollIntoView({behavior:'smooth'});}
}
function renderCart(){
 const panel=get('cart-list');if(!panel)return;panel.replaceChildren();let total=0,count=0;
 for(const [id,quantity] of cart){const item=sourceItems().find(x=>x.id===id);if(!item||quantity<1)continue;count+=quantity;total+=item.price*quantity;
 const row=document.createElement('div');row.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:10px;border-bottom:1px solid var(--border);padding:10px 0;';
 const label=document.createElement('span');label.textContent=item.name+' × '+quantity;const subtotal=document.createElement('strong');subtotal.textContent=euros(item.price*quantity);
 const remove=document.createElement('button');remove.type='button';remove.textContent='−';remove.setAttribute('aria-label','Quitar una unidad de '+item.name);remove.style.cssText='background:transparent;color:var(--accent);border:1px solid var(--accent);border-radius:4px;min-width:34px;';remove.addEventListener('click',()=>{if(quantity===1)cart.delete(id);else cart.set(id,quantity-1);renderCart();});row.append(label,subtotal,remove);panel.append(row);
 }
 if(!count)panel.textContent='Aún no has añadido platos.';
 get('cart-total').textContent=euros(total);get('cart-count').textContent=count+' artículo'+(count===1?'':'s');
}
function initRestaurant(){
 renderCart();get('clear-cart').addEventListener('click',()=>{cart.clear();renderCart();get('order-result').textContent='El pedido de prueba se ha vaciado.';});
 get('simulate-order').addEventListener('click',()=>{if(!cart.size){get('order-result').textContent='Selecciona algún plato en la carta antes de simular el pedido.';return;}const count=[...cart.values()].reduce((a,b)=>a+b,0);get('order-result').textContent='Pedido de demostración preparado: '+count+' artículos por '+get('cart-total').textContent+'. No se ha realizado ningún pedido ni enviado información a ningún restaurante.';});
}
function calculateHotel(){
 const start=get('check-in').value,end=get('check-out').value,guests=Number(get('guests').value),room=sourceItems().find(x=>x.id===get('room-select').value);
 const n=days(start,end);const out=get('booking-result');
 if(!room||!start||!end||!Number.isFinite(n)||n<1||n>30||start<getLocalDate()||guests<1||guests>4){out.textContent='Selecciona fechas futuras válidas (1 a 30 noches) y entre 1 y 4 huéspedes.';get('hotel-confirm').disabled=true;return;}
 const surcharge=Math.max(0,guests-2)*15*n;const total=n*room.price+surcharge;
 out.textContent=n+' noche'+(n===1?'':'s')+' · '+room.name+' · '+guests+' huésped'+(guests===1?'':'es')+'\n'+euros(room.price)+' / noche × '+n+(surcharge?'\nSuplemento demostrativo: '+euros(surcharge):'')+'\nTOTAL DE EJEMPLO: '+euros(total)+'\nSin tasas ni disponibilidad real. El precio es ficticio.';
 get('hotel-confirm').disabled=false;
}
function initHotel(){
 const start=get('check-in'),end=get('check-out');start.min=getLocalDate();end.min=getLocalDate(1);start.value=getLocalDate(1);end.value=getLocalDate(3);
 sourceItems().forEach(x=>get('room-select').add(new Option(x.name+' · '+euros(x.price)+'/noche',x.id)));
 [start,end,get('guests'),get('room-select')].forEach(input=>input.addEventListener('change',calculateHotel));
 start.addEventListener('change',()=>{end.min=start.value;calculateHotel();});
 get('hotel-confirm').addEventListener('click',()=>{calculateHotel();if(!get('hotel-confirm').disabled)get('booking-result').textContent+='\n\n✓ Simulación finalizada. NO hay ninguna reserva confirmada o enviada.';});
 calculateHotel();
}
function renderSlots(){
 const holder=get('time-slots');holder.replaceChildren();['09:30','10:15','11:00','12:30','16:00','16:45','17:30','18:15'].forEach(time=>{
 const b=document.createElement('button');b.type='button';b.className='slot';b.textContent=time;b.setAttribute('aria-pressed',String(time===slot));
 b.addEventListener('click',()=>{slot=time;renderSlots();get('booking-result').textContent='Hora seleccionada: '+time+'. Horarios ilustrativos; no representan disponibilidad real.';});holder.append(b);
 });}
function initSalon(){
 const date=get('appointment-date');date.min=getLocalDate();date.value=getLocalDate(1);
 sourceItems().forEach(x=>get('service-select').add(new Option(x.name+' · '+euros(x.price),x.id)));
 renderSlots();
 get('salon-confirm').addEventListener('click',()=>{
 const service=sourceItems().find(x=>x.id===get('service-select').value);
 if(!date.value||date.value<getLocalDate()||!slot){get('booking-result').textContent='Elige una fecha futura y pulsa una hora.';return;}
 get('booking-result').textContent='✓ Cita DE PRUEBA: '+service.name+' · '+euros(service.price)+'\nFecha: '+date.value+' · '+slot+'.\nNO existe ninguna reserva real. No se han enviado datos.';
 });
}
function calculateIT(){
 const device=sourceItems().find(x=>x.id===get('device-select').value),issue=get('issue-select').value,out=get('diagnosis-result');if(!device)return;
 const inc=issue==='power'?35:issue==='screen'?45:issue==='slow'?15:25;const min=device.price+inc,max=min+45;
 out.textContent='Orientación de demostración · '+device.name+'\nRango ilustrativo: '+euros(min)+' – '+euros(max)+'\nNo es un diagnóstico ni un precio final. Requiere revisión técnica.';
}
function initIT(){
 sourceItems().forEach(x=>get('device-select').add(new Option(x.name,x.id)));
 ['device-select','issue-select'].forEach(id=>get(id).addEventListener('change',calculateIT));
 get('it-confirm').addEventListener('click',()=>{calculateIT();get('diagnosis-result').textContent+='\n\n✓ Resumen de consulta creado localmente. No se ha solicitado ningún servicio ni transmitido información.';});
 calculateIT();
}
document.addEventListener('DOMContentLoaded',()=>{
 const toggle=get('nav-toggle'),nav=get('nav-links');
 toggle.addEventListener('click',()=>{const active=!nav.classList.contains('open');nav.classList.toggle('open',active);toggle.setAttribute('aria-expanded',String(active));});
 nav.querySelectorAll('a').forEach(x=>x.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}));
 initFilter();renderItems();
 ({restaurant:initRestaurant,hotel:initHotel,salon:initSalon,it:initIT}[config.type]||(()=>{}))();
});
