import '@babel/polyfill';
import http from 'http';
// ES6
const requestHandler = function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, Nataliia!');
};
const server = http.createServer(requestHandler);
server.listen(8080);
