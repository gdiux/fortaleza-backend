const fs = require('fs');

// MODELS
const Worker = require('../model/worker.model');
const Bussiness = require('../model/bussiness.model');

/** =====================================================================
 *  DELETE IMAGE
=========================================================================*/
const deleteImage = (path) => {

    // VALIDATE IMAGE
    if (fs.existsSync(path)) {
        // DELET IMAGE OLD
        fs.unlinkSync(path);
    }

};

/** =====================================================================
 *  DELETE IMAGE
=========================================================================*/


/** =====================================================================
 *  UPDATE IMAGE 
=========================================================================*/
const updateImage = async(tipo, id, nameFile) => {

    let pathOld = '';

    switch (tipo) {

        case 'worker':

            // SEARCH USER BY ID
            const worker = await Worker.findById(id);
            if (!worker) {
                return false;
            }

            // VALIDATE IMAGE
            pathOld = `./uploads/worker/${ worker.img }`;
            deleteImage(pathOld);

            // SAVE IMAGE
            worker.img = nameFile;
            await worker.save();
            return worker;

            break;
        case 'bussiness':

            const bussiness = await Bussiness.findById(id);
            if (!bussiness) {
                return false;
            }

            // VALIDATE IMAGE
            pathOld = `./uploads/bussiness/${ bussiness.img }`;
            deleteImage(pathOld);

            // SAVE IMAGE
            bussiness.img = nameFile;
            await bussiness.save();
            return bussiness;

            break;
        case 'archivoss':

            // SEARCH USER BY ID
            const workerDb = await Worker.findById(id);
            if (!workerDb) {
                return false;
            }

            // SAVE IMAGE imgBef imgAft video

            workerDb.attachments.push({
                attachment: nameFile,
                date: Date.now()
            });

            await workerDb.save();


            return workerDb;

            break;

        default:
            break;
    }


};
/** =====================================================================
 *  UPDATE IMAGE
=========================================================================*/




// EXPORT
module.exports = {
    updateImage
};