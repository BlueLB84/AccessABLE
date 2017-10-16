const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {Review} = require('../../models');

module.exports = function(req, res) {
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
};

