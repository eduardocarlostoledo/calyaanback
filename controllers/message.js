import dotenv from 'dotenv'
import twilio from 'twilio'
dotenv.config();

const accountSid = `${process.env.ACCESS_TWILIO_ID}`;
const authToken = `${process.env.ACCESS_TWILIO_TOKEN}`;
const numberTwilio = `${process.env.ACCESS_NUMBER_TWILIO}`;
const client = twilio(accountSid, authToken);

// controlador para whatsapp post venta
const sendWhatsappfn = async (args) => {
    try {
        const { number, message } = args;
        await client.messages.create({
            from: `whatsapp:${numberTwilio}`,
            to: `whatsapp:${number}`,
            body: `${message}`
        });
        
    } catch (error) {
        console.error(`Error sending WhatsApp message: ${error}`);
    }
};

//controlador para ruta /whatsapp/send
const sendWhatsapp = async (req, res) => {    
    try {
        const { number, message } = req.body;
        await client.messages.create({
            from: `whatsapp:${numberTwilio}`,
            to: `whatsapp:${number}`,
            body: `${message}`
        });
        
        res.status(200).json({ message: "Mensaje enviado" });
    } catch (error) {
        console.error(`Error sending WhatsApp message: ${error}`);
        res.status(500).json({ error: "Error al enviar el mensaje de WhatsApp" });
    }
};

export { sendWhatsapp, sendWhatsappfn };