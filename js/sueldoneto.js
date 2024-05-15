// Declaracion de variables que van a ser actualizadas.
const AUMENTO = 1.20768;
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

function calcularSueldo() {

    // Declaracion Variables de la funcion
    let categoria = document.getElementById("categoria").value;
    let base;

    let sueldoBase;
    let sueldoBruto = 0.00;
    let sueldoNeto = 0.00;

    let horas50;
    let horas100;
    let horas200;
    let horasNocturnas;

    let antiguedad;
    let antiguedadTotal = 0;

    let jubilacion = 0.00;
    let ley = 0.00;
    let obraSocial = 0.00;
    let sindicatoTotal = 0.00;


    // Calcular el sueldo neto y las ganancias según la categoría
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

    //Sindicato
    let sindicatoSi = document.getElementById("sindicatoSi");
    let sindicatoNo = document.getElementById("sindicatoNo");
    let sindicato = false;

    if (sindicatoSi.checked) { // Verificar si el radio button 'Sí' está marcado
        sindicato = true;
    } else if (sindicatoNo.checked) { // Verificar si el radio button 'No' está marcado
        sindicato = false;
    }

    // Productividad y presentismo
    let radioProductividadSi = document.getElementById("productividadSi");
    let radioPresentismoSi = document.getElementById("presentismoSi");

    if ((radioProductividadSi.checked) && (radioPresentismoSi.checked)) {
        // Si se seleccionó "Sí", incrementar sueldoBase en un 30%
        sueldoBase *= 1.281;
    } else if ((radioProductividadSi.checked) || (radioPresentismoSi.checked)) {
        sueldoBase *= 1.1405;

    } else {
        sueldoBase = sueldoBase;
    }

    // Antiguedad
    antiguedad = parseFloat(document.getElementById("antigüedad").value);
    if (isNaN(antiguedad)) {
        antiguedad = 0;
    } else if (antiguedad == 0) {
        antiguedadTotal = 0;
    } else {
        antiguedadTotal = (base + sueldoBase) * (0.04 + 0.01 * (antiguedad - 1));
    }

    // Horas Extra
    horas50 = parseFloat(document.getElementById("horas-50").value);
    horas100 = parseFloat(document.getElementById("horas-100").value);
    horas200 = parseFloat(document.getElementById("horas-200").value);
    horasNocturnas = parseFloat(document.getElementById("horas-nocturnas").value);

    if (isNaN(horas50)) {
        horas50 = 0;
    }
    if (isNaN(horas100)) {
        horas100 = 0;
    }
    if (isNaN(horas200)) {
        horas200 = 0;
    }
    if (isNaN(horasNocturnas)) {
        horasNocturnas = 0;
    }


    let horas50Total = horas50 * ((base / a) * (1.5) * (1.04 + 0.01 * (antiguedad - 1)));
    let horas100Total = horas100 * ((base / a) * (2) * (1.04 + 0.01 * (antiguedad - 1)));
    let horas200Total = horas200 * ((base / a) * (4) * (1.04 + 0.01 * (antiguedad - 1)));
    let horasNocturnasTotal = horasNocturnas * (base / a) * 0.36 * (1.04 + 0.01 * (antiguedad - 1));


    // Calcular el sueldo bruto
    if (antiguedad == 0) {
        horas50Total = horas50 * (base / a) * (1.5);
        horas100Total = horas100 * (base / a) * (2);
        horas200Total = horas100 * (base / a) * (4);
        horasNocturnasTotal = horasNocturnas * (base / a) * 0.36;
    }


    sueldoBruto = sueldoBase + antiguedadTotal + horas50Total + horas100Total + horas200Total + horasNocturnasTotal;
    let sabadoM = (7 * ((base / a) * (1.5) * (1.04 + 0.01 * (antiguedad - 1)))) + (1.5 * ((base / a) * (4) * (1.04 + 0.01 * (antiguedad - 1))));
    let feriado = 8.5 * (((base / a) * (4) * (1.04 + 0.01 * (antiguedad - 1))));


    // Sueldo Neto
    /* Jubilacion máxima de Abril, Mayo y Junio :208.174,81 Bruto maximo: 1.892.498,29*/
    let maxCargasSociales = 1892498.29;

    if ((sueldoBruto <= maxCargasSociales) && (sindicato == true)) {
        jubilacion = sueldoBruto * 0.11;
        ley = sueldoBruto * 0.03;
        obraSocial = sueldoBruto * 0.03;
        sindicatoTotal = sueldoBruto * 0.04;
        sueldoNeto = sueldoBruto - jubilacion - ley - obraSocial - sindicatoTotal;
    }

    if ((sueldoBruto <= maxCargasSociales) && (sindicato == false)) {
        jubilacion = sueldoBruto * 0.11;
        ley = sueldoBruto * 0.03;
        obraSocial = sueldoBruto * 0.03;
        sueldoNeto = sueldoBruto - jubilacion - ley - obraSocial;
    }

    if ((sueldoBruto > maxCargasSociales) && (sindicato == true)) {
        jubilacion = maxCargasSociales * 0.11;
        ley = maxCargasSociales * 0.03;
        obraSocial = maxCargasSociales * 0.03;
        sindicatoTotal = sueldoBruto * 0.04;
        sueldoNeto = sueldoBruto - jubilacion - ley - obraSocial - sindicatoTotal;

    }

    if ((sueldoBruto > maxCargasSociales) && (sindicato == false)) {
        jubilacion = maxCargasSociales * 0.11;
        ley = maxCargasSociales * 0.03;
        obraSocial = maxCargasSociales * 0.03;
        sueldoNeto = sueldoBruto - jubilacion - ley - obraSocial;
    }
    /*
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

    const escala =[0,100000,200000,300000,450000,900000,1350000,2050000,3037500]

    let retencion = montoImponible;
    */
/*
    for(let i = 0;i>length.escala;i++){
        if (montoImponible>0){
            retencion =
        }
    }

    let bolsillo = montoImponible;
    */
    

    // Mostrar los resultados en el formulario
    document.getElementById("sueldoBrutoResultado").innerText = sueldoBruto.toFixed(2);
    document.getElementById("jubilacionResultado").innerText = - jubilacion.toFixed(2);
    document.getElementById("leyResultado").innerText = - ley.toFixed(2);
    document.getElementById("obraSocialResultado").innerText = - obraSocial.toFixed(2);
    document.getElementById("sindicatoResultado").innerText = - sindicatoTotal.toFixed(2);
    document.getElementById("sueldoNetoResultado").innerText = sueldoNeto.toFixed(2);
    document.getElementById("sabadoM").innerText = sabadoM.toFixed(2);
    document.getElementById("feriado").innerText = feriado.toFixed(2);
/*
    // Mostrar los resultados de Ganancias en el formulario
    document.getElementById("montoImponibleResultado").innerText = montoImponible.toFixed(2);
    document.getElementById("retencionResultado").innerText = retencion.toFixed(2);
    document.getElementById("bolsilloResultado").innerText = bolsillo.toFixed(2);
    */
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
