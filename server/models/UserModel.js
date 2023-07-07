import mongoose from "mongoose";
import bcrypt from "bcrypt";

const usuarioSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    apellido: {
      type: String,
      required: true,
      trim: true,
    },
    cedula: {
      type: Number,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    telefono: {
      type: String,
      trim: true,
    },
    sexo: {
      type: String,
    },
    ciudad: {
      type: String,
      default: "Bogotá",
    },
    localidad: {
      type: String,
    },
    barrio: {
      type: String,
    },
    direccion: {
      type: String,
    },
    rol: {
      type: String,
      required: true,
      enum: ["ADMIN", "CLIENTE", "PROFESIONAL", "SUPERADMIN"],
      default: "CLIENTE",
    },
    reservas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orden",
      },
    ],
    direccionDefault: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Direccion",
    },
    direcciones: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Direccion",
      },
    ],
    estado: {
      type: Boolean,
      default: true,
    },
    img: {
      type: String,
    },
    token: {
      type: String,
    },
    confirmado: {
      type: Boolean,
      default: false,
    },
    google: {
      type: Boolean,
      default: false,
    },
    profesional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PerfilProfesional",
    },
    profesionalReferido: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PerfilProfesional",
    },
    favoritos: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "PerfilProfesional",
      default: null,
    },
    ultimaConexion: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// hashear los password con el hook de pre de mongoose
usuarioSchema.pre("save", async function (next) {
  // si esta modificado el password que pase al siguiente Middleware
  if (!this.isModified("password")) next();

  const sal = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, sal);
});

usuarioSchema.methods.comprobarPassword = async function (passwordForm) {
  return await bcrypt.compare(passwordForm, this.password);
};

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
