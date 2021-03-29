const express = require('express');
const router = express.Router();
const emailService = require('../service/email');
const enumUtils = require('../utils/enum');

/* #region Envio de e-mail */
/**
 * @swagger
 * /email-smtp-test:
 *  post:
 *      description: Envio de e-mail via smtp para realização de testes de configuração
 *      tags:
 *          - email-smtp-test
 *      consumes:
 *          - application/json
 *      parameters:
 *       - in: body
 *         name: email
 *         description: Informações do e-mail
 *         schema:
 *          type: object
 *          required:
 *              host
 *              port
 *              secure
 *              userName
 *              pass
 *              mailFrom
 *              mailTo
 *              subject
 *              text
 *          properties:
 *            host:
 *              type: string
 *              description: Host do email de envio
 *              default: ""
 *            port:
 *              type: string
 *              description: Porta do email de envio
 *              default: ""
 *            secure:
 *              type: bool
 *              description: Indica se a configuracao exige segurança
 *              default: false
 *            userName:
 *              type: string
 *              description: user name do email de envio
 *              default: ""
 *            pass:
 *              type: string
 *              description: senha do email de envio
 *              default: ""
 *            mailFrom:
 *              type: string
 *              description: E-mail do remetente
 *              default: ""
 *            mailTo:
 *              type: string
 *              description: E-mail do destinatário
 *              default: ""
 *            subject:
 *              type: string
 *              description: Assunto do e-mail
 *              default: ""
 *            text:
 *              type: string
 *              description: Texto do corpo do e-mail
 *              default: ""
 *      responses:
 *          '201':
 *              description: OK
 *          '400':
 *              description: Bad request.
 *          '401':
 *              description: Authorization information is missing or invalid.
 *          '404':
 *              description: Not found.
 *          '500':
 *              description: Unexpected error.
 */
router.post('/', async (req, res) => {
    try {
        await emailService.EnviaEmailSmtpTest(req.body, (httpStatusCode, mensagem) => {
            res.status(httpStatusCode).send({
                mensagem
            });
        });
    } catch (error) {
        console.log(error);
        res.status(enumUtils.httpStatusCode.internalServerError).send({
            mensagem: `Erro ao enviar o e-mail!`
        });
    }
    
});
/* #endregion */

module.exports = router;