function calcularGananciasPlazoFijo() {

    // Obtener los valores ingresados por el usuario
    let monto = parseFloat(document.getElementById("inputMonto").value);
    let tasaInteres = parseFloat(document.getElementById("inputTasaInteres").value);
    let meses = parseInt(document.getElementById("inputMeses").value);
    let interesCompuesto = document.getElementById("inputInteresCompuesto").checked;
  
    // Calcular las ganancias
    let ganancias;
    if (interesCompuesto) {
      ganancias = monto * Math.pow(( tasaInteres / 365 * 30 / 100 + 1), meses) - monto;
    } else {
      ganancias = monto * (tasaInteres / 365) * (meses * 30) / 100;
    }
    let montoTotal = monto + ganancias;
  
    // Mostrar los resultados
    document.getElementById("ganancias").textContent ="$ " + ganancias.toFixed(2);
    document.getElementById("montoTotal").textContent = "$ " + montoTotal.toFixed(2);
  }

  function formatearNumero(input) {
    // Obtener el valor actual del input
    var valor = input.value;

    // Eliminar cualquier separador decimal o de miles existente
    valor = valor.replace(/[.]/g, "");

    // Convertir el valor a un número y formatearlo con separadores de miles
    valor = Number(valor).toLocaleString();

    // Actualizar el valor del input
    input.value = valor;
}

  