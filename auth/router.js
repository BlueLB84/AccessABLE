const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('../config');

const createAuthToken = user => {
	return jwt.sign({user}, config.JWT_SECRET, {
		subject: user.username,
		expiresIn: config.JWT_EXPIRY,
		algorithm: 'HS256'
	});
};

const router = express.Router();
const jwtAuth = passport.authenticate('jwt', { session: false }); 

router.post(
	'/login',
	passport.authenticate('basic', {session: true}),
	(req, res) => {
		const authToken = createAuthToken(req.user.userApiRep());
		res.json({authToken});
	}
);

router.post('/refresh', jwtAuth, (req, res) => {
		const authToken = createAuthToken(req.user);
		res.json({authToken});
	}
);

module.exports = {router};