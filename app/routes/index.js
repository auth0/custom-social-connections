var express = require('express');
var router = express.Router();

var env = {
  AUTH0_CLIENT_ID:    process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN:       process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL,
  AUTH0_SCOPES:       process.env.AUTH0_SCOPES
};

router.get('/login', function (req, res) {
  var redirectUri = [
    env.AUTH0_CALLBACK_URL,
    '&scope=' + encodeURIComponent(env.AUTH0_SCOPES),
    '&expiration=9999999999'
  ].join('');

  var authorizationUrl = [
    'https://auth0.auth0.com/i/oauth2/authorize',
    '?client_id=' + env.AUTH0_CLIENT_ID,
    '&response_type=token',
    '&redirect_uri=' + redirectUri
  ].join('');

  res.redirect(authorizationUrl);
});

router.get('/logout', function (req, res) {
  res.clearCookie('token');
  res.redirect('/');
});

router.get('/callback', function (req, res) {
  res.render('callback');
});

module.exports = router;
