const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let estadosValidos = {
    values: ['SOLICITADA', 'HOMOLOGANDO', 'RECHAZADA', 'HOMOLOGADA', 'NO_APLICA'],
    message: '{VALUE} no es un estado válido'
}

const componenteSchema = new Schema({
    referencia: {
        type: String,
        required: [true, 'La referencia es obligatorio'],
        unique: true
    },
    fabricante: {
        type: String,
        required: [true, 'El fabricante es obligatorio']
    },
    descripcion: {
        type: String,
        required: false
    },
    fechaEntrada: {
        type: String,
        required: [true, 'La referencia es obligatorio']
    },
    cantidad: {
        type: Number,
        required: [true, 'La referencia es obligatorio']
    },
    estado: {
        type: String,
        default: 'SOLICITADA',
        enum: estadosValidos
    }
})

componenteSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('Componente', componenteSchema)