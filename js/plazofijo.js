// Formato monetario argentino: 1.234.567,89
function fmtPesos(num) {
  return num.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calcularPlazoFijo() {

  // Obtener los valores ingresados por el usuario.
  let monto = parseFloat(document.getElementById("inputMonto").value);
  let tasaInteres = parseFloat(document.getElementById("inputTasaInteres").value);
  let meses = parseInt(document.getElementById("inputMeses").value);
  let interesCompuesto = document.getElementById("inputInteresCompuesto").checked;

  if (isNaN(monto) || monto <= 0 || isNaN(tasaInteres) || tasaInteres <= 0 || isNaN(meses) || meses <= 0) {
    document.getElementById("ganancias").textContent = "";
    document.getElementById("montoTotal").textContent = "";
    return;
  }

  let ganancias;

  // Calcular las ganancias.
  if (interesCompuesto) {
    ganancias = monto * Math.pow((tasaInteres / 365 * 30 / 100 + 1), meses) - monto;
  } else {
    ganancias = monto * (tasaInteres / 365) * (meses * 30) / 100;
  }
  let montoTotal = monto + ganancias;

  // Mostrar los resultados.
  document.getElementById("ganancias").textContent = " $ " + fmtPesos(ganancias);
  document.getElementById("montoTotal").textContent = " $ " + fmtPesos(montoTotal);
}