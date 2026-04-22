function calcularFV(principal, pmt, años, tasaAnual, n) {
    const periodos = años * 12;

    if (tasaAnual === 0) {
        return principal + pmt * periodos;
    }

    // Tasa mensual efectiva según frecuencia de capitalización
    const m = Math.pow(1 + (tasaAnual / 100) / n, n / 12) - 1;

    const fvPrincipal = principal * Math.pow(1 + m, periodos);
    const fvPmt = m === 0
        ? pmt * periodos
        : pmt * (Math.pow(1 + m, periodos) - 1) / m;

    return fvPrincipal + fvPmt;
}

function formatPesos(valor) {
    return '$ ' + valor.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calcularIC() {
    const principal  = parseFloat(document.getElementById('icPrincipal').value);
    const pmt        = parseFloat(document.getElementById('icPmt').value) || 0;
    const años       = parseFloat(document.getElementById('icAños').value);
    const tasa       = parseFloat(document.getElementById('icTasa').value);
    const varianza   = parseFloat(document.getElementById('icVarianza').value) || 0;
    const frecuencia = parseInt(document.getElementById('icFrecuencia').value);

    const errorEl = document.getElementById('icError');

    if (isNaN(principal) || principal < 0 || isNaN(años) || años <= 0 || isNaN(tasa) || tasa < 0 || años > 100) {
        errorEl.textContent = 'Completá los campos obligatorios con valores válidos.';
        document.getElementById('icResultados').innerHTML = '';
        return;
    }
    errorEl.textContent = '';

    const totalAportado = principal + pmt * 12 * años;
    const montoFinal    = calcularFV(principal, pmt, años, tasa, frecuencia);
    const intereses     = montoFinal - totalAportado;

    // Bloque de resumen principal
    let html = `
        <div class="ic-resultado-resumen">
            <div class="ic-card">
                <span class="ic-card-label">Capital aportado</span>
                <span class="ic-card-value">${formatPesos(totalAportado)}</span>
            </div>
            <div class="ic-card">
                <span class="ic-card-label">Intereses generados</span>
                <span class="ic-card-value ic-positivo">${formatPesos(intereses)}</span>
            </div>
            <div class="ic-card ic-card--highlight">
                <span class="ic-card-label">Balance final</span>
                <span class="ic-card-value">${formatPesos(montoFinal)}</span>
            </div>
        </div>
    `;

    // Tabla de varianza
    if (varianza > 0) {
        const tasaBaja  = Math.max(0, tasa - varianza);
        const tasaAlta  = tasa + varianza;
        const fvBajo    = calcularFV(principal, pmt, años, tasaBaja, frecuencia);
        const fvAlto    = calcularFV(principal, pmt, años, tasaAlta, frecuencia);
        const intBajo   = fvBajo - totalAportado;
        const intAlto   = fvAlto - totalAportado;

        html += `
        <div class="ic-varianza-wrapper">
            <table class="ic-varianza-tabla">
                <thead>
                    <tr>
                        <th></th>
                        <th>Tasa ${tasaBaja.toFixed(2)}%</th>
                        <th class="ic-var-col-centro">Tasa ${tasa.toFixed(2)}%</th>
                        <th>Tasa ${tasaAlta.toFixed(2)}%</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Capital aportado</td>
                        <td>${formatPesos(totalAportado)}</td>
                        <td class="ic-var-col-centro">${formatPesos(totalAportado)}</td>
                        <td>${formatPesos(totalAportado)}</td>
                    </tr>
                    <tr>
                        <td>Intereses generados</td>
                        <td>${formatPesos(intBajo)}</td>
                        <td class="ic-var-col-centro ic-positivo">${formatPesos(intereses)}</td>
                        <td class="ic-positivo">${formatPesos(intAlto)}</td>
                    </tr>
                    <tr class="ic-var-fila-total">
                        <td>Balance final</td>
                        <td>${formatPesos(fvBajo)}</td>
                        <td class="ic-var-col-centro">${formatPesos(montoFinal)}</td>
                        <td>${formatPesos(fvAlto)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        `;
    }

    // Tabla año a año
    html += `<p class="ic-tabla-titulo">Evolución año a año</p>
        <div class="ic-tabla-wrapper">
            <table class="ic-tabla">
                <thead>
                    <tr>
                        <th>Año</th>
                        <th>Capital aportado</th>
                        <th>Intereses</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>`;

    for (let y = 1; y <= años; y++) {
        const fvY     = calcularFV(principal, pmt, y, tasa, frecuencia);
        const aportY  = principal + pmt * 12 * y;
        const intY    = fvY - aportY;
        html += `
                    <tr>
                        <td>${y}</td>
                        <td>${formatPesos(aportY)}</td>
                        <td>${formatPesos(intY)}</td>
                        <td>${formatPesos(fvY)}</td>
                    </tr>`;
    }

    html += `
                </tbody>
            </table>
        </div>`;

    document.getElementById('icResultados').innerHTML = html;
    document.getElementById('icResultados').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function restablecerIC() {
    document.getElementById('icPrincipal').value = '';
    document.getElementById('icPmt').value = '';
    document.getElementById('icAños').value = '';
    document.getElementById('icTasa').value = '';
    document.getElementById('icVarianza').value = '';
    document.getElementById('icFrecuencia').value = '12';
    document.getElementById('icResultados').innerHTML = '';
    document.getElementById('icError').textContent = '';
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('icCalcular').addEventListener('click', calcularIC);
    document.getElementById('icRestablecer').addEventListener('click', restablecerIC);
});
