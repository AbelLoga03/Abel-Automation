# AL Studio Digital · V10

Repositorio oficial del portfolio: https://github.com/AbelLoga03/Abel-Automation

Web en GitHub Pages: https://abelloga03.github.io/Abel-Automation/

## Mejoras implementadas

- Showroom de cuatro herramientas y animaciones responsive, respetando la preferencia por reducir movimiento.
- 15 demostraciones originales preservadas en `demos/`.
- 8 imágenes WebP extraídas del HTML a `assets/portfolio-*.webp` para mejorar la caché. Portada reducida de más de 400 KB a unos 42 KB.
- Metadatos SEO, Open Graph, Twitter Card, imagen PNG 1200×630, canonical, sitemap.xml y robots.txt.
- Generador de presupuestos: `herramientas/presupuestos.html` con importes orientativos, extras, descuento, impresión/guardar como PDF y borrador de correo.
- Simulaciones: `herramientas/automatizaciones.html` (cafetería, peluquería, taller), sin backend ni datos reales.
- CRM: `herramientas/crm.html` cifrado en el navegador mediante Web Crypto (AES-GCM, PBKDF2), etapas, búsqueda, seguimiento y copias JSON cifradas. **La base de clientes NO se sube a GitHub**.
- Identidad comercial: `herramientas/marca.html` con tarjetas imprimibles, paleta y firma.

## Limitaciones y privacidad

- GitHub Pages **no tiene backend privado**. La página del CRM es pública, pero los registros que crees se guardan cifrados únicamente en tu navegador. El código fuente es público; no hay sincronización, control de usuarios ni recuperación de contraseña. Exporta copias cifradas y no uses ordenadores compartidos.
- Las solicitudes de cita y pedidos de las demostraciones **no son reales**. Los formularios comerciales abren un borrador de correo y requieren confirmación manual.
- Guardar como PDF depende de la opción «Imprimir» / «Guardar como PDF» del navegador.
- Los importes son orientativos y pueden requerir ajustes por alcance, impuestos, dominio, hosting o terceros.
- No se ha publicado información de contacto privada ni una lista de clientes reales.
- La marca no se afirma registrada y el dominio profesional no se ha adquirido ni configurado.

## Pruebas

`node scripts/check-site.mjs`

La integración de GitHub Actions comprueba rutas internas, 15 demos, y sintaxis básica del JavaScript del portfolio. No reemplaza pruebas de UX manuales.
