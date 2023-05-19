import express from "express";
import { check } from "express-validator";
import validarCampos from "../middlewares/fieldsValidation.js";
import checkAuth from "../middlewares/checkAuth.js";
import isAdminRole from "../middlewares/isAdminRole.js";
import {
  actualizarProfesional,
  perfilProfesional,
  crearDisponibilidad,
  editarDisponibilidad,
  eliminarDisponibilidad,
  obtenerDisponibilidad,
  obtenerHistorial,
  perfilReferido,
  obtenerIDSReferidos,
  GetPerfilProfesional,
  GetPerfilProfesionalID
} from "../controllers/professionalController.js";

const profesionalRoutes = express.Router();

profesionalRoutes.get("/perfil", checkAuth, perfilProfesional);

profesionalRoutes.get("/perfil-profesional/:id", checkAuth, GetPerfilProfesional);

profesionalRoutes.get("/perfil-profesional-id/:id", checkAuth, GetPerfilProfesionalID);

profesionalRoutes.get("/perfil-referido", checkAuth, perfilReferido);

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
