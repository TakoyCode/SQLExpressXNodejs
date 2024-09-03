const { app } = require("./app");
const { connectToDatabase, closeConnection } = require("./db");

connectToDatabase();

const port = process.env.PORT || 5000;
app.listen(port, () => { console.log(`Listening on port ${port}...`) });

// Don't think i need this, but keeping it incase it doesn't close the connection
process.on('SIGINT', async () => {
    await closeConnection();
    process.exit();
})