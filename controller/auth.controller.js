const { response } = require('express');
const bcrypt = require('bcryptjs');

const Worker = require('../model/worker.model');

const { generarJWT, generarWorkerJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

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
    renewJWT
};