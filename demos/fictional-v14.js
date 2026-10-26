/* V14 · fichas comerciales ficticias, todo local y sin reserva/pedido real */
(()=>{"use strict";
 const dataTag=document.getElementById("demo-data");
 if(!dataTag)return;
 const d=JSON.parse(dataTag.textContent);
 const el=(id)=>document.getElementById(id);
 document.title=d.name+" · Demostración ficticia";
 document.body.dataset.theme=d.theme;
 const set=(id,v)=>{if(el(id))el(id).textContent=v};
 set("brand-name",d.name);set("brand-mark",d.symbol);set("kicker",d.category);set("hero-title",d.title);set("hero-desc",d.desc);set("hero-symbol",d.symbol);set("sticker1",d.stickers[0]);set("sticker2",d.stickers[1]);set("offer-title",d.offerTitle);set("offer-desc",d.offerDesc);set("feature-tag",d.category.toUpperCase());set("banner-title",d.bannerTitle);
 set("stat1",d.stats[0][0]);set("stat1-label",d.stats[0][1]);set("stat2",d.stats[1][0]);set("stat2-label",d.stats[1][1]);set("stat3",d.stats[2][0]);set("stat3-label",d.stats[2][1]);
 const list=el("products"),tags=["Todo",...new Set(d.items.map(x=>x.type))],filters=el("filters");let picked=[];
 function button(label,click,active=false){const b=document.createElement("button");b.type="button";b.textContent=label;b.setAttribute("aria-pressed",String(active));b.addEventListener("click",click);return b}
 function render(filter){
  filters.replaceChildren();
  for(const category of tags){filters.append(button(category,()=>render(category),category===filter))}
  list.replaceChildren();
  for(const p of d.items.filter(item=>filter==="Todo"||item.type===filter)){
   const card=document.createElement("article");card.className="product";
   const art=document.createElement("div");art.className="art";art.setAttribute("aria-hidden","true");art.textContent=p.icon;
   const body=document.createElement("div");body.className="body";
   const meta=document.createElement("small");meta.className="category";meta.textContent=p.type.toUpperCase();
   const title=document.createElement("h3");title.textContent=p.name;
   const copy=document.createElement("p");copy.textContent=p.text;
   const actions=document.createElement("div");actions.className="actions";
   const price=document.createElement("small");price.textContent=p.tag;
   const add=button("Me interesa +",()=>{picked.push(p.name);updateSelection();toast("Añadido a la selección de ejemplo")});
   actions.append(price,add);body.append(meta,title,copy,actions);card.append(art,body);list.append(card)
  }
 }
 function updateSelection(){set("selection-count",String(picked.length));el("selection").hidden=picked.length===0}
 function toast(msg){set("toast",msg);el("toast").classList.add("show");setTimeout(()=>el("toast").classList.remove("show"),2500)}
 el("selection-copy").addEventListener("click",async()=>{const t="Selección ficticia de "+d.name+" (NO ES UN PEDIDO)\n"+picked.map((v,i)=>(i+1)+". "+v).join("\n");try{await navigator.clipboard.writeText(t);toast("Selección copiada. No se ha enviado a ningún negocio.")}catch{toast("Tu navegador no permitió copiar.")}});
 el("selection-clear").addEventListener("click",()=>{picked=[];updateSelection();toast("Selección vacía")});
 const steps=el("process");for(let i=0;i<d.steps.length;i++){const box=document.createElement("article");box.className="step";const n=document.createElement("b");n.textContent=i+1;const h=document.createElement("h3");h.textContent=d.steps[i][0];const p=document.createElement("p");p.textContent=d.steps[i][1];box.append(n,h,p);steps.append(box)}
 render("Todo");updateSelection();
})();