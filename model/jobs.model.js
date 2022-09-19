const { Schema, model, connection } = require('mongoose');

const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(connection);

const JobSchema = Schema({

    control: {
        type: Number
    },
    name: {
        type: String,
        require: true
    },
    description: {
        type: String
    },
    sueldo: {
        type: Number
    },
    bussiness: {
        type: Schema.Types.ObjectId,
        ref: 'Bussiness',
        require: true
    },
    worker: {
        type: Schema.Types.ObjectId,
        ref: 'Workers',
    },
    status: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        default: 'Pendiente'
    },
    fechain: {
        type: Date
    },
    fechaout: {
        type: Date
    },
    fecha: {
        type: Date,
        default: Date.now
    },

});

JobSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();
    object.jid = _id;
    return object;

});

JobSchema.plugin(autoIncrement.plugin, {
    model: 'Jobs',
    field: 'control',
    startAt: 0
});

module.exports = model('Jobs', JobSchema);