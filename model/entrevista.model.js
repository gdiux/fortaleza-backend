const { Schema, model, connection } = require('mongoose');

const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(connection);

const EntrevistaSchema = Schema({

    control: {
        type: Number
    },
    enlace: {
        type: String
    },
    worker: {
        type: Schema.Types.ObjectId,
        ref: 'Workers',
    },
    confirm: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: false
    },
    cancel: {
        type: Boolean,
        default: false
    },
    day: {
        type: Date
    },
    fecha: {
        type: Date,
        default: Date.now
    },

});

EntrevistaSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();
    object.eid = _id;
    return object;

});

EntrevistaSchema.plugin(autoIncrement.plugin, {
    model: 'Entrevistas',
    field: 'control',
    startAt: 0
});

module.exports = model('Entrevistas', EntrevistaSchema);