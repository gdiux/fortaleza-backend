//

const path = require('path');
const fs = require('fs');

const sharp = require('sharp');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');

// HELPERS
const { updateImage } = require('../helpers/update-image');


/** =====================================================================
 *  UPLOADS
=========================================================================*/
const fileUpload = async(req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const desc = req.query.desc;
    const uid = req.uid;

    const validType = ['worker', 'archivos'];

    // VALID TYPES
    if (!validType.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'El tipo es invalido'
        });
    }


    if (desc === 'archivo') {

        const validArch = ['pdf', 'docx', 'xlsx'];

        const file = req.files.image;
        const nameShort = file.name.split('.');
        const extFile = nameShort[nameShort.length - 1];

        if (!validArch.includes(extFile)) {

            return res.status(400).json({
                ok: false,
                msg: 'No se permite este tipo de archivo, solo extenciones PDF - Word - Excel'
            });
        }


        // GENERATE NAME UID
        const nameFile = `${ uuidv4() }.${extFile}`;

        // PATH IMAGE
        const path = `./uploads/${ tipo }/${ nameFile }`;

        file.mv(path, (err) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al guardar el archivo'
                });
            }

            // UPDATE IMAGE
            updateImage(tipo, id, nameFile, uid, desc);

            return res.json({
                ok: true,
                msg: 'Se ha guardado el archivo exitosamente!',
                nombreArchivo: nameFile,
                date: Date.now()
            });

        });

        return;
    }

    // VALIDATE IMAGE
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No has seleccionado ningún archivo'
        });
    }


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
        .resize(1024, 768)
        .webp({ equality: 75, effort: 6 })
        .toFile(path, async(err, info) => {

            // UPDATE IMAGE
            const nuevo = await updateImage(tipo, id, nameFile, uid, desc);

            res.json({
                ok: true,
                msg: 'Imagen Actualizada',
                data: nuevo

            });


        });
};
/** =====================================================================
 *  UPLOADS
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
        if (tipo !== 'user') {
            const pathImg = path.join(__dirname, `../uploads/default.png`);
            res.sendFile(pathImg);
        } else {
            const pathImg = path.join(__dirname, `../uploads/user/user-default.png`);
            res.sendFile(pathImg);
        }

    }

};
/** =====================================================================
 *  GET IMAGES
=========================================================================*/


// EXPORTS
module.exports = {
    fileUpload,
    getImages
};