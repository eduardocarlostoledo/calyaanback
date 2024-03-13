import express from "express";
import checkAuth from "../middlewares/checkAuth.js";
import isAdminRole from "../middlewares/isAdminRole.js";

import {  getChatMessages, saveChatMessage, enviarNotificacion } from "../controllers/chatController.js";

const chatRoutes = express.Router();

chatRoutes.get("/getchat/:id", 
//checkAuth, 
getChatMessages);
chatRoutes.post("/savechat", checkAuth, saveChatMessage);
chatRoutes.post("/notificacion", checkAuth, enviarNotificacion);

export default chatRoutes;


