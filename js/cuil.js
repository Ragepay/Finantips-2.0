function calcularDigitoVerificador(prefijo, dni) {
  const coef   = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const numero = String(prefijo) + String(dni).padStart(8, '0');
  let suma = 0;

  for (let i = 0; i < 10; i++) {
    suma += parseInt(numero[i]) * coef[i];
  }

  const resto = suma % 11;

  if (resto === 0) return 0;
  if (resto === 1) return prefijo === 20 ? 9 : 4; // caso especial según género
  return 11 - resto;
}

function formatCUIL(prefijo, dni, dv) {
  return `${prefijo}-${String(dni).padStart(8, '0')}-${dv}`;
}

function calcularCUIL() {
  const dniRaw  = document.getElementById('dni').value.trim().replace(/\D/g, '');
  const genero  = document.getElementById('genero').value;
  const resultEl = document.getElementById('resultadoCUIL');

  if (!dniRaw || dniRaw.length < 7 || dniRaw.length > 8) {
    resultEl.innerHTML = '<p class="cuil-error">Ingresá un DNI válido (7 u 8 dígitos).</p>';
    return;
  }

  const dni = parseInt(dniRaw, 10);

  // Prefijos según género
  const prefijos = genero === 'M' ? [20] : genero === 'F' ? [27] : [20, 27];

  const resultados = prefijos.map(prefijo => {
    let dv = calcularDigitoVerificador(prefijo, dni);

    // Si el dígito verificador da 11 (caso inválido), probar con prefijo 23
    if (dv === 11) {
      const dv23 = calcularDigitoVerificador(23, dni);
      return { prefijo: 23, dv: dv23, cuil: formatCUIL(23, dni, dv23), nota: 'Prefijo 23 (indistinto)' };
    }

    return { prefijo, dv, cuil: formatCUIL(prefijo, dni, dv) };
  });

  const generoLabel = { M: 'Masculino', F: 'Femenino', X: 'No binario / Extranjero' }[genero];

  resultEl.innerHTML = `
    <div class="cuil-resultado">
      <div class="cuil-header">
        <span class="cuil-genero-badge">${generoLabel}</span>
        <span class="cuil-dni-label">DNI ${String(dni).padStart(8,'0').replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3')}</span>
      </div>
      ${resultados.map(r => `
        <div class="cuil-numero">
          <span class="cuil-valor">${r.cuil}</span>
          ${r.nota ? `<span class="cuil-nota">${r.nota}</span>` : ''}
        </div>
      `).join('')}
      <p class="cuil-explicacion">
        Prefijo <strong>${resultados[0].prefijo}</strong> · DNI <strong>${String(dni).padStart(8,'0')}</strong> · Dígito verificador <strong>${resultados[0].dv}</strong>
      </p>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('btnCUIL').addEventListener('click', calcularCUIL);

  // También calcular al presionar Enter en el input
  document.getElementById('dni').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') calcularCUIL();
  });
});
