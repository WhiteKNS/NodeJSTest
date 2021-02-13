import superagent from 'superagent';
import { When, Then } from 'cucumber';
import assert from 'assert'
import elasticsearch from 'elasticsearch';

import { getValidPayload, convertStringToArray } from './utils';

const client = new elasticsearch.Client({
	host:
	'http://localhost:9200',
});


//When('the client creates a (GET|POST|PATCH|PUT|DELETE|OPTIONS|HEAD) request to users', function (method) {
//	this.request = superagent(method, `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}/users`);
//});

const SERVER_PORT = '8088';
const SERVER_HOST = 'localhost';

When('the client creates a POST request to users', function () {
	this.request = superagent('POST', `${SERVER_HOST}:${SERVER_PORT}/users`);
	//this.request = superagent('POST', `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}/users`);
});

When('the client creates a GET request to salt', function () {
	this.request = superagent('GET', `${SERVER_HOST}:${SERVER_PORT}/salt`);
	//this.request = superagent('POST', `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}/users`);
});

When('the client creates a PATCH request to (.+)', function (router) {
	this.request = superagent('PATCH', `${SERVER_HOST}:${SERVER_PORT}/${router}`);
});

When('the client creates a PUT request to (.+)', function (router) {
	this.request = superagent('PUT', `${SERVER_HOST}:${SERVER_PORT}/${router}`);
});

When('the client creates a GET request to (.+)', function (router) {
	this.request = superagent('GET', `${SERVER_HOST}:${SERVER_PORT}/${router}`);
});

When('the client creates a POST request to login', function () {
	this.request = superagent('POST', `${SERVER_HOST}:${SERVER_PORT}/login`);
});

When('the client creates a DELETE request to \\/users\\/:users.{int}.id', function (int) {
	this.request = superagent('DELETE', `${SERVER_HOST}:${SERVER_PORT}/users/igRQRXcBCszJnAtvVlSO`);
});

When('the client creates a DELETE request to \\/users\\/:userId', function (int) {
	this.request = superagent('DELETE', `${SERVER_HOST}:${SERVER_PORT}/users/:igRQRXcBCszJnAtvVlSO`);
});

When(/^attaches a generic (.+) payload$/, function (payloadType) {
	switch (payloadType) {
		case 'malformed':
			let req = {
				email: "zzzzzz@gmail.com",
				digest: "abc",
				name: null
			};
			this.request
				.send(req)
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

Then(/^the payload of the response should be an? ([a-zA-Z0-9, ]+)$/, function (payloadType) {
	const contentType = this.response.headers['Content-Type'] || this.response.headers['content-type'];

	if (payloadType === 'JSON object') {
		if (!contentType || !contentType.includes('application/json')) {
			throw new Error('Response not of Content-Type application/json');
		}

		// Check it is valid JSON
		try {
			this.responsePayload = JSON.parse(this.response.text);
		} catch (e) {
			throw new Error('Response not a valid JSON object');
		}
	} else if (payloadType === 'string') {
		// Check Content-Type header
		if (!contentType || !contentType.includes('text/plain')) {
			throw new Error('Response not of Content-Type text/plain');
		}

		// Check it is a string
		this.responsePayload = this.response.text;
		if (typeof this.responsePayload !== 'string') {
			throw new Error('Response not a string');
		}
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

When(/^attaches an? (.+) payload which is missing the ([a-zA-Z0-9, ]+) fields?$/, function (payloadType, missingFields) {
	this.requestPayload = getValidPayload(payloadType, client);

	const fieldsToDelete = convertStringToArray(missingFields);

	fieldsToDelete.forEach(field => delete this.requestPayload[field]);
	this.request
		.send(JSON.stringify(this.requestPayload))
		.set('Content-Type', 'application/json');
});

When(/^attaches an? (.+) payload where the ([a-zA-Z0-9, ]+) fields? (?:is|are)(\s+not)? a ([a-zA-Z]+)$/, function (payloadType, fields, invert, type) {
	this.requestPayload = getValidPayload(payloadType, client);

	const typeKey = type.toLowerCase();
	const invertKey = invert ? 'not' : 'is';
	const sampleValues = {
		string: {
			is: 'string',
			not: 10,
		},
	};

	const fieldsToModify = convertStringToArray(fields);

	fieldsToModify.forEach((field) => {
		this.requestPayload[field] = sampleValues[typeKey][invertKey];
	});

	this.request
		.send(JSON.stringify(this.requestPayload))
		.set('Content-Type', 'application/json');
});

When(/^attaches an? (.+) payload where the ([a-zA-Z0-9, ]+) fields? (?:is|are) exactly (.+)$/, function (payloadType, fields, value) {
	this.requestPayload = getValidPayload(payloadType, client);

	const fieldsToModify = convertStringToArray(fields);

	fieldsToModify.forEach((field) => {
		this.requestPayload[field] = value;
	});

	this.request
		.send(JSON.stringify(this.requestPayload))
		.set('Content-Type', 'application/json');
});

When(/^attaches a valid (.+) payload$/, function (payloadType) {
	this.requestPayload = getValidPayload(payloadType, client);

	this.request
		.send(JSON.stringify(this.requestPayload))
		.set('Content-Type', 'application/json');
});

Then(/^the payload object should be added to the database, grouped under the "([a-zA-Z]+)" type$/, function (type) {
	this.type = type;
	client.get({
		//index: process.env.ELASTICSEARCH_INDEX,
		index: 'nodejstrainingproject',
		type,
		id: this.responsePayload,
	}, function(error, response, status) {
		if (error) {
			console.log(error, response, status);
		}
	});
});

Then('the newly-created user should be deleted', function () {
	client.delete({
		index: 'nodejstrainingproject',//process.env.ELASTICSEARCH_INDEX,
		type: this.type,
		id: this.responsePayload,
	}, function(error, response, status) {
		if (error) {
			console.log(error, response, status);
		}
	});
});

When(/^attaches (.+) as the payload$/, function (payload) {
	this.requestPayload = JSON.parse(payload);

	this.request
		.send(payload)
		.set('Content-Type', 'application/json');
});

When('a new user is created with random password and email', function () {
	this.requestPayload = getValidPayload('create user', client);

	var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
	var email_name = '';
	for(var ii=0; ii<15; ii++){
		email_name += chars[Math.floor(Math.random() * chars.length)];
	}

	this.requestPayload.email = email_name + '@domain.com';
	console.log(this.requestPayload.email);
	//this.request
	//	.send(JSON.stringify(this.requestPayload))
	//	.set('Content-Type', 'application/json');
	// Write code here that turns the phrase above into concrete actions
});


When('set a valid Retrieve Salt query string', function () {
	// Write code here that turns the phrase above into concrete actions
	let pattern  = '^\$2a\$10\$[a-zA-Z0-9\.\/]{22}$/';
	
	// something is wrong with the regex here
	const regex = new RegExp(this.requestPayload.digest);
	let test_pattern = regex.test(pattern);
	console.log(test_pattern, this.requestPayload.digest);

	//return 'pending';
});

Then('the payload should be equal to context.salt', function () {
	// Write code here that turns the phrase above into concrete actions
	return 'pending';
});

Then(/^the response string should satisfy the regular expression (.+)$/, function (regex) {
	const re = new RegExp(regex.trim().replace(/^\/|\/$/g, ''));
	assert.equal(re.test(this.responsePayload), true);
});

When('{int} new user is created with random password and email', function (int) {
	this.requestPayload = getValidPayload('create user', client);
	var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
	var email_name = '';
	for(var ii=0; ii<15; ii++){
		email_name += chars[Math.floor(Math.random() * chars.length)];
	}

	this.requestPayload.email = email_name + '@domain.com';

	//console.log('111111111111', this.requestPayload.email);
});

When('saves the response text in the context under token', function () {
	this.token = this.responsePayload;
});

When('set {string} as a query parameter', function (string) {
	this.requestPayload = getValidPayload('login', client);
	this.requestPayload.email = string;

	this.request
		.send(JSON.stringify(this.requestPayload))
		.set('Content-Type', 'application/json');
});