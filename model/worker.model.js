const { Schema, model } = require('mongoose');

const Attachments = Schema({
    attachment: {
        type: String
    },
    type: {
        type: String
    },

    tipo: {
        type: String
    },

    parentesco: {
        type: String
    },

    numero: {
        type: String
    },

    beneficiario: {
        type: String
    },

    desc: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

const Skills = Schema({
    name: {
        type: String
    },
    years: {
        type: Number
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

const WorkerSchema = Schema({

    name: {
        type: String,
        require: true
    },
    cedula: {
        type: String,
        unique: true
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
    barrio: {
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
    description: {
        type: String
    },

    attachments: [Attachments],

    confirm: {
        type: Boolean,
        default: false
    },

    skills: [Skills],
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