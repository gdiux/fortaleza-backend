/** =====================================================================
 *  WORKER ROUTER
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// HELPERS
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarWorkerJWT } = require('../middlewares/validar-jwt');

// CONTROLLERS
const { getEntrevistasWorker, updateEntrevista } = require('../controller/entrevistas.controller');


const router = Router();


/** =====================================================================
 *  GET JOBS OF BUSSINESS
=========================================================================*/
router.get('/worker/:worker', [
        validarWorkerJWT,
    ],
    getEntrevistasWorker
);
/** =====================================================================
*  GET JOBS OF BUSSINESS
=========================================================================*/


/** =====================================================================
 *  PUT JOB
=========================================================================*/
router.put('/:id', [
        validarWorkerJWT,
        validarCampos
    ],
    updateEntrevista
);
/** =====================================================================
*  PUT JOB
=========================================================================*/


// EXPORT
module.exports = router;