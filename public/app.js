const STATE = {
	review_statements: ['There is an adequate number of handicap parking spaces.', 'The building is easy to enter and exit.', 'The service is positive and meets my needs.', 'The interior of the business is easy to navigate through.', 'The bathroom is accessible.', 'The businesss is service dog friendly.'],
	review_icons:[{src:'../images/parking_icon.svg',alt:'handicap parking icon'},{src:'../images/enter_exit_icon.svg',alt:'enter and exit icon'},{src:'../images/customer_service_icon.svg',alt:'customer service icon'},{src:'../images/interior_navigation.svg',alt:'interior navigation icon'},{src:'../images/bathroom_icon.svg',alt:'handicap bathroom icon'},{src:'../images/service_dog_icon.svg',alt:'service dog paw icon'}],
	review_answers: [],
	review_text: '',
	current_question: 0,
	place_ID: null,
	route: 'home',
	IS_LOGGED_IN: false,
	JWT: null
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
		STATE.current_question = 0;
		return 'search-results';
	} else if(document.location.pathname === `/results/${STATE.place_ID}`) {
		$('#pac-input').hide();
		return 'single-result';
	} else {
		return null;
	}
}

const PAGE_VIEWS = {
	'home': $('.js-home'),
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
		$('.js-search-results').html(`<p>Could not find results. Try a more specific search.  For example: "pizza near Boston"</p>`);
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
	return `
		<div class="review-icon-container">
			<img src="../images/parking_icon.svg" alt="handicap parking icon" class="results-icon"/>
			<img src="../images/enter_exit_icon.svg" alt="enter and exit icon"/>
			<img src="../images/customer_service_icon.svg" alt="customer service icon" class="results-icon"/>
			<img src="../images/interior_navigation.svg" alt="interior navigation icon" class="results-icon"/>
			<img src="../images/bathroom_icon.svg" alt="handicap bathroom icon" class="results-icon"/>
			<img src="../images/service_dog_icon.svg" alt="service dog paw icon" class="results-icon"/>
		</div>
	`;
}


// Handle single location view
function handleSingleResult() {
	$('.js-search-results').on('click', '.js-place-name', event => {
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
		      	$('.js-review-questionnaire').html(reviewQuestionnaireTemplate(STATE.place_ID)).show();
		    } else {
		    	$('.js-review-login').show();
		    	}
		    },
		    error: function (err) {
		   	console.log(err);
		    }
		});
	});
};

// LOGIN in order to Review the business
$('.js-review-login').on('click', '.js-login-to-review', event => {
	$('.js-login-modal').show();
	$('#username-log').focus();
});


// QUESTIONNAIRE //
function reviewQuestionnaireTemplate(placeId) {
	let reviewBlocks;
	let formPromptText;

	if(STATE.current_question === STATE.review_statements.length) {
		reviewBlocks = renderReviewTextArea();
		formPromptText = 'Tell us more about your experience:';
	} else {
		reviewBlocks = (displayReviewQuestionnaire())[STATE.current_question];
		formPromptText = 'Select YES or NO for each of the following statements:';
	}

	return `
	<h2 id="review">Your accessABLE Review</h2>
	<p>${formPromptText}</p>
	<form name="review-questionnaire" id="review-questionnaire-form">
		${reviewBlocks}
	</form>`;
};


function displayReviewQuestionnaire() {
	let reviewBlocks = [];
	for(let i = 0; i < STATE.review_statements.length; i++) {
		reviewBlocks.push(renderReviewQuestionnaire(i));
	}
	return reviewBlocks;
};

function renderReviewQuestionnaire(index) {
		return `
        <fieldset class="review-answers" id=${index}>
        	<legend>${STATE.review_statements[index]}</legend>
        	<img src="${STATE.review_icons[STATE.current_question].src}" alt="${STATE.review_icons[STATE.current_question].alt}" class="questionnaire-icon" />
        	<ul class="questionnaire-radios">
	        	<li><div class="js-answer-button answer-button review-true"><input type="radio" id="true${index}" value="true" name="questionnaire-boolean" class="questionnaire-boolean" required hidden/><label for="${index}-true">YES</label></div></li>
	        	<li><div class="js-answer-button answer-button review-false"><input type="radio" id="false${index}" value="false" name="questionnaire-boolean" class="questionnaire-boolean" required hidden/><label for="${index}-false">NO</label></div></li>
        	</ul>
        </fieldset>
	`;
};

function renderReviewTextArea() {
	return `
			<fieldset class="review-answers" id="review-textarea">
				<textarea id="js-review-text" form="review-questionnaire-form" placeholder="Enter text here..." rows="4" cols="50" autofocus></textarea>
			</fieldset>
			<button type="button" class="js-review-submit">SUBMIT</button>
		`;
	};

$('.js-review-questionnaire').on('click', '.js-review-submit', event => {
	STATE.review_text = $(event.currentTarget).parent().find('#js-review-text').val();
	console.log(STATE.review_text);
	handleReviewSubmit(STATE.place_ID);
});

$('.js-single-result-container').on('click', '.js-answer-button', event => {
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
	$('.js-review-questionnaire').html("Your review has been submitted. Thank you for being an accessALLY!");
		window.setTimeout(removeReviewSuccess, 3000);

	const answers = STATE.review_answers;
	const data = {
		'username': 'adminlbv',
		'businessId': placeId,
		'userRatings': {
			parkingSpaces: answers[0],
			access: answers[1],
			interiorNavigation: answers[2],
			restroom: answers[3],
			service: answers[4],
			serviceAnimal: answers[5]
		},
		'reviewText': STATE.review_text
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

function showReviewQuestionnaireLoggedIn() {
	if(document.location.pathname === `/results/${STATE.place_ID}`) {
		$('.js-review-login').hide();
		$('.js-review-questionnaire').html(reviewQuestionnaireTemplate(STATE.place_ID)).show();
	}
};

function removeReviewSuccess() {
	$('.js-review-questionnaire').html('').hide();
};

// Launch login modal
$('nav').on('click', '.js-nav-login', event => {
	$('.js-login-modal').show();
	$('#username-log').focus();
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
	    success : function(data) {
	      onLogin(usrname, data);
	   },
	   error: function (err){
	   	$('#login-form-messages').html(`<p>${err}</p>`);
	   }
	});
});

function onLogin(usrname, data) {
	$('.js-login-cancel').click();
	$('.js-nav-login').hide();
	$('.js-nav-logout').show();
	$('.js-nav-welcome').text(`Welcome ${usrname}`).show();
	STATE.JWT = data.authToken;
	STATE.IS_LOGGED_IN = true;
	showReviewQuestionnaireLoggedIn();
}

// Cancel login modal
$('.js-login-cancel').on('click', event => {
	$('.js-login-modal').hide();
});

// AJAX call to logout
$('.js-nav-logout').on('click', event => {
	$.ajax({
	    type: 'GET',
	    url: '/logout', 
	    success: function() {
	    	onLogout();
	   },
	   error: function (err){
	   	console.log(err);
	   }
	});
});

function onLogout() {
	STATE.IS_LOGGED_IN = false;
	STATE.JWT = null;
	STATE.review_answers = [];
	$('.js-nav-logout').hide();
	$('.js-nav-welcome').hide();
	$('.js-nav-login').show();
	if(document.location.pathname === `/results/${STATE.place_ID}`) {
		$('.js-review-questionnaire').html('').hide();
		$('.js-review-login').show();
	}
};

// New User Registration
$('.js-new-user').on('click', event => {
	$('.js-login-cancel').click();
	$('.js-registration-modal').show();
	$('#username-reg').focus();
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
	      $('.js-nav-login').click();
	   },
	   error: function (err){
	   	$('#reg-form-messages').html(`<p>* ${err.responseJSON.location} ${err.responseJSON.message} *</p>`);
	   }
	});
});

// Cancel registration modal
$('.js-registration-cancel').on('click', event => {
	$('.js-registration-modal').hide();
});




///// POST QUESTIONNAIRE ANSWERS AND USERNAME TO /REVIEWS/:id

///// GET REVIEWS FOR A LOCATION -- add db search for location


$(document).ready(function() {
	renderAccessABLE(PAGE_VIEWS);
	handleSingleResult();
});








