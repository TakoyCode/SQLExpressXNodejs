const sql = require('mssql');
require('dotenv').config();

const sqlConfig = {
    user: process.env.SQLUSER,
    password: process.env.SQLPASS,
    database: process.env.DATABASE,
    server: process.env.SERVER,
    options: {
        trustServerCertificate: true, //true for local dev / self-signed certs
    }
}

sql.connect(sqlConfig, (error) => {
    if (error) console.error(error);
    // else console.log('Connected to database.');
});

module.exports = sql;