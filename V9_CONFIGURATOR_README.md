# Abel Automation — V9 CONFIGURATOR PRO

> Estado: **propuesta técnica de revisión en rama de desarrollo**. No ha sido publicada en la web principal ni fusionada a \`main\`.

## Objetivo
Convertir el portfolio en una experiencia de venta consultiva: un negocio imagina su propia web, personaliza marca y diseño, selecciona funciones, conoce una estimación y descarga dos tipos de PDF. El visitante puede solicitar una propuesta definitiva, pero no se promete ingreso ni se crea una web de producción automáticamente.

### Entradas
- **Constructor V9:** \`estudio/configurador-v9.html\`.
- Se puede abrir para un sector específico con \`?sector=restaurante\`, \`?sector=belleza\`, \`?sector=taller\`, \`?sector=comercio\`, \`?sector=hotel\`, \`?sector=profesional\` o \`?sector=otro\`.
- La portada V9 ofrece un acceso principal y conserva la vista rápida V7 como herramienta secundaria.
- Las 5 páginas sectoriales V8 llevan al constructor con su sector seleccionado.

## Capacidades
1. **7 sectores:** restaurante/cafetería, comercio, peluquería/estética, taller, hotel/alojamiento, servicios profesionales, otros.
2. **Marca editable:** nombre, titular, presentación y CTA. Los textos se insertan como \`textContent\`, sin interpretar HTML proporcionado por visitantes.
3. **6 paletas + colores propios:** fondo, texto, acento y superficies; valores \`#RRGGBB\` validados. Comprobar manualmente el contraste de esquemas personalizados.
4. **4 estilos y 4 tipografías:** Editorial, Impacto, Minimalista, Creativo; grotesca, serif, redondeada, monoespaciada.
5. **3 distribuciones hero:** dividida, centrada y con fotografía completa.
6. **15 bloques seleccionables y ordenables:** portada, historia, servicios, productos, galería, carta QR, reservas, testimonios, FAQ, mapa, contacto, formulario, WhatsApp, automatización y SEO inicial.
7. **Vista en directo** para escritorio, tablet y móvil. La maqueta es ilustrativa. Los testimonios son textos claramente ficticios, los formularios están deshabilitados, no se hacen reservas ni se conectan a números reales de WhatsApp.
8. **Presupuesto con motor V8:** la base viene del sector; los extras se cobran solo si se selecciona el bloque correspondiente. Hay precios \`desde\` donde procede y mantenimiento opcional separado.
9. **Dos tipos de PDF:**
   - **Propuesta económica PDF real:** genera un PDF 1.4 multipágina en el navegador con desglose y brief, utilizando \`assets/proposal-v8.js\`.
   - **Vista del diseño en PDF:** botón \`Imprimir diseño / guardar como PDF\` usa la impresión del navegador. Selecciona «Guardar como PDF» en el diálogo del navegador. Para conservar imágenes y fondos, activa «imprimir gráficos de fondo» si fuera necesario.
10. **Edición de propuesta:** manda un paquete de sesión al editor V8 \`herramientas/propuestas-v8.html?studio=v9\`, que recupera brief, extras y mantenimiento y **elimina el paquete temporal**. Se pueden escribir el nombre del cliente y condiciones definitivas antes de crear el PDF.
11. **Traspaso responsable al CRM cifrado:** al pulsar \`Llevar idea a mi CRM privado\` se prepara una nota de sesión y se abre el CRM existente. Tras desbloquearlo, se muestra una opción para **rellenar** un contacto. El usuario debe revisar los datos y pulsar \`Guardar negocio\` para cifrarlos; el proceso **no guarda clientes automáticamente**. No se modifica la clave de almacenamiento del CRM \`alstudio-v10-crm-v1\` ni su AES-GCM/PBKDF2.
12. **Guardar/recuperar conceptos:** JSON V9 validado y limitado a 18 kB, sin almacenar contactos. Compartir por enlace usa un fragmento de URL \`#config=\` con datos del diseño, visible para cualquiera que reciba el enlace. No incluyas información privada en textos o nombres.
13. **Sin backend, APIs de pago, seguimiento ni cookies del constructor**: el navegador procesa todo localmente, y el traspaso entre páginas utiliza almacenamiento temporal de sesión. No existe sincronización de los diseños entre dispositivos.

## Archivos
- \`assets/builder-v9-core.js\`: núcleo puro con modelos, presets, precios, límites, JSON y enlaces.
- \`estudio/configurador-v9.html\`, \`configurador-v9.css\`, \`configurador-v9.js\`: la herramienta funcional.
- \`herramientas/propuestas-v8.html\` y \`herramientas/propuestas-v8.js\`: integración de propuesta editable.
- \`herramientas/crm.html\`: importación manual con cifrado original intacto.
- \`index.html\`, \`assets/growth-v7.css\`, \`sectores/*.html\`, \`sitemap.xml\`: accesos comerciales.
- \`scripts/check-v9.mjs\`: comprobación automática de catálogo, precios, rutas, PDF, bloqueos, restauración y conexiones.

## Cómo probar
1. Descarga el ZIP de la rama \`feature/v9-configurator-pro-20261028\`.
2. Extrae todo y abre una terminal en la carpeta raíz.
3. Sirve la web con \`py -m http.server 8000\` (o \`python -m http.server 8000\`).
4. Abre \`http://localhost:8000/estudio/configurador-v9.html\`.
5. Prueba sectores, textos, paletas, secciones, flechas, tres tamaños, JSON y enlace.
6. Genera el PDF, comprueba el importe y usa el botón de impresión para exportar la **vista visual** a PDF.
7. Abre la propuesta editable; verifica que el alcance aparece y ajusta destinatario y condiciones.
8. Desde el constructor, prepara un registro de prueba para el CRM, desbloquéalo, comprueba el aviso de importación, rellena y guarda solo si quieres almacenar un dato ficticio.
9. Ejecuta las cinco pruebas:
   \`\`\`bash
   node scripts/check-site.mjs
   node scripts/check-v6.mjs
   node scripts/check-growth.mjs
   node scripts/check-v8.mjs
   node scripts/check-v9.mjs
   \`\`\`

## Límites y seguridad
- **No crea/publica un sitio web terminado** ni implementa pagos, agenda real, pedidos, mapas reales o QR reales. Es un constructor conceptual comercial con vista previa interactiva.
- Cambiar textos y activar bloques no garantiza que cada nueva función esté incluida en la tarifa base. Los extras con precio definido se suman, pero el alcance definitivo debe revisarse.
- El PDF económico usa una fuente estándar WinAnsi; símbolos fuera de la codificación pueden sustituirse.
- El PDF visual depende de la impresión del navegador y de la configuración de fondos. Puede ocupar varias páginas.
- Los enlaces compartibles **incluyen los textos de la maqueta en el fragmento** y no deben distribuirse si contienen información confidencial.
- En CRM, usa dispositivo privado y guarda copias cifradas; perder contraseña o datos locales puede hacer irrecuperable la información. No es multiusuario.
- La V8/V9 hereda la integración opcional de FormSubmit, cuya entrega efectiva **no se ha comprobado**.
- Deben revisarse a mano diseño responsive, accesibilidad y cuestiones legales antes de publicar.
- **No hay testimonios reales, ingresos simulados ni garantías de conversión.**

## Publicación segura
La V9 se basa en la rama V8, que a su vez depende de V6/V7. Debe revisarse el historial en orden y fusionar solo tras la aprobación del propietario. No se ha publicado, enviado consultas ni alterado \`main\`.
