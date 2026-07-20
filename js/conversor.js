// Conversor Peso ↔ Dólar con cotizaciones en vivo (dolarapi.com)
const TIPOS_DOLAR = [
  { casa: "oficial", nombre: "Oficial" },
  { casa: "blue", nombre: "Blue" },
  { casa: "bolsa", nombre: "Bolsa (MEP)" },
  { casa: "contadoconliqui", nombre: "Contado con liqui (CCL)" },
  { casa: "tarjeta", nombre: "Tarjeta" },
  { casa: "cripto", nombre: "Cripto" },
];

let cotizaciones = {};

function fmtPesos(num) {
  return "$ " + Number(num).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtUsd(num) {
  return "US$ " + Number(num).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function cargarCotizacionesConversor() {
  const select = document.getElementById("tipoDolar");
  try {
    const resp = await fetch("https://dolarapi.com/v1/dolares");
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const data = await resp.json();
    cotizaciones = Object.fromEntries(data.map(d => [d.casa, d]));
    select.innerHTML = TIPOS_DOLAR
      .filter(t => cotizaciones[t.casa])
      .map(t => `<option value="${t.casa}">Dólar ${t.nombre} — compra ${fmtPesos(cotizaciones[t.casa].compra)} / venta ${fmtPesos(cotizaciones[t.casa].venta)}</option>`)
      .join("");
    convertir();
  } catch (err) {
    select.innerHTML = `<option value="">No se pudieron cargar las cotizaciones</option>`;
  }
}

function convertir() {
  const resultadoEl = document.getElementById("resultadoConversor");
  const detalleEl = document.getElementById("detalleConversor");
  const casa = document.getElementById("tipoDolar").value;
  const direccion = document.getElementById("direccion").value;
  let monto = parseFloat(document.getElementById("inputMonto").value);
  if (isNaN(monto)) monto = 0;

  const cot = cotizaciones[casa];
  if (!cot) { resultadoEl.textContent = "—"; detalleEl.textContent = ""; return; }

  if (direccion === "pesoToDolar") {
    // Comprás dólares: usás el precio de VENTA
    const resultado = monto / cot.venta;
    resultadoEl.textContent = fmtUsd(resultado);
    detalleEl.innerHTML = `${fmtPesos(monto)} equivalen a <strong>${fmtUsd(resultado)}</strong><br>
      <span class="conversor-tasa">Tipo de cambio usado: venta ${fmtPesos(cot.venta)} (comprás dólares)</span>`;
  } else {
    // Vendés dólares: usás el precio de COMPRA
    const resultado = monto * cot.compra;
    resultadoEl.textContent = fmtPesos(resultado);
    detalleEl.innerHTML = `${fmtUsd(monto)} equivalen a <strong>${fmtPesos(resultado)}</strong><br>
      <span class="conversor-tasa">Tipo de cambio usado: compra ${fmtPesos(cot.compra)} (vendés dólares)</span>`;
  }
}

function actualizarPlaceholder() {
  const direccion = document.getElementById("direccion").value;
  const input = document.getElementById("inputMonto");
  const label = document.getElementById("labelMonto");
  if (direccion === "pesoToDolar") {
    label.textContent = "Monto en pesos:";
    input.placeholder = "100000";
  } else {
    label.textContent = "Monto en dólares:";
    input.placeholder = "100";
  }
  convertir();
}

window.convertir = convertir;
window.actualizarPlaceholder = actualizarPlaceholder;

document.addEventListener("DOMContentLoaded", () => {
  cargarCotizacionesConversor();
  document.getElementById("inputMonto").addEventListener("input", convertir);
  document.getElementById("tipoDolar").addEventListener("change", convertir);
  document.getElementById("direccion").addEventListener("change", actualizarPlaceholder);
});
