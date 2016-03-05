// Twitter-Stream

var http = require('http');
var Twit = require('twit')

var T = new Twit({
    consumer_key: 'NEcFV7WwVNlgt2PGzcLAd9yHs',
    consumer_secret: 'yrDRbggUfbWOkjHYDYHsfckBy9FLKX8f43340WVHgaTterodMJ',
    access_token: '545857883-mIGQyyOKbK0gLmjLE1WWchK4PfpaRittFiBb5irj',
    access_token_secret: 'dr0pOppvO8mONnRozgFDGTobuNfkQeYJKGJ6yx9Nn8Ega'
})

// getting stream from NYC
var stream = T.stream('statuses/filter', { locations: "-74.164061,40.701613,-73.729204,40.866343" })
// var stream = T.stream('statuses/sample')

stream.on('tweet', function (tweet) {
    var regex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    console.log("loading");
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
        "coordinates": tweet.coordinates,
        "time": tweet.timestamp_ms
    }
    // console.log(tweet);

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




