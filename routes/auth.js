const express = require('express');
let Usuario = require(__dirname + '/../models/usuario.js');

let router = express.Router();



router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    let login = req.body.login;
    let password = req.body.password;

    Usuario.find().then((usuarios) => {

        let existeUsuario = usuarios.filter(usuario => usuario.login == login && usuario.password == password);
        if (existeUsuario.length > 0) {
            req.session.usuario = existeUsuario[0].login;
            res.redirect('/habitaciones');
        } else {
            res.render('login', {error: "Usuario o contraseña incorrectos"});
        }
    })
    
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;