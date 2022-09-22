const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const accountTransport = require('../acount_transport.json');

/** =====================================================================
 *  ENVIAR CORREOS
=========================================================================*/
const sendMail = async(email, subject, html, msg) => {

    try {

        const oauth2Client = new OAuth2(
            accountTransport.auth.clientId,
            accountTransport.auth.clientSecret,
            "https://developers.google.com/oauthplayground",
        );

        oauth2Client.setCredentials({
            refresh_token: accountTransport.auth.refreshToken,
            tls: {
                rejectUnauthorized: false
            }
        });

        oauth2Client.getAccessToken((err, token) => {

            if (err) {
                console.log(error);
                return false;
            };

            // ENVIAR EMAIL

            const transporter = nodemailer.createTransport({
                'service': 'gmail',
                'auth': {
                    'type': 'OAuth2',
                    'user': `${accountTransport.auth.user}`,
                    'clientId': `${accountTransport.auth.clientId}`,
                    'clientSecret': `${accountTransport.auth.clientSecret}`,
                    'refreshToken': `${token}`
                }
            });

            const mailOptions = {
                from: '"Grupo Fortaleza" <nomina.fortaleza@gmail.com>', // sender address (who sends)
                to: email, // list of receivers (who receives)
                subject, // Subject line
                html,
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, async(error, info) => {
                if (error) {
                    console.log(error);
                    return false;
                }

                return true;

            });

        });


    } catch (error) {
        console.log(error);
        return false;

    }

}

// EXPORT
module.exports = {
    sendMail
};