const axios = require('axios');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const queryString = require('qs');
var session = require('express-session');

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
	details.then(response => {
		const data = response.data.result;
		const GOOGLE_STATIC_MAP_URL = 'https://maps.googleapis.com/maps/api/staticmap?size=300x300&maptype=roadmap&zoom=14&key=AIzaSyCPxCKyI-0Jt2BLFhjrLK112M2N_M8qHSQ&markers=color:blue&markers=';
		res.render('index', { title: 'accessABLE', place_name: `${data.name}`, address: `${data.formatted_address}`, img_src: `${GOOGLE_STATIC_MAP_URL}${data.geometry.location.lat},${data.geometry.location.lng}`, img_title: `${data.name} static map` });
	}).catch(e => {
		console.log(e);
	});
});

module.exports = router;