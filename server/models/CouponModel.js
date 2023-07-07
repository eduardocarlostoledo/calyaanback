import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true
  },
  tipoDescuento: {
    type: String,
    enum: ['porcentaje', 'valor'],
    required: true
  },
  descuento: {
    type: Number,
    required: true
  },
  vencimiento: {
    type: Date,
  },
  eliminado: {
    type: Boolean,
    default: false
  },
  reclamados: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Usuario",
    default: [],
  },
});

const Coupon = mongoose.model('Cupon', couponSchema);

export default Coupon;
