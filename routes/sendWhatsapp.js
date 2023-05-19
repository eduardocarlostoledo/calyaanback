import express from "express";
import { sendWhatsapp } from "../controllers/message.js";

const sendMessage = express.Router();

sendMessage.post('/send', sendWhatsapp);

export default sendMessage;