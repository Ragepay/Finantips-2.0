//  VARIABLES DE CALCULO CENTRALIZADAS
//-----------------------------------------------------------------------
// Aumento de:    Mayo |  Julio | Octubre| Enero  | Abril  | Julio  | Octubre
const AUMENTO = 1.2248 * 1.0913 * 1.1288 * 1.0882 * 1.0832 * 1.0605 * 1.0609;

// Maxima retencion de las cargas sociales (Sueldo Bruto).
const maxCargasSociales = 3571608.54; // 3.571.608,54

// AUMENTO de GANANCIAS EN GENERAL
const aumentoGanancias = 1.212997982076; // 1.212997982076

// Mínimos no Imponibles de Impuesto a las Ganancias
const minimoNoImponible = 269048.84 * aumentoGanancias; // 326.624,37
const deduccionEspecial = 1291434.42 * aumentoGanancias; // 1.566.443,75

// Valores de deducciones de hijo y cónyuge
const conyuge = 253390.04 * aumentoGanancias; // 307.215,52
const hijo = 127785.52 * aumentoGanancias; // 154.958,78
const maxAlquileresDeducibles = 269048.839999477 * aumentoGanancias; // 326.355,70

// Escalas de Ganancias actualizadas
const escala = [0, 100000, 200000, 300000, 450000, 900000, 1350000, 2025000, 3037500, 1000000000000];
const escalaActualizada = escala.map(valor => valor * 1.0445 * aumentoGanancias);

// Retencion vales de comedor.
const valesComedorTotal = 22 * 1471; // 32.362
//-----------------------------------------------------------------------

//  MENSAJE DE ACTUALIZACIÓN DINÁMICO
//-----------------------------------------------------------------------
// Mensaje de actualización centralizado
export const mensajeActualizacion = "Incluido el aumento de Octubre del 6,09%.";

// Función para cargar el mensaje de actualización en cualquier página
export function cargarMensajeActualizacion() {
    const elementoActualizacion = document.getElementById("actualizacion");
    if (elementoActualizacion) {
        elementoActualizacion.textContent = mensajeActualizacion;
    }
}

// Cargar automáticamente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    cargarMensajeActualizacion();
});
//-----------------------------------------------------------------------



// FECHA DE ACTUALIZACION
//-----------------------------------------------------------------------
const fechadeUltimaActualizacion = document.getElementById("fecha");

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Los meses en JavaScript son de 0 a 11
    const year = date.getFullYear();

    return `Date: ${day}.${month}.${year}`;
}

const currentDate = new Date();
fechadeUltimaActualizacion.innerText = formatDate(currentDate);
//-----------------------------------------------------------------------



//  ULTIMA VERSION
//-----------------------------------------------------------------------
// Actualizar la versión aquí
const ultimaVersion = document.getElementById("version");
ultimaVersion.innerText = "Version: 1.6.0";
//-----------------------------------------------------------------------



//  EXPORTACION DE VARIABLES
export {
    AUMENTO,
    maxCargasSociales,
    aumentoGanancias,
    minimoNoImponible,
    deduccionEspecial,
    conyuge,
    hijo,
    maxAlquileresDeducibles,
    escalaActualizada,
    valesComedorTotal
};
