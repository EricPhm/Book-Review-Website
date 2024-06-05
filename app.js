var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); // to use cookie
var logger = require('morgan');

require('dotenv').config()

// import different router modules into your Node.js application
var logged_inRouter = require('./routes/logged_in');
var usersRouter = require('./routes/unknownUser');
var log_inRouter = require('./routes/log_in');
var log_outRouter = require('./routes/log_out');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// to use cookie
app.use(cookieParser());

// These lines of code configure different routes in your Express application:
app.use('/logged_in', logged_inRouter); // tells Express to use the logged_inRouter middleware for any requests that match the /logged_in route or any of its subroutes.
app.use('/unknownUser', usersRouter);
app.use('/log_in', log_inRouter);
app.use('/log_out', log_outRouter);


// welcome page
app.get('/', (req, res) => {
  res.send('Welcome to client side of BOOK MANAGEMENT system');
})  



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// show login for MySQL database
// console.log(process.env.MYSQL_USERNAME);
// console.log(process.env.MYSQL_PASSWORD);
// console.log(process.env.MYSQL_DATABASE);


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
