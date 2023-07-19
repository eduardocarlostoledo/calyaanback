//nueva funcion para obtener el index de la disponibilidad de las horas anteriores y posteriores a la fecha y hora del servicio

export const obtenerIndicesCumplenCondicion = (disponibilidadProfesional, fechaHoraServicio) => {
  const { fecha, horarios } = disponibilidadProfesional;
  const resultados = [];


  for (let i = 0; i < horarios.length; i++) {
    const horario = horarios[i];
    const fechaHora = new Date(`${fecha}T${horario.hora.split('-')[0]}:00`);

    const diferenciaMs = Math.abs(fechaHora - fechaHoraServicio);
    const diferenciaHoras = Math.floor(diferenciaMs / (1000 * 60 * 60));

    if (diferenciaHoras >= -2 && diferenciaHoras <= 2) {
      resultados.push(i);
    }
  }

  return resultados;
};


// export const obtenerIndicesCumplenCondicion = (disponibilidadProfesional, fechaHoraServicio) => {
//   const { fecha, horarios } = disponibilidadProfesional;
//   const resultados = [];

//   for (let i = 0; i < horarios.length; i++) {
//     const horario = horarios[i];
//     const fechaHora = new Date(`${fecha}T${horario.hora.split('-')[0]}:00`);

//     if (fechaHora >= fechaHoraServicio) {
//       const diferenciaMs = Math.abs(fechaHora - fechaHoraServicio);
//       const diferenciaHoras = Math.floor(diferenciaMs / (1000 * 60 * 60));

//       if (diferenciaHoras <= 2) {
//         resultados.push(i);
//       }
//     }
//   }

//   return resultados;
// };

//esta funcion calcula 2 horas posteriores a la fechaHoraServicio pero no dos horas antes.
// export const obtenerIndicesCumplenCondicion = (disponibilidadProfesional, fechaHoraServicio) => {
//     const { fecha, horarios } = disponibilidadProfesional;
//     const resultados = [];
  
//     for (let i = 0; i < horarios.length; i++) {
//       const horario = horarios[i];
//       const fechaHora = new Date(`${fecha}T${horario.hora.split('-')[0]}:00`);
  
//       if (fechaHora > fechaHoraServicio) {
//         const diferenciaMs = Math.abs(fechaHora - fechaHoraServicio);
//         const diferenciaHoras = Math.floor(diferenciaMs / (1000 * 60 * 60));
  
//         if (diferenciaHoras < 3) {
//           resultados.push(i);
//         }
//       }
//     }
  
//     return resultados;
//   };
  
// export const compararDiferenciaHoras = (indicesYFechas, fechaHoraServicio) => {
//     const resultados = [];
  
//     for (let i = 0; i < indicesYFechas.length; i++) {
//       const fechaHoraActual = indicesYFechas[i].fechaHora;
  
//       if (fechaHoraActual > fechaHoraServicio) {
//         const diferenciaMs = Math.abs(fechaHoraActual - fechaHoraServicio);
//         const diferenciaHoras = Math.floor(diferenciaMs / (1000 * 60 * 60));
  
//         if (diferenciaHoras < 3) {
//           resultados.push({
//             indice: indicesYFechas[i].indice,
//             fechaHora: indicesYFechas[i].fechaHora
//           });
//         }
//       }
//     }
  
//     return resultados;
//   };
  
//   export const obtenerIndicesYFechas = (disponibilidadProfesional) => {
//     const { fecha, horarios } = disponibilidadProfesional;
//     const indicesYFechas = [];
  
//     for (let i = 0; i < horarios.length; i++) {
//       const horario = horarios[i];
//       const fechaHora = new Date(`${fecha}T${horario.hora.split('-')[0]}:00`);
//       indicesYFechas.push({
//         indice: i,
//         fechaHora: fechaHora,
//       });
//     }
  
//     return indicesYFechas;
//   };
  

//   [
//     { indice: 3, fechaHora: '2023-06-14T13:00:00.000Z' },
//     { indice: 4, fechaHora: '2023-06-14T14:00:00.000Z' }
//   ]
//   En este ejemplo, la `fechaHoraServicio` es el 14 de junio de 2023 a las 12:00:00. El array `indicesYFechas` contiene varias fechasHora posteriores. La función `compararDiferenciaHoras` compara cada fechaHora con la `fechaHoraServicio` y devuelve los elementos cuya diferencia en horas sea menor a 3. En este caso, los elementos con índice 3 y 4 cumplen con esta condición.
  
//   Puedes generar más ejemplos siguiendo esta estructura y ajustando los valores de las `fechaHoraServicio` y `indicesYFechas` según tus necesidades.
  