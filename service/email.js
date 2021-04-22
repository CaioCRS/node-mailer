"use strict";
const nodemailer = require("nodemailer");
const enumUtils = require('../utils/enum');
const sgMail = require('@sendgrid/mail');
const pdf = require('html-pdf');

function getBase64FromHtml(html) {
    return new Promise((resolve, reject) => {


        // let options = {
        //     format: 'A4',
        //     border: {
        //         top: '0',            // default is 0, units: mm, cm, in, px
        //         right: '15px',
        //         bottom: '0',
        //         left: '15px'
        //     },
        //     quality: '100',
        //     dpi: 300,
        //     paginationOffset: 1,
        //     header: {
        //         height: '35px',
        //         contents: {
        //             default: '<strong style="float: right;">página {{page}} de {{pages}}</strong>'
        //         }
        //     },
        //     footer: {
        //         height: '35px',
        //         contents: {
        //             default: '<strong style="float: right; ">página {{page}} de {{pages}}</strong>'
        //         }
        //     }
        // };

        let options = {
            format: 'A4',
        };

        // pdf.create(html).toStream(function (err, stream) {
        //     stream.pipe(fs.createWriteStream('./foo.pdf'));
        //     resolve(fs.createWriteStream('./foo.pdf'));
        //     console.log("entrou no criar")
        // });


        pdf.create(html).toBuffer(function (err, buffer) {
            if (err) {
                console.log("erro ao gerar pdf", err);
                reject(null);
            } else {
                console.log("conseguiu gerar o hash de pdf");
                resolve(buffer);
            }
        });
    });
}

async function EnviaEmail(mail, callback) {

    //let base64data = await getBase64FromHtml(mail.htmlAttachment);

    sgMail.setApiKey(mail.apiKey);

    const msg = {
        to: mail.mailTo,
        from: mail.mailFrom,
        subject: mail.subject,
        text: ' ',
        html: mail.text
    }

    sgMail.send(msg).then(() => {
        callback(enumUtils.httpStatusCode.ok, 'E-mail enviado com sucesso');
    }).catch((error) => {
        console.error('Erro no send Grid');
        console.error(error);
        callback(enumUtils.httpStatusCode.internalServerError, 'Erro ao enviar e-mail');
    });
};

async function EnviaEmailRecuperarSenha(mail, callback) {

    sgMail.setApiKey(mail.apiKey);

    const msg = {
        to: mail.mailTo,
        from: mail.mailFrom,
        subject: mail.subject,
        text: ' ',
        html: mail.text,
        templateId: mail.templateId,
        dynamic_template_data: {
            first_name: mail.firstName,
            link: mail.link
        }
    }

    sgMail.send(msg).then(() => {
        callback(enumUtils.httpStatusCode.ok, 'E-mail enviado com sucesso');
    }).catch((error) => {
        console.error('Erro no send Grid');
        console.error(error);
        console.log(error.response.body);
        callback(enumUtils.httpStatusCode.internalServerError, 'Erro ao enviar e-mail');
    });
};


async function EnviaEmailSmtp(mail, callback) {

    var confEnvio = {
        host: mail.host,
        port: mail.port,
        secure: mail.secure, // use TLS
        auth: {
            user: mail.userName,
            pass: mail.pass
        }
    }

    if (mail.host.indexOf('office365') !== -1) {
        confEnvio.tls = {
            ciphers: 'SSLv3'
        }
        confEnvio.secureConnection = false;
        confEnvio.secure = undefined;
    }

    var transporter = nodemailer.createTransport(confEnvio);

    // verify connection configuration
    transporter.verify(function (error, success) {
        if (error) {
            console.log("obj transporter", confEnvio);
            console.log("erro no transporter!!!");
            console.log(error);
        } else {
            console.log("Server is ready to take our messages");
        }
    });

    const msg = {
        to: mail.mailTo,
        from: mail.mailFrom,
        subject: mail.subject,
        text: ' ',
        html: mail.text
    }

    transporter.sendMail(msg).then(() => {
        callback(enumUtils.httpStatusCode.ok, 'E-mail enviado com sucesso');
    }).catch((error) => {
        console.error('Erro ao enviar via smtp');
        console.error(error);
        console.log("message", { mailTo, mailFrom });
        console.log(error.response.body);
        callback(enumUtils.httpStatusCode.internalServerError, 'Erro ao enviar e-mail');
    });
};


async function EnviaEmailSmtpTest(mail, callback) {

    var confEnvio = {
        host: mail.host,
        port: mail.port,
        secure: mail.secure, // use TLS
        auth: {
            user: mail.userName,
            pass: mail.pass
        }
    }

    if (mail.host.indexOf('office365') !== -1) {
        confEnvio.tls = {
            ciphers: 'SSLv3'
        }
        confEnvio.secureConnection = false;
        confEnvio.secure = undefined;
    }

    console.log("configEnvio", confEnvio);

    var transporter = nodemailer.createTransport(confEnvio);

    // verify connection configuration
    transporter.verify(function (error, success) {
        if (error) {
            console.log("obj transporter", confEnvio);
            console.log("erro no transporter!!!");
            console.log(error);
        } else {
            console.log("Server is ready to take our messages");
        }
    });

    // let base64data = await getBase64FromHtml(mail.htmlAttachment);

    // sgMail.setApiKey(mail.apiKey);

    const msg = {
        to: mail.mailTo,
        from: mail.mailFrom,
        subject: mail.subject,
        text: ' ',
        html: mail.text
    }

    transporter.sendMail(msg).then(() => {
        callback(enumUtils.httpStatusCode.ok, 'E-mail enviado com sucesso');
    }).catch((error) => {
        console.error('Erro ao enviar via smtp');
        console.error(error);
        console.log(error.response.body);
        callback(enumUtils.httpStatusCode.internalServerError, 'Erro ao enviar e-mail');
    });
};

module.exports = { EnviaEmailRecuperarSenha, EnviaEmailSmtp, EnviaEmailSmtpTest, EnviaEmail }