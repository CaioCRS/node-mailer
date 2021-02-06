const enumUtils = require('../utils/enum');
const sgMail = require('@sendgrid/mail');
const pdf = require('html-pdf');

function getBase64FromHtml(html){
    return new Promise((resolve, reject) => {
        pdf.create(html).toBuffer(function (err, buffer) {
            if (err){
                reject(null);
            }else{
                resolve(buffer.toString('base64'));
            }
        });
    });
}

async function EnviaEmail(mail, callback) {

    let base64data = await getBase64FromHtml(mail.htmlAttachment);
    
    sgMail.setApiKey(mail.apiKey);

    const msg = {
        to: mail.mailTo,
        from: mail.mailFrom,
        subject: mail.subject,
        text: 'teste',
        html: mail.text,
        attachments: [{
                filename: `contrato.pdf`,
                content: base64data,
                type: 'application/pdf',
                disposition: 'attachment'
            }]
    }

    sgMail.send(msg).then(() => {
        callback(enumUtils.httpStatusCode.ok, 'E-mail enviado com sucesso');
    }).catch((error) => {
        console.error('Erro no send Grid');
        console.error(error);
        callback(enumUtils.httpStatusCode.internalServerError, 'Erro ao enviar e-mail');
    });
};

module.exports = { EnviaEmail }