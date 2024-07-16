
// Fecha de actualizacion.
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
//  Ultiam version.
const ultimaVersion = document.getElementById("version");
ultimaVersion.innerText = "Version: 1.4.8";