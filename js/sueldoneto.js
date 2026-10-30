/* Importación de variables centralizadas desde actualizacion.js */
import {
    AUMENTO,
    maxCargasSociales,
    minimoNoImponible,
    deduccionEspecial,
    conyuge,
    hijo,
    escalaActualizada,
    valesComedorTotal,
    JUBILACION,
    LEY_19032,
    OBRA_SOCIAL,
    SMATA,
    PRODUCTIVIDAD,
    PRESENTISMO,
    PLUS_MANTENIMIENTO,
    HORAS_NOCTURNAS_COEF
} from './actualizacion.js';

// Variables calculadas basadas en las importadas
const minimoImponible = minimoNoImponible + deduccionEspecial;

//  Salario base de cada categoría (antes de aplicar AUMENTO).
const CATEGORIAS = {
    "T/M 0-6": 918760,
    "T/M 7-12": 1050120,
    "T/M 1": 1266784,
    "T/M 2": 1304782,
    "T/M 3": 1369919,
    "T/M 3 A": 1438007,
    "T/M 3 B": 1509967,
    "T/L 1": 1585963,
    "T/L 2": 1664749,
    "T/L 3": 1748806,
    "T/L 3 A": 1835811,
};

// Divisor mensual para obtener el valor hora.
const HORAS_MES = 192.025294117647;

// Clave de localStorage para recordar los datos del formulario (independiente de "recibos").
const CLAVE_DATOS_FORM = "datosSueldoNeto";
const RADIOS_FORM = ["productividad", "presentismo", "mantenimiento", "sindicato", "conyuge"];

// Formato monetario argentino: 1.234.567,89
const fmt = v => (v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Declaracion de array y obtencion de elementos guardados en localStorage.
let recibos;
try {
    recibos = JSON.parse(localStorage.getItem('recibos')) || [];
} catch {
    recibos = [];
}

function leerNumero(id) {
    const valor = parseFloat(document.getElementById(id).value);
    return isNaN(valor) || valor < 0 ? 0 : valor;
}

function estaMarcado(id) {
    return document.getElementById(id).checked;
}

function calcularSueldo() {

    const categoria = document.getElementById("categoria").value;
    if (!CATEGORIAS[categoria]) {
        document.getElementById("resultados").innerHTML =
            '<p style="color:#c0392b;text-align:center;">Seleccioná tu categoría para calcular el sueldo.</p>';
        return;
    }

    //  Salario base de la categoría con el aumento acumulado.
    const sueldoBase = CATEGORIAS[categoria] * AUMENTO;
    const valorHora = sueldoBase / HORAS_MES;

    //  Productividad, presentismo y plus mantenimiento.
    const productividad = estaMarcado("productividadSi") ? sueldoBase * PRODUCTIVIDAD : 0;
    const presentismo = estaMarcado("presentismoSi") ? sueldoBase * PRESENTISMO : 0;
    const plusMantenimiento = estaMarcado("mantenimientoSi") ? sueldoBase * PLUS_MANTENIMIENTO : 0;

    // Antiguedad: 4% el primer año y 1% más por cada año siguiente.
    // Las horas extra también se calculan sobre el valor hora con antigüedad.
    const antiguedad = leerNumero("antigüedad");
    const factorAntiguedad = antiguedad === 0 ? 1 : 1.04 + 0.01 * (antiguedad - 1);
    const antiguedadTotal = sueldoBase * (factorAntiguedad - 1);

    // Horas Extra
    const horas50Total = leerNumero("horas-50") * valorHora * 1.5 * factorAntiguedad;
    const horas200Total = leerNumero("horas-200") * valorHora * 4 * factorAntiguedad;
    const horasNocturnasTotal = leerNumero("horas-nocturnas") * valorHora * HORAS_NOCTURNAS_COEF * factorAntiguedad;

    const sueldoBruto = sueldoBase + antiguedadTotal + horas50Total + horas200Total + horasNocturnasTotal + plusMantenimiento + productividad + presentismo;

    // Referencia: lo que se cobra por un sábado de mañana y por un feriado/domingo.
    const sabadoM = (7 * valorHora * 1.5 * factorAntiguedad) + (1.5 * valorHora * 4 * factorAntiguedad);
    const feriado = 8.5 * valorHora * 4 * factorAntiguedad;

    //  Cargas sociales: jubilación, ley 19032 y obra social tienen tope; el aporte sindical no.
    const baseAportes = Math.min(sueldoBruto, maxCargasSociales);
    const jubilacion = baseAportes * JUBILACION;
    const ley = baseAportes * LEY_19032;
    const obraSocial = baseAportes * OBRA_SOCIAL;
    const sindicatoTotal = estaMarcado("sindicatoSi") ? sueldoBruto * SMATA : 0;

    //SEGUNDA PARTE: GANANCIAS.
    //Calculando Monto Imponible.
    let montoImponible = sueldoBruto - minimoImponible - jubilacion - ley - obraSocial - sindicatoTotal;

    // Conyuge e Hijos
    if (estaMarcado("conyugeSi")) {
        montoImponible -= conyuge;
    }
    montoImponible -= hijo * (parseInt(document.getElementById("hijos").value, 10) || 0);

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

    const sueldoNeto = sueldoBruto - jubilacion - ley - obraSocial - sindicatoTotal - valesComedorTotal - retencion;

    //  Objeto recibo que se guarda en localStorage (mantener los nombres de propiedades por compatibilidad).
    const recibo = {
        categoria,
        id: Date.now(),
        salarioBase: sueldoBase,
        presentismo,
        productividad,
        plusMantenimiento,
        horasNocturnas: horasNocturnasTotal,
        horas50: horas50Total,
        horas200: horas200Total,
        antiguedad: antiguedadTotal,
        retencionValesComedor: valesComedorTotal,
        jubilacion,
        ley,
        obraSocial,
        aporteSindical: sindicatoTotal,
        sueldoBruto,
        sueldoNeto,
        sabadoM,
        feriado,
        retencion,
    };
    recibos.unshift(recibo);

    //  Almacenamos el array de objetos en el localStorage.
    try {
        localStorage.setItem("recibos", JSON.stringify(recibos));
    } catch {
        console.warn("No se pudo guardar en localStorage.");
    }
    guardarDatosFormulario();

    // Mostrar los resultados en el formulario.
    const resultados = document.getElementById("resultados");
    resultados.innerHTML = `
        <div class="caja-resultados">
            ${tablaReciboHTML(recibo, `Resultado${recibo.id}`, false)}

            <div class="horasExtra">
                <div class="sabadoM">
                    <label for="sabadoM">Producción Sábado de mañana:</label>
                    <div id="sabadoM">${fmt(recibo.sabadoM)}</div>
                </div>
                <div class="feriado">
                    <label for="feriado">Feriado/Domingo/Sabado de tarde:</label>
                    <div id="feriado">${fmt(recibo.feriado)}</div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('donar-container').innerHTML = `

    <div class="donar-container">
    ¡Apoya nuestro trabajo para seguir actualizando!
    <a class="boton4"  href="https://link.mercadopago.com.ar/finantips" target="_blank" rel="noopener">¡Donar!</a>
    </div>
    `;
    mostrarHistorialRecibos();

    resultados.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// HTML de la tabla de un recibo. Se usa para el resultado actual y para el historial.
function tablaReciboHTML(recibo, idTabla, conAcciones) {
    const fila = (concepto, monto, esDeduccion = false, estilo = '') => `
                    <tr>
                        <td colspan="2">${concepto}</td>
                        <td>${esDeduccion ? '' : fmt(monto)}</td>
                        <td${estilo}>${esDeduccion ? '-' + fmt(monto) : ''}</td>
                    </tr>`;

    const acciones = conAcciones ? `
                    <tr class="acciones-recibo">
                        <td colspan="4">
                            <div class="item-historial">
                                <button type="button" class="eliminar-recibo" data-id="${recibo.id}" style="text-align: center;">
                                    ELIMINAR
                                </button>
                                <button type="button" class="descargar-recibo" data-id="${recibo.id}" title="Descargar recibo como imagen">
                                    <img src="../img/file.png" alt="Descargar" style="width:22px; height:22px; vertical-align:middle;">
                                </button>
                            </div>
                        </td>
                    </tr>` : '';

    return `
            <table class="ResultadosCalculo" id="${idTabla}">
                <thead>
                    <tr>
                        <th colspan="2">Categoria: ${recibo.categoria || "Sin categoria"}</th>
                        <th colspan="2">Fecha: ${new Date(recibo.id).toLocaleString('es-AR')}</th>
                    </tr>
                    <tr>
                        <th colspan="2">Descripción</th>
                        <th>Haberes</th>
                        <th>Deducciones</th>
                    </tr>
                </thead>

                <tbody>
                    ${fila("Salario Base", recibo.salarioBase)}
                    ${fila("Presentismo", recibo.presentismo)}
                    ${fila("Productividad", recibo.productividad)}
                    ${fila("Mantenimiento", recibo.plusMantenimiento)}
                    ${fila("Horas Nocturnas", recibo.horasNocturnas)}
                    ${fila("Horas 50%", recibo.horas50)}
                    ${fila("Horas 200%", recibo.horas200)}
                    ${fila("Antigüedad", recibo.antiguedad)}
                    ${fila("Jubilación", recibo.jubilacion, true)}
                    ${fila("Ley 19032", recibo.ley, true)}
                    ${fila("Obra Social", recibo.obraSocial, true)}
                    ${fila("SMATA", recibo.aporteSindical, true)}
                    ${fila("Vales de Comedor", recibo.retencionValesComedor, true)}
                    ${fila("Impuesto a las Ganancias", recibo.retencion, true, ' style="color:red;"')}
                    <tr>
                        <td colspan="2">Sueldo Bruto</td>
                        <td colspan="2" style=" text-align: center;">$ ${fmt(recibo.sueldoBruto)}</td>
                    </tr>
                    <tr>
                        <td colspan="2"><strong>Sueldo Neto</strong></td>
                        <td colspan="2" style=" text-align: center;"><strong>$ ${fmt(recibo.sueldoNeto)}</strong></td>
                    </tr>
                    ${acciones}
                </tbody>
            </table>`;
}

// Función para mostrar el historial de recibos
function mostrarHistorialRecibos() {

    let historialHTML = '<h2>Historial de Recibos</h2>';

    if (recibos.length === 0) {
        historialHTML += '<p>No hay recibos calculados.</p>';
    } else {
        historialHTML += `
        <div class="caja-resultados">
            ${recibos.map(recibo => tablaReciboHTML(recibo, `tabla-recibo-${recibo.id}`, true)).join('')}
        </div>

        <div>
            <button type="button" class="eliminar-historial" id="eliminar-historial">Eliminar Historial</button>
        </div>`;
    }
    document.getElementById('historial-recibos').innerHTML = historialHTML;

    document.querySelectorAll('.eliminar-recibo[data-id]').forEach(btn => {
        btn.addEventListener('click', () => eliminarRecibo(Number(btn.dataset.id)));
    });
    document.querySelectorAll('.descargar-recibo[data-id]').forEach(btn => {
        btn.addEventListener('click', () => descargarRecibo(Number(btn.dataset.id)));
    });
    const btnEliminarHistorial = document.getElementById('eliminar-historial');
    if (btnEliminarHistorial) {
        btnEliminarHistorial.addEventListener('click', eliminarHistorial);
    }
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
            recibos = recibos.filter(recibo => recibo.id !== id);
            try {
                localStorage.setItem('recibos', JSON.stringify(recibos));
            } catch {
                console.warn("No se pudo guardar en localStorage.");
            }
        }
        mostrarHistorialRecibos();
    });
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
            try {
                localStorage.removeItem("recibos");
            } catch {
                console.warn("No se pudo borrar el localStorage.");
            }
            recibos = [];
        }
        mostrarHistorialRecibos();
    });
}

// Recordar los datos del formulario (categoría, antigüedad, opciones) para la próxima visita.
// Las horas extra no se guardan porque cambian todos los meses.
function guardarDatosFormulario() {
    const datos = {
        categoria: document.getElementById("categoria").value,
        antiguedad: document.getElementById("antigüedad").value,
        hijos: document.getElementById("hijos").value,
    };
    RADIOS_FORM.forEach(nombre => {
        const marcado = document.querySelector(`input[name="${nombre}"]:checked`);
        if (marcado) datos[nombre] = marcado.value;
    });
    try {
        localStorage.setItem(CLAVE_DATOS_FORM, JSON.stringify(datos));
    } catch {
        console.warn("No se pudo guardar en localStorage.");
    }
}

function restaurarDatosFormulario() {
    let datos;
    try {
        datos = JSON.parse(localStorage.getItem(CLAVE_DATOS_FORM));
    } catch {
        datos = null;
    }
    if (!datos) return;

    if (CATEGORIAS[datos.categoria]) document.getElementById("categoria").value = datos.categoria;
    if (datos.antiguedad) document.getElementById("antigüedad").value = datos.antiguedad;
    if (datos.hijos) document.getElementById("hijos").value = datos.hijos;
    RADIOS_FORM.forEach(nombre => {
        const radio = document.querySelector(`input[name="${nombre}"][value="${datos[nombre]}"]`);
        if (radio) radio.checked = true;
    });
}

async function descargarRecibo(id) {
    const tabla = document.getElementById(`tabla-recibo-${id}`);
    if (!tabla) return;

    // Generar QR localmente (sin petición externa, sin CORS)
    const qr = qrcode(0, 'L');
    qr.addData('https://finantips.netlify.app/');
    qr.make();
    const qrDataUrl = qr.createDataURL(4, 0);

    // Agregar pie de marca temporalmente a la tabla
    const tfoot = document.createElement('tfoot');
    tfoot.innerHTML = `
        <tr>
            <td colspan="4" style="text-align:center; padding:14px 8px 10px; border-top:2px solid #14805c; background:#f5f5f5;">
                <img src="${qrDataUrl}" style="display:block; margin:0 auto 6px; width:72px; height:72px; image-rendering:pixelated;">
                <div style="font-size:12px; color:#444; font-family:sans-serif; margin-top:4px;">
                    Calculado con <strong style="color:#14805c;">FinanTips</strong>
                </div>
                <div style="font-size:11px; color:#888; font-family:sans-serif;">
                    finantips.netlify.app
                </div>
            </td>
        </tr>
    `;
    tabla.appendChild(tfoot);

    // Los botones de eliminar/descargar no deben aparecer en la imagen.
    const canvas = await html2canvas(tabla, {
        scale: 2,
        backgroundColor: '#ffffff',
        ignoreElements: el => el.classList && el.classList.contains('acciones-recibo'),
    });

    tabla.removeChild(tfoot);

    const link = document.createElement('a');
    link.download = `recibo-${new Date(id).toLocaleDateString('es-AR').replace(/\//g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

document.addEventListener('DOMContentLoaded', function () {
    restaurarDatosFormulario();
    mostrarHistorialRecibos();
    document.getElementById('calcularSueldo').addEventListener('click', calcularSueldo);
});
