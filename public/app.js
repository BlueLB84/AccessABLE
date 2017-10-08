const MOCK_USER_REVIEWS = {
	"userReviews": [
		{
			"id": "11111",
			"userId": "aaaaa",
			"user" : {
				"firstName": "John",
				"lastName" : "Doe"
			},
			"userName": "JohnDoe72",
			"reviewDate": Date.now(),
			"userRatings" : [
				{"ramp" : true},
				{"parkingSpaces" : true},
				{"interiorNavigation" : true},
				{"restroom" : true},
				{"service" : true},
				{"serviceAnimal" : true}
			],
			"reviewText": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at."
		},
		{
			"id": "22222",
			"userId": "bbbbb",
			"user" : {
				"firstName": "Jane",
				"lastName" : "Doe"
			},
			"userName": "JaneDoe55",
			"reviewDate": Date.now(),
			"userRatings" : [
				{"ramp" : true},
				{"parkingSpaces" : true},
				{"interiorNavigation" : true},
				{"restroom" : true},
				{"service" : true},
				{"serviceAnimal" : false}
			],
			"reviewText": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at."
		},
		{
			"id": "33333",
			"userId": "ccccc",
			"user" : {
				"firstName": "Jack",
				"lastName" : "Doe"
			},
			"userName": "JackDoe93",
			"reviewDate": Date.now(),
			"userRatings" : [
				{"ramp" : true},
				{"parkingSpaces" : false},
				{"interiorNavigation" : true},
				{"restroom" : true},
				{"service" : true},
				{"serviceAnimal" : true}
			],
			"reviewText": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at."
		},
		{
			"id": "44444",
			"userId": "ddddd",
			"user" : {
				"firstName": "Jerry",
				"lastName" : "Doe"
			},
			"userName": "JerrDoe88",
			"reviewDate": Date.now(),
			"userRatings" : [
				{"ramp" : true},
				{"parkingSpaces" : false},
				{"interiorNavigation" : false},
				{"restroom" : true},
				{"service" : true},
				{"serviceAnimal" : true}
			],
			"reviewText": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at."
		},
		{
			"id": "55555",
			"userId": "eeeee",
			"user" : {
				"firstName": "Jenine",
				"lastName" : "Doe"
			},
			"userName": "JennyDoe2000",
			"reviewDate": Date.now(),
			"userRatings" : [
				{"ramp" : true},
				{"parkingSpaces" : false},
				{"interiorNavigation" : true},
				{"restroom" : false},
				{"service" : true},
				{"serviceAnimal" : true}
			],
			"reviewText": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at."
		}
	]
};

function getRecentUserReviews(callbackFn) {
	setTimeout(function(){callbackFn(MOCK_USER_REVIEWS)}, 100);
}

function displayUserReviews(data) {
	for (index in data.userReviews) {
		$('body').append(
			`<p> ${data.statusUpdates[index].text} <p>`);
	}
}

function getAndDisplayUserReviews() {
	getRecentUserReviews(displayUserReviews);
}

$(function() {
	getAndDisplayUserReviews();
});


