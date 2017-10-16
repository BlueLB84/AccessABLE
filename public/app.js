const STATE = {
	reviewStatements: ['The building is easy to enter and exit.', 'There is an adequate number of handicap parking spaces.', 'The service is positive and meets my needs.', 'The interior of the business is easy to navigate through.', 'The bathroom is accessible.', 'The businesss is service dog friendly.'],
	currentQuestion: 0
}

const GOOGLE_STATIC_MAP_URL = 'https://maps.googleapis.com/maps/api/staticmap?size=300x300&maptype=roadmap&zoom=14&key=AIzaSyCPxCKyI-0Jt2BLFhjrLK112M2N_M8qHSQ&markers=color:blue&markers=';

function initAutocomplete() {

  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
  	console.log(places);
  	const placeIds = getPlaceIds(places);

    displayPlaceInformation(places);
		
		if (places.length == 0) {
		  return;
		}
  });
  function geolocate() {
	  	if (navigator.geolocation) {
	  		navigator.geolocation.getCurrentPosition(function(position) {
	  			var geolocation = {
	  				lat: position.coords.latitude,
	  				lng: position.coords.longitude
	  			};
	  			var circle = new google.maps.Circle({
	  				center: geolocation,
	  				radius: position.coords.accuracy
	  			});
	  			searchBox.setBounds(circle.getBounds());
	  		});
	  	}
	  }
geolocate();
}



function getPlaceIds(places) {
	let placeIds = [];
	places.map(function(item) {
		placeIds.push(item.place_id);
	});
	return placeIds;
}

function displayPlaceInformation(places) {
	const placeInfoHTML = places.map((item, index) => {
		return renderPlaceInformation(item);
	});
	$('#js-search-results').html(placeInfoHTML.join(''));
}

function renderPlaceInformation(place) {
	const staticMapImgSrc = renderMap(place);

	return `
	<div id="${place.place_id}">
	<h2>${place.name}</h2>
	<p>${place.formatted_address}</p>
	<img src="${staticMapImgSrc}" class="staticImg">
	<button class="review-start" type="button">Review</button>
	<section class="review"><section>
	</div>
	`;
}

function renderMap(place) {
	let latlng = `${place.geometry.location.lat()},${place.geometry.location.lng()}`;
	const staticMapImgURL = `${GOOGLE_STATIC_MAP_URL}${latlng}`;
	return staticMapImgURL;
}

function handleReviewStart() {
	$('#js-search-results').on('click', 'button.review-start', event => {
	event.preventDefault();
	let reviewId = $(event.currentTarget).parent().attr('id');
	console.log(reviewId);
	});
}

$(document).ready(function() {
	handleReviewStart();
});








