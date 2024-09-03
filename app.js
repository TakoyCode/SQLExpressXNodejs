// Setting up express
const express = require('express');
const app = express();
app.use(express.json());

// Importing Joi
const Joi = require('joi');

// Importing database
const { sql } = require('./db');

// Setting up swagger
const { swaggerUi, swaggerSpec } = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- HTTP metods ---
app.get('/api/users', async (req, res) => {
    const request = new sql.Request();
    // Get all users
    await request.query('select * from users', (error, result) => {
        // Checks for errors
        if (error) return res.status(400).send(error.message);

        // Sends back all users
        res.send(result.recordset);
    });
});

app.get('/api/users/:id', (req, res) => {
    const request = new sql.Request();
    // Finds user
    request.query(`select * from users where Id = ${req.params.id}`, (error, result) => {
        // Checks for errors / or if we didn't find a user with the id
        if (error) return res.status(400).send(error.message);
        if (result.rowsAffected <= 0) return res.status(204).send('Could not find user.');

        // Sends back found user
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
        res.status(201).send(result.recordset[0]);
    });
});

app.put('/api/users/:id', (req, res) => {
    // Validates the data
    const { error } = ValidateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Deconstructs the data gotten from the req.body
    const { Name, Age, Email } = req.body;

    const request = new sql.Request();
    // Check if we got a user with same id
    request.query(`select * from users where Id = ${req.params.id}`, (error, result) => {
        // Checks for errors / or if we didn't find a user with the id
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
    // Find user
    request.query(`select * from users where Id = ${req.params.id}`, (error, result) => {
        // Checks for errors / or if we didn't find a user with the id
        if (error) return res.status(400).send(error.message);
        if (result.rowsAffected <= 0) return res.status(204).send('Could not find user.');

        // Delete user
        request.query(`DELETE FROM users OUTPUT DELETED.* Where ID = ${parseInt(req.params.id)};`, (error, result) => {
            if (error) return res.status(400).send(error.message);
            // Sends back deleted user
            res.send(result.recordset[0]);
        });
    });
});

// Using Joi to check if received data is valid
function ValidateUser(user) {
    const schema = Joi.object({
        Name: Joi.string().required(),
        Age: Joi.number().required(),
        Email: Joi.string().required(),
    });
    return schema.validate(user);
}

module.exports = { app };