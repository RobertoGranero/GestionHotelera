const express = require('express');
const multer = require('multer');

let Habitacion = require(__dirname + '/../models/habitacion.js');
let Limpieza = require(__dirname + '/../models/limpieza.js');
const auth = require(__dirname + '/../utils/auth.js');

let router = express.Router();
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/habitaciones')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname)
    }
  })

let upload = multer({storage: storage});

let storageIncidencia = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/incidencias')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname)
    }
  })

let uploadIncidencia = multer({storage: storageIncidencia});

router.get('/nueva',auth.autenticacion, (req, res) => {
    res.render('habitaciones_nueva');
})
router.get('/editar/:id', auth.autenticacion, (req, res) => {
    Habitacion.findById(req.params.id).then(resultado => {
        if (resultado) {
            res.render('habitaciones_edicion', {idHabitacion: req.params.id, habitacion: resultado});
        } else {
            res.render('error', {error: "Habitacion no encontrada"});
        }
    }).catch(error => {
        res.render('error', {error: "Habitacion no encontrado"});
    });
})

// Obtener una lista de todas las habitaciones
router.get('/', (req, res) => {
    Habitacion.find().then(resultado => {
        res.render('habitaciones_listado', {habitaciones: resultado});

    }).catch(error => {
        res.render('error', { error: 'Error listando habitaciones' });

    });
});

// Obtener detalles de una habitacion especifica
router.get('/:id', (req, res) => {
    Habitacion.findById(req.params.id).then(resultado => {
        if(resultado){
            res.render('habitaciones_ficha', {habitacion: resultado});
        }
        else{
            res.render('error', { error: 'No existe el numero de habitacion' });    
        }

    }).catch(error => {
        res.render('error', { error: 'No existe el numero de habitacion' });

    });
});

// Actualizar los datos de una habitacion

router.post('/edicion/:id', upload.single('imagen'), (req, res) => {
    // Buscamos el libro y cambiamos sus datos
    Habitacion.findById(req.params.id).then(resultado => {
        if (resultado)
        {
            resultado.numero = req.body.numero;
            resultado.tipo = req.body.tipo;
            resultado.descripcion = req.body.descripcion;
            resultado.precio = req.body.precio;

            if(req.file) resultado.imagen = req.file.filename;

            resultado.save().then(resultado2 => {
                res.redirect(req.baseUrl);
            }).catch(error => {
                let errores = {
                    general: 'Error insertando libro'
                };
                if(error.errors.numero)
                {
                    errores.numero = error.errors.numero.message;
                }
                if(error.errors.descripcion)
                {
                    errores.descripcion = error.errors.descripcion.message;
                }
                if(error.errors.precio)
                {
                    errores.precio = error.errors.precio.message;
                }
        
                res.render('habitaciones_edicion', {errores: errores, datos: req.body});

            });        
        }
        else    
            res.render('error', {error: "Libro no encontrado"});
    }).catch (error => {
        res.render('error', {error: "Error editando libro"});
    }); 
});




// Insertar una habitacion
router.post('/', upload.single('imagen'), auth.autenticacion, (req, res) => {
    let nuevaHabitacion = new Habitacion({
        numero: req.body.numero,
        tipo: req.body.tipo,
        descripcion: req.body.descripcion,
        ultimaLimpieza: req.body.ultimaLimpieza,
        precio: req.body.precio
    });
    if(req.file) nuevaHabitacion.imagen = req.file.filename;

    nuevaHabitacion.save().then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        let errores = {
            general: 'Error insertando libro'
        };
        if(error.errors.numero)
        {
            errores.numero = error.errors.numero.message;
        }
        if(error.errors.descripcion)
        {
            errores.descripcion = error.errors.descripcion.message;
        }
        if(error.errors.precio)
        {
            errores.precio = error.errors.precio.message;
        }

        res.render('habitaciones_nueva', {errores: errores, datos: req.body});

    });
});


// Eliminar una habitacion
router.delete('/:id', auth.autenticacion, (req, res) => {
    Habitacion.findByIdAndDelete(req.params.id)
        .then(resultado => {
            res.redirect(req.baseUrl);
        }).catch(error => {
            res.render('error', {error: "Error borrando contacto"});
        });
});

// Añadir una incidencia en una habitacion
router.post('/:id/incidencias', uploadIncidencia.single('imagenIncidencia'), auth.autenticacion, (req, res) => {

    let incidenciaNueva = {
        "descripcion": req.body.descripcion,
    }
    if(req.file) incidenciaNueva.imagen = req.file.filename;
    

    Habitacion.findById(req.params.id).then((resultado) => {
        resultado.incidencias.push(incidenciaNueva);

        resultado.save().then((result) => {
            res.redirect("/habitaciones/"+req.params.id);

        }).catch((err) => {
            res.render('error', { error: 'No existe el numero de habitacion' });
        });

    }).catch((error) => {
        res.render('error', { error: 'No existe el numero de habitacion' });
    })
});

// Actualizar el estado de una incidencia de una habitacion

router.post('/:idH/incidencias/:idI', (req, res) => {
    Habitacion.findById(req.params.idH).then((resultado) => {
        resultado.incidencias.forEach((p) => {
            if (req.params.idI === p.id) {
                p.fechaFin = new Date();
                resultado.save().then((result) => {
                    res.redirect("/habitaciones/"+req.params.idH);
                }).catch((err) => {
                    res.render('error', { error: 'Error cerrando la habitacion' });
                });

            }
        });

    }).catch((error) => {
        res.render('error', { error: 'Error cerrando la habitacion' });
    })

})

module.exports = router;
