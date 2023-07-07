import express from "express";
import { check } from "express-validator";
import { login, googleSignIn } from "../controllers/authController.js";
import validarCampos from "../middlewares/fieldsValidation.js";

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

export default authRoutes;
