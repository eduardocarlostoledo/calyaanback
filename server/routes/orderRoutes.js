import express from "express";
import isAdminRole from "../middlewares/isAdminRole.js";
import checkAuth from "../middlewares/checkAuth.js";

import { createOrden, updateOrden, getAllOrden, getOrdenById, deleteOrden, getOrdenesByUserId } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/orden", createOrden);
orderRouter.delete("/orden/:id", deleteOrden);

orderRouter.put("/updateorden", checkAuth, updateOrden);
orderRouter.get("/orden", checkAuth, isAdminRole, getAllOrden);
orderRouter.get("/getordenbyid/:id", checkAuth, getOrdenById);
orderRouter.get("/ordenbyuserid/:id", checkAuth, getOrdenesByUserId); 

export default orderRouter;