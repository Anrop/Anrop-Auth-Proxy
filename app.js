var http = require('http');
var httpProxy = require('http-proxy');
var validateUser = require('./validate');

var config = require('./config');

var proxy = httpProxy.createProxyServer({});

var server = http.createServer(function(req, res) {
  validateUser(req, function (err) {
    if (err) {
      res.write("Authorize yourself at anrop.se first");
      res.end();
    } else {
      proxy.web(req, res, { target: config.target });
    }
  });
});

server.on('upgrade', function (req, socket, head) {
  validateUser(req, function (err) {
    proxy.ws(req, socket, head, { target: config.target });
  });
});

console.log("listening on port 8080");
server.listen(8080);
