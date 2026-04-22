# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

**Finantips 2.0** es una aplicación web de calculadoras financieras orientada a trabajadores de Toyota Argentina y usuarios hispanohablantes. Incluye calculadoras de sueldo neto, impuesto a las ganancias, plazo fijo, y comparativa de cuotas vs. contado. Desplegada en https://finantips.netlify.app/

## Comandos

```bash
# Compilar SCSS a CSS (modo watch)
npm run sass

# Compilar una sola vez (sin watch)
npx sass scss/main.scss css/styles.css
```

No hay servidor de desarrollo, build step, ni tests. Es un sitio estático que se abre directamente en el navegador.

## Arquitectura

### Archivo central: `js/actualizacion.js`

Este es el archivo más crítico del proyecto. Centraliza **todas las constantes financieras**: escalas salariales de Toyota, tramos del impuesto a las ganancias, deducciones (cónyuge, hijos, mínimo no imponible), y el tope de cargas sociales. Todos los demás módulos JS importan desde aquí.

Cuando se actualiza el convenio colectivo o los parámetros del impuesto, **solo se modifica este archivo** y los cambios se propagan automáticamente a todas las calculadoras. El multiplicador `AUMENTO` acumula los aumentos porcentuales sucesivos:

```javascript
const AUMENTO = 1.2248 * 1.0913 * ... * 1.0769; // Cada factor es un aumento mensual
```

### Módulos de calculadoras (`js/*.js`)

Cada calculadora sigue el mismo patrón:
1. Importa constantes desde `actualizacion.js`
2. Lee los inputs del formulario vía `document.getElementById()`
3. Realiza los cálculos y renderiza el resultado inyectando HTML con template literals en `#resultados`
4. Las funciones que se llaman desde atributos `onclick` en el HTML se exponen explícitamente: `window.nombreFuncion = nombreFuncion`

`sueldoneto.js` también persiste el historial de recibos en `localStorage` con la clave `"recibos"`.

### Páginas (`pages/*.html`)

Cada página carga su JS como módulo ES6:
```html
<script type="module" src="../js/sueldoneto.js"></script>
```

No hay componentes compartidos: el header y footer se duplican en cada HTML.

### Estilos (`scss/`)

- `scss/main.scss` importa todos los parciales
- `scss/utilities/` → variables globales, mixins, media queries
- `scss/components/` → header y footer
- `scss/pages/` → estilos específicos de cada página
- Color principal: `$colorverde: #14805c`
- Bootstrap 5.3.2 se carga desde CDN, no está en el proyecto local

## Convenciones

- **Sistema de módulos**: `"type": "module"` en `package.json`. No hay transpilación ni bundler.
- **Formato monetario**: Siempre `.toFixed(2)` para valores en pesos.
- **Validación numérica**: `if (isNaN(valor)) { valor = 0; }`
- **LocalStorage**: La clave `"recibos"` almacena el historial de sueldo neto como array JSON. Cambiar esta clave borra el historial de los usuarios.
- **Idioma**: Todo el código, comentarios y la UI están en español.
