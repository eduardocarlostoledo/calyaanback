import express from "express";
import Liquidacion from "../models/LiquidacionModel.js";
import checkAuth from "../middlewares/checkAuth.js";
import { createSettlement, updateSettlement, getAllSettlement, getSettlementById, deleteSettlement, getSettlementesByUserId } from "../controllers/settlementController.js";


const settlementRoutes = express.Router();

settlementRoutes.post("/settlement", createSettlement);
settlementRoutes.put("/updatesettlement", updateSettlement);
settlementRoutes.get("/settlement", getAllSettlement);
settlementRoutes.get("/getsettlementbyid/:id", getSettlementById);
settlementRoutes.delete("/settlement/:id", deleteSettlement); //sin uso por ahora
settlementRoutes.get("/settlementbyuserid/:id", getSettlementesByUserId); 

// settlementRoutes.get('/settlement', async (req, res, next) => {
//     try {
//         const liquidaciones = await Liquidacion.find()
            
//         res.status(200).json(liquidaciones);
//     } catch (err) {
//         next(err);
//     }
// });

export default settlementRoutes;
