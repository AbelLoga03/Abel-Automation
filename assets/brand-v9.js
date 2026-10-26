/* AL Studio Digital V9 · efectos progresivos; no interfiere con las demos. */
(() => {
  "use strict";
  const root=document.documentElement;
  const progress=document.getElementById("v9-progress");
  let pending=false;
  const update=()=>{pending=false;const max=root.scrollHeight-innerHeight; if(progress)progress.style.width=(max>0?Math.max(0,Math.min(100,100*scrollY/max)):0)+"%";};
  addEventListener("scroll",()=>{if(!pending){pending=true;requestAnimationFrame(update)}},{passive:true});
  update();
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const els=[...document.querySelectorAll(".v9-reveal, .v10-enter")];
  if(!reduced && "IntersectionObserver" in window){
    const ob=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add("in");if(e.target.classList.contains("v10-enter"))e.target.classList.add("v10-visible");ob.unobserve(e.target);}}},{rootMargin:"0px 0px -35px 0px",threshold:.07});
    els.forEach(el=>ob.observe(el));
  }else els.forEach(el=>{el.classList.add("in");if(el.classList.contains("v10-enter"))el.classList.add("v10-visible")});
  const orb=document.getElementById("v9-orb");
  if(orb && !reduced && matchMedia("(pointer:fine)").matches){
    let mx=0,my=0,frame=0;
    addEventListener("pointermove",e=>{mx=e.clientX;my=e.clientY;if(!frame)frame=requestAnimationFrame(()=>{orb.style.transform=`translate(calc(${mx}px - 50%),calc(${my}px - 50%))`;orb.style.opacity=".7";frame=0;})},{passive:true});
    addEventListener("pointerleave",()=>orb.style.opacity="0");
  }
  const links=[...document.querySelectorAll('a[href^="demos/"]')];
  const known=new Set(links.map(a=>a.getAttribute("href")));
  if(known.size>=15) root.dataset.demosV9="15";
})();
