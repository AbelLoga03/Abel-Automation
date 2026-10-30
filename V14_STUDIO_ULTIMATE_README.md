# Abel Automation V14 · STUDIO ULTIMATE

**Rama:** \`feature/v14-studio-ultimate-20261030\`. Parte del \`main\` publicado con V13. La V14 queda como candidata a integración mediante Pull Request; **no fusionar ni desplegar a \`main\` hasta revisar**.

## Estado anterior: auditoría de la V13 pública
- Se añadió \`scripts/audit-live-v13.mjs\`, un test HTTP que consulta la URL de GitHub Pages de la portada, Studio, constructor, asistente de publicación y novedades. Comprueba código HTTP y marcadores del contenido publicado.
- El trabajo de GitHub Actions \`public-v13-audit\` informa resultados reales; **una respuesta HTTP correcta no equivale a una inspección visual**.
- No se ha demostrado automáticamente el correo entrante de FormSubmit. Su recepción, textos de privacidad y pruebas en dispositivos adicionales siguen siendo tareas manuales.

## 1. Constructor visual avanzado
La V14 amplía \`estudio/builder-v12.html\` y su lógica:
- Barra de selección: haz clic sobre un texto editable del iframe, modifica el valor en el inspector y pulsa **Aplicar cambio**.
- Conserva la edición sobre el propio diseño, deshacer/rehacer, reorganizar bloques, duplicar tarjetas, imágenes por sección y vistas PC/tablet/móvil.
- Se mantienen los motores de presupuestos V8, el flujo con V9/V10 y CRM cifrado.
- **Alcance actual:** es un editor de textos, tarjetas, secciones e imágenes de plantilla, no un motor libre de arrastre y redimensionamiento de cualquier elemento HTML.

## 2. Mis proyectos PRO
- \`assets/projects-v14.js\` añade búsqueda, favoritos, estados y hasta **cuatro versiones históricas locales**, restaurables manualmente.
- Miniaturas **ilustrativas**, generadas con colores/textos del proyecto, no capturas fotorrealistas.
- Compatible con los proyectos V13 existentes; el formato V13 no se sustituye. V14 usa una clave adicional para metadatos/versiones.
- Ninguna versión guardada localmente contiene correo, teléfono, dirección ni fotografía propia subida, pues el almacenamiento **no está cifrado**. No hay nube ni sincronización.
- El archivo JSON/ZIP exportado manualmente sí puede contener datos que el usuario introdujo: revisarlo antes de compartir.
- El CRM cifrado se conserva separado de esta biblioteca.

## 3. Catálogo de plantillas
- \`assets/templates-v14.js\`: **21 presets** = siete sectores × tres direcciones visuales (**Editorial premium**, **Impacto visual**, **Minimalista**).
- Cada preset define paleta, tipografía, distribución y secciones. Son **combinaciones configurables** sobre el motor actual, no 21 webs construidas a mano con componentes totalmente diferentes.
- El selector destaca en el editor y se puede modificar cualquier opción después de aplicar el preset.

## 4. Exportación multipágina independiente
- \`assets/multipage-v14.js\`: permite generar las páginas \`index.html\`, \`nosotros.html\`, \`servicios.html\`, \`galeria.html\`, \`contacto.html\`.
- Cada una enlaza a las demás con rutas **relativas** y comparte \`styles.css\`, \`app.js\` y las fotografías contenidas en \`assets/\`.
- El editor permite activar el modo multipágina, elegir páginas y previsualizar su contenido.
- El ZIP incluye \`estructura-v14.json\` para documentar la navegación y \`ENTREGA-V14.txt\` con las condiciones de entrega.
- Se conserva el modo de página única V12 para proyectos antiguos. Los nombres del ZIP están limitados a una lista segura para evitar traversal.
- Los formularios **solo preparan correo** mediante mailto; reservas, QR, mapas dinámicos, pagos y automatizaciones reales necesitan desarrollo aparte. Las páginas exportadas no usan servidor propio.

## 5. Pruebas
- \`scripts/check-v14.mjs\`: comprueba presets, enlaces entre páginas, HTML/CSS/JS, navegación relativa, extracción ZIP real con \`unzip\`, protección de datos locales, proyectos/versiones y rutas.
- \`.github/workflows/check-site.yml\` conserva todas las pruebas anteriores e incorpora la **10.ª suite** V14.
- \`.github/workflows/browser-v14.yml\` ejecuta **Playwright Chromium real** con servidor de prueba local, capturas de escritorio/móvil y trazas en fallos. Comprueba portada/Studio, filtros y favoritos, edición de texto, plantilla elegida y ZIP multipágina descargado.
- El mismo workflow audita por HTTP la V13 realmente publicada.
- GitHub Actions puede aportar registros y artefactos verificables; no afirmar pruebas correctas hasta comprobar el estado final del workflow y el commit exacto.

## 6. Entrega/publicación
- \`estudio/publicar-v13.html\` admite también \`estructura-v14.json\` además de proyectos V9/V12. Su informe identifica requisitos técnicos y manuales; **no publica sin autorización**, ni envía datos.
- Tras descargar el ZIP multipágina, extrae y comprueba todos los archivos antes de alojarlo en un dominio o repositorio propio.
- Revisa textos y metadatos, derechos de fotografía, enlaces, accesibilidad, canal de contacto y política de privacidad; después verifica el sitio ya publicado en su dominio definitivo.
- La V14 requiere integración controlada en \`main\`; nunca se mezcla automáticamente en producción desde el editor.

## Instrucciones para probar la rama
1. Descarga el ZIP de la rama V14 desde GitHub o clona el repositorio.
2. Abre una terminal en la raíz: \`py -m http.server 8000\` en Windows.
3. Visita \`http://localhost:8000/estudio/studio-v13.html\` para la biblioteca PRO.
4. Visita \`http://localhost:8000/estudio/builder-v12.html?new=1\`, elige un preset, activa el modo multipágina y descarga el ZIP.
5. Extrae el ZIP en otra carpeta y navega entre las páginas \`.html\` sin depender del portfolio.
6. Para las pruebas sin navegador: \`node scripts/check-v14.mjs\`. Para Chrome real: \`npx playwright test\` tras instalar \`@playwright/test\` y Chromium.

## Publicación estable
**No fusionar \`main\` automáticamente**. Revisar el Pull Request, el estado de las diez suites y de Playwright en el **último commit**, comparar con \`main\` para detectar borrados o cambios a demos, revisar privacidad y probar la recepción del formulario por correo en entorno autorizado. Tras aprobar, fusionar y comprobar GitHub Pages en el commit realmente desplegado.
