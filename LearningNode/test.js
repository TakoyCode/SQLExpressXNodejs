const express = require('express');
const app = express();

const sql = require('mssql');

const sqlConfig = {
    user: process.env.SQLUSER,
    password: process.env.SQLPASS,
    database: process.env.DATABASE,
    server: process.env.SERVER,
    options: {
        trustServerCertificate: true, //true for local dev / self-signed certs
    }
}

connectToDatabase();
async function connectToDatabase() {
    try {
        await sql.connect(sqlConfig);
        console.log('Connected to database.');
    }
    catch (error) {
        console.error(error);
    }
}

app.get('/api', async (req, res) => {
    res.send("Bing")
});

const port = 3000;
app.listen(port, () => { console.log(`Listening on port ${port}...`) });