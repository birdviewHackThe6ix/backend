var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var profileRouter = require('./routes/profileRouter');
const uploadRouter = require('./routes/uploadRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/profiles', profileRouter);
app.use('/imageUpload', uploadRouter);

app.use(express.static(path.join(__dirname, 'public')));

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const url = 'mongodb://localhost:27017/birdview';
// const url = 'mongodb+srv://birdview_client:birdy123@cluster0eupui.gcp.mongodb.net/test?retryWrites=true';
// const url = 'mongodb://birdview_client:birdy123@cluster0.mongodb.net/test';
// var url = 'mongodb://birdview_client:birdy123@mycluster0-shard-00-00.mongodb.net:27017,mycluster0-shard-00-01.mongodb.net:27017,mycluster0-shard-00-02.mongodb.net:27017/admin?ssl=true&replicaSet=Mycluster0-shard-0&authSource=admin';
const connect = mongoose.connect(url);
connect.then((client) => {
  console.log('Connected correctly to server');
})
  .catch((err) => console.log(err));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
