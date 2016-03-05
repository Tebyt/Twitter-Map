var express = require('express');
var router = express.Router();

// ElasticSearch

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'paas:8fa0549c7855701ee173a9dbe37cbfd3@dori-us-east-1.searchly.com:80',
    log: ['error', 'warning']
});

client.ping(function (error) {
    if (error) {
        console.error('elasticsearch cluster is down!');
    } else {
        console.log('All is well');
    }
});

/* GET users listing. */
router.get('/:toSearch', function (req, res, next) {

    client.search({
        index: 'twitter',
        q: 'text:' + req.params.toSearch,
    }).then(function (data) {
        if (data.hits.total == 0) res.json("[]");
        else res.json(data.hits.hits);
    }, function (err) {
        console.trace(err.message);
    });


});

module.exports = router;
