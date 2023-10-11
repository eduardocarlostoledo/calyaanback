import express from "express";
import { check } from "express-validator";
import validarCampos from "../middlewares/fieldsValidation.js";
import checkAuth from "../middlewares/checkAuth.js";
import isAdminRole from "../middlewares/isAdminRole.js";
import {
  actualizarProfesional,
  actualizarProfesionalAdminDash,
  actualizarProfesionalAdmin,
  perfilProfesional,
  crearDisponibilidad,
  editarDisponibilidad,
  eliminarDisponibilidad,
  obtenerDisponibilidad,
  obtenerHistorial,
  perfilReferido,
  obtenerIDSReferidos,
  GetPerfilProfesional,
  obtenerDisponibilidadTotal,
  GetPerfilProfesionalID,
  obtenerDisponibilidadProfesionalAdminDash,
} from "../controllers/professionalController.js";

const profesionalRoutes = express.Router();

profesionalRoutes.get("/perfil", checkAuth, perfilProfesional);

profesionalRoutes.get(
  "/perfil-profesional/:id",
  checkAuth,
  GetPerfilProfesional
);

profesionalRoutes.get(
  "/disponibilidades-totales",
  // checkAuth,
  obtenerDisponibilidadTotal
);

profesionalRoutes.get(
  "/disponibilidad-profesional-admin-dash",
  // checkAuth,  
);obtenerDisponibilidadProfesionalAdminDash

profesionalRoutes.get(
  "/perfil-profesional-id/:id",
  // checkAuth,
  GetPerfilProfesionalID
);

profesionalRoutes.get("/perfil-referido", checkAuth, perfilReferido);

//  actualizar el perfil profesional del usuario ( descripcion, localidades y especialidades)
profesionalRoutes.put(
  "/actualizar-profesional-admin",
  // checkAuth,
  actualizarProfesionalAdminDash
);

// Actualizar el perfil de usuaio del profesional
profesionalRoutes.put(
  "/actualizar-profesional-admin-dash",
  // checkAuth,
  actualizarProfesionalAdmin
);

//  este de aca es para actualizar el profesional desde su propio perfil
profesionalRoutes.put(
  "/actualizar-profesional",
  checkAuth,
  actualizarProfesional
);

profesionalRoutes.post("/", checkAuth, crearDisponibilidad);
profesionalRoutes.get("/:fecha", checkAuth, obtenerDisponibilidad);
profesionalRoutes.put("/:id", checkAuth, editarDisponibilidad);
profesionalRoutes.delete("/:id", checkAuth, eliminarDisponibilidad);

// Obtener historial de reservas
profesionalRoutes.get("/historial/:id", checkAuth, obtenerHistorial);

// Obtener IDs Referidos
profesionalRoutes.get("/referidos", obtenerIDSReferidos);

export default profesionalRoutes;
