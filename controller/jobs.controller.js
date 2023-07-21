const { response } = require('express');

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const Job = require('../model/jobs.model');

/** ======================================================================
 *  GET JOBS OF BUSSINESS
=========================================================================*/
const getJobBussiness = async(req, res = response) => {

    try {

        const bussiness = req.params.bussiness;

        const jobs = await Job.find({ bussiness })
            .populate('bussiness', 'name nit email phone address bid')
            .populate('worker', 'name cedula email phone address wid');

        res.json({
            ok: true,
            jobs
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};

/** ======================================================================
 *  GET JOBS FOR WORKER
=========================================================================*/
const getJobWorker = async(req, res = response) => {

    try {

        const worker = req.params.worker;

        const jobs = await Job.find({ worker })
            .populate('bussiness', 'name nit email phone address bid img')
            .populate('worker', 'name cedula email phone address wid img');

        res.json({
            ok: true,
            jobs
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};

/** ======================================================================
 *  POST JOB
=========================================================================*/
const createJob = async(req, res = response) => {

    try {

        const bussiness = req.bid;

        const job = new Job(req.body);

        job.bussiness = bussiness;

        // SAVE WORKER
        await job.save();

        res.json({
            ok: true,
            job
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

}

/** ======================================================================
 *  PUT JOBS
=========================================================================*/
const updateJob = async(req, res = response) => {

    try {

        const jid = req.params.id;

        // SEARCH JOB
        const jobDB = await Job.findById(jid);
        if (!jobDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ninguna oferta de empleo con este ID'
            });
        }
        // SEARCH JOB

        const {...campos } = req.body;

        // UPDATE
        const jobUpdate = await Job.findByIdAndUpdate(jid, campos, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            job: jobUpdate
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};

/** ======================================================================
 *  DELETE JOBS
=========================================================================*/
const deleteJob = async(req, res = response) => {

    try {

        const jid = req.params.job;

        // SEARCH JOB
        const jobDB = await Job.findById(jid);
        if (!jobDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ninguna oferta de empleo con este ID'
            });
        }
        // SEARCH JOB

        const del = await Job.deleteOne({ _id: jid }, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            msg: 'Se ha eliminado exitosamente la oferta'
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};

/** ======================================================================
 *  GENERAR PDF DE CONTRATO
=========================================================================*/
const certificadoLaboralPdf = async(req, res = response) => {

    try {

        const jid = req.params.jid;
        const mes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre', ];

        // SEARCH JOB
        const jobDB = await Job.findById(jid)
            .populate('bussiness', 'name nit email phone address bid img city')
            .populate('worker', 'name cedula email phone address wid img');
        if (!jobDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ninguna oferta de empleo con este ID'
            });
        }
        // SEARCH JOB

        const pathPDf = path.join(__dirname, `../uploads/certificados/${jobDB.worker._id}.pdf`);

        // VALIDATE CERTIFICADO
        if (fs.existsSync(pathPDf)) {
            // DELET CERTIFICADO OLD
            fs.unlinkSync(pathPDf);
        }


        const fechaIn = new Date(jobDB.fechain);

        const parrafo = ` El colaborador (a) ${jobDB.worker.name}, con Cédula de Ciudadanía número ${jobDB.worker.cedula}, labora al servicio de esta compañía desde el ${fechaIn.getDay()}/${ fechaIn.getUTCMonth() + 1}/${ fechaIn.getFullYear() } a la fecha, mediante un contrato de Obra o Labor Contratada desempeñando el cargo de ${jobDB.name} en la empresa usuaria ${jobDB.bussiness.name}. `;

        // Create a document
        const doc = new PDFDocument();

        // Pipe its output somewhere, like to a file or HTTP response
        // See below for browser usage
        doc.pipe(fs.createWriteStream(pathPDf));

        // LOGO
        // doc.image(path.join(__dirname, `../uploads/logo/logo.jpg`), 0, 15, { width: 200, fit: [100, 100], align: 'center', valign: 'center' });
        doc.image(path.join(__dirname, `../uploads/logo/logo.jpg`), 206, 45, { width: 200, align: 'center', valign: 'center' });

        // Embed a font, set the font size, and render some text
        doc
            .fontSize(14)
            .moveDown(2)
            .text('FORTALEZA TEMP JOB PLUS EST S.A.S', {
                width: 412,
                align: 'center',
                ellipsis: true,
            });
        doc
            .fontSize(14)
            .text('NIT. 901.601.054-5', {
                width: 412,
                align: 'center',
                ellipsis: true
            });

        doc
            .fontSize(12)
            .moveDown()
            .text('CERTIFICA QUE:', {
                width: 412,
                align: 'center',
                indent: 30,
                height: 50,
                ellipsis: true
            });

        doc
            .fontSize(12)
            .moveDown()
            .text(parrafo, {
                width: 412,
                align: 'justify',
                indent: 30,
                height: 300,
                ellipsis: true
            });

        doc
            .fontSize(12)
            .moveDown()
            .text(`La presente se expide en la ciudad de ${jobDB.bussiness.city || 'Bucaramanga'} a solicitud del trabajador ${jobDB.worker.name} dirigida a QUIEN INTERESE, con fecha ${ new Date().getDate() }, ${ mes[new Date().getMonth()]}, ${ new Date().getFullYear() }.`, {
                width: 412,
                align: 'justify',
                indent: 40,
                height: 300,
                ellipsis: true
            });

        doc
            .fontSize(12)
            .moveDown(8)
            .text(`Atentamente,`, {
                width: 412,
                align: 'left',
                height: 50,
            });

        // FIRMA
        doc.image(path.join(__dirname, `../uploads/logo/firma.jpg`), 80, 500, { width: 150 })
            .moveDown(8);

        doc
            .fontSize(12)
            .text(`YURY MARCELA ESCALANTE,`, {
                width: 412,
                align: 'left',
            });
        doc
            .fontSize(12)
            .text(`Coordinadora de Gestión Humana`, {
                width: 412,
                align: 'left',
            });
        doc
            .fontSize(12)
            .text(`Tel. 3245173063`, {
                width: 412,
                align: 'left',
            });
        doc
            .fontSize(12)
            .text(`gestion.humana@fortalezasas.com`, {
                width: 412,
                align: 'left',
            });

        await doc.end();

        setTimeout(() => {

            if (fs.existsSync(pathPDf)) {
                res.sendFile(pathPDf);
            } else {
                res.json({
                    ok: false,
                    msg: 'No se ha generado el certificado laboral exitosamente!'
                });
            }

        }, 2000);




    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};


// EXPORTS
module.exports = {
    getJobBussiness,
    createJob,
    updateJob,
    deleteJob,
    getJobWorker,
    certificadoLaboralPdf
}