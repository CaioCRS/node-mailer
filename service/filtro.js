const filtroRepository = require('../repository/filtro');

async function CriaFiltro(filtro){
    
    const colunasFiltro = 'usuario_id, faixa_etaria_inicio, faixa_etaria_fim, bairro_atendimento_id, cidade_atendimento_id, item_atendimento_id';
    const valoresFiltro = [filtro.usuarioId, filtro.faixaEtariaInicio, filtro.faixaEtariaFim, filtro.bairroAtendimentoId, filtro.cidadeAtendimentoId, filtro.itemAtendimentoId];
    let loginId = await filtroRepository.InserirFiltro(colunasFiltro, valoresFiltro);

    return !isNaN(loginId);
};

module.exports = { CriaFiltro }