const Prcomponente = require('./../../models/prototipos/prcomponente');
const express = require('express');
const app = express();

const _ = require('underscore');

const { Autentificar } = require('./../../middlewares/Autentificar');

app.get('/api/prcomponentes', Autentificar, (req, res) => {
    console.log('Sin ID');
    Prcomponente.find({}, (err, prcomponentes) => {
        if (err) {
            return res.json({
                ok: false,
                errBaseDatos: true,
                err
            })
        };
        res.json({
            ok: true,
            prcomponentes
        })
    })
})

app.get('/api/prcomponentes/:id', Autentificar, (req, res) => {
    console.log('Con ID');
    const id = req.params.id;
    console.log('ID:', id);
    Prcomponente.findById(id, (err, prcomponente) => {
        if (err) {
            return res.json({
                ok: false,
                errBaseDatos: true,
                err
            })
        };
        res.json({
            ok: true,
            prcomponente
        })
    })
})

app.get('/api/prcomponentes/proyecto/:proyecto', Autentificar, (req, res) => {
    const proyecto = req.params.proyecto;
    Prcomponente.find({ proyecto }, (err, prcomponentes) => {
        if (err) {
            return res.json({
                ok: false,
                errBaseDatos: true,
                err
            })
        }
        res.json({
            ok: true,
            prcomponentes
        })
    })

})

app.post('/api/prcomponentes', Autentificar, (req, res) => {
    const body = req.body;
    if ((!body.proyecto) || (!body.referencia) || (!body.descripcion)) {
        return res.json({
            ok: false,
            errBaseDatos: false,
            err: 'Proyecto, referencia y descripción requeridos'
        })
    }
    const prcomponente = new Prcomponente({
        proyecto: body.proyecto,
        referencia: body.referencia,
        url: body.url,
        cantidad: body.cantidad,
        descripcion: body.descripcion
    });

    prcomponente.save((err, prcomponenteDB) => {
        if (err) {
            return res.json({
                ok: false,
                errBaseDatos: true,
                err
            })
        }
        res.json({
            ok: true,
            prcomponente: prcomponenteDB
        })
    })

})

app.delete('/api/prcomponentes/:id', Autentificar, (req, res) => {
    Prcomponente.findByIdAndDelete(req.params.id, (err, prcomponenteDB) => {
        if (err) {
            return res.json({
                ok: false,
                errBaseDatos: true,
                err
            })
        }
        if (!prcomponenteDB) {
            return res.json({
                ok: false,
                errBaseDatos: false,
                err: 'Componente no encontrado'
            })
        }
        res.json({
            ok: true,
            prcomponente: prcomponenteDB
        })
    })
})

app.put('/api/prcomponentes/:id', Autentificar, (req, res) => {
    const body = _.pick(req.body, ['referencia', 'url', 'estado', 'cantidad', 'descripcion', 'codAirzone']);
    Prcomponente.findByIdAndUpdate(req.params.id, body, { new: true }, (err, prcomponenteDB) => {
        if (err) {
            return res.json({
                ok: false,
                errBaseDatos: true,
                err
            })
        }
        res.json({
            ok: true,
            prcomponente: prcomponenteDB
        })
    })
})

module.exports = app;