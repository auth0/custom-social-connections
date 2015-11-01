var jwt     = require('jsonwebtoken');
var request = require('request');

module.exports = function authenticationMiddleware(req, res, next) {
  var token = req.cookies.token;

  if (typeof req.cookies.token === 'undefined') {
    res.redirect('/login');
  } else {
    var audience = jwt.decode(token).aud;

    request({
      method:  'GET',
      uri:     audience + 'clients',
      json:    true,
      headers: {
        Authorization: 'Bearer ' + token
      }
    }, function (error, message, response) {
      if (!response.error) {
        req.context = {
          accessToken: token,
          apiPath:    'api/v2/',
          baseUri:    audience.replace('/api/v2', ''),
          clientId:   response.pop().client_id
        };
        next();
      } else {
        res.redirect('/login');
      }
    });
  }
};
