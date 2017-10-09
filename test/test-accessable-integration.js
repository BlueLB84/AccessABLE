const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const expect = chai.expect;

// const {Review} = require('../models');
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
				expect(res).to.be.html;
				res.should.have.status(200);
			});
	});
});