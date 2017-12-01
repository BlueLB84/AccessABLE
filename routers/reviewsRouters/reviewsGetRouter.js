const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {Review} = require('../../models');

module.exports = function(req, res) {
	let businessQuery = {};

	if(req.query.businessId) {
		businessQuery = {'businessId': req.query.businessId}
	} else {
		businessQuery = {};
	}

	Review
		.find(businessQuery)
		.then(reviews => {
			res.json({
				reviews: reviews.map(
					(review) => review.reviewApiRep())
			});
			res.status(200);
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'});
		});
};


