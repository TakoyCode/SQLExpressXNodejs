const express = require('express');
const Joi = require('joi');


const app = express();
app.use(express.json());

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
    else console.log('Connected to database.');
});//

// Makes a connection to the SQL express server
// const sql = require('./db');

app.get('/api/users', (req, res) => {
    const request = new sql.Request();
    request.query('select * from users', (error, result) => {
        console.log(error); // HER ER TEST FEILEN
        if (error) return res.status(207).send(error.message);
        res.send(result.recordset);
    });
});

app.get('/api/users/:id', (req, res) => {
    const request = new sql.Request();
    request.query(`select * from users where Id = ${req.params.id}`, (error, result) => {
        if (error) return res.status(400).send(error.message);
        if (result.rowsAffected <= 0) return res.status(204).send('Could not find user.');

        res.send(result.recordset[0]);
    });
});

app.post('/api/users', (req, res) => {
    // Validates the data
    const { error } = ValidateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Creates a object with the data
    const { Name, Age, Email } = req.body;

    // Create new user in users table
    const request = new sql.Request();
    request.query(`INSERT INTO users (Name, Age, Email) OUTPUT INSERTED.* VALUES ('${Name}', ${Age}, '${Email}');`, (error, result) => {
        // Checks for error
        if (error) return res.status(400).send(error.message);

        // Sends the inputed user back
        res.send(result.recordset[0]);
    });
});

app.put('/api/users/:id', (req, res) => {
    // Validates the data
    const { error } = ValidateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Creates a object with the data
    const { Name, Age, Email } = req.body;

    const request = new sql.Request();
    request.query(`select * from users where Id = ${req.params.id}`, (error, result) => {
        // Check if we got a user
        if (error) return res.status(400).send(error.message);
        if (result.rowsAffected <= 0) return res.status(204).send('Could not find user.');

        // Update user
        request.query(`UPDATE users SET Name = '${Name}', Age = ${Age}, Email = '${Email}' OUTPUT inserted.*, 
                        inserted.ID as old_ID, deleted.Name as old_Name, deleted.Age as old_Age, deleted.Email as old_Email Where ID = ${req.params.id};`,
            (error, result) => {
                if (error) return res.status(400).send(error.message);
                // Sends updated user back
                res.send(result.recordset[0]);
            });
    });
});

app.delete('/api/users/:id', (req, res) => {
    const request = new sql.Request();
    //Find user
    request.query(`select * from users where Id = ${req.params.id}`, (error, result) => {
        // Check if we got a user
        if (error) return res.status(400).send(error.message);
        if (result.rowsAffected <= 0) return res.status(204).send('Could not find user.');

        // Delete user
        request.query(`DELETE FROM users OUTPUT DELETED.* Where ID = ${parseInt(req.params.id)};`, (error, result) => {
            if (error) return res.status(400).send(error.message);
            // Send back deleted user
            res.send(result.recordset[0]);
        });
    });
});

function ValidateUser(user) {
    const schema = Joi.object({
        Name: Joi.string().required(),
        Age: Joi.number().required(),
        Email: Joi.string().required(),
    });
    return schema.validate(user);
}

module.exports = app;
// const port = process.env.PORT || 5000;
// app.listen(port, () => { console.log(`Listening on port ${port}...`) });