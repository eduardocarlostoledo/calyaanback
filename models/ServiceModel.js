import mongoose from "mongoose";

const servicioSchema = mongoose.Schema(
  {
    titulo: {
      type: String,
    },
    img: {
      type: String,
    },
    profesional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
    descripcion: {
      type: String,
      required: true,
    },
    precio: {
      type: String,
      required: true,
    },
    duracion: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Servicio = mongoose.model("Servicio", servicioSchema);

export default Servicio;
