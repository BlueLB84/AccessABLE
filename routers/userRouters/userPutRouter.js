const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {User} = require('../../user-models');

module.exports = function(req, res) {
	const requiredField = 'username';
	if (!('username' in req.body)) {
		const message = `Missing username in request body`;
		console.error(message);
		return res.status(400).send(message);
	}
	
	if (req.params.username !== req.body.username) {
		const message = (`Request path username (${req.params.username}) and request body username (${req.body.username}) must match`);
		console.error(message);
		return res.status(400).send(message);
	}

	console.log(`Updating user with username: ${req.params.username}`);
	const toUpdate = {};
	const updateableField = 'userBio';

	if (updateableField in req.body) {
			toUpdate[field] = req.body[field];
		}
	

	User
		.findByIdAndUpdate(req.params.username, {$set: toUpdate})
		.then(review => res.status(204).end())
		.catch(err => res.status(500).json({message: 'Internal server error'}));
};

