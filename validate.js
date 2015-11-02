var Cookies = require('cookies');
var request = require('request');

var config = require('./config');

var validUsers = {};

function fetchUser(id, cb) {
  request('http://www.anrop.se/api/users/' + id, {json: true}, function (err, resp, body) {
    if (err) {
      cb(err);
    } else {
      cb(null, body);
    }
  });
}

function validateUser(userId, cb) {
  fetchUser(userId, function (err, user) {
    if (err) {
      console.error(err);
      cb(err);
    } else {
      console.log(user);

      if (user.groups && user.groups.indexOf(config.group) > -1) {
        validUsers[userId] = user;
        console.log('User is allowed access');
        cb(null);
      } else {
        console.log('User did not have correct group');
        cb(new Error("Unauthorized"));
      }
    }
  });
}

module.exports = function (req, cb) {
  cookies = new Cookies(req);
  var userCookie = cookies.get('fusionGppEM_user');

  if (userCookie) {
    var userCookieData = userCookie.split('.');
    var userId = userCookieData[0];
    var expiration = userCookieData[1];
    var hash = userCookieData[2];

    if (validUsers[userId]) {
      console.log('User is already allowed access');
      cb(null);
    } else {
      validateUser(userId, cb);
    }
  } else {
    console.log('No cookie found in request');
    cb(new Error("Unauthorized"));
  }
};
