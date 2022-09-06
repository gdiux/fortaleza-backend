const { response } = require('express');
const bcrypt = require('bcryptjs');

const Worker = require('../model/worker.model');

const { generarJWT, generarWorkerJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');


/** =====================================================================
 *  REEBOOT PASSWORD
=========================================================================*/
const rePass = async(req, res = response) => {

    try {

        const email = req.body.email;

        // VALIDATE USER
        const workerDB = await Worker.findOne({ email });
        if (!workerDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningun usuario con este email.'
            });

        }
        // VALIDATE USER

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = Math.random().toString(36).replace(/[.!"#$%&/()=]+/g, '');

        const salt = bcrypt.genSaltSync();
        workerDB.password = bcrypt.hashSync(result, salt);

        // ========================= NODEMAILER =================================

        const transporter = nodemailer.createTransport({
            host: "smtp.office365.com", // hostname
            port: 587, // port for secure SMTP
            secureConnection: true,
            tls: {
                ciphers: 'SSLv3'
            },
            auth: {
                user: 'gacp_88@hotmail.com',
                pass: '19776943gacp'
            }
        });

        const mailOptions = {
            from: '"Grupo Fortaleza" <gacp_88@hotmail.com>', // sender address (who sends)
            to: email, // list of receivers (who receives)
            subject: 'Recuperar contraseña ', // Subject line
            text: 'Hello world ', // plaintext body
            html: `<div style="box-sizing:border-box;margin:0;font-family: Montserrat,-apple-system,BlinkMacSystemFont;font-size:1rem;font-weight:400;line-height:1.5;text-align:left;background-color:#fff;color:#333">
            <div class="adM">
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
                        <h2 style="box-sizing:border-box;margin-top:0;margin-bottom:.5rem;font-family:inherit;font-weight:500;line-height:1.2;color:inherit;font-size:2rem;text-align:center!important">Recuperar Contraseña</h2>
                    </div>
                </div>
                <div style="box-sizing:border-box;display:-webkit-box;display:-ms-flexbox;display:flex">
                    <div style="box-sizing:border-box;width:100%;min-height:1px;padding-right:15px;padding-left:15px;text-align:center">
                        <h3 style="text-transform: capitalize; box-sizing:border-box;margin-top:0;margin-bottom:.5rem;font-family:inherit;font-weight:500;line-height:1.2;color:inherit;font-size:2rem;margin:20px 0">Hola ${workerDB.name}</h3>
                        <h5 style="box-sizing:border-box;margin-top:0;margin-bottom:.5rem;font-family:inherit;font-weight:500;line-height:1.2;color:inherit;font-size:1.25rem;margin:20px 0">Hemos recibido su solicitud de recuperación de contraseña.</h5>
                        <div style="box-sizing:border-box;display:-webkit-box;display:-ms-flexbox;display:flex">
                            <div style="box-sizing:border-box;width:100%;min-height:1px;padding-right:15px;padding-left:15px;text-align:center">
                            </div>
                        </div>
                        <p style="box-sizing:border-box;margin-top:0;margin-bottom:1rem">Tu nueva contraseña es: ${result}</p>
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
            </div>`,
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, async(error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({
                    ok: false,
                    msg: 'Error inesperado'
                });
            }

            await workerDB.save();

            res.json({
                ok: true,
                msg: 'Hemos enviado al correo la nueva contraseña, verifica la carpeta de correos spam'
            });

        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });

    }

};


/** =====================================================================
 *  LOGIN
=========================================================================*/
const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        // VALIDATE USER
        const workerDB = await Worker.findOne({ email });
        if (!workerDB) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario o la contraseña es incorrecta'
            });

        }
        // VALIDATE USER

        // PASSWORD
        const validPassword = bcrypt.compareSync(password, workerDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'El email o la contraseña es incorrecta'
            });
        } else {

            if (workerDB.status) {
                const token = await generarWorkerJWT(workerDB.id);

                res.json({
                    ok: true,
                    token
                });
            } else {
                return res.status(401).json({
                    ok: false,
                    msg: 'Tu cuenta a sido desactivada por un administrador'
                });
            }

        }

        // JWT - JWT

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });

    }


};
/** =====================================================================
 *  LOGIN
=========================================================================*/

/** =====================================================================
 *  RENEW TOKEN
======================================================================*/
const renewJWT = async(req, res = response) => {

    const uid = req.uid;

    // GENERAR TOKEN - JWT
    const token = await generarJWT(uid);

    // SEARCH USER
    const usuario = await User.findById(uid, 'usuario name role img uid status cerrada turno privilegios skills');
    // SEARCH USER

    res.status(200).json({
        ok: true,
        token,
        usuario
    });

};
/** =====================================================================
 *  RENEW TOKEN
=========================================================================*/

/** =====================================================================
 *  LOGIN GOOGLE
=========================================================================*/
const googleSignIn = async(req, res = response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify(googleToken);

        const workerDB = await Worker.findOne({ email });

        let worker;

        if (!workerDB) {
            // si no existe el usuario
            worker = new Worker({
                name,
                email,
                img: picture,
                google: true
            });

            // Guardar en DB

        } else {
            // existe usuario
            worker = workerDB;
            worker.google = true;
        }

        await worker.save();

        // Generar el TOKEN - JWT
        const token = await generarWorkerJWT(worker._id);

        res.json({
            ok: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Token no es correcto',
        });
    }

}

/** =====================================================================
 *  LOGIN GOOGLE
=========================================================================*/

/** =====================================================================
 *  RENEW TOKEN WORKER
======================================================================*/
const renewWorkerJWT = async(req, res = response) => {

    try {

        const wid = req.wid;

        // GENERAR TOKEN - JWT  
        const token = await generarWorkerJWT(wid);

        // SEARCH USER
        const worker = await Worker.findById(wid, 'name cedula phone email address city department zip status google img attachments type fecha skills');
        // SEARCH USER

        res.status(200).json({
            ok: true,
            token,
            worker
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error en el token',
        });
    }



};
/** =====================================================================
 *  RENEW TOKEN CLIENT
=========================================================================*/
module.exports = {
    googleSignIn,
    renewWorkerJWT,
    login,
    renewJWT,
    rePass
};