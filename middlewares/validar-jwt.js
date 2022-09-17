/**
 * VALIDATE JWT
 */

const { response } = require("express");
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {

    // READ TOKEN
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No existen token, debe de iniciar session'
        });
    }

    try {

        const { wid, bid } = jwt.verify(token, process.env.SECRET_SEED_JWT);

        if (wid) {
            req.wid = wid;
            next();
        } else {
            req.bid = bid;
            next();
        }


    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token invalido'
        });

    }

};

// JWT - WORKERS

const validarWorkerJWT = (req, res = response, next) => {

    // READ TOKEN
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No existen token, debe de iniciar session'
        });
    }

    try {

        const { wid } = jwt.verify(token, process.env.SECRET_SEED_JWT);

        req.wid = wid;
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token invalido'
        });

    }

};

// JWT - BUSSINESS

const validarBussinessJWT = (req, res = response, next) => {

    // READ TOKEN
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No existen token, debe de iniciar session'
        });
    }

    try {

        const { bid } = jwt.verify(token, process.env.SECRET_SEED_JWT);

        req.bid = bid;
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token invalido'
        });

    }

};


module.exports = {
    validarJWT,
    validarWorkerJWT,
    validarBussinessJWT

};