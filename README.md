# Fit Tracker

## Integrantes
- Facundo Martín Morán
- Santiago Benjamin Avila Puntano
- Leandro Joél López
- Fabricio Sergio Lazarte

## Descripción breve
Fit Tracker es una interfaz web para organizar rutinas de entrenamiento, llevar un registro de ejercicios, visualizar un calendario de entrenamientos y hacer seguimiento del progreso físico a lo largo del tiempo.

## Tecnologías utilizadas
- HTML5 semántico
- CSS (Variables, Flexbox, Grid, Media Queries)
- Git y GitHub para el control de versiones

## ¿Dónde utilizamos Flexbox?
- En el `header`, para alinear el logo y el menú de navegación.
- En el menú de navegación (`nav ul`), para distribuir los links en fila y que se acomoden si no entran (`flex-wrap`).
- <!-- Benja: agregar acá dónde usó Flexbox en Rutinas -->
- Se utilizó Flexbox en section `grafico-barras` para organizar las barras horizontalmente y alinearlas en la parte interior del gráfico.

## ¿Dónde utilizamos Grid?
- En la sección **Resumen**, las 4 tarjetas de datos (próximo entrenamiento, racha, etc.) usan `display: grid` para pasar de 1 columna en celular a 2 en tablet y 4 en desktop.
- <!-- Leandro: agregar acá dónde usaron Grid en Ejercicios -->
- Se utilizó Grid en section `metricas-progreso` para organizar las métricas en columnas y adaptarlas al tamaño de la pantalla.

## ¿Qué variables CSS creamos?
Definidas en `:root`, dentro de `style.css`:
- Colores: `--color-negro`, `--color-negro-suave`, `--color-naranja`, `--color-naranja-oscuro`, `--color-texto`, `--color-texto-secundario`, `--color-borde`
- Tipografía: `--fuente-titulos`, `--fuente-texto`
- Espaciados: `--espaciado-xs`, `--espaciado-sm`, `--espaciado-md`, `--espaciado-lg`
- Bordes y sombras: `--radio-borde`, `--sombra-tarjeta`

Esto permite cambiar el esquema de colores o los espaciados de todo el sitio modificando un solo lugar.

## ¿Cómo implementamos el Responsive Design?
Usamos un enfoque **mobile-first**: los estilos base (sin media query) están pensados para celular, con los elementos apilados en columna. Después, con `@media (min-width: 600px)` adaptamos el diseño para tablet, y con `@media (min-width: 1024px)` lo adaptamos para pantallas de escritorio.

Cada integrante escribió las media queries correspondientes a su propia sección, agrupadas al final del `style.css`.

## Estrategias de SEO implementadas
1. **Meta description**: se agregó una descripción clara del sitio en `<meta name="description">`, que es lo que suele mostrarse en los resultados de búsqueda de Google.
2. **HTML semántico**: se usaron etiquetas como `header`, `nav`, `main`, `section`, `article` y `footer` en vez de `div` genéricos, lo que ayuda a los buscadores a entender la estructura y jerarquía del contenido.
3. **Jerarquía de encabezados correcta**: un solo `<h1>` (el nombre del sitio), `<h2>` para cada sección principal y `<h3>` para los subtítulos dentro de cada una, sin saltar niveles.
4. **Atributo `alt` en imágenes**: la imagen del logo tiene un texto alternativo descriptivo (`alt="Logo de Fit Tracker, dos mancuernas cruzadas"`), útil tanto para SEO como para accesibilidad.
5. **Atributo `lang="es"`**: declarado en la etiqueta `<html>`, para que los buscadores identifiquen correctamente el idioma del contenido.
6. **Etiquetas Open Graph** (`og:title`, `og:description`, `og:type`): mejoran cómo se muestra el sitio al compartirlo en redes sociales.

## Estructura del proyecto
```
mi-proyecto/
├── img/
│   └── logo.svg
├── style.css
├── index.html
└── README.md
```

