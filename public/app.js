

const GOOGLE_STATIC_MAP_URL = 'https://maps.googleapis.com/maps/api/staticmap?size=300x300&maptype=roadmap&zoom=14&key=AIzaSyCPxCKyI-0Jt2BLFhjrLK112M2N_M8qHSQ&markers=color:blue&markers=';

function initAutocomplete() {

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
  	console.log(places);
  	const placeIds = getPlaceIds(places);
    console.log(placeIds);

    displayPlaceInformation(places);
		
		if (places.length == 0) {
		  return;
		}

  // Bias the SearchBox results towards browser geolocation
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
	  			autocomplete.setBounds(circle.getBounds());
	  		});
	  	}
	  }
  });
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
	<div>
	<h2>${place.name}</h2>
	<p>${place.formatted_address}</p>
	<img src="${staticMapImgSrc}">
	</div>
	`;
}

function renderMap(place) {
	console.log(place.formatted_address);
	let addressArr = place.formatted_address.split(' ');
	addressArr.splice(addressArr.length - 3, 3);
	console.log(addressArr.join('+'));
	let newAddressStr = addressArr.join('+');
	let newAddress = newAddressStr.split(',+').join();
	const staticMapImgURL = `${GOOGLE_STATIC_MAP_URL}${newAddress}`;
	return staticMapImgURL;
}







