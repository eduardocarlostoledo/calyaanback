import mongoose from "mongoose";

const ordenSchema = mongoose.Schema(
  {
    cliente_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
    profesional_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PerfilProfesional",
      default: null,
    },
    servicios: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Producto",
    },
    factura: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Factura",
    },
    cita_servicio: {
      type: String,
    },
    hora_servicio: {
      type: String,
    },
    direccion_servicio: {
      type: String,
    },
    adicional_direccion_servicio: {
      type: String,
    },
    ciudad_servicio: {
      type: String,
      default: "Bogotá",
    },
    localidad_servicio: {
      type: String,
    },
    telefono_servicio: {
      type: String,
    },
    estado_servicio: {
      type: String,
      enum: ["Pendiente", "Completado", "Cancelado", "Agendar"],
      default: "Pendiente",
    },
    liquidacion: {
      type: Boolean,
      default: false,
    },
    paquetesGenerados: {
      type: Boolean,
      default: false,
    },
    nroSesion: {
      type: String,
      default: "Sesión 1",
    },
    registroFirmaCliente: {
      type: String,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Orden = mongoose.model("Orden", ordenSchema);

export default Orden;
