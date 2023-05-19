import express from "express";
import { check } from "express-validator";
import validarCampos from "../middlewares/fieldsValidation.js";
import checkAuth from "../middlewares/checkAuth.js";
import isAdminRole from "../middlewares/isAdminRole.js";
import isSuperAdminRole from "../middlewares/isSuperAdminRole.js";

import {
  buscarUsuarios,
  obtenerUsuarios,
  obtenerProfesionales,
  obtenerAll,
  obtenerOrdenes
} from "../controllers/searchesController.js";

const busquedasRoutes = express.Router();

//busqueda de usuarios por termino
busquedasRoutes.get(
  "/usuarios/:termino",
  [checkAuth, isAdminRole],
  buscarUsuarios
);

//obtener usuarios
busquedasRoutes.get("/usuarios", [checkAuth, isAdminRole], obtenerUsuarios);

//buscar profesionales
busquedasRoutes.get("/profesionales", checkAuth, obtenerProfesionales);

busquedasRoutes.get("/all",[checkAuth,isAdminRole],obtenerAll)

busquedasRoutes.get("/ordenes",[checkAuth,isAdminRole],obtenerOrdenes)

export default busquedasRoutes;
