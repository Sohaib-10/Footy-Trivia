const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const reqPath = new URL(req.url, 'http://localhost').pathname;
  const reqUrl = reqPath === '/' ? '/index.html' : reqPath;
  const filePath = path.join(__dirname, decodeURIComponent(reqUrl));
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('Not Found');
    } else {
      let contentType = 'text/html';
      if (filePath.endsWith('.css')) contentType = 'text/css';
      if (filePath.endsWith('.js')) contentType = 'text/javascript';
      res.writeHead(200, {'Content-Type': contentType});
      res.end(data);
    }
  });
});

server.listen(9999, () => {
  console.log('Server running on http://localhost:9999/');
});
