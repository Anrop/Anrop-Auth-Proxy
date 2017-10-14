var http = require('http')
var httpProxy = require('http-proxy')
var validateUser = require('./validate')

var config = require('./config')

var proxy = httpProxy.createProxyServer({})

var server = http.createServer(function (req, res) {
  if (config.whitelist) {
    var path = req.url
    var whitelisted = config.whitelist.find(function (whitelist) {
      var matchingMethod = !whitelist.method || whitelist.method === req.method
      var matchingPath = path === whitelist.path
      return matchingMethod && matchingPath
    })

    if (whitelisted) {
      console.log(path + ' is whitelisted')
      return proxy.web(req, res, { target: config.target })
    }
  }

  validateUser(req, function (err) {
    if (err) {
      res.write('Authorize yourself at anrop.se first')
      res.end()
    } else {
      proxy.web(req, res, { target: config.target })
    }
  })
})

server.on('upgrade', function (req, socket, head) {
  validateUser(req, function (err) {
    if (err) {
      socket.destroy(new Error('Authorize yourself at anrop.se first'))
    } else {
      proxy.ws(req, socket, head, { target: config.target })
    }
  })
})

console.log('listening on port ' + config.port)
server.listen(config.port)
