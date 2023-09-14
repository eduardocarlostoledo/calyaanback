import express from "express";

import { siigoLogin } from "../controllers/siigoController.js";

const siigoRoutes = express.Router();

siigoRoutes.post("/auth", siigoLogin);

export default siigoRoutes;


