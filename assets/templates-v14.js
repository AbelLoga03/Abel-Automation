/* V14: 21 presets de diseño diferenciados (7 sectores × 3 direcciones), sin prometer 21 webs únicas. */
(function(root,factory){const api=factory(root.AbelWebExportV12,root.AbelBuilderV9);if(typeof module!=='undefined'&&module.exports)module.exports=api;root.AbelTemplatesV14=api;})(typeof globalThis!=='undefined'?globalThis:this,(E,B)=>{
'use strict';
const DIRECTIONS=[
 {id:'editorial',name:'Editorial premium',style:'editorial',layout:'split',font:'serif',themes:['sunset','clay','sunset','noir','forest','sky','sunset'],sections:['hero','about','services','gallery','contact','faq']},
 {id:'impacto',name:'Impacto visual',style:'bold',layout:'full',font:'sans',themes:['noir','aurora','noir','sky','forest','noir','aurora'],sections:['hero','services','products','gallery','contact','whatsapp']},
 {id:'esencial',name:'Minimalista',style:'minimal',layout:'centered',font:'sans',themes:['clay','forest','sky','forest','sunset','sky','clay'],sections:['hero','about','services','products','contact','form']}
];
const SECTORS=Object.keys(B.SECTORS);
const PRESETS=SECTORS.flatMap((sector,index)=>DIRECTIONS.map(d=>({
 id:sector+'-'+d.id,sector,name:B.SECTORS[sector].name+' · '+d.name,direction:d.id,
 theme:d.themes[index],font:d.font,style:d.style,layout:d.layout,sections:[...d.sections]
})));
function get(id){return PRESETS.find(p=>p.id===id)||null;}
function apply(id,previous){
 const preset=get(id);if(!preset)throw Error('Plantilla desconocida');
 const base=E.defaults(preset.sector),prev=previous&&typeof previous==='object'?E.normalize(previous):null;
 return E.normalize({...base,theme:preset.theme,font:preset.font,style:preset.style,layout:preset.layout,sections:preset.sections,
  // Contacto solo se conserva en memoria de la sesión actual, no en plantillas públicas.
  email:prev?.email||'',phone:prev?.phone||'',location:prev?.location||''});
}
return {PRESETS,DIRECTIONS,SECTORS,get,apply};
});
