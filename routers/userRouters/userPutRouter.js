const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {User} = require('../../user-models');

module.exports = function(req, res) {
	const requiredFields = ['userId', 'password'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	if (req.params.userId !== req.body.userId) {
		const message = (`Request path id (${req.params.userId}) and request body userId (${req.body.userId}) must match`);
		console.error(message);
		return res.status(400).send(message);
	}

	console.log(`Updating user with userId: ${req.params.userId}`);
	const toUpdate = {};
	const updateableField = 'userBio';

	if (updateableField in req.body) {
			toUpdate[field] = req.body[field];
		}
	

	User
		.findByIdAndUpdate(req.params.userId, {$set: toUpdate})
		.then(review => res.status(204).end())
		.catch(err => res.status(500).json({message: 'Internal server error'}));
};

// might need to add additional updatable fields
// which id is required? id or userId?

