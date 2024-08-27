const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.write('Bing');
        res.end();
    };

    if (req.url === '/api') {
        response = JSON.stringify([1, 2, 3]);
        res.write(response);
        res.end();
    };
})

server.listen(3000);

console.log('Listening on port 3000...')