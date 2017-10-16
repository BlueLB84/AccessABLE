const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

mongoose.Promise = global.Promise;

const userGetIdRouter = require('./userRouters/userGetIdRouter');
const userPostRouter = require('./userRouters/userPostRouter');
const userPutRouter = require('./userRouters/userPutRouter');
const userDeleteRouter = require('./userRouters/userDeleteRouter');

router.get('/:id', userGetIdRouter);
router.post('/', jsonParser, userPostRouter);
router.put('/:id', jsonParser, userPutRouter);
router.delete('/:id', userDeleteRouter);

module.exports = router;


// write and link to middleware functions for each of these endpoints