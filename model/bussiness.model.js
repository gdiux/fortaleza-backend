const { Schema, model } = require('mongoose');

const bussinessSchema = Schema({

    name: {
        type: String,
        require: true
    },
    nit: {
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

    confirm: {
        type: Boolean,
        default: false
    },
    bussiness: {
        type: Boolean,
        default: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }

});

bussinessSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();
    object.bid = _id;
    return object;

});

module.exports = model('Bussiness', bussinessSchema);