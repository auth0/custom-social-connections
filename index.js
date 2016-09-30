var express  = require('express');
var auth0    = require('auth0-oauth2-express');
var Webtask  = require('webtask-tools');
var app      = express();
var template = require('./views/index.jade');

app.use(function (req, res, next) {
  auth0({
    clientName: 'Custom Social Connections',
    scopes:     'read:connections create:connections update:connections delete:connections read:clients',
    audience:   function (req) {
      return 'https://'+req.webtaskContext.data.AUTH0_DOMAIN+'/api/v2/';
    },
    rootTenantAuthority: req.webtaskContext.data.AUTH0_RTA
  })(req, res, next);
});

app.get('/', function (req, res) {
  res.header("Content-Type", 'text/html');
  res.status(200)
  .send(template({
    baseUrl: res.locals.baseUrl,
    manageUrl: req.webtaskContext.data.AUTH0_MANAGE_URL || 'http://manage.auth0.com',
    rta: req.webtaskContext.data.AUTH0_RTA || 'https://auth0.auth0.com'
  }));
});

module.exports = app;
