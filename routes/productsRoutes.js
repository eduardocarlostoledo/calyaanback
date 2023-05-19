import express from "express";

import checkAuth from "../middlewares/checkAuth.js";

import { obtenerProducto, getProducts, getProductName } from "../controllers/productsController.js";

const product = express.Router();

product.get("/:id", obtenerProducto);
product.get("/name/:nombre",getProductName)
product.get("/", getProducts);

export default product;
