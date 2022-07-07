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
const { fileUpload, getImages } = require('../controller/uploads.controller');

const router = Router();

router.use(expressFileUpload());

/** =====================================================================
 *  UPLOADS
=========================================================================*/
router.put('/:tipo/:id', validarWorkerJWT, fileUpload);
/** =====================================================================
 *  UPLOADS
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
// router.delete('/delete/:type/:id/:desc/:img', validarJWT, deleteImg);
/** =====================================================================
 *  DELETE IMAGES
=========================================================================*/

// EXPORT
module.exports = router;