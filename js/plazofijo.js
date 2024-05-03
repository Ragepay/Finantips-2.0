function calcularPlazoFijo() {

  // Obtener los valores ingresados por el usuario.
  let monto = parseFloat(document.getElementById("inputMonto").value);
  let tasaInteres = parseFloat(document.getElementById("inputTasaInteres").value);
  let meses = parseInt(document.getElementById("inputMeses").value);
  let interesCompuesto = document.getElementById("inputInteresCompuesto").checked;
  let ganancias;

  // Calcular las ganancias.
  if (interesCompuesto) {
    ganancias = monto * Math.pow((tasaInteres / 365 * 30 / 100 + 1), meses) - monto;
  } else {
    ganancias = monto * (tasaInteres / 365) * (meses * 30) / 100;
  }
  let montoTotal = monto + ganancias;

  // Mostrar los resultados.
  document.getElementById("ganancias").textContent = " $ " + ganancias.toFixed(2);
  document.getElementById("montoTotal").textContent = " $ " + montoTotal.toFixed(2);
console.log(ganancias +" "+ montoTotal);
}