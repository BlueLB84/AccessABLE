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
	const GOOGLE_STATIC_MAP_URL = 'https://maps.googleapis.com/maps/api/staticmap?size=300x300&maptype=roadmap&zoom=14&key=AIzaSyCPxCKyI-0Jt2BLFhjrLK112M2N_M8qHSQ&markers=color:blue&markers=';

	var details = axios.get(`${GOOGLE_PLACE_SEARCH_URL}${queryString.stringify(queryParams)}`);
	
	details.then(response => {
		const places = response.data.results;
		var reviews = Review.find({businessId: { $in: places.map(place => place.place_id) } });


		reviews.then(reviews => {

			places.forEach((place) => {
				place.userReviews = reviews.filter(review => review.businessId === place.place_id);
				if(place.userReviews.length >= 1) {
					place.reviewIcon = true;
				}
			});

			res.render('results', 
			{places: places,
			staticURL: GOOGLE_STATIC_MAP_URL
			});
		})
		
		
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
		
		const reviewsText = reviewsData.map(function(review) {
			if(review.reviewText !== undefined) {
				return review.reviewText;
			} else {
				return ;
			}
		});

		function reviewCategoryPct(item) {
			let result = reviewsRatings.filter(review => review[item] === true).length;

			if(reviewsRatings.length >= 1) {
				return `${result}/${reviewsRatings.length}`;
			} else {
				return '';
			}
		};

		const detailsData = responses[0].data.result;
		const GOOGLE_STATIC_MAP_URL = 'https://maps.googleapis.com/maps/api/staticmap?size=300x300&maptype=roadmap&zoom=14&key=AIzaSyCPxCKyI-0Jt2BLFhjrLK112M2N_M8qHSQ&markers=color:blue&markers=';
		
		res.render('index', 
			{ title: 'accessABLE', 
			place_name: detailsData.name, 
			address: detailsData.formatted_address, 
			img_src: `${GOOGLE_STATIC_MAP_URL}${detailsData.geometry.location.lat},${detailsData.geometry.location.lng}`, 
			img_title: `${detailsData.name} static map`,
			reviewText: reviewsText,
			parking_pct: reviewCategoryPct('parkingSpaces'),
			access_pct: reviewCategoryPct('access'),
			service_pct: reviewCategoryPct('service'),
			int_nav_pct: reviewCategoryPct('interiorNavigation'),
			restroom_pct: reviewCategoryPct('restroom'),
			serv_dog_pct: reviewCategoryPct('serviceAnimal')
			});
	}).catch(e => {
		console.log(e);
	});
	
});

module.exports = router;