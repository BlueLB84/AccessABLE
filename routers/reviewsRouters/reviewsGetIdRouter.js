const mongoose = require('mongoose');
const axios = require('axios');


mongoose.Promise = global.Promise;

const {Review} = require('../../models');

module.exports = function(req, res) {
	
	Review
		.findById(req.params.place_id)
		.then(review => res.json(review.reviewApiRep()))
		.then(res.status(200))
		.catch(err => {
			console.error(err);
				res.status(500).json({message: 'Internal server error'});
		});
};

	