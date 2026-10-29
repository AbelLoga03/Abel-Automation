# Abel Automation — V8 REVENUE ENGINE

**Estado:** implementado en rama de desarrollo, **sin publicar** en GitHub Pages y sin sobrescribir \`main\`.
**Rama:** \`feature/v8-revenue-engine-20261028\`
**Depende de:** \`feature/abel-automation-v6-pro-20261027\` (V6/V7), todavía en revisión en el PR #2.

## Objetivo
Facilitar el recorrido comercial: sector → demostración → presupuesto → propuesta PDF → gestión privada de oportunidades. No prometemos ventas ni conversiones garantizadas.

## Novedades

### 1. Propuestas económicas PDF
- \`herramientas/propuestas-v8.html\` y \`herramientas/propuestas-v8.js\`: editor de proyecto, cliente opcional, alcance, notas, validez, descuento controlado, mantenimiento y extras.
- \`assets/proposal-v8.js\`: genera archivos **PDF 1.4 reales, descargables y de varias páginas** directamente en el navegador, sin servidor ni librería externa.
- Usa la tabla de precios V6 (10 webs, 11 extras, 5 opciones de mantenimiento, incluida sin plan). El script de pruebas coteja ambos catálogos.
- El mantenimiento se calcula por separado del desembolso inicial. Los importes "desde" se señalan.
- El botón \`Generar propuesta PDF V8\` del presupuestador principal transfiere web, extras y mantenimiento. Cuando el usuario aplica un pack V6 con una selección coincidente, se aplica su descuento.
- Copia de resumen y vista para imprimir. PDF con tipografías estándar WinAnsi; caracteres fuera de dicha codificación pueden mostrarse como "?".

### 2. Cinco landings orientadas a sectores
- \`sectores/restaurantes.html\`: restaurantes y cafeterías.
- \`sectores/peluquerias.html\`: peluquerías y estética.
- \`sectores/talleres.html\`: talleres y reparación informática.
- \`sectores/comercios.html\`: tiendas y comercio local.
- \`sectores/alojamientos.html\`: hoteles y alojamientos rurales.

Cada landing tiene un mensaje sectorial, ejemplos/demos no oficiales enlazadas, características concretas, una explicación de cómo se trabaja y accesos al configurador de presupuestos. Se añade a \`sitemap.xml\` para facilitar su descubrimiento. No se inventan clientes, testimonios ni logros.

### 3. Mini CRM cifrado extendido sin romper datos anteriores
- Se mantiene \`herramientas/crm.html\`, que ya utilizaba PBKDF2-SHA256 y AES-GCM con Web Crypto.
- **No cambiamos** la clave de almacenamiento \`alstudio-v10-crm-v1\`, ni la estructura cifrada previa. Los registros anteriores deberían seguir pudiendo desbloquearse con la contraseña original.
- Nuevas funciones: importe orientativo de la oportunidad, visualización de valor por negocio y suma orientativa del pipeline.
- Mantiene búsqueda, estados, seguimiento, edición, eliminación, bloqueo y copias cifradas.
- **Los ingresos reales no se deducen de este CRM**; los importes son previsiones introducidas manualmente.
- Los datos permanecen cifrados en el navegador y no se envían a GitHub. No hay sincronización entre equipos. No introduzcas datos de clientes sensibles ni utilices un dispositivo compartido.
- Debes conservar copias de seguridad cifradas. Si pierdes la contraseña o eliminas el almacenamiento local, no puedes recuperar esos datos.

## Sin pérdida del proyecto anterior
Se conservan las 25 demos, la V7 Nightshift, Creative Lab, precios, comparador, herramientas, páginas V14 y sus copias de seguridad. La V8 solo modifica la portada, mejora CRM, añade scripts, páginas sectoriales y nuevas comprobaciones.

## Abrir en local
1. Descarga ZIP de la rama y descomprímelo.
2. Desde la carpeta raíz, ejecuta \`py -m http.server 8000\` (o \`python -m http.server 8000\`).
3. Visita \`http://localhost:8000/\`, entra en \`#sectores\` o usa \`herramientas/propuestas-v8.html\`.
4. Para CRM cifrado, usa HTTPS en GitHub Pages o \`localhost\`; el cifrado Web Crypto requiere un contexto seguro.

## Validación automatizada
\`\`\`bash
node scripts/check-site.mjs
node scripts/check-v6.mjs
node scripts/check-growth.mjs
node scripts/check-v8.mjs
\`\`\`
GitHub Actions ejecuta esos cuatro scripts.
Las pruebas V8 verifican precios, sumas, descuentos, PDF de una y varias páginas, referencias del documento, enlaces sectoriales y preservación del cifrado del CRM.

## Pendientes antes de publicar
- Revisión visual en Chrome/Firefox/Safari y móvil de todas las pantallas.
- Confirmar mediante una prueba real la recepción del formulario FormSubmit, que está sujeto a activación del destinatario.
- Revisión legal de textos, privacidad, IVA, condiciones y datos profesionales.
- Comprobar que las imágenes externas de las demos se cargan; las landings nuevas utilizan las imágenes locales existentes.
- Para un CRM empresarial multiusuario o accesible desde varios dispositivos es necesario un backend autenticado y almacenamiento seguro: **no se implementa un servidor privado dentro de GitHub Pages**.

## Publicación
La V8 está preparada para revisión incremental sobre la rama V7. Primero se revisa e incorpora la V6/V7; después se puede fusionar la V8. No se ha realizado ninguna fusión ni despliegue público automático.
