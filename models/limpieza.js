const mongoose  = require("mongoose");

let limpiezaSchema = new mongoose.Schema({
    idHabitacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'habitaciones' 
    },
    fechaHora: {
        type: Date,
        required: true,
        default: Date.now()
    },
    observaciones: {
        type: String,
        minLength: 1
    }

})


let Limpieza = mongoose.model("limpieza", limpiezaSchema);
module.exports = Limpieza;