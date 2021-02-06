const schemas = {
    status: {
        id: null,
        descricao: null
    },
	pais: {
        id: null,
        nome: null,
		status: null
    },
	estado: {
        id: null,
        nome: null,
		pais_id: null,
		status: null
    },
	cidade: {
        id: null,
        nome: null,
		estado_id: null,
		status: null
    },
	bairro: {
        id: null,
        nome: null,
		cidade_id: null,
		status: null
    },
	tipo_documento: {
        id: null,
        descricao: null,
		status: null
    },
	genero: {
        id: null,
        descricao: null,
		status: null
    },
	usuario: {
        id: null,
		nome: null,
		genero: null,
		data_nascimento: null,
		cep: null,
		logradouro: null,
		numero_endereco: null,
		complemento: null,
		ponto_referencia: null,
		bairro_id: null,
		cidade_id: null,
		telefone_1: null,
		telefone_2: null,
		email: null,
		data_cadastro: null,
		status: null
    },
	documento: {
        id: null,
		tipo_documento_id: null,
		usuario_id: null,
		descricao: null,
		status: null
    },
	login: {
        id: null,
		usuario_id: null,
		username: null,
		senha: null,
		ip_login: null,
		data_ultimo_acesso: null,
		codigo_verificacao: null,
		data_envio_codigo: null,
		status: null
    },
	parceiro: {
        id: null,
		usuario_id: null,
		nome: null,
		data_cadastro: null,
		status: null
    },
	categoria: {
        id: null,
		descricao: null,
		status: null
    },
	item: {
        id: null,
		categoria_id: null,
		descricao: null,
		data_cadastro: null,
		status: null
    },
	promocao: {
        id: null,
		parceiro_id: null,
		item_id: null,
		descricao: null,
		url_promocao: null,
		data_cadastro: null,
		data_inicio: null,
		data_fim: null,
		status: null
    },
	unidade: {
        id: null,
		nome: null,
		cep: null,
		logradouro: null,
		numero_endereco: null,
		bairro_id: null,
		cidade_id: null,
		telefone: null,
		email: null,
		data_cadastro: null,
		status: null
    },
	solicitacao_doacao: {
        id: null,
		usuario_solicitante_id: null,
		unidade_id: null,
		nome_donatario: null,
		data_nascimento_donatario: null,
		cpf_donatario: null,
		cep_donatario: null,
		logradouro_donatario: null,
		num_endereco_donatario: null,
		ponto_referencia_donatario: null,
		bairro_donatario_id: null,
		cidade_donatario_id: null,
		telefone_donatario: null,
		email_donatario: null,
		data_cadastro: null,
		data_validade: null,
		item_solicitado_id: null,
		descricao_item: null,
		observacao: null,
		status: null
    },
	solicitacao_atendida: {
        id: null,
		usuario_doador_id: null,
		solicitacao_doacao_id: null,
		data_aceite: null,
		telefone_doador: null,
		email_doador: null,
		observacao: null,
		ocultar_nome: null,
		ocultar_contatos: null,
		status: null
    },
	imagem_pedido: {
        id: null,
		solicitacao_doacao_id: null,
		descricao: null,
		imagem: null
    },
	filtro: {
        id: null,
		usuario_id: null,
		faixa_etaria_inicio: null,
		faixa_etaria_fim: null,
		bairro_atendimento_id: null,
		cidade_atendimento_id: null,
		item_atendimento_id: null
	},
	log_erro: {
		id: null,
		local: null,
		metodo: null,
		descricao: null,
		usuario_logado: null,
		data: null
	}
}


module.exports = { schemas };