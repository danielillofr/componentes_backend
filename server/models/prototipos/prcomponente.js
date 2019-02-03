const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let estadosValidos = {
    values: ['Solicitado', 'Comprado', 'No disponible', 'Homologado', 'Rechazado'],
    message: '{VALUE} no es un estado válido'
};

const prcomponenteSchema = new Schema({
    proyecto: {
        type: String
    },
    referencia: {
        type: String,
        unique: true,
        required: [true, 'La referencia es obligatorio']
    },
    url: {
        type: String,
        default: ''
    },
    cantidad: {
        type: String,
        default: '0'
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    estado: {
        type: String,
        enum: estadosValidos,
        default: 'Solicitado'
    },
    codAirzone: {
        type: String,
        default: ''
    }
});

prcomponenteSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('Prcomponente', prcomponenteSchema)