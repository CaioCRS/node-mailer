const baseRepository = require('./base');
const enumUtils = require('../utils/enum');

async function InserirLogin(colunas, valores){
    return await baseRepository.InsertComum(enumUtils.tabelas.login, colunas, valores);
}

async function BuscaLoginUsuario(username){
    const connection = await mysql.getConnection();
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT * FROM login l WHERE l.username = ?;`, 
            [username], (error, result, fields) => {
                connection.release();
                if (error){
                    reject(error);
                }
                else{
                    resolve(result);
                }
            }
        );
    });
}

module.exports = { InserirLogin, BuscaLoginUsuario }