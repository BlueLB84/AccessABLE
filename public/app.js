const STATE = {
	reviewStatements: ['The building is easy to enter and exit.', 'There is an adequate number of handicap parking spaces.', 'The service is positive and meets my needs.', 'The interior of the business is easy to navigate through.', 'The bathroom is accessible.', 'The businesss is service dog friendly.'],
	current_question: 0,
	data: null,
	search_terms: null,
	place_ID: null,
	route: 'login',
	review_location: null,
	IS_LOGGED_IN: false
}

// GOOGLE MAP autocomplete and geolocation bounds
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

const PAGE_VIEWS = {
	'login': $('.js-login-modal'),
	'logout': $('.js-nav-logout'),
	'about': $('.js-about'),
	'search-results': $('.js-search-results'),
	'single-place': $('.js-single-place'),
	'review-questionnaire': $('.js-review-questionnaire'),
	'location-reviews': $('.js-location-reviews')
}

// RENDER PROJECT PAGE
function renderAccessABLE(currentRoute, elements) {
	Object.keys(elements).forEach(function(route) {
		elements[route].hide();
	});
	elements[currentRoute].show();
};

// Render and display search results
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
	<button class="review-start" type="button" ${STATE.IS_LOGGED_IN ? '' : 'hidden'}>REVIEW THIS BUSINESS</button>
	<section class="review"><section>
	</div>
	`;
}

function renderMap(place) {
	let latlng = `${place.geometry.location.lat()},${place.geometry.location.lng()}`;
	const staticMapImgURL = `${GOOGLE_STATIC_MAP_URL}${latlng}`;
	return staticMapImgURL;
}

// Code for review prompt //
function handleReviewStart() {
	$('#js-search-results').on('click', 'button.review-start', event => {
	event.preventDefault();
	let reviewID = $(event.currentTarget).parent().attr('id');
	console.log(reviewID);
	// use reviewID to post review answers to db
	});
}

// Launch login modal
$('nav').on('click', '.js-nav-login', event => {
	$('.js-login-modal').show();
});

// AJAX call to login
$('#js-form-login').on('submit', event => {
	event.preventDefault();
	var usrname = $('#username-log').val();
	var passwrd = $('#password-log').val();

	$.ajax({
	    type: 'POST',
	    url: '/auth/login',
	    username: usrname,
	    password: passwrd, 
	    success : function() {
	      onLogin(usrname);
	   },
	   error: function (){
	   	$('#login-form-messages').append('<p>Invalid username or password</p>');
	   }
	});

});

function onLogin(usrname) {
	$('.js-login-cancel').click();
	STATE.route = 'logout';
	$('.js-nav-welcome').text(`Welcome ${usrname}`);
	STATE.IS_LOGGED_IN = true;
	toggleReviewButtons();
}

function toggleReviewButtons() {
	if (STATE.IS_LOGGED_IN) {
		$('#js-search-results').find('button').show();
	} else {
		$('#js-search-results').find('button').hide();
	}
}

// Cancel login modal
$('.js-login-cancel').on('click', event => {
	$('.js-login-modal').hide();
});

// New User Registration
$('.js-new-user').on('click', event => {
	$('.js-login-cancel').click();
	$('.js-registration-modal').show();
});

// AJAX call to post new user
$('#js-form-register').on('submit', event => {
	event.preventDefault();
	
	var usrname = $('#username-reg').val();
	var passwrd = $('#password-reg').val();
	var firstname = $('#firstName').val();
	var lastname = $('#lastName').val();

	var data = {
		username: usrname,
	    password: passwrd,
	    firstName: firstname,
	    lastName: lastname
	};

	console.log(JSON.stringify(data));

	$.ajax({
	    type: 'POST',
	    url: '/users',
	    dataType: 'json',
	    data: JSON.stringify(data),
	    contentType: 'application/json', 
	    success: function() {
	      $('.js-registration-cancel').click();
	      $('.js-nav-login').hide();
	      $('.js-nav-welcome').show().text(`Welcome ${usrname}`);
	      $('.js-nav-logout').show();
	   },
	   error: function (err){
	   	console.log(err);
	   }
	});
});

// Cancel registration modal
$('.js-registration-cancel').on('click', event => {
	$('.js-registration-modal').hide();
});

$(document).ready(function() {
	handleReviewStart();
});

// AJAX call to logout
$('.js-nav-logout').on('click', event => {
	$.ajax({
	    type: 'GET',
	    url: '/logout', 
	    success: function() {
	      $('.js-nav-logout').toggle();
	      $('.js-nav-welcome').hide().text(`Welcome`);
	      $('.js-nav-login').toggle();
	      toggleReviewButtons();
	   },
	   error: function (err){
	   	console.log(err);
	   }
	});
});


$(document).ready(function() {

});



// ROUTE Popstate Handler //
// window.onpopstate = function(event) {
// 	let change = false;
	
// 	if(document.location.pathname === '/log-in') {
// 		STATE.route = 'login';
// 		change = true;
// 	} else if (document.location.pathname === '/#') {
// 		STATE.route = 'logout';
// 		change = true;
// 	} else if (document.location.pathname === '/about') {
// 		STATE.route = 'about'
// 	} else if (document.location.pathname === '/search-results') {
// 		STATE.route = 'search-results';
// 		change = true;
// 	} else if (document.location.pathname === `/${STATE.place_ID}`) {
// 		STATE.route = 'single-place';
// 		change = true;
// 	} else if (document.location.pathname === `/review-${STATE.place_ID}`) {
// 		STATE.route = 'review-questionnaire';
// 		change = true;
// 	} else if (document.location.pathname === `/location-review/${STATE.review_location}`) {
// 		STATE.route = 'location-review';
// 		change = true;
// 	}

// 	if(change === true) {
// 		renderAccessABLE(STATE.route, PAGE_VIEWS);
// 	};
// };








