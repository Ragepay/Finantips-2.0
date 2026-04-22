// Tasas fijas (Resolución General AFIP y LCT vigente)
const JUBILACION_TRAB  = 0.11;
const OBRA_SOC_TRAB    = 0.03;
const PAMI_TRAB        = 0.03;
const TOTAL_APORTES    = JUBILACION_TRAB + OBRA_SOC_TRAB + PAMI_TRAB; // 0.17

const JUBILACION_PAT   = 0.16;
const OBRA_SOC_PAT     = 0.05;
const PAMI_PAT         = 0.02;
const ASIG_FAM         = 0.075;
const FNE              = 0.015;
const SEGURO_VIDA      = 0.0003;

function fmt(n) {
  return '$' + n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtPct(n) {
  return n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
}

function calcularCostoLaboral() {
  const sueldoNeto = parseFloat(document.getElementById('sueldoNeto').value);
  const artPct     = parseFloat(document.getElementById('art').value);
  const resultEl   = document.getElementById('resultadosCosto');

  if (isNaN(sueldoNeto) || sueldoNeto <= 0) {
    resultEl.innerHTML = '<p class="costo-error">Ingresá un sueldo neto válido.</p>';
    return;
  }
  if (isNaN(artPct) || artPct < 0) {
    resultEl.innerHTML = '<p class="costo-error">Ingresá un porcentaje de ART válido.</p>';
    return;
  }

  const art = artPct / 100;

  // Sueldo bruto a partir del neto (sin retención de ganancias)
  const bruto = sueldoNeto / (1 - TOTAL_APORTES);

  // Aportes del trabajador
  const jubTrab  = bruto * JUBILACION_TRAB;
  const osTrab   = bruto * OBRA_SOC_TRAB;
  const pamiTrab = bruto * PAMI_TRAB;

  // Contribuciones patronales
  const jubPat   = bruto * JUBILACION_PAT;
  const osPat    = bruto * OBRA_SOC_PAT;
  const pamiPat  = bruto * PAMI_PAT;
  const asigFam  = bruto * ASIG_FAM;
  const fne      = bruto * FNE;
  const segVida  = bruto * SEGURO_VIDA;
  const artMonto = bruto * art;

  const totalPatronal = jubPat + osPat + pamiPat + asigFam + fne + segVida + artMonto;
  const costoTotal    = bruto + totalPatronal;

  const costoSobreNeto  = ((costoTotal / sueldoNeto) - 1) * 100;
  const costoSobreBruto = ((costoTotal / bruto) - 1) * 100;

  resultEl.innerHTML = `
    <table class="costo-tabla">
      <thead>
        <tr>
          <th colspan="2">Costo de un empleado — sueldo neto ${fmt(sueldoNeto)}</th>
        </tr>
      </thead>
      <tbody>
        <tr class="costo-fila-dato">
          <td>Sueldo Bruto</td>
          <td>${fmt(bruto)}</td>
        </tr>

        <tr class="costo-seccion"><td colspan="2">Aportes y deducciones del trabajador</td></tr>
        <tr class="costo-fila-dato">
          <td>Jubilación (11%)</td>
          <td>${fmt(jubTrab)}</td>
        </tr>
        <tr class="costo-fila-dato">
          <td>Obra Social (3%)</td>
          <td>${fmt(osTrab)}</td>
        </tr>
        <tr class="costo-fila-dato">
          <td>Ley 19032 — PAMI (3%)</td>
          <td>${fmt(pamiTrab)}</td>
        </tr>
        <tr class="costo-fila-dato">
          <td>Impuesto a las Ganancias</td>
          <td>$0,00 <span class="costo-nota-inline">(*)</span></td>
        </tr>
        <tr class="costo-fila-subtotal">
          <td>Sueldo Neto a pagar</td>
          <td>${fmt(sueldoNeto)}</td>
        </tr>

        <tr class="costo-seccion"><td colspan="2">Contribuciones del empleador</td></tr>
        <tr class="costo-fila-dato">
          <td>Jubilación (16%)</td>
          <td>${fmt(jubPat)}</td>
        </tr>
        <tr class="costo-fila-dato">
          <td>Obra Social (5%)</td>
          <td>${fmt(osPat)}</td>
        </tr>
        <tr class="costo-fila-dato">
          <td>Ley 19032 — PAMI (2%)</td>
          <td>${fmt(pamiPat)}</td>
        </tr>
        <tr class="costo-fila-dato">
          <td>Asignaciones Familiares (7.5%)</td>
          <td>${fmt(asigFam)}</td>
        </tr>
        <tr class="costo-fila-dato">
          <td>Fondo Nacional de Empleo (1.5%)</td>
          <td>${fmt(fne)}</td>
        </tr>
        <tr class="costo-fila-dato">
          <td>Seguro de Vida Obligatorio (0.03%)</td>
          <td>${fmt(segVida)}</td>
        </tr>
        <tr class="costo-fila-dato">
          <td>ART (${artPct}%)</td>
          <td>${fmt(artMonto)}</td>
        </tr>
        <tr class="costo-fila-subtotal">
          <td>Total Contribuciones Patronales</td>
          <td>${fmt(totalPatronal)}</td>
        </tr>

        <tr class="costo-total">
          <td>COSTO TOTAL DEL EMPLEADO</td>
          <td>${fmt(costoTotal)}</td>
        </tr>
        <tr class="costo-fila-pct">
          <td>Costo extra sobre sueldo neto</td>
          <td class="costo-badge-pct">${fmtPct(costoSobreNeto)}</td>
        </tr>
        <tr class="costo-fila-pct">
          <td>Costo extra sobre sueldo bruto</td>
          <td>${fmtPct(costoSobreBruto)}</td>
        </tr>
      </tbody>
    </table>
    <p class="costo-aclaracion">(*) No incluye retención de Impuesto a las Ganancias. Las tasas de contribuciones
    patronales corresponden al régimen general. Pueden variar según actividad y tamaño de la empresa.</p>
  `;
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('btnCosto').addEventListener('click', calcularCostoLaboral);
});
