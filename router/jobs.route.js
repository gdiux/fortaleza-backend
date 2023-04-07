/** =====================================================================
 *  WORKER ROUTER
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');
const { createJob, updateJob, getJobBussiness, deleteJob, getJobWorker, certificadoLaboralPdf } = require('../controller/jobs.controller');

// HELPERS
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarWorkerJWT, validarBussinessJWT } = require('../middlewares/validar-jwt');

// CONTROLLERS

const router = Router();

/** =====================================================================
 *  GET JOBS OF BUSSINESS
=========================================================================*/
router.get('/all/:bussiness', [
        validarBussinessJWT,
    ],
    getJobBussiness
);
/** =====================================================================
 *  GET JOBS OF BUSSINESS
=========================================================================*/

/** =====================================================================
 *  GET JOBS FOR WORKER
=========================================================================*/
router.get('/worker/:worker', [
        validarWorkerJWT,
    ],
    getJobWorker
);
/** =====================================================================
*  GET JOBS FOR WORKER
=========================================================================*/

/** =====================================================================
 *  GET CERTIFICADO LABORAL JOBS FOR WORKER
=========================================================================*/
router.get('/certificado/:jid', certificadoLaboralPdf);
/** =====================================================================
*  GET CERTIFICADO LABORAL JOBS FOR WORKER
=========================================================================*/

/** =====================================================================
 *  POST JOB
=========================================================================*/
router.post('/', [
        validarBussinessJWT,
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('description', 'La descripción es obligatoria').not().isEmpty(),
        validarCampos
    ],
    createJob
);
/** =====================================================================
*  POST JOB
=========================================================================*/

/** =====================================================================
 *  PUT JOB
=========================================================================*/
router.put('/:id', [
        validarBussinessJWT,
        validarCampos
    ],
    updateJob
);
/** =====================================================================
*  PUT JOB
=========================================================================*/

/** =====================================================================
 *  DELETE JOB
=========================================================================*/
router.delete('/:job', [
        validarBussinessJWT,
    ],
    deleteJob
);
/** =====================================================================
*  DELETE JOB
=========================================================================*/



// EXPORT
module.exports = router;