# Twitter-Map

Github Page <https://github.com/Tebyt/Twitter-Map>

The website is deployed on heroku and is hosted on <http://twitter-map-tebyt.herokuapp.com>

The elasticsearch database is provided by [Searchly](http://www.searchly.com)

### API Reference

####Root: /api

**GET /** Get all the tweets

**GET /text/:toSearch** Get tweets by text

**GET /autocomplete/:toSearch** Get autocomplete by text

**GET /coordinates/:lat/:lon** Get tweets by coordinates

**POST /:id** Post tweets by id

**DELETE /** Delete all tweets


### Thanks to

**MapBox** Map provider

**Twit** Twitter Streaming for Node.js

**Socket.io** Real time server to client messaging
