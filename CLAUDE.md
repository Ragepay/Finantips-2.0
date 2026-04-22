# CLAUDE.md

Guía completa para Claude Code al trabajar con este repositorio.

---

## Proyecto

**Finantips 2.0** es una aplicación web de calculadoras financieras orientada a trabajadores de Toyota Argentina y usuarios hispanohablantes en general. Desplegada en https://finantips.netlify.app/

**Calculadoras disponibles:**
- Sueldo Neto Toyota (con categorías, horas extra, antigüedad, cargas sociales, ganancias)
- Impuesto a las Ganancias (4ª categoría, escala progresiva)
- Plazo Fijo (interés simple o compuesto)
- Cuotas vs. Efectivo (comparativa con TNA)
- Inflación (poder adquisitivo)

**Audiencia:** empleados de Toyota Argentina que quieren calcular su sueldo neto, y público general para las otras herramientas.

**Monetización:** Google Adsense (ca-pub-1304377583650825) + botón de donaciones en Mercado Pago.

---

## Comandos

```bash
# Compilar SCSS a CSS (modo watch — usar durante desarrollo)
npm run sass

# Compilar una sola vez
npx sass scss/main.scss css/styles.css

# Push rápido (git add + commit + push automático)
npm run push
```

No hay servidor de desarrollo, build step, ni tests. Es un sitio estático que se puede abrir directamente en el navegador. Sin Webpack, sin Vite, sin transpilación.

---

## Arquitectura general

```
Finantips 2.0/
├── index.html                  ← Página principal (raíz)
├── pages/                      ← Todas las calculadoras
│   ├── calculadoras.html
│   ├── sueldoneto.html
│   ├── IIGG.html
│   ├── plazofijo.html
│   ├── cuotas.html
│   ├── inflacion.html
│   ├── dolares.html
│   └── pesos.html
├── js/                         ← Lógica de cada calculadora
│   ├── actualizacion.js        ← ⚠️ ARCHIVO MÁS CRÍTICO (ver abajo)
│   ├── components.js           ← Inyecta header y footer en todas las páginas
│   ├── sueldoneto.js
│   ├── IIGG.js
│   ├── plazofijo.js
│   ├── cuotas.js
│   └── inflacion.js
├── scss/                       ← Estilos fuente (compilar antes de ver cambios)
│   ├── main.scss               ← Punto de entrada que importa todo
│   ├── utilities/
│   │   ├── _variables.scss     ← Colores, fuentes, espaciados, breakpoints
│   │   ├── _mixins.scss        ← Funciones reutilizables
│   │   └── _mediaquerys.scss   ← Media queries centralizadas
│   ├── components/
│   │   ├── _header.scss
│   │   └── _footer.scss
│   └── pages/
│       ├── _index.scss
│       ├── _calculadoras.scss
│       ├── _sueldoneto.scss
│       ├── _IIGG.scss
│       ├── _cuotas.scss
│       ├── _plazofijo.scss
│       └── _inflacion.scss
├── css/
│   └── styles.css              ← CSS compilado (NO editar directamente)
├── img/                        ← Imágenes e íconos
├── robots.txt
├── sitemap.xml
└── ads.txt
```

---

## Archivo central: `js/actualizacion.js`

**Este es el archivo más importante del proyecto.** Centraliza todas las constantes financieras. Cuando hay un aumento salarial, una actualización de ganancias o un cambio en cargas sociales, **solo se modifica este archivo** y los cambios se propagan automáticamente a todas las calculadoras.

### Cómo funciona el multiplicador AUMENTO

Cada aumento mensual se acumula multiplicando el factor anterior:

```javascript
const AUMENTO = 1.2248 * 1.0913 * 1.1288 * 1.0882 * 1.0832 * 1.0605 * 1.0609 * 1.0769 * 1.0917;
// Cada factor representa un aumento mensual (ej: 1.0769 = +7,69%)
// Para agregar un nuevo aumento, multiplicar el último factor
```

### Todas las constantes exportadas

| Constante | Valor actual | Descripción |
|-----------|-------------|-------------|
| `AUMENTO` | ~producto acumulado | Multiplicador de aumento salarial Toyota |
| `maxCargasSociales` | 4.162.912,57 | Tope para cálculo de cargas sociales |
| `aumentoGanancias` | 1.5956838171 | Factor de actualización escala IIGG |
| `minimoNoImponible` | 269.048,84 × aumentoGanancias | MNI impuesto ganancias |
| `deduccionEspecial` | 1.291.434,42 × aumentoGanancias | Deducción especial ganancias |
| `conyuge` | 253.390,04 × aumentoGanancias | Deducción por cónyuge |
| `hijo` | 127.785,52 × aumentoGanancias | Deducción por hijo (cada uno) |
| `maxAlquileresDeducibles` | 269.048,84 × aumentoGanancias | Tope deducción alquiler |
| `escalaActualizada` | Array de 10 tramos | Escala progresiva IIGG (5% al 35%) |
| `valesComedorTotal` | 22 × 2652 = 58.344 | Retención vales de comedor mensual |
| `JUBILACION` | 0.11 | 11% — Aporte jubilatorio ley 24.241 |
| `LEY_19032` | 0.03 | 3% — INSSJP (PAMI) |
| `OBRA_SOCIAL` | 0.03 | 3% — Aporte obra social |
| `SMATA` | 0.05 | 5% — Aporte sindical SMATA |
| `PRODUCTIVIDAD` | 0.14 | 14% del salario base Toyota |
| `PRESENTISMO` | 0.14 | 14% del salario base Toyota |
| `PLUS_MANTENIMIENTO` | 0.26 | 26% del salario base Toyota |
| `HORAS_NOCTURNAS_COEF` | 0.36 | Coeficiente horas nocturnas |
| `DEDUCCION_ALQUILER` | 0.40 | 40% del alquiler (art. 85 LIG) |
| `VERSION` | "1.6.1" | Versión de la aplicación |

### Cómo aplicar una actualización

1. Agregar el nuevo factor a `AUMENTO`: `const AUMENTO = ...anterior... * 1.XXXX;`
2. Actualizar los valores absolutos que hayan cambiado (vales, maxCargasSociales, etc.)
3. Actualizar `FECHA_ACTUALIZACION` y `mensajeActualizacion`
4. Compilar SCSS si hubo cambios de estilos: `npm run sass`

---

## Módulos JS — patrón de cada calculadora

Todas las calculadoras siguen el mismo patrón:

```javascript
// 1. Importar solo las constantes necesarias
import { AUMENTO, maxCargasSociales, ... } from './actualizacion.js';

// 2. Leer inputs del formulario
const valor = parseFloat(document.getElementById("inputId").value);
if (isNaN(valor)) valor = 0;

// 3. Calcular y renderizar con template literals
document.getElementById("resultados").innerHTML = `...`;

// 4. Exponer funciones al scope global si se usan en onclick del HTML
window.miFuncion = miFuncion;

// 5. Inicializar en DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('boton').addEventListener('click', miFuncion);
});

```
### Detalle por archivo JS

**`sueldoneto.js`** — La calculadora más compleja.
- Importa: AUMENTO, maxCargasSociales, minimoNoImponible, deduccionEspecial, conyuge, hijo, escalaActualizada, valesComedorTotal, JUBILACION, LEY_19032, OBRA_SOCIAL, SMATA, PRODUCTIVIDAD, PRESENTISMO, PLUS_MANTENIMIENTO, HORAS_NOCTURNAS_COEF
- Categorías Toyota: T/M (16m, 7-12m), T/M1-T/M3b, T/L1-T/L3 (calculadas con `AUMENTO`)
- Persiste historial en `localStorage` con clave `"recibos"` (array de objetos `ReciboSueldo`)
- Permite descargar cada recibo como imagen PNG usando `html2canvas` + `qrcode-generator`
- Los botones del historial usan `addEventListener` (NO `onclick` attrs) para evitar problemas de scope en módulos ES6
- Los botones dentro del `<form>` deben tener `type="button"` para no hacer submit al hacer clic

**`IIGG.js`** — Impuesto a las Ganancias 4ª categoría.
- Importa: maxCargasSociales, minimoNoImponible, deduccionEspecial, conyuge, hijo, maxAlquileresDeducibles, escalaActualizada, JUBILACION, LEY_19032, OBRA_SOCIAL, DEDUCCION_ALQUILER
- Escala progresiva con `numRet = [5, 9, 12, 15, 19, 23, 27, 31, 35]` (porcentajes por tramo)

**`cuotas.js`** — Sin imports. Lógica standalone. Compara precio contado vs. precio financiado usando TNA del plazo fijo.

**`plazofijo.js`** — Sin imports. Calcula interés simple o compuesto según checkbox.

**`inflacion.js`** — Importa actualizacion.js solo para disparar el mensaje de actualización.

---

## `js/components.js` — Header y Footer dinámicos

Inyecta header y footer en todas las páginas automáticamente. Detecta la ruta para ajustar paths relativos:

```javascript
const base = window.location.pathname.includes('/pages/') ? '../' : '';
```

- **Páginas en `/pages/`**: usan `../` para llegar a imágenes y links
- **Raíz (`index.html`)**: usa `''` (vacío)

Si se agregan nuevas páginas en `/pages/`, se incluyen automáticamente en el nav. Si se agrega un link nuevo al header o footer, **modificar solo `components.js`** y se propaga a todas las páginas.

---

## Páginas HTML

Cada página sigue esta estructura:
```html
<head>
  <!-- Bootstrap CDN, fuente Inter -->
  <!-- Meta tags SEO: description, keywords, OG, Twitter Card, canonical -->
  <!-- Google Analytics (G-4862KRVMTP) -->
  <!-- Google Adsense (ca-pub-1304377583650825) -->
  <!-- Scripts externos si los necesita (SweetAlert2, html2canvas, etc.) -->
</head>
<body>
  <header></header>  <!-- ← Vacío, lo llena components.js -->
  <main>
    <section id="cotizacionesDolar"> <!-- iframes de dolarhoy.com --> </section>
    <section> <!-- formulario y resultados --> </section>
    <div class="explicacion..."> <!-- explicación del cálculo --> </div>
  </main>
  <footer></footer>  <!-- ← Vacío, lo llena components.js -->

  <!-- Al final: Bootstrap JS, components.js, actualizacion.js, y el JS de la página -->
  <script type="module" src="../js/components.js"></script>
  <script type="module" src="../js/actualizacion.js"></script>
  <script type="module" src="../js/nombreCalculadora.js"></script>
</body>
```

---

## Librerías externas (todas por CDN)

| Librería | Versión | Usado en | Propósito |
|----------|---------|----------|-----------|
| Bootstrap | 5.3.2 | Todas las páginas | Grid, componentes base |
| Inter (Google Fonts) | — | Todas | Tipografía |
| SweetAlert2 | @11 | sueldoneto.html | Diálogos de confirmación al eliminar recibos |
| html2canvas | 1.4.1 | sueldoneto.html | Captura la tabla del recibo como imagen PNG |
| jsPDF | 2.5.1 | sueldoneto.html | (Disponible, no activo actualmente) |
| qrcode-generator | 1.4.4 | sueldoneto.html | Genera QR local (sin CORS) para pie de recibo descargado |

> Las librerías NO están en `node_modules`. No hay `npm install` necesario para ejecutar el proyecto.

---

## Estilos SCSS

**Nunca editar `css/styles.css` directamente** — se sobreescribe al compilar.

Variables clave en `_variables.scss`:
- `$colorverde: #14805c` — color principal de la marca
- `$colorblanco`, `$colornegro`, `$colorgris`
- `$border-radius-sm`, `$transition`, `$font-size-sm`
- `$spacing-md`, `$spacing-sm`
- Breakpoints: `$bp-xl`, `$bp-lg`, `$bp-md`, `$bp-sm`

Mixins útiles en `_mixins.scss`:
- `@include box` — estilos base de las cards de calculadoras
- `@include respond-to($bp)` — media query wrapper

Breakpoints para calculadoras en `_mediaquerys.scss` (contenedor de cards):
- `$bp-xl`: cards de 260px
- `$bp-lg`: 2 columnas (`calc(50% - spacing)`)
- `$bp-sm`: 1 columna (`100%`)

---

## LocalStorage

Solo `sueldoneto.js` usa localStorage.

| Clave | Tipo | Contenido |
|-------|------|-----------|
| `"recibos"` | Array JSON | Historial de objetos `ReciboSueldo` |

**⚠️ Nunca cambiar la clave `"recibos"`** — borraría el historial de todos los usuarios.

El objeto `ReciboSueldo` tiene: `id` (timestamp), `categoria`, `salarioBase`, `presentismo`, `productividad`, `plusMantenimiento`, `horasNocturnas`, `horas50`, `horas200`, `antiguedad`, `retencionValesComedor`, `jubilacion`, `ley`, `obraSocial`, `aporteSindical`, `sueldoBruto`, `sueldoNeto`, `sabadoM`, `feriado`, `retencion`.

**Compatibilidad con datos viejos:** en `mostrarHistorialRecibos()`, usar siempre `(recibo.propiedad || 0).toFixed(2)` para no crashear si datos antiguos no tienen una propiedad nueva.

---

## Convenciones y reglas críticas

### JavaScript
- **Sistema de módulos ES6**: `"type": "module"` en `package.json`. Todo import/export nativo, sin bundler.
- **Funciones en `onclick` HTML**: deben asignarse a `window.funcion = funcion`. Pero preferir `addEventListener` sobre atributos `onclick` en HTML dinámico (más robusto con módulos).
- **Botones dentro de `<form>`**: siempre `type="button"` para evitar submit accidental.
- **Validación numérica**: `if (isNaN(valor)) { valor = 0; }` en todos los inputs.
- **Formato monetario**: siempre `.toFixed(2)` para valores en pesos.

### SCSS/CSS
- Compilar después de cada cambio: `npm run sass`
- Todo estilo nuevo va en el archivo `_nombrePagina.scss` correspondiente
- Para nuevo componente global, agregar en `components/`

### HTML
- Canonical URL en cada página: `<link rel="canonical" href="https://finantips.netlify.app/pages/...">`
- Meta tags OG y Twitter Card en cada página
- Los `<header>` y `<footer>` van vacíos — `components.js` los llena

### General
- **Idioma**: todo el código, comentarios, variables y UI están en **español**
- No hay tests automatizados — verificar manualmente en el navegador
- No hay linter configurado

---

## Cómo agregar una nueva calculadora

1. Crear `pages/nuevacalc.html` — copiar estructura de otra página
2. Crear `js/nuevacalc.js` — seguir el patrón de módulo descrito arriba
3. Crear `scss/pages/_nuevacalc.scss` y agregarlo en `scss/main.scss`
4. Agregar card en `pages/calculadoras.html`
5. Agregar link en `js/components.js` (footer, sección "enlaces útiles")
6. Agregar URL en `sitemap.xml`
7. Compilar SCSS: `npm run sass`

---

## Deployment

- **Plataforma**: Netlify (auto-deploy desde rama `main`)
- **URL producción**: https://finantips.netlify.app/
- **Rama principal**: `main`
- No hay CI/CD configurado más allá del deploy automático de Netlify
- Push a `main` = deploy inmediato
