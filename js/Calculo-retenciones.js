const montoImponible = 3200000;

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

console.log("La retención es: " + retencion);

//FUNCIONAAAAA

