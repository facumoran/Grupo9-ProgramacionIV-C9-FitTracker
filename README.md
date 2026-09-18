# Fit Tracker

## Integrantes

- Facundo Martín Morán
- Santiago Benjamin Avila Puntano
- Leandro Joel López
- Fabricio Sergio Lazarte

## Descripción breve

Fit Tracker es una aplicación web para organizar rutinas de entrenamiento, consultar ejercicios, planificar sesiones en un calendario y seguir el progreso. Utiliza Bootstrap y JavaScript con manipulación del DOM y eventos, manteniendo la identidad visual negra y naranja y el diseño responsive.

El catálogo reúne 48 ejercicios (6 por grupo muscular), con búsqueda, filtros, favoritos y detalles. Se pueden crear, editar, duplicar y eliminar rutinas, personalizar series, repeticiones, cargas y descansos, y programarlas en el calendario. Al entrenar se registran las series realizadas; el resumen, las métricas, los récords y el historial se actualizan con esos datos. El temporizador permite iniciar, pausar y reiniciar descansos. Las plantillas son ejemplos editables, no planes profesionales personalizados.

El perfil es local y no constituye un login seguro. Las rutinas, la planificación y las sesiones, incluso la sesión en curso, se guardan con `localStorage` solo en el navegador actual; no hay contraseñas, sincronización ni base de datos en esta etapa. Desde Perfil se puede descargar una copia JSON. Si el navegador bloquea el guardado, la aplicación lo informa. Los 42 ejercicios de pecho, espalda, piernas, glúteos, hombros, bíceps y tríceps cuentan con ilustraciones de la mascota; los 6 ejercicios de abdomen muestran un marcador de ilustración pendiente. La estructura del catálogo admite nuevas entradas, imágenes y enlaces de video en el futuro.

## Tecnologías utilizadas

- HTML5 semántico
- CSS3
- Bootstrap 5.3
- Bootstrap Icons
- JavaScript y DOM, eventos y localStorage
- Git y GitHub para el control de versiones

Bootstrap y Bootstrap Icons se incorporaron mediante CDN. Las clases de Bootstrap resuelven la distribución, alineación, espaciados y botones redondeados; el CSS propio conserva la identidad visual y los componentes específicos. También se agregó Bootstrap Bundle para el funcionamiento del menú desplegable en dispositivos móviles.

Para usar la app, abrir `index.html` en un navegador actualizado con JavaScript habilitado; se necesita internet para cargar Bootstrap, los iconos y las fuentes. Personalizar una plantilla o crear una rutina, programarla y registrar una sesión. Solo las series marcadas como realizadas cuentan en el progreso; el volumen es la suma de carga × repeticiones, sin incluir ejercicios por tiempo ni estimar peso corporal. La racha cuenta semanas consecutivas con al menos una sesión, incluida la semana anterior si la actual todavía no tiene actividad.

Con Node.js instalado, `node --test tests/datos.test.cjs` verifica el catálogo, el guardado, las validaciones y los cálculos de progreso.

## ¿Dónde utilizamos Flexbox?

- En la barra de navegación, para alinear el nombre de Fit Tracker, la mascota y los enlaces.
- En la presentación principal, para centrar y distribuir el texto y la imagen.
- En las listas de rutinas, para separar el nombre de cada rutina de su botón.
- En los controles del calendario, para alinear los botones con el nombre del mes.
- Se utilizaron clases de Bootstrap como `d-flex`, `align-items-center`, `justify-content-between` y `gap`.

## ¿Dónde utilizamos Grid?

- Se utilizó el sistema de grilla de Bootstrap mediante `container`, `row` y `col`.
- Las tarjetas del resumen se distribuyen en una, dos o cuatro columnas según el tamaño de pantalla.
- Los ejercicios se organizan en una, dos o cuatro columnas.
- Las métricas de progreso se muestran en una o tres columnas.
- El calendario utiliza CSS Grid para generar siete columnas del mismo tamaño.

## ¿Qué variables CSS creamos?

Se personalizaron variables de Bootstrap dentro de `:root` y `[data-bs-theme="dark"]` para mantener la estética de Fit Tracker:

- Fondo principal: `--bs-body-bg`
- Fondo secundario: `--bs-secondary-bg` y `--bs-tertiary-bg`
- Color principal naranja: `--bs-primary` y `--bs-primary-rgb`
- Colores de enlaces: `--bs-link-color` y `--bs-link-hover-color`
- Color de bordes: `--bs-border-color`
- Tipografía principal: `--bs-body-font-family`

También se personalizaron las variables de los botones de Bootstrap para que sus estados normal, hover y active utilicen la paleta naranja y negra.

## ¿Cómo implementamos el Responsive Design?

Se utilizó el enfoque mobile-first de Bootstrap. Las clases `row-cols`, `col-sm`, `col-lg` y `navbar-expand-lg` permiten que las tarjetas, las secciones y la navegación se adapten automáticamente al ancho de la pantalla. También se agregó una media query para ajustar la mascota y el calendario en celulares muy angostos.

## Estrategias de SEO implementadas

1. **Meta description**: se agregó una descripción clara del sitio para los resultados de búsqueda.
2. **HTML semántico**: se utilizaron etiquetas como `header`, `nav`, `main`, `section` y `footer`.
3. **Jerarquía de encabezados**: se mantuvo un único `<h1>` y se utilizaron `<h2>` y `<h3>` para ordenar el contenido.
4. **Atributos `alt`**: las imágenes importantes cuentan con textos alternativos descriptivos.
5. **Atributo `lang="es"`**: permite identificar correctamente el idioma del sitio.
6. **Etiquetas Open Graph**: mejoran la presentación de la página al compartirla en redes sociales.

## Estructura del proyecto

```text
Grupo9-ProgramacionIV-C9-FitTracker/
├── img/
│   ├── logo.svg
│   ├── mascota-fit-tracker.png
│   └── mascota-navbar-reclinada.png
├── index.html
├── styles.css
├── js/
│   ├── catalogo.js
│   ├── datos.js
│   ├── app.js
│   ├── ejercicios.js
│   ├── rutinas.js
│   └── entrenamiento.js
├── tests/
│   └── datos.test.cjs
└── README.md
```
