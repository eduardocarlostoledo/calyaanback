import express from "express";
import { createOrden, updateOrden, getAllOrden, getOrdenById, deleteOrden, getOrdenesByUserId } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/orden", createOrden);
orderRouter.delete("/orden/:id", deleteOrden);

orderRouter.put("/updateorden", updateOrden);
orderRouter.get("/orden", getAllOrden);
orderRouter.get("/getordenbyid/:id", getOrdenById);
orderRouter.get("/ordenbyuserid/:id", getOrdenesByUserId); 

export default orderRouter;