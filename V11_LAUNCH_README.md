# Abel Automation — V11 LAUNCH & SALES

**Estado:** candidato de publicación en rama \`feature/v11-launch-sales-20261029\`, **sin fusionar \`main\`**. Se basa en \`feature/v10-client-journey-20261028\`, que a su vez depende de V9, V8 y V6/V7.

## Qué añade V11

### 1. CRM: agenda comercial local y privada
- Panel de tareas **atrasadas, de hoy y en los próximos 7 días**, calculadas con la fecha local del dispositivo.
- Filtro de seguimiento sin perder los filtros por etapa o la búsqueda comercial.
- **Descargar recordatorio .ics** desde cada oportunidad que tenga una fecha válida. Genera un evento de día completo para importar manualmente en el calendario del usuario. **No** crea notificaciones externas ni se conecta a Google Calendar.
- El evento exportado contiene el nombre del negocio: revisarlo antes de compartirlo.
- Cuando se bloquea el CRM, se ocultan el tablero, las estadísticas y el resumen de seguimiento visibles.
- Se preservan la clave local \`alstudio-v10-crm-v1\`, AES-GCM, PBKDF2-SHA256, iteraciones y estructura de registros previos.
- **No** se suben clientes a GitHub. El CRM sigue siendo local, cifrado y sin sincronización automática.

### 2. Contacto comercial con explicación honesta
- Formulario con sectores añadidos (peluquería/estética y talleres/reparaciones), consejos para describir necesidades y contador de caracteres.
- Mensajes y estados accesibles y una opción alternativa de correo.
- **Enviar solicitud** y **preparar borrador** son acciones distintas. El envío necesita una acción expresa y consentimiento; el borrador no se transmite por sí mismo.
- El servicio real utiliza **FormSubmit**, sujeto a verificación del buzón. Ni la navegación a \`gracias.html\` ni los scripts de CI prueban recepción real. Hay que probarlo con el propietario del buzón y revisar Spam.

### 3. SEO local útil
- Nueva página \`servicios/web-local-v11.html\`, con texto original para servicios de diseño web en **Ubrique, Ronda y Cortes de la Frontera**, tipos de proyectos, pasos de trabajo y preguntas frecuentes.
- No afirma que existan oficinas, clientes contratados, garantías de visita presencial ni resultados económicos.
- Añadida al portfolio, \`sitemap.xml\` y metadatos Open Graph.

### 4. Checklist de publicación local
- \`herramientas/lanzamiento-v11.html\`, página \`noindex,nofollow\` para revisión manual.
- 8 condiciones críticas; otras comprobaciones recomendadas; resumen, barra de progreso y exportación local \`.txt\`.
- Conserva **solo las marcas booleanas** en \`localStorage\`, no nombres de clientes ni contraseñas.
- El estado es **autodeclarado**, no una certificación automática. No ejecuta cambios, no despliega nada y **no autoriza** una publicación.

### 5. Pruebas de regresión
- \`assets/followups-v11.js\`: módulo reutilizable y testeable de fechas locales, prioridades, estadísticas y formato iCalendar.
- \`assets/launch-readiness-v11.js\`: modelo sin backend de controles críticos y exportación.
- \`scripts/check-v11.mjs\`: verificaciones de fechas (incluidos años bisiestos), .ics, límites de líneas, datos del formulario, bloqueo/cifrado de CRM, SEO, sitemap y rutas locales.
- **7 suites** en \`.github/workflows/check-site.yml\`: V14/legacy, V6, V7, V8, V9, V10 y V11.

## Para probar sin publicar

1. Descarga el ZIP de la rama V11 y extráelo.
2. Desde la carpeta principal ejecuta:
   \`\`\`bash
   py -m http.server 8000
   \`\`\`
3. Visita:
   - Portfolio: \`http://localhost:8000/\`
   - CRM: \`http://localhost:8000/herramientas/crm.html\`
   - SEO local: \`http://localhost:8000/servicios/web-local-v11.html\`
   - Checklist: \`http://localhost:8000/herramientas/lanzamiento-v11.html\`
4. Usar **datos ficticios** para revisar CRM, imprimir un \`.ics\`, filtros y cifrado. **Antes de usar datos reales**, exportar una copia cifrada del CRM existente y ensayar restauración en un perfil de navegador diferente.
5. Ejecutar todas las pruebas:
   \`\`\`bash
   node scripts/check-site.mjs
   node scripts/check-v6.mjs
   node scripts/check-growth.mjs
   node scripts/check-v8.mjs
   node scripts/check-v9.mjs
   node scripts/check-v10.mjs
   node scripts/check-v11.mjs
   \`\`\`

## Gate de publicación: pasos que requieren intervención humana

**NO PUBLICAR hasta completar y confirmar manualmente:**

1. GitHub Actions verde en el commit exacto candidato.
2. Revisar las **25 demos**, PDFs y formularios en Chrome/Firefox y un dispositivo móvil real. La suite automática no representa un navegador real.
3. Probar envío real del formulario al correo autorizado: activación del destinatario FormSubmit, una consulta ficticia, comprobación de bandeja y spam. Si no funciona, no anunciar el formulario como operativo.
4. Revisar protección de datos, condiciones comerciales, textos del proveedor externo, tratamiento y conservación. El contenido de \`privacidad.html\` es informativo y requiere revisión legal.
5. Revisar accesibilidad con teclado, contrastes, etiquetas y carga de imágenes.
6. Verificar el sitemap, canonical, robots.txt y URLs después de la publicación real.
7. Guardar copia de seguridad **cifrada y verificable** del CRM. No almacenar contraseñas ni copias con contactos en GitHub.
8. Comprobar que las demos son ficticias y que las propuestas describen precios orientativos, IVA y servicios externos.

## Plan de incorporación, no realizado

Estas ramas dependen unas de otras. Revisar y aprobar en el siguiente orden:
- PR #2: V6/V7, basada en \`main\`.
- PR #3: V8, basada en V6/V7.
- PR #4: V9, basada en V8.
- PR #5: V10, basada en V9.
- PR #6: V11, basada en V10.

Tras la revisión, fusionar o adaptar las bases con cuidado, comprobar cada conjunto de cambios, publicar con GitHub Pages cuando el propietario lo autorice y verificar la versión pública. El orden podría requerir actualizar las ramas base.

**No se ha cambiado \`main\`, no se ha hecho despliegue, no se ha enviado correo y no se ha afirmado que existan clientes reales.**

## Riesgos pendientes
- El servicio externo FormSubmit no puede validarse automáticamente por CI, ni activarse sin acceso/control del buzón.
- El CRM es cifrado, pero depende del navegador, de copias verificadas y de la contraseña original. No es multiusuario ni ofrece copias remotas automáticas.
- El SEO no garantiza visitas ni puestos en buscadores.
- El sitio necesita revisión manual de accesibilidad, textos profesionales y experiencia de usuario.
