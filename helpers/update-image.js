const fs = require('fs');

// MODELS
const Worker = require('../model/worker.model');

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
const updateImage = async(tipo, id, nameFile, uid, desc) => {

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
            user.img = nameFile;
            await user.save();
            return true;

            break;
        case 'archivos':

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