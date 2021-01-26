import superagent from 'superagent';
import { When, Then } from 'cucumber';

When('the client creates a POST request to users', function () {
	this.request = superagent('POST', `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}/users`);
});
When('attaches a generic empty payload', function () {
	return undefined;
});
When('sends the request', function (callback) {
	this.request
		.then((response) => {
			this.response = response.res;
			callback();
		})
		.catch((errResponse) => {
			this.response = errResponse.response;
			callback();
		});
});
Then('our API should respond with a 400 HTTP status code', function () {
	if (this.response.statusCode !== 400) {
		assert.equal(this.response.statusCode, 400);
	}
});
Then('the payload of the response should be a JSON object', function () {
	const contentType = this.response.headers['Content-Type'] || this.response.headers['content-type'];

	if (!contentType || !contentType.includes('application/json')) {
		throw new Error('Response not of Content-Type application/json');
	}
	// Check it is valid JSON
	try {
		this.responsePayload = JSON.parse(this.response.text);
	} catch (e) {
		throw new Error('Response not a valid JSON object');
	}
});
Then('contains a message property which says "Payload should not be empty"', function () {
	if (this.responsePayload.message !== 'Payload should not be empty') {
		assert.equal(this.responsePayload.message, 'Payload should not be empty');
	}
});