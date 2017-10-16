const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

mongoose.Promise = global.Promise;

const userReviewsGetRouter = require('./userReviewsRouters/userReviewsGetRouter');
const userReviewsGetIdRouter = require('./userReviewsRouters/userReviewsGetIdRouter');
const userReviewsPostRouter = require('./userReviewsRouters/userReviewsPostRouter');
const userReviewsPutRouter = require('./userReviewsRouters/userReviewsPutRouter');
const userReviewsDeleteRouter = require('./userReviewsRouters/userReviewsDeleteRouter');

router.get('/', userReviewsGetRouter);
router.get('/:id', userReviewsGetIdRouter);

router.post('/', jsonParser, userReviewsPostRouter);
router.put('/:id', jsonParser, userReviewsPutRouter);
router.delete('/:id', userReviewsDeleteRouter);

module.exports = router;