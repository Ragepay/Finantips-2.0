const base = window.location.pathname.includes('/pages/') ? '../' : '';

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
        <li><a href="https://link.mercadopago.com.ar/finantips" target="_blank">Donar <img src="${base}img/iconodonar.png" alt="Donar Corazon"></a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>Todos los derechos reservados &copy; 2024</p>
    <div class="footer-container">
      <div class="version" id="version"></div>
      <div class="fecha" id="fecha"></div>
    </div>
  </div>
`;
