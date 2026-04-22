import {
  maxCargasSociales,
  minimoNoImponible,
  deduccionEspecial,
  conyuge,
  hijo,
  maxAlquileresDeducibles,
  escalaActualizada,
  JUBILACION,
  LEY_19032,
  OBRA_SOCIAL,
  DEDUCCION_ALQUILER
} from './actualizacion.js';

const JUBILACION_PAT = 0.16;
const OBRA_SOC_PAT   = 0.05;
const PAMI_PAT       = 0.02;
const ASIG_FAM       = 0.075;
const FNE            = 0.015;
const SEGURO_VIDA    = 0.0003;
const TOTAL_APORTES  = JUBILACION + LEY_19032 + OBRA_SOCIAL; // 0.17

const minimoImponible = minimoNoImponible + deduccionEspecial;

function fmt(n) {
  return '$' + n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtPct(n) {
  return n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
}

function calcularGanancias(bruto, jubTrab, leyTrab, osTrab, numHijos, tienesConyuge, alquilerMensual, otrasDed) {
  const conyugeDeduccion = tienesConyuge ? conyuge : 0;
  const hijosDeducciones = numHijos * hijo;

  let alquilerDeduccion = alquilerMensual * DEDUCCION_ALQUILER;
  if (alquilerDeduccion > maxAlquileresDeducibles) alquilerDeduccion = maxAlquileresDeducibles;

  let montoImponible = bruto - minimoImponible - jubTrab - leyTrab - osTrab
                       - otrasDed - conyugeDeduccion - alquilerDeduccion - hijosDeducciones;

  if (montoImponible < 0) montoImponible = 0;

  const escala  = [...escalaActualizada];
  const numRet  = [5, 9, 12, 15, 19, 23, 27, 31, 35];
  let retencion = 0;

  for (let i = 0; i < escala.length; i++) {
    if (montoImponible <= escala[i]) {
      retencion += (montoImponible - (i > 0 ? escala[i - 1] : 0)) * (numRet[i - 1] / 100);
      break;
    } else if (i > 0) {
      retencion += (escala[i] - escala[i - 1]) * (numRet[i - 1] / 100);
    }
  }

  return isNaN(retencion) ? 0 : retencion;
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

  // Neto → Bruto respetando el tope de cargas sociales
  // Caso 1 (sin tope): neto = bruto * (1 - 0.17)  →  bruto = neto / 0.83
  // Caso 2 (con tope): neto = bruto - maxCS * 0.17  →  bruto = neto + maxCS * 0.17
  let bruto = sueldoNeto / (1 - TOTAL_APORTES);
  let baseAportes;

  if (bruto <= maxCargasSociales) {
    baseAportes = bruto;
  } else {
    bruto       = sueldoNeto + maxCargasSociales * TOTAL_APORTES;
    baseAportes = maxCargasSociales;
  }

  const jubTrab = baseAportes * JUBILACION;
  const leyTrab = baseAportes * LEY_19032;
  const osTrab  = baseAportes * OBRA_SOCIAL;

  // Ganancias sobre el bruto calculado
  const numHijos        = parseInt(document.getElementById('hijos').value) || 0;
  const tienesConyuge   = document.getElementById('conyugeSi').checked;
  const alquilerMensual = parseFloat(document.getElementById('alquiler').value) || 0;
  const otrasDed        = parseFloat(document.getElementById('otrasDeducciones').value) || 0;

  const ganancias    = calcularGanancias(bruto, jubTrab, leyTrab, osTrab, numHijos, tienesConyuge, alquilerMensual, otrasDed);
  const netoEfectivo = sueldoNeto - ganancias;

  // Contribuciones patronales (sobre bruto completo, sin tope)
  const jubPat   = bruto * JUBILACION_PAT;
  const osPat    = bruto * OBRA_SOC_PAT;
  const pamiPat  = bruto * PAMI_PAT;
  const asigFam  = bruto * ASIG_FAM;
  const fne      = bruto * FNE;
  const segVida  = bruto * SEGURO_VIDA;
  const artMonto = bruto * art;

  const totalPatronal   = jubPat + osPat + pamiPat + asigFam + fne + segVida + artMonto;
  const costoTotal      = bruto + totalPatronal;
  const costoSobreNeto  = netoEfectivo > 0 ? ((costoTotal / netoEfectivo) - 1) * 100 : 0;
  const costoSobreBruto = ((costoTotal / bruto) - 1) * 100;

  const topeNota = baseAportes === maxCargasSociales
    ? ' <span class="costo-nota-inline">(tope aplicado)</span>'
    : '';

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
          <td>Jubilación (11%)${topeNota}</td>
          <td>-${fmt(jubTrab)}</td>
        </tr>
        <tr class="costo-fila-dato">
          <td>Obra Social (3%)${topeNota}</td>
          <td>-${fmt(osTrab)}</td>
        </tr>
        <tr class="costo-fila-dato">
          <td>Ley 19032 — PAMI (3%)${topeNota}</td>
          <td>-${fmt(leyTrab)}</td>
        </tr>
        <tr class="costo-fila-dato">
          <td>Impuesto a las Ganancias</td>
          <td>-${fmt(ganancias)}</td>
        </tr>
        <tr class="costo-fila-subtotal">
          <td>Sueldo Neto en mano</td>
          <td>${fmt(netoEfectivo)}</td>
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
          <td>Costo extra sobre sueldo neto en mano</td>
          <td class="costo-badge-pct">${fmtPct(costoSobreNeto)}</td>
        </tr>
        <tr class="costo-fila-pct">
          <td>Costo extra sobre sueldo bruto</td>
          <td>${fmtPct(costoSobreBruto)}</td>
        </tr>
      </tbody>
    </table>
    <p class="costo-aclaracion">Las tasas de contribuciones patronales corresponden al régimen general. Pueden variar según actividad y tamaño de la empresa. El tope de cargas sociales vigente es ${fmt(maxCargasSociales)}.</p>
  `;
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('btnCosto').addEventListener('click', calcularCostoLaboral);
});
