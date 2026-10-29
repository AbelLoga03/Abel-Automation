/* Abel Automation V11 · ayuda para el formulario. No transmite ni almacena datos. */
(()=>{
 'use strict';
 const init=()=>{
  const text=document.getElementById('client-message');
  const counter=document.getElementById('contact-count');
  const send=document.getElementById('contact-send');
  if(!text||!counter||!send)return;
  const update=()=>{
    const n=text.value.length;
    counter.textContent=n+' / 3000 caracteres'+(n<12?' · Describe el proyecto (mínimo 12 caracteres).':' · Listo para revisar antes de enviar.');
  };
  text.addEventListener('input',update);
  // Los borradores de V10 se insertan en el DOMContentLoaded de V6; defer conserva ese orden.
  update();
  send.setAttribute('aria-describedby','contact-status');
  // No se marca un envío como recibido: el proveedor solo puede confirmarlo fuera de esta página.
  window.addEventListener('pageshow',()=>{send.disabled=false;});
 };
 document.addEventListener('DOMContentLoaded',init);
})();
