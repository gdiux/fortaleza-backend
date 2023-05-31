const { response } = require('express');
const bcrypt = require('bcryptjs');

const path = require('path');

const fs = require('fs');

const { generarJWT, generarWorkerJWT, generarBussinessJWT } = require('../helpers/jwt');

const Worker = require('../model/worker.model');
const { sendMail } = require('../helpers/send-mail');

/** ======================================================================
 *  POST WORKER
=========================================================================*/
const createWorker = async(req, res = response) => {

    try {

        const { email, cedula, password, name } = req.body;

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
        worker.email = worker.email.trim();

        // ENCRYPTAR PASSWORD
        const salt = bcrypt.genSaltSync();
        worker.password = bcrypt.hashSync(password, salt);


        // SAVE WORKER
        await worker.save();

        worker.password = '******';

        // EMAIL DE BIENVENIDA ======================================================

        const msg = 'Se ha enviado un correo electronico a su email con la nueva contraseña';
        const subject = 'Bienvenido'; // Subject line
        const html = `<div style="box-sizing:border-box;margin:0;font-family: Montserrat,-apple-system,BlinkMacSystemFont;font-size:1rem;font-weight:400;line-height:1.5;text-align:left;background-color:#fff;color:#333">
                <div class="adM">
                    <center>
                        <img src="https://grupofortalezasas.com/assets/img/logo/logo.webp" style="max-width: 250px;">
                    </center>
                </div>
                <div style="box-sizing:border-box;width:100%;padding-right:15px;padding-left:15px;margin-right:auto;margin-left:auto;max-width:620px">
                    <div class="adM">
                    </div>
                    <div style="box-sizing:border-box;display:-webkit-box;display:-ms-flexbox;display:flex">
                        <div class="adM">
                        </div>
                        <div style="box-sizing:border-box;width:100%;min-height:1px;padding-right:15px;padding-left:15px;text-align:center;padding-top:20px">
    
                        </div>
                    </div>
                    <div style="box-sizing:border-box;display:-webkit-box;display:-ms-flexbox;display:flex">
                        <div style="box-sizing:border-box;width:100%;min-height:1px;padding-right:15px;padding-left:15px;margin-top:40px;padding:20px 0;background-color:#2d2d2d;color:#fff">
                            <h2 style="box-sizing:border-box;margin-top:0;margin-bottom:.5rem;font-family:inherit;font-weight:500;line-height:1.2;color:inherit;font-size:2rem;text-align:center!important">Bienvenido (a)</h2>
                        </div>
                    </div>
                    <div style="box-sizing:border-box;display:-webkit-box;display:-ms-flexbox;display:flex">
                        <div style="box-sizing:border-box;width:100%;min-height:1px;padding-right:15px;padding-left:15px;text-align:center">
                            <h3 style="text-transform: capitalize; box-sizing:border-box;margin-top:0;margin-bottom:.5rem;font-family:inherit;font-weight:500;line-height:1.2;color:inherit;font-size:2rem;margin:20px 0">Hola, ${name}</h3>
                            <h5 style="box-sizing:border-box;margin-top:0;margin-bottom:.5rem;font-family:inherit;font-weight:500;line-height:1.2;color:inherit;font-size:1.25rem;margin:20px 0">Gracias por registrate en nuestra plataforma</h5>
                            <div style="box-sizing:border-box;display:-webkit-box;display:-ms-flexbox;display:flex">
                                <div style="box-sizing:border-box;width:100%;min-height:1px;padding-right:15px;padding-left:15px;text-align:center">
                                </div>
                            </div>
                            <p style="box-sizing:border-box;margin-top:0;margin-bottom:1rem">Eres importante para nosotros, nos gustaria que actualizaras toda la información para ser parte de nuestros colaboradores </p>
                            <a href="https://grupofortalezasas.com/portal/trabajadores" style="box-sizing:border-box;text-decoration:none;display:inline-block;font-weight:400;text-align:center;white-space:nowrap;vertical-align:middle;border:1px solid transparent;color:#fff;line-height:1.5;margin:10px;border-radius:30px;background-color:#009BE0;border-color:#009BE0;font-size:0.95rem;padding:15px 20px"
                                target="_blank">Inciar sesion ahora</a>
                            <p style="box-sizing:border-box;margin-top:0;margin-bottom:1rem">tambien puedes copiar este enlace en tu URL</p>
                            <p> https://grupofortalezasas.com/portal/trabajadores</p>
                        </div>
                    </div>
                    <div style="box-sizing:border-box;display:-webkit-box;display:-ms-flexbox;display:flex">
                        <div style="box-sizing:border-box;width:100%;min-height:1px;padding-right:15px;padding-left:15px;margin:40px 0;text-align:center">
                            <p style="box-sizing:border-box;margin-top:0;margin-bottom:1rem">Si esta solicitud se ha enviado sin su consentimiento, puede ignorar este correo electrónico ó eliminarlo. </p>
                        </div>
                    </div>
    
                </div>
                </div>`;

        const send_mail = await sendMail(email, subject, html, msg);

        const token = await generarWorkerJWT(worker._id);

        res.json({
            ok: true,
            worker,
            token
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

/** ======================================================================
 *  DOWN LOAD ZIP ALL FILES
=========================================================================*/
const zipAllWorker = async(req, res = response) => {

    try {

        const wid = req.params.wid;
        // SEARCH USER
        const worker = await Worker.findById(wid);
        if (!worker) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningun usuario con este ID'
            });
        };
        // SEARCH USER

        let filesWorker = [];

        for (let i = 0; i < worker.attachments.length; i++) {

            const nameShort = worker.attachments[i].attachment.split('.');
            const extFile = nameShort[nameShort.length - 1];

            filesWorker.push({
                path: path.join(__dirname, `../uploads/archivos/${worker.attachments[i].attachment}`),
                name: `${worker.attachments[i].desc}.${extFile}`
            })

        };

        res.zip({
            files: filesWorker,
            filename: `${worker.name}.zip`
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
 *  ADD SKILL WORKER
=========================================================================*/
const addSkill = async(req, res = response) => {

    try {

        const wid = req.params.id;
        const skill = req.body;

        // SEARCH USER
        const worker = await Worker.findById(wid);
        if (!worker) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningun usuario con este ID'
            });
        };
        // SEARCH USER

        worker.skills.push(JSON.parse(skill.skill));

        await worker.save();

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

/** ======================================================================
 *  DELETE SKILL WORKER
=========================================================================*/
const delSkill = async(req, res = response) => {

    try {

        const wid = req.params.wid;
        const skill = req.params.skill;

        // SEARCH USER
        const workerDB = await Worker.findById(wid);
        if (!workerDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningun usuario con este ID'
            });
        };
        // SEARCH USER

        const deleteSkill = await Worker.updateOne({ _id: wid }, { $pull: { skills: { _id: skill } } });

        // VERIFICAR SI SE ACTUALIZO
        if (deleteSkill.nModified === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No se pudo eliminar el skill, porfavor intente nuevamente'
            });
        }

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
    deleteExpWorker,
    zipAllWorker,
    addSkill,
    delSkill
}