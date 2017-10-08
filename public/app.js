const MOCK_USER_REVIEWS = {
	"userReviews": [
		{
			"id": "11111",
			"text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at.",
			"userId": "aaaaa",
			"userName": "John Doe",
			"reviewDate": Date.now()
		},
		{
			"id": "22222",
			"text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at.",
			"userId": "bbbbb",
			"userName": "Jane Doe",
			"reviewDate": Date.now();
		},
		{
			"id": "33333",
			"text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at.",
			"userId": "cccccc",
			"userName": "Jack Doe",
			"reviewDate": Date.now();
		},
		{
			"id": "44444",
			"text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at.",
			"userId": "ddddd",
			"userName": "Judy Doe",
			"reviewDate": Date.now();
		},
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


