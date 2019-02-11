const Logcompro = require('./../../models/prototipos/logcompro');
const express = require('express');
const app = express();

const _ = require('underscore');

const { Autentificar } = require('./../../middlewares/Autentificar');

app.get('/api/logcompro/:id', Autentificar, (req, res) => {
    if (!req.params.id) {
        return res.json({
            ok: false,
            errBaseDatos: false,
            err: 'Hay que indicar el componente'
        })
    }
    Logcompro.find({ componente: req.params.id }, (err, logs) => {
        if (err) {
            return res.json({
                ok: false,
                errBaseDatos: true,
                err
            })
        }
        res.json({
            ok: true,
            logs
        })
    })
})



app.post('/api/logcompro', Autentificar, (req, res) => {
    const body = req.body;
    if ((!body.componente) || (!body.autor) || (!body.fecha) || (!body.estado)) {
        return res.json({
            ok: false,
            errBaseDatos: false,
            err: 'Faltan campos requeridos'
        })
    }
    const logcompro = new Logcompro({
        componente: body.componente,
        autor: body.autor,
        fecha: body.fecha,
        estado: body.estado
    });
    logcompro.save((err, logcompro) => {
        if (err) {
            return res.json({
                err: true,
                errBaseDatos: true,
                err
            })
        };
        return res.json({
            ok: true,
            logcompro
        })
    })
})

module.exports = app;