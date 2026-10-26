/* AL Studio Digital · Selector de solución comercial V12 */
(()=>{"use strict";
const panel=document.getElementById("v12-finder");if(!panel)return;
const options={
  web:{title:"Una web profesional para empezar",desc:"Una página que explica tu negocio, servicios y formas de contactar, con diseño responsive.",url:"servicios/web.html",label:"Descubrir diseño web ↗",tag:"Web esencial desde 199 € (orientativo)"},
  catalogo:{title:"Un catálogo visual para tus productos",desc:"Organiza platos, productos o servicios con fotografías y categorías sencillas de explorar.",url:"servicios/catalogos.html",label:"Descubrir catálogos ↗",tag:"Carta QR como extra desde 120 € (orientativo)"},
  automatizacion:{title:"Un proceso que te ahorra tareas repetitivas",desc:"Muestra una solicitud, su organización y el paso de confirmación humana antes de actuar.",url:"servicios/automatizaciones.html",label:"Explorar automatizaciones ↗",tag:"Automatización sencilla desde 100 € (orientativo)"},
  todo:{title:"Comparar los tres niveles de web",desc:"Comprueba funciones, diferencias y precios de referencia para elegir el mejor punto de partida.",url:"servicios/comparar.html",label:"Comparar planes ↗",tag:"Planes de web desde 199 €"}
};
const buttons=[...panel.querySelectorAll("[data-v12-kind]")],title=panel.querySelector("[data-v12-title]"),desc=panel.querySelector("[data-v12-desc]"),link=panel.querySelector("[data-v12-link]"),tag=panel.querySelector("[data-v12-tag]");
buttons.forEach(btn=>btn.addEventListener("click",()=>{const choice=options[btn.dataset.v12Kind];if(!choice)return;buttons.forEach(b=>b.setAttribute("aria-pressed",String(b===btn)));title.textContent=choice.title;desc.textContent=choice.desc;link.setAttribute("href",choice.url);link.textContent=choice.label;tag.textContent=choice.tag;}));
})();