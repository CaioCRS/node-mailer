const status = {
    ativo: 1,
    inativo: 2,
    revisao: 3
}

const tipoDocumento = {
    rg: 1,
    cpf: 2
}

const httpStatusCode = {
    ok: 200,
    created: 201,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    unprocessableEntity: 422,
    internalServerError: 500
}

const tabelas = {
    status: 'status',
    pais: 'pais',
    estado: 'estado',
    cidade: 'cidade',
    bairro: 'bairro',
    tipoDocumento: 'tipo_documento',
    genero: 'genero',
    usuario: 'usuario',
    documento: 'documento',
    login: 'login',
    parceiro: 'parceiro',
    categoria: 'categoria',
    item: 'item',
    promocao: 'promocao',
    unidade: 'unidade',
    solicitacaoDoacao: 'solicitacao_doacao',
    solicitacaoAtendida: 'solicitacao_atendida',
    imagemPedido: 'imagem_pedido',
    filtro: 'filtro',
    logErro: 'log_erro'
}

module.exports = { status, tipoDocumento, tabelas, httpStatusCode }