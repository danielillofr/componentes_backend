const Componente = require('./../../models/homologaciones/componente');
const Movimiento = require('./../../models/homologaciones/movimiento');
const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const { Enviar_mail } = require('./../../utils/mail');

const { mailListCrear } = require('./../../config/maillists')

const { Autentificar } = require('./../../middlewares/Autentificar');

//Obtener un listado con todos los componentes. Cualquier usuario

app.get('/api/componentes', Autentificar, function(req, res) {
    Componente.find({}, (err, componentesDB) => {
        if (err) {
            return res.status(200).json({
                ok: false,
                errBaseDatos: true,
                err
            })
        }
        res.status(200).json({
            ok: true,
            componentes: componentesDB
        })
    })
})

app.get('/api/componentes/:id', Autentificar, function(req, res) {
    if (!req.params.id) {
        return res.json({
            ok: false,
            err: 'Hay que indicar el componente'
        })
    }

    Componente.findById(req.params.id, (err, componente) => {
        if (err) {
            return res.status(200).json({
                ok: false,
                errBaseDatos: true,
                err
            })
        }
        res.status(200).json({
            ok: true,
            componente
        })
    })
})



//Creacion de un nuevo componente

app.post('/api/componentes', Autentificar, (req, res) => {
    let body = req.body;
    if ((!body.referencia) || (!body.fabricante) || (!body.fechaEntrada) || (!body.cantidad)) {
        return res.status(200).json({
            ok: false,
            errBaseDatos: false,
            err: 'Referencia, fabricante, fecha de entrada y cantidad'
        })
    }
    let componente = new Componente({
        referencia: body.referencia,
        fabricante: body.fabricante,
        descripcion: body.descripcion,
        fechaEntrada: body.fechaEntrada,
        cantidad: body.cantidad,
        estado: body.estado,
        urgencia: body.urgencia,
        motivo: body.motivo,
        codAirzone: body.codAirzone
    })
    componente.save((err, componenteDB) => {
        if (err) {
            return res.status(200).json({
                ok: false,
                errBaseDatos: true,
                err
            })
        }

        let Asunto = 'Nuevo componente con referencia ' + body.referencia + ' creado con el estado ' + body.estado;

        let texto = req.usuario.nombre + ' ha creado el componente con referencia ' + body.referencia + ' y el estado ' + body.estado;

        let html = '<br>' + texto +
            '<br>Referencia: ' + componente.referencia +
            '<br>Fabricante: ' + componente.fabricante +
            '<br>Estado: ' + componente.estado +
            '<br>Urgencia: ' + componente.urgencia +
            '<br>Motivo: ' + componente.motivo +
            '<br>Código Airzone: ' + componente.codAirzone;


        let mailOptions = {
            from: 'Componentes',
            to: mailListCrear,
            subject: Asunto,
            html
        }

        Enviar_mail(mailOptions);

        res.status(200).json({
            ok: true,
            componente: componenteDB
        });
    });
})

//Eliminar un componente. Esto solo lo puede hacer el Administrador

app.delete('/api/componentes/:id', Autentificar, (req, res) => {
    let params = req.params;
    if (!params.id) {
        return res.status(200).json({
            ok: false,
            errBaseDatos: false,
            err: 'Debe indicar el id del componente'
        })
    }
    Componente.findByIdAndRemove(params.id, (err, componenteDB) => {
        if (err) { //Error al leer en la base de datos
            return res.status(200).json({
                ok: false,
                errBaseDatos: true,
                err
            })
        }
        if (!componenteDB) { //Error al leer en la base de datos
            return res.status(200).json({
                ok: false,
                errBaseDatos: false,
                err: 'No hay componente con ese ID en la base de datos'
            })
        }
        Movimiento.deleteMany({ componente: componenteDB._id }, (err) => {
            if (err) {
                return res.json({
                    ok: false,
                    errBaseDatos: true,
                    err
                })
            }
        })
        res.status(200).json({
            ok: true,
            componente: componenteDB
        })
    })
})

//Actualizar usuario
app.put('/api/componentes/:id', Autentificar, (req, res) => {
    let body = req.body;
    let id = req.params.id;
    body = _.pick(body, ['estado']); //Solo se puede modificar el estado
    Componente.findByIdAndUpdate(id, body, { new: true }, (err, componenteDB) => {
        if (err) {
            return res.status(200).json({
                ok: false,
                errBaseDatos: true,
                err
            })
        }

        res.status(200).json({
            ok: true,
            componente: componenteDB
        })
    })
})

module.exports = app;