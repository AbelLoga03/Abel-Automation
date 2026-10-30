# Abel Automation V15 · STUDIO BUSINESS PRO

**Estado:** nueva rama \`feature/v15-studio-business-pro-20261030\`, basada en V14 \`feature/v14-studio-ultimate-20261030\`. El objetivo es entregar un editor y una web multipágina más útiles, conservando V9–V14 y las 25 demos. **No fusionar \`main\` automáticamente.**

## 1. Edición multipágina independiente
- En \`estudio/builder-v12.html\`, activa la casilla **Generar páginas HTML separadas**.
- En el panel V15 aparecen campos de titular, descripción, botón, distribución, bloques y fotografía propios de la página seleccionada.
- Puedes cambiar de Inicio a Nosotros, Servicios, Galería y Contacto sin sobrescribir el contenido de las otras páginas.
- La edición directa en el iframe y la barra contextual modifican los campos de la página activa. Fuera de modo multipágina continúan usando los valores comunes de V12/V14.
- El generador \`assets/multipage-v14.js\` combina esos datos con \`assets/page-studio-v15.js\`. Cada página genera HTML real, vinculado a archivos \`styles.css\` y \`app.js\` compartidos.
- Se mantiene la compatibilidad con el formato V9, V10, V12, V13 y V14, sin eliminar funcionalidades del editor anterior. La V15 amplía V14: no es un constructor de arrastre libre a nivel píxel ni un editor CSS arbitrario.

## 2. Fototeca propia y privada
- Hasta **cuatro fotos** JPG/PNG/WebP por proyecto en modo multipágina.
- El navegador convierte la imagen a WebP, hace un recorte centrado 16:9 y limita cada archivo a unos 1,45 MB.
- Las fotografías se asignan a páginas concretas; también pueden reutilizarse.
- La exportación ZIP genera archivos físicos en \`assets/v15-photo-*.webp\` y enlaza a ellos desde el HTML; no depende de la web de Abel Automation.
- Las imágenes no se guardan en la biblioteca local **sin cifrar**: se conservan solo en la sesión actual o cuando exportas manualmente el proyecto JSON/ZIP. Los archivos exportados **sí** pueden incluir imágenes privadas y datos de contacto; revísalos antes de publicarlos.
- La funcionalidad actual no permite reposicionar manualmente el recorte, editar con capas ni almacenar una galería ilimitada.

## 3. Formularios reales opcionales, con límites claros
- Modo por defecto: **Preparar correo**, utilizando la aplicación de correo del visitante. No se envía nada automáticamente.
- Modo opcional: **FormSubmit**, seleccionado expresamente desde los datos de contacto del editor. Añade la sección Formulario a la página Contacto.
- El HTML utiliza POST al proveedor externo indicado, campos nombre/correo/mensaje, checkbox de consentimiento obligatorio, honeypot y captcha del proveedor.
- **No hay credenciales ni claves secretas en el frontend.** No se inventa un backend, API, éxito de envío, antispam infalible ni activación de FormSubmit.
- Antes de utilizar solicitudes reales: activar/verificar el correo receptor con el proveedor, enviar un caso ficticio, comprobar recepción/spam y revisar los textos RGPD, proveedores, finalidad y conservación de datos. Aún no existe una integración de formularios con el CRM; el CRM continúa local y cifrado, separado de la web exportada.
- Si el proveedor no está activado, el formulario no es un canal de contacto probado. No se almacena automáticamente ninguna consulta en Abel Automation.

## 4. Entrega comercial y publicación guiada
- El ZIP multipágina contiene \`index.html\`, \`nosotros.html\`, \`servicios.html\`, \`galeria.html\`, \`contacto.html\`, \`styles.css\`, \`app.js\`, fotografías, \`configuracion-v12.json\`, \`estructura-v14.json\`, \`PAGINAS-V15.json\`, \`ENTREGA-V14.txt\` y \`ENTREGA-V15.txt\`.
- \`estudio/entrega-v15.html\`: checklist de siete pasos con informe TXT local; incluye revisión técnica, imágenes, privacidad, entrega y publicación autorizada. No recopila datos ni despliega.
- \`estudio/publicar-v13.html\`: auditoría previa de configuración JSON y guía para alojar webs estáticas. No modifica repositorios automáticamente.
- El presupuesto PDF y CRM cifrado siguen disponibles desde sus herramientas previas. No se han inventado clientes ni contratos.
- Para publicar un proyecto creado: descargar ZIP, extraerlo, revisar archivos en un servidor local, crear el repositorio web propio autorizado, subir los archivos finales y configurar GitHub Pages/dominio/HTTPS. Verificar el enlace final. **No compartir \`PAGINAS-V15.json\` con fotos privadas o datos del cliente si no hay autorización.**
- La publicación del portfolio principal también exige aprobación separada del PR; ningún botón de entrega modifica \`main\`.

## 5. Interfaz más clara
- Página principal y \`novedades.html\` resaltan V15.
- Studio reúne todas las herramientas, proyectos y demos, y ahora enlaza a la guía de entrega.
- Editor: el inspector por página solo se abre cuando el sitio es multipágina; el usuario ve las opciones que afectan de verdad a su exportación.
- La integración de V15 reutiliza las rutas de V14 en vez de crear módulos duplicados.

## 6. QA
- Suite \`scripts/check-v15.mjs\`: modelo de páginas y contenido independiente, archivo de imagen dentro de ZIP real descomprimido, opciones de formulario, consentimiento, sanitización y privacidad del guardado.
- Se conservan todas las suites anteriores de V6–V14, con una 11.ª suite en \`.github/workflows/check-site.yml\`.
- \`tests/v15-browser.spec.mjs\` y \`tests/v14-browser.spec.mjs\` se ejecutan sobre Chromium real, con capturas y trazas de fallo: edición, multipágina, imagen subida, formulario y descarga ZIP.
- \`.github/workflows/lighthouse-v15.yml\` genera informes JSON de rendimiento, accesibilidad, buenas prácticas y SEO para Studio y editor locales; se descargan desde los artefactos de GitHub Actions. Las puntuaciones no sustituyen auditoría legal o humana.
- **No se afirmará que pruebas o despliegues han pasado hasta verificar los workflows en el último commit.**

## Para probar la rama (sin publicar)
1. Descarga ZIP de la rama V15 desde GitHub.
2. Extráelo y ejecuta desde su raíz \`py -m http.server 8000\`.
3. Abre \`http://localhost:8000/estudio/builder-v12.html?new=1\`, activa multipágina y edita dos páginas.
4. Prueba añadir una fotografía sin información personal, elegirla en Galería y descargar el ZIP.
5. Extrae el ZIP y abre cada página HTML, especialmente \`contacto.html\`.
6. Abre \`http://localhost:8000/estudio/entrega-v15.html\` y revisa la checklist.
7. Usa datos ficticios para las pruebas comerciales; no envíes formularios de prueba a terceros sin su autorización.

**Seguridad de lanzamiento:** queda en Pull Request en borrador con base V14; V14 ya es PR #9 sobre \`main\`. Revisar ambos en orden y no fusionar \`main\` sin autorización y comprobación de CI.
