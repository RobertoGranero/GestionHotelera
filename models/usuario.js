const mongoose  = require("mongoose");

let usuarioSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        minLength: 4
    },    
    password: {
        type: String,
        required: true,
        minLength: 7
    }

})


let Usuario = mongoose.model("usuarios", usuarioSchema);
module.exports = Usuario;