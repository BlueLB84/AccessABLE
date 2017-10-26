const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const passport = require('passport');
const jwt = require('jsonwebtoken');

mongoose.Promise = global.Promise;

const userGetIdRouter = require('./userRouters/userGetIdRouter');
const userPostRouter = require('./userRouters/userPostRouter');
const userPutRouter = require('./userRouters/userPutRouter');
const userDeleteRouter = require('./userRouters/userDeleteRouter');

router.get('/:username', passport.authenticate('jwt', {session: false}), userGetIdRouter);
router.post('/', jsonParser, userPostRouter);
router.put('/:username', jsonParser, userPutRouter);
router.delete('/:username', userDeleteRouter);

module.exports = router;


// write and link to middleware functions for each of these endpoints