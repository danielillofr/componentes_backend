const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

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
    }
})

movimientoSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('Movimiento', movimientoSchema)