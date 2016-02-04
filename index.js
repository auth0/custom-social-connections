var express  = require('express');
var auth0    = require('auth0-oauth2-express');
var Webtask  = require('webtask-tools');
var app      = express();
var template = require('./templates/index.jade');

////////////// DEVELOPMENT //////////////
if ((process.env.NODE_ENV || 'development') === 'development') {
  var token = require('crypto').randomBytes(32).toString('hex');

  app.use(function (req, res, next) {
    req.webtaskContext = {
      data: {
        TOKEN_SECRET: token // This will be automatically provisioned once the extensions is installed
      }
    };

    next();
  });
}
////////////// DEVELOPMENT //////////////

app.use(auth0({
  clientName: 'Custom Social Connections',
  scopes:     'read:connections create:connections update:connections delete:connections read:clients'
}));

app.get('/', function (req, res) {
  res.header("Content-Type", 'text/html');
  res.status(200)
  .send(template({
    baseUrl: res.locals.baseUrl
  }));
});

if ((process.env.NODE_ENV || 'development') === 'development') {
  app.use(express.static(__dirname + '/public'));
  app.listen(3000);
} else {
  module.exports = Webtask.fromExpress(app);
}
