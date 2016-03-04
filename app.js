var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Twitter-Map

var Twit = require('twit')

var T = new Twit({
  consumer_key:         'NEcFV7WwVNlgt2PGzcLAd9yHs',
  consumer_secret:      'yrDRbggUfbWOkjHYDYHsfckBy9FLKX8f43340WVHgaTterodMJ',
  access_token:         '545857883-mIGQyyOKbK0gLmjLE1WWchK4PfpaRittFiBb5irj',
  access_token_secret:  'dr0pOppvO8mONnRozgFDGTobuNfkQeYJKGJ6yx9Nn8Ega'
})

T.get('search/tweets', { q: 'banana since:2011-07-11', count: 100 }, function(err, data, response) {
  console.log(data)
})

var stream = T.stream('statuses/sample')



// var Twitter = require('twitter');

// var client = new Twitter({
//   consumer_key: "mkb4SJfnUDEtP5DuqdWl3sOWu",
//   consumer_secret: "JeYMNYqoQzX8kiHC33iTklgLcQ9upU2ftDvrKtFCrJFG8Cy8Th",
//   access_token_key: "545857883-RV7drTvRsUVygHIPGto7ozhwNd54GTs3xSmOhQDa",
//   access_token_secret: "16w3YvbvCjBxftVdVSncYLp9PmmnewlwCpr7Nw9oodrKi"
// });

// /**
//  * Stream statuses filtered by keyword
//  * number of tweets per second depends on topic popularity
//  **/
// client.stream('statuses/sample', function(stream) {
//   stream.on('message', function(tweet) {
//     console.log(tweet.text);
//   });

//   stream.on('error', function(error) {
//     throw error;
//   });
// });


// ///////////

// var tweets = require('tweets');

// var stream = new tweets({
//   consumer_key:         'NEcFV7WwVNlgt2PGzcLAd9yHs',
//   consumer_secret:      'yrDRbggUfbWOkjHYDYHsfckBy9FLKX8f43340WVHgaTterodMJ',
//   access_token:         '545857883-mIGQyyOKbK0gLmjLE1WWchK4PfpaRittFiBb5irj',
//   access_token_secret:  'dr0pOppvO8mONnRozgFDGTobuNfkQeYJKGJ6yx9Nn8Ega'
// });
// stream.on('message', function(t){
//     console.log("test");
//   console.log("Got a tweet!", t);
// });



module.exports = app;


