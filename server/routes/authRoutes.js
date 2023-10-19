import express from "express";
import { check } from "express-validator";
import { login, googleSignIn, getLogs } from "../controllers/authController.js";
import validarCampos from "../middlewares/fieldsValidation.js";
import Log from "../models/LogModel.js";
import isAdminRole from "../middlewares/isAdminRole.js";
import checkAuth from "../middlewares/checkAuth.js";


const authRoutes = express.Router();

authRoutes.post(
  "/login",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  login
);

authRoutes.post(
  "/google",
  [
    check("token", "token de google es necesario").not().isEmpty(),
    validarCampos,
  ],
  googleSignIn
);

// Endpoint que retorna los logs
authRoutes.get('/logs', 
checkAuth, isAdminRole, getLogs);

export default authRoutes;
