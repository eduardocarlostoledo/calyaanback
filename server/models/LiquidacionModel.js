import mongoose from "mongoose";

const settlementSchema = new mongoose.Schema({
    profesional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PerfilProfesional",
    },
    ordenes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orden",
    }],
    rangodefechas: [{
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
  

const Settlement = mongoose.model('Settlement', settlementSchema);

export default Settlement;
