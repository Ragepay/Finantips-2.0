import './actualizacion.js';

function calcularInflacion() {
    let monto = parseFloat(document.getElementById('montoInflacion').value);
    let inflacionMensual = parseFloat(document.getElementById('inflacionMensual').value);
    let meses = parseInt(document.getElementById('mesesInflacion').value);

    if (isNaN(monto) || monto <= 0 || isNaN(inflacionMensual) || inflacionMensual < 0 || isNaN(meses) || meses <= 0) {
        document.getElementById('resultadoInflacion').innerHTML =
            '<p style="color:#c0392b;text-align:center;">Por favor ingresá todos los valores correctamente.</p>';
        return;
    }

    const tasa = inflacionMensual / 100;
    const factorAcumulado = Math.pow(1 + tasa, meses);
    const inflacionTotal = ((factorAcumulado - 1) * 100).toFixed(2);
    const montoNecesario = monto * factorAcumulado;
    const valorRealHoy = monto / factorAcumulado;
    const perdidaReal = monto - valorRealHoy;

    const fmt = v => v.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    document.getElementById('resultadoInflacion').innerHTML = `
        <table class="ResultadosCalculo">
            <thead>
                <tr><th colspan="2">Resultado del análisis inflacionario</th></tr>
            </thead>
            <tbody>
                <tr><td>Monto analizado</td><td>$${fmt(monto)}</td></tr>
                <tr><td>Inflación mensual estimada</td><td>${inflacionMensual}%</td></tr>
                <tr><td>Período analizado</td><td>${meses} mes${meses > 1 ? 'es' : ''}</td></tr>
                <tr><td>Inflación total acumulada</td><td><strong>${inflacionTotal}%</strong></td></tr>
                <tr><td>Para mantener poder adquisitivo necesitás</td><td><strong>$${fmt(montoNecesario)}</strong></td></tr>
                <tr><td>Tu dinero vale hoy (poder de compra real)</td><td>$${fmt(valorRealHoy)}</td></tr>
                <tr><td>Pérdida de poder adquisitivo</td><td style="color:#c0392b;font-weight:700;">−$${fmt(perdidaReal)}</td></tr>
            </tbody>
        </table>
    `;
}

window.calcularInflacion = calcularInflacion;
