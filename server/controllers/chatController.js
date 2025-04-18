import dotenv from 'dotenv'
import Chat from "../models/ChatModel.js";
import Order from "../models/OrderModel.js";
import {sendWhatsappfn} from "./message.js";
import {
    emailNotificacionCliente, emailNotificacionProfesional
  } from "../helpers/emails.js";

dotenv.config();

const getChatMessages = async (req, res) => {
    //console.log("ENTRO A CHAT CONTROLLER", req.params.id); // Accede al valor de ID como req.params.id
    try {
        const id = req.params.id;
        const chat = await Chat.findOne({ orderId: id });

        if (!chat) {
            return res.status(404).json({ error: 'No hay mensajes' });
        }

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

// const enviarNotificacion = async (req, res) => {
//     try {
//         const { id, email } = req.body;    

//         const buscarOrden = await Order.findById(id)
//         .populate({
//             path: "cliente_id",
//             select: "nombre apellido email telefono ",          
//           })          
//           .populate({
//             path: "profesional_id",
//             select:
//               "-referidos -reservas -preferencias -especialidad -codigoreferido -createdAt -updatedAt -disponibilidad -localidadesLaborales",
//             populate: {
//               path: "creador",
//               select: "nombre apellido email telefono",
//             },
//           });

//         //console.log(email, "profile.email")
//         //console.log(buscarOrden, "DATOS DE LA ORDEN")        
        
// if (buscarOrden)  // validammos que la orden exista y la poblamos con los datos del cliente y del profesional para enviarle la notificacoin por correo
// {    
//         const emailCliente = buscarOrden.cliente_id.email;
//         const emailProfesional = buscarOrden.profesional_id.creador.email;
//         const cliente_telefono = buscarOrden.cliente_id.telefono
//         const profesional_telefono = buscarOrden.profesional_id.creador.telefono
         
//         if (email === emailCliente) {
//           await emailNotificacionProfesional(id, emailProfesional, profesional_telefono)

//           const args = {
//             number: profesional_telefono,
//             message: `Tu cliente desea comunicarse contigo. Inicia sesión en la plataforma https://calyaan.com.co y coordina los detalles de tu reservación en el chat https://calyaan.com.co/resumen-profesional/${id}`
//           };
//           if (profesional_telefono) await sendWhatsappfn(args);
//         } else {
//           emailNotificacionCliente(id, emailCliente, cliente_telefono)

//           const args = {
//             number: cliente_telefono,
//             message: `Tu esteticista desea comunicarse contigo. Inicia sesión en la plataforma https://calyaan.com.co y coordina los detalles de tu reservación en el chat https://calyaan.com.co/resumen/${id}`
//           };
//           if (cliente_telefono) await sendWhatsappfn(args);
//         }

//       }

//         res.status(200).json({ message: 'Notificacion enviada con exito' });
//     } catch (error) {
//         console.error('Error saving chat message:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }

const enviarNotificacion = async (req, res) => {
  try {
      const { id, email } = req.body;    

      const buscarOrden = await Order.findById(id)
          .populate({
              path: "cliente_id",
              select: "nombre apellido email telefono ",          
          })          
          .populate({
              path: "profesional_id",
              select: "-referidos -reservas -preferencias -especialidad -codigoreferido -createdAt -updatedAt -disponibilidad -localidadesLaborales",
              populate: {
                  path: "creador",
                  select: "nombre apellido email telefono",
              },
          });

      if (buscarOrden) {
          const emailCliente = buscarOrden.cliente_id.email;
          const emailProfesional = buscarOrden.profesional_id.creador.email;
          const cliente_telefono = buscarOrden.cliente_id.telefono;
          const profesional_telefono = buscarOrden.profesional_id.creador.telefono;
           
          if (email === emailCliente) {
              await emailNotificacionProfesional(id, emailProfesional, profesional_telefono);
              
              const args = {
                  number: profesional_telefono,
                  message: `Tu cliente desea comunicarse contigo. Inicia sesión en la plataforma https://calyaan.com.co y coordina los detalles de tu reservación en el chat https://calyaan.com.co/resumen-profesional/${id}`
              };
              if (profesional_telefono) {
                  try {
                      await sendWhatsappfn(args);
                  } catch (whatsappError) {
                      console.error('Error sending WhatsApp notification:', whatsappError);
                      // Puedes decidir qué hacer en caso de error al enviar el mensaje de WhatsApp
                  }
              }
          } else {
              emailNotificacionCliente(id, emailCliente, cliente_telefono);

              const args = {
                  number: cliente_telefono,
                  message: `Tu esteticista desea comunicarse contigo. Inicia sesión en la plataforma https://calyaan.com.co y coordina los detalles de tu reservación en el chat https://calyaan.com.co/resumen/${id}`
              };
              if (cliente_telefono) {
                  try {
                      await sendWhatsappfn(args);
                  } catch (whatsappError) {
                      console.error('Error sending WhatsApp notification:', whatsappError);
                      // Puedes decidir qué hacer en caso de error al enviar el mensaje de WhatsApp
                  }
              }
          }
      }

      res.status(200).json({ message: 'Notificacion enviada con exito' });
  } catch (error) {
      console.error('Error sending notification:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};


export {
  getChatMessages,
  saveChatMessage,
  enviarNotificacion,
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