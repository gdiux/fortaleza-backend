//

const path = require('path');
const fs = require('fs');

const sharp = require('sharp');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');

// MODELS
const Worker = require('../model/worker.model');

// HELPERS
const { updateImage } = require('../helpers/update-image');

/** =====================================================================
 *  UPLOADS FILES
=========================================================================*/
const uploadFiles = async(req, res = response) => {

    try {

        const type = req.params.type;
        const desc = req.params.desc;
        const wid = req.params.wid;
        const tipo = req.params.tipo;
        const parentesco = req.params.parentesco;
        const numero = req.params.numero;
        const beneficiario = req.params.beneficiario;
        const file = req.files.image;

        // VALIDAR ARCHIVOS
        const validArch = ['pdf', 'PDF', 'docx', 'xlsx', 'jpg', 'png', 'jpeg', 'webp'];
        const nameShort = file.name.split('.');
        const extFile = nameShort[nameShort.length - 1];

        if (!validArch.includes(extFile)) {

            return res.status(400).json({
                ok: false,
                msg: 'No se permite este tipo de archivo, solo extenciones PDF - Word - Excel - JPG - PNG - WEBP'
            });
        }
        // VALIDAR ARCHIVOS

        // ===========================================================
        //  COMPROBAR SI ES ARCHIVO
        // ==========================================================
        if (type === 'archivos') {

            // GENERATE NAME UID
            const nameFile = `${ uuidv4() }.${extFile}`;

            // PATH IMAGE
            const path = `./uploads/archivos/${ nameFile }`;
            file.mv(path, async(err) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        msg: 'Error al guardar el archivo'
                    });
                }

                // UPDATE IMAGE
                // updateImage(tipo, id, nameFile, uid, desc);

                // SEARCH USER BY ID
                const workerDb = await Worker.findById(wid);
                if (!workerDb) {
                    return res.status(500).json({
                        ok: false,
                        msg: 'Error, no existe este usuario'
                    });
                }

                workerDb.attachments.push({
                    attachment: nameFile,
                    type,
                    desc,
                    tipo,
                    parentesco,
                    numero,
                    beneficiario,
                    date: Date.now()
                });

                await workerDb.save();

                return res.json({
                    ok: true,
                    worker: workerDb,
                });

            });


        } else {
            // ===========================================================
            //  SI ES IMAGEN
            // ==========================================================

            // GENERATE NAME UID
            const nameFile = `${ uuidv4() }.webp`;

            // PATH IMAGE
            const path = `./uploads/archivos/${ nameFile }`;

            // CONVERTIR A WEBP
            sharp(req.files.image.data)
                .webp({ equality: 75, effort: 6 })
                .toFile(path, async(err, info) => {

                    // UPDATE IMAGE
                    // const nuevo = await updateImage(tipo, id, nameFile, uid, desc);

                    const workerDb = await Worker.findById(wid);
                    if (!workerDb) {
                        return res.status(500).json({
                            ok: false,
                            msg: 'Error, no existe este usuario'
                        });
                    }

                    workerDb.attachments.push({
                        attachment: nameFile,
                        type,
                        desc,
                        tipo,
                        parentesco,
                        numero,
                        beneficiario,
                        date: Date.now()
                    });

                    await workerDb.save();

                    return res.json({
                        ok: true,
                        worker: workerDb,
                    });

                });
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });

    }

};


/** =====================================================================
 *  UPLOADS
=========================================================================*/
const fileUpload = async(req, res = response) => {

    const tipo = req.params.tipo;
    const mob = req.query.mob || 'no';
    let id = '';

    if (req.wid) {
        id = req.wid
    } else {
        id = req.bid
    }

    const desc = req.query.desc;

    const validType = ['worker', 'archivos', 'bussiness'];

    // VALID TYPES
    if (!validType.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'El tipo es invalido'
        });
    }

    // VALIDATE IMAGE
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No has seleccionado ningún archivo'
        });
    }

    console.log(req.files);
    console.log(mob);

    // PROCESS IMAGE
    const file = await sharp(req.files.image.data).metadata();

    // const nameShort = file.format.split('.');
    const extFile = file.format;

    // VALID EXT
    const validExt = ['jpg', 'png', 'jpeg', 'webp', 'bmp', 'svg'];

    if (!validExt.includes(extFile)) {

        return res.status(400).json({
            ok: false,
            msg: 'No se permite este tipo de imagen, solo extenciones JPG - PNG - WEBP - SVG - RAR - ZIP - EPS - AI'
        });
    }
    // VALID EXT

    // GENERATE NAME UID
    const nameFile = `${ uuidv4() }.webp`;

    // PATH IMAGE
    const path = `./uploads/${ tipo }/${ nameFile }`;

    // CONVERTIR A WEBP
    sharp(req.files.image.data)
        .resize({
            width: 400,
            height: 400,
            fit: sharp.fit.cover,
            position: sharp.strategy.entropy

        })
        .webp({ equality: 75, effort: 6 })
        .toFile(path, async(err, info) => {

            // UPDATE IMAGE
            const nuevo = await updateImage(tipo, id, nameFile);

            res.json({
                ok: true,
                worker: nuevo

            });


        });
};
/** =====================================================================
 *  UPLOADS
=========================================================================*/

/** =====================================================================
 *  UPLOADS MOBILE
=========================================================================*/
const fileUploadApp = async(req, res = response) => {

    const tipo = req.params.tipo;
    let id = '';

    if (req.wid) {
        id = req.wid
    } else {
        id = req.bid
    }

    const desc = req.query.desc;

    const validType = ['worker', 'archivos', 'bussiness'];

    // VALID TYPES
    if (!validType.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'El tipo es invalido'
        });
    }

    // VALIDATE IMAGE
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No has seleccionado ningún archivo'
        });
    }

    // PROCESS IMAGE
    const file = await sharp(req.files.file.data).metadata();

    // const nameShort = file.format.split('.');
    const extFile = file.format;

    // VALID EXT
    const validExt = ['jpg', 'png', 'jpeg', 'webp', 'bmp', 'svg'];

    if (!validExt.includes(extFile)) {

        return res.status(400).json({
            ok: false,
            msg: 'No se permite este tipo de imagen, solo extenciones JPG - PNG - WEBP - SVG - RAR - ZIP - EPS - AI'
        });
    }
    // VALID EXT

    // GENERATE NAME UID
    const nameFile = `${ uuidv4() }.webp`;

    // PATH IMAGE
    const path = `./uploads/${ tipo }/${ nameFile }`;

    // CONVERTIR A WEBP
    sharp(req.files.file.data)
        .resize({
            width: 400,
            height: 400,
            fit: sharp.fit.cover,
            position: sharp.strategy.entropy

        })
        .webp({ equality: 75, effort: 6 })
        .toFile(path, async(err, info) => {

            // UPDATE IMAGE
            const nuevo = await updateImage(tipo, id, nameFile);

            res.json({
                ok: true,
                worker: nuevo

            });


        });
};
/** =====================================================================
 *  UPLOADS MOBILE
=========================================================================*/

/** =====================================================================
 *  GET IMAGES
=========================================================================*/
const getImages = (req, res = response) => {

    const tipo = req.params.tipo;
    const image = req.params.image;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${image}`);

    // IMAGE DEFAULT
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {

        // CHECK TYPE
        if (tipo !== 'worker') {
            const pathImg = path.join(__dirname, `../uploads/user-default.png`);
            res.sendFile(pathImg);
        } else {
            const pathImg = path.join(__dirname, `../uploads/worker/user-default.png`);
            res.sendFile(pathImg);
        }

    }

};
/** =====================================================================
 *  GET IMAGES
=========================================================================*/

/** =====================================================================
 *  DELETE FILE
=========================================================================*/
const deleteFile = async(req, res = response) => {

    try {

        const attachment = req.params.attachment;
        const wid = req.params.wid;

        const fileDel = await Worker.updateOne({ _id: wid }, { $pull: { attachments: { attachment } } });

        // VERIFICAR SI SE ACTUALIZO..
        if (fileDel.nModified === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No se pudo eliminar el archivo, porfavor intente de nuevo'
            });
        }

        // ELIMINAR IMAGEN DE LA CARPETA
        const path = `./uploads/archivos/${ attachment }`;

        if (fs.existsSync(path)) {
            // DELET IMAGE OLD
            fs.unlinkSync(path);
        }

        // DEVOLVER LOS ARCHIVOS
        const worker = await Worker.findById(wid);

        res.json({
            ok: true,
            worker
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });

    }

};

/** =====================================================================
 *  DELETE FILE
=========================================================================*/


// EXPORTS
module.exports = {
    fileUpload,
    getImages,
    uploadFiles,
    deleteFile,
    fileUploadApp
};