/** =====================================================================
 *  WORKER ROUTER
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// HELPERS
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarWorkerJWT } = require('../middlewares/validar-jwt');

// CONTROLLERS
const { createWorker, updateWorker } = require('../controller/worker.controller');

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
    createWorker
);
/** =====================================================================
*  POST WORKER
=========================================================================*/

/** =====================================================================
 *  PUT USER
=========================================================================*/
router.put('/:id', [
        validarWorkerJWT,
        validarCampos
    ],
    updateWorker
);
/** =====================================================================
*  PUT USER
=========================================================================*/



// EXPORT
module.exports = router;