/**
 * JWT
 */

const jwt = require('jsonwebtoken');



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

module.exports = {
    generarWorkerJWT
};