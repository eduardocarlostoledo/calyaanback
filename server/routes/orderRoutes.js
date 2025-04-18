import express from "express";
import isAdminRole from "../middlewares/isAdminRole.js";
import checkAuth from "../middlewares/checkAuth.js";

import { createOrden, updateOrden, getAllOrden, getOrdenById, deleteOrden, getOrdenesByUserId, updateOrdenByProfesional, editarOrdenCompletaDashboard, campañaRecompra, ventasPorMesController } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/orden", createOrden);
orderRouter.delete("/orden/:id", deleteOrden);

orderRouter.put("/updateorden", checkAuth, updateOrden);
orderRouter.get("/orden", checkAuth, isAdminRole, getAllOrden);
orderRouter.get("/getordenbyid/:id", 
//checkAuth, 
getOrdenById);
orderRouter.get("/ordenbyuserid/:id", checkAuth, getOrdenesByUserId); 
orderRouter.post("/updateorderbyprofesional/", checkAuth, updateOrdenByProfesional);
orderRouter.put("/updateordendashboard/:id", checkAuth, editarOrdenCompletaDashboard); //se esta trabajando para editar las ordenes
orderRouter.get("/recompra", checkAuth, isAdminRole, campañaRecompra); 
orderRouter.get("/informe", checkAuth, isAdminRole, ventasPorMesController); 


export default orderRouter;