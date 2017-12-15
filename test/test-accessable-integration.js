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

function seedReviewData() {
	console.info('seeding review data');
	const seedData = [];

	for(let i=1; i<=5; i++) {
		seedData.push(generateReviewData());
	}
	return Review.insertMany(seedData);
}

function generateBusinessId() {
	const businessIds = ['ChIJPTCWwiSX44kRrkTEFvDzbNs','ChIJxwF5bhWR44kR4hLara3TO2M', 'ChIJe6FlDG2R44kRvcpT-nzWQaY'];
	return businessIds[Math.floor(Math.random() * businessIds.length)];
}

function generateBoolean() {
	return Math.random() >= 0.5;
}

function generateReviewData() {
	return {
		businessId: generateBusinessId(),
		username: faker.lorem.word(),
		userRatings: {
			access: generateBoolean(),
			parkingSpaces: generateBoolean(),
			interiorNavigation: generateBoolean(),
			restroom: generateBoolean(),
			service: generateBoolean(),
			serviceAnimal: generateBoolean()
		},
		reviewText: faker.lorem.sentence()
	}
}

function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}

/// TESTS ///

// accessABLE ROOT URL //
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

//  /reviews API ENDPOINTS  //
describe('Reviews API resource', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		return seedReviewData();
	});

	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});

	//  /reviews and /reviews/:id GET  //
	describe('reviews GET endpoint', function() {
		
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
			let review;
			
			return Review
				.findOne()
				.then(function(_review) {
					review = _review;
					return chai.request(app).get(`/reviews/${review.id}`);
				})
				.then(function(res) {
					res.should.have.status(200);
				});
		});

		it('should return reviews with right fields', function() {
			let resReview;
			return chai.request(app)
				.get('/reviews')
				.then(function(res) {
					res.should.have.status(200);
					res.should.be.json;
					res.body.reviews.should.be.a('array');
					res.body.reviews.should.have.length.of.at.least(1);

					res.body.reviews.forEach(function(review) {
						review.should.be.a('object');
						review.should.include.keys(
							'id', 'businessId', 'userRatings', 'reviewText', 'reviewDate');
					});
					resReview = res.body.reviews[0];
					return Review.findById(resReview.id);
				})
				.then(function(review) {
					resReview.id.should.equal(review.id);
					resReview.businessId.should.equal(review.businessId);
					resReview.userRatings.access.should.equal(review.userRatings.access);
					resReview.reviewText.should.equal(review.reviewText);
				});
		});
	});

	//  /reviews POST  //
	describe('reviews POST endpoint', function() {
		
		it('should add a new review', function() {
			const newReview = generateReviewData();

			return chai.request(app)
				.post('/reviews')
				.send(newReview)
				.then(function(res) {
					res.should.have.status(201);
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.should.include.keys(
						'id', 'businessId', 'userRatings', 'reviewText', 'reviewDate');
					res.body.id.should.not.be.null;
					res.body.businessId.should.equal(newReview.businessId);
					res.body.userRatings.should.be.a('object');
					res.body.reviewText.should.equal(newReview.reviewText);
					res.body.reviewDate.should.not.be.null;
					return Review.findById(res.body.id);
				})
				.then(function(review) {
					review.businessId.should.equal(newReview.businessId);
					review.userRatings.access.should.equal(newReview.userRatings.access);
					review.userRatings.parkingSpaces.should.equal(newReview.userRatings.parkingSpaces);
					review.userRatings.interiorNavigation.should.equal(newReview.userRatings.interiorNavigation);
					review.userRatings.restroom.should.equal(newReview.userRatings.restroom);
					review.userRatings.service.should.equal(newReview.userRatings.service);
					review.userRatings.serviceAnimal.should.equal(newReview.userRatings.serviceAnimal);
					review.reviewText.should.equal(newReview.reviewText);
					review.reviewDate.should.not.be.null;
				});
		});
	});

	//  /reviews PUT  //
	describe('reviews PUT input', function() {

		it('should update field sent over', function() {
			const updateData = {
				reviewText: 'This is a test'
			};

		return Review
			.findOne()
			.then(function(review) {
				updateData.id = review.id;
				updateData.username = review.username;
				return chai.request(app)
					.put(`/reviews/${review.id}`)
					.send(updateData);
			})
			.then(function(res) {
				res.should.have.status(204);
				return Review.findById(updateData.id);
			})
			.then(function(review) {
				review.reviewText.should.equal(updateData.reviewText);
			});
		});
	});

	//  /reviews DELETE  //
	describe('reviews DELETE endpoint', function() {

		it('should delete a review by id', function() {
			let review;

			return Review
				.findOne()
				.then(function(_review) {
					review = _review;
					return chai.request(app).delete(`/reviews/${review.id}`);
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
	

