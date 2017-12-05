require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const passport = require('passport');
const session = require('express-session');
const app = express();

// Express Session
var sess = {
  secret: 'keyboard dog',
  cookie: {}
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess));

const {PORT, DATABASE_URL} = require('./config');

const reviewsRouter = require('./routers/reviewsRouter');
const userRouter = require('./routers/userRouter');
const {router: authRouter, basicStrategy, jwtStrategy} = require('./auth');
const resultsRouter = require('./routers/resultsRouter');

mongoose.Promise = global.Promise;

// PUG templates
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

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


// Routers
app.use('/reviews', reviewsRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/results', resultsRouter);

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
	res.status(200);
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// catch all other routess
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