const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();
const expect = chai.expect;

const {Review} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);


describe('Verify root url working', function() {
		before(function() {
			return runServer();
		});
		after(function() {
			return closeServer();
		});

		it('should return 200 status on GET', function() {
			return chai.request(app)
				.get('/')
				.then(function(res) {
					res.should.have.status(200);
				});
			});
		
		it('should return HTML on GET', function() {
			return chai.request(app)
				.get('/')
				.then(function(res) {
					expect(res).to.be.html;
				});
			});
	});


function seedReviewData() {
	console.info('seeding review data');
	const seedData = [];

	for(let i=1; i<=10; i++) {
		seedData.push(generateReviewData());
	}
	return Review.insertMany(seedData); // returns a promise
}

// generate object representing a review for db seed data
// or request.body data
function generateReviewData() {
	return{
		// faker schema
	}
}

function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}

describe('Reviews API resource', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		return seedReviewData(); // need to build out generateReviewData
	});

	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});

	describe('reviews GET endpoint', function() {
		before(function() {
			return runServer();
		});
		after(function() {
			return closeServer();
		});

		it('should return all existing reviews', function() {
			let res;
			return chai.request(app)
				.get('/reviews')
				.then(function(_res) {
					res = _res;
					res.should.have.status(200);
					res.body.reviews.should.have.length.of.at.least(1);
					return Review.count();
				})
				.then(function(count) {
					res.body.reviews.should.have.lengthOf(count);
				});
			});

		it('should return 200 status on review id GET', function() {
			return chai.request(app)
				.get('/reviews')
				.then(function(res) {
					res.should.have.status(200);
				});
		});
	});

	describe('reviews POST endpoint', function() {
		
		it('should add a new review', function() {
			return chai.request(app)
				.post('/reviews/new-review')
				// build out
		});
	});

	describe('reviews PUT input',function() {

		it('should update fields sent over', function() {
			const updateData = {
				// review properties to update with fake data
			};

		return Review
			.findOne()
			.then(function(review) {
				updateData.id = review.id;
				return chai.request(app)
					.put(`/reviews/update-review/${review.id}`)
					.send(updateData);
			})
			.then(function(res) {
				res.should.have.status(204);
				return Review.findById(updateData.id);
			})
			.then(function(review) {
				// build out what should equal what
				// ex: restaurant.name.should.equal(updateData.name);
			});
		});
	});

	describe('reviews DELETE endpoint', function() {

		it('should delete a review by id', function() {
			let review;

			return Review
				.findOne()
				.then(function(_review) {
					review = _review;
					return chai.request(app).delete(`/reviews/delete-review/${review.id}`);
				})
				.then(function(res) {
					res.should.have.status(204);
					return Review.findById(review.id);
				})
				.then(function(_review) {
					should.not.exist(_review);
				});
		});
	});
/// end describe 'Reviews API resource' ///
})	
	

