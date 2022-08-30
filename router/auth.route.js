/** =====================================================================
 *  LOGIN ROUTER
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// HELPERS
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarWorkerJWT } = require('../middlewares/validar-jwt');

// CONTROLLERS
const { googleSignIn, renewWorkerJWT, login, rePass } = require('../controller/auth.controller');

const router = Router();

/** =====================================================================
 *  LOGIN - GOOGLEe
=========================================================================*/
router.post('/', [
        check('email', 'El email es obligatorio').not().isEmpty(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ],
    login
);
/** =====================================================================
*  LOGIN - GOOGLE
=========================================================================*/

/** =====================================================================
 *  RECUPERAR CONTRASEÑA
=========================================================================*/
router.post('/recuperar/password', [
        check('email', 'El email es obligatorio').not().isEmpty(),
        validarCampos
    ],
    rePass
);
/** =====================================================================
*  RECUPERAR CONTRASEÑA
=========================================================================*/

/** =====================================================================
 *  RENEW TOKEN WORKER
=========================================================================*/
router.get('/renew/worker', validarWorkerJWT, renewWorkerJWT);
/** =====================================================================
*  RENEW TOKEN WORKER
=========================================================================*/


// EXPORT
module.exports = router;