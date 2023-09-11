import express from "express";

import checkAuth from "../middlewares/checkAuth.js";

import { cargarProductosWP, crearNuevoProducto, crearNuevoProductoID } from "../controllers/loadDataController.js";

const loadData = express.Router();

loadData.post("/products", cargarProductosWP);

loadData.post("/nuevo-producto", 
//checkAuth, 
crearNuevoProducto);

loadData.post("/nuevo-id", 
//checkAuth, 
crearNuevoProductoID);

export default loadData;
