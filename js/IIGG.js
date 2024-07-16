/* Declaracion de variables que van a ser actualizadas. */
//----------------------------------------------------------------------------------
// Maxima retencion de las cargas sociales.
const maxCargasSociales = 2359712.22;

// Minimos no Imponibles de Impuesto a las ganancias.
const minimoNoImponible = 257586.25;
const deduccionEspecial = 1236414.00;

// Valores de deduccion de hijo, Conyuge y minino Imponible.
const conyuge = 242594.4;
const hijo = 122341.33;
let minimoImponible = minimoNoImponible + deduccionEspecial;

//----------------------------------------------------------------------------------

// Declaracion de array y obtencion de elementos guardados en localStorage.
let recibos = JSON.parse(localStorage.getItem('recibos')) || [];

function calcularSueldo() {
    let sueldoBase;
    let sueldoBruto = 0.00;
    let sueldoNeto = 0.00;

    let jubilacion = 0.00;
    let ley = 0.00;
    let obraSocial = 0.00;
    let sindicatoTotal = 0.00;


    //  Sueldo Bruto.
    //---------------------------------------------------------------------------------------------------------------------------
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
    console.log(sindicatoPorcentaje);
    //----------------------------------------------------------------------------------
    //  Sueldo bruto.
    sueldoBruto = sueldoBase;
    //  Calculo de las "Cargas Sociales/Retenciones".

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

    //SEGUNDA PARTE: GANANCIAS.    
    //Calculando Monto Imponible.



    // Conyuge e Hijos
    let conyugeSi = document.getElementById("conyugeSi");
    let hijos = document.getElementById("hijos").value;
    let otrasDeducciones = parseFloat(document.getElementById("otrasDeducciones").value);
    console.log(otrasDeducciones);
    
    let conyugeDeduccion;
    let hijosDeducciones = hijos * hijo;

    if (conyugeSi.checked) {
        // Si se seleccionó "Sí" sumar el
        conyugeDeduccion = conyuge;
    }

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


    const escala = [0, 100000, 200000, 300000, 450000, 900000, 1350000, 2050000, 3037500, 1000000000000000];
    const numRet = [5, 9, 12, 15, 19, 23, 27, 31, 35];

    let retencion = 0;

    for (let i = 0; i < escala.length; i++) {
        if (montoImponible <= escala[i]) {
            // Calcular la retención del tramo actual
            retencion += (montoImponible - (i > 0 ? escala[i - 1] : 0)) * (numRet[i - 1] / 100);
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

    //  Creacion de los Objetos "reciboSueldo" por propiedad que ingrese, para poder almacenar y mostar por localstorage.
    sueldoNeto += retencion;

    function ReciboSueldo(id, jubilacion, ley, obraSocial, aporteSindical, sueldoBruto, sueldoNeto, retencion, hijos, conyuge, otrasDeducciones) {
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
    }

    //  Creacion del Objeto literal y despues se almacena en el array de objetos.
    let id = Date.now();
    const recibo = new ReciboSueldo(id, jubilacion, ley, obraSocial, sindicatoTotal, sueldoBruto, sueldoNeto, retencion, hijosDeducciones, conyugeDeduccion, otrasDeducciones)
    recibos.unshift(recibo);

    //  Almacenamos el array de objetos en el localStorage.
    localStorage.setItem("recibos", JSON.stringify(recibos));

    // Mostrar los resultados en el formulario.
    function mostrarResultados() {
        document.getElementById("resultados").innerHTML = `
        <div class="caja-resultados">
            <table class="ResultadosCalculo" id="Resultado${recibo.id}">
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
                        <td>${recibo.sueldoBruto.toFixed(2)}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="2">Jubilación</td>
                        <td></td>
                        <td>-${recibo.jubilacion.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Ley 19032</td>
                        <td></td>
                        <td>-${recibo.ley.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Obra Social</td>
                        <td></td>
                        <td>-${recibo.obraSocial.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Sindicato</td>
                        <td></td>
                        <td>-${recibo.aporteSindical.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Conyugue</td>
                        <td></td>
                        <td>-${recibo.conyuge.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Hijos:</td>
                        <td></td>
                        <td>-${recibo.hijos.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Otras deducciones</td>
                        <td></td>
                        <td>-${recibo.otrasDeducciones.toFixed(2)}</td>
                    </tr>
                </tbody>

                <tfoot>
                    <tr>
                        <td colspan="2">Retencion Mensual</td>
                        <td colspan="2" style=" text-align: center; color:red;">-${recibo.retencion.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Sueldo neto</td>
                        <td colspan="2" style=" text-align: center;">${recibo.sueldoNeto}</td>
                    </tr>
                </tfoot>
            </table>

            
            
        </div>
        `;
    }
    /*
       <button class="boton4" id="botonCapturar">
           <img src="../img/file.png" alt="Descaargar Recibo" class="downloadFile">
       </button>
   */
    mostrarResultados();

    document.getElementById('donar-container').innerHTML = `

    <div class="donar-container">
    ¡Apoya nuestro trabajo para seguir actualizando!
    <a class="boton4"  href="https://link.mercadopago.com.ar/finantips" target="_blank">¡Donar!</a>   
    </div>           
    `;
    mostrarHistorialRecibos();
}

// Función para mostrar el historial de recibos
function mostrarHistorialRecibos() {

    let historialHTML = '<h2>Historial de Recibos</h2>';

    if (recibos.length === 0) {
        historialHTML += '<p>No hay recibos calculados.</p>';
    } else {
        historialHTML += `
        <div class="caja-resultados">
            `;
        recibos.forEach(recibo => {
            historialHTML += `
            <table class="ResultadosCalculo">
            
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
                        <td>${recibo.sueldoBruto.toFixed(2)}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="2">Jubilación</td>
                        <td></td>
                        <td>-${recibo.jubilacion.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Ley 19032</td>
                        <td></td>
                        <td>-${recibo.ley.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Obra Social</td>
                        <td></td>
                        <td>-${recibo.obraSocial.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Sindicato</td>
                        <td></td>
                        <td>-${recibo.aporteSindical.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Conyugue</td>
                        <td></td>
                        <td>-${recibo.conyuge.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Hijos:</td>
                        <td></td>
                        <td>-${recibo.hijos.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Otras deducciones</td>
                        <td></td>
                        <td>-${recibo.otrasDeducciones.toFixed(2)}</td>
                    </tr>
                </tbody>

                <tfoot>
                    <tr>
                        <td colspan="2">Retencion Mensual</td>
                        <td colspan="2" style=" text-align: center; color:red;">-${recibo.retencion.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Sueldo neto</td>
                        <td colspan="2" style=" text-align: center;">${recibo.sueldoNeto}</td>
                    </tr>
                
            
                    <tr>
                        <td colspan="4">
                            <div id="item-historial">
                                <button id="eliminar-recibo" class="eliminar-recibo" onclick="eliminarRecibo(${recibo.id})" style="text-align: center;">
                                    ELIMINAR
                                </button>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table> 
        `;
        });
        historialHTML += `
            </div>    
            
                    <div>
                        <button id="eliminar-historial" class="eliminar-historial" onclick="eliminarHistorial()">Eliminar Historial</button>
                    </div>`;
    }
    document.getElementById('historial-recibos').innerHTML = historialHTML;


}


function eliminarRecibo(id) {
    Swal.fire({
        title: '¿Desea eliminar?',
        text: 'No se podra revertir la acción.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {

            // Filtrar el array recibos para excluir el recibo con el ID dado.
            recibos = recibos.filter(recibo => recibo.id !== id);

            // Actualizar el localStorage con el nuevo array de recibos.
            localStorage.setItem('recibos', JSON.stringify(recibos));

        }
        mostrarHistorialRecibos()
    });
    mostrarHistorialRecibos()
}

function eliminarHistorial() {
    Swal.fire({
        title: '¿Estas seguro que deseas eliminar todo el historial?',
        text: 'No se podra revertir la acción.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            //  Eliminar la clave "recibos" del local storage.
            localStorage.removeItem("recibos");
            //  Vaciar el array de objetos.
            recibos = [];
        }
        mostrarHistorialRecibos()
    });
    mostrarHistorialRecibos();
}

// Cargar historial al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    mostrarHistorialRecibos();
    const botonCalcular = document.getElementById('calcularIIGG');

    // Agregar un event listener para el evento click
    botonCalcular.addEventListener('click', function () {
        calcularSueldo(); // Llamar a la función calcularSueldo() cuando se haga clic en el botón
    });

});
