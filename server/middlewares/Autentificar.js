const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')

let Autentificar = (req, res, next) => {
    let tokenRecibido = req.get('Authorization');
    if (!tokenRecibido) {
        return res.status(200).json({
            ok: false,
            errBaseDatos: false,
            err: 'No autorizado'
        });
    }
    jwt.verify(tokenRecibido, 'ClaveSecreta', (err, decoded) => {
        if (err) {
            return res.status(200).json({
                ok: false,
                errBaseDatos: true,
                err
            })
        }
        req.usuario = decoded.usuario;
        console.log(decoded);
    });
    next();
}

let AutentificarAdmin = (req, res, next) => {
    if (req.usuario.nombre != 'Administrator') {
        return res.status(200).json({
            ok: false,
            errBaseDatos: false,
            err: 'Esta tarea solo puede hacerla el administrador'
        })
    }
    next();
}

let AutentificarAdminOUser = (req, res, next) => {
    if ((req.usuario.nombre) == 'Administrator') {
        return next();
    }
    if (req.usuario._id == mongoose.Types.ObjectId(req.params.id)) {
        return next();
    }
    res.status(200).json({
        ok: false,
        errBaseDatos: false,
        err: 'Esta tarea solo puede hacerla el administrador o el propio usuario'
    })

}

module.exports = { Autentificar, AutentificarAdmin, AutentificarAdminOUser }