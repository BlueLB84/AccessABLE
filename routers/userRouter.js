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

const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/:userid', jwtAuth, userGetIdRouter);
router.post('/', jsonParser, userPostRouter);
router.put('/:userid', [jwtAuth, jsonParser], userPutRouter);
router.delete('/:userid', jwtAuth, userDeleteRouter);

module.exports = router;
