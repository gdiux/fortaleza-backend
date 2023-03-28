/** =====================================================================
 *  WORKER ROUTER
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// HELPERS
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarWorkerJWT } = require('../middlewares/validar-jwt');

// CONTROLLERS
const { createWorker, updateWorker, deleteExpWorker, zipAllWorker } = require('../controller/worker.controller');

const router = Router();

/** =====================================================================
 *  POST WORKER
=========================================================================*/
router.post('/', [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
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

/** =====================================================================
 *  DELETE EXP WORKER
=========================================================================*/
router.delete('/exp/:id', validarWorkerJWT, deleteExpWorker);
/** =====================================================================
*  DELETE EXP WORKER
=========================================================================*/


/** =====================================================================
 *  GET WORKERS
=========================================================================*/
router.get('/zip/all/:wid', zipAllWorker);
/** =====================================================================
 *  GET WORKERS
=========================================================================*/


// EXPORT
module.exports = router;