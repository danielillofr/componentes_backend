const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let estadosValidos = {
    values: ['Solicitado', 'Comprado', 'No disponible', 'Homologado', 'Rechazado'],
    message: '{VALUE} no es un estado válido'
};

const logcomproSchema = new Schema({
    componente: {
        type: Schema.Types.ObjectId,
        ref: 'Prcomponente',
        required: [true, 'El componente es requerido']
    },
    autor: {
        type: String,
        required: [true, 'El autor es requerido']
    },
    fecha: {
        type: String,
        require: [true, 'La fecha es requerida']
    },
    estado: {
        type: String,
        enum: estadosValidos,
        default: 'Solicitado'
    }
})

logcomproSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('Logcompro', logcomproSchema)