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

function seedUserData() {
	console.info('seeding user data');
	const seedData = [];

	for(let i=1; i<=5; i++) {
		seedData.push(generateUserData());
	}
	return User.insertMany(seedData);
}

function generateUserData() {

	return {
		username: faker.lorem.word(),
		password: faker.internet.password(),
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
		userBio: faker.lorem.sentence()
	}
}

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

	//  /users/:id GET
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
					res.should.be.json;
					res.body.should.be.a('object');

					res.body.should.include.keys(
						'userId', 'username', 'firstName', 'lastName', 'userBio');
				});	
		});
	});

	//  /users POST
	describe('users POST endpoint', function() {
		
		it('should add a new user', function() {
			const newUser = generateUserData();

			return chai.request(app)
				.post('/users')
				.send(newUser)
				.then(function(res) {
					res.should.have.status(201);
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.should.include.keys(
						'userId', 'username', 'firstName', 'lastName', 'userBio');
					res.body.userId.should.not.be.null;
					res.body.username.should.equal(newUser.username);
					res.body.firstName.should.equal(newUser.firstName);
					res.body.lastName.should.equal(newUser.lastName);
					res.body.userBio.should.equal(newUser.userBio);
					return User.findById(res.body.userId);
				})
				.then(function(user) {
					user.username.should.equal(newUser.username);
					user.firstName.should.equal(newUser.firstName);
					user.lastName.should.equal(newUser.lastName);
					user.userBio.should.equal(newUser.userBio);
				});
		});
	});

	//  /users PUT
	describe('users PUT input', function() {

		it('should update field sent over', function() {
			const updateData = {
				userBio: 'This is a test'
			};

		return User
			.findOne()
			.then(function(user) {
				updateData.userId = user.id;
				updateData.username = user.username;
				return chai.request(app)
					.put(`/users/${user.id}`)
					.send(updateData);
			})
			.then(function(res) {
				res.should.have.status(204);
				return User.findById(updateData.userId);
			})
			.then(function(user) {
				user.userBio.should.equal(updateData.userBio);
			});
		});
	});

	//  /users DELETE
	describe('users DELETE endpoint', function() {

		it('should delete a user by id', function() {
			let user;

			return User
				.findOne()
				.then(function(_user) {
					user = _user;
					return chai.request(app).delete(`/users/${user.id}`);
				})
				.then(function(res) {
					res.should.have.status(204);
					return User.findById(user.id);
				})
				.then(function(_user) {
					should.not.exist(_user);
				});
		});
	});
});


