/* V11 Launch & Sales — preflight automatizado. No simula recepción real de emails. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const follow=(await import('../assets/followups-v11.js')).default;
const launch=(await import('../assets/launch-readiness-v11.js')).default;
let n=0;const ok=(condition,title)=>{assert.ok(condition,title);n++;console.log('OK ',title);};
const read=p=>fs.readFileSync(p,'utf8'),exists=p=>fs.existsSync(p);
for(const p of ['assets/followups-v11.js','assets/launch-readiness-v11.js','assets/contact-v11.js',
'herramientas/lanzamiento-v11.html','servicios/web-local-v11.html','herramientas/crm.html',
'privacidad.html','gracias.html','robots.txt','sitemap.xml','index.html']){
 ok(exists(p),'Archivo V11 '+p);
}
for(const f of ['assets/followups-v11.js','assets/launch-readiness-v11.js','assets/contact-v11.js','assets/v6-pro.js']){
 new vm.Script(read(f),{filename:f});ok(true,'Sintaxis JavaScript '+f);
}
const pivot=new Date(2026,9,29,12,0,0);
ok(follow.localISO(pivot)==='2026-10-29','Fecha del CRM se obtiene en horario local');
ok(follow.validDate('2026-02-28')&&!follow.validDate('2026-02-29'),'Se validan fechas reales');
ok(follow.validDate('2028-02-29')&&!follow.validDate('2026-13-12'),'Se aceptan años bisiestos');
ok(follow.nextDay('2026-12-31')==='2027-01-01','Calendario cruza fin de año');
ok(follow.dueCategory({stage:'Pendiente',followup:'2026-10-28'},'2026-10-29')==='overdue','Seguimiento vencido');
ok(follow.dueCategory({stage:'Pendiente',followup:'2026-10-29'},'2026-10-29')==='today','Seguimiento para hoy');
ok(follow.dueCategory({stage:'Propuesta',followup:'2026-11-05'},'2026-10-29')==='upcoming','Seguimiento próximos siete días');
ok(follow.dueCategory({stage:'Pendiente',followup:'2026-11-06'},'2026-10-29')==='later','Seguimiento lejano');
ok(follow.dueCategory({stage:'Cerrado',followup:'2026-10-28'},'2026-10-29')==='none','Oportunidad cerrada excluida');
const report=follow.summary([
 {stage:'Pendiente',followup:'2026-10-28'},{stage:'Pendiente',followup:'2026-10-29'},
 {stage:'Propuesta',followup:'2026-11-03'},{stage:'Cerrado',followup:'2026-10-28'}
],pivot);
ok(report.overdue===1&&report.today===1&&report.upcoming===1&&report.pending===3,'Resumen de seguimientos correcto');
const calendar=follow.calendarEvent({name:'Taller; El Norte, "Año nuevo"',followup:'2026-10-29'},new Date('2026-10-29T13:30:00Z'));
ok(calendar.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n'),'Exporta estructura iCalendar');
ok(calendar.includes('DTSTART;VALUE=DATE:20261029')&&calendar.includes('DTEND;VALUE=DATE:20261030'),'Evento de día completo en horario local');
ok(calendar.includes('END:VEVENT\r\nEND:VCALENDAR\r\n'),'iCalendar incluye fin de evento');
ok(calendar.includes('Taller\\; El Norte\\, "Año nuevo"'),'Se escapan delimitadores ICS');
ok(!calendar.includes('BEGIN:VALARM')&&!calendar.includes('mailto:'),'El recordatorio no crea notificaciones ni comparte contactos');
ok(calendar.split('\r\n').filter(Boolean).every(x=>new TextEncoder().encode(x).length<=75),'Líneas de calendario plegadas ≤75 octetos');
assert.throws(()=>follow.calendarEvent({name:'x',followup:'2026-02-30'}));
ok(true,'Fecha imposible rechazada al exportar');
ok(launch.CHECKS.filter(x=>x.critical).length===8,'Ocho controles críticos');
ok(launch.progress([]).ready===false&&launch.progress([]).checked===0,'Checklist sin marcas no permite declarar lista');
const ids=launch.CHECKS.filter(x=>x.critical).map(x=>x.id);
ok(launch.progress(ids).ready,'Checklist completa solo si están todos los críticos');
ok(!launch.progress(ids.filter(x=>x!=='mail')).ready,'Sin correo real revisado no se declara lista');
ok(!launch.progress(ids.filter(x=>x!=='privacy')).ready,'Sin privacidad revisada no se declara lista');
ok(launch.sanitize(['ci','ci','evil']).length===1,'Casillas malformadas o repetidas descartadas');
ok(launch.report([]).includes('NO PREPARADO')&&launch.report(ids).includes('documento declarativo'),'Informe no finge verificación automática');
const home=read('index.html'),contact=read('assets/v6-pro.js'),crm=read('herramientas/crm.html'),privacy=read('privacidad.html'),thank=read('gracias.html');
ok(home.includes('assets/contact-v11.js')&&home.includes('id="contact-count"'),'Orientación y contador de contacto conectados');
ok(home.includes('Peluquería / estética')&&home.includes('Taller / reparaciones'),'Sectores de contacto ampliados');
ok(home.includes('type="button" id="contact-send"')&&home.includes('type="submit" id="contact-draft-button"'),'Envío y borrador claramente distintos');
ok(contact.includes("HTMLFormElement.prototype.submit.call(form)")&&contact.includes("el('contact-consent').checked"),'Envío explícito requiere consentimiento');
ok(contact.includes("sessionStorage.removeItem('abel-v10-contact-draft')")&&!contact.includes('fetch('),'Borrador V10 no se envía automáticamente');
ok(home.includes('https://formsubmit.co/')&&home.includes('name="privacidad_aceptada"'),'Formulario real configurado y privacidad visible');
ok(privacy.includes('FormSubmit')&&privacy.includes('no se considera verificada'),'Privacidad explica la verificación no acreditada');
ok(thank.includes('no confirma por sí sola'),'Página de retorno no simula éxito de entrega');
ok(crm.includes("KEY='alstudio-v10-crm-v1'")&&crm.includes('220000')&&crm.includes('AES-GCM')&&crm.includes('PBKDF2'),'Conserva identificación y cifrado de CRM');
ok(crm.includes('assets/followups-v11.js')&&crm.includes('id="due-filter"')&&crm.includes('id="followup-summary"'),'CRM dispone de fechas, filtro y resumen');
ok(crm.includes('calendarEvent(lead)')&&crm.includes('text/calendar'),'Exportación manual de .ics desde CRM');
ok(crm.includes("'CRM bloqueado. Desbloquea")&&crm.includes("$('board').replaceChildren()"),'Al bloquear se oculta la información descifrada');
ok(crm.includes('sessionStorage.removeItem(STUDIO_DRAFT_KEY)')&&crm.includes("await seal()"),'Importación V9 sigue bajo control y guardado cifrado');
const launchHtml=read('herramientas/lanzamiento-v11.html');
ok(launchHtml.includes('noindex,nofollow')&&launchHtml.includes('id="ready-progress"'),'Checklist interna no indexable con progreso');
ok(!launchHtml.includes('formsubmit.co/')&&!launchHtml.includes('name="email"'),'Checklist no recoge ni envía datos de clientes');
const local=read('servicios/web-local-v11.html'),map=read('sitemap.xml');
ok(local.includes('Ubrique, Ronda y Cortes')&&local.includes('no se anuncian oficinas físicas'),'SEO local sin direcciones inventadas');
ok(local.includes('rel="canonical"')&&local.includes('property="og:image"')&&local.includes('name="description"'),'SEO social de página local');
ok(local.includes('ficticios')&&local.includes('no representan trabajos contratados'),'Sin clientes falsos');
ok(home.includes('servicios/web-local-v11.html')&&map.includes('/servicios/web-local-v11.html'),'Nueva página local enlazada e indexada');
ok(!map.includes('lanzamiento-v11.html'),'Checklist interna no indexada');
const homeCount=(read('assets/v6-pro.js').match(/^\s*\['.*','.*','.*','.*','.*'\]/gm)||[]).length;
ok(read('scripts/check-v6.mjs').includes("data.DEMOS.length===25"),'Se conserva comprobación de las 25 demos');
for(const f of ['servicios/web-local-v11.html','herramientas/lanzamiento-v11.html']){
 const html=read(f);
 for(const m of html.matchAll(/<(?:a|link|script|img)\b[^>]*?\b(?:href|src)=["']([^"']+)["']/gi)){
  const link=m[1];if(/^(https?:|mailto:|tel:|data:|#)/.test(link))continue;
  const candidate=path.resolve(path.dirname(f),decodeURIComponent(link.split(/[?#]/)[0]));
  ok(exists(candidate),'Enlace válido en '+f+': '+link);
 }
}
// Validación de todos los enlaces del sitemap, no solo los nuevos.
const urls=[...map.matchAll(/<loc>(https:\/\/abelloga03\.github\.io\/Abel-Automation\/[^<]*)<\/loc>/g)].map(x=>x[1]);
ok(urls.length>=20,'Sitemap contiene el catálogo comercial completo');
ok(new Set(urls).size===urls.length,'Sitemap sin URLs duplicadas');
for(const url of urls){
 const pathname=decodeURIComponent(url.split('/Abel-Automation/')[1]||'');
 const f=pathname||'index.html';
 ok(exists(f),'Sitemap apunta a archivo existente: '+f);
}
ok(!read('index.html').includes('id="crm-secret"'),'No se muestra la bóveda en la página pública');
console.log('V11 Launch & Sales: '+n+' comprobaciones superadas. La recepción del formulario NO se valida por CI.');
