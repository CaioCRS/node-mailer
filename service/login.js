const loginRepository = require('../repository/login');
const helpers = require('../utils/helpers');
const enumUtils = require('../utils/enum');
const securityUtils = require('../utils/security');
const moment = require('moment');
const model = require('../model/schemas');

async function CriaLogin(login){

    const colunasLogin = 'username, senha, usuario_id, codigo_verificacao, data_envio_codigo, status_id';
    const valoresLogin = [`${login.username}`, `${login.senha}`, login.usuarioId, `${login.codigoVerificacao}`, moment().format('YYYY-MM-DD, hh:mm:ss'), enumUtils.status.revisao];
    let loginId = await loginRepository.InserirLogin(colunasLogin, valoresLogin);

    return !isNaN(loginId);
};

async function ValidaLogin(req, res, next){
    try {
        let msgValidacao = "";
        const login = req.body;

        if (!login.username)
            msgValidacao += 'Usuário inválido.';
        
        if (!login.senha)
            msgValidacao += `${msgValidacao ? '\n' : ''}Senha inválida.`;

        if (!login.ipLogin)
            msgValidacao += `${msgValidacao ? '\n' : ''}IP não pode ser nulo.`;

        if (msgValidacao){
            res.status(enumUtils.httpStatusCode.unprocessableEntity).send({
                mensagem: msgValidacao
            });
        }else{
            next();
        }
    } catch (error) {
        res.sendStatus(enumUtils.httpStatusCode.internalServerError);
    }
}

async function RealizarLogin(loginRequest, callback){
    const login = await loginRepository.BuscaLoginUsuario(loginRequest.username);

    if (!login)
        callback(enumUtils.httpStatusCode.internalServerError, 'Erro ao buscar login');

    if (login && Array.isArray(login) && login.length === 0)
        callback(enumUtils.httpStatusCode.notFound, 'Login não encontrado');

    if (loginRequest.senha !== login.senha)
        callback(enumUtils.httpStatusCode.unauthorized, 'Senha incorreta');

    securityUtils.JwtSign({username: loginRequest.username, senha: loginRequest.senha, ipLogin: loginRequest.ipLogin}, process.env['SECRET_KEY'], callback);
    // jwt.sign({username: loginRequest.username, senha: loginRequest.senha, ipLogin: loginRequest.ipLogin}, process.env['SECRET_KEY'], (err, token) => {
    //     if (err){
    //         callback(enumUtils.httpStatusCode.internalServerError, 'Erro ao realizar o login', err);
    //     }else{
    //         callback(enumUtils.httpStatusCode.created, 'Login realizado com sucesso', token);
    //     }
    // });
}

module.exports = { CriaLogin, ValidaLogin, RealizarLogin }