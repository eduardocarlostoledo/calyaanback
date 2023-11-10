import express from "express";
import checkAuth from "../middlewares/checkAuth.js";
import isAdminRole from "../middlewares/isAdminRole.js";

import {  getChatMessages, saveChatMessage } from "../controllers/chatController.js";

const chatRoutes = express.Router();

chatRoutes.get("/getchat/:id", checkAuth, getChatMessages);
chatRoutes.post("/savechat", checkAuth, saveChatMessage);

export default chatRoutes;


