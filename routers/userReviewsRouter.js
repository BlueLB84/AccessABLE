const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {ReviewsList} = require('../models');

// figure out data schema for reviews
// ReviewsList.create('some key', 'some value');

router.get('/', (req, res) => {
	res.json(ReviewsList.get());
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ["userId", "user", "userName", "userRatings"];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const item = ReviewsList.create(req.body.userId, req.body.user, req.body.userName, req.body.userRatings);
	res.status(201).json(item);
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
	const updatedReview = ReviewsList.update({
		id: req.params.id,
		userId: req.body.userId,
	});
	res.status(204).end();
});

router.delete('/id', (req, res) => {
	ReviewsList.delete(req.params.id);
	console.log(`Deleted review with id \`${req.params.id}\``);
	res.status(204).end();
});

module.exports = router;




