var express  = require('express');
var auth0    = require('auth0-oauth2-express');
var Webtask  = require('webtask-tools');
var app      = express();
var template = require('./templates/index.jade');

app.use(auth0({
  scopes: 'read:connections create:connections update:connections delete:connections read:clients'
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
