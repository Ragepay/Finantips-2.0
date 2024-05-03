
function Comparar() {
    let precioContado = parseFloat(document.getElementById("contado").value);
    let precioCuotas = parseFloat(document.getElementById("cuotas").value);
    let cantidadCuotas = parseInt(document.getElementById("cantcuotas").value);
    let tnaPlazoFijo = parseFloat(document.getElementById("TNA").value);
    let comentario = " ";


    // Calcula de la cuota.
    let cuota = precioCuotas / cantidadCuotas;

    // Calculo del interes mensual.
    let tasaMensual = tnaPlazoFijo / 12 / 100;

    let monto = precioCuotas;

    // Ciclo de la cantidad de cuotas
    for (let i = 1; i <= cantidadCuotas; i++) {
        let saldo = monto * ( 1 + tasaMensual) - cuota;
        monto = saldo;
        console.log(monto);
    }

    // Calcu
    precioCuotas -= monto;
    
    if (precioContado < precioCuotas){
        // Te conviene precio Contado.
        comentario = "Te conviene comprar al contado/efectivo."
        
    } else{
        // Te conviene precio Financiado.
        comentario = "Te conviene comprar en cuotas sin interes."
    }

    // Muestra los resultados
    let resultadoHTML = "<h2>Comparativa</h2>";
    resultadoHTML += "<p>Costo total Efectivo: $" + precioContado.toFixed(2) + "</p>";
    resultadoHTML += "<p>Costo total Financiado: $" + precioCuotas.toFixed(2) + "</p>";
    resultadoHTML += "<p>" + comentario + "</p>";
    
    document.getElementById("resultado").innerHTML = resultadoHTML;
    
}
