var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
// var users = require('./routes/users');
var api = require('./routes/api');

var app = express();

var http = require('http').Server(app);

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
// app.use('/users', users);
app.use('/api', api);




// socket.io
// var io = require('socket.io')(http);

// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, 'public/index.html'));
// });
// var send = true;
// io.on('connection', function (socket) {
//     console.log("connected");
//     socket.on('chat message', function (msg) {
//         console.log(msg);
//         if (send) {
//             io.emit('chat message', msg);
//             send = false;
//         }
//     });
// });

// http.listen(3000, function () {
//     console.log('listening on *:3000');
// });

// Twitter-Stream

var Twit = require('twit')

var T = new Twit({
    consumer_key: 'NEcFV7WwVNlgt2PGzcLAd9yHs',
    consumer_secret: 'yrDRbggUfbWOkjHYDYHsfckBy9FLKX8f43340WVHgaTterodMJ',
    access_token: '545857883-mIGQyyOKbK0gLmjLE1WWchK4PfpaRittFiBb5irj',
    access_token_secret: 'dr0pOppvO8mONnRozgFDGTobuNfkQeYJKGJ6yx9Nn8Ega'
})

// getting stream from NYC
var stream = T.stream('statuses/filter', { locations: "-74,40,-73,41" })
// var stream = T.stream('statuses/sample')

stream.on('tweet', function (tweet) {
    var regex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    if (tweet.text.match(regex)) {
        console.log("match: " + tweet.text);
    } else {
        sendToDB(tweet);
    }
    // }
    // io.emit('chat message', tweet);
})


// Send to ElasticSearch
function sendToDB(tweet) {
    var id = tweet.id_str;
    if (tweet.coordinates == null) {
        tweet.coordinates = processBoundingBox(tweet.place.bounding_box.coordinates[0]);
    }
    tweet = {
        "text": tweet.text,
        "coordinates": tweet.coordinates
    }
    console.log(tweet);

    var http = require('http');
    var data = JSON.stringify(tweet);

    // An object of options to indicate where to post to
    var post_options = {
        // host: '127.0.0.1',
        // port: '9200',
        hostname: 'dori-us-east-1.searchly.com',
        path: '/twitter/tweet/' + id,
        method: 'POST',
        auth: 'paas:8fa0549c7855701ee173a9dbe37cbfd3'
        // headers: {
        //     'Content-Type': 'application/json',
        //     'Content-Length': Buffer.byteLength(data)
        // }
    };

    // Set up the request
    var post_req = http.request(post_options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
    }).on('error', function (e) {
        console.log(e)
    });
    // post the data
    post_req.write(data);
    post_req.end();
}

function processBoundingBox(box) {
    var coordinates = box.reduce(function (pre, cur) {
        return [pre[0] + cur[0], pre[1] + cur[1]];
    }).map(function (c) {
        return c / 4;
    })
    // return {
    //     "coordinates": {
    //         "type": "Point",
    //         "coordinates": coordinates
    //     }
    // }
    return coordinates;
}


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

module.exports = app;


