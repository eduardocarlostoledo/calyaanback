import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";



import conectarDB from "./config/database.js";

import authRoutes from "./routes/authRoutes.js";
import usuarioRoutes from "./routes/userRoutes.js";
import profesionalRoutes from "./routes/professionalRoutes.js";
import busquedasRoutes from "./routes/searchesRoutes.js";
import reservaRoutes from "./routes/bookingRoutes.js";
import uploadsRoutes from "./routes/uploadsRoutes.js";
import loadDataRoutes from "./routes/LoadDataRoutes.js";
import productRoutes from "./routes/productsRoutes.js";
import payRouter from "./routes/payRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import mercadopago from "mercadopago";
import sendWhatsapp from "./routes/sendWhatsapp.js";
import couponRoutes from "./routes/couponRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import settlementRoutes from "./routes/settlementRoutes.js";
import siigoRoutes from "./routes/siigoRoutes.js";



dotenv.config();

const ACCESS_TOKEN_MERCADOPAGO = process.env.ACCESS_TOKEN_MERCADOPAGO;


mercadopago.configure({
  access_token: ACCESS_TOKEN_MERCADOPAGO,
});

// Instanciando express
const app = express();

// Procesar la informacion de tipo JSON
app.use(express.json());

// Morgan
app.use(morgan("dev"));

dotenv.config();


conectarDB();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// Configurar CORS
// const whitelist = [process.env.FRONTEND_URL];
// const corsOption = {
//   origin: function (origin, callback) {
//     if (whitelist.includes(origin)) {
//       // Puede consultar la API
//       callback(null, true);
//     } else {
//       // No esta permitido
//       callback(new Error("Error de Cors"));
//     }
//   },
// };
// app.use(cors(corsOption));
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Routing
app.use("/api/auth", authRoutes);
app.use("/api/siigo", siigoRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/profesional", profesionalRoutes);
app.use("/api/buscar", busquedasRoutes);
app.use("/api/reservas", reservaRoutes);
app.use("/api/uploads", uploadsRoutes);
app.use("/api/loaddata", loadDataRoutes);
app.use("/api/products", productRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/pay", payRouter);
app.use("/api/ordenes", orderRoutes);
app.use("/api/facturas", invoiceRoutes);
app.use("/api/liquidaciones", settlementRoutes);
app.use('/whatsapp',sendWhatsapp);


// Definiendo PORT
const PORT = process.env.PORT || 4000;

// Arrancando el servidor
const servidor = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
