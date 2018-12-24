const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let estadosValidos = {
    values: ['SOLICITADA', 'HOMOLOGANDO', 'RECHAZADA', 'HOMOLOGADA', 'NO_APLICA'],
    message: '{VALUE} no es un estado válido'
}

const movimientoSchema = new Schema({
    componente: {
        type: Schema.Types.ObjectId,
        ref: 'Componente',
        required: [true, 'El componente es requerido']
    },
    almacen: {
        type: String,
        required: [true, 'El almacén es obligatorio']
    },
    cantidad: {
        type: String,
        required: [true, 'La cantidad es obligatoria']
    },
    fechaMovimiento: {
        type: String,
        require: [true, 'La fecha es requerida']
    },
    autor: {
        type: String,
        require: [true, 'El autor es requerido']
    },
    estado: {
        type: String,
        default: 'SOLICITADA',
        enum: estadosValidos
    }
})

movimientoSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('Movimiento', movimientoSchema)