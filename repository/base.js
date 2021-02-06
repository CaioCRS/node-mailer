const mysql = require('./db');

async function SelectTodosComum(tabela){
    const connection = await mysql.getConnection();
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT * FROM ${tabela};`, 
            (error, result, fields) => {
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

// async function SelectPorIdComum(tabela, id){
//     const conn = await connect();
//     const [rows] = await conn.query(`SELECT * FROM ${tabela} WHERE id = ?;`, [id]);
//     return rows;
// }

async function InsertComum(tabela, colunas, valores){
    let values = '';
    for (let index = 0; index < valores.length; index++)
        values += index === 0 ? '?' : ',?';

    const connection = await mysql.getConnection();
    return new Promise((resolve, reject) => {
        connection.query(
            `INSERT INTO ${tabela} (${colunas}) VALUES (${values});`, 
            valores, (error, result, fields) => {
                connection.release();
                if (error){
                    reject(error);
                }
                else{
                    resolve(result.insertedId);
                }
            }
        );
    });
}

// async function UpdateComum(tabela, colunas, valores, id){
//     const conn = await connect();

//     let setValues = '';
//     let values = [];

//     colunas.forEach(function (coluna, i) {
//         setValues += i === 0 ? `${coluna}=?` : `,${coluna}=?`;
//         values.push(valores[i]);
//     });
//     values.push(id);
//     const sql = `UPDATE ${tabela} SET ${setValues} WHERE id=?`;
//     return await conn.query(sql, values);
// }

// async function DeleteComum(tabela,id){
//     const conn = await connect();
//     const sql = `DELETE FROM ${tabela} where id=?;`;
//     return await conn.query(sql, [id]);
// }

module.exports = { SelectTodosComum, InsertComum };//{ SelectTodosComum, SelectPorIdComum, InsertComum, UpdateComum, DeleteComum }
