const STATE = {
	review_statements: ['There is an adequate number of handicap parking spaces.', 'The building is easy to enter and exit.', 'The service is positive and meets my needs.', 'The interior of the business is easy to navigate through.', 'The bathroom is accessible.', 'The businesss is service dog friendly.'],
	review_icons:[{src:'../images/parking_icon.svg',alt:'handicap parking icon'},{src:'../images/enter_exit_icon.svg',alt:'enter and exit icon'},{src:'../images/customer_service_icon.svg',alt:'customer service icon'},{src:'../images/interior_navigation.svg',alt:'interior navigation icon'},{src:'../images/bathroom_icon.svg',alt:'handicap bathroom icon'},{src:'../images/service_dog_icon.svg',alt:'service dog paw icon'}],
	review_answers: [],
	review_text: '',
	current_question: 0,
	query: null,
	lat: null,
	lng: null,
	place_ID: null,
	route: 'home',
	I_L_I: false,
	J_W_T: null,
	username: null
}

// GOOGLE MAP autocomplete and geolocation bounds
const GOOGLE_STATIC_MAP_URL = 'https://maps.googleapis.com/maps/api/staticmap?size=300x300&maptype=roadmap&zoom=14&key=AIzaSyCPxCKyI-0Jt2BLFhjrLK112M2N_M8qHSQ&markers=color:blue&markers=';
const PAGE_VIEWS = {
	'home': $('.js-home'),
	'search-results': $('.js-search-results'),
	'single-result': $('.js-single-result-container'),
};

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

	googleQuery(data);
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
	} else if(`${document.location.pathname}${document.location.search}` === `/results?${STATE.query}&${STATE.lat},${STATE.lng}`) {
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

function handleEventType (event) {
	if(event.type === 'click' || event.which == 13 || event.which == 32) {
        return true;
    }
    return false;
}


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

// Google AJAX call
function googleQuery(queryData) {
	$.ajax({
	    beforeSend: function() {
  			$('#loading').show();
		},
		complete: function() {
			$('#loading').hide();
			$("html, body").animate({ scrollTop: $('#js-snap-results').offset().top - 50}, 1000);
		},
	    method: 'GET',
	    url: '/api/results',
	    contentType: 'application/json',
	    data: queryData,
	    success : function(html) {
		    console.log('successful search');
		    $('#pac-input').value = '';
		    $('.js-search-results').html(html);
		    let queryString = queryData.query.replace(',', '');
		    STATE.query = queryString.split(' ').join('%20');
		    STATE.lat = queryData.lat;
		    STATE.lng = queryData.lng;
		    historyPushState(`results?${STATE.query}&${STATE.lat},${STATE.lng}`);
	    },
	    error: function (err){
	   	console.log(err);
	   }
	});
};

// Handle single location view
function handleSingleResult() {
	$('.js-search-results').on('keydown click', '.js-result-container', event => {
	if(handleEventType(event)) {
		event.preventDefault();
		STATE.current_question = 0;
		STATE.review_text = '';
		STATE.place_ID = $(event.currentTarget).attr('id');

		ajaxGetSingleResult('push');
		}
	});
};

function ajaxGetSingleResult(state) {

	function checkILI() {
		if(STATE.I_L_I) {
			$('.js-review-questionnaire').html(reviewQuestionnaireTemplate(STATE.place_ID)).show();
		} else if(!STATE.I_L_I) {
			$('.js-review-login').show();
		}
	}

	$.ajax({
		    type: 'GET',
		    url: `/api/results/${STATE.place_ID}`, 
		    complete: function() {
				$('#loading').hide();
			},
		    success: function(html) {
		    	if(state === 'push') {
				historyPushState(`/results/${STATE.place_ID}`);
				checkILI();
				}

				if(state === 'replace') {
					history.replaceState({}, null, `/results/${STATE.place_ID}`);
					renderAccessABLE(PAGE_VIEWS);
					removeReviewSuccess();
					if(STATE.direct === true) {
						$('.nav--login').hide();
					}
				}
		      
		    	$('.js-single-result').html(html);
		    	$("html, body").animate({ scrollTop: $('.js-single-result').offset().top - 50}, 1000);
			},
		    error: function (err) {
		   		console.log(err);
		    }
		});
}

// LOGIN in order to Review the business
$('.js-review-login').on('click', '.js-login-to-review', event => {
	$('.js-login-modal').show();
	$('#username-log').focus();
});

function reviewQuestionnaireLoggedIn() {
	if(STATE.I_L_I) {
		$('.js-review-login').hide();
		$('.js-review-questionnaire').html(reviewQuestionnaireTemplate(STATE.place_ID)).show();
		$("html, body").animate({ scrollTop: $('#review').offset().top - 50}, 1000);
	} else {
		$('.js-review-login').show();
		$('.js-review-questionnaire').html('').hide();
	}
};

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
	$('.js-review-questionnaire').html('<p class="review-submitted">Your review has been submitted. Thank you for being an accessALLY!</p>');
		window.setTimeout(postReview, 3000);

	const answers = STATE.review_answers;
	const data = {
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

	function postReview() {
		$.ajax({
		type: 'POST',
		url: '/reviews',
		contentType: 'application/json',
	    data: JSON.stringify(data),
	    beforeSend : function( xhr ) {
        	xhr.setRequestHeader( 'Authorization', 'BEARER ' + STATE.J_W_T);
    	},
		success: function() {
			resetReviewSTATE();
			ajaxGetSingleResult('replace');
		},
		error: function(err) {
			console.log(err);
		}
		});
	}
	
};

function resetReviewSTATE() {
	STATE.review_answers = [];
	STATE.review_text = '';
	STATE.current_question= 0;
}

function removeReviewSuccess() {
	$('.js-review-questionnaire').html('').hide();
};

// Launch login modal
$('nav').on('keydown click', '.js-nav-login', event => {
	if(handleEventType(event)) {
		event.preventDefault();
		$('.js-login-modal').show();
		$('#username-log').focus();
	}
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
	   	console.log(err);
	   	$('#login-form-messages').html(`<p>Incorrect username or password</p>`);
	   }
	});
});

function onLogin(usrname, data) {
	$('.js-login-cancel').click();
	$('.js-nav-login').removeAttr('tabindex').hide();
	$('.js-nav-logout').show();

	$('.js-nav-welcome').text(`Welcome ${usrname}`).show();
	STATE.J_W_T = data.authToken;
	STATE.I_L_I = true;
	STATE.username = usrname;
	reviewQuestionnaireLoggedIn();
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
	STATE.I_L_I = false;
	STATE.J_W_T = null;
	STATE.username = null;
	STATE.review_answers = [];
	$('.js-nav-logout').removeAttr('tabindex').hide();
	$('.js-nav-welcome').hide();
	$('.js-nav-login').show();
	reviewQuestionnaireLoggedIn();
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

// Return to Home Page 
$('main, footer').on('keydown click', '#main-title, #main-icon, .footer-icon', event => {
	if(handleEventType(event)) {
		$.ajax({
	    type: 'GET',
	    url: '/',
	    contentType: 'application/json', 
	    success: function() {
	      historyPushState('/');
		},
		error: function (err){
			console.log(err);
		}
		});
	}
});


//   Footer scrolling  //
var didScroll;
var lastScrollBottom = 0;
var delta = 10;
var footerHeight = $('footer').outerHeight();

$(window).scroll(function(event){
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled() {
    var st = $(this).scrollTop();
    
    if(Math.abs(lastScrollBottom - st) <= delta)
        return;
    
    if (st > lastScrollBottom && st > footerHeight){
        $('footer').removeClass('footer-down').addClass('footer-up');
    } else {

        if(st + $(window).height() < $(document).height()) {
            $('footer').removeClass('footer-down').addClass('footer-up');
        }
    }
    
    lastScrollTop = st;
}


$(document).ready(function() {
	if(`${document.location.pathname}${document.location.search}`.split('?').length === 2) {
		let docLocSearch = document.location.search.split('?')[1].split('&');
		STATE.query = docLocSearch[0].split(',').join('').split('%20').join(' ');;
		STATE.lat = docLocSearch[1].split(',')[0];
		STATE.lng = docLocSearch[1].split(',')[1];
		
		const data = {
			query: STATE.query,
			lat: STATE.lat,
			lng: STATE.lng
		};

		googleQuery(data);
	};
	if(document.location.pathname.split('/').length === 3) {
		STATE.place_ID = document.location.pathname.split('/')[2];
		STATE.route = 'single-result';
		STATE.direct = true;
		ajaxGetSingleResult('push');
	};

	
	renderAccessABLE(PAGE_VIEWS);
	handleSingleResult();
});








