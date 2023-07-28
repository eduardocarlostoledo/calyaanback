import express from "express";

import checkAuth from "../middlewares/checkAuth.js";

import { cargarProductosWP } from "../controllers/loadDataController.js";

const loadData = express.Router();

loadData.post("/products", cargarProductosWP);

export default loadData;
