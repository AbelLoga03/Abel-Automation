# Abel Automation V16 · Studio Business Ultimate

**Rama:** \`feature/v16-studio-business-ultimate-20261030\`  
**Base:** \`feature/v15-studio-business-pro-20261030\` (PR #10), que a su vez depende de V14 (PR #9).  
**Producción:** \`main\` permanece intacta. No hay publicación automática ni conexión a datos reales de clientes.

## Auditoría inicial de V14 y V15
- PR #9 y PR #10 abiertos, en borrador, sin fusionar y considerados fusionables por GitHub.
- Último SHA comprobado de V15: \`b04d0bc9821a92e8089fab187067a181e62ba7a6\`.
- En V15: suite de regresión, Playwright Chromium y Lighthouse concluidos correctamente para ese SHA, según GitHub Actions.
- Comparación V15 contra \`main\`: 65 commits adicionales, 0 archivos eliminados, 0 cambios en \`demos/\`.
- Pendiente **antes de publicar** V14/V15/V16: revisión visual real por persona, verificación del correo externo FormSubmit, licencias de fotos, privacidad y derechos sobre datos, aprobación explícita y publicación en orden.

## Implementado en V16

### 1. Bloques reutilizables y editor contextual
- \`assets/blocks-v16.js\`: cuatro componentes seguros (Destacado, Llamada a la acción, Proceso y Aviso informativo), con título, descripción, CTA, enlace permitido, alineación y fondo.
- Editor \`estudio/builder-v12.html\`: añadir hasta 8 bloques por página, editar su contenido, duplicar, mover, borrar y guardar hasta 10 bloques en biblioteca.
- Insertar desde la biblioteca crea una **copia independiente**; cambiar esa copia no cambia el bloque original.
- Los bloques se pueden seleccionar en la vista previa con ratón o teclado. Se exportan como HTML real y estilos responsive en \`styles.css\`.
- Enlaces limitados a páginas HTML internas o anclas; textos tratados como datos y escapados. **No** se admite HTML arbitrario ni se permite incrustar scripts de terceros a través de esos campos.
- El resto del editor V9–V15 sigue funcionando (sectores, plantillas, páginas independientes, fotos, formulario opcional, historial, PDF y CRM).
- **Límite:** el editor no permite arrastrar elementos libremente a cualquier posición o cambiar dimensiones píxel a píxel. Sí permite mover y personalizar componentes completos.

### 2. Revisión de un proyecto por un cliente, sin backend
- \`assets/review-v16.js\` genera \`REVISION-V16.html\` dentro del ZIP multipágina: archivo offline de revisión con selector de página, comentario y estado (pendiente / cambios / aprobación propuesta).
- La persona revisora puede generar \`COMENTARIOS-V16.json\`; debe devolverlo por el canal previamente acordado.
- El creador importa el archivo al editor V16 y consulta las observaciones. No se envían ni almacenan en servidores de Abel Automation, ni se añaden al CRM automáticamente.
- **No** hay cuentas de cliente, enlaces privados con autenticación, aprobación legal vinculante, firma o sincronización de comentarios. No debe venderse como portal online de clientes.

### 3. Presupuesto y CRM existentes, mejor documentados
- \`FICHA-V16.txt\` incluida en el ZIP con sector, alcance, páginas, número de componentes y presupuesto **orientativo** calculado por el motor de precios ya existente.
- La ficha no incluye dirección, correo ni teléfono, y no certifica la aceptación de ningún contrato.
- El botón PDF genera una propuesta con referencia a V16. El traspaso a CRM sigue siendo **manual** y local, a través del módulo cifrado existente.
- Los formularios externos dependen de FormSubmit (opt-in, consentimiento, verificación real del destinatario). **No** se ha incorporado un backend ni una sincronización de formularios con el CRM.

### 4. Comprobación automática antes de **cada exportación ZIP**
- \`assets/preflight-v16.js\` comprueba metadatos básicos, que existan index.html, CSS/JS, recursos y rutas internas. Rechaza rutas inseguras y vínculos a recursos inexistentes.
- Si hay errores críticos, el editor detiene la descarga. Cuando pasa, añade \`CALIDAD-V16.txt\` con recuento de páginas, imágenes, enlaces, errores y avisos.
- El ZIP incluye \`COMPONENTES-V16.json\`, \`ENTREGA-V16.txt\`, \`FICHA-V16.txt\` y, para sitios multipágina, \`REVISION-V16.html\`.
- **No** equivale a Lighthouse completo, pruebas externas, accesibilidad certificada, RGPD validado, pruebas de emails, pagos ni publicación en el hosting final.

### 5. Publicación controlada
- Se conserva \`estudio/entrega-v15.html\` con los pasos de entrega y autorización; la V16 incluye un informe de calidad por ZIP.
- Nunca se requieren ni guardan tokens de GitHub para exportar. No se despliega ninguna web desde el editor.
- Para publicar, revisar ZIP, autorización, derechos y privacidad, luego realizar el despliegue en un repositorio o servicio autorizado y comprobar la URL final.

## Pruebas
- \`scripts/check-v16.mjs\` añade la duodécima suite: lógica del componente y aislamiento, XSS, revisión offline, ZIP real (\`unzip -t\`), verificador de recursos y persistencia local segura.
- \`tests/v16-browser.spec.mjs\`: Chromium real, con creación de bloque, biblioteca, edición independiente por página, ZIP descargado y apertura de la web y hoja de comentarios offline.
- \`playwright.config.mjs\` incluye V14, V15 y V16.
- \`.github/workflows/check-site.yml\` ejecuta todas las suites V6–V16; \`.github/workflows/browser-v14.yml\` ejecuta Chromium y auditoría HTTP pública de V13; \`.github/workflows/lighthouse-v15.yml\` mide Studio y editor locales. Las puntuaciones pertenecen a las ejecuciones realizadas, nunca a clientes ni webs exportadas.
- **No se deben declarar verdes los tres workflows hasta confirmar su resultado para el último SHA de V16.**

## Probar la rama
1. Descarga el ZIP de la rama y extráelo.
2. Ejecuta \`py -m http.server 8000\` desde la carpeta raíz.
3. Abre \`http://localhost:8000/estudio/builder-v12.html?new=1\`.
4. Añade un bloque V16, edítalo, guárdalo en la biblioteca; activa multipágina y usa una copia en Servicios.
5. Descarga el ZIP y extrae sus HTML, CSS, JS y archivos de \`assets/\`. Lee \`CALIDAD-V16.txt\` y \`FICHA-V16.txt\`.
6. Abre \`REVISION-V16.html\`, crea un comentario ficticio, exporta JSON e impórtalo en el editor.
7. Revisa también el PDF orientativo y la opción de traspaso manual al CRM, sin datos reales.

## Orden de integración
**Primero PR #9 V14 → main, después PR #10 V15 → main, luego PR V16 → main**. Revisar posibles conflictos, la privacidad, las 25 demos y las pruebas en cada etapa. Mantener PRs en borrador mientras no haya autorización explícita de fusión.
