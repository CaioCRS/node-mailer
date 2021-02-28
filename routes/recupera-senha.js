const express = require('express');
const router = express.Router();
const emailService = require('../service/email');
const enumUtils = require('../utils/enum');

/* #region Envio de e-mail */
/**
 * @swagger
 * /recupera-senha:
 *  post:
 *      description: Envio de e-mail para recuperação de senha
 *      tags:
 *          - recupera-senha
 *      consumes:
 *          - application/json
 *      parameters:
 *       - in: body
 *         name: email
 *         description: Informações do e-mail
 *         schema:
 *          type: object
 *          required:
 *            - apiKey
 *              mailFrom
 *              mailTo
 *              subject
 *              text
 *              htmlAttachment
 *          properties:
 *            apiKey:
 *              type: string
 *              description: Chave do remetente no Sendgrid
 *              default: null
 *            mailFrom:
 *              type: string
 *              description: E-mail do remetente
 *              default: null
 *            mailTo:
 *              type: string
 *              description: E-mail do destinatário
 *              default: null
 *            subject:
 *              type: string
 *              description: Assunto do e-mail
 *              default: null
 *            text:
 *              type: string
 *              description: Texto do corpo do e-mail
 *              default: null
 *            templateId:
 *              type: string
 *              description: id do template
 *              default: null
 *            firstName:
 *              type: string
 *              description: nome do destinatario
 *              default: null
 *            link:
 *              type: string
 *              description: link do botão
 *              default: null
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
        await emailService.EnviaEmailRecuperarSenha(req.body, (httpStatusCode, mensagem) => {
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