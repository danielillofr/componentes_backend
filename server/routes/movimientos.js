const Movimiento = require('./../models/movimiento');
const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const { Autentificar } = require('./../middlewares/Autentificar');

//Obtener un listado con todos los componentes. Cualquier usuario

app.get('/api/movimientos/:id', Autentificar, function(req, res) {
    if (!req.params.id) {
        return res.json({
            ok: false,
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
    if ((!body.componente) || (!body.almacen) || (!body.cantidad)) {
        return res.status(200).json({
            ok: false,
            errBaseDatos: false,
            err: 'Componente, almacen y cantidad son requeridos'
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
        res.status(200).json({
            ok: true,
            movimiento: movimientoDB
        });
    });
})

module.exports = app;