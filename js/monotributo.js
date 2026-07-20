const CATEGORIAS_MONOTRIBUTO = [
  { letra: 'A', ingresosMax: 12009410.45, supAfectada: 30, energiaKw: 3330, alquileresMax: 2792886.15, impServicios: 5585.77, impMuebles: 5585.77, sipa: 18246.86, obraSocial: 25694.55 },
  { letra: 'B', ingresosMax: 17595182.74, supAfectada: 45, energiaKw: 5000, alquileresMax: 2792886.15, impServicios: 10612.98, impMuebles: 10612.98, sipa: 20071.55, obraSocial: 25694.55 },
  { letra: 'C', ingresosMax: 24670494.31, supAfectada: 60, energiaKw: 6700, alquileresMax: 3816944.41, impServicios: 18246.86, impMuebles: 16757.32, sipa: 22078.70, obraSocial: 25694.55 },
  { letra: 'D', ingresosMax: 30628651.43, supAfectada: 85, energiaKw: 10000, alquileresMax: 3816944.41, impServicios: 29790.79, impMuebles: 27742.67, sipa: 24286.57, obraSocial: 30535.56 },
  { letra: 'E', ingresosMax: 36028231.33, supAfectada: 110, energiaKw: 13000, alquileresMax: 4841002.66, impServicios: 55857.73, impMuebles: 44313.79, sipa: 26715.23, obraSocial: 37238.48 },
  { letra: 'F', ingresosMax: 45151659.41, supAfectada: 150, energiaKw: 16500, alquileresMax: 4841002.66, impServicios: 78573.20, impMuebles: 57719.64, sipa: 29386.75, obraSocial: 42824.25 },
  { letra: 'G', ingresosMax: 53995798.87, supAfectada: 200, energiaKw: 20000, alquileresMax: 5771964.69, impServicios: 142995.76, impMuebles: 71497.87, sipa: 41141.45, obraSocial: 46175.72 },
  { letra: 'H', ingresosMax: 81924660.37, supAfectada: 200, energiaKw: 20000, alquileresMax: 8378658.45, impServicios: 409623.31, impMuebles: 204811.64, sipa: 57598.03, obraSocial: 55485.33 },
  { letra: 'I', ingresosMax: 91699761.90, supAfectada: 200, energiaKw: 20000, alquileresMax: 8378658.45, impServicios: 814591.79, impMuebles: 325836.71, sipa: 80637.24, obraSocial: 68518.81 },
  { letra: 'J', ingresosMax: 105012519.19, supAfectada: 200, energiaKw: 20000, alquileresMax: 8378658.45, impServicios: 977510.14, impMuebles: 391004.07, sipa: 112892.14, obraSocial: 76897.46 },
  { letra: 'K', ingresosMax: 126610838.74, supAfectada: 200, energiaKw: 20000, alquileresMax: 8378658.45, impServicios: 1368514.20, impMuebles: 456171.40, sipa: 158049.00, obraSocial: 87882.82 },
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
        (<strong>${formatPesos(126610838.74)}</strong> anuales).</p>
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
      <p class="monotributo-vigencia">Valores vigentes 2º semestre 2026 · Fuente: ARCA</p>
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
