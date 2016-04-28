var express  = require('express');
var auth0    = require('auth0-oauth2-express');
var Webtask  = require('webtask-tools');
var app      = express();
var template = require('./views/index.jade');

app.use(auth0({
  clientName: 'Custom Social Connections',
  scopes:     'read:connections create:connections update:connections delete:connections read:clients',
  audience:   function (req) {
    return 'https://'+req.webtaskContext.data.AUTH0_DOMAIN+'/api/v2/';
  }
}));

app.get('/', function (req, res) {
  res.header("Content-Type", 'text/html');
  res.status(200)
  .send(template({
    baseUrl: res.locals.baseUrl
  }));
});

module.exports = app;
