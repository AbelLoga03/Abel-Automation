# AL Studio Digital — V12 · Páginas comerciales y experiencias interactivas

**Web pública:** https://abelloga03.github.io/Abel-Automation/  
**Repositorio:** https://github.com/AbelLoga03/Abel-Automation

## Novedades

La V12 añade cuatro páginas comerciales independientes, con una estructura clara inspirada en portales de servicios digitales, pero con diseño y contenido propios.

| Página | URL relativa | Interacciones |
|---|---|---|
| Diseño web | `servicios/web.html` | Demostración real en iframe de pastelería, taller y barbería; cambio ordenador/móvil |
| Catálogos y cartas QR | `servicios/catalogos.html` | Catálogo ilustrativo con filtros y selección temporal copiable |
| Automatizaciones | `servicios/automatizaciones.html` | Simulador de procesos de hostelería, peluquería y taller |
| Comparación de planes | `servicios/comparar.html` | Tabla con alcance de cada nivel y recomendador orientativo |

Se incluye además en la portada un selector según la necesidad del visitante para navegar a la solución correspondiente. La página de planes de la portada enlaza al comparador. Los accesos a las **15 demos** anteriores y las cuatro herramientas V10 se conservan.

## Recursos

- `servicios/landing.css`: estilo responsive, oscuro/azul y blanco/cian.
- `servicios/landing.js`: lógica de las simulaciones sin operaciones de red.
- `assets/selector-v12.js`: selector de soluciones de la portada.
- `assets/ionos-inspired-v11.css`: estilos extendidos de la portada.
- `sitemap.xml`: incluye las páginas nuevas.
- `scripts/check-site.mjs`: verificación automática ampliada para rutas, JS y demostraciones.

## Alcance y límites

- Los importes de 199 €, 349 € y 499 € son **referencias** de diseño web. Los costes de hosting, dominio, servicios externos y los impuestos aplicables no están incluidos salvo acuerdo.
- El catálogo de V12 **no recoge pedidos ni cobra**. La selección se muestra solo en el navegador; al pulsar copiar, se copia texto localmente, no se envía al negocio.
- Los flujos son **simulaciones**, no envían avisos, mensajes, reservas ni actualizan sistemas.
- Las demostraciones de negocios siguen siendo independientes y no oficiales.
- El nombre IONOS se usa únicamente en la descripción de la inspiración de la estructura, **sin afiliación, asociación ni uso de su marca** en las páginas comerciales.
- El CRM V10 sigue guardando datos cifrados en el navegador local y no se ha hecho público ningún registro de clientes.

## Control de calidad

Para revisar rutas y sintaxis: `node scripts/check-site.mjs`. GitHub Actions lo ejecuta al subir cambios.  
Comprueba la navegación también en teléfono y los simuladores con información inventada antes de presentarlo a clientes.
