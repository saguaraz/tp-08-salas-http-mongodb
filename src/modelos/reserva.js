const mongoose = require("mongoose");

const SALAS_PERMITIDAS = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const TURNOS_PERMITIDOS = ["Mañana", "Tarde", "Noche"];

const reservaSchema = new mongoose.Schema({
  estudiante: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    trim: true,
    match: [/@/, "El email debe contener un @"]
  },
  sala: { type: String, required: true, enum: SALAS_PERMITIDAS },
  fecha: { type: String, required: true, trim: true },
  turno: { type: String, required: true, enum: TURNOS_PERMITIDOS },
  personas: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 6,
    validate: { validator: Number.isInteger, message: "Debe ser un entero." }
  },
  estado: { type: String, enum: ["pendiente", "confirmada"], default: "pendiente" }
}, { collection: "reservas" });

const Reserva = mongoose.model("Reserva", reservaSchema);
module.exports = { Reserva, SALAS_PERMITIDAS, TURNOS_PERMITIDOS };
