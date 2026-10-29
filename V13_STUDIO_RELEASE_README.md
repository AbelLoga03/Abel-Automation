# Abel Automation V13 · EXPERIENCE CENTER + PUBLICACIÓN

**Estado del código:** V13 se basa en V12 y contiene todas las mejoras V6–V13. Esta rama se preparó para publicar en \`main\` por petición expresa de ponerlo en https://abelloga03.github.io/Abel-Automation/. El resultado real del despliegue debe confirmarse en GitHub Pages tras fusionar.

## Novedades de la V13

### 1. Studio central
- \`estudio/studio-v13.html\`: nuevo punto de entrada para crear webs, abrir mis proyectos, acceder a presupuestos PDF, CRM local cifrado, planificador y 25 demos.
- Tarjetas grandes y claras, entradas a V9/V10/V11/V12 y enlace a guía de prepublicación.
- La portada del portfolio destaca Studio V13 y mantiene herramientas y demo anteriores.
- \`novedades.html\` añade V13 a la cronología de versiones.

### 2. Mis proyectos y autoguardado
- \`assets/projects-v13.js\`: guardar, abrir, duplicar, renombrar y eliminar hasta 12 proyectos en el **almacenamiento local de este navegador**.
- Autoguardado del último diseño mientras se edita (si el navegador permite almacenamiento local).
- Recuperación del borrador desde Studio. Un enlace «Crear nueva web» evita sobrescribirlo en la interfaz.
- **Privacidad:** esta biblioteca local NO está cifrada. Por tanto elimina del guardado local correo, teléfono, dirección y fotos propias en base64. Los archivos JSON que se exporten manualmente **sí pueden incluirlos**; revisarlos antes de compartir. No hay cuenta, sincronización ni backup remoto.
- El CRM se mantiene separado y con su cifrado AES-GCM/PBKDF2 y almacenamiento anterior. No se modifican registros ni contraseñas.

### 3. Editor V12 mejorado sin perder exportación
- Historial de 35 pasos con botones **Deshacer / Rehacer**.
- Reordenar bloques arrastrando y soltando, manteniendo las flechas como alternativa de teclado.
- Duplicar y eliminar tarjetas en Servicios y Productos (1 a 6 tarjetas por conjunto).
- Seleccionar fotografías independientes para bloques «Sobre nosotros», «Servicios», «Productos» y «Galería».
- Los cambios se conservan al generar HTML/CSS/JS y ZIP, y al exportar/importar configuración.
- Mantiene los motores V8 de PDF, V9 de precios, V10 de planificación y el traspaso manual al CRM.

### 4. Publicación asistida
- \`estudio/publicar-v13.html\`: analiza el JSON de una web exportada y comprueba contenidos, HTML/SEO, bloques y canales de contacto.
- Muestra controles que **requieren revisión humana** (derechos de las fotografías, condiciones de privacidad y experiencia en dispositivos).
- Proporciona instrucciones y un informe \`.txt\` generado localmente.
- **No publica automáticamente webs de terceros**, ni recibe sus contraseñas, repositorios o claves.

## Cómo probar
Abre la web publicada o, para probar una rama, descarga el ZIP de GitHub y ejecuta:

\`\`\`bash
py -m http.server 8000
\`\`\`

Recursos:
- \`/index.html\` — portada comercial con acceso prominente a Studio.
- \`/estudio/studio-v13.html\` — panel de inicio y mis proyectos.
- \`/estudio/builder-v12.html?new=1\` — editor mejorado.
- \`/estudio/publicar-v13.html\` — guía local de prepublicación.
- \`/novedades.html\` — V8–V13.

## Pruebas automatizadas
El workflow \`.github/workflows/check-site.yml\` ejecuta las **9 suites** de V14 legacy, V6, V7, V8, V9, V10, V11, V12 y V13. Se valida entre otros:
- 25 demos y herramientas anteriores.
- ZIP creado, descomprimido y rutas HTML/CSS/JS.
- Seguridad de importación y escapado HTML.
- CRUD de biblioteca de proyectos, exclusión de contactos y fotos propias del guardado local.
- Edición, ordenación, historial, fotos por sección y botones de navegación.
- Revisión de metadatos antes de publicar y enlaces.
- Precios del catálogo, PDF, compatibilidad CRM y ausencia de backend engañoso.

## Límites / controles manuales antes de trabajar con clientes
1. Confirmar de forma real activación y recepción del formulario FormSubmit. Las pruebas de CI **no** prueban entrega del correo.
2. Revisar el sitio en móvil, tablet y escritorio, con ratón y teclado.
3. Revisar RGPD, avisos, textos comerciales, derechos de imágenes y política de privacidad.
4. Mantener copias **cifradas y verificadas** del CRM si se usa con información real. No guardar esos datos en GitHub.
5. Verificar el despliegue de Pages y los nuevos enlaces públicos después de fusionar; el hecho de que CI esté verde no significa que Pages haya publicado todavía.

## Integración
La rama V13 acumula la historia de V6–V12. Por seguridad, antes de fusionar se comprueba que no haya archivos eliminados frente a \`main\` y que los módulos antiguos sigan disponibles. La integración puede realizarse mediante un PR V13→\`main\` tras verificar las nueve suites. Los PR #2–#7 son propuestas históricas encadenadas y pueden cerrarse como sustituidos **solo después de una integración correcta en \`main\`**.

**No se crean clientes, ingresos, reservas reales ni servicios externos automáticamente.**
