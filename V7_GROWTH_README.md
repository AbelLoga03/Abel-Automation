# Abel Automation — GROWTH V7 / Creative Lab

## Objetivo
Convertir el portfolio estático en una experiencia comercial de servicios independientes: comunicar valor, ayudar a elegir un producto digital, hacer tangible el diseño y facilitar la solicitud de presupuesto **sin prometer ventas garantizadas**.

**Estado:** nueva propuesta en la misma rama de revisión V6 PRO, aún no fusionada con \`main\`. La web pública sigue siendo la anterior.

## Identidad visual original
- Dirección **NIGHTSHIFT**: base tinta oscura, coral cálido, turquesa y superficies crema.
- Reinterpretación editorial del hero, tarjetas, demos, calculadora, precios, herramientas y contacto.
- Sin dependencia visual de IONOS ni frameworks pesados.
- Responsive y compatibilidad con \`prefers-reduced-motion\`, foco visible y controles accesibles.

## Creative Lab — configurador en directo
En \`/#estudio\` el visitante puede:
1. Elegir entre restaurante/cafetería, comercio, servicios, belleza, turismo y otro sector.
2. Cambiar entre estilo Editorial, Impacto y Esencial.
3. Seleccionar WhatsApp, galería, formulario, SEO, carta QR interactiva y automatización n8n.
4. Cambiar el marco entre escritorio y móvil.
5. Ver texto, fotografía sectorial, tipografía, colores y funciones del prototipo en tiempo real.
6. Consultar precio orientativo según la **misma tabla de tarifas** de \`assets/v6-pro.js\`.
7. Pulsar «Ver desglose completo» para aplicar la selección al presupuesto, incluidos sus extras, o «Solicitar esta idea» para completar el mensaje de contacto con el resumen de la propuesta.

El Creative Lab no produce código HTML de un negocio ni publica su web; es una **visualización conceptual** con cálculo basado en precios.

## Captación: envío real y alternativa local
En \`/#contacto\` hay dos acciones separadas:
- **Enviar solicitud real:** tras validar campos y comprobar el consentimiento, el navegador envía una solicitud POST al endpoint FormSubmit ya utilizado en la V14.
- **Preparar borrador:** únicamente crea un texto local que se puede copiar; **no envía** los datos a FormSubmit.

### Activación indispensable
El servicio de envío **necesita una verificación previa del destinatario**. Esta integración no demuestra entrega efectiva por el mero hecho de existir el HTML. Antes de utilizarla comercialmente:
1. Publica la versión tras revisarla.
2. Envía una consulta de prueba con tus propios datos no sensibles.
3. Abre la confirmación de FormSubmit en el buzón receptor y verifica la dirección.
4. Envía otra solicitud y verifica que llega a la bandeja real.
5. Revisa la política de privacidad y las condiciones legales aplicables.

No se añade ningún teléfono ni dirección postal privada.

## Conservación de contenido
- Las **25 demos V6** siguen enlazadas, incluidas 21 demos heredadas y las cuatro nuevas (restaurante, alojamiento, peluquería y servicio técnico).
- Se conservan los módulos anteriores: \`servicios/\`, \`herramientas/\`, la calculadora y sus precios, packs, FAQs, comparador, \`index-v14.html\`, \`v6-pro.html\` y los respaldos bajo \`legacy/\`.
- Los archivos nuevos tienen nombres independientes, y el CSS V7 va después de V6, para poder desactivarlo sin borrar contenido.

## Archivos nuevos o modificados
- \`assets/growth-v7.css\`: identidad y componentes del estudio visual.
- \`assets/growth-v7.js\`: cambio de sector, estilo, extras, viewport y conexión con presupuesto/contacto.
- \`index.html\`: navegación, copy comercial, sección Creative Lab, formulario con dos acciones.
- \`assets/v6-pro.js\`: envío explícito a FormSubmit, borrador conservado.
- \`privacidad.html\` y \`gracias.html\`: información y estética coherentes.
- \`scripts/check-growth.mjs\`: prueba de interacciones usando un DOM simulado, sin librerías extra.
- \`.github/workflows/check-site.yml\`: validación heredada V14, V6 y Growth.

## Cómo abrir y comprobar
1. Descarga el ZIP de la rama y extrae su contenido.
2. Abre \`index.html\` para exploración rápida.
3. Para servir el sitio en local: desde la carpeta raíz ejecuta \`py -m http.server 8000\` y visita \`http://localhost:8000\`.
4. Prueba \`#estudio\` (6 sectores, 3 estilos, extras, móvil/escritorio), luego \`#presupuesto\` y \`#contacto\`.
5. Ejecuta:
   \`\`\`bash
   node scripts/check-site.mjs
   node scripts/check-v6.mjs
   node scripts/check-growth.mjs
   \`\`\`
6. Revisa las comprobaciones de GitHub Actions antes de publicar.

## Publicar con control
- Los cambios están en la rama \`feature/abel-automation-v6-pro-20261027\`.
- Revisa el Pull Request #2 y deja la rama \`main\` intacta hasta aprobar.
- Al fusionar, GitHub Pages seguirá usando la raíz del repositorio como hasta ahora, siempre que su configuración apunte a \`main\`.

## Limitaciones honestas
- **No hay garantía de ingresos, de conversión comercial ni de posicionamiento SEO.** Es una mejora en la experiencia de captación y presentación.
- La maqueta del configurador es conceptual: no crea una web terminada por cada combinación.
- Algunas demos antiguas son conceptuales; no se han reescrito sus contenidos históricos.
- FormSubmit requiere activación y prueba real de recepción. GitHub Actions no prueba la entrega al destinatario.
- El coste final, IVA, servidor, dominio, integraciones, licencia o mantenimiento se confirma por propuesta.
- No se ha realizado auditoría jurídica ni de WCAG exhaustiva; verificar comportamiento en dispositivos y accesibilidad con pruebas manuales.
- Las nuevas demos con fotos Unsplash necesitan conexión a internet. El Creative Lab reutiliza fotografías locales del repositorio.
