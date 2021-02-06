const logErroRepository = require('../repository/logErro')
const moment = require('moment');

async function EnviaLogErro(log){
    try {
        const colunasLog = "local, metodo, descricao, usuario_logado, data";
        const valoresLog = [`${log.local}`, `${log.metodo}`, `${log.descricao}`, `${log.usuarioLogado}`, moment().format('YYYY-MM-DD, hh:mm:ss')];

        await logErroRepository.InserirLogErro(colunasLog, valoresLog);
    } catch (error) { }
};

module.exports = { EnviaLogErro }