const passport = require('passport');
const {BasicStrategy} = require('passport-http');
const {
	Strategy: JwtStrategy,
	ExtractJwt
} = require('passport-jwt');

const {User} = require('../user-models');
const {JWT_SECRET} = require('../config');

const basicStrategy = new BasicStrategy((username, password, callback) => {
	let user;
	User
	.findOne({ username: username })
	.then(_user => {
		user = _user;
		if (!user) {
			return Promise.reject({
				reason: 'LoginError',
				message: 'Incorrect username or password'
			});
		}
		return user.validatePassword(password);
	})
	.then(isValid => {
		if (!isValid) {
			return Promise.reject({
				reason: 'LoginError',
				message: 'Incorrect username or password'
			});
		}
		return callback(null, user);
	})
	.catch(err => {
		if (err.reason === 'LoginError') {
			return callback(null, false, err.message);
		}
		return callback(err, false);
	});
});


passport.use(new BasicStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.validPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));

const jwtStrategy = new JwtStrategy(
	{
		secretOrKey: JWT_SECRET,
		jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
		algorithms: ['HS256']
	},
	(payload, done) => {
		done(null, payload.user);
	}
);

module.exports = {basicStrategy, jwtStrategy};