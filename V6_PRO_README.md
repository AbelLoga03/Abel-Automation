# AL Studio Digital — Portfolio V6 PRO (edición sobre V14)

**Nota de versiones:** aunque el nombre comercial de esta actualización es V6 PRO, la base del repositorio ya era V14. La mejora amplía el estado actual sin recuperar V5 ni eliminar demos.

## Mejoras
- Nueva sección V6 PRO en portada con accesos a demos, planes, presupuestos y contacto.
- explorar-demos.html: **21 demos** existentes, búsqueda por texto, filtro sectorial, ordenación, vista previa y enlace de apertura independiente.
- herramientas/configurador-v6-pro.html: **11 paquetes**, **20 extras**, mantenimiento mensual separado, IVA orientativo opcional, datos locales, copia de resumen, TXT descargable, impresión/PDF y consulta por email.
- assets/v6-pro.css: diseño responsive con estilos aislados.
- scripts/check-v6-pro.mjs: comprobaciones de enlaces, demos, sintaxis JavaScript, tarifas, herramientas y sitemap.
- GitHub Actions ampliado para validar en la rama V6 PRO y en Pull Requests.

## Conservación
- Los 15 proyectos anteriores y las 6 demos ficticias V14 permanecen con sus URL.
- Siguen intactas las otras herramientas, las páginas de servicios, la política de privacidad, el formulario y los assets.
- La rama main no se cambia hasta revisar/fusionar la propuesta.

## Pruebas
Desde la raíz del proyecto ejecutar:
1. node scripts/check-site.mjs
2. node scripts/check-v6-pro.mjs

Se puede previsualizar con un servidor estático local, como python -m http.server 8000, o abrir index.html.

## Publicación
1. Revisa la rama portfolio-v6-pro-2026 y comprueba los precios en móvil y ordenador.
2. Cuando desees publicar los cambios, fusiona el Pull Request en main.
3. Sigue la activación de FormSubmit de V14_README.md antes de confiar en que se entreguen solicitudes por correo.

## Limitaciones y transparencia
- Los proyectos son demos conceptuales no oficiales, sin compras ni reservas reales.
- Los importes son orientativos, no ofertas vinculantes; IVA, dominio, alojamiento y servicios externos van aparte salvo indicación.
- El presupuesto se genera localmente: copiar, descargar, imprimir o abrir email requiere una acción voluntaria. No se envía automáticamente nada desde el configurador.
- El formulario principal utiliza FormSubmit. Su recepción efectiva no está comprobada mientras no se active y pruebe el correo receptor.
- Las tarifas del configurador se editan en los arrays bases y extras del propio HTML; la mensualidad está en el selector maintenance.
- No se ha desplegado ni modificado la web pública de main durante esta preparación.
