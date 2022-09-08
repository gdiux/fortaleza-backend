const { response } = require('express');
const bcrypt = require('bcryptjs');

const Worker = require('../model/worker.model');

/** ======================================================================
 *  POST WORKER
=========================================================================*/
const createWorker = async(req, res = response) => {

    try {

        const { email, cedula, password } = req.body;

        const validateEmail = await Worker.findOne({ email });
        if (validateEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existen un trabajador con este correo electronico'
            });
        }

        const validateCedula = await Worker.findOne({ cedula });
        if (validateCedula) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existen un trabajador con este numero de Cedula de Ciudadania'
            });
        }

        const worker = new Worker(req.body);

        worker.email = worker.email.toLowerCase();

        // ENCRYPTAR PASSWORD
        const salt = bcrypt.genSaltSync();
        worker.password = bcrypt.hashSync(password, salt);


        // SAVE WORKER
        await worker.save();

        worker.password = '******';

        res.json({
            ok: true,
            worker
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
 *  PUT WORKER
=========================================================================*/
const updateWorker = async(req, res = response) => {

    try {

        const wid = req.params.id;

        // SEARCH USER
        const workerDB = await Worker.findById(wid);
        if (!workerDB) {
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
        const workerUpdate = await Worker.findByIdAndUpdate(wid, campos, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            worker: workerUpdate
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};

/** ======================================================================
 *  DELETE EXP WORKER
=========================================================================*/
const deleteExpWorker = async(req, res = response) => {

    try {

        const wid = req.wid;
        const _id = req.params.id;

        const expDel = await Worker.updateOne({ _id: wid }, { $pull: { skills: { _id } } });

        // VERIFICAR SI SE ACTUALIZO
        if (expDel.nModified === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No se pudo eliminar la habilidad o experiencia, porfavor intente de nuevo'
            });
        }

        // DEVOLVER LOS ARCHIVOS
        const worker = await Worker.findById(wid);

        res.json({
            ok: true,
            worker
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
    createWorker,
    updateWorker,
    deleteExpWorker
}