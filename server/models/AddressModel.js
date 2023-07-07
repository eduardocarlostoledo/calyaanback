import mongoose from "mongoose";

const direccionSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
    },
    direccion: {
      type: String,
    },
    info: {
      type: String,
    },
    ciudad: {
      type: String,
      default: "Bogotá",
    },
    localidad: {
      type: String,
      required: true,
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Direccion = mongoose.model("Direccion", direccionSchema);

export default Direccion;
