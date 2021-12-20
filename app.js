require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const fileUpload = require('express-fileupload')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var roomsRouter = require('./routes/rooms');
var hotelsRouter = require('./routes/hotels');
var paymentRouter = require('./routes/payment');
var requestRouter = require("./routes/request")
const connect = require('./db/connect');
connect()

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true
}))
app.use(express.static(path.join(__dirname, 'public')));


app.use('/rooms', roomsRouter);
app.use('/hotels', hotelsRouter);
app.use('/order', paymentRouter);
app.use('/users', usersRouter);
app.use('/request',requestRouter)
app.use('/api', require('./routes/upload'))

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
  res.json({
    mes: err.message
  });
});

module.exports = app;
