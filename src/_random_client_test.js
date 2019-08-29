// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert");
const HttpsTestServer = require("./__https_test_server");
const RandomClient = require("./random_client");

describe("RandomClient", function() {

	let testServer;

	before(async function() {
		testServer = new HttpsTestServer();
		await testServer.startAsync();
	});

	after(async function() {
		await testServer.stopAsync();
	});

	it("performs network request", async function() {
		const client = RandomClient.create({
			hostname: testServer.hostname(),
			port: testServer.port(),
			certificate: testServer.certificate(),
			auth: "username:password",
		});

		testServer.setResponse({
			status: 200,
			body: '{ "numbers": [ 0.3, 0.6, 0.9 ] }',
		});

		await client.getNumbersAsync(3);
		assert.deepEqual(testServer.getRequests(), [{
			method: "GET",
			url: `/api/course/random_numbers?qty=3`,
			body: "",
			headers: {
				host: testServer.host(),
				authorization: "Basic dXNlcm5hbWU6cGFzc3dvcmQ=",
				"x-api-version": "1.0",
			}
		}]);
	});

});
