# Fit Tracker

## Integrantes

- Facundo Martín Morán
- Santiago Benjamin Avila Puntano
- Leandro Joel López
- Fabricio Sergio Lazarte

## Descripción breve

Fit Tracker es una interfaz web para organizar rutinas de entrenamiento, consultar ejercicios, visualizar un calendario y hacer un seguimiento del progreso físico. Para esta etapa se adaptó la interfaz con Bootstrap, manteniendo la identidad visual en tonos negros y naranjas y el diseño responsive.

## Tecnologías utilizadas

- HTML5 semántico
- CSS3
- Bootstrap 5.3
- Bootstrap Icons
- Git y GitHub para el control de versiones

Bootstrap y Bootstrap Icons se incorporaron mediante CDN. También se agregó Bootstrap Bundle para el funcionamiento del menú desplegable en dispositivos móviles.

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
└── README.md
```
