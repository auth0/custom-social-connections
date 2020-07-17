var express  = require('express');
var auth0    = require('auth0-oauth2-express');
var jwt      = require('jsonwebtoken');
var Webtask  = require('webtask-tools');
var app      = express();
var template = require('./views/index.jade');

app.use(function (req, res, next) {
  const rta =  req.webtaskContext.data.AUTH0_RTA || "https://auth0.auth0.com";

  auth0({
    clientName: 'Custom Social Connections',
    scopes:     'read:connections create:connections update:connections delete:connections read:clients',
    audience:   function (req) {
      return 'https://'+req.webtaskContext.data.AUTH0_DOMAIN+'/api/v2/';
    },
    rootTenantAuthority: rta,
    authenticatedCallback: function (req, res, accessToken, next) {
      /**
       * Note: We're normalizing the issuer because the access token `iss`
       * ends in a slash whereas the `AUTH0_RTA` secret does not.
       */
      var rta = req.webtaskContext.data.AUTH0_RTA || "https://auth0.auth0.com";
      var expectedIssuer = rta.endsWith("/") ? rta : rta + "/";
      var dtoken = jwt.decode(accessToken) || {};

      if (dtoken.iss !== expectedIssuer) {
        return res.json({
          message: "jwt issuer invalid. expected: " + expectedIssuer
        });
      }

      return next();
    },
  })(req, res, next);
});

app.get('/', function (req, res) {
  res.header("Content-Type", 'text/html');
  res.status(200)
  .send(template({
    baseUrl: res.locals.baseUrl,
    manageUrl: req.webtaskContext.data.AUTH0_MANAGE_URL || 'https://manage.auth0.com',
    rta: req.webtaskContext.data.AUTH0_RTA || 'https://auth0.auth0.com'
  }));
});

module.exports = app;
