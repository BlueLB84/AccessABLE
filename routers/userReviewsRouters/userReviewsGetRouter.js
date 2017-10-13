const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {Review} = require('./models/routers/userReviewsRouters');

router.get('/', (req, res) => {
	Review
		.find()
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
});

router.get('/:id', (req, res) => {
	Review
		.findById(req.params.id)
		.then(review => res.json(review.reviewApiRep()))
		.then(res.status(200))
		.catch(err => {
			console.error(err);
				res.status(500).json({message: 'Internal server error'});
		});
});

module.exports = router;