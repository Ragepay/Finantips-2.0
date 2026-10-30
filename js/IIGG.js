/* Importación de variables centralizadas desde actualizacion.js */
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

// Variables calculadas basadas en las importadas
let minimoImponible = minimoNoImponible + deduccionEspecial;

// Formato monetario argentino: 1.234.567,89
const fmt = v => (v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//----------------------------------------------------------------------------------

//  Funcion Principal.
function calcularSueldo() {
    let sueldoBase;
    let sueldoBruto = 0.00;
    let sueldoNeto = 0.00;

    let jubilacion = 0.00;
    let ley = 0.00;
    let obraSocial = 0.00;
    let sindicatoTotal = 0.00;


    //  Sueldo Bruto.
    //----------------------------------------------------------------------------------
    sueldoBase = parseFloat(document.getElementById("sueldoBruto").value);

    if (isNaN(sueldoBase)) {
        sueldoBase = 0;
    }
    //----------------------------------------------------------------------------------

    //  Aportes Sindicato.
    //----------------------------------------------------------------------------------
    let sindicatoPorcentaje;
    let sindicatoSi = document.getElementById("sindicatoSi");
    if (sindicatoSi.checked) {
        sindicatoPorcentaje = parseFloat(document.getElementById("sindicatoPorcentaje").value);
    } else {
        sindicatoPorcentaje = 0;
    }

    //----------------------------------------------------------------------------------

    //  Sueldo bruto.
    sueldoBruto = sueldoBase;

    //  Calculo de las "Cargas Sociales" y Sueldo Neto.
    //----------------------------------------------------------------------------------
    if ((sueldoBruto <= maxCargasSociales) && (sindicatoSi.checked == true)) {
        jubilacion = sueldoBruto * JUBILACION;
        ley = sueldoBruto * LEY_19032;
        obraSocial = sueldoBruto * OBRA_SOCIAL;
        sindicatoTotal = sueldoBruto * (sindicatoPorcentaje / 100);
        sueldoNeto = sueldoBruto - jubilacion - ley - obraSocial - sindicatoTotal;
    }

    if ((sueldoBruto <= maxCargasSociales) && (sindicatoSi.checked == false)) {
        jubilacion = sueldoBruto * JUBILACION;
        ley = sueldoBruto * LEY_19032;
        obraSocial = sueldoBruto * OBRA_SOCIAL;
        sueldoNeto = sueldoBruto - jubilacion - ley - obraSocial;
    }

    if ((sueldoBruto > maxCargasSociales) && (sindicatoSi.checked == true)) {
        jubilacion = maxCargasSociales * JUBILACION;
        ley = maxCargasSociales * LEY_19032;
        obraSocial = maxCargasSociales * OBRA_SOCIAL;
        sindicatoTotal = sueldoBruto * (sindicatoPorcentaje / 100);
        sueldoNeto = sueldoBruto - jubilacion - ley - obraSocial - sindicatoTotal;
    }

    if ((sueldoBruto > maxCargasSociales) && (sindicatoSi.checked == false)) {
        jubilacion = maxCargasSociales * JUBILACION;
        ley = maxCargasSociales * LEY_19032;
        obraSocial = maxCargasSociales * OBRA_SOCIAL;
        sueldoNeto = sueldoBruto - jubilacion - ley - obraSocial;
    }
    //----------------------------------------------------------------------------------

    //SEGUNDA PARTE: GANANCIAS.
    // Conyuge, Hijos y Otras Deducciones.
    let conyugeSi = document.getElementById("conyugeSi");
    let hijos = document.getElementById("hijos").value;
    let alquiler = parseFloat(document.getElementById("alquiler").value);

    if (isNaN(alquiler)) {
        alquiler = 0;
    }
    let otrasDeducciones = parseFloat(document.getElementById("otrasDeducciones").value);

    if (isNaN(otrasDeducciones)) {
        otrasDeducciones = 0.00;
    }

    let conyugeDeduccion;
    let hijosDeducciones = hijos * hijo;
    let alquilerDeduccion = alquiler * DEDUCCION_ALQUILER;

    if (alquilerDeduccion > maxAlquileresDeducibles) {
        alquilerDeduccion = maxAlquileresDeducibles;
    }

    if (conyugeSi.checked) {
        // Si se seleccionó "Sí" sumar el
        conyugeDeduccion = conyuge;
    } else {
        conyugeDeduccion = 0;
    }

    //  Calculo del minimo no imponible.
    let montoImponible = sueldoBruto - minimoImponible - jubilacion - ley - obraSocial - sindicatoTotal - otrasDeducciones - conyugeDeduccion - alquilerDeduccion;
    


    switch (hijos) {
        case "0":
            montoImponible -= 0;
            break;
        case "1":
            montoImponible = montoImponible - (hijo * 1);
            break;
        case "2":
            montoImponible = montoImponible - (hijo * 2);
            break;
        case "3":
            montoImponible = montoImponible - (hijo * 3);
            break;
        case "4":
            montoImponible = montoImponible - (hijo * 4);
            break;
        case "5":
            montoImponible = montoImponible - (hijo * 5);
            break;
        case "6":
            montoImponible = montoImponible - (hijo * 6);
            break;

        default:
            montoImponible -= 0;
    }


    if (montoImponible < 0) {
        montoImponible = 0;
    }



    // Construccion calculo de retencion con escalas.


    const escala = [...escalaActualizada];
    const numRet = [5, 9, 12, 15, 19, 23, 27, 31, 35];

    let retencion = 0;
    let alicuotaMarginal = 0;

    for (let i = 0; i < escala.length; i++) {
        if (montoImponible <= escala[i]) {
            // Calcular la retención del tramo actual
            retencion += (montoImponible - (i > 0 ? escala[i - 1] : 0)) * (numRet[i - 1] / 100);
            alicuotaMarginal = numRet[i - 1];
            break;
        } else {
            // Calcular la retención de todo el tramo
            if (i > 0) {
                retencion += (escala[i] - escala[i - 1]) * (numRet[i - 1] / 100);
            } else {
                retencion += escala[i] * (numRet[0] / 100);
            }
        }
    }

    if (isNaN(retencion)) {
        retencion = 0;
    }


    let alicuota = 0.00;
    alicuota = (retencion / sueldoBruto) * 100;


    if (isNaN(alicuota)) {
        alicuota = 0.00;
    }

    //  Creacion de los Objetos "reciboSueldo" por propiedad que ingrese, para poder almacenar y mostar por localstorage.
    sueldoNeto -= retencion;

    function ReciboSueldo(id, jubilacion, ley, obraSocial, aporteSindical, sueldoBruto, sueldoNeto, retencion, hijos, conyuge, otrasDeducciones, montoImponible, alicuotaMarginal, alquilerDeduccion) {
        this.id = id;
        this.jubilacion = jubilacion || 0;
        this.ley = ley || 0;
        this.obraSocial = obraSocial || 0;
        this.aporteSindical = aporteSindical || 0;
        this.sueldoBruto = sueldoBruto;
        this.sueldoNeto = sueldoNeto;
        this.retencion = retencion || 0;
        this.hijos = hijos || 0;
        this.conyuge = conyuge || 0;
        this.otrasDeducciones = otrasDeducciones || 0;
        this.montoImponible = montoImponible || 0;
        this.alicuotaMarginal = alicuotaMarginal || 0;
        this.alquilerDeduccion = alquilerDeduccion || 0;
    }

    //  Creacion del Objeto literal y despues se almacena en el array de objetos.
    let id = Date.now();
    const recibo = new ReciboSueldo(id, jubilacion, ley, obraSocial, sindicatoTotal, sueldoBruto, sueldoNeto, retencion, hijosDeducciones, conyugeDeduccion, otrasDeducciones, montoImponible, alicuotaMarginal, alquilerDeduccion)


    // Mostrar los resultados en el formulario.
    function mostrarResultados() {
        document.getElementById("resultados").innerHTML = `
        <div class="caja-resultados">
            <table class="ResultadosCalculo" id="Resultado">
                <thead>
                    <tr>
                        <th colspan="4">Fecha: ${new Date(recibo.id).toLocaleString()}</th>
                    </tr>
                    <tr>
                        <th colspan="2">Descripción</th>
                        <th>Monto Imponible</th>
                        <th>Monto NO imponible</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td colspan="2">Sueldo Bruto</td>
                        <td>${fmt(recibo.sueldoBruto)}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="2">Deducción Especial</td>
                        <td></td>
                        <td>-${fmt(deduccionEspecial)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Mínimo No Imponible</td>
                        <td></td>
                        <td>-${fmt(minimoNoImponible)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Jubilación</td>
                        <td></td>
                        <td>-${fmt(recibo.jubilacion)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Ley 19032</td>
                        <td></td>
                        <td>-${fmt(recibo.ley)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Obra Social</td>
                        <td></td>
                        <td>-${fmt(recibo.obraSocial)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Sindicato</td>
                        <td></td>
                        <td>-${fmt(recibo.aporteSindical)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Cónyuge</td>
                        <td></td>
                        <td>-${fmt(recibo.conyuge)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Hijos:</td>
                        <td></td>
                        <td>-${fmt(recibo.hijos)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Alquiler:</td>
                        <td></td>
                        <td>-${fmt(recibo.alquilerDeduccion)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Otras Deducciones</td>
                        <td></td>
                        <td>-${fmt(recibo.otrasDeducciones)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Monto Imponible</td>
                        <td colspan="2" style=" text-align: center;">${fmt(recibo.montoImponible)}</td>
                    </tr>
                    
                </tbody>

                <tfoot>
                    <tr>
                        <td colspan="2">Retención Mensual</td>
                        <td colspan="2" style=" text-align: center; color:red;">-${fmt(recibo.retencion)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Alícuota Marginal</td>
                        <td colspan="2" style=" text-align: center;">${recibo.alicuotaMarginal}%</td>
                    </tr>
                    <tr>
                        <td colspan="2">Alícuota</td>
                        <td colspan="2" style=" text-align: center;">${alicuota.toFixed(2)}%</td>
                    </tr>
                    <tr>
                        <td colspan="2">Sueldo Neto</td>
                        <td colspan="2" style=" text-align: center;">${fmt(recibo.sueldoNeto)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        `;
    }
    // Ejecucion de la funcion "mostrarResultados".
    mostrarResultados();

    // Espacio para Donar.
    document.getElementById('donar-container').innerHTML = `
    <div class="donar-container">
    ¡Apoya nuestro trabajo para seguir actualizando!
    <a class="boton4"  href="https://link.mercadopago.com.ar/finantips" target="_blank" rel="noopener">¡Donar!</a>   
    </div>           
    `;
}

// Cargar historial al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    const botonCalcular = document.getElementById('calcularIIGG');
    // Agregar un event listener para el evento click
    botonCalcular.addEventListener('click', function () {
        calcularSueldo(); // Llamar a la función calcularSueldo() cuando se haga clic en el botón
    });

    // Recalcular en vivo al cambiar cónyuge o hijos, solo si ya se mostró un resultado.
    function recalcularSiHayResultado() {
        if (document.getElementById('resultados').innerHTML.trim()) {
            calcularSueldo();
        }
    }
    document.getElementById('conyugeSi').addEventListener('change', recalcularSiHayResultado);
    document.getElementById('conyugeNo').addEventListener('change', recalcularSiHayResultado);
    document.getElementById('hijos').addEventListener('change', recalcularSiHayResultado);
});


