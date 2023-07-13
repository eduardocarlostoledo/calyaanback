import mongoose from "mongoose";

const LiquidacionSchema = new mongoose.Schema({
  numeroLiquidacion: {
    type: String,
    required: true,    
  },
  estadoLiquidacion: {
    type: String,
    required: true,
    enum: ["NoLiquidado", "Liquidado", "Error"],
    default: "NoLiquidado",
  },
  profesional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PerfilProfesional",
    },

    ordenes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orden",
    }],
    rangodefechasLiquidadas: [{
      fechaInicio: {
        type: Date,
        required: true
      },
      fechaFin: {
        type: Date,
        required: true
      }
    }],
    totalLiquidacion: {
      type: Number,
      required: true
    },
  });
  

const Liquidacion = mongoose.model('Liquidacion', LiquidacionSchema);

export default Liquidacion;
