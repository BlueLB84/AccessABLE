require('dotenv').config();
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

app.set('index', './views');
app.set('view engine', 'pug');

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

// app.get('/details/:place_id', function(req, res) {
// 	console.log(req.params.place_id);
// 	const GOOGLE_PLACE_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyBTSkR1xxnbH7JcdIl23wNP5TIl5DGpPkk&placeid=";
// 	var details = axios.get(`${GOOGLE_PLACE_DETAILS_URL}${req.params.place_id}`);
// 	details.then(response => {
// 		// res.json(response.data);
// 		var data = response.data.result;
// 		const GOOGLE_STATIC_MAP_URL = 'https://maps.googleapis.com/maps/api/staticmap?size=300x300&maptype=roadmap&zoom=14&key=AIzaSyCPxCKyI-0Jt2BLFhjrLK112M2N_M8qHSQ&markers=color:blue&markers=';
// 		res.render('index', { title: 'accessABLE', place_name: `${data.name}`, address: `${data.formatted_address}`, img_src: `${GOOGLE_STATIC_MAP_URL}${data.geometry.location.lat},${data.geometry.location.lng}`, img_title: `${data.name} static map` });
// 	}).catch(e => {
// 		console.log(e);
// 	})
// })

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