import mongoose from "mongoose";

const disponibilidadSchema = mongoose.Schema(
  {
    fecha: {
      type: String,
      requerido: true,
    },
    horarios: {
      type: [{
        hora: { type: String },
        stock: { type: Boolean, default: true }
      }],
    },
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PerfilProfesional",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Disponibilidad = mongoose.model("Disponibilidad", disponibilidadSchema);

export default Disponibilidad;
