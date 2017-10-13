const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Review} = require('./models/routers/userReviewsRouters');

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ["userId", "businessId", "userRatings"];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	Review
		.create({
			userId: req.body.userId, 
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
});

module.exports = router;