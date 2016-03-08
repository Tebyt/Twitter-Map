$(document).foundation();
mapboxgl.accessToken = 'pk.eyJ1IjoidGVieXQiLCJhIjoiY2lsZmd0c3I0MXI4dHZubWMzdXdodGp6MyJ9.yHg2aSIkgkJHYgwCVpPiwg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v8',
    center: [-73.961425, 40.786338],
    // scrollZoom: false,
    // maxZoom: 10,
    // minZoom: 10.7
    zoom: 10.7

});

d3.select("#search").on("keyup", function() {
    var text = d3.select("#search").property('value');
    console.log(text);
    var host = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
    d3.json(host+"/api/text/autocomplete/"+text, function(data) {
        console.log(data);
        if (data.length == 0) d3.select("#tweets").html("");
        d3.select("#tweets").selectAll("li").data(data).enter().append("li").text(data);
    })
})


map.on('style.load', function () {
    init();
});
function init() {
    registerMarkers();
    registerSocket();
    fetchAllPoints();
}

function registerMarkers() {
    registerMarker("marker_all", "yellow");
    registerMarker("marker_search", "yellow");
    registerMarker("marker_temp", "lightblue");
}

function registerMarker(name, color) {
    window[name] = {
        "type": "FeatureCollection",
        "features": []
    }
    map.addSource(name, {
        "type": "geojson",
        "data": window[name]
    });
    map.addLayer({
        "id": name,
        // "interactive": true,
        "type": "circle",
        "source": name,
        "paint": {
            "circle-color": color,
            "circle-radius": 1,
            "circle-opacity": 1
        }
    });
}
function registerSocket() {
    socket = io.connect();
    socket.on('tweet', function (data) {
        // console.log(data);
        showPoint(data);
        d3.select("#tweet").text(data.properties.text);
    });
}



function emptyData(marker) {
    window[marker].features = [];
    refreshData(marker);
}
function refreshData(marker) {
    map.getSource(marker).setData(window[marker]);
}

function fetchAllPoints() {
    console.log("fetching data");
    $.getJSON("/api/", function (data) {
        console.log("fetched");
        marker_all.features = data;
        showAllPoints();
    })
}

function showAllPoints() {
    emptyData("marker_temp");
    refreshData("marker_all");
    map.setLayoutProperty("marker_search", 'visibility', 'none');
    map.setLayoutProperty("marker_all", 'visibility', 'visible');
}

function fetchFilteredPoints(key) {
    console.log("fetching data");
    $.getJSON("/api/text"+key, function (data) {
        console.log("fetched");
        marker_search.features = data;
        showFilteredPoints();
        showTweets(data, key);
    })
}

function showFilteredPoints() {
    emptyData("marker_temp");
    refreshData("marker_search");
    map.setLayoutProperty("marker_all", 'visibility', 'none');
    map.setLayoutProperty("marker_search", 'visibility', 'visible');
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


// For point animation
var animation = [[1, 1], [3, 1], [20, 0.5], [200, 0]];
var id = 0;
var start_time;

function showPoint(point) {
    marker_all.features.push(point);
    marker_temp.features.push(point);
    refreshData("marker_temp");
    
    var cur_point = "marker_point"+id;
    ++id;
    registerMarker(cur_point, "lightblue");
    window[cur_point].features = [point];
    refreshData(cur_point);
    start_time = Date.now();
    animatePoint(cur_point);
}

function animatePoint(id) {
    var cur_frame = Math.floor((Date.now() - start_time) / 200);
    if (cur_frame <= 3) {
        map.setPaintProperty(id, "circle-radius", animation[cur_frame][0]);
        map.setPaintProperty(id, "circle-opacity", animation[cur_frame][1]);
        requestAnimationFrame(function() {
            animatePoint(id);
        });
    } else {
        map.removeSource(id);
        map.removeLayer(id);
    }
}