const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();
const expect = chai.expect;

const {User} = require('../user-models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

/// SEED DATA GENERATION AND DB INSERTION ///

function seedUserData() {
	console.info('seeding user data');
	const seedData = [];

	for(let i=1; i<=5; i++) {
		seedData.push(generateUserData());
	}
	return User.insertMany(seedData); // returns a promise
}

function generateUserData() {
	return {
		username: faker.lorem.word(),
		password: faker.lorem.word(),
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
		userBio: faker.lorem.sentence()
	}
}

// delete db after each test
function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}

/// TESTS ///

describe('Users API resource', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		return seedUserData();
	});

	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});

	describe('users GET endpoint', function() {

		it('should return 200 status on user id GET', function() {
			let user;
			
			return User
				.findOne()
				.then(function(_user) {
					user = _user;
					return chai.request(app).get(`/users/${user.id}`);
				})
				.then(function(res) {
					res.should.have.status(200);
				});
		});

		it('should return user with right fields', function() {
			let resUser;
			
			return User
				.findOne()
				.then(function(_resUser) {
					resUser = _resUser;
					return chai.request(app).get(`/users/${resUser.id}`);
				})
				.then(function(res) {
					console.log(res.body);
					res.should.be.json;
					res.body.should.be.a('object');

					res.body.should.include.keys(
						'userId', 'username', 'firstName', 'lastName', 'userBio');
				});
					
		});
	});
});


