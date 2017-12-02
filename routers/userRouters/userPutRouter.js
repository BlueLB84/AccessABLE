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
	
	if (req.params.userid !== req.body.userId) {
		const message = (`Request path user ID (${req.params.userid}) and request body user ID(${req.body.userId}) must match`);
		console.error(message);
		return res.status(400).send(message);
	}

	console.log(`Updating user with user ID: ${req.params.userid}`);
	const toUpdate = {};
	const updateableField = 'userBio';

	if (updateableField in req.body) {
			toUpdate[updateableField] = req.body[updateableField];
		}
	

	User
		.findByIdAndUpdate(req.params.userid, {$set: toUpdate})
		.then(user => res.status(204).end())
		.catch(err => res.status(500).json({message: 'Internal server error'}));
};

