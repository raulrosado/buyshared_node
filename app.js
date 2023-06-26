var createError = require('http-errors');
var express = require('express');
var passport = require('passport');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
require('./utils/auth/index');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiUsersV1 = require('./routes/v1/User_api');
var apiListV1 = require('./routes/v1/List_api');
var apiTaskV1 = require('./routes/v1/Task_api');
var apiEventV1 = require('./routes/v1/Event_api');
var invitation_apiV1 = require('./routes/v1/Invitation_api');

var apiEventV2 = require('./routes/v2/Event_api');
var apiListV2 = require('./routes/v2/List_api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var corsOptions = {
  origin: "*",
};
// app.options('*', cors())
app.use(cors({
    origin: '*'
}));
// app.use(cors());
app.use(passport.initialize()); // passport

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static('images'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/v1/api/user', apiUsersV1);
app.use('/v1/api', apiUsersV1);
app.use('/v1/api/list', apiListV1);
app.use('/v1/api/task', apiTaskV1);
app.use('/v1/api/event', apiEventV1);
app.use('/v1/api/solicitudes',invitation_apiV1);
app.use('/v2/api/event', apiEventV2);
app.use('/v2/api/list', apiListV2);

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
