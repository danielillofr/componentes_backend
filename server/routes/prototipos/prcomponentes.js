const Prcomponente = require('./../../models/prototipos/prcomponente');
const Logcompro = require('./../../models/prototipos/logcompro')
const express = require('express');
const app = express();
const { Enviar_mail } = require('./../../utils/mail');
const _ = require('underscore');

const { Autentificar } = require('./../../middlewares/Autentificar');

const { mailListModificacion, enviarEmail } = require('./../../config/maillists');

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
        const f = new Date();
        const fechaMovimiento = f.getDate() + '/' + (f.getMonth() + 1) + '/' + f.getFullYear();
        console.log('A grabar');

        let logcompro = new Logcompro({
            componente: prcomponenteDB._id,
            autor: req.usuario.nombre,
            fecha: fechaMovimiento,
            estado: 'Solicitado'
        });
        console.log('A grabar2');
        logcompro.save((err2, logcomproDB) => {
            console.log('Aqui no llega');
            if (err2) {
                console.log('No hay error', err2);
                return res.json({
                    err: true,
                    errBaseDatos: true,
                    err2
                })
            };
        });
        let Asunto = '';
        let texto = '';
        switch (prcomponenteDB.estado) {
            case 'Solicitado':
                {
                    Asunto = 'Solicitud de compra:' + prcomponenteDB.referencia;
                    texto = req.usuario.nombre + ' ha solicitado la compra del componente:' + prcomponenteDB.referencia;
                }
                break;
            case 'Comprado':
                {
                    Asunto = 'Componente comprado:' + prcomponenteDB.referencia;
                    texto = req.usuario.nombre + ' ha realizado la compra del componente:' + prcomponenteDB.referencia;
                }
                break;
            case 'No disponible':
                {
                    Asunto = 'Componente no disponible:' + prcomponenteDB.referencia;
                    texto = req.usuario.nombre + ' informa que el componente no está disponible. Componente:' + prcomponenteDB.referencia;
                }
                break;
            case 'Homologado':
                {
                    Asunto = 'Componente homologado:' + prcomponenteDB.referencia;
                    texto = req.usuario.nombre + ' ha homologoado el componente:' + prcomponenteDB.referencia;
                }
                break;
            case 'Rechazado':
                {
                    Asunto = 'Componente rechazado:' + prcomponenteDB.referencia;
                    texto = req.usuario.nombre + ' ha rechazado el componente:' + prcomponenteDB.referencia;
                }
                break;
            default:
                {

                }
        }

        let html = '<br>' + texto +
            '<br>Referencia: ' + prcomponenteDB.referencia +
            '<br>Estado: ' + prcomponenteDB.estado +
            '<br>Descripción: ' + prcomponenteDB.descripcion +
            '<br>Url:<a href=\'' + prcomponenteDB.url + '\'>' + prcomponenteDB.url + '</a>' +
            '<br>Cantidad: ' + prcomponenteDB.cantidad;



        let mailOptions = {
            from: 'Componentes',
            to: mailListModificacion,
            subject: Asunto,
            html
        }

        if (enviarEmail) Enviar_mail(mailOptions);
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
    Prcomponente.findByIdAndUpdate(req.params.id, body, (err, prcomponenteDB) => {
        if (err) {
            return res.json({
                ok: false,
                errBaseDatos: true,
                err
            })
        }
        console.log('Estado nuevo:', body.estado);
        console.log('Y era:', prcomponenteDB.estado);
        if ((body.estado) && ((body.estado) != (prcomponenteDB.estado))) { //Ha cambiado el estado
            const f = new Date();
            const fechaMovimiento = f.getDate() + '/' + (f.getMonth() + 1) + '/' + f.getFullYear();
            console.log('A grabar');

            let logcompro = new Logcompro({
                componente: req.params.id,
                autor: req.usuario.nombre,
                fecha: fechaMovimiento,
                estado: body.estado
            });
            console.log('A grabar2');
            logcompro.save((err2, logcomproDB) => {
                console.log('Aqui no llega');
                if (err2) {
                    console.log('No hay error', err2);
                    return res.json({
                        err: true,
                        errBaseDatos: true,
                        err2
                    })
                };
            })

            let Asunto = '';
            let texto = '';
            let estado = body.estado;
            let referencia = '';
            let descripcion = '';
            let url = '';
            let cantidad = '';

            //Hay que hacer una comprobación para el email, ya que el update devuelve el valor anterior, no el nuevo
            if (body.referencia) {
                referencia = body.referencia;
            } else {
                referencia = prcomponenteDB.referencia;
            }
            if (body.descripcion) {
                descripcion = body.descripcion;
            } else {
                descripcion = prcomponenteDB.descripcion;
            }
            if (body.url) {
                url = body.url;
            } else {
                url = prcomponenteDB.url;
            }
            if (body.cantidad) {
                cantidad = body.cantidad;
            } else {
                cantidad = prcomponenteDB.cantidad;
            }


            switch (body.estado) {
                case 'Solicitado':
                    {
                        Asunto = 'Solicitud de compra:' + referencia;
                        texto = req.usuario.nombre + ' ha solicitado la compra del componente:' + referencia;
                    }
                    break;
                case 'Comprado':
                    {
                        Asunto = 'Componente comprado:' + referencia;
                        texto = req.usuario.nombre + ' ha realizado la compra del componente:' + referencia;
                    }
                    break;
                case 'No disponible':
                    {
                        Asunto = 'Componente no disponible:' + referencia;
                        texto = req.usuario.nombre + ' informa que el componente no está disponible. Componente:' + referencia;
                    }
                    break;
                case 'Homologado':
                    {
                        Asunto = 'Componente homologado:' + referencia;
                        texto = req.usuario.nombre + ' ha homologoado el componente:' + referencia;
                    }
                    break;
                case 'Rechazado':
                    {
                        Asunto = 'Componente rechazado:' + referencia;
                        texto = req.usuario.nombre + ' ha rechazado el componente:' + referencia;
                    }
                    break;
                default:
                    {

                    }
            }

            let html = '<br>' + texto +
                '<br>Referencia: ' + referencia +
                '<br>Estado: ' + estado +
                '<br>Descripción: ' + descripcion +
                '<br>Url:<a href=\'' + url + '\'>' + url + '</a>';
            if ((body.estado === 'Solicitado') || (body.estado === 'Comprado')) {
                html = html + '<br>Cantidad: ' + cantidad;
            }


            html = html + '<br><br><a href=\'http://127.0.0.1:3000/modcompproy/' + prcomponenteDB.proyecto + '/' + prcomponenteDB._id + '\'>Acceda</a>';

            console.log(html);

            console.log(html);

            let mailOptions = {
                from: 'Componentes',
                to: mailListModificacion,
                subject: Asunto,
                html
            }

            if (enviarEmail) Enviar_mail(mailOptions);
        }
        res.json({
            ok: true,
            prcomponente: prcomponenteDB
        })
    })
})

module.exports = app;