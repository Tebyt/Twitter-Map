
mapboxgl.accessToken = 'pk.eyJ1IjoidGVieXQiLCJhIjoiY2lsZmd0c3I0MXI4dHZubWMzdXdodGp6MyJ9.yHg2aSIkgkJHYgwCVpPiwg';
var duration = 2000;
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v8',
    center: [-73.961425, 40.786338],
    // scrollZoom: false,
    // maxZoom: 10,
    // minZoom: 10.7
    zoom: 10.7

});
var id = 0;
var marker_all;
var marker_search;
var marker_point;
var marker_temp;
function initMarkerTemp() {
    marker_temp = {
        "type": "FeatureCollection",
        "features": []
    };
}

// var socket = io.connect('http://127.0.0.1:8080/');
var socket = io.connect();
socket.on('tweet', function (data) {
    console.log(data);
    showPoint(data);
});
// var radius = 1;
map.on('style.load', function () {
    // Add marker data as a new GeoJSON source.
    fetchAllPoints(registerMarker);
});

function filterData(key) {
    var filtered_data = marker_all.features.filter(function (d) {
        return d.properties.text.indexOf(key) >= 0;
    })
    marker_search = {
        "type": "FeatureCollection",
        "features": filtered_data
    }
    console.log(marker_search);
    showFilteredPoint();
    // showTweets(filtered_data, key);
}

function showFilteredPoint() {
    initMarkerTemp();
    map.getSource("temp").setData(marker_temp);
    map.getSource("search").setData(marker_search);
    map.setLayoutProperty("all", 'visibility', 'none');
    map.setLayoutProperty("search", 'visibility', 'visible');
}


function showTweets(data, key) {
    data.forEach(function (d) {
        showTweet(d.properties, key, "#tweets");
    })

}
function showTweet(tweet, key, div) {
    var text = $('<span class="tweet">').text(tweet.text);
    var str = text.text().replace(key, '<b>$1</b>');
    text.html(str);
    var t = $('<li>');
    //   t.append($('<img>').attr('src', data.img));
    t.append(text);
    //   t.append($('<a class="time">')
    //    .attr('href', 'https://twitter.com/' + data.user + '/status/' + data.id)
    //    .attr('target', '_blank')
    //    .data('time', data.at)
    //    .text(pretty(data.at) || 'now')
    //   );
    $(div).append(t);
}

function showAllPoint() {
    initMarkerTemp();
    map.getSource("temp").setData(marker_temp);
    map.getSource("all").setData(marker_all);
    map.setLayoutProperty("search", 'visibility', 'none');
    map.setLayoutProperty("all", 'visibility', 'visible');
    initMarkerTemp();
}
function registerMarker() {
    map.addSource("all", {
        "type": "geojson",
        "data": marker_all
    });
    map.addSource("search", {
        "type": "geojson",
        "data": marker_search
    });
    initMarkerTemp();
    map.addSource("temp", {
        "type": "geojson",
        "data": marker_temp
    });

    map.addLayer({
        "id": "temp",
        // "interactive": true,
        "type": "circle",
        "source": "temp",
        "paint": {
            "circle-color": "yellow",
            "circle-radius": 1,
            "circle-opacity": 1
        }
    });
    map.addLayer({
        "id": "all",
        // "interactive": true,
        "type": "circle",
        "source": "all",
        "paint": {
            "circle-color": "yellow",
            "circle-radius": 1,
            "circle-opacity": 1
        }
    });
    map.addLayer({
        "id": "search",
        // "interactive": true,
        "type": "circle",
        "source": "search",
        "paint": {
            "circle-color": "yellow",
            "circle-radius": 1,
            "circle-opacity": 1
        }
    });
    showAllPoint();
}

function fetchAllPoints(callback) {
    console.log("fetching data");
    $.getJSON("https://twitter-map-tebyt.herokuapp.com/api/", function (data) {
    // $.getJSON("http://127.0.0.1:3000/api/", function (data) {
        console.log("fetched");
        marker_all = {
            "type": "FeatureCollection",
            "features": data
        }
        marker_search = marker_all;
        marker_point = data[0];
        callback();
        // showPoint(marker_point);
        // filterData("my");
    })
}

var start_time;
function showPoint(point) {
    var cur_id = 'point' + id;
    map.addSource(cur_id, {
        "type": "geojson",
        "data": point
    });
    map.addLayer({
        "id": cur_id,
        "source": cur_id,
        "type": "circle",
        "paint": {
            "circle-radius": 1,
            "circle-color": "lightblue",
            "circle-opacity": 1
        }
    });
    ++id;
    marker_all.features.push(point);
    map.getSource("all").setData(marker_all);
    marker_temp.features.push(point);
    map.getSource("temp").setData(marker_temp);
    animatePoint(cur_id);
}
function animatePoint(id) {
    // var cur_time = Date.now();
    // var diff = cur_time - start_time;
    // diff /= 1000;
    // if (diff < 1) {
    //     map.setPaintProperty("point", "circle-radius", diff * 1000);
    //     map.setPaintProperty("point", "circle-opacity", 1 - diff);
    //     requestAnimationFrame(animatePoint);
    // } else {
    // map.setLayoutProperty("point", 'visibility', 'none');
    map.setLayoutProperty(id, 'visibility', 'visible');
    map.setPaintProperty(id, "circle-radius", 200);
    map.setPaintProperty(id, "circle-opacity", 0.01);
    window.setTimeout(function () {
        map.setLayoutProperty(id, 'visibility', 'none');
        map.setPaintProperty(id, "circle-radius", 1);
        map.setPaintProperty(id, "circle-opacity", 1);
    }, duration)
    // }
    // var opacity = 1-radius/500;
    // opacity = opacity<0? 0 : opacity;
    // radius += 50;
    // map.setPaintProperty("point", "circle-opacity", opacity);
    // if (radius < 500) {
    //     window.setTimeout(function () {
    //         animatePoint(radius);
    //     }, 100);
    // } else {
    
    // }
}
