const axios = require('axios');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const queryString = require('qs');
var session = require('express-session');
const {Review} = require('../models');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

router.get('/', function(req, res) {
	req.session.query = req.query.query;
	const GOOGLE_PLACE_SEARCH_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json?";
	const queryParams = {
		key: 'AIzaSyBTSkR1xxnbH7JcdIl23wNP5TIl5DGpPkk',
		radius: 1600,
		location: `${req.query.lat},${req.query.lng}`,
		query: req.query.query
	}

	var details = axios.get(`${GOOGLE_PLACE_SEARCH_URL}${queryString.stringify(queryParams)}`);
	
	details.then(response => {
		res.send(response.data.results);
	})
	.catch(e => {
		console.log(e);
	});	
});

router.get('/:place_id', function(req, res) {
	const GOOGLE_PLACE_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyBTSkR1xxnbH7JcdIl23wNP5TIl5DGpPkk&placeid=";
	var details = axios.get(`${GOOGLE_PLACE_DETAILS_URL}${req.params.place_id}`);
	var reviews = Review.find({businessId: req.params.place_id});

	Promise.all([details, reviews]).then(responses => {
		const reviewsData = responses[1];
		const reviewsRatings = reviewsData.map(review => review.userRatings);
		console.log(reviewsRatings);

		function reviewCategoryPct(item) {
		  let result = reviewsRatings.filter(review => review[item] === true).length;
		  return `${(result/reviewsRatings.length) * 100}%`;
		}

		const detailsData = responses[0].data.result;
		const GOOGLE_STATIC_MAP_URL = 'https://maps.googleapis.com/maps/api/staticmap?size=300x300&maptype=roadmap&zoom=14&key=AIzaSyCPxCKyI-0Jt2BLFhjrLK112M2N_M8qHSQ&markers=color:blue&markers=';
		
		res.render('index', 
			{ title: 'accessABLE', 
			place_name: `${detailsData.name}`, 
			address: `${detailsData.formatted_address}`, 
			img_src: `${GOOGLE_STATIC_MAP_URL}${detailsData.geometry.location.lat},${detailsData.geometry.location.lng}`, 
			img_title: `${detailsData.name} static map`,
			recentReviews: `${reviewsData.splice(0, 2)}`,
			parking_pct: `${reviewCategoryPct('parkingSpaces')}`,
			access_pct: `${reviewCategoryPct('access')}`,
			service_pct: `${reviewCategoryPct('service')}`,
			int_nav_pct: `${reviewCategoryPct('interiorNavigation')}`,
			restroom_pct: `${reviewCategoryPct('restroom')}`,
			serv_dog_pct: `${reviewCategoryPct('serviceAnimal')}`
			}); // look at PUG docs for list iteration
	}).catch(e => {
		console.log(e);
	});
	
});

module.exports = router;