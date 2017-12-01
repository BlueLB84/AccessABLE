const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });

mongoose.Promise = global.Promise;

const reviewsGetRouter = require('./reviewsRouters/reviewsGetRouter');
const reviewsGetIdRouter = require('./reviewsRouters/reviewsGetIdRouter');
const reviewsPostRouter = require('./reviewsRouters/reviewsPostRouter');
const reviewsPutRouter = require('./reviewsRouters/reviewsPutRouter');
const reviewsDeleteRouter = require('./reviewsRouters/reviewsDeleteRouter');

router.get('/', jsonParser, reviewsGetRouter);
router.get('/:place_id', reviewsGetIdRouter);

router.post('/', [jwtAuth, jsonParser], reviewsPostRouter);
router.put('/:id', [jwtAuth, jsonParser], reviewsPutRouter);
router.delete('/:id', jwtAuth, reviewsDeleteRouter);

module.exports = router;