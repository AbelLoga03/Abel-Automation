/* Abel Automation V11 · recordatorios locales, sin servidores ni notificaciones. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;root.AbelFollowupsV11=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
'use strict';
function localISO(now=new Date()){
 const y=now.getFullYear(),m=String(now.getMonth()+1).padStart(2,'0'),d=String(now.getDate()).padStart(2,'0');
 return y+'-'+m+'-'+d;
}
function validDate(value){
 if(typeof value!=='string'||!/^20\d{2}-\d{2}-\d{2}$/.test(value))return false;
 const [y,m,d]=value.split('-').map(Number);
 const t=new Date(Date.UTC(y,m-1,d));
 return t.getUTCFullYear()===y&&t.getUTCMonth()+1===m&&t.getUTCDate()===d;
}
function dueCategory(row,today=localISO()){
 if(!row||row.stage==='Cerrado'||!validDate(row.followup)||!validDate(today))return 'none';
 if(row.followup<today)return 'overdue';
 if(row.followup===today)return 'today';
 const a=Date.parse(today+'T00:00:00Z'),b=Date.parse(row.followup+'T00:00:00Z');
 return (b-a)/86400000<=7?'upcoming':'later';
}
function summary(rows,now=new Date()){
 const today=localISO(now),result={overdue:0,today:0,upcoming:0,later:0,none:0};
 for(const item of Array.isArray(rows)?rows:[])result[dueCategory(item,today)]++;
 return {...result,pending:result.overdue+result.today+result.upcoming};
}
function escapeICS(value){
 return String(value??'').replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,').slice(0,1000);
}
function nextDay(date){
 if(!validDate(date))throw Error('Fecha de seguimiento inválida');
 const t=new Date(date+'T00:00:00Z');t.setUTCDate(t.getUTCDate()+1);return t.toISOString().slice(0,10);
}
function calendarEvent(row,now=new Date()){
 if(!row||!validDate(row.followup))throw Error('Esta oportunidad no tiene una fecha válida');
 const name=String(row.name||'Oportunidad comercial').slice(0,90);
 const description='Revisar seguimiento comercial de Abel Automation. Abrir CRM local y comprobar el estado; este archivo no contiene una conexión al CRM.';
 const start=row.followup.replace(/-/g,''),end=nextDay(row.followup).replace(/-/g,'');
 const stamp=now.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 // UID por exportación, no se genera con datos personales ni se envían datos a una API.
 const rand=typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():'manual-'+now.getTime();
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Abel Automation//V11 Followups//ES','CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VEVENT',
   'UID:'+rand+'@abel-automation.invalid','DTSTAMP:'+stamp,'DTSTART;VALUE=DATE:'+start,'DTEND;VALUE=DATE:'+end,
   'SUMMARY:'+escapeICS('Seguimiento comercial: '+name),'DESCRIPTION:'+escapeICS(description),
   'TRANSP:TRANSPARENT','END:VEVENT','END:VCALENDAR'];
 // RFC 5545 recomienda 75 octetos; pliegue sobre UTF-8 para compatibilidad.
 const encoder=new TextEncoder();
 const folded=[];
 for(const line of lines){
  let current='',bytes=0;
  for(const char of line){
   const size=encoder.encode(char).length;
   if(bytes+size>73){folded.push(current);current=' '+char;bytes=size+1;}
   else {current+=char;bytes+=size;}
  }
  folded.push(current);
 }
 return folded.join('\r\n')+'\r\n';
}
return {localISO,validDate,dueCategory,summary,escapeICS,nextDay,calendarEvent};
});
