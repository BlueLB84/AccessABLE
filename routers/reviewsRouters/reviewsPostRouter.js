const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {Review} = require('../../models');
module.exports = function(req, res) {
	const requiredFields = ['businessId', 'userRatings'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	console.log(req.user);
	Review
		.create({
			userId: req.user.userId,
			businessId: req.body.businessId, // Google Places Id
			userRatings: req.body.userRatings,
			reviewText: req.body.reviewText
		})
		.then(
			review => res.status(201).json(review.reviewApiRep()))
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'});
		});
};
