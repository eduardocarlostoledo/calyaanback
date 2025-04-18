import moment from "moment";

import Reserva from "../models/BookingModel.js";

const chequearDisponibilidadReserva = async (req, res, next) => {
  const { id } = req.params;

  let { citaDia, citaHora } = req.body;

  citaHora = parseInt(citaHora);


  let desde = citaHora - 2;
  let hasta = citaHora + 2;

  if (citaHora <= 7) {
    citaHora = "0" + citaHora.toString() + ":00";
    desde = "0" + desde.toString() + ":00";
    hasta = "0" + hasta.toString() + ":00";
  } else if (citaHora >= 8 && citaHora < 10) {
    citaHora = "0" + citaHora.toString() + ":00";
    desde = "0" + desde.toString() + ":00";
    hasta = hasta.toString() + ":00";
  } else if (citaHora === 10 || citaHora === 11) {
    citaHora = citaHora.toString() + ":00";
    desde = "0" + desde.toString() + ":00";
    hasta = hasta.toString() + ":00";
  } else {
    citaHora = citaHora.toString() + ":00";
    desde = desde.toString() + ":00";
    hasta = hasta.toString() + ":00";
  }


  const reservado = await Reserva.find({
    profesional: id,
    citaDia: citaDia,
    citaHora: { $gte: desde, $lte: hasta },
  });


  if (reservado.length > 0) {
    return res.status(400).json({
      msg: "Reserva no disponible",
    });
  }
  next();
};

export default chequearDisponibilidadReserva;
