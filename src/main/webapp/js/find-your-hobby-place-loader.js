var map, places, infoWindow;
var markers = [];
var autocomplete;
var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
var hostnameRegexp = new RegExp('^https?://.+?/');
var countries = {
    'us': {
        center: {lat: 37.1, lng: -95.7},
        zoom: 3
    }
};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: countries['us'].zoom,
        center: countries['us'].center,
        mapTypeControl: false,
        panControl: false,
        zoomControl: false,
        streetViewControl: false
    });

    infoWindow = new google.maps.InfoWindow({
        content: document.getElementById('info-content')
    });

    // Create the autocomplete object and associate it with the UI input control.
    // Restrict the search to the default country, and to place type "cities".
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */ (
            document.getElementById('autocomplete')), {
            types: ['(cities)']
        });
    places = new google.maps.places.PlacesService(map);

    autocomplete.addListener('place_changed', onPlaceChanged);

    // Add a DOM event listener to react when the user selects a country.
    document.getElementById('hobby').addEventListener(
        'change', setAutocompleteHobby);
}

// When the user selects a city, get the place details for the city and
// zoom the map in on the city.
function onPlaceChanged() {
    var place = autocomplete.getPlace();
    if (place.geometry) {
        map.panTo(place.geometry.location);
        map.setZoom(15);
    } else {
        document.getElementById('autocomplete').placeholder = 'Enter a city';
    }
}

// Search for hotels in the selected city, within the viewport of the map.
function search(hobby, types) {
    var search = {
        query: hobby,
        bounds: map.getBounds(),
        types: types
    };

    places.nearbySearch(search, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            clearResults();
            clearMarkers();
            // Create a marker for each hotel found, and
            // assign a letter of the alphabetic to each marker icon.
            for (var i = 0; i < results.length; i++) {
                var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
                var markerIcon = MARKER_PATH + markerLetter + '.png';
                // Use marker animation to drop the icons incrementally on the map.
                markers[i] = new google.maps.Marker({
                    position: results[i].geometry.location,
                    animation: google.maps.Animation.DROP,
                    icon: markerIcon
                });
                // If the user clicks a hotel marker, show the details of that hotel
                // in an info window.
                markers[i].placeResult = results[i];
                google.maps.event.addListener(markers[i], 'click', showInfoWindow);
                setTimeout(dropMarker(i), i * 100);
                addResult(results[i], i);
            }
        }
    });
}

function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        if (markers[i]) {
            markers[i].setMap(null);
        }
    }
    markers = [];
}

// Set the Hobby restriction based on user input.
// Also center and zoom the map on the given Hobby.
function setAutocompleteHobby() {
    // check whether the user inserts the location
    if (document.getElementById('autocomplete').value == '') {
        createAlert("Please select your location");
        return false;
    }

    var hobby = document.getElementById('hobby').value;
    var types = [];

    if (hobby == "attractions") {
        types.push('natural_feature', 'zoo', 'amusement_park');
    } else if (hobby == "garden") {
        types.push();
    } else if (hobby == "sports") {
        types.push('gym', 'stadium');
    } else if (hobby == "reading") {
        types.push('library');
    }

    clearResults();
    clearMarkers();
    search(hobby, types);
}

function dropMarker(i) {
    return function () {
        markers[i].setMap(map);
    };
}

function addResult(result, i) {
    var results = document.getElementById('results');
    var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
    var markerIcon = MARKER_PATH + markerLetter + '.png';
    var html_template = `     <td id="icon-td" scope="col">
                            <div>
                                <img id="icon-marker" src="#" class="placeIcon" classname="placeIcon">
                            </div>
                            </td>
                            <td id="name-td" scope="col" style="padding-left: 10px;">
                                Kansas City
                            </td>`;

    var tr = document.createElement('tr');
    tr.innerHTML = html_template;

    name_td = tr.querySelector("#name-td");
    name_td.innerHTML = result.name;

    icon_marker = tr.querySelector("#icon-marker");
    icon_marker.src = markerIcon;

    tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
    tr.onclick = function () {
        google.maps.event.trigger(markers[i], 'click');
    };

    results.appendChild(tr);
}

function clearResults() {
    var results = document.getElementById('results');
    while (results.childNodes[0]) {
        results.removeChild(results.childNodes[0]);
    }
}

// Get the place details for a hotel. Show the information in an info window,
// anchored on the marker for the hotel that the user selected.
function showInfoWindow() {
    var marker = this;
    places.getDetails({placeId: marker.placeResult.place_id},
        function (place, status) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
                return;
            }
            infoWindow.open(map, marker);
            buildIWContent(place);
        });
}

// Load the place information into the HTML elements used by the info window.
function buildIWContent(place) {
    document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
        'src="' + place.icon + '"/>';
    document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
        '">' + place.name + '</a></b>';
    document.getElementById('iw-address').textContent = place.vicinity;

    if (place.formatted_phone_number) {
        document.getElementById('iw-phone-row').style.display = '';
        document.getElementById('iw-phone').textContent =
            place.formatted_phone_number;
    } else {
        document.getElementById('iw-phone-row').style.display = 'none';
    }

    // Assign a five-star rating to the hotel, using a black star ('&#10029;')
    // to indicate the rating the hotel has earned, and a white star ('&#10025;')
    // for the rating points not achieved.
    if (place.rating) {
        var ratingHtml = '';
        for (var i = 0; i < 5; i++) {
            if (place.rating < (i + 0.5)) {
                ratingHtml += '&#10025;';
            } else {
                ratingHtml += '&#10029;';
            }
            document.getElementById('iw-rating-row').style.display = '';
            document.getElementById('iw-rating').innerHTML = ratingHtml;
        }
    } else {
        document.getElementById('iw-rating-row').style.display = 'none';
    }

    // The regexp isolates the first part of the URL (domain plus subdomain)
    // to give a short URL for displaying in the info window.
    if (place.website) {
        var fullUrl = place.website;
        var website = hostnameRegexp.exec(place.website);
        if (website === null) {
            website = 'http://' + place.website + '/';
            fullUrl = website;
        }
        document.getElementById('iw-website-row').style.display = '';
        document.getElementById('iw-website').textContent = website;
    } else {
        document.getElementById('iw-website-row').style.display = 'none';
    }
    var save_place_btn = document.getElementById('save-place-btn');
    save_place_btn.onclick = () => {
        postMarker(place);
        createAlert("Place successfully Saved!");
    };
}


/** Sends a marker to the backend for saving. */
function postMarker(place) {
    var lat = place.geometry.location.lat();
    var lng = place.geometry.location.lng();
    var id = place.id;
    var hobby = document.getElementById('hobby').value;

    const params = new URLSearchParams();
    params.append('lat', lat);
    params.append('lng', lng);
    params.append('hobby', hobby);
    params.append('id', id);

    fetch('/markers', {
        method: 'POST',
        body: params
    });
}


function createAlert(message) {
    var alertmesssage = `<div id="alertmessage" class="alert alert-dark" role="alert">` + message + `</div>`;
    document.getElementsByClassName('container')[0].insertAdjacentHTML("afterbegin", alertmesssage);
    var timePeriodInMs = 3000;
    setTimeout(function () {
            document.getElementById("alertmessage").style.display = "none";
        },
        timePeriodInMs);
}


function buildUI() {
    loadNavigation();
    initMap();
}