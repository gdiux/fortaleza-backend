const { Schema, model } = require('mongoose');

const Attachments = Schema({
    attachment: {
        type: String
    },
    fecha: {
        type: Date
    }
});

const WorkerSchema = Schema({

    name: {
        type: String,
        require: true
    },
    cedula: {
        type: String,
    },
    phone: {
        type: String
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    department: {
        type: String
    },
    zip: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    img: {
        type: String
    },
    attachments: [Attachments],
    type: {
        type: String,
        default: 'Aspirante'
    },
    fecha: {
        type: Date,
        default: Date.now
    }

});

WorkerSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();
    object.wid = _id;
    return object;

});

module.exports = model('Workers', WorkerSchema);