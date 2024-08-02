const http = require('http')
const httpProxy = require('http-proxy')
const validateUser = require('./validate')

const config = require('./config')

const proxy = httpProxy.createProxyServer({})

proxy.on('error', function (err) {
  console.error(err)
})

const server = http.createServer(function (req, res) {
  if (config.whitelist) {
    const path = req.url
    const whitelisted = config.whitelist.find(function (whitelist) {
      const matchingMethod = !whitelist.method || whitelist.method === req.method
      const matchingPath = path === whitelist.path
      return matchingMethod && matchingPath
    })

    if (whitelisted) {
      console.log(path + ' is whitelisted')
      return proxy.web(req, res, { target: config.target })
    }
  }

  validateUser(req, function (err) {
    if (err) {
      res.statusCode = 401;
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
