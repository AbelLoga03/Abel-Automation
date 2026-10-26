/* AL Studio Digital V11 – interacciones propias, sin búsquedas de disponibilidad ni pagos */
(() => {
  "use strict";
  const header=document.querySelector(".topbar");
  const toggle=document.getElementById("ion-mobile-toggle");
  if(header&&toggle){
    const close=()=>{header.dataset.open="false";toggle.setAttribute("aria-expanded","false");};
    toggle.addEventListener("click",()=>{const open=header.dataset.open!=="true";header.dataset.open=String(open);toggle.setAttribute("aria-expanded",String(open));});
    header.querySelectorAll(".ion-links a").forEach(a=>a.addEventListener("click",close));
    document.addEventListener("keydown",e=>{if(e.key==="Escape")close();});
    document.addEventListener("click",e=>{if(!header.contains(e.target))close();});
  }
  const form=document.getElementById("ion-domain-form");
  const input=document.getElementById("ion-domain-input");
  const suggestions=document.getElementById("ion-domain-suggestions");
  const status=document.getElementById("ion-domain-status");
  const clean=v=>v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ñ/g,"n").replace(/[^a-z0-9-\s]/g,"").trim().replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"").slice(0,50);
  if(form&&input&&suggestions&&status){
    function render(name){
      suggestions.replaceChildren();
      if(!name){status.textContent="Introduce un nombre para preparar ideas de dominio.";return;}
      status.textContent="Ideas de nombres, no comprobaciones de disponibilidad. Consulta un registrador antes de comprar.";
      const ideas=[name+".es",name+".com",name+"web.es",name+"digital.es"].filter((v,i,a)=>a.indexOf(v)===i);
      for(const domain of ideas){
        const btn=document.createElement("button");
        btn.type="button";
        btn.textContent=domain+" · Copiar";
        btn.setAttribute("aria-label","Copiar sugerencia "+domain);
        btn.addEventListener("click",async()=>{
          try{await navigator.clipboard.writeText(domain);status.textContent="Copiado: "+domain+". Recuerda comprobar su disponibilidad en un registrador.";}
          catch{status.textContent="Nombre sugerido: "+domain+". Puedes seleccionarlo y copiarlo manualmente.";}
        });
        suggestions.appendChild(btn);
      }
    }
    form.addEventListener("submit",e=>{e.preventDefault();render(clean(input.value));});
  }
  const ribbon=document.querySelector(".ion-preview");
  if(ribbon&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&matchMedia("(pointer:fine)").matches){
    let ticking=false;
    ribbon.addEventListener("pointermove",e=>{
      if(ticking)return;ticking=true;
      requestAnimationFrame(()=>{const b=ribbon.getBoundingClientRect();ribbon.style.setProperty("--ion-mx",((e.clientX-b.left)/b.width*100).toFixed(1)+"%");ticking=false;});
    });
  }
})();
