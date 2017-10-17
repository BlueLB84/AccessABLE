const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {User} = require('../../user-models');

module.exports = function(req, res) {
	User
	.findByIdAndRemove(req.params.username)
	.then(review => res.status(204).end())
	.catch(err => res.status(500).json({message: 'Internal server error'}));
};