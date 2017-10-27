require('dotenv').config();
const axios = require('axios');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');

const app = express();

const reviewsRouter = require('./routers/reviewsRouter');
const userRouter = require('./routers/userRouter');
const {router: authRouter, basicStrategy, jwtStrategy} = require('./auth');

mongoose.Promise = global.Promise;

app.use(morgan('common'));
app.use(express.static('public'));

// CORS
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
	if (req.method === 'OPTIONS') {
		return res.send(204);
	}
	next();
});

// Authentication
app.use(passport.initialize());
passport.use(basicStrategy);
passport.use(jwtStrategy);

// Routers
app.use('/reviews', reviewsRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);

app.get('/details/test', function(req, res) {
	var details = axios.get("https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyBTSkR1xxnbH7JcdIl23wNP5TIl5DGpPkk&placeid=ChIJ77AxGGGR44kR-lxxEuJa0og")
	details.then(response => {
		res.json(response.data);
	}).catch(e => {
		console.log(e);
	})
})

// res.render(mustacheTemplate, response.data);

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
	res.status(200);
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.use('*', function(req, res) {
	res.status(404).json({message: 'Oops! Not found. You might be lost. Marco. Polo.'});
});

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, {useMongoClient: true}, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(port, () => {
				console.log(`Your app is listening on port ${port}`);
				resolve();
			})
			.on('error', err => {
				mongoose.disconnect();
				reject(err);
			});
		});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
	runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};