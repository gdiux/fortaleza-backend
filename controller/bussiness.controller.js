const { response } = require('express');
const bcrypt = require('bcryptjs');

const path = require('path');

const fs = require('fs');

const Bussiness = require('../model/bussiness.model');

/** ======================================================================
 *  POST BUSSINESS
=========================================================================*/
const createBussiness = async(req, res = response) => {

    try {

        const { email, nit, password } = req.body;

        const validateEmail = await Bussiness.findOne({ email });
        if (validateEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existen una Empresa registrada con este correo electronico'
            });
        }

        const validateNit = await Bussiness.findOne({ nit });
        if (validateNit) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existen una Empresa con este numero de Nit ó Cedula de Ciudadania'
            });
        }

        const bussiness = new Bussiness(req.body);

        bussiness.email = bussiness.email.toLowerCase();

        // ENCRYPTAR PASSWORD
        const salt = bcrypt.genSaltSync();
        bussiness.password = bcrypt.hashSync(password, salt);


        // SAVE WORKER
        await bussiness.save();

        bussiness.password = '******';

        res.json({
            ok: true,
            bussiness
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

}

/** ======================================================================
 *  PUT BUSSINESS
=========================================================================*/
const updateBussiness = async(req, res = response) => {

    try {

        const bid = req.params.id;

        // SEARCH USER
        const bussinessDB = await Bussiness.findById(bid);
        if (!bussinessDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningun usuario con este ID'
            });
        }
        // SEARCH USER

        // VALIDATE USER
        const { password, ...campos } = req.body;


        if (password) {
            // ENCRYPTAR PASSWORD
            const salt = bcrypt.genSaltSync();
            campos.password = bcrypt.hashSync(password, salt);
        }

        // UPDATE
        const bussinessUpdate = await Bussiness.findByIdAndUpdate(bid, campos, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            bussiness: bussinessUpdate
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};


// EXPORTS
module.exports = {
    createBussiness,
    updateBussiness
}