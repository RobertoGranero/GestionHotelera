const mongoose = require('mongoose');

const Usuraio = require(__dirname + "/models/usuario");


mongoose.connect('mongodb://127.0.0.1:27017/hotel');


let usuarios = [
    new Usuraio({
        login: "user1",
        password: "user1user1",

    }),
    new Usuraio({
        login: "user2",
        password: "user2user2",
    }),
    
]

usuarios.forEach(h => h.save());
