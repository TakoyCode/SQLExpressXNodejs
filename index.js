// const { app, connectToDatabase } = require('./app');
const { app } = require("./app");
const { connectToDatabase } = require("./db");

process.env.DATABASE = 'ExpressXNode_Test';
connectToDatabase();

const port = process.env.PORT || 5000;
app.listen(port, () => { console.log(`Listening on port ${port}...`) });