const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');

const app = express();

const userReviewsRouter = require('./routers/userReviewsRouter');
// const userProfileRouter = require('./routers/userProfileRouter');


app.use(morgan('common'));
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
	res.status(200);
});

app.use('/reviews', userReviewsRouter);
// app.use('/users', userProfileRouter);

app.use('*', function(req, res) {
	res.status(404).json({message: 'Oops! Not found. You might be lost. Marco. Polo.'});
});

let server;

// function runServer(databaseUrl=DATABASE_URL, port=PORT, callback) {
// 	return new Promise((resolve, reject) => {
// 		mongoose.connect(databaseUrl, {useMongoClient: true}, err => {
// 			if (err) {
// 				return reject(err);
// 			}
// 			server = app.listen(port, () => {
// 				console.log(`Your app is listening on port ${port}`);
// 				resolve();
// 			})
// 			.on('error', err => {
// 				mongoose.disconnect();
// 				reject(err);
// 			});
// 		});
// 	});
// }

function runServer(databaseUrl=DATABASE_URL, port=PORT, callback) {
  mongoose.Promise = global.Promise;
  mongoose.connect(DATABASE_URL, { useMongoClient: true });
  var db = mongoose.connection;
  
  server = app.listen(port, () => {
				console.log(`Your app is listening on port ${port}`);
				resolve();
			});

  db.on("error", function(err) {
    console.error("Failed to connect to database");
    process.exit(1);
  });

  db.once("open", function() {
    console.info("Connected to database");
    callback();
  });
};

// Wait for db connection, launch server
runServer(function() {
  app.listen(app.get("port"), function() {
    console.log("Node app is running on port", app.get("port"));
  });
});

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