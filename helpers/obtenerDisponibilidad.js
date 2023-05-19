const obtenerDisponibilidad = async (profesionales, citaHora) => {
  let profesional = [];
  const hourDate = new Date(`1/1/1999 ${citaHora}`);

  profesionales.forEach((profesionalState) => {
    let opened = false;
    profesionalState.hora.forEach((disponibilidadHoraState) => {
      let open = new Date("1/1/1999 " + disponibilidadHoraState.split("-")[0]);
      let close = new Date("1/1/1999 " + disponibilidadHoraState.split("-")[1]);
      opened = opened || (hourDate >= open && close >= hourDate);
    });

    if (opened) {
      profesional.push(profesionalState)
    }
  });

  return profesional;
};

export default obtenerDisponibilidad;
