/**
 * JWT
 */

const jwt = require('jsonwebtoken');

// GENERAR JWT WORKER

const generarWorkerJWT = (wid) => {

    return new Promise((resolve, reject) => {

        const payload = {
            wid
        };

        jwt.sign(payload, process.env.SECRET_SEED_JWT, {
            expiresIn: '72h'
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }

        });
    });

};

// GENERAR JWT BUSSINESS

const generarBussinessJWT = (bid) => {

    return new Promise((resolve, reject) => {

        const payload = {
            bid
        };

        jwt.sign(payload, process.env.SECRET_SEED_JWT, {
            expiresIn: '72h'
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }

        });
    });

};

module.exports = {
    generarWorkerJWT,
    generarBussinessJWT
};