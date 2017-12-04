const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	firstName: {type: String, default: ''},
	lastName: {type: String, default: ''},
	userBio: {type: String, default: ''},
	reviews: {type: Array, default: []}
});

userSchema.methods.userApiRep = function() {
	return {
		userId: this._id,
		username: this.username || '',
		firstName: this.firstName || '',
		lastName: this.lastName || '',
		userBio: this.userBio || '',
		reviews: this.reviews || []
	};
};

userSchema.methods.validatePassword = function(password) {
	return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
	return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', userSchema);

module.exports = {User};