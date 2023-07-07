import express from "express";
import { check } from "express-validator";
import validarCampos from "../middlewares/fieldsValidation.js";
import checkAuth from "../middlewares/checkAuth.js";
import isAdminRole from "../middlewares/isAdminRole.js";

import {
  crearReserva,
  listarReservas,
  eliminarReserva,
  obtenerProEspecialidadFechaHora,
  obtenerProfesional,
  obtenerProfesionalesPorFecha,
  obtenerHorariosProfesional
  // disponibles,
} from "../controllers/bookingController.js";
import chequearDisponibilidadReserva from "../middlewares/checkBookAvailability.js";

const reservaRoutes = express.Router();

reservaRoutes.post("/", checkAuth, obtenerProEspecialidadFechaHora);

reservaRoutes.post(
  "/profesionales/fecha",
  checkAuth,
  obtenerProfesionalesPorFecha
);

reservaRoutes.post(
  "/profesional/horario/:id",
  checkAuth,
  obtenerHorariosProfesional
);

reservaRoutes.get(
  "/profesional/:id",
  [checkAuth, check("id", "no es un id válido").isMongoId(), validarCampos],
  obtenerProfesional
);

reservaRoutes.post(
  "/crear/:id",
  [checkAuth],
  crearReserva
);

reservaRoutes.get("/", [checkAuth, isAdminRole], listarReservas);

reservaRoutes.delete("/:id", checkAuth, eliminarReserva);

export default reservaRoutes;
