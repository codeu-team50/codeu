var map, places, infoWindow;
var markers = [];
var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';


/** Function to initialize the map. */
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.422, lng: -122.084},
        zoom: 16,
        streetViewControl: false
    });

    infoWindow = new google.maps.InfoWindow({
        content: document.getElementById('info-content')
    });

    places = new google.maps.places.PlacesService(map);
    fetchMarkers();
}


/** Fetches markers from the backend and adds them to the map. */
function fetchMarkers() {
    const url = '/markers?user=' + parameterUsername;
    fetch(url).then((response) => {
        return response.json();
    }).then((markersJSON) => {
        if (markersJSON.length == 0) {
            var results = document.getElementById('results');
            var html_template =
                `<tdscope="col">User has no saved places.</td>`;
            var tr = document.createElement('tr');
            tr.innerHTML = html_template;
            results.appendChild(tr);
        } else {
            createMarkerForDisplay(markersJSON);
        }

    });
}


// Search for hotels in the selected city, within the viewport of the map.
function createMarkerForDisplay(markersJSON) {
    for (var i = 0; i < markersJSON.length; i++) {
        var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
        var markerIcon = MARKER_PATH + markerLetter + '.png';
        // Use marker animation to drop the icons incrementally on the map.
        var latLng = new google.maps.LatLng(markersJSON[i].lat, markersJSON[i].lng)
        markers[i] = new google.maps.Marker({
            position: {lat: markersJSON[i].lat, lng: markersJSON[i].lng},
            animation: google.maps.Animation.DROP,
            icon: markerIcon
        });
        map.panTo(latLng);
        map.setZoom(15);

        markers[i].place_id = markersJSON[i].placeId;
        // If the user clicks a hotel marker, show the details of that hotel
        // in an info window.
        google.maps.event.addListener(markers[i], 'click', showInfoWindow);
        console.log("Done addListener");
        setTimeout(dropMarker(i), i * 100);
        console.log(markers[i].place_id);
        addResult(markers[i], i);
        console.log("Done");
    }
}


function showInfoWindow() {
    var marker = this;
    places.getDetails({placeId: marker.place_id},
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

function addResult(marker, i) {
    places.getDetails({placeId: marker.place_id},
        function (place, status) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
                console.log(status);
                return;

            }
            var result = place;
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
        });

}

function dropMarker(i) {
    return function () {
        markers[i].setMap(map);
    };
}