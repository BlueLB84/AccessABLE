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

module.exports = router;