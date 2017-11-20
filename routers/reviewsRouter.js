const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const loggedIn = require('../middlewares/is-logged-in-middleware');

mongoose.Promise = global.Promise;

const reviewsGetRouter = require('./reviewsRouters/reviewsGetRouter');
const reviewsGetIdRouter = require('./reviewsRouters/reviewsGetIdRouter');
const reviewsPostRouter = require('./reviewsRouters/reviewsPostRouter');
const reviewsPutRouter = require('./reviewsRouters/reviewsPutRouter');
const reviewsDeleteRouter = require('./reviewsRouters/reviewsDeleteRouter');

router.get('/', reviewsGetRouter);
router.get('/:place_id', reviewsGetIdRouter);

router.post('/', jsonParser, reviewsPostRouter);
router.put('/:id', [loggedIn, jsonParser], reviewsPutRouter);
router.delete('/:id', loggedIn, reviewsDeleteRouter);

module.exports = router;