# AL Studio Digital · V14: escaparate comercial + captación de consultas

**Web:** https://abelloga03.github.io/Abel-Automation/  
**GitHub:** https://github.com/AbelLoga03/Abel-Automation

## Cambios

- Escaparate azul/cian nuevo, tarjetas animadas y presentación comercial más visual.
- **12 servicios ofertables** con descripciones y enlaces: web premium, tiendas catálogo, cartas QR, automatizaciones, citas, paneles, inventario, identidad, portfolios, calculadoras, creatividad con IA y optimización básica.
- **6 negocios ficticios nuevos**: Bruma Café, Pulso Club, Nido Mascotas, Lumen Home, Horizonte Escapes y Órbita Creativa.
- Los nuevos proyectos no incluyen negocios, direcciones, teléfonos ni localizaciones reales. Son prototipos de fantasía con filtros y selecciones locales, **sin compras ni reservas**.
- 15 demos anteriores conservadas (4 ideas antes ligadas a comercios reales ahora se muestran bajo nombres totalmente ficticios). **21 proyectos presentados en la portada**.
- Página privada-informativa de la gestión de datos: `privacidad.html` y página de retorno `gracias.html`.
- Formulario de contacto con nombre, correo, proyecto y descripción, teléfono opcional, consentimiento expreso y filtro antispam.
- Pruebas de GitHub Actions ampliadas a rutas, existencia de las 21 demos, JSON de los proyectos y formulario.

## Captación de consultas: paso imprescindible para activar

El sitio está alojado en **GitHub Pages (HTML estático)**, que no puede almacenar datos de visitantes en una base de datos privada por sí solo.

Se ha conectado el formulario a **FormSubmit** usando `https://formsubmit.co/abellopezgarcia27@gmail.com` como destino. Este tercero recibe la solicitud y la envía al correo indicado; dispone de archivo temporal de envíos (según la documentación consultada, 30 días).

**IMPORTANTE: debes activarlo para poder recibir consultas.**
1. Abre https://abelloga03.github.io/Abel-Automation/#contacto
2. Envía una consulta de prueba con datos tuyos no sensibles.
3. FormSubmit te enviará al correo de destino un enlace de confirmación de la recepción.
4. Abre el mensaje y confirma la dirección receptora.
5. Realiza una segunda consulta de prueba y verifica que aparece en tu buzón.

Hasta que completes esa confirmación y la prueba, **NO se ha verificado la recepción real de leads**. GitHub Pages y GitHub Actions solo verifican que los archivos y la estructura funcionan, no la entrega de mensajes por FormSubmit.

Para historiales de contactos permanentes, filtros privados, permisos de equipo o datos sensibles, usa un sistema propio con servidor o conecta un servicio de formularios con área privada bajo una cuenta verificada y requisitos legales adecuados.

### Privacidad

El formulario incluye consentimiento y una página explicativa. Los datos se procesan por un tercero, no en GitHub. Antes de la captación comercial real, conviene verificar la política de privacidad, condiciones del servicio externo y obligaciones de protección de datos aplicables al negocio.

### Seguridad

- Nunca publiques respuestas de visitantes en GitHub, especialmente en un repositorio público.
- No incluyas claves, tokens o contraseñas en HTML/JS estático.
- Si no quieres depender de FormSubmit, sustituye el destino por un endpoint seguro propio **antes** de desactivar el formulario externo.
- Las demostraciones comerciales no son pedidos, citas ni ventas reales.

## Validación

`node scripts/check-site.mjs` se ejecuta en GitHub Actions con cada cambio. Conserva el sitio, las 21 demos y las cuatro herramientas de la V10.
