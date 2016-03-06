mapboxgl.accessToken = 'pk.eyJ1IjoidGVieXQiLCJhIjoiY2lsZmd0c3I0MXI4dHZubWMzdXdodGp6MyJ9.yHg2aSIkgkJHYgwCVpPiwg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v8',
    center: [-73.961425, 40.786338],
    // scrollZoom: false,
    // maxZoom: 10,
    // minZoom: 10.7
});
var global_dataset;
map.on('style.load', function () {
    // Add marker data as a new GeoJSON source.
    fetchAllPoints(addMarker);

});

function addMarker(points) {
    var markers = {
        "type": "FeatureCollection",
        "features": points
    }
    map.addSource("markers", {
        "type": "geojson",
        "data": markers
    });

    // Add a layer showing the markers.
    map.addLayer({
        "id": "markers",
        // "interactive": true,
        "type": "circle",
        "source": "markers",
        "paint": {
            "circle-color": "yellow",
            "circle-radius": 1,
            "circle-opacity": 1
        }
    });
}

function fetchAllPoints(callback) {
    console.log("fetching data");
    $.getJSON("https://twitter-map-tebyt.herokuapp.com/api/", function (data) {
    // $.getJSON("http://127.0.0.1:3000/api/", function (data) {
        console.log("fetched");
        callback(data);
        global_dataset = data;
    })
}