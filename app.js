var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var HandlebarsIntl = require("handlebars-intl");
var hbs = require('hbs');
var passport = require("passport"),
LocalStrategy = require('passport-local').Strategy;
var User = require("./models/user");
var Post = require("./models/post");

var indexRouter = require('./routes/index');
var auth = require('./routes/auth');
var admin = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', auth);
app.use('/admin', admin);

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Mongoose
var mongoose = require('mongoose');
useMongoClient: true,
mongoose.connect('mongodb://dec0mpiled:welcometor4ge@ds012678.mlab.com:12678/freespeech');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connect to FreeSpeech Database: SUCCESS CODE 1");
});


hbs.registerHelper('isblank', function(lvalue, options) {
    if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
    if( lvalue!="" ) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});

hbs.registerHelper('equal', function(lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
    if( lvalue!=rvalue ) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});

hbs.registerHelper('ifgr', function(v1, v2, options) {
  if(v1 > v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('ifeq', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('ifneq', function(v1, v2, options) {
  if(v1 != v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('or', function(v1, v2, v3, v4, options) {
  if(v1 == v2 || v3==v4) {
    return options.fn(this);
  }
  return options.inverse(this);
});

HandlebarsIntl.registerWith(hbs);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
