var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyparser = require('body-parser')
const admin = require('./firebase-config')
const { v4: uuidv4 } = require('uuid');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();
app.use(bodyparser.json())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const notification_options = {
  priority: "high",
  timeToLive: 60 * 60 * 24
};

let devices = {}

app.post('/register', (req, res) => {
  const registrationToken = req.body.token
  const uuid = uuidv4();
  devices[uuid] = registrationToken
  if (registrationToken) {
    res.send({ "data": uuid })
    // res.status(200).send("Device registered")
  }
  else {
    res.send("Token not found")
  }
})

app.post('/sendNotification', (req, res) => {
  // const registrationToken = req.body.token
  const uuid = req.body.uuid;
  const registrationToken = devices[uuid]
  // const message_notification = {
  //   notification: {
  //     title: "Hello",
  //     body: "Hello World"
  //   },
  //   token: registrationToken
  // };
  let message = {
    notification:{
      body: "hello world",
      title: "hello"
    },
    data: {
      score: '850',
      time: '2:45'
    },
    token: registrationToken
  };
  // const options = notification_options

  if (registrationToken) {
    admin.messaging().send(message)
      .then(response => {
        return res.status(200).send("Notification sent successfully" + response)
      })
      .catch(error => {
        return console.log(error);
      });
  }
  else {
    return res.send("Token not found")
  }


})

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
