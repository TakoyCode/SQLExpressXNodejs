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

async function connectToDatabase() {
    try {
        await sql.connect(sqlConfig);
        console.log('Connected to database.');
    }
    catch (error) {
        console.error(error);
    }
}

async function closeConnection() {
    await sql.close();
    console.log('Closed connection to the database.');
}

module.exports = { sql, connectToDatabase, closeConnection, };