async function ValidaCpf(cpf) {
    let soma;
    let resto;
    soma = 0;

    if (cpf == "00000000000") 
        return false;

    for (i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;

    if ((resto == 10) || (resto == 11)) resto = 0;
    if (resto != parseInt(cpf.substring(9, 10))) 
        return false;

    soma = 0;
    for (i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;

    if ((resto == 10) || (resto == 11)) resto = 0;
    if (resto != parseInt(cpf.substring(10, 11))) 
        return false;

    return true;
}

async function ValidaCaracteresEspeciais(valor){
    const regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return regex.test(valor);
}

async function ValidaEmail(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
}

async function MapeiaObjeto(origem, destino){
    for(let chave of Object.keys(origem)){
        if (chave in destino)
            destino[chave] = origem[chave];
    }
    return destino;
}

module.exports = { ValidaCpf, ValidaCaracteresEspeciais, ValidaEmail, MapeiaObjeto }