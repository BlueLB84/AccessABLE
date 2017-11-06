const mongoose = require('mongoose');
const axios = require('axios');


mongoose.Promise = global.Promise;

const {Review} = require('../../models');

module.exports = function(req, res) {
	// const GOOGLE_PLACE_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyBTSkR1xxnbH7JcdIl23wNP5TIl5DGpPkk&placeid=";
	// var details = axios.get(`${GOOGLE_PLACE_DETAILS_URL}${req.params.place_id}`);
	// details.then(response => {
	// 	const data = response.data.result;
	// 	const GOOGLE_STATIC_MAP_URL = 'https://maps.googleapis.com/maps/api/staticmap?size=300x300&maptype=roadmap&zoom=14&key=AIzaSyCPxCKyI-0Jt2BLFhjrLK112M2N_M8qHSQ&markers=color:blue&markers=';
	// 	res.render('index', { title: 'accessABLE', place_name: `${data.name}`, address: `${data.formatted_address}`, img_src: `${GOOGLE_STATIC_MAP_URL}${data.geometry.location.lat},${data.geometry.location.lng}`, img_title: `${data.name} static map` });
	// }).catch(e => {
	// 	console.log(e);
	// });

	Review
		.findById(req.params.id)
		.then(review => res.json(review.reviewApiRep()))
		.then(res.status(200))
		.catch(err => {
			console.error(err);
				res.status(500).json({message: 'Internal server error'});
		});
};

	