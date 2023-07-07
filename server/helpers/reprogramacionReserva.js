import PerfilProfesional from "../models/ProfessionalModel.js";
import Usuario from "../models/UserModel.js";
import saveOrder from "./orderController.js";
import Producto from "../models/ProductModel.js";
import Orden from "../models/OrderModel.js";
import { emailCompra, emailProfesional } from "../helpers/emails.js";
import Disponibilidad from "../models/AvailableModel.js";

const reprogramarReserva = async (guardarDatosReprogramacion) => {    
    
    // disponibilidad false a true
let disponibilidadProfesional = await Disponibilidad.findOne({ fecha: guardarDatosReprogramacion.dia_servicio, creador: guardarDatosReprogramacion.profesional_id });
console.log("reprogramar reserva disponibilidad de profesional", disponibilidadProfesional.horarios);


// const index = disponibilidadProfesional.horarios.findIndex(item => item.hora === '07:00-07:59');
const index = disponibilidadProfesional.horarios.findIndex(item => item.hora === guardarDatosReprogramacion.hora_servicio);
if (index !== -1) {
  disponibilidadProfesional.horarios[index].stock = true;

  const siguienteIndex = (index + 1) % disponibilidadProfesional.horarios.length;
  disponibilidadProfesional.horarios[siguienteIndex].stock = true;
}

await disponibilidadProfesional.save();
// analizar como notificar la reprogramacion si hay cambio de profesional.
// await emailCompra(order);
// await emailProfesional(order);

}

module.exports = {reprogramarReserva}