"use strict";
const nodemailer = require("nodemailer");
const enumUtils = require('../utils/enum');
const sgMail = require('@sendgrid/mail');
const pdf = require('html-pdf');

function getBase64FromHtml(html) {
    return new Promise((resolve, reject) => {


        let options = {
            format: 'A4',
            border: {
                top: '0',            // default is 0, units: mm, cm, in, px
                right: '15px',
                bottom: '0',
                left: '15px'
            },
            quality: '100',
            dpi: 300,
            paginationOffset: 1,
            header: {
                height: '35px',
                contents: {
                    default: '<strong style="float: right;">página {{page}} de {{pages}}</strong>'
                }
            },
            footer: {
                height: '35px',
                contents: {
                    default: '<strong style="float: right; ">página {{page}} de {{pages}}</strong>'
                }
            }
        };


        pdf.create(html, options).toBuffer(function (err, buffer) {
            if (err) {
                reject(null);
            } else {
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
        text: ' ',
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

    var transporter = nodemailer.createTransport(confEnvio);



    // verify connection configuration
    transporter.verify(function (error, success) {
        if (error) {
            console.log("obj transporter",confEnvio);
            console.log("erro no transporter!!!");
            console.log(error);
        } else {
            console.log("Server is ready to take our messages");
        }
    });

    let base64data = await getBase64FromHtml(mail.htmlAttachment);

    // sgMail.setApiKey(mail.apiKey);

    const msg = {
        to: mail.mailTo,
        from: mail.mailFrom,
        subject: mail.subject,
        text: ' ',
        html: mail.text,
        attachments: [{
            filename: `contrato.pdf`,
            content: base64data,
            type: 'application/pdf',
            disposition: 'attachment'
        }]
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
 
     var transporter = nodemailer.createTransport(confEnvio);
 
     // verify connection configuration
     transporter.verify(function (error, success) {
         if (error) {
             console.log("obj transporter",confEnvio);
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

module.exports = { EnviaEmailRecuperarSenha, EnviaEmailSmtp, EnviaEmailSmtpTest }