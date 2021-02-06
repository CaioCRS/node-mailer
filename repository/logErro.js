const baseRepository = require('./base');
const enumUtils = require('../utils/enum');

async function InserirLogErro(colunas, valores){
    return await baseRepository.InsertComum(enumUtils.tabelas.logErro, colunas, valores);
}

module.exports = { InserirLogErro }