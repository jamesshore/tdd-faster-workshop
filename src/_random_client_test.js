// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert");
const HttpsTestServer = require("./__https_test_server");
const RandomClient = require("./random_client");

describe("RandomClient", function() {

	const VALID_RESPONSE_BODY = '{ "numbers": [ 0.3, 0.6, 0.9 ] }';

	let testServer;

	before(async function() {
		testServer = new HttpsTestServer();
		await testServer.startAsync();
	});

	after(async function() {
		await testServer.stopAsync();
	});

	describe("Happy path", function() {

		it("performs network request", async function() {
			const client = createClient({
				auth: "username:password",
			});

			testServer.setResponse({
				status: 200,
				body: VALID_RESPONSE_BODY,
			});

			await client.getNumbersAsync(3);
			assert.deepEqual(testServer.getRequests(), [
				{
					method: "GET",
					url: `/api/course/random_numbers?qty=3`,
					body: "",
					headers: {
						host: testServer.host(),
						authorization: "Basic dXNlcm5hbWU6cGFzc3dvcmQ=",
						"x-api-version": "1.0",
					}
				}
			]);
		});

		it("parses valid response", async function() {
			const client = createClient();
			testServer.setResponse({
				status: 200,
				body: '{ "numbers": [ 0.42, 0.777 ] }',
			});

			const numbers = await client.getNumbersAsync(2);
			assert.deepEqual(numbers, [ 0.42, 0.777 ]);
		});

	});


	describe("Unhappy paths", function() {

		it("fails fast if status isn't 'okay'", async function() {
			await checkFailureAsync(
				{ status: 500, body: VALID_RESPONSE_BODY },
				"Unexpected status"
			);
		});

		it("fails fast if response can't be parsed", async function() {
			await checkFailureAsync(
				{ status: 200, body: "{{{{ invalid_json }}}}" },
				"Failed to parse response body: Unexpected token { in JSON at position 1"
			);
		});

		it("fails fast if network request fails", async function() {
			const client = createClient({ certificate: null });

			const response = { status: "n/a", body: "n/a" };
			await assert.exceptionAsync(
				() => client.getNumbersAsync(3),
				expectedError("Network request failed: self signed certificate", 3, response)
			);
		});

		it("fails fast if status isn't 'okay'", async function() {
			await checkFailureAsync(
				{ status: 500, body: VALID_RESPONSE_BODY },
				"Unexpected status"
			);
		});

		it("fails fast if response doesn't contain numbers", async function() {
			await checkFailureAsync(
				{ status: 200, body: '{ "no_numbers": [ "foo" ] }' },
				"No 'numbers' field in response"
			);
		});

		it("fails fast if response isn't an array", async function() {
			await checkFailureAsync(
				{ status: 200, body: '{ "numbers": 0.33 }' },
				"'numbers' field should be an array"
			);
		});

		it("fails fast if response is out of bounds", async function() {
			await checkFailureAsync(
				{ status: 200, body: '{ "numbers": [ 1 ] }' },
				"'numbers' field contains values outside expected range (0 to 1, not including 1)"
			);
			await checkFailureAsync(
				{ status: 200, body: '{ "numbers": [ -0.1 ] }' },
				"'numbers' field contains values outside expected range (0 to 1, not including 1)"
			);
		});

	});


	describe("Null client", function() {

		it("provides hard-coded values", async function() {
			const client = RandomClient.createNull({ numbers: [ 0.1, 0.9, 0.42 ] });
			assert.deepEqual(await client.getNumbersAsync(3), [ 0.1, 0.9, 0.42 ]);
		});

		it("defaults to providing nothing", async function() {
			const client = RandomClient.createNull();
			assert.deepEqual(await client.getNumbersAsync(3), []);
		});

		it("can cause an error", async function() {
			const client = RandomClient.createNull({ error: "my_error_body", numbers: [] });
			await assert.exceptionAsync(
				() => client.getNumbersAsync(3),
				/my_error_body/
			);
		});

	});
	

	async function checkFailureAsync(response, expectedMessage) {
		const client = createClient();
		testServer.setResponse(response);

		await assert.exceptionAsync(
			() => client.getNumbersAsync(3),
			expectedError(expectedMessage, 3, response)
		);
	}

	function expectedError(message, quantity, response) {
		return `${message}\n` +
			`Service: Random (${testServer.hostname()}:${testServer.port()})\n` +
			`Endpoint: /api/course/random_numbers?qty=${quantity}\n` +
			`Status: ${response.status}\n` +
			`Response body: ${response.body}`;
	}

	function createClient({
		hostname = testServer.hostname(),
		port = testServer.port(),
		certificate = testServer.certificate(),
		auth = "irrelevant_user:irrelevant_password",
	} = {}) {
		return RandomClient.create({ hostname, port, certificate, auth });
	}

});
