// Formato monetario argentino: 1.234.567,89
function fmtPesos(num) {
    return num.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}


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
        comentario = "Te conviene comprar en cuotas: invirtiendo el dinero al plazo fijo, las cuotas te salen más baratas que el contado."
    }

    // Muestra los resultados
    let resultadoHTML = "<h2>Comparativa</h2>";
    resultadoHTML += "<p>Costo total Efectivo: $" + fmtPesos(precioContado) + "</p>";
    resultadoHTML += "<p>Costo real Financiado (valor presente): $" + fmtPesos(precioCuotas) + "</p>";
    resultadoHTML += "<p>" + comentario + "</p>";
    
    document.getElementById("resultado").innerHTML = resultadoHTML;
    
}
