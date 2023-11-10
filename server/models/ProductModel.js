import mongoose from "mongoose";

const productoSchema = mongoose.Schema(
  {
    nombre: {
        type: String,
      },
    idWP: {
      type: String,
    },
    img: {
      type: String,
    },
    descripcion: {
      type: String,
    },
    precio: {
      type: String,
      required: true,
    },
    precio_regular: {
      type: String,
    },
    link: {
      type: String,
    },
    cantidad:{
      type:Number,
      default:1
    },
    porcetajeCalyaan:{
      type:Number,
      default:39
    },
    porcetajeProfesional:{
      type:Number,
      default:61
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Producto = mongoose.model("Producto", productoSchema);

export default Producto;
