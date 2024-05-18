

// Valores de deduccion de hijo y Conyuge
let conyuge = 242594.4;
let hijo = 128702.8;
//Calculando Monto Imponible.
let montoImponible = sueldoBruto - 1800000;


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

let bolsillo = sueldoNeto + retencion;


// Construccion calculo de retencion con escalas.

montoImponible = 4300604.11;

const escala = [0,100000, 200000, 300000, 450000, 900000, 1350000, 2050000, 3037500, 1000000000000000];
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





