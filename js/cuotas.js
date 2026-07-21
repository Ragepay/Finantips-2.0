
function Comparar() {
    let precioContado = parseFloat(document.getElementById("contado").value);
    let precioCuotas = parseFloat(document.getElementById("cuotas").value);
    let cantidadCuotas = parseInt(document.getElementById("cantcuotas").value);
    let tnaPlazoFijo = parseFloat(document.getElementById("TNA").value);
    let comentario = " ";

    if (isNaN(precioContado) || isNaN(precioCuotas) || isNaN(cantidadCuotas) || cantidadCuotas <= 0 || isNaN(tnaPlazoFijo)) {
        document.getElementById("resultado").innerHTML = "<p>Por favor ingresá todos los valores correctamente.</p>";
        return;
    }

    // Calcula de la cuota.
    let cuota = precioCuotas / cantidadCuotas;

    // Calculo del interes mensual.
    let tasaMensual = tnaPlazoFijo / 12 / 100;

    // Costo real de pagar en cuotas = valor presente de cada cuota descontada
    // a la tasa del plazo fijo (lo que te rendiría ese dinero si lo invirtieras).
    let valorPresente = 0;
    for (let i = 1; i <= cantidadCuotas; i++) {
        valorPresente += cuota / Math.pow(1 + tasaMensual, i);
    }
    precioCuotas = valorPresente;

    if (precioContado < precioCuotas){
        // Te conviene precio Contado.
        comentario = "Te conviene comprar al contado/efectivo."
        
    } else{
        // Te conviene precio Financiado.
        comentario = "Te conviene comprar en cuotas sin interés."
    }

    // Muestra los resultados
    let resultadoHTML = "<h2>Comparativa</h2>";
    resultadoHTML += "<p>Costo total Efectivo: $" + precioContado.toFixed(2) + "</p>";
    resultadoHTML += "<p>Costo total Financiado: $" + precioCuotas.toFixed(2) + "</p>";
    resultadoHTML += "<p>" + comentario + "</p>";
    
    document.getElementById("resultado").innerHTML = resultadoHTML;
    
}
