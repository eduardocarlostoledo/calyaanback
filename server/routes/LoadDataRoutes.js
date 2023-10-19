import express from "express";
import checkAuth from "../middlewares/checkAuth.js";
import isAdminRole from "../middlewares/isAdminRole.js";

import { cargarProductosWP, crearNuevoProducto, crearNuevoProductoID } from "../controllers/loadDataController.js";

const loadData = express.Router();

loadData.post("/loadData-products", checkAuth, isAdminRole, cargarProductosWP);

loadData.post("/loadData-nuevo-producto", checkAuth, isAdminRole, crearNuevoProducto);

loadData.post("/loadData-nuevo-id", checkAuth, isAdminRole, crearNuevoProductoID);

export default loadData;
