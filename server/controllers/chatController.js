import dotenv from 'dotenv'
import Chat from "../models/ChatModel.js";
import Orden from "../models/OrderModel.js";
import Order from "../models/OrderModel.js";
import {sendWhatsappfn} from "./message.js";
dotenv.config();

const getChatMessages = async (req, res) => {
    console.log("ENTRO A CHAT CONTROLLER", req.params.id); // Accede al valor de ID como req.params.id
    try {
        const id = req.params.id;
        const chat = await Chat.findOne({ orderId: id });

        // Ordena los mensajes por fecha de manera descendente (de la más reciente a la más antigua)
        chat.messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.json({ messages: chat.messages });
    } catch (error) {
        console.error('Error fetching chat:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Guardar y editar un mensaje de chat
const saveChatMessage = async (req, res) => {
  try {    
    const { id, user, message } = req.body;    

    const chat = await Chat.findOne({ orderId: id });
    if (chat) {
      chat.messages.push({ user, message });
      await chat.save();
    } else {
      const newChat = new Chat({
        orderId: id,
        messages: [{ user, message }],
      });
      await newChat.save();
    }      
      //se necesita traer el numero de telefono del cliente y del profesional desde algun lado
    //   const argsCliente = {
    //       number: cliente_id.telefono,
    //       message: `Tienes una notificacion del profesional en ${process.env.FRONTEND_URL}/resumen/${id}`
    //   };
    //   const argsProfesional = {
    //       number: profesional_id.telefono,
    //       message: `Tienes una notificacion del cliente en ${process.env.FRONTEND_URL}/resumen-profesional/${id}`
    //   };

    //   sendWhatsappfn(argsCliente);
    //   sendWhatsappfn(argsProfesional);

    res.status(200).json({ message: 'Chat message saved successfully' });
  } catch (error) {
    console.error('Error saving chat message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export {
  getChatMessages,
  saveChatMessage,
};

//para traer el dato del profesional .... -.-"
// .populate({
//     path: "profesional_id",
//     select: "creador",
//     populate: {
//       path: "creador",
//       select: "_id nombre img apellido telefono img",
//     },
//   })         