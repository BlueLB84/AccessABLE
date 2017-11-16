const STATE = {
	review_statements: ['The building is easy to enter and exit.', 'There is an adequate number of handicap parking spaces.', 'The service is positive and meets my needs.', 'The interior of the business is easy to navigate through.', 'The bathroom is accessible.', 'The businesss is service dog friendly.'],
	review_answers: [],
	current_question: 0,
	place_ID: null,
	review_place_name: null,
	route: 'home',
	IS_LOGGED_IN: false
}

// GOOGLE MAP autocomplete and geolocation bounds
const GOOGLE_STATIC_MAP_URL = 'https://maps.googleapis.com/maps/api/staticmap?size=300x300&maptype=roadmap&zoom=14&key=AIzaSyCPxCKyI-0Jt2BLFhjrLK112M2N_M8qHSQ&markers=color:blue&markers=';

function initAutocomplete() {

  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  
  searchBox.addListener('places_changed', function() {
 	
    var data = {
		'query': input.value,	
	};
  	
  	if(searchBox.getBounds()) {
  		var center = searchBox.getBounds().getCenter();

  		data.lat = center.lat();
  		data.lng = center.lng();
  	};

	$.ajax({
	    beforeSend: function() {
  			$('#loading').show();
		},
		complete: function() {
			$('#loading').hide();
		},
	    method: 'GET',
	    url: '/results',
	    contentType: 'application/json',
	    data: data,
	    success : function(data) {
		    input.value = '';
		    displayPlaceInformation(data);
		    historyPushState('results');
	    },
	    error: function (err){
	   	console.log(err);
	   }
	});
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
	  			$('#pac-input').removeAttr('disabled').focus();
	  		}, function(err) {
	  			$('#pac-input').removeAttr('disabled').focus();
	  		});
	  	}
	  } 
geolocate();
}

window.onpopstate = function(event) {
	let change = false;
	const currentRoute = getCurrentRoute();
	
	if(currentRoute) {
			STATE.route = currentRoute;
			change = true;
	}
	if(change === true) {
		renderAccessABLE(PAGE_VIEWS);
	};
};

function getCurrentRoute() {
	if(document.location.pathname === '/') {
		$('#pac-input').show();
		$('#loading').hide();
		return 'home';
	} else if(document.location.pathname === '/results') {
		$('#pac-input').show();
		return 'search-results';
	} else if(document.location.pathname === `/results/${STATE.place_ID}`) {
		$('#pac-input').hide();
		return 'single-result';
	} else if(document.location.pathname === `/review/${STATE.place_ID}`) {
		$('#pac-input').hide();
		return 'review-questionnaire';
	} else {
		return null;
	}
}

const PAGE_VIEWS = {
	'home': $('.js-home'),
	'logout': $('.js-nav-logout'),
	'search-results': $('.js-search-results'),
	'single-result': $('.js-single-result-container'),
};

// RENDER PROJECT PAGE
function renderAccessABLE(elements) {
	const currentRoute = getCurrentRoute();

	Object.keys(elements).forEach(function(route) {
		elements[route].hide();
	});
	elements[currentRoute].show();
};

// Handle history.pushState
function historyPushState(route) {
	history.pushState({}, null, route);
	renderAccessABLE(PAGE_VIEWS);
}

// Render and display search results
function displayPlaceInformation(places) {
	if(places.length === 0) {
		$('.js-search-results').html('Could not find results. Try a more specific search.  For example: "pizza near Boston"');
		return;
	} 

	const placeInfoHTML = places.map((item, index) => {
		return renderPlaceInformation(item);
	});
	$('.js-search-results').html(placeInfoHTML.join(''));
}

function renderPlaceInformation(place) {
	const staticMapImgSrc = renderMap(place);
	const reviewPercentages = renderReviewPercentages(place.place_id);

	return `
	<div id="${place.place_id}">
	<h2 class='place-name js-place-name' data-anchor="top">${place.name}</h2>
	<p>${place.formatted_address}</p>
	<img src="${staticMapImgSrc}" class="staticImg">
	<section class="js-review-percentages">${reviewPercentages}<section>
	</div>
	`;
};

function renderMap(place) {
	let latlng = `${place.geometry.location.lat},${place.geometry.location.lng}`;
	const staticMapImgURL = `${GOOGLE_STATIC_MAP_URL}${latlng}`;
	return staticMapImgURL;
};

function renderReviewPercentages(place) {
	return 'ICON and % PLACEHOLDER';
}

// <button class="review-start" type="button" data-anchor="review">REVIEW THIS BUSINESS</button>

// Handle single location view
function handleSingleResult() {
	$('.js-search-results').on('click', '.js-place-name, button.review-start', event => {
	event.preventDefault();
	STATE.current_question = 0;
	STATE.place_ID = $(event.currentTarget).parent().attr('id');
	const anchorHash = $(event.currentTarget).data('anchor');

		$.ajax({
		    type: 'GET',
		    url:`/results/${STATE.place_ID}`, 
		    success: function(html) {
		      historyPushState(`/results/${STATE.place_ID}#${anchorHash}`);
		      $('.js-single-result').html(html);
		      if(STATE.IS_LOGGED_IN) {
		      	$('.js-review-questionnaire').html(reviewQuestionnaireTemplate(STATE.place_ID));
		    } else {
		    	$('.js-review-questionnaire').html(loginToReview());
		    	$('.js-review-questionnaire .js-login-to-review').focus();
		    	}
		    },
		    error: function (err) {
		   	console.log(err);
		    }
		});
	});
};

// LINK to LOGIN in order to Review the business
function loginToReview() {
	return `<button type="button" class="js-login-to-review">Please LOG IN to review this business</button>`
};

$('.js-review-questionnaire').on('click', '.js-login-to-review', event => {
	$('.js-login-modal').show();
	$('#username-log').focus();
});


// QUESTIONNAIRE //
function reviewQuestionnaireTemplate(placeId) {
	const reviewBlocks = displayReviewQuestionnaire();

	if(STATE.current_question === STATE.review_statements.length) {
		console.log(STATE.review_answers);
		handleReviewSubmit(placeId);
		$('.js-review-questionnaire').html("Your review has been submitted!");
	} else {
		return `
	<h2 id="review">Your accessABLE Review</h2>
	<p>Select YES or NO for each of the following statements:</p>
	<form name="review-questionnaire">
		${reviewBlocks[STATE.current_question]}
	</form>`;
	};
};

function displayReviewQuestionnaire() {
	let reviewBlocks = [];
	for(let i = 0; i < STATE.review_statements.length; i++) {
		reviewBlocks.push(renderReviewQuestionnaire(i));
	}
	return reviewBlocks;
}

function renderReviewQuestionnaire(index) {
	return `
        <fieldset class="review-answers" id=${index}>
        	<legend>${STATE.review_statements[index]}</legend>
        	<ul class="questionnaire-radios">
	        	<li><div class="js-answer-button answer-button review-true"><input type="radio" id="true${index}" value="true" name="questionnaire-boolean" class="questionnaire-boolean" required hidden/><label for="${index}-true">YES</label></div></li>
	        	<li><div class="js-answer-button answer-button review-false"><input type="radio" id="false${index}" value="false" name="questionnaire-boolean" class="questionnaire-boolean" required hidden/><label for="${index}-false">NO</label></div></li>
        	</ul>
        </fieldset>
	`
}

$('.js-single-result').on('click', '.js-answer-button', event => {
	event.preventDefault();
	event.stopPropagation();
	const reviewAnswer = $(event.currentTarget).parent().find('input[name="questionnaire-boolean"]').prop('checked', true).val();
	STATE.review_answers.push(reviewAnswer);
	STATE.current_question++;
	nextReviewStatement();
});

function nextReviewStatement() {
	const reviewQuestion = reviewQuestionnaireTemplate(STATE.place_ID);
	$('.js-review-questionnaire').html(reviewQuestion);
};

function handleReviewSubmit(placeId) {
	const answers = STATE.review_answers;
	const data = {
		'username': 'adminlbv',
		'businessId': placeId,
		'userRatings': {
			access: answers[0],
			parkingSpaces: answers[1],
			interiorNavigation: answers[2],
			restroom: answers[3],
			service: answers[4],
			serviceAnimal: answers[5]
		}
	};

	$.ajax({
		type: 'POST',
		url: '/reviews',
		contentType: 'application/json',
	    data: JSON.stringify(data),
		success: function() {
			console.log('successful review POST');
		},
		error: function(err) {
			console.log(err);
		}
	});
};

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


///// ADD REVIEWS TO BUSINESS SEARCH RESULTS USING BUSINESS ID

///// CREATE QUESTIONNAIRE .js-review-prompt

///// POST QUESTIONNAIRE ANSWERS AND USERNAME TO /REVIEWS/:id

///// GET REVIEWS FOR A LOCATION -- add db search for location


$(document).ready(function() {
	renderAccessABLE(PAGE_VIEWS);
	handleSingleResult();
});








