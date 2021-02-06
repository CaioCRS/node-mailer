const baseRepository = require('./base');
const enumUtils = require('../utils/enum');

async function InserirFiltro(colunas, valores){
    return await baseRepository.InsertComum(enumUtils.tabelas.filtro, colunas, valores);
}

module.exports = { InserirFiltro }