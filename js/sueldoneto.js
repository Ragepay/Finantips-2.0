/* Declaracion de variables que van a ser actualizadas. */
//----------------------------------------------------------------------------------
// Aumento de    Mayo  | Julio  | Octubre | Enero
const AUMENTO = 1.2248 * 1.0913 * 1.1288 * 1.0882;

// Maxima retencion de las cargas sociales (Sueldo Bruto).
const maxCargasSociales = 2910574.49;

// calcularsueldo.com const maxCargasSociales = 2265033.81;

// Minimos no Imponibles de Impuesto a las ganancias.
const minimoNoImponible = 269048.84;//257586.25;
const deduccionEspecial = 1291434.42;//1236414.00;

// Valores de deduccion de hijo, Conyuge y minino Imponible.
const conyuge = 253390.04;//242594.4;
const hijo = 127785.52;//122341.33;
let minimoImponible = minimoNoImponible + deduccionEspecial;

// Escalas de Ganancias.
let escalaActualizada = [0, 100000, 200000, 300000, 450000, 900000, 1350000, 2025000, 3037500, 1000000000000];
escalaActualizada = escalaActualizada.map(valor => valor * 1.0445);

//  Retencion vales de comedro.
const valesComedorTotal = 22 * 827 * 1.04 * 1.042;
//----------------------------------------------------------------------------------

// Declaracion de array y obtencion de elementos guardados en localStorage.
let recibos = JSON.parse(localStorage.getItem('recibos')) || [];

async function calcularSueldo() {

    //  Categorias con su respectivo aumento.
    let tm16m = 918760 * AUMENTO;
    let tm712m = 1050120 * AUMENTO;
    let tm1 = 1266784 * AUMENTO;
    let tm2 = 1304782 * AUMENTO;
    let tm3 = 1369919 * AUMENTO;
    let tm3a = 1438007 * AUMENTO;
    let tm3b = 1509967 * AUMENTO;
    let tl1 = 1585963 * AUMENTO;
    let tl2 = 1664749 * AUMENTO;
    let tl3 = 1748806 * AUMENTO;
    let tl3a = 1835811 * AUMENTO;
    let constante192 = 192.025294117647;
    let a = constante192;

    // Declaracion Variables de la funcion
    let categoria = document.getElementById("categoria").value;
    let base;

    let sueldoBase;
    let sueldoBruto = 0.00;
    let sueldoNeto = 0.00;

    let horas50;
    let horas200;
    let horasNocturnas;

    let antiguedad;
    let antiguedadTotal = 0;

    let jubilacion = 0.00;
    let ley = 0.00;
    let obraSocial = 0.00;
    let sindicatoTotal = 0.00;


    //  Categoria y asignación de sueldoBase y base para otros calculos. Default para ingresar sueldo bruto de fuera de convenio.
    //------------------------- --------------------------------------------------------------------------------------------------
    switch (categoria) {
        case "T/M 0-6":
            sueldoBase = tm16m;
            base = parseFloat(tm16m);
            break;
        case "T/M 7-12":
            sueldoBase = tm712m;
            base = parseFloat(tm712m);
            break;
        case "T/M 1":
            sueldoBase = tm1;
            base = parseFloat(tm1);
            break;
        case "T/M 2":
            sueldoBase = tm2;
            base = parseFloat(tm2);
            break;
        case "T/M 3":
            sueldoBase = tm3;
            base = parseFloat(tm3);
            break;
        case "T/M 3 A":
            sueldoBase = tm3a;
            base = parseFloat(tm3a);
            break;
        case "T/M 3 B":
            sueldoBase = tm3b;
            base = parseFloat(tm3b);
            break;
        case "T/L 1":
            sueldoBase = tl1;
            base = parseFloat(tl1);
            break;
        case "T/L 2":
            sueldoBase = tl2;
            base = parseFloat(tl2);
            break;
        case "T/L 3":
            sueldoBase = tl3;
            base = parseFloat(tl3);
            break;
        case "T/L 3 A":
            sueldoBase = tl3a;
            base = parseFloat(tl3a);
            break;
        default:
            sueldoBase = parseFloat(document.getElementById("sueldoBruto").value);
            if (isNaN(sueldoBase)) {
                sueldoBase = 0;
            }
            base = 0

    }
    //----------------------------------------------------------------------------------


    // Productividad y presentismo.
    //----------------------------------------------------------------------------------
    //  Productividad.
    function calcularProductividad() {
        let radioProductividadSi = document.getElementById("productividadSi");
        if (radioProductividadSi.checked) {
            return sueldoBase * 0.15
        }
        return 0
    }
    //  Presentismo.
    function calcularPresentismo() {
        let radioPresentismoSi = document.getElementById("presentismoSi");
        if (radioPresentismoSi.checked) {
            return sueldoBase * 0.15
        }
        return 0
    }
    //----------------------------------------------------------------------------------


    //  Plus Mantenimiento.
    //----------------------------------------------------------------------------------
    function calcularMantenimiento() {
        let radioMantenimientoSi = document.getElementById("mantenimientoSi");
        if (radioMantenimientoSi.checked) {
            return sueldoBase * 0.26

        }
        return 0
    }
    //----------------------------------------------------------------------------------


    //  Sindicato
    //----------------------------------------------------------------------------------
    function chequearSindicato() {
        let sindicatoSi = document.getElementById("sindicatoSi");
        if (sindicatoSi.checked) {
            return true;
        } else {
            return false
        }
    }
    //----------------------------------------------------------------------------------


    // Antiguedad
    //----------------------------------------------------------------------------------
    antiguedad = parseFloat(document.getElementById("antigüedad").value);
    if (isNaN(antiguedad)) {
        antiguedad = 0;
    } else if (antiguedad == 0) {
        antiguedadTotal = 0;
    } else {
        antiguedadTotal = (base) * (0.04 + 0.01 * (antiguedad - 1));

    }
    //----------------------------------------------------------------------------------


    // Horas Extra
    //----------------------------------------------------------------------------------
    horas50 = parseFloat(document.getElementById("horas-50").value);
    horas200 = parseFloat(document.getElementById("horas-200").value);
    horasNocturnas = parseFloat(document.getElementById("horas-nocturnas").value);

    if (isNaN(horas50)) {
        horas50 = 0;
    }
    if (isNaN(horas200)) {
        horas200 = 0;
    }
    if (isNaN(horasNocturnas)) {
        horasNocturnas = 0;
    }


    let horas50Total = horas50 * ((base / a) * (1.5) * (1.04 + 0.01 * (antiguedad - 1)));
    let horas200Total = horas200 * ((base / a) * (4) * (1.04 + 0.01 * (antiguedad - 1)));
    let horasNocturnasTotal = horasNocturnas * (base / a) * 0.36 * (1.04 + 0.01 * (antiguedad - 1));

    // Con antiguedad 0.
    if (antiguedad == 0) {
        horas50Total = horas50 * (base / a) * (1.5);
        horas200Total = horas200 * (base / a) * (4);
        horasNocturnasTotal = horasNocturnas * (base / a) * 0.36;
    }




    sueldoBruto = sueldoBase + antiguedadTotal + horas50Total + horas200Total + horasNocturnasTotal + calcularMantenimiento() + calcularProductividad() + calcularPresentismo();
    let sabadoM = (7 * ((base / a) * (1.5) * (1.04 + 0.01 * (antiguedad - 1)))) + (1.5 * ((base / a) * (4) * (1.04 + 0.01 * (antiguedad - 1))));
    let feriado = 8.5 * (((base / a) * (4) * (1.04 + 0.01 * (antiguedad - 1))));


    //  Sueldo Neto.
    //  Calculo de las "Cargas Sociales/Retenciones".


    if ((sueldoBruto <= maxCargasSociales) && (chequearSindicato() == true)) {
        jubilacion = sueldoBruto * 0.11;
        ley = sueldoBruto * 0.03;
        obraSocial = sueldoBruto * 0.03;
        sindicatoTotal = sueldoBruto * 0.04;
        sueldoNeto = sueldoBruto - jubilacion - ley - obraSocial - sindicatoTotal - valesComedorTotal;
    }

    if ((sueldoBruto <= maxCargasSociales) && (chequearSindicato() == false)) {
        jubilacion = sueldoBruto * 0.11;
        ley = sueldoBruto * 0.03;
        obraSocial = sueldoBruto * 0.03;
        sueldoNeto = sueldoBruto - jubilacion - ley - obraSocial - valesComedorTotal;
    }

    if ((sueldoBruto > maxCargasSociales) && (chequearSindicato() == true)) {
        jubilacion = maxCargasSociales * 0.11;
        ley = maxCargasSociales * 0.03;
        obraSocial = maxCargasSociales * 0.03;
        sindicatoTotal = sueldoBruto * 0.04;
        sueldoNeto = sueldoBruto - jubilacion - ley - obraSocial - sindicatoTotal - valesComedorTotal;

    }

    if ((sueldoBruto > maxCargasSociales) && (chequearSindicato() == false)) {
        jubilacion = maxCargasSociales * 0.11;
        ley = maxCargasSociales * 0.03;
        obraSocial = maxCargasSociales * 0.03;
        sueldoNeto = sueldoBruto - jubilacion - ley - obraSocial - valesComedorTotal;
    }

    //SEGUNDA PARTE: GANANCIAS.    
    //Calculando Monto Imponible.
    let montoImponible = sueldoBruto - minimoImponible - jubilacion - ley - obraSocial - sindicatoTotal;


    // Conyuge e Hijos
    let conyugeSi = document.getElementById("conyugeSi");
    let hijos = document.getElementById("hijos").value;

    if (conyugeSi.checked) {
        // Si se seleccionó "Sí" sumar el
        montoImponible -= conyuge;
    }


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
    
    // Le restamso la retencion al sueldo Neto.
    sueldoNeto -= retencion;
    
    //  Creacion de los Objetos "reciboSueldo" por propiedad que ingrese, para poder almacenar y mostar por localstorage.
    function ReciboSueldo(categoria, id, salarioBase, presentismo, produtivdad, plusMantenimiento, horasNocturnas, horas50, horas200, antiguedad, retencionValesComedor, jubilacion, ley, obraSocial, aporteSindical, sueldoBruto, sueldoNeto, sabadoM, feriado, retencion) {
        this.categoria = categoria || "Sin categoria";
        this.id = id;
        this.salarioBase = salarioBase;
        this.presentismo = presentismo;
        this.productividad = produtivdad;
        this.plusMantenimiento = plusMantenimiento;
        this.horasNocturnas = horasNocturnas;
        this.horas50 = horas50;
        this.horas200 = horas200;
        this.antiguedad = antiguedad;
        this.retencionValesComedor = retencionValesComedor;
        this.jubilacion = jubilacion;
        this.ley = ley;
        this.obraSocial = obraSocial;
        this.aporteSindical = aporteSindical;
        this.sueldoBruto = sueldoBruto;
        this.sueldoNeto = sueldoNeto;
        this.sabadoM = sabadoM;
        this.feriado = feriado;
        this.retencion = retencion;
    }

    //  Creacion del Objeto literal y despues se almacena en el array de objetos.
    let id = Date.now();
    const recibo = new ReciboSueldo(categoria, id, sueldoBase, calcularPresentismo(), calcularProductividad(), calcularMantenimiento(), horasNocturnasTotal, horas50Total, horas200Total, antiguedadTotal, valesComedorTotal, jubilacion, ley, obraSocial, sindicatoTotal, sueldoBruto, sueldoNeto, sabadoM, feriado, retencion)
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
                        <th colspan="2">Categoria: ${recibo.categoria}</th>
                        <th colspan="2">Fecha: ${new Date(recibo.id).toLocaleString()}</th>
                    </tr>
                    <tr>
                        <th colspan="2">Descripción</th>
                        <th>Haberes</th>
                        <th>Deducciones</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td colspan="2">Salario Base</td>
                        <td>${recibo.salarioBase.toFixed(2)}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="2">Presentismo</td>
                        <td>${recibo.presentismo.toFixed(2)}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="2">Productividad</td>
                        <td>${recibo.productividad.toFixed(2)}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="2">Mantenimiento</td>
                        <td>${recibo.plusMantenimiento.toFixed(2)}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="2">Horas Nocturnas</td>
                        <td>${recibo.horasNocturnas.toFixed(2)}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="2">Horas 50%</td>
                        <td>${recibo.horas50.toFixed(2)}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="2">Horas 200%</td>
                        <td>${recibo.horas200.toFixed(2)}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="2">Antigüedad</td>
                        <td>${recibo.antiguedad.toFixed(2)}</td>
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
                        <td colspan="2">Smata</td>
                        <td></td>
                        <td>-${recibo.aporteSindical.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Vales de Comedor</td>
                        <td></td>
                        <td>-${recibo.retencionValesComedor.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Impuesto a las Ganancias</td>
                        <td></td>
                        <td style="color:red;">-${recibo.retencion.toFixed(2)}</td>
                    </tr>
                </tbody>

                <tfoot>
                    <tr>
                        <td colspan="2">Sueldo Bruto</td>
                        <td colspan="2" style=" text-align: center;">${recibo.sueldoBruto.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Sueldo Neto</td>
                        <td colspan="2" style=" text-align: center;">${recibo.sueldoNeto.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>

            <div class="horasExtra">
                <div class="sabadoM">
                    <label for="sabadoM">Produccion Sábado de mañana:</label>
                    <div id="sabadoM">${recibo.sabadoM.toFixed(2)}</div>
                </div>
                <div class="feriado">
                    <label for="feriado">Feriado/Domingo/Sabado de tarde:</label>
                    <div id="feriado">${recibo.feriado.toFixed(2)}</div>
                </div>
            </div>
            
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
                    <thead >
                        <tr>
                            <th colspan="2">Categoria: ${recibo.categoria}</th>
                            <th colspan="2">Fecha: ${new Date(recibo.id).toLocaleString()}</th>
                        </tr>
                        <tr>
                            <th colspan="2">Descripción</th>
                            <th>Haberes</th>
                            <th>Deducciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td colspan="2">Salario Base</td>
                            <td>${recibo.salarioBase.toFixed(2)}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan="2">Presentismo</td>
                            <td>${recibo.presentismo.toFixed(2)}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan="2">Productividad</td>
                            <td>${recibo.productividad.toFixed(2)}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan="2">Horas Nocturnas</td>
                            <td>${recibo.horasNocturnas.toFixed(2)}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan="2">Horas Nocturnas</td>
                            <td>${recibo.horasNocturnas.toFixed(2)}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan="2">Horas 50%</td>
                            <td>${recibo.horas50.toFixed(2)}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan="2">Horas 200%</td>
                            <td>${recibo.horas200.toFixed(2)}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan="2">Antigüedad</td>
                            <td>${recibo.antiguedad.toFixed(2)}</td>
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
                            <td colspan="2">SMATA</td>
                            <td></td>
                            <td>-${recibo.aporteSindical.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="2">Vales de Comedor</td>
                            <td></td>
                            <td>-${recibo.retencionValesComedor.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="2">Impuesto a las Ganancias</td>
                            <td></td>
                            <td style="color:red;">-${recibo.retencion.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="2">Sueldo Bruto</td>
                            <td colspan="2" style=" text-align: center;">${recibo.sueldoBruto.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="2">Sueldo Neto</td>
                            <td colspan="2" style=" text-align: center;">${recibo.sueldoNeto.toFixed(2)}</td>
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
                    </tbody>
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

function habilitarInput() {
    categoria = document.getElementById("categoria");
    datoInput = document.getElementById("sueldoBruto");

    if (categoria.value !== "") {
        datoInput.disabled = true;

    } else {
        datoInput.disabled = false;
    }

}

// Cargar historial al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    mostrarHistorialRecibos();
    const botonCalcular = document.getElementById('calcularSueldo');

    // Agregar un event listener para el evento click
    botonCalcular.addEventListener('click', function () {
        calcularSueldo(); // Llamar a la función calcularSueldo() cuando se haga clic en el botón
    });

});
