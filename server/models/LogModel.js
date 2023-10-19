// logsModel.js

import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    required: true,
  }, 
  tipo: {
    type: String,
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
});

const Log = mongoose.model('Log', logSchema);

export default Log;
