const Proyecto = require('./../../models/prototipos/proyecto');
const Prcomponente = require('./../../models/prototipos/prcomponente');
const express = require('express');
const app = express();

const _ = require('underscore');

const { Autentificar } = require('./../../middlewares/Autentificar');

app.get('/api/proyectos', Autentificar, (req, res) => {
    Proyecto.find({}, (err, proyectosDB) => {
        if (err) {
            console.log(err);
            return res.json({
                ok: false,
                errBaseDatos: true,
                err
            })
        }
        res.json({
            ok: true,
            proyectos: proyectosDB
        })
    })
})

app.post('/api/proyectos', Autentificar, (req, res) => {
    const body = req.body;
    if (!body.nombre) {
        return res.json({
            ok: false,
            errBaseDatos: false,
            err: 'El nombre del proyecto es requerido'
        })
    }
    const proyecto = new Proyecto({
        nombre: body.nombre
    });
    proyecto.save((err, proyectoDB) => {
        if (err) {
            return res.json({
                ok: false,
                errBaseDatos: true,
                err
            })
        }
        res.json({
            ok: true,
            proyecto: proyectoDB
        })
    })
})

app.put('/api/proyectos/:id', Autentificar, (req, res) => {
    const body = _.pick(req.body, ['codLista']);
    Proyecto.findByIdAndUpdate(req.params.id, body, { new: true }, (err, proyectoDB) => {
        if (err) {
            return res.json({
                ok: false,
                errBaseDatos: true,
                err
            })
        }
        res.json({
            ok: true,
            proyecto: proyectoDB
        })
    })
})

app.delete('/api/proyectos/:id', Autentificar, (req, res) => {
    Proyecto.findByIdAndDelete(req.params.id, (err, proyectoDB) => {
        if (err) {
            return res.json({
                ok: false,
                errBaseDatos: true,
                err
            })
        }
        if (!proyectoDB) {
            return res.json({
                ok: false,
                errBaseDatos: false,
                err: 'Proyecto no encontrado'
            })
        }
        //Ahora borramos los componentes del proyecto

        Prcomponente.deleteMany({ proyecto: req.params.id }, (err) => {
            if (err) {
                return res.json({
                    ok: false,
                    errBaseDatos: true,
                    err
                })
            }
            res.json({
                ok: true
            })
        })
    })
})

module.exports = app;