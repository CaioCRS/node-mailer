const usuarioRepository = require('../repository/usuario');
const helpers = require('../utils/helpers');
const enumUtils = require('../utils/enum');
const moment = require('moment');
const model = require('../model/schemas');
const loginService = require('./login');
const emailService = require('./email');
const filtroService = require('./filtro');
const logErroService = require('./logErro');
const local = 'UsuarioService';

async function ValidaUsuario(req, res, next){
    try {
        let msgValidacao = "";
        const usuario = req.body;

        if (usuario.tipoDocumento === 0)
            msgValidacao += 'Tipo de documento inválido.';

        if (usuario.tipoDocumento > 0 && isNaN(usuario.documento))
            msgValidacao += `${msgValidacao ? '\n' : ''}Documento inválido.`;

        let usuarioExistente = false; //await usuarioRepository.VerificaUsuarioExistentePorDocumento(usuario.tipoDocumento, usuario.documento);
        
        if (!(typeof usuarioExistente === 'boolean'))
            res.sendStatus(500);

        if (usuarioExistente)
            msgValidacao += `${msgValidacao ? '\n' : ''}Documento já cadastrado.`;

        const documentoValido = usuario.tipoDocumento === enumUtils.tipoDocumento.cpf ? await helpers.ValidaCpf(usuario.documento) : true;
        if (!documentoValido)
            msgValidacao += `${msgValidacao ? '\n' : ''}Cpf inválido.`

        if (!usuario.nome)
            msgValidacao += `${msgValidacao ? '\n' : ''}Nome inválido.`;

        if (!usuario.genero)
            msgValidacao += `${msgValidacao ? '\n' : ''}Genero inválido.`;

        if (!usuario.dataNascimento || !moment(usuario.dataNascimento, 'YYYY-MM-DD').isValid())
            msgValidacao += `${msgValidacao ? '\n' : ''}Formato da data inválido.`

        const cepComCaractereEspecial = await helpers.ValidaCaracteresEspeciais(usuario.cep);
        if (!usuario.cep || cepComCaractereEspecial)
            msgValidacao += `${msgValidacao ? '\n' : ''}CEP inválido, informe somente os números.`

        const telefone1ComCaractereEspecial = usuario.telefone1 ? await helpers.ValidaCaracteresEspeciais(usuario.telefone1) : false;
        if (telefone1ComCaractereEspecial)
            msgValidacao += `${msgValidacao ? '\n' : ''}Telefone 1 inválido, informe somente os números.`
            
        const telefone2ComCaractereEspecial = usuario.telefone2 ? await helpers.ValidaCaracteresEspeciais(usuario.telefone2) : false;
        if (telefone2ComCaractereEspecial)
            msgValidacao += `${msgValidacao ? '\n' : ''}Telefone 2 inválido, informe somente os números.`

        const emailValido = await helpers.ValidaEmail(usuario.email);
        if (!usuario.email || (usuario.email && !emailValido))
            msgValidacao += `${msgValidacao ? '\n' : ''}E-mail inválido.`

        if (!usuario.cidadeId)
            msgValidacao += `${msgValidacao ? '\n' : ''}Cidade inválida.`

        if (usuario.faixaEtariaInicio < 0)
            msgValidacao += `${msgValidacao ? '\n' : ''}Faixa etária de início inválida.`
        
        if (!usuario.faixaEtariaFim)
            msgValidacao += `${msgValidacao ? '\n' : ''}Faixa etária de fim inválida.`

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

function GerarCodigoVerificacao (){
    return Math.floor(100000 + Math.random() * 900000);
}

async function EnviarEmailCodigoVerificacao(email, codigoVerificacao){
    try {
        await emailService.EnviaEmail({
            mailTo: email, 
            subject: "Verificação de e-mail - Código de verificação",
            text: `${codigoVerificacao}`
        }, (httpStatusCode, mensagem) => {
            //Validar ação após tentativa de e-mail de verificação
        });
    } catch (error) {
        await logErroService.EnviaLogErro({
            local: local,
            metodo: 'Envio de e-mail',
            descricao: `${email} - ${error}`, 
            usuarioLogado: `${req.app.locals.authData.username} - ${req.app.locals.authData.ipLogin}`
        });
    }
}

async function CriaUsuario(usuario, callback){
    let usuarioModel = model.schemas.usuario;
    // Id é deletado da estrutura por o mesmo ser autoincrement na base
    delete usuarioModel.id;
    const colunasUsuario = Object.keys(usuarioModel);
    usuarioModel = await helpers.MapeiaObjeto(usuario, usuarioModel);
    usuarioModel.data_nascimento = usuario.dataNascimento;
    usuarioModel.numero_endereco = usuario.numeroEndereco;
    usuarioModel.ponto_referencia = usuario.pontoReferencia;
    usuarioModel.bairro_id = usuario.bairroId;
    usuarioModel.cidade_id = usuario.cidadeId;
    usuarioModel.telefone_1 = usuario.telefone1;
    usuarioModel.telefone_2 = usuario.telefone2

    const usuarioId = await usuarioRepository.InserirUsuario(colunasUsuario.join(), Object.values(usuarioModel));
    if (!usuarioId)
        callback(enumUtils.httpStatusCode.internalServerError, 'Erro ao inserir o usuário');

    const codigoVerificacao = GerarCodigoVerificacao()

    const loginId = await loginService.CriaLogin({
        username: usuario.email,
        senha: usuario.senha,
        usuarioId,
        codigoVerificacao
    });

    await EnviarEmailCodigoVerificacao(usuario.email, codigoVerificacao);

    if (!loginId)
        callback(enumUtils.httpStatusCode.internalServerError, 'Erro ao inserir o login');

    if (usuario.contemFiltro){
        const perfilId = await filtroService.CriaFiltro({
            usuarioId,
            faixaEtariaInicio: usuario.faixaEtariaInicio,
            faixaEtariaFim: usuario.faixaEtariaFim,
            bairroAtendimentoId: usuario.bairroAtendimentoId,
            cidadeAtendimentoId: usuario.cidadeAtendimentoId,
            itemAtendimentoId: usuario.itemAtendimentoId
        });
    
        if (!perfilId)
            callback(enumUtils.httpStatusCode.internalServerError, 'Erro ao inserir o filtro');
    }

    callback(enumUtils.httpStatusCode.created, 'Usuário inserido com sucesso');
};

module.exports = { CriaUsuario, ValidaUsuario }