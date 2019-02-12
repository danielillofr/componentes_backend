const Movimiento = require('./../../models/homologaciones/movimiento');
const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const Componente = require('./../../models/homologaciones/componente');

const { Autentificar } = require('./../../middlewares/Autentificar');

const { Enviar_mail } = require('./../../utils/mail')

const { mailListModificacion, enviarEmail } = require('./../../config/maillists')

//Obtener un listado con todos los componentes. Cualquier usuario

app.get('/api/movimientos/:id', Autentificar, function(req, res) {
    if (!req.params.id) {
        return res.json({
            ok: false,
            errBaseDatos: false,
            err: 'Hay que indicar el componente'
        })
    }
    Movimiento.find({ componente: req.params.id }, (err, movimientosDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            movimientos: movimientosDB
        })
    })
})

//Creacion de un nuevo componente

app.post('/api/movimientos', Autentificar, (req, res) => {
    let body = req.body;
    if ((!body.componente) || (!body.almacen)) {
        return res.status(200).json({
            ok: false,
            errBaseDatos: false,
            err: 'Componente y almacen son requeridos'
        })
    }
    const f = new Date();
    const fechaMovimiento = f.getDate() + '/' + (f.getMonth() + 1) + '/' + f.getFullYear();
    let movimiento = new Movimiento({
        componente: body.componente,
        almacen: body.almacen,
        cantidad: body.cantidad,
        fechaMovimiento,
        autor: req.usuario.nombre,
        estado: body.estado,
        motivo: body.motivo
    })
    movimiento.save((err, movimientoDB) => {
        if (err) {
            return res.status(200).json({
                ok: false,
                errBaseDatos: true,
                err
            })
        }
        Componente.findById(body.componente, (err, componenteDB) => {
            if ((!err) && (body.almacen === '--')) {
                let Asunto = 'Cambio en el componente con referencia ' + componenteDB.referencia;

                let texto = req.usuario.nombre + ' ha modificado el estado del componente ' + componenteDB.referencia;


                let html = '<br>' + texto +
                    '<br>Referencia: ' + componenteDB.referencia +
                    '<br>Nuevo estado: ' + body.estado +
                    '<br>Motivo: ' + body.motivo;


                let mailOptions = {
                    from: 'Componentes',
                    to: mailListModificacion,
                    subject: Asunto,
                    html
                }

                if (enviarEmail) Enviar_mail(mailOptions);
            }
        })

        res.status(200).json({
            ok: true,
            movimiento: movimientoDB
        });
    });
})

module.exports = app;