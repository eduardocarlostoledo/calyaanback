import mongoose from "mongoose";

const FacturaSchema = new mongoose.Schema({
  estadoPago: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  payment_id: {
    type: String,
    default: "",
  },
  payment_type: {
    type: String,
    default: "",
  },
  merchant_order_id: {
    type: String,
    default: "",
  },
  precioTotal: {
    type: Number,
  },
  precioNeto: {
    type: Number,
  },
  precioSubTotal: {
    type: Number,
  },
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cupon",
    required: false,
  },
  descuentoFidelidad: {
    type: Number,
    default: "0",
  },
  origen: {
    type: String,
  },
  servicios: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Producto",
  },
  orden: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Orden",
  },
  nro_factura: {
    type: String,
    default: "",
  },
  estado_facturacion: {
    type: String,
    enum: ["Error", "NoFacturado", "Facturado"],
    default: "NoFacturado",
  },
  fecha_venta: {
    type: Date,
    default: new Date()
  },
  metodo_pago:{
    type:String,
    default:""
  },
  link_pago:{
    type:String,
    default:""
  },
  comprobante: {
    type: String,
  },
});

const Factura = mongoose.model("Factura", FacturaSchema);

export default Factura;
