const enumUtils = require('./enum');
const jwt = require('jsonwebtoken');
const logErroService = require('../service/logErro')
const local = 'SecurityUtils'

function ValidaToken(req, res, next){
    try {
        const bearerHeader = req.headers['authorization'];
        if (bearerHeader){
            const bearerToken = bearerHeader.split(' ')[1];
            req.token = bearerToken;
            next();
        }else{
            res.sendStatus(403);
        }
    } catch (error) {
        res.sendStatus(500);
    }
}

function JwtSign(user, secretKey, callback){
    jwt.sign({username: user.username, senha: user.senha, ipLogin: user.ipLogin}, secretKey, (err, token) => {
        if (err){
            callback(enumUtils.httpStatusCode.internalServerError, 'Erro ao realizar o login', err);
        }else{
            callback(enumUtils.httpStatusCode.created, 'Login realizado com sucesso', token);
        }
    });
}

async function JwtVerify(req, res, next){//(token, secretKey){
    try {
        jwt.verify(req.token, process.env['SECRET_KEY'], (err, authData) => {
            if (err){
                throw new Error(err);//callback(enumUtils.httpStatusCode.forbidden, 'Acesso negado', err);
            }else{
                req.app.locals.authData = authData;
                next();
            }
        });     
    } catch (error) {
        console.log(error);
        await logErroService.EnviaLogErro({
            local: local,
            metodo: 'JWT VERIFY',
            descricao: error, 
            usuarioLogado: 'Sistema'
        });
        res.status(enumUtils.httpStatusCode.internalServerError).send({
            status: enumUtils.httpStatusCode.internalServerError,
            mensagem: msgValidacao,
            response: null
        });
    }
}

module.exports = { ValidaToken, JwtSign, JwtVerify };