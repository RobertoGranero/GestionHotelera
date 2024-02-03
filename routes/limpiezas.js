const express = require('express');

let Limpieza = require(__dirname + '/../models/limpieza.js');
let Habitacion = require(__dirname + '/../models/habitacion.js');
const auth = require(__dirname + '/../utils/auth.js');

let router = express.Router();
router.get('/nueva/:id', (req, res) => {
    res.render('limpieza_nueva', {idHabitacion: req.params.id, fechaActual: Date.now()});
})
// Actualizar limpieza
router.post('/:id', auth.autenticacion, (req, res) => {

    let nuevaLimpieza = new Limpieza({
        idHabitacion: req.params.id,
        fechaHora: req.body.fechaHora,
        observaciones: req.body.observaciones
    });
    nuevaLimpieza.save().then(resultado => {
        Limpieza.findOne({ idHabitacion: req.params.id }).sort({ fechaHora: -1 }).then((resultado) => {
            if (resultado) {
                Habitacion.findByIdAndUpdate(req.params.id, {
                    $set: {
                        ultimaLimpieza: resultado.fechaHora,
                    }
                }, { new: true }).then(resultado => {
                    res.redirect(req.params.id);
    
    
                }).catch(error => {
                    res.render('error', { error: 'Error actualizando limpieza' });

                });
            }
    
        }).catch(error => {
            res.render('error', { error: 'Error actualizando limpieza' });

        });


    }).catch(error => {
        res.render('error', { error: 'Error añadiendo nueva limpieza' });

    });
});
// Obtener limpiezas de una habitacion
router.get('/:id', (req, res) => {
    Limpieza.find({idHabitacion: req.params.id}).sort({fechaHora: -1})
    .then(resultado => {
        const resultadoLimpieza = resultado;
        Habitacion.findById(req.params.id).then((resultadoId) => {
            res.render('limpiezas_listado', {limpiezas: resultadoLimpieza, habitacionNumero: resultadoId.numero, idHabitacion: req.params.id});

        })
    }).catch (error => {
        res.render('error', { error: 'No hay limpiezas registradas para esa habitacion' });
    }); 
});


module.exports = router;