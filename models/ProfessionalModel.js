import mongoose from "mongoose";

const perfilprofesionalSchema = mongoose.Schema(
  {
    descripcion: {
      type: String,
      trim: true,
    },
    especialidad: Array,
    localidadesLaborales: Array,
    disponibilidad: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Disponibilidad",
      },
    ],
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
    codigoreferido: {
      type: String,
      trim: true,
    },
    referidos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
      },
    ],
    reservas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orden",
      },
    ],
    preferencias: {
      type: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const PerfilProfesional = mongoose.model(
  "PerfilProfesional",
  perfilprofesionalSchema
);

export default PerfilProfesional;
