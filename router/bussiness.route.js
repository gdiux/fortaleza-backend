/** =====================================================================
 *  WORKER ROUTER
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// HELPERS
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarWorkerJWT, validarBussinessJWT } = require('../middlewares/validar-jwt');

// CONTROLLERS
const { createBussiness, updateBussiness } = require('../controller/bussiness.controller');

const router = Router();

/** =====================================================================
 *  POST WORKER
=========================================================================*/
router.post('/', [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El nombre es obligatorio').isEmail(),
        check('password', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ],
    createBussiness
);
/** =====================================================================
*  POST WORKER
=========================================================================*/

/** =====================================================================
 *  PUT USER
=========================================================================*/
router.put('/:id', [
        validarBussinessJWT,
        validarCampos
    ],
    updateBussiness
);
/** =====================================================================
*  PUT USER
=========================================================================*/



// EXPORT
module.exports = router;