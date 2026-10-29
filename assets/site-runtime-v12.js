/* Abel Automation V12 · funciones reales del ZIP. Sin backend ni analítica. */
(()=>{'use strict';
const toggle=document.querySelector('.menu-toggle'),nav=document.getElementById('links');
if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open));});nav.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');}});}
const dialog=document.getElementById('lightbox'),image=document.getElementById('full-photo');
document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{const img=button.querySelector('img');if(img&&dialog&&typeof dialog.showModal==='function'){image.src=img.src;image.alt=img.alt;dialog.showModal();}}));
document.getElementById('close-photo')?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
const receiver=document.querySelector('meta[name="contact-email"]')?.content||'';
const form=document.getElementById('site-contact-form');
form?.addEventListener('submit',e=>{
 e.preventDefault();if(!form.reportValidity()||!receiver)return;
 const data=new FormData(form);
 const body='Nombre: '+data.get('name')+'\nCorreo: '+data.get('reply')+'\nMensaje: '+data.get('message');
 const status=document.getElementById('form-status');if(status)status.textContent='Se abrirá tu correo. Comprueba la información y confirma el envío manualmente.';
 location.href='mailto:'+encodeURIComponent(receiver)+'?subject='+encodeURIComponent('Consulta desde la web')+'&body='+encodeURIComponent(body);
});
})();