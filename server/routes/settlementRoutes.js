import express from "express";
import Liquidacion from "../models/LiquidacionModel.js";
import checkAuth from "../middlewares/checkAuth.js";

const settlementRoutes = express.Router();

settlementRoutes.get('/settlement', async (req, res, next) => {
    try {
        const liquidaciones = await Liquidacion.find()
            
        res.status(200).json(liquidaciones);
    } catch (err) {
        next(err);
    }
});

export default settlementRoutes;
