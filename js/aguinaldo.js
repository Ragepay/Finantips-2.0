// Calculadora de Aguinaldo (SAC - Sueldo Anual Complementario)
// SAC = (mejor remuneración mensual del semestre / 2) × (meses trabajados / 6)
// Aportes del empleado sobre el aguinaldo: 11% jubilación + 3% ley 19.032 + 3% obra social = 17%
const APORTES_AGUINALDO = 0.17;

function fmtPesosAg(num) {
  return "$ " + Number(num).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calcularAguinaldo() {
  const resultadoEl = document.getElementById("resultadosAguinaldo");
  let mejorSueldo = parseFloat(document.getElementById("inputMejorSueldo").value);
  let meses = parseInt(document.getElementById("inputMeses").value, 10);

  if (isNaN(mejorSueldo) || mejorSueldo <= 0) {
    resultadoEl.innerHTML = '<p class="aguinaldo-error">Ingresá tu mejor sueldo bruto del semestre.</p>';
    return;
  }
  if (isNaN(meses) || meses < 1) meses = 6;
  if (meses > 6) meses = 6;

  const bruto = (mejorSueldo / 2) * (meses / 6);
  const aportes = bruto * APORTES_AGUINALDO;
  const neto = bruto - aportes;

  resultadoEl.innerHTML = `
    <div class="aguinaldo-resultado">
      <div class="aguinaldo-principal">
        <span class="aguinaldo-label">Aguinaldo neto (a cobrar)</span>
        <span class="aguinaldo-valor">${fmtPesosAg(neto)}</span>
      </div>
      <table class="aguinaldo-tabla">
        <tbody>
          <tr>
            <td>Aguinaldo bruto</td>
            <td>${fmtPesosAg(bruto)}</td>
          </tr>
          <tr>
            <td>Aportes (jubilación 11% + ley 3% + obra social 3%)</td>
            <td>− ${fmtPesosAg(aportes)}</td>
          </tr>
          <tr class="aguinaldo-total">
            <td>Aguinaldo neto</td>
            <td>${fmtPesosAg(neto)}</td>
          </tr>
        </tbody>
      </table>
      <p class="aguinaldo-nota">
        ${meses < 6 ? `Cálculo proporcional por <strong>${meses}</strong> ${meses === 1 ? "mes" : "meses"} trabajados en el semestre. ` : ""}
        El SAC es el 50% de la mejor remuneración mensual del semestre. Valor orientativo.
      </p>
    </div>
  `;
}

window.calcularAguinaldo = calcularAguinaldo;

document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("botonAguinaldo");
  if (boton) boton.addEventListener("click", calcularAguinaldo);
});
