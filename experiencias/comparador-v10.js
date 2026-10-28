/* Abel Automation · before/after ficticio; no mide resultados de negocios reales */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const S={
 restaurante:{name:'RESTAURANTE',beforeBrand:'RESTAURANTE DE EJEMPLO',beforeTitle:'Bienvenido a nuestro restaurante',beforeSub:'Tenemos platos, menú y servicio de atención.',brand:'CASA BRUMA',tag:'COCINA CON PERSONALIDAD',title:'Sabores para recordar.',sub:'Una experiencia que comienza antes de llegar a la mesa.',button:'Descubrir la carta',features:['CARTA DIGITAL','ATENCIÓN CERCANA','DISEÑO ADAPTABLE'],image:'portfolio-pizzeria.webp'},
 comercio:{name:'COMERCIO',beforeBrand:'TIENDA DE EJEMPLO',beforeTitle:'Bienvenido a nuestra tienda',beforeSub:'Disponemos de productos y ofertas.',brand:'ALMA OBJECTS',tag:'DETALLES QUE CUENTAN',title:'Objetos con otra historia.',sub:'Una colección que merece ser descubierta.',button:'Explorar colección',features:['CATÁLOGO VISUAL','CONSULTAS SENCILLAS','IDENTIDAD PROPIA'],image:'portfolio-joyeria.webp'},
 belleza:{name:'BELLEZA',beforeBrand:'PELUQUERÍA DE EJEMPLO',beforeTitle:'Cortes y peluquería',beforeSub:'Ven a conocer nuestros servicios.',brand:'MUSA ATELIER',tag:'TU ESTILO',title:'Tu momento empieza aquí.',sub:'Cuidado personal con una mirada diferente.',button:'Conocer servicios',features:['GALERÍA','SERVICIOS','CITAS POR CONSULTA'],image:'portfolio-barberia.webp'},
 taller:{name:'TALLER',beforeBrand:'TALLER DE EJEMPLO',beforeTitle:'Reparamos vehículos',beforeSub:'Mecánica, cambios y servicios.',brand:'NEXO GARAGE',tag:'PRECISIÓN Y CONFIANZA',title:'Volver a rodar, sin vueltas.',sub:'Un servicio claro y profesional para tu vehículo.',button:'Solicitar consulta',features:['SERVICIOS','CONTACTO','SOLICITUDES'],image:'portfolio-taller.webp'},
 hotel:{name:'ALOJAMIENTO',beforeBrand:'HOTEL DE EJEMPLO',beforeTitle:'Bienvenidos a nuestro hotel',beforeSub:'Tenemos habitaciones y servicios.',brand:'MONTE CLARO',tag:'DESCONECTA Y DESCUBRE',title:'Escapadas que se quedan.',sub:'Un espacio para desconectar y disfrutar de cada detalle.',button:'Descubrir habitaciones',features:['HABITACIONES','EXPERIENCIAS','DISPONIBILIDAD'],image:'portfolio-floristeria.webp'}
};
const sectors={restaurante:'restaurante',comercio:'comercio',belleza:'belleza',taller:'taller',hotel:'hotel'};
function setSector(key){
 const x=S[key];if(!x)return;
 $('compare-sector-name').textContent=x.name;
 $('before-brand').textContent=x.beforeBrand;$('before-headline').textContent=x.beforeTitle;$('before-subtitle').textContent=x.beforeSub;
 $('after-brand').textContent=x.brand;$('after-tag').textContent=x.tag;
 $('after-headline').textContent=x.title;$('after-subtitle').textContent=x.sub;$('after-button').textContent=x.button+' ↗';
 $('after-photo').style.backgroundImage='url("../assets/'+x.image+'")';
 for(let i=0;i<3;i++)$('after-feature'+(i+1)).textContent=x.features[i];
 for(const button of document.querySelectorAll('[data-compare-sector]'))button.setAttribute('aria-pressed',String(button.dataset.compareSector===key));
 $('go-planner').href='planificador-v10.html?sector='+sectors[key];
 $('go-builder').href='../estudio/configurador-v9.html?sector='+sectors[key];
}
function setSlider(value){
 const n=Math.max(0,Math.min(100,Math.round(Number(value)||0)));
 $('compare-stage').style.setProperty('--split',n+'%');
 $('compare-percent').textContent=n+' %';
}
document.addEventListener('DOMContentLoaded',()=>{
 let key=new URLSearchParams(location.search).get('sector');
 if(!Object.prototype.hasOwnProperty.call(S,key))key='restaurante';
 setSector(key);setSlider($('compare-range').value);
 $('compare-range').addEventListener('input',e=>setSlider(e.target.value));
 for(const button of document.querySelectorAll('[data-compare-sector]'))button.addEventListener('click',()=>setSector(button.dataset.compareSector));
});
})();
