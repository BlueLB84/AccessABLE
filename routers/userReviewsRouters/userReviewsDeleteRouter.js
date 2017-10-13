const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {Review} = require('./models/routers/userReviewsRouters');

router.delete('/', (req, res) => {
	Review
	.findByIdAndRemove(req.params.id)
	.then(review => res.status(204).end())
	.catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = router;