# Abel Automation V10 — CLIENT JOURNEY / COMPARADOR VISUAL

**Estado:** subido a GitHub en rama de desarrollo \`feature/v10-client-journey-20261028\`. Se basa en V9 y **no modifica la web pública ni \`main\`**.

## Objetivo
Convertir las demos y el configurador V9 en un recorrido de captación comercial útil. El visitante explica sus necesidades sin crear una cuenta, recibe una propuesta orientativa transparente y puede decidir si quiere convertirla en PDF, diseño visual, solicitud de contacto o nota local para CRM.

## Nuevos recursos

### 1. Planificador guiado
Ruta: \`experiencias/planificador-v10.html\`.

Cuatro pantallas:
1. Sector, situación actual y nombre de negocio opcional.
2. Objetivos: recibir consultas, mostrar productos, solicitudes de cita, mejorar imagen y automatizar tareas.
3. Complementos explícitos: WhatsApp, galería, SEO, carta QR, formulario, reservas, mapa, automatización.
4. Estado de los contenidos, plazo, presupuesto esperado y observaciones opcionales.

El motor \`assets/journey-v10-core.js\` aplica reglas **transparentes y deterministas** basadas solo en las respuestas. No afirma haber auditado una web externa ni garantiza más ventas.
- Si el objetivo son contactos, sugiere WhatsApp.
- Si son productos, sugiere galería.
- Si son citas, sugiere un formulario de solicitud de reservas, sin confirmación en tiempo real.
- Si es automatizar, sugiere un flujo n8n básico para estudiar, no una integración real.
- Elimina complementos duplicados y muestra advertencias cuando el presupuesto indicado es bajo, hay urgencia, faltan contenidos o debe revisarse una web existente.
- **Los precios son los del motor V8** (página base + complementos) y pueden llevar etiqueta \`desde\`.

Acciones del resultado:
- **Descargar PDF económico** real: se crea localmente con el motor V8.
- **Personalizar la propuesta** en el constructor V9: transfiere sector, nombre y complementos escogidos mediante \`sessionStorage\` y borra el paquete al recibirlo. Se ha añadido un bloque específico \`Automatización n8n\` a V9 para mantener coherencia en las tarifas; V9 tiene ahora **15 bloques** en esta rama.
- **Solicitar propuesta:** abre la portada y rellena únicamente sector y descripción del proyecto, sin enviar automáticamente nombre, correo ni datos personales. Se necesita revisar y realizar un envío voluntario; la recepción real depende de FormSubmit.
- **CRM privado:** prepara una nota temporal y, tras desbloquear el CRM, se requiere que el usuario rellene el registro y lo guarde cifrado. No se guardan oportunidades automáticamente.
- **Exportar JSON:** descarga un resumen de configuración normalizado, sin cuentas o correos de contacto.

### 2. Comparador antes/después
Ruta: \`experiencias/comparador-v10.html\`.

- Control deslizante de 0 a 100 % manejable también con teclado.
- Cinco sectores de ejemplo: restaurante, tienda, belleza, taller y alojamiento.
- Dos maquetas ficticias de la misma idea: una presentación genérica y otra trabajada visualmente.
- Fotografías existentes en el repositorio y textos propios de cada sector.
- Accesos a planificador y constructor V9 con el sector ya seleccionado.
- **No son proyectos reales de clientes ni métricas de resultados**. El antes/después ilustra decisiones de diseño, no demuestra aumento de ingresos.

### 3. Integración con portfolio y sectores
- Nuevo módulo destacado en \`index.html\`, navegación y enlace de contacto.
- Se conservan la V7 rápida, el constructor V9 y todos los módulos anteriores.
- Las cinco landings de sectores V8 ahora ofrecen el planificador V10 y el comparador, ambos preseleccionados para el sector.
- \`sitemap.xml\` actualizado.

## Seguridad y privacidad
- El asistente no usa cookies, backend, cuentas ni APIs externas.
- Los textos elegidos no se guardan automáticamente en archivos ni en GitHub.
- La exportación JSON descarga el archivo localmente.
- El paso hacia el CRM cifrado usa \`sessionStorage\` y requiere desbloqueo, revisión y clic explícito en Guardar. Conserva la clave \`alstudio-v10-crm-v1\`, PBKDF2 y AES-GCM de las versiones anteriores.
- El paso al formulario de contacto **no envía datos** automáticamente. El proveedor FormSubmit precisa activación del destinatario y una prueba real.
- Las fotografías locales del repositorio son ilustrativas. No se presenta ninguna persona o empresa ficticia como cliente real.
- Las propuestas económicas son orientativas; no incluyen necesariamente IVA, licencias, dominio, hosting ni servicios externos. El presupuesto definitivo requiere confirmación de alcance.
- El plazo solicitado no supone una promesa de disponibilidad.

## Probar en local
Descarga el ZIP de la rama y desde la carpeta del proyecto ejecuta:

\`\`\`bash
py -m http.server 8000
\`\`\`

Abre:
- \`http://localhost:8000/experiencias/planificador-v10.html\`
- \`http://localhost:8000/experiencias/comparador-v10.html\`
- \`http://localhost:8000/estudio/configurador-v9.html\`

Prueba los cuatro pasos, descarga el PDF, pasa al constructor y comprueba que el total no cambia; luego comprueba el formulario de contacto y el CRM con **datos ficticios**, antes de usar información real.

## Pruebas automatizadas

\`\`\`bash
node scripts/check-site.mjs
node scripts/check-v6.mjs
node scripts/check-growth.mjs
node scripts/check-v8.mjs
node scripts/check-v9.mjs
node scripts/check-v10.mjs
\`\`\`

El flujo \`.github/workflows/check-site.yml\` ejecuta las seis suites en GitHub Actions. V10 comprueba coherencia entre precios del planificador, V9 y PDF, manejo de extras duplicados, importación segura, rutas, avisos, CRM cifrado y control de comparación.

## Pendiente antes de publicar
- Prueba visual manual en pantallas móviles y navegadores distintos.
- Revisar textos y contraste/accessibilidad de elementos interactivos.
- Validación legal de privacidad, oferta comercial, IVA y condiciones aplicables.
- Activación y verificación real de entrega de FormSubmit.
- Fusionar únicamente con aprobación: V10 se basa en V9, que depende de V8, V7 y V6.

**No hay despliegue, fusión a \`main\` ni envíos de consultas realizados en este desarrollo.**
