import express from "express";
import { check } from "express-validator";
import upload from "../config/multer.js";
import checkAuth from "../middlewares/checkAuth.js";
import { cargarImagen, cargarImagenFirmas } from "../controllers/uploadsController.js";
import existeArchivo from "../middlewares/existFileValidator.js";
const uploadsRoutes = express.Router();

uploadsRoutes.post(
  "/file",
  [checkAuth, upload.single("file"), existeArchivo],
  cargarImagen
);

uploadsRoutes.post(
  "/file-firmas",
  [checkAuth, upload.single("file"), existeArchivo],
  cargarImagenFirmas
);


export default uploadsRoutes;
