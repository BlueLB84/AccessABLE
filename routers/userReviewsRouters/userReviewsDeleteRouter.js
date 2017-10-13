const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {Review} = require('../../models');

module.exports = function(req, res) {
	Review
	.findByIdAndRemove(req.params.id)
	.then(review => res.status(204).end())
	.catch(err => res.status(500).json({message: 'Internal server error'}));
};

