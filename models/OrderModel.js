import mongoose from "mongoose";

const ordenSchema = mongoose.Schema({

  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
  },
  cliente_email: {
    type: String,
    required: true
  },
  cliente_nombre: {
    type: String,
    required: true
  },
  cliente_apellido: {
    type: String,
    required: true
  },
  cliente_cedula: {
    type: String,
    required: true
  },
  cliente_telefono: {
    type: String,
    required: true
  },
  profesional_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
  },
  profesional_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PerfilProfesional",
  },
  profesional_email: {
    type: String,

  },
  profesional_nombre: {
    type: String,

  },
  profesional_apellido: {
    type: String,

  },
  profesional_telefono: {
    type: String,

  },
  dia_servicio: {
    type: String,

  },
  hora_servicio: {
    type: String,
  },
  servicio: {
    type: String,

  },
  servicio_img: {
    type: String,
  },
  cantidad: {
    type: Number,

  },
  precio: {
    type: Number,

  },
  direccion_Servicio: {
    type: String,

  },
  adicional_direccion_Servicio: {
    type: String,

  },
  ciudad_Servicio: {
    type: String,

  },
  localidad_Servicio: {
    type: String,

  },
  telefono_Servicio: {
    type: String,

  },
  estadoPago: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  estadoServicio: {
    type: String,
    enum: ["Pendiente", "Completado", "Cancelado"],
    default: "Pendiente"
  },
  estadoFacturacion: {
    type: String,
    enum: ["Facturado", "NoFacturado", "Error"],
    default: "NoFacturado"
  },
  numeroFacturacion: {
    type: String,    
  },
  estadoLiquidacion: {
    type: String,
    enum: ["Liquidado", "NoLiquidado", "Error"],
    default: "NoLiquidado"
  },
  numeroLiquidacion: {
    type: String,    
  },
  payment_id: {
    type: String,

  },
  payment_type: {
    type: String,

  },
  merchant_order_id: {
    type: String,

  }
},
  {
    timestamps: true,
    versionKey: false,
  });

const Orden = mongoose.model('Orden', ordenSchema);

export default Orden;