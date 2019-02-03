const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const proyectoSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El proyecto debe tener un nombre']
    },
    codLista: {
        type: String,
        default: ''
    }
});

proyectoSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('Proyecto', proyectoSchema)