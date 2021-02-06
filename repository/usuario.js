const baseRepository = require('./base');
const enumUtils = require('../utils/enum');
const mysql = require('./db');

async function VerificaUsuarioExistentePorDocumento(tipoDocumento, documento){
    const connection = await mysql.getConnection();
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT * FROM documento d WHERE d.tipo_documento_id = ? AND d.descricao = ?;`, 
            [tipoDocumento, documento], (error, result, fields) => {
                connection.release();
                if (error){
                    reject(error);
                }
                else{
                    resolve(result.length > 0);
                }
            }
        );
    });
}

async function InserirUsuario(colunas, valores){
    let teste = await baseRepository.InsertComum(enumUtils.tabelas.usuario, colunas, valores);
    console.log(teste);
    return teste;
}

module.exports = { VerificaUsuarioExistentePorDocumento, InserirUsuario }