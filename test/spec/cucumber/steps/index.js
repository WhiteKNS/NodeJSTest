import superagent from 'superagent';
import { When, Then } from 'cucumber';
import assert from 'assert'

When('the client creates a POST request to users', function () {
	this.request = superagent('POST', `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}/users`);
});

When('the client creates a PATCH request to users', function () {
	this.request = superagent('PATCH', `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}/users`);
});

When('the client creates a PUT request to users', function () {
	this.request = superagent('PUT', `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}/users`);
});

When(/^attaches a generic (.+) payload$/, function (payloadType) {
	switch (payloadType) {
		case 'malformed':
			this.request
				.send('{"email": "academic13forte@gmail.com", name: }')
				.set('Content-Type', 'application/json');
			break;
		case 'non-JSON':
			this.request
				.send('<?xml version="1.0" encoding="UTF-8"?><email>academic13forte@gmail.com</email>')
				.set('Content-Type', 'text/xml');
			break;
		case 'empty':
		default:
	}
});

When(/^sends the request$/, function (callback) {
	this.request
		.then((response) => {
			this.response = response.res;
			callback();
		})
		.catch((error) => {
			this.response = error.response;
			callback();
		});
});

Then(/^our API should respond with a ([1-5]\d{2}) HTTP status code$/, function (statusCode) {
	assert.equal(this.response.statusCode, statusCode);
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

Then(/^contains a message property which says (?:"|')(.*)(?:"|')$/, function (message) {
	if (this.responsePayload.message !== message) {
		assert.equal(this.responsePayload.message, message);
	}
});

When(/^without a (?:"|')([\w-]+)(?:"|') header set$/, function (headerName) {
	this.request.unset(headerName);
});