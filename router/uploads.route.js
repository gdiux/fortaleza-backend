/** =====================================================================
 *  UPLOADS ROUTER
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// MIDDLEWARES
const expressFileUpload = require('express-fileupload');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarWorkerJWT } = require('../middlewares/validar-jwt');

// CONTROLLERS
const { fileUpload, getImages, uploadFiles, deleteFile } = require('../controller/uploads.controller');

const router = Router();

router.use(expressFileUpload());

/** =====================================================================
 *  UPLOADS IMG
=========================================================================*/
router.put('/:tipo', validarWorkerJWT, fileUpload);
/** =====================================================================
 *  UPLOADS IMG
=========================================================================*/

/** =====================================================================
 *  UPLOADS FILES
=========================================================================*/
router.put('/files/:type/:desc', validarWorkerJWT, uploadFiles);
/** =====================================================================
 *  UPLOADS FILES
=========================================================================*/

/** =====================================================================
 *  GET IMAGES
=========================================================================*/
router.get('/:tipo/:image', getImages);
/** =====================================================================
 *  GET IMAGES
=========================================================================*/
/** =====================================================================
 *  DELETE IMAGES
=========================================================================*/
router.delete('/delete/:attachment', validarWorkerJWT, deleteFile);
/** =====================================================================
 *  DELETE IMAGES
=========================================================================*/

// EXPORT
module.exports = router;