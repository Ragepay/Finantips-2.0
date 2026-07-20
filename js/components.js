const base = window.location.pathname.includes('/pages/') ? '../' : '';

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
};

function inyectarJsonLd(obj) {
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(obj);
  document.head.appendChild(s);
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

document.querySelector('header').innerHTML = `
  <a class="logo" href="${base}index.html">
    <img src="${base}img/Logo + Finantips.png" alt="Logo de Finantips">
  </a>
  <nav>
    <ul>
      <li><a href="${base}index.html">Inicio</a></li>
      <li><a href="${base}pages/pesos.html">Pesos</a></li>
      <li><a href="${base}pages/dolares.html">Dólares</a></li>
      <li><a href="${base}pages/calculadoras.html" class="boton"><button>Calculadoras</button></a></li>
    </ul>
  </nav>
`;

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
