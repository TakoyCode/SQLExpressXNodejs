const express = require("express");
const sql = require("mssql");

const app = express();
app.use(express.json());

const config = {
    user: "sa",
    password: "SQLEXPRESS",
    server: "localhost",
    database: "ExpressXNode",
    options: {
        trustServerCertificate: true,
    },
};

sql.connect(config, (err) => {
    if (err) console.error(err);
    else console.log("Connected to the database.");
});