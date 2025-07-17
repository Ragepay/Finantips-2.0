// Importacion de variables de actualizacion de ganancias y cargas sociales.

/* Declaracion de variables que van a ser actualizadas. */
//----------------------------------------------------------------------------------
// Maxima retencion de las cargas sociales.
const maxCargasSociales = 3385490.05;

// AUMENTO de GANANCIAS EN GENERAL
const AUMENTO = 1 * 1.212997982076;

/* Impuesto a las Ganancias */
// Minimos no Imponibles de Impuesto a las ganancias.
const minimoNoImponible = 269048.84 * AUMENTO;//257586.25;
const deduccionEspecial = 1291434.42 * AUMENTO;//1236414.00;

// Valores de deduccion de hijo, Conyuge y minino Imponible.
const conyuge = 253390.04 * AUMENTO;//242594.4;
const hijo = 127785.52 * AUMENTO;//122341.33;
let minimoImponible = minimoNoImponible + deduccionEspecial;

// Escalas de Ganancias.
let escalaActualizada = [0, 100000, 200000, 300000, 450000, 900000, 1350000, 2025000, 3037500, 1000000000000];
escalaActualizada = escalaActualizada.map(valor => valor * 1.0445 * AUMENTO);
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
        jubilacion = sueldoBruto * 0.11;
        ley = sueldoBruto * 0.03;
        obraSocial = sueldoBruto * 0.03;
        sindicatoTotal = sueldoBruto * (sindicatoPorcentaje / 100);
        sueldoNeto = sueldoBruto - jubilacion - ley - obraSocial - sindicatoTotal;
    }

    if ((sueldoBruto <= maxCargasSociales) && (sindicatoSi.checked == false)) {
        jubilacion = sueldoBruto * 0.11;
        ley = sueldoBruto * 0.03;
        obraSocial = sueldoBruto * 0.03;
        sueldoNeto = sueldoBruto - jubilacion - ley - obraSocial;
    }

    if ((sueldoBruto > maxCargasSociales) && (sindicatoSi.checked == true)) {
        jubilacion = maxCargasSociales * 0.11;
        ley = maxCargasSociales * 0.03;
        obraSocial = maxCargasSociales * 0.03;
        sindicatoTotal = sueldoBruto * (sindicatoPorcentaje / 100);
        sueldoNeto = sueldoBruto - jubilacion - ley - obraSocial - sindicatoTotal;
    }

    if ((sueldoBruto > maxCargasSociales) && (sindicatoSi.checked == false)) {
        jubilacion = maxCargasSociales * 0.11;
        ley = maxCargasSociales * 0.03;
        obraSocial = maxCargasSociales * 0.03;
        sueldoNeto = sueldoBruto - jubilacion - ley - obraSocial;
    }
    //----------------------------------------------------------------------------------

    //SEGUNDA PARTE: GANANCIAS.
    // Conyuge, Hijos y Otras Deducciones.
    let conyugeSi = document.getElementById("conyugeSi");
    let hijos = document.getElementById("hijos").value;
    let otrasDeducciones = parseFloat(document.getElementById("otrasDeducciones").value);

    if (isNaN(otrasDeducciones)) {
        otrasDeducciones = 0.00;
    }

    let conyugeDeduccion;
    let hijosDeducciones = hijos * hijo;

    if (conyugeSi.checked) {
        // Si se seleccionó "Sí" sumar el
        conyugeDeduccion = conyuge;
    } else {
        conyugeDeduccion = 0;
    }

    //  Calculo del minimo no imponible.
    let montoImponible = sueldoBruto - minimoImponible - jubilacion - ley - obraSocial - sindicatoTotal - otrasDeducciones - conyugeDeduccion;


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

    function ReciboSueldo(id, jubilacion, ley, obraSocial, aporteSindical, sueldoBruto, sueldoNeto, retencion, hijos, conyuge, otrasDeducciones, montoImponible, alicuotaMarginal) {
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
    }

    //  Creacion del Objeto literal y despues se almacena en el array de objetos.
    let id = Date.now();
    const recibo = new ReciboSueldo(id, jubilacion, ley, obraSocial, sindicatoTotal, sueldoBruto, sueldoNeto, retencion, hijosDeducciones, conyugeDeduccion, otrasDeducciones, montoImponible, alicuotaMarginal)


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
                        <td>${recibo.sueldoBruto.toLocaleString('es-ES')}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="2">Deduccion Especial</td>
                        <td></td>
                        <td>-${deduccionEspecial.toLocaleString('es-ES')}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Minimo No Imponible</td>
                        <td></td>
                        <td>-${minimoNoImponible.toLocaleString('es-ES')}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Jubilación</td>
                        <td></td>
                        <td>-${recibo.jubilacion.toLocaleString('es-ES')}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Ley 19032</td>
                        <td></td>
                        <td>-${recibo.ley.toLocaleString('es-ES')}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Obra Social</td>
                        <td></td>
                        <td>-${recibo.obraSocial.toLocaleString('es-ES')}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Sindicato</td>
                        <td></td>
                        <td>-${recibo.aporteSindical.toLocaleString('es-ES')}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Conyugue</td>
                        <td></td>
                        <td>-${recibo.conyuge.toLocaleString('es-ES')}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Hijos:</td>
                        <td></td>
                        <td>-${recibo.hijos.toLocaleString('es-ES')}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Otras Deducciones</td>
                        <td></td>
                        <td>-${recibo.otrasDeducciones.toLocaleString('es-ES')}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Monto Imponible</td>
                        <td colspan="2" style=" text-align: center;">${recibo.montoImponible.toLocaleString('es-ES')}</td>
                    </tr>
                    
                </tbody>

                <tfoot>
                    <tr>
                        <td colspan="2">Retencion Mensual</td>
                        <td colspan="2" style=" text-align: center; color:red;">-${recibo.retencion.toLocaleString('es-ES')}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Alicuota Marginal</td>
                        <td colspan="2" style=" text-align: center;">${recibo.alicuotaMarginal}%</td>
                    </tr>
                    <tr>
                        <td colspan="2">Alicuota</td>
                        <td colspan="2" style=" text-align: center;">${alicuota.toFixed(2)}%</td>
                    </tr>
                    <tr>
                        <td colspan="2">Sueldo Neto</td>
                        <td colspan="2" style=" text-align: center;">${recibo.sueldoNeto.toLocaleString('es-ES')}</td>
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
    <a class="boton4"  href="https://link.mercadopago.com.ar/finantips" target="_blank">¡Donar!</a>   
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
});


