const Joi = require('joi');
const sql = require('mssql');
const express = require('express');

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


app.get('/api/users', (req, res) => {
    const request = new sql.Request();
    request.query('select * from users', (error, result) => {
        if (error) return res.status(400).send(error.message);
        res.send(result.recordset);
    });
});

app.get('/api/users/:id', (req, res) => {
    const request = new sql.Request();
    request.query(`select * from users where Id = ${req.params.id}`, (error, result) => {
        if (result.rowsAffected <= 0) return res.status(404).send('Could not find user.');

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
    request.query(`INSERT INTO users (Name, Age, Email) VALUES ('${Name}', ${Age}, '${Email}'); SELECT SCOPE_IDENTITY() AS ID;`, (error, result) => {
        // Checks for error
        if (error) return res.status(400).send(error.message);

        // Sends the inputed user back
        // Usikker om jeg skal skal query databasen for den nye brukeren og sende resultatet av det tilbake,
        // eller lage en ny variabel og sende den tilbake  
        request.query(`select * from users where Id = ${result.recordset[0].ID}`, (error, result) => {
            if (error) return res.status(404).send(error.message);
            res.send(result.recordset[0]);
        });
        // const user = {
        //     ID: result.recordset[0].ID,
        //     Name: req.body.Name,
        //     Age: parseInt(req.body.Age),
        //     Email: req.body.Email,
        // };
        // res.send(user);
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
        if (result.rowsAffected <= 0) return res.status(404).send('Could not find user.');

        // Update user
        request.query(`UPDATE users SET Name = '${Name}', Age = ${Age}, Email = '${Email}' Where ID = ${req.params.id};`, (error, result) => {
            if (error) return res.status(400).send(error.message);

            // Sends updated user back
            request.query(`select * from users where Id = ${req.params.id}`, (error, result) => {
                if (error) return res.status(404).send(error.message);
                res.send(result.recordset[0]);
            });
        });
    });
});

app.delete('/api/users/:id', (req, res) => {
    const request = new sql.Request();
    //Find user
    request.query(`select * from users where Id = ${req.params.id}`, (error, result) => {
        // Check if we got a user
        if (result.rowsAffected <= 0) return res.status(404).send('Could not find user.');
        // Save user
        const user = result.recordset[0];

        // Delete user
        request.query(`DELETE FROM users Where ID = ${parseInt(req.params.id)};`, (error, result) => {
            if (error) return res.status(400).send(error.message);
            // Send back deleted user
            res.send(user);
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

const port = process.env.PORT | 3000;
app.listen(port, () => { console.log(`Listening on port ${port}...`) });

