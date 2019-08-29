// Copyright Titanium I.T. LLC.
"use strict";

const https = require("https");

module.exports = class RandomClient {

	static create(options) {
		return new RandomClient(options);
	}

	constructor({ hostname, port, certificate, auth }) {
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
		const { status, headers, body } = await performRequestAsync(requestOptions);
	}

};


function performRequestAsync(requestOptions) {
	return new Promise((resolve, reject) => {
		const request = https.get(requestOptions);
		request.on("response", handleResponseFn(resolve, reject));
		request.on("error", reject);
		request.end();
	});
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
