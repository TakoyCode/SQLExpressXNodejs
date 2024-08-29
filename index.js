const app = require('./app');
// require('dotenv').config(); Usikker om jeg trenger den her også

const port = process.env.PORT || 5000;
app.listen(port, () => { console.log(`Listening on port ${port}...`) });