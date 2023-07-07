import express from "express";
import { check } from "express-validator";
import upload from "../config/multer.js";
import checkAuth from "../middlewares/checkAuth.js";
import { cargarImagen } from "../controllers/uploadsController.js";
import existeArchivo from "../middlewares/existFileValidator.js";
const uploadsRoutes = express.Router();

uploadsRoutes.post(
  "/file",
  [checkAuth, upload.single("file"), existeArchivo],
  cargarImagen
);

export default uploadsRoutes;
