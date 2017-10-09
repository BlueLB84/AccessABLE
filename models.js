const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
	//id : use uuid
	userId: {type: String, required: true},
	user: {
		firstName: {type: String, required: true},
		lastName: {type: String, required: true}
	},
	userName: {type: String, required: true},
	business: {
		name: {type: String, required: true},
		address: {
			building: String,
			coord: [String],
			street: String,
			zipcode: String
		}
	},
	reviewDate: Date.now(),	
	userRatings: {
		ramp: {type: Boolean, required: true},
		parkingSpaces: {type: Boolean, required: true},
		interiorNavigation: {type: Boolean, required: true},
		restroom: {type: Boolean, required: true},
		service: {type: Boolean, required: true},
		serviceAnimal: {type: Boolean, required: true}
	},
	reviewText: String
});

reviewSchema.virtual('businessAddress').get(function() {
	return `${this.address.building} ${this.address.street}`.trim()});

reviewSchema.methods.reviewsApiRep = function() {
	return {
		id: this._id,
		businessName: this.business.name,
		address: this.businessAddress,
		userName: this.userName,
		userRatings: this.userRatings,
		reviewText: this.reviewText,
		reviewDate: this.reviewDate
	};
}

const Review = mongoose.model('Review', reviewSchema);

module.exports = {Review};



