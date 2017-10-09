const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Review} = require('../models');

router.get('/', (req, res) => {
	Review
		.find()
		.then(reviews => {
			res.json({
				reviews: reviews.map(
					(review) => review.reviewApiRep())
			});
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
		.catch(err => {
			console.error(err);
				res.status(500).json({message: 'Internal server error'});
		});
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ["userId", "user", "userName", "business", "userRatings"];
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
			user: req.body.user, 
			userName: req.body.userName, 
			business: req.body.business,
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

router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['id', 'userId'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	if (req.params.id !== req.body.id) {
		const message = (`Request path id (${req.params.id}) and request body id (${req.body.id}) must match`);
		console.error(message);
		return res.status(400).send(message);
	}

	console.log(`Updating review with id: ${req.params.id}`);
	const toUpdate = {};
	const updateableFields = ['userRatings', 'reviewText'];

	updateableFields.forEach(field => {
		if (field in req.body) {
			toUpdate[field] = req.body[field];
		}
	});

	Review
		.findByIdAndUpdate(req.params.id, {$set: toUpdate})
		.then(review => res.status(204).end())
		.catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.delete('/id', (req, res) => {
	Review
	.findByIdAndRemove(req.params.id)
	.then(review => res.status(204).end())
	.catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = router;




