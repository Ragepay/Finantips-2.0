//  VARIABLES DE CALCULO CENTRALIZADAS
//-----------------------------------------------------------------------
// Aumento de:    Mayo |  Julio | Octubre| Enero  | Abril  | Julio  | Octubre |Enero 26'|Abril 26'
const AUMENTO = 1.2248 * 1.0913 * 1.1288 * 1.0882 * 1.0832 * 1.0605 * 1.0609 * 1.0769 * 1.0917;

// Maxima retencion de las cargas sociales (Sueldo Bruto).
const maxCargasSociales = 4162912.57; // 4.162.912,57;

// AUMENTO de GANANCIAS EN GENERAL
const aumentoGanancias = 1.5956838171;

// Mínimos no Imponibles de Impuesto a las Ganancias
const minimoNoImponible = 269048.84 * aumentoGanancias; // 429.316,88
const deduccionEspecial = 1291434.42 * aumentoGanancias; // 2.060.721,00

// Valores de deducciones de hijo y cónyuge
const conyuge = 253390.04 * aumentoGanancias; // 404.330,39
const hijo = 127785.52 * aumentoGanancias; // 203.905,29
const maxAlquileresDeducibles = 269048.839999477 * aumentoGanancias; // 326.355,70

// Escalas de Ganancias actualizadas
const escala = [0, 100000, 200000, 300000, 450000, 900000, 1350000, 2025000, 3037500, 1000000000000];
const escalaActualizada = escala.map(valor => valor * 1.0445 * aumentoGanancias);

// Retencion vales de comedor.
const valesComedorTotal = 22 * 2652; // 58.344
//-----------------------------------------------------------------------

//  MENSAJE DE ACTUALIZACIÓN DINÁMICO
//-----------------------------------------------------------------------
// Mensaje de actualización centralizado
export const mensajeActualizacion = "Incluido el aumento de Abril 26' del 9,17%.";

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
ultimaVersion.innerText = "Version: 1.6.1";
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
