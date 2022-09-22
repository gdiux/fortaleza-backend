const { response } = require('express');
const { sendMail } = require('../helpers/send-mail');

const Entrevista = require('../model/entrevista.model');

/** ======================================================================
 *  GET ENTREVISTAS FOR WORKER
=========================================================================*/
const getEntrevistasWorker = async(req, res = response) => {

    try {

        const worker = req.params.worker;

        const entrevistas = await Entrevista.find({ worker })
            .populate('worker', 'name cedula email phone address wid img');

        res.json({
            ok: true,
            entrevistas
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
 *  PUT ENTREVISTAS
=========================================================================*/
const updateEntrevista = async(req, res = response) => {

    try {

        const eid = req.params.id;

        // SEARCH ENTREVISTA
        const entrevistaDB = await Entrevista.findById(eid);
        if (!entrevistaDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ninguna entrevista este ID'
            });
        }
        // SEARCH ENTREVISTA

        const {...campos } = req.body;

        // UPDATE
        const entrevistaUpdate = await Entrevista.findByIdAndUpdate(eid, campos, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            entrevista: entrevistaUpdate
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
    getEntrevistasWorker,
    updateEntrevista,
}