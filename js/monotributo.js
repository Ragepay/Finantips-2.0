const CATEGORIAS_MONOTRIBUTO = [
  { letra: 'A', ingresosMax: 10277988.13, supAfectada: 30, energiaKw: 3330, alquileresMax: 2390229.80, impServicios: 4780.46, impMuebles: 4780.46, sipa: 15616.17, obraSocial: 21990.11 },
  { letra: 'B', ingresosMax: 15058447.71, supAfectada: 45, energiaKw: 5000, alquileresMax: 2390229.80, impServicios: 9082.88, impMuebles: 9082.88, sipa: 17177.79, obraSocial: 21990.11 },
  { letra: 'C', ingresosMax: 21113696.52, supAfectada: 60, energiaKw: 6700, alquileresMax: 3266647.39, impServicios: 15616.17, impMuebles: 14341.38, sipa: 18895.57, obraSocial: 21990.11 },
  { letra: 'D', ingresosMax: 26212853.42, supAfectada: 85, energiaKw: 10000, alquileresMax: 3266647.39, impServicios: 25495.79, impMuebles: 23742.95, sipa: 20785.13, obraSocial: 26133.18 },
  { letra: 'E', ingresosMax: 30833984.37, supAfectada: 110, energiaKw: 13000, alquileresMax: 4143064.98, impServicios: 47764.60, impMuebles: 37884.98, sipa: 22883.64, obraSocial: 31889.73 },
  { letra: 'F', ingresosMax: 38642048.36, supAfectada: 150, energiaKw: 16500, alquileresMax: 4143064.98, impServicios: 67245.13, impMuebles: 49398.08, sipa: 25150.00, obraSocial: 36650.19 },
  { letra: 'G', ingresosMax: 46211109.37, supAfectada: 200, energiaKw: 20000, alquileresMax: 4939808.23, impServicios: 122379.76, impMuebles: 61189.87, sipa: 35210.00, obraSocial: 39518.47 },
  { letra: 'H', ingresosMax: 70113407.33, supAfectada: 200, energiaKw: 20000, alquileresMax: 7170689.39, impServicios: 350567.04, impMuebles: 175283.51, sipa: 49294.00, obraSocial: 47485.89 },
  { letra: 'I', ingresosMax: 78479211.62, supAfectada: 200, energiaKw: 20000, alquileresMax: 7170689.39, impServicios: 697150.35, impMuebles: 278860.14, sipa: 69011.60, obraSocial: 58640.31 },
  { letra: 'J', ingresosMax: 89872840.30, supAfectada: 200, energiaKw: 20000, alquileresMax: 7170689.39, impServicios: 836580.42, impMuebles: 334632.18, sipa: 96616.24, obraSocial: 65810.99 },
  { letra: 'K', ingresosMax: 108357084.05, supAfectada: 200, energiaKw: 20000, alquileresMax: 7170689.39, impServicios: 1171212.59, impMuebles: 390404.20, sipa: 135262.74, obraSocial: 75212.57 },
];

function formatPesos(num) {
  return '$ ' + num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calcularMonotributo() {
  const tipoActividad = document.getElementById('tipoActividad').value;
  const periodo = document.getElementById('periodo').value;
  const ingresosRaw = parseFloat(document.getElementById('inputIngresos').value);
  const resultadosEl = document.getElementById('resultadosMonotributo');

  if (isNaN(ingresosRaw) || ingresosRaw <= 0) {
    resultadosEl.innerHTML = '<p class="monotributo-error">Por favor ingresá un monto válido.</p>';
    return;
  }

  const ingresosAnuales = periodo === 'mensual' ? ingresosRaw * 12 : ingresosRaw;
  const categoria = CATEGORIAS_MONOTRIBUTO.find(cat => ingresosAnuales <= cat.ingresosMax);

  if (!categoria) {
    resultadosEl.innerHTML = `
      <div class="monotributo-excedido">
        <div class="excedido-titulo">⚠ Superás la categoría K</div>
        <p>Tus ingresos anuales de <strong>${formatPesos(ingresosAnuales)}</strong> superan el límite máximo del monotributo
        (<strong>${formatPesos(108357084.05)}</strong> anuales).</p>
        <p>Debés inscribirte en el <strong>Régimen General</strong> (IVA + Ganancias 4ª categoría).</p>
      </div>
    `;
    return;
  }

  const impuesto = tipoActividad === 'servicios' ? categoria.impServicios : categoria.impMuebles;
  const total = impuesto + categoria.sipa + categoria.obraSocial;
  const porcentaje = Math.min((ingresosAnuales / categoria.ingresosMax) * 100, 100).toFixed(1);
  const actividadLabel = tipoActividad === 'servicios' ? 'Locaciones y Prestaciones de Servicios' : 'Venta de Cosas Muebles';

  resultadosEl.innerHTML = `
    <div class="monotributo-resultado">
      <div class="monotributo-categoria-header">
        <div class="monotributo-letra">${categoria.letra}</div>
        <div class="monotributo-categoria-info">
          <div class="monotributo-categoria-titulo">Categoría ${categoria.letra}</div>
          <div class="monotributo-actividad">${actividadLabel}</div>
        </div>
      </div>

      <div class="monotributo-barra-wrap">
        <div class="monotributo-barra-labels">
          <span>Ingresos anuales: <strong>${formatPesos(ingresosAnuales)}</strong></span>
          <span>Límite categ. ${categoria.letra}: <strong>${formatPesos(categoria.ingresosMax)}</strong></span>
        </div>
        <div class="monotributo-barra">
          <div class="monotributo-barra-fill" style="width:${porcentaje}%"></div>
        </div>
        <p class="monotributo-barra-pct">Utilizás el <strong>${porcentaje}%</strong> del límite de la categoría</p>
      </div>

      <h3 class="monotributo-cuota-titulo">Cuota mensual a pagar</h3>
      <table class="monotributo-tabla-cuota">
        <tbody>
          <tr>
            <td>Impuesto integrado</td>
            <td>${formatPesos(impuesto)}</td>
          </tr>
          <tr>
            <td>Aportes al SIPA (jubilación)</td>
            <td>${formatPesos(categoria.sipa)}</td>
          </tr>
          <tr>
            <td>Aportes a obra social</td>
            <td>${formatPesos(categoria.obraSocial)}</td>
          </tr>
          <tr class="monotributo-tabla-total">
            <td>Total mensual</td>
            <td>${formatPesos(total)}</td>
          </tr>
        </tbody>
      </table>
      <p class="monotributo-vigencia">Valores vigentes desde el 01/02/2026 · Fuente: AFIP</p>
    </div>
  `;
}

function renderTablaReferencia() {
  const tipoActividad = document.getElementById('tipoActividad') ? document.getElementById('tipoActividad').value : 'servicios';

  const filas = CATEGORIAS_MONOTRIBUTO.map(cat => {
    const impServ = cat.impServicios + cat.sipa + cat.obraSocial;
    const impMuebles = cat.impMuebles + cat.sipa + cat.obraSocial;
    return `
      <tr>
        <td><strong>${cat.letra}</strong></td>
        <td>${formatPesos(cat.ingresosMax)}</td>
        <td>${formatPesos(impServ)}</td>
        <td>${formatPesos(impMuebles)}</td>
      </tr>
    `;
  }).join('');

  const tablaEl = document.getElementById('tablaTodasCategorias');
  if (tablaEl) {
    tablaEl.innerHTML = `
      <thead>
        <tr>
          <th>Cat.</th>
          <th>Ingresos brutos anuales (máx.)</th>
          <th>Total mensual (Servicios)</th>
          <th>Total mensual (Muebles)</th>
        </tr>
      </thead>
      <tbody>${filas}</tbody>
    `;
  }
}

document.addEventListener('DOMContentLoaded', renderTablaReferencia);
