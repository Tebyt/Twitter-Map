var express = require('express');
var router = express.Router();

// ElasticSearch

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'paas:8fa0549c7855701ee173a9dbe37cbfd3@dori-us-east-1.searchly.com:80',
    // host: '127.0.0.1:9200',
    log: ['error', 'warning']
});

/* GET users listing. */
router.get('/:toSearch', function (req, res, next) {
    client.search({
        index: 'twitter',
        q: 'text:' + req.params.toSearch,
    }).then(function (data) {
        data = data.hits.hits;
        data = data.map(function(d) {
            return d._source
        })
        console.log(data);
        res.json(data);
    }, function (err) {
        console.trace(err.message);
        res.json("[]");
    });

});

module.exports = router;
