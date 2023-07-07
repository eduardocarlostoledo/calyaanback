export default function convertirFormatoHora(hora) {
    const partes = hora.split(":");
    let horas = parseInt(partes[0]);
    let minutos = parseInt(partes[1]);
  
    let sufijo = "am";
  
    if (horas >= 12) {
      sufijo = "pm";
      if (horas > 12) {
        horas -= 12;
      }
    } else if (horas === 0) {
      horas = 12;
    }
  
    const horaFormateada = horas.toString().padStart(2, "0") + ":" + minutos.toString().padStart(2, "0") + " " + sufijo;
    return horaFormateada;
  }
  