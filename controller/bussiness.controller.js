const { response } = require('express');
const bcrypt = require('bcryptjs');

const path = require('path');

const fs = require('fs');

const Bussiness = require('../model/bussiness.model');
const { sendMail } = require('../helpers/send-mail');

/** ======================================================================
 *  POST BUSSINESS
=========================================================================*/
const createBussiness = async(req, res = response) => {

    try {

        const { email, nit, password, name } = req.body;

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
                            <h5 style="box-sizing:border-box;margin-top:0;margin-bottom:.5rem;font-family:inherit;font-weight:500;line-height:1.2;color:inherit;font-size:1.25rem;margin:20px 0">Gracias por registrate en nuestra plataforma para empresas</h5>
                            <div style="box-sizing:border-box;display:-webkit-box;display:-ms-flexbox;display:flex">
                                <div style="box-sizing:border-box;width:100%;min-height:1px;padding-right:15px;padding-left:15px;text-align:center">
                                </div>
                            </div>
                            <p style="box-sizing:border-box;margin-top:0;margin-bottom:1rem">Eres importante para nosotros, contratar una persona calificada puede ser muy fácil. Te ayudamos en todo el proceso</p>
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