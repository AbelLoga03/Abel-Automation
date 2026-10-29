> **Actualización 28/10/2026 — Growth V7:** Esta rama incluye el rediseño NIGHTSHIFT, el Creative Lab y un **envío de consultas opcional mediante FormSubmit** (pendiente de verificar recepción). La opción de borrador local sigue disponible. Consulta [V7_GROWTH_README.md](V7_GROWTH_README.md). La descripción del formulario V6 que figura más abajo se refiere al comportamiento anterior.

# Abel Automation · Portfolio V6 PRO

**Estado:** propuesta de actualización en rama, pendiente de revisión y publicación.
**Rama:** `feature/abel-automation-v6-pro-20261027`
**Producción:** https://abelloga03.github.io/Abel-Automation/

## Qué incluye
- Portada premium en tonos oscuros y verde lima; responsive, menú móvil y animaciones con `prefers-reduced-motion`.
- 25 demos enlazadas: las **21 originales**, conservadas sin modificaciones, más cuatro nuevas, ficticias y navegables.
- Restaurante **Lumbre**: filtros de carta, selección de platos, cantidades y resumen de pedido de prueba.
- Alojamiento **Refugio Sierra**: selección de habitación, huéspedes, fecha de entrada/salida, validaciones y cálculo de estancia de prueba.
- Peluquería **Aura Studio**: servicios, fecha, horas ilustrativas y confirmación local de muestra.
- Servicio técnico **Nexo Repair**: equipo, incidencia y rango orientativo simulado.
- 10 tarifas web, 11 extras, 5 posibilidades de mantenimiento (incluyendo ausencia de mantenimiento).
- 3 packs con descuento: Presencia Local (239 €), Carta y Negocio (409 €) y Negocio Plus (389 €).
- Comparador de tres modalidades de web, FAQs, metodología, herramientas y formulario que **prepara una solicitud sin enviarla**.
- Presupuestador reactivo: desglose, descuentos condicionados a cada pack, copia, TXT, PDF mediante impresión y traslado al borrador de solicitud.
- Metadatos SEO en portada, páginas demo con `noindex` y rutas compatibles con GitHub Pages.

## Conservación e histórico
- `index-v14.html`: portada anterior completa, accesible desde la nueva portada. Sus rutas relativas continúan funcionando.
- `legacy/index-v14.html` y `legacy/v6-pro-original.html`: copias de seguridad de los archivos originales.
- `v6-pro.html`: página V6 anterior, conservada.
- `demos/`: los 21 HTML anteriores permanecen sin alteraciones.
- `herramientas/`, `servicios/`, `assets/` (originales), `privacidad.html` y demás recursos se conservan.

## Cómo abrirlo
1. Descarga el ZIP de la rama en GitHub y descomprímelo.
2. En la carpeta raíz, abre `index.html` con Chrome, Edge o Firefox.
3. Para probar una réplica de GitHub Pages con servidor local, abre una terminal en la carpeta y ejecuta `python -m http.server 8000`. Abre `http://localhost:8000/`.
4. Recorre `#proyectos`, `#precios`, `#presupuesto` y entra en las demos.

No hay que instalar npm, servicios de pago o bases de datos.

## Publicación
1. Revisa la rama y la solicitud de incorporación a `main`.
2. Verifica que GitHub Actions termine correctamente y prueba en un navegador móvil y de escritorio.
3. Haz `Merge` solamente cuando apruebes la versión.
4. Si GitHub Pages publica desde `main`, la web actualizada aparecerá en la URL habitual tras el despliegue.

## Comprobaciones automatizadas
- `node scripts/check-site.mjs`: regresiones de V14, usando la portada archivada.
- `node scripts/check-v6.mjs`: archivos, rutas, metadata, 25 demos, precios solicitados, descuentos y mantenimiento independiente.
- El workflow `.github/workflows/check-site.yml` ejecuta ambos scripts en pushes y pull requests.

## Limitaciones y decisiones transparentes
- **El formulario V6 no envía datos**: valida y genera un texto local que puedes copiar. Hay un enlace al formulario de la V14, que sigue dependiendo de que se active y verifique externamente su receptor. No se afirma que la entrega de leads esté probada.
- Las demos ficticias no tienen disponibilidad real, pagos, correos enviados, cita registrada ni diagnóstico auténtico.
- Las fotos de las cuatro demos nuevas dependen de Unsplash y necesitan conexión. Las imágenes originales WebP siguen conservadas.
- Los importes son orientativos, sin IVA, dominio, hosting, servicios externos o complementos no pactados.
- La prueba automatizada no sustituye a una inspección visual en dispositivos reales y redes distintas.
- Antes de poner en producción para captar clientes, revisa los textos legales, privacidad y el método de contacto definitivo. No se añade ningún teléfono o dirección privada.

## Estructura V6
```text
index.html
index-v14.html
assets/
  v6-pro.css
  v6-pro.js
demos/
  v6-demo.css
  v6-demo.js
  restaurante-qr-v6.html
  hotel-rural-v6.html
  peluqueria-agenda-v6.html
  reparaciones-it-v6.html
scripts/
  check-site.mjs
  check-v6.mjs
legacy/
  index-v14.html
  v6-pro-original.html
```
