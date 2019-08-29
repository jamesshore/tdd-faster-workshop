// Copyright Titanium I.T. LLC.
"use strict";

const https = require("https");

module.exports = class RandomClient {

	static create(options) {
		return new RandomClient(https, options);
	}

	static createNull({ error, numbers = [] } = {}) {
		let response;
		if (error === undefined) {
			const body = JSON.stringify({ numbers });
			response = { status: 200, body };
		}
		else {
			response = { status: 500, body: error };
		}

		return new RandomClient(new NullHttps(response), { hostname: "Null RandomClient" });
	}

	constructor(https, { hostname, port, certificate, auth }) {
		this._https = https;
		this._requestOptions = {
			hostname,
			port,
			ca: certificate,
			auth,
			headers: {
				"x-api-version": "1.0",
			},
		};
	}

	async getNumbersAsync(quantity) {
		const requestOptions = {
			...this._requestOptions,
			path: `/api/course/random_numbers?qty=${quantity}`,
		};
		const { status, body } = await performRequestAsync(this._https, requestOptions);
		if (status !== 200) fail(requestOptions, status, body, `Unexpected status`);

		const response = parseBodyOrFailFast(body, requestOptions, status);
		if (response.numbers === undefined) fail(requestOptions, status, body, "No 'numbers' field in response");
		const numbers = response.numbers;

		failIfBadNumbersResponse(numbers, requestOptions, status, body);
		return numbers;
	}

};

async function performRequestAsync(https, requestOptions) {
	try {
		return await new Promise((resolve, reject) => {
			const request = https.get(requestOptions);
			request.on("response", handleResponseFn(resolve, reject));
			request.on("error", reject);
			request.end();
		});
	}
	catch (err) {
		fail(requestOptions, "n/a", "n/a", `Network request failed: ${err.message}`);
	}
}

function handleResponseFn(resolve, reject) {
	return function(response) {
		let body = "";
		response.setEncoding("utf8");
		response.on("data", (chunk) => { body += chunk; });
		response.on("end", () => {
			resolve({
				status: response.statusCode,
				headers: response.headers,
				body
			});
		});
		response.on("error", reject);
	};
}

function parseBodyOrFailFast(body, requestOptions, status) {
	try {
		return JSON.parse(body);
	}
	catch (err) {
		fail(requestOptions, status, body, `Failed to parse response body: ${err.message}`);
	}
}

function failIfBadNumbersResponse(numbers, requestOptions, status, body) {
	if (!Array.isArray(numbers)) fail(requestOptions, status, body, "'numbers' field should be an array");

	const numbersInRange = numbers.every((number) => number >=0 && number < 1);
	if (!numbersInRange) {
		fail(
			requestOptions,
			status,
			body,
			"'numbers' field contains values outside expected range (0 to 1, not including 1)"
		);
	}
}

function fail(requestOptions, responseStatus, responseBody, message) {
	throw new Error(
		`${message}\n` +
		`Service: Random (${requestOptions.hostname}:${requestOptions.port})\n` +
		`Endpoint: ${requestOptions.path}\n` +
		`Status: ${responseStatus}\n` +
		`Response body: ${responseBody}`
	);
}


class NullHttps {
	constructor(response) { this._response = response; }

	get() {
		return new NullRequest(this._response);
	}
}

class NullRequest {
	constructor(response) { this._response = response; }

	on(event, handler) {
		if (event === "response") this._responseHandler = handler;
	}

	end() {
		this._responseHandler(new NullResponse(this._response));
	}
}

class NullResponse {
	constructor({ status, body }) {
		this.statusCode = status;
		this.headers = {};
		this._body = body;
	}

	on(event, handler) {
		if (event === "data") return setImmediate(() => handler(this._body));
		if (event === "end") setImmediate(handler);
	}

	setEncoding() {}
}
