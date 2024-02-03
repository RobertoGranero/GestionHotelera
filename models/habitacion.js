const mongoose  = require("mongoose");

let incidenciasSchema = new mongoose.Schema ({
    descripcion: {
        type: String,
        required: true
    },
    fechaInicio: {
        type: Date,
        required: true,
        default: Date.now()
    },
    fechaFin: {
        type: Date,
    },
    imagen: {
        type:String,
        required: false,
    }
});

let habitacionSchema = new mongoose.Schema({
    numero: {
        type: Number,
        required: [true, 'El numero de la habitacion es obligatorio'],
        min: [0, 'El numero minimo es 0'],
        max: [100, ' El numero maximo es 100']
    },
    tipo: {
        type: String,
        enum: ["individual", "doble", "familiar", "suite", 'El tipo de habitacion tiene que ser el correcto']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion de la habitacion es obligatoria'],
        minLength: [1, 'La descripcion de la habitacion es demasiado corto']
    },
    ultimaLimpieza: {
        type: Date,
        required: [true, 'La ultima limpieza de la habitacion es obligatoria'],
        default: Date.now()
    },
    precio: {
        type: Number,
        required: [true, 'El precio de la habitacion es obligatoria'],
        min: [0, 'El precio minimo es 0'],
        max: [250, 'El precio maximo es 250'],
    },
    incidencias: [incidenciasSchema],
    imagen: {
        type:String,
        required: [false, 'La imagen de la habitacion es obligatoria'],
    }

});

let Habitacion = mongoose.model("habitaciones", habitacionSchema);
module.exports = Habitacion;
