# Abel Automation V12 · WEB BUILDER PRO

**Estado:** desarrollado en la rama \`feature/v12-web-builder-pro-20261029\`, basada en V11. **NO** se ha fusionado en \`main\` ni publicado automáticamente en GitHub Pages.

## Lo que cambia de forma visible

Para que las novedades no pasen desapercibidas:
- Menú simplificado con acceso destacado **«★ Crear web V12»**.
- CTA principal de portada: **«Diseñar y descargar mi web ZIP»**.
- Centro de novedades en portada \`#novedades-v12\` y página independiente \`novedades.html\`, con los cambios V8–V12 y enlaces útiles.
- Cinco landings de sector con botón principal que abre V12 con el sector preseleccionado.
- Constructor V9 con botón para **continuar en V12 conservando configuración**.
- Planificador V10 con botón «Crear y descargar web V12 ZIP», conservando la selección de servicios.

## Constructor V12

\`estudio/builder-v12.html\`

### Diseño y edición
- Plantillas por 7 sectores, con marca, titular, texto de presentación, CTA y fotografía representativa.
- 6 paletas, colores manuales válidos, 4 estilos, 4 familias de letra y 3 distribuciones de portada.
- Edición directa en el iframe de vista previa: pulsa en marca, titular, subtítulo, CTA, encabezados de sección o tarjetas para modificar su texto. Los mensajes se aceptan únicamente desde ese iframe.
- Vista escritorio, tablet y móvil en iframe aislado mediante \`sandbox="allow-scripts"\`.
- 15 secciones con casillas y reordenación con flechas.
- Selección entre 6 fotografías del repositorio o subida opcional de fotografía propia JPG/PNG/WebP **máx. 2 MB**. Sin subida a ningún servidor.
- Nombre de negocio y contacto opcional. WhatsApp solo si se introduce un número válido con \`+\` y prefijo internacional. El correo solo si tiene formato válido.
- Presupuesto orientativo con el catálogo del motor V8 y mantenimiento separado.
- Generación PDF real local, con propuesta y descripción del proyecto.
- Traspaso a CRM cifrado local por sesión con revisión humana, igual que en las versiones anteriores.

### Exportación real en ZIP
Archivos generados:
- **\`index.html\`**: página HTML con estructura, contenido, enlaces, metadatos y secciones seleccionadas.
- **\`styles.css\`**: estilos independientes, colores, tipografía y distribución elegidos, modo móvil.
- **\`app.js\`**: navegación móvil, galería ampliable, formularios que **preparan correo** en la aplicación del visitante (no envían a un servidor).
- **\`assets/*.webp\`**: fotografías de plantilla incorporadas como archivos reales, accesibles sin depender del portfolio.
- **\`assets/hero-personalizada.png|jpg|webp\`** cuando el usuario haya subido una imagen de portada.
- **\`configuracion-v12.json\`**: respaldo reimportable al editor (puede contener datos de contacto que hayas introducido y fotografías incluidas como datos).
- **\`README.txt\`**: instrucciones y límites.

**Sin CDNs, librerías ZIP ni servicios web de terceros.** El ZIP se crea localmente con cabeceras PKZIP, CRC32, directorio central y codificación UTF-8. Se comprueba mediante \`unzip -t\` en GitHub Actions.

### Lo que NO promete la exportación
- No crea automáticamente una cuenta, base de datos, dominio ni despliegue público.
- El formulario únicamente abre una aplicación de correo con un mensaje preparado; el visitante debe decidir si lo envía.
- La reserva es una **solicitud por correo**, sin comprobación de disponibilidad ni confirmación.
- La carta digital muestra contenido, **no genera un QR ni recibe pedidos**.
- La dirección es texto, no un mapa con geolocalización.
- La sección «automatizaciones» no ejecuta flujos n8n.
- Los testimonios son un recordatorio para introducir opiniones auténticas: **no se inventan reseñas**.
- Las fotografías de demostración deben revisarse en cuanto a derechos antes de publicarlas en un proyecto comercial.
- Los precios son orientativos y no garantizan un alcance ilimitado.
- El archivo JSON puede contener los datos de contacto o imagen que el usuario incluyó. **No compartas el ZIP/JSON públicamente sin revisarlos.**

## Cómo probar

1. Descarga el ZIP del repositorio, rama V12.
2. Descomprime, abre una terminal dentro de la carpeta y ejecuta:
   \`\`\`bash
   py -m http.server 8000
   \`\`\`
3. Abre \`http://localhost:8000/\`. Verás el nuevo botón principal **V12**, la sección de novedades y un menú reducido.
4. Abre \`http://localhost:8000/estudio/builder-v12.html\`.
5. Prueba sector, titulares, estilo, color, imagen y casillas de secciones; pulsa sobre textos de la vista previa para editarlos.
6. Descarga **Web ZIP**, extráelo en una carpeta aparte y abre su \`index.html\` local. Verifica menú móvil, galería, imágenes, FAQ y el formulario si has configurado un email de prueba.
7. Prueba PDF y el traslado al CRM con una oportunidad ficticia. Para usar datos reales, revisa primero el documento de privacidad y protege los archivos.
8. Importa el JSON exportado y verifica que conserva la configuración.
9. Abre la V9 o el planificador V10 y utiliza el nuevo botón para continuar en V12.

## Automatización de pruebas

\`\`\`bash
node scripts/check-site.mjs
node scripts/check-v6.mjs
node scripts/check-growth.mjs
node scripts/check-v8.mjs
node scripts/check-v9.mjs
node scripts/check-v10.mjs
node scripts/check-v11.mjs
node scripts/check-v12.mjs
\`\`\`

Ocho suites en \`.github/workflows/check-site.yml\`. V12 comprueba:
- Exportación de HTML/CSS/JS para los siete sectores y el presupuesto original V8.
- Bloqueo de inyección de HTML, URL inseguras y archivos ZIP con rutas arbitrarias.
- Compatibilidad de importación JSON V9/V12 y fotografía propia.
- Construcción ZIP con imágenes y **apertura/extracción reales mediante \`unzip\`**.
- Formulario local, navegabilidad, accesibilidad básica de controles y enlaces a PDF/CRM.
- Existencia de fotos, rutas y nuevas páginas, además de preservación de las 25 demos.

## Antes de publicar el portfolio

La V12 requiere revisión manual real en dispositivos, especialmente edición dentro de iframe, subida de imágenes y PDFs. FormSubmit depende de activación y recepción de prueba; permanece sin verificar. Revisa privacidad, condiciones, textos, licencias, accesibilidad y la checklist de V11.

**Ramas encadenadas:** PR #2 V6/V7 → PR #3 V8 → PR #4 V9 → PR #5 V10 → PR #6 V11 → PR V12 (creado en esta entrega). Revisar y aprobar en orden; no fusionar \`main\` sin revisión.

Todo el trabajo está en GitHub; no se han modificado ni eliminado demos existentes.
