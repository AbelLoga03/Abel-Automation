/* V13 · preflight para webs exportadas. No despliega, no visita ni envía solicitudes. */
(function(root,factory){const api=factory(root.AbelWebExportV12,root.AbelBuilderV9);if(typeof module!=='undefined'&&module.exports)module.exports=api;root.AbelPublishV13=api;})(typeof globalThis!=='undefined'?globalThis:this,(E,B)=>{
'use strict';
function audit(project){
 const p=E.normalize(project),h=E.htmlText(p),issues=[];
 const add=(id,title,ok,critical,detail)=>issues.push({id,title,ok:Boolean(ok),critical:Boolean(critical),detail});
 add('brand','Marca personalizada',p.brand!==B.SECTORS[p.sector].brand&&p.brand!=='TU PROYECTO',false,'Sustituye el nombre de plantilla por la marca autorizada.');
 add('headline','Titular de proyecto',p.headline!==B.SECTORS[p.sector].headline,false,'Ajusta el mensaje al negocio real.');
 add('meta','Título y descripción SEO',h.includes('<title>')&&h.includes('<meta name="description"')&&p.intro.length>=20,true,'Comprueba que sean específicos y exactos.');
 add('images','Derechos de las imágenes',false,true,'Confirmación manual imprescindible: utiliza fotografías autorizadas o propias.');
 add('contacts','Canal de contacto',E.isEmail(p.email)||E.isPhone(p.phone),false,'Introduce un canal válido antes de recibir consultas reales.');
 add('form','Formulario sin promesas',!p.sections.includes('form')||E.isEmail(p.email),true,'El formulario solo prepara correo. Si necesitas envío real, contrata un backend y revisa privacidad.');
 add('booking','Reservas sin disponibilidad',!p.sections.includes('booking'),false,'Si incluyes reservas, son solicitudes por correo; no hay agenda ni confirmación.');
 add('integrations','Integraciones especiales',!p.sections.some(id=>['qr','automation','map'].includes(id)),false,'Carta QR, mapa y automatización son demostraciones; requieren desarrollo adicional.');
 add('sections','Estructura mínima',p.sections.includes('hero')&&p.sections.some(id=>['contact','form','whatsapp'].includes(id)),true,'Asegura portada y al menos una opción para contactar.');
 add('responsive','Vista adaptable',true,false,'Los estilos incluyen breakpoints. Revisa el diseño en móviles reales.');
 add('legal','Privacidad y textos legales',false,true,'Confirmación manual obligatoria antes de publicar. No hay asesoramiento legal automático.');
 add('links','Enlaces e imágenes',true,false,'La generación usa rutas locales. Descomprime el ZIP y comprueba todos los enlaces e imágenes antes de subirlo.');
 const failed=issues.filter(x=>!x.ok&&x.critical);
 return {issues,criticalPending:failed.length,passed:issues.filter(x=>x.ok).length,total:issues.length,canPublishAutomatically:false};
}
function report(project){
 const r=audit(project);return ['ABEL AUTOMATION V13 · INFORME PREVIO A PUBLICAR','',
 ...r.issues.map(x=>(x.ok?'[OK] ':'[REVISAR] ')+(x.critical?'[CRÍTICO] ':'')+x.title+' — '+x.detail),'',
 'Críticos pendientes: '+r.criticalPending,
 'Este informe no valida derechos, privacidad, disponibilidad ni publicación real.',
 'Ningún sitio se publica automáticamente.'].join('\n');
}
return {audit,report};
});
