var Cookies = require('cookies')
var request = require('request')

var config = require('./config')

var validUsers = {}

function fetchUser (token, cb) {
  var cookie = request.cookie(config.cookie + '=' + token)
  var url = 'https://www.anrop.se'
  var jar = request.jar()
  jar.setCookie(cookie, url)

  request('https://www.anrop.se/api/users/current', {jar: jar, json: true}, function (err, resp, body) {
    if (err) {
      cb(err)
    } else {
      cb(null, body)
    }
  })
}

function validateUser (userId, cb) {
  fetchUser(userId, function (err, user) {
    if (err) {
      console.error(err)
      cb(err)
    } else {
      console.log(user)

      if (user.groups && user.groups.indexOf(config.group) > -1) {
        validUsers[userId] = user
        console.log('User is allowed access')
        cb(null)
      } else {
        console.log('User did not have correct group')
        cb(new Error('Unauthorized'))
      }
    }
  })
}

module.exports = function (req, cb) {
  var cookies = new Cookies(req)
  var token = cookies.get(config.cookie)

  if (token) {
    if (validUsers[token]) {
      console.log('User is already allowed access')
      cb(null)
    } else {
      validateUser(token, cb)
    }
  } else {
    console.log('No cookie found in request')
    cb(new Error('Unauthorized'))
  }
}
