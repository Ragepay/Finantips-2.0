const base = window.location.pathname.includes('/pages/') ? '../' : '';

// ── MODO OSCURO ──────────────────────────────────────────────────────
// Aplicar el tema guardado lo antes posible para minimizar el parpadeo.
const temaGuardado = localStorage.getItem('tema');
if (temaGuardado === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}
function iconoTema() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
}
function alternarTema() {
  const esOscuro = document.documentElement.getAttribute('data-theme') === 'dark';
  if (esOscuro) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('tema', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('tema', 'dark');
  }
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = iconoTema();
}

// ── INDICADORES ECONÓMICOS EN VIVO (argentinadatos.com) ──────────────
// Se muestran en un contenedor #indicadoresEconomicos con el atributo
// data-indicadores="inflacionMensual,uva,..." (define qué mostrar por página).
const API_AR = "https://api.argentinadatos.com/v1/finanzas";

async function jsonUltimo(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error("HTTP " + r.status);
  const d = await r.json();
  return Array.isArray(d) ? d[d.length - 1] : d;
}

function fmtPorcentaje(v) {
  return Number(v).toLocaleString("es-AR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "%";
}

function fmtMesAnio(fechaISO) {
  const d = new Date(fechaISO);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("es-AR", { month: "long", year: "numeric" });
}

function fmtFechaCorta(fechaISO) {
  const d = new Date(fechaISO);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const INDICADORES = {
  inflacionMensual: async () => { const u = await jsonUltimo(`${API_AR}/indices/inflacion`); return { titulo: "Inflación mensual", valor: fmtPorcentaje(u.valor), sub: fmtMesAnio(u.fecha) }; },
  inflacionInteranual: async () => { const u = await jsonUltimo(`${API_AR}/indices/inflacionInteranual`); return { titulo: "Inflación interanual", valor: fmtPorcentaje(u.valor), sub: fmtMesAnio(u.fecha) }; },
  uva: async () => { const u = await jsonUltimo(`${API_AR}/indices/uva`); return { titulo: "Valor UVA", valor: formatearPeso(u.valor), sub: fmtFechaCorta(u.fecha) }; },
  plazoFijo: async () => { const u = await jsonUltimo(`${API_AR}/tasas/depositos30Dias`); return { titulo: "Plazo fijo (TNA prom.)", valor: fmtPorcentaje(u.valor), sub: "30 días · promedio BCRA" }; },
  riesgoPais: async () => { const u = await jsonUltimo(`${API_AR}/indices/riesgo-pais/ultimo`); return { titulo: "Riesgo país", valor: Number(u.valor).toLocaleString("es-AR") + " pb", sub: fmtFechaCorta(u.fecha) }; },
};

async function cargarIndicadores() {
  const cont = document.getElementById("indicadoresEconomicos");
  if (!cont) return;
  const claves = (cont.dataset.indicadores || "").split(",").map(s => s.trim()).filter(Boolean);
  if (!claves.length) return;
  cont.innerHTML = `<p class="cotiza-cargando">Cargando indicadores…</p>`;
  const resultados = await Promise.allSettled(claves.map(k => INDICADORES[k] ? INDICADORES[k]() : Promise.reject()));
  const tarjetas = resultados
    .filter(r => r.status === "fulfilled")
    .map(r => `
      <article class="indicador-tile">
        <span class="indicador-titulo">${r.value.titulo}</span>
        <span class="indicador-valor">${r.value.valor}</span>
        <span class="indicador-sub">${r.value.sub}</span>
      </article>`).join("");
  cont.innerHTML = tarjetas || `<p class="cotiza-cargando">No se pudieron cargar los indicadores.</p>`;
}

// ── SEO: DATOS ESTRUCTURADOS (JSON-LD) ───────────────────────────────
// Se inyectan automáticamente en cada página. Para agregar una calculadora
// nueva, sumá una entrada en CALCULADORAS con su nombre y descripción.
const SITIO = "https://finantips.netlify.app";
const LOGO = `${SITIO}/img/Logo%20%2B%20Finantips.png`;

const CALCULADORAS = {
  "sueldoneto.html":        { nombre: "Calculadora de Sueldo Neto Toyota", desc: "Calculá tu sueldo neto según categoría Toyota, antigüedad, horas extra, productividad y cargas sociales." },
  "IIGG.html":              { nombre: "Calculadora de Impuesto a las Ganancias", desc: "Calculá la retención de Ganancias de 4ª categoría con la escala progresiva y las deducciones vigentes." },
  "plazofijo.html":         { nombre: "Calculadora de Plazo Fijo", desc: "Calculá el rendimiento de tu plazo fijo con interés simple o compuesto." },
  "cuotas.html":            { nombre: "Calculadora Cuotas vs. Efectivo", desc: "Compará el costo real de pagar en cuotas contra pagar en efectivo según la TNA." },
  "inflacion.html":         { nombre: "Calculadora de Inflación", desc: "Calculá cómo la inflación afecta el poder adquisitivo de tu dinero." },
  "interes-compuesto.html": { nombre: "Calculadora de Interés Compuesto", desc: "Proyectá el crecimiento de tus ahorros o inversiones con interés compuesto." },
  "monotributo.html":       { nombre: "Calculadora de Monotributo", desc: "Conocé tu categoría de monotributo y el importe a pagar según tus ingresos." },
  "liquidacion.html":       { nombre: "Calculadora de Liquidación Final", desc: "Calculá tu liquidación final: días trabajados, SAC, vacaciones no gozadas e indemnización." },
  "costolaboral.html":      { nombre: "Calculadora de Costo Laboral", desc: "Calculá el costo laboral total de un empleado incluyendo cargas patronales." },
  "cuil.html":              { nombre: "Calculadora de CUIL", desc: "Obtené el CUIL a partir del DNI y el sexo." },
  "aguinaldo.html":         { nombre: "Calculadora de Aguinaldo (SAC)", desc: "Calculá tu aguinaldo bruto y neto según el mejor sueldo del semestre, con cálculo proporcional." },
  "conversor.html":         { nombre: "Conversor Peso ↔ Dólar", desc: "Convertí pesos a dólares y viceversa con la cotización en vivo del dólar oficial, blue, MEP, CCL, tarjeta y cripto." },
};

function inyectarJsonLd(obj) {
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(obj);
  document.head.appendChild(s);
}

// ── COTIZACIONES DEL DÓLAR (API pública dolarapi.com) ────────────────
// Reemplaza los iframes de dolarhoy por tarjetas propias con datos en vivo.
const COTIZACIONES_MOSTRAR = [
  { casa: "blue",            titulo: "Dólar Blue" },
  { casa: "bolsa",           titulo: "Dólar Bolsa (MEP)" },
  { casa: "contadoconliqui", titulo: "Dólar CCL" },
  { casa: "oficial",         titulo: "Dólar Oficial" },
];

function formatearPeso(valor) {
  return "$" + Number(valor).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function tiempoDesde(fechaISO) {
  const diffMs = Date.now() - new Date(fechaISO).getTime();
  if (isNaN(diffMs) || diffMs < 0) return "";
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "hace instantes";
  if (min < 60) return `hace ${min} min`;
  const hs = Math.floor(min / 60);
  if (hs < 24) return `hace ${hs} h`;
  return `hace ${Math.floor(hs / 24)} d`;
}

async function cargarCotizaciones() {
  const cont = document.getElementById("cotizacionesDolar");
  if (!cont) return;
  cont.innerHTML = `<p class="cotiza-cargando">Cargando cotizaciones…</p>`;
  try {
    const resp = await fetch("https://dolarapi.com/v1/dolares");
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const data = await resp.json();
    const porCasa = Object.fromEntries(data.map(d => [d.casa, d]));
    const tarjetas = COTIZACIONES_MOSTRAR.map(({ casa, titulo }) => {
      const d = porCasa[casa];
      if (!d) return "";
      return `
        <article class="cotiza-card">
          <h3 class="cotiza-titulo">${titulo}</h3>
          <div class="cotiza-valores">
            <div class="cotiza-item">
              <span class="cotiza-monto">${formatearPeso(d.compra)}</span>
              <span class="cotiza-label">Compra</span>
            </div>
            <div class="cotiza-item">
              <span class="cotiza-monto">${formatearPeso(d.venta)}</span>
              <span class="cotiza-label">Venta</span>
            </div>
          </div>
          <p class="cotiza-fecha">Actualizado ${tiempoDesde(d.fechaActualizacion)}</p>
        </article>`;
    }).join("");
    cont.innerHTML = tarjetas || `<p class="cotiza-cargando">No hay cotizaciones disponibles.</p>`;
  } catch (err) {
    cont.innerHTML = `<p class="cotiza-cargando">No se pudieron cargar las cotizaciones en este momento.</p>`;
  }
}

(function estructurarSEO() {
  const path = window.location.pathname;
  const archivo = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  const urlActual = SITIO + (path.includes('/pages/') ? '/pages/' + archivo : '/');

  // Organización + sitio web (en todas las páginas)
  inyectarJsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FinanTips",
    "url": SITIO + "/",
    "logo": LOGO,
    "description": "Calculadoras financieras gratuitas en español para trabajadores de Toyota Argentina y público general."
  });
  inyectarJsonLd({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FinanTips",
    "url": SITIO + "/",
    "inLanguage": "es-AR"
  });

  // Ficha de aplicación por calculadora
  const calc = CALCULADORAS[archivo];
  if (calc) {
    inyectarJsonLd({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": calc.nombre,
      "url": urlActual,
      "description": calc.desc,
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "inLanguage": "es-AR",
      "isAccessibleForFree": true,
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "ARS" },
      "publisher": { "@type": "Organization", "name": "FinanTips", "logo": LOGO }
    });
    inyectarJsonLd({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": SITIO + "/" },
        { "@type": "ListItem", "position": 2, "name": "Calculadoras", "item": SITIO + "/pages/calculadoras.html" },
        { "@type": "ListItem", "position": 3, "name": calc.nombre, "item": urlActual }
      ]
    });
  }
})();

// Cargar cotizaciones en vivo (reemplaza los iframes de #cotizacionesDolar)
cargarCotizaciones();

// Cargar panel de indicadores económicos (si la página lo incluye)
cargarIndicadores();

document.querySelector('header').innerHTML = `
  <a class="logo" href="${base}index.html" aria-label="FinanTips - Inicio">
    <img src="${base}img/Logo + Finantips.png" alt="Logo de FinanTips" width="160" height="40">
  </a>
  <nav aria-label="Navegación principal">
    <ul>
      <li><a href="${base}index.html">Inicio</a></li>
      <li><a href="${base}pages/pesos.html">Pesos</a></li>
      <li><a href="${base}pages/dolares.html">Dólares</a></li>
      <li><a href="${base}pages/calculadoras.html" class="boton"><button>Calculadoras</button></a></li>
      <li><button id="themeToggle" class="theme-toggle" type="button" aria-label="Cambiar entre modo claro y oscuro" title="Modo claro/oscuro">${iconoTema()}</button></li>
    </ul>
  </nav>
`;

const botonTema = document.getElementById('themeToggle');
if (botonTema) botonTema.addEventListener('click', alternarTema);

document.querySelector('footer').innerHTML = `
  <div class="footer-logo">
    <p><a href="${base}index.html">
      <img class="footer-finantips" src="${base}img/Logo + Finantips.png" alt="Logo de Finantips">
    </a></p>
  </div>
  <div class="footer-content">
    <div class="footer-left">
      <h3>Información de contacto</h3>
      <ul>
        <li><a href="mailto:benjapey99@gmail.com" target="_blank">E-mail <img src="${base}img/iconogmail.png" alt="Logo Gmail"></a></li>
        <li><a href="https://wa.link/bctsbq" target="_blank">Whatsapp <img src="${base}img/iconowhatsapp.png" alt="Logo whatsapp"></a></li>
        <li><a href="https://link.mercadopago.com.ar/finantips" target="_blank">
          <img class="Mercadopago" src="${base}img/iconomercadopago.png" alt="Logo Mercadopago">
        </a></li>
      </ul>
    </div>
    <div class="footer-right">
      <h3>Enlaces útiles</h3>
      <ul>
        <li><a href="${base}pages/pesos.html">Pesos</a></li>
        <li><a href="${base}pages/dolares.html">Dólar</a></li>
        <li><a href="${base}pages/calculadoras.html">Calculadoras</a></li>
        <li><a href="${base}pages/privacidad.html">Política de privacidad</a></li>
        <li><a href="https://link.mercadopago.com.ar/finantips" target="_blank">Donar <img src="${base}img/iconodonar.png" alt="Donar Corazon"></a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>Todos los derechos reservados &copy; 2024-2026</p>
    <div class="footer-container">
      <div class="version" id="version"></div>
      <div class="fecha" id="fecha"></div>
    </div>
  </div>
`;
