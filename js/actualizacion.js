//  VARIABLES DE CALCULO CENTRALIZADAS
//-----------------------------------------------------------------------
// Aumento de:    Mayo |  Julio | Octubre| Enero  | Abril  | Julio  | Octubre |Enero 26'|Abril 26'|Julio 26'
const AUMENTO = 1.2248 * 1.0913 * 1.1288 * 1.0882 * 1.0832 * 1.0605 * 1.0609 * 1.0769 * 1.0917 * 1.0688;

// Maxima retencion de las cargas sociales (Sueldo Bruto).
const maxCargasSociales = 4414652.38; // 4.414.652,38 (tope base imponible - Res. ANSeS)

// AUMENTO de GANANCIAS EN GENERAL (ARCA jul-dic 2026, actualización IPC 2º semestre)
const aumentoGanancias = 1.8644915176;

// Mínimos no Imponibles de Impuesto a las Ganancias (valor mensual 2º sem 2026)
const minimoNoImponible = 269048.84 * aumentoGanancias; // 501.639,28
const deduccionEspecial = 1291434.42 * aumentoGanancias; // 2.407.868,55

// Valores de deducciones de hijo y cónyuge (valor mensual 2º sem 2026)
const conyuge = 253390.04 * aumentoGanancias; // 472.443,59
const hijo = 127785.52 * aumentoGanancias; // 238.255,03
const maxAlquileresDeducibles = 269048.839999477 * aumentoGanancias; // 501.639,28

// Escalas de Ganancias actualizadas
const escala = [0, 100000, 200000, 300000, 450000, 900000, 1350000, 2025000, 3037500, 1000000000000];
const escalaActualizada = escala.map(valor => valor * 1.0445 * aumentoGanancias);

// Retencion vales de comedor.
const valesComedorTotal = 22 * 2652; // 58.344

// ── PORCENTAJES DE CARGAS SOCIALES (ley argentina) ──────────────────
const JUBILACION = 0.11;        // 11% — aporte jubilatorio (ley 24.241)
const LEY_19032 = 0.03;         // 3%  — INSSJP (ley 19.032)
const OBRA_SOCIAL = 0.03;       // 3%  — aporte obra social
const SMATA = 0.05;             // 5%  — aporte sindical SMATA

// ── CONCEPTOS REMUNERATIVOS TOYOTA ───────────────────────────────────
const PRODUCTIVIDAD = 0.14;         // 14% del salario base
const PRESENTISMO = 0.14;           // 14% del salario base
const PLUS_MANTENIMIENTO = 0.26;    // 26% del salario base
const HORAS_NOCTURNAS_COEF = 0.36;  // 36% del valor hora

// ── IMPUESTO A LAS GANANCIAS ─────────────────────────────────────────
const DEDUCCION_ALQUILER = 0.40;    // 40% del alquiler pagado (art. 85 LIG)
//-----------------------------------------------------------------------

//  MENSAJE DE ACTUALIZACIÓN DINÁMICO
//-----------------------------------------------------------------------
// Mensaje de actualización centralizado
export const mensajeActualizacion = "Incluido el aumento de Julio 26' del 6,88% y la escala de Ganancias del 2º semestre 2026.";

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
// Actualizar esta fecha cada vez que se modifiquen los valores del convenio.
const FECHA_ACTUALIZACION = "20/07/2026";

const fechadeUltimaActualizacion = document.getElementById("fecha");
if (fechadeUltimaActualizacion) {
    fechadeUltimaActualizacion.innerText = `Actualizado: ${FECHA_ACTUALIZACION}`;
}
//-----------------------------------------------------------------------



//  ULTIMA VERSION
//-----------------------------------------------------------------------
// Fuente única de verdad para la versión. Actualizar solo aquí.
const VERSION = "1.6.2";
const ultimaVersion = document.getElementById("version");
if (ultimaVersion) {
    ultimaVersion.innerText = `Version: ${VERSION}`;
}
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
    valesComedorTotal,
    // Porcentajes cargas sociales
    JUBILACION,
    LEY_19032,
    OBRA_SOCIAL,
    SMATA,
    // Conceptos Toyota
    PRODUCTIVIDAD,
    PRESENTISMO,
    PLUS_MANTENIMIENTO,
    HORAS_NOCTURNAS_COEF,
    // Ganancias
    DEDUCCION_ALQUILER,
    // Versión
    VERSION
};
