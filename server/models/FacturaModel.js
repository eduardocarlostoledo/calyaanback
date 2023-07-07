import mongoose from "mongoose";

const FacturaSchema = new mongoose.Schema({
    estadoPago: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    payment_id: {
        type: String,
    },
    payment_type: {
        type: String,
    },
    merchant_order_id: {
        type: String,
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
        required: false
    },
    descuentoFidelidad: {
        type: Number
    },
    origen: {
        type: String
    },
    servicios: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Producto",
    },
    orden: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orden",
    },
});

const Factura = mongoose.model('Factura', FacturaSchema);

export default Factura;
