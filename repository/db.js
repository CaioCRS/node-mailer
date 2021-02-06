const mysql = require('mysql2');

var pool = mysql.createPool({
    "user": process.env['USER_MYSQL'],
    "password": process.env['PASSWORD_MYSQL'],
    "database": process.env['DATABASE_MYSQL'],
    "host": process.env['HOST_MYSQL'],
    "port": process.env['PORT_MYSQL']
});

exports.getConnection = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                return reject(err);
            }
            resolve(connection);
        });
    });
};