const sql = require('mssql');
const express = require('express');
const { options } = require('joi');

const app = express();
app.use(express.json());

const sqlConfig = {
    user: 'sa',
    password: 'SQLEXPRESS',
    database: 'ExpressXNode',
    server: 'localhost',
    options: {
        trustServerCertificate: true, //true for local dev / self-signed certs
    }
}

sql.connect(sqlConfig, (error) => {
    if (error) console.error(error);
    else console.log('Connected to database.')
});


app.get('/api/users', (req, rep) => {
    const request = new sql.Request();

    request.query('select * from users', (error, result) => {
        rep.send(result.recordset);
    });
});

app.get('/api/users/:id', (req, rep) => {
    const request = new sql.Request();

    request.query(`select * from users where Id = ${parseInt(req.params.id)}`, (error, result) => {
        if (result.rowsAffected <= 0) return rep.status(404).send('Could not find user.');

        rep.send(result.recordset[0]);
    });
});

app.post('/api/users', (req, rep) => {
    const user = {
        Name: req.body.Name,
        Age: parseInt(req.body.Age),
        Email: req.body.Email,
    };

    const request = new sql.Request();
    request.query(`INSERT INTO users (Name, Age, Email) VALUES ('${user.Name}', ${user.Age}, '${user.Email}')`, (error, result) => {

        if (error) rep.status(400).send(error.message);
        else rep.send(result);
        console.log(result);
    });
});

app.put('/api/users/:id', (req, rep) => {
    const user = {
        Name: req.body.Name,
        Age: parseInt(req.body.Age),
        Email: req.body.Email,
    };

    const request = new sql.Request();
    request.query(`UPDATE users SET Name = '${user.Name}', Age = ${user.Age}, Email = '${user.Email}' Where ID = ${req.params.id};`, (error, result) => {
        if (error) rep.status(400).send(error.message);
        else rep.send(result);
        console.log(result);
    });
});

app.delete('/api/users/:id', (req, rep) => {
    const request = new sql.Request();
    request.query(`DELETE FROM users Where ID = ${parseInt(req.params.id)};`, (error, result) => {
        if (error) rep.status(400).send(error.message);
        else rep.send(result);
    });
});

const port = process.env.PORT | 3000;
app.listen(port, () => { console.log(`Listening on port ${port}...`) });