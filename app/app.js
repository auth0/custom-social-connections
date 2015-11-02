var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var dotenv       = require('dotenv');

dotenv.load();

var authenticationMiddleware = require('./middlewares/authenticationMiddleware');

var routes = require('./routes/index');
var app    = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/', authenticationMiddleware);

app.use('/sucess', function (req, res, next) {
  var accessToken = req.query.accessToken;

  res.cookie('token', accessToken);
  res.redirect('/');
});

app.get('/', function (req, res, next) {
  var context = req.context;

  res.render('index', {context: context});
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

if (app.get('env') === 'development') {
  app.use(require('connect-livereload')());
}

if (!module.parent) {
  app.use(logger('dev'));
  app.listen(process.env.PORT || 3000);
}

// module.exports = app;
