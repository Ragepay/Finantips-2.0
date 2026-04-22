function formatPesos(n) {
  return '$ ' + n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function mesesEntre(d1, d2) {
  let m = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
  if (d2.getDate() < d1.getDate()) m--;
  return Math.max(m, 0);
}

function diasVacacionesAnuales(años) {
  if (años < 5)  return 14;
  if (años < 10) return 21;
  if (años < 20) return 28;
  return 35;
}

function calcularLiquidacion() {
  const causa         = document.getElementById('causa').value;
  const huboPreaviso  = document.getElementById('huboPreaviso').value;
  const ingVal        = document.getElementById('fechaIngreso').value;
  const egrVal        = document.getElementById('fechaEgreso').value;
  const sueldo        = parseFloat(document.getElementById('sueldo').value);
  const resultadosEl  = document.getElementById('resultadosLiquidacion');

  if (!ingVal || !egrVal || isNaN(sueldo) || sueldo <= 0) {
    resultadosEl.innerHTML = '<p class="liq-error">Completá todos los campos antes de calcular.</p>';
    return;
  }

  const fechaIngreso = new Date(ingVal + 'T00:00:00');
  const fechaEgreso  = new Date(egrVal + 'T00:00:00');

  if (fechaEgreso <= fechaIngreso) {
    resultadosEl.innerHTML = '<p class="liq-error">La fecha de egreso debe ser posterior a la de ingreso.</p>';
    return;
  }

  // ── ANTIGÜEDAD ────────────────────────────────────────────────────────────
  let años  = fechaEgreso.getFullYear() - fechaIngreso.getFullYear();
  let meses = fechaEgreso.getMonth()    - fechaIngreso.getMonth();
  let dias  = fechaEgreso.getDate()     - fechaIngreso.getDate();

  if (dias < 0)  meses--;
  if (meses < 0) { años--; meses += 12; }
  if (años < 0)  años = 0;

  // Fracción mayor a 3 meses cuenta como año completo (Art. 245 LCT)
  const añosIndem = Math.max(años + (meses > 3 ? 1 : 0), 2);

  // ── INDEMNIZACIÓN POR ANTIGÜEDAD (Art. 245) ───────────────────────────────
  let indemnizacion     = 0;
  let indemnizacionDesc = '—';
  const esDespiSinCausa = causa === 'despido';
  const esMutuo         = causa === 'mutuo';

  if (esDespiSinCausa) {
    indemnizacion     = sueldo * añosIndem;
    indemnizacionDesc = `${añosIndem} ${añosIndem === 1 ? 'año' : 'años'} × ${formatPesos(sueldo)}`;
  } else if (esMutuo) {
    const base    = sueldo * añosIndem;
    indemnizacion = base * (2 / 3);
    indemnizacionDesc = `67% de ${añosIndem} años × ${formatPesos(sueldo)}`;
  }

  // ── VACACIONES NO GOZADAS (Art. 156) ─────────────────────────────────────
  const diasVacAnuales = diasVacacionesAnuales(años);

  // Inicio del cómputo: el mayor entre Jan 1 del año de egreso y fecha de ingreso
  const iniAño    = new Date(fechaEgreso.getFullYear(), 0, 1);
  const iniVac    = fechaIngreso > iniAño ? fechaIngreso : iniAño;
  const mesesVac  = Math.max(mesesEntre(iniVac, fechaEgreso) + 1, 1); // +1 incluye el mes de egreso
  const mesesVacEfectivos = Math.min(mesesVac, 12);

  const diasVacProp = parseFloat(((diasVacAnuales / 12) * mesesVacEfectivos).toFixed(2));
  const valorDia    = sueldo / 25;
  const vacaciones  = valorDia * diasVacProp;

  // ── SAC COMPLEMENTARIO ────────────────────────────────────────────────────
  const mes      = fechaEgreso.getMonth();
  const anoEgr   = fechaEgreso.getFullYear();
  const semStart = mes < 6 ? new Date(anoEgr, 0, 1) : new Date(anoEgr, 6, 1);
  const diasSem  = Math.round((fechaEgreso - semStart) / 86400000) + 1;
  // Días totales del semestre (aprox.)
  const diasSemTotal = mes < 6
    ? Math.round((new Date(anoEgr, 6, 1) - new Date(anoEgr, 0, 1)) / 86400000)
    : Math.round((new Date(anoEgr + 1, 0, 1) - new Date(anoEgr, 6, 1)) / 86400000);
  const sac = (sueldo / 2) * Math.min(diasSem / diasSemTotal, 1);

  // ── PREAVISO (Art. 231) ───────────────────────────────────────────────────
  let preaviso      = 0;
  let mesesPreaviso = 0;
  let preavisoDesc  = '—';
  const debePreaviso = esDespiSinCausa && huboPreaviso === 'no';

  if (debePreaviso) {
    const totalMeses = años * 12 + meses;
    if (totalMeses < 3) {
      mesesPreaviso = 0.5; // 15 días
    } else if (años < 5) {
      mesesPreaviso = 1;
    } else {
      mesesPreaviso = 2;
    }
    preaviso     = sueldo * mesesPreaviso;
    preavisoDesc = mesesPreaviso === 0.5
      ? '15 días (< 3 meses de antigüedad)'
      : `${mesesPreaviso} ${mesesPreaviso === 1 ? 'mes' : 'meses'} (Art. 231 LCT)`;
  }

  const total = indemnizacion + vacaciones + sac + preaviso;

  // ── RENDER ────────────────────────────────────────────────────────────────
  const causaLabel = {
    despido: 'Despido sin causa',
    renuncia: 'Renuncia',
    causa_justa: 'Despido con causa justificada',
    mutuo: 'Mutuo acuerdo (Art. 241)',
  }[causa];

  const semestre = mes < 6 ? '1° semestre' : '2° semestre';

  resultadosEl.innerHTML = `
    <div class="liq-resultado">
      <div class="liq-header">
        <div class="liq-causa-badge">${causaLabel}</div>
        <div class="liq-antiguedad">
          Antigüedad: <strong>${años} ${años === 1 ? 'año' : 'años'} y ${meses} ${meses === 1 ? 'mes' : 'meses'}</strong>
          &nbsp;·&nbsp; Vacaciones anuales: <strong>${diasVacAnuales} días</strong>
        </div>
      </div>

      <table class="liq-tabla">
        <thead>
          <tr>
            <th>Concepto</th>
            <th>Detalle</th>
            <th>Importe</th>
          </tr>
        </thead>
        <tbody>
          ${indemnizacion > 0 ? `
          <tr>
            <td>Indemnización por antigüedad</td>
            <td class="liq-detalle">${indemnizacionDesc}</td>
            <td>${formatPesos(indemnizacion)}</td>
          </tr>` : ''}
          <tr>
            <td>Vacaciones no gozadas</td>
            <td class="liq-detalle">${diasVacProp.toFixed(1)} días × ${formatPesos(valorDia)}</td>
            <td>${formatPesos(vacaciones)}</td>
          </tr>
          <tr>
            <td>SAC complementario</td>
            <td class="liq-detalle">${semestre} · ${diasSem} de ${diasSemTotal} días</td>
            <td>${formatPesos(sac)}</td>
          </tr>
          ${preaviso > 0 ? `
          <tr>
            <td>Preaviso</td>
            <td class="liq-detalle">${preavisoDesc}</td>
            <td>${formatPesos(preaviso)}</td>
          </tr>` : ''}
        </tbody>
        <tfoot>
          <tr class="liq-total">
            <td colspan="2">Total liquidación</td>
            <td>${formatPesos(total)}</td>
          </tr>
        </tfoot>
      </table>

      <p class="liq-nota">
        Cálculo orientativo basado en la LCT. No incluye integración del mes de despido ni retenciones impositivas.
        Para casos específicos consultá a un profesional.
      </p>
    </div>
  `;
}

// Mostrar/ocultar el campo de preaviso según la causa seleccionada
document.addEventListener('DOMContentLoaded', function () {
  const causaEl    = document.getElementById('causa');
  const preavisoWrap = document.getElementById('preavisoWrap');

  function togglePreaviso() {
    preavisoWrap.style.display = causaEl.value === 'despido' ? '' : 'none';
  }

  causaEl.addEventListener('change', togglePreaviso);
  togglePreaviso();

  // Fecha de egreso por defecto = hoy
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm   = String(hoy.getMonth() + 1).padStart(2, '0');
  const dd   = String(hoy.getDate()).padStart(2, '0');
  document.getElementById('fechaEgreso').value = `${yyyy}-${mm}-${dd}`;

  document.getElementById('btnCalcular').addEventListener('click', calcularLiquidacion);
});
