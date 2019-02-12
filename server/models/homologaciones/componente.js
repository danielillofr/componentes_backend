const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let estadosValidos = {
    values: ['SOLICITADA', 'HOMOLOGANDO', 'RECHAZADA', 'HOMOLOGADA', 'NO_APLICA'],
    message: '{VALUE} no es un estado válido'
}

let urgenciasValidas = {
    values: ['MUY URGENTE', 'URGENTE', 'NECESARIO', 'MEJORA'],
    message: '{VALUE} no es una urgencia válida'
}

const componenteSchema = new Schema({
    referencia: {
        type: String,
        default: 'Sin referencia'
            // required: [true, 'La referencia es obligatorio'],
            // unique: true
    },
    fabricante: {
        type: String,
        default: 'Sin fabricante'
            // required: [true, 'El fabricante es obligatorio']
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
        default: '0'
            // required: [true, 'La referencia es obligatorio']
    },
    estado: {
        type: String,
        default: 'SOLICITADA',
        enum: estadosValidos
    },
    urgencia: {
        type: String,
        default: 'URGENTE',
        enum: urgenciasValidas
    },
    motivo: {
        type: String,
        required: [true, 'El motivo es requerido']
    },
    codAirzone: {
        type: String,
        default: ''
    }
})

componenteSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('Componente', componenteSchema)