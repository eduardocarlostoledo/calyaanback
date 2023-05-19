import mongoose from "mongoose";

const reservaSchema = mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
    profesional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profesional",
    },
    citaDia: {
      type: String,
      required: true,
    },
    citaHora: {
      type: String,
      required: true,
    },
    servicio: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Reserva = mongoose.model("Reserva", reservaSchema);

export default Reserva;
