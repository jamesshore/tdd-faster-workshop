// Copyright (c) 2018 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

//** An HTTPS server for use by focused integration tests

const https = require("https");
const promisify = require("util").promisify;

// To generate self-signed localhost cert good for 100 years, use this command:
//   openssl req -x509 -sha256 -nodes -newkey rsa:2048 -days 36500 -keyout localhost.key -out localhost.crt
// Use 'localhost' when asked for Common Name (e.g., fully qualified host name).

const SELF_SIGNED_LOCALHOST_CERT_FOR_TESTING_ONLY =
	"-----BEGIN CERTIFICATE-----\n" +
	"MIIDjjCCAnYCCQDTB3UP+VgKyDANBgkqhkiG9w0BAQsFADCBhzELMAkGA1UEBhMC\n" +
	"dXMxDzANBgNVBAgMBk9yZWdvbjERMA8GA1UEBwwIUG9ydGxhbmQxGjAYBgNVBAoM\n" +
	"EVRpdGFuaXVtIEkuVC4gTExDMRIwEAYDVQQDDAlsb2NhbGhvc3QxJDAiBgkqhkiG\n" +
	"9w0BCQEWFWpzaG9yZUBqYW1lc3Nob3JlLmNvbTAgFw0xOTA1MDUyMzU0MTZaGA8y\n" +
	"MTE5MDQxMTIzNTQxNlowgYcxCzAJBgNVBAYTAnVzMQ8wDQYDVQQIDAZPcmVnb24x\n" +
	"ETAPBgNVBAcMCFBvcnRsYW5kMRowGAYDVQQKDBFUaXRhbml1bSBJLlQuIExMQzES\n" +
	"MBAGA1UEAwwJbG9jYWxob3N0MSQwIgYJKoZIhvcNAQkBFhVqc2hvcmVAamFtZXNz\n" +
	"aG9yZS5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCjAnmR+H9S\n" +
	"b5rOvDytfmDRE5XH1FVLt/1YC6o5UnVFt1y66xNLTJdpR7psuRUjA/87jKX2efDe\n" +
	"jpXt5YmMCMSzEYo7i90HpZ0wm7sO8Fihxb9E5WOz0G0//drncqqoK3hEvF6qwMO4\n" +
	"bFU5pjFdEiBWo9N0keQfK1Usw4U6Fg9sNWMdRZaKkES1ibyhPZJxu66E4e5PHinE\n" +
	"eseD6jgxBxz41Vr4gN/WAlC3HMYwxgJ15yzDEJePc3AkY6togIlVQnKE9GTr40KL\n" +
	"LxWYC+cmxWjPFBfWXOEIXV3bllhWP96+6pKMX8Utv81XSqKcyJIKMUM4UlRKXlmW\n" +
	"IecSi9Xp2jtHAgMBAAEwDQYJKoZIhvcNAQELBQADggEBADG8VXLocS4RFTKvexbD\n" +
	"XeYHoWwiweeWr8etKeXuGswj7rCB0sqWnR/1FFv3ybsWy9sY2fGOaMNhxiU87KjH\n" +
	"zU8a026xrlwfUuYOunM+Gu3KSYDm6BJ2vsN9hXCgPwSauEpRlkoQdNu2rKmIqE+1\n" +
	"u8gKlha2LZX9FUFpNrHZJOHTEc1tayYjJh8W5hJqTEKmk/fGzC6C1eeSAfmcdnrd\n" +
	"5kBTC22RZtKc4n8KbuGKDCRXlXtFrdE2CN2ALcMzKRRT7M2Lv2at4N3GNkIKR0FV\n" +
	"gZPGWxMNzOs31sIgmMyImp2Tj70K+04UC7MuIxBnxOyvmJ2OHmTjzONSOSTNjg3F\n" +
	"5YI=\n" +
	"-----END CERTIFICATE-----";

const CERT_PRIVATE_KEY_FOR_TESTING_ONLY =
	"-----BEGIN PRIVATE KEY-----\n" +
	"MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCjAnmR+H9Sb5rO\n" +
	"vDytfmDRE5XH1FVLt/1YC6o5UnVFt1y66xNLTJdpR7psuRUjA/87jKX2efDejpXt\n" +
	"5YmMCMSzEYo7i90HpZ0wm7sO8Fihxb9E5WOz0G0//drncqqoK3hEvF6qwMO4bFU5\n" +
	"pjFdEiBWo9N0keQfK1Usw4U6Fg9sNWMdRZaKkES1ibyhPZJxu66E4e5PHinEeseD\n" +
	"6jgxBxz41Vr4gN/WAlC3HMYwxgJ15yzDEJePc3AkY6togIlVQnKE9GTr40KLLxWY\n" +
	"C+cmxWjPFBfWXOEIXV3bllhWP96+6pKMX8Utv81XSqKcyJIKMUM4UlRKXlmWIecS\n" +
	"i9Xp2jtHAgMBAAECggEADfayT0zIK1mgG0GIuRvwUzioRfvsapYSP66QIGTt4tD4\n" +
	"QpLMjlC7T6tzTsj0BJHdFU7RELIVbhsswLo+9B30K5q/CqbKglMvifBtL7RrA0Cb\n" +
	"R92Wktqx4R9v1w+9irZekRTJzzrACVZOXqfb5qsc1g8ml/+/WOQvYaxGB1nIbG5r\n" +
	"SzTg5lcaoU/xHvP/H2soyg5W33mh9TuzlnnHfjsb6g6xnZ1QuHBy39XhW53Ghdp/\n" +
	"lkGevqNQh//t/3WYBiFJZWigz6xX5BGq2k6rKOHqmUR7dGc5OllqSl2RWQxPcA4C\n" +
	"1Eo9/2S+LvJ1edNvlkeebiCmCMqU/+hPk3Y+FxyeQQKBgQDWUZqV9wWJBpFa03rX\n" +
	"nm4Vflz3ZeiEb7Qcl8fak5RuMJjYw1QBoVs9fYTQNnA+vj6eWQUmse3wFqGGIyhk\n" +
	"vjSDm2/SQv564t36qYYW7O4LD13ixWpCaixGvTBBKwdrS0yGflfmonKdbsi6OyYq\n" +
	"dduSTUhucWlWZzw/YMIttdbM0QKBgQDCtlG2SJMrqKa830+479YGOnPGw/oGyPsp\n" +
	"aNWTg5xa0w++eivw0mBVsn27W94xuON/VOwdCkxa92SqROgsFMKfiTV98YcjBYs/\n" +
	"xyVY9MDdAsk8Ow0tAGKsm0JDAhrJ5KPX9y6GdgScXB7YOdRRbj/FRHUNFtqqPYVH\n" +
	"lFaVFJuslwKBgC6RTKWJJwq/ApZZnTd8lS7WZhzbZ8pe+yO7VxGHP5kxtgRjbL1t\n" +
	"8gVKYLFdIsZ/T9vYO+ZMgwbH5BDhUsWRDpgKDiIBrInHAbSVYS1aDd8ZV60OeCg2\n" +
	"Kai1Mub2EoadteMDUNYsNfs/Nx4/++r98Ne5MyPMQLcld1HOFGMaP7IBAoGAR/MJ\n" +
	"BLuSrmpWmqpGEkeFpa2JxKP8Su+PZ8DWUvkqGKGvSqpofEew01nufgI3e9YfMpkV\n" +
	"2rFIf8C1EPn/dPKC7GLOQmiyj+1nhDy5f0KJ1eFGrRwBBWUEEVYZyRsI/Rugs5gi\n" +
	"OAt6LrEXsLzFyQVdSS6/tgOA77FmA4o76EDCOacCgYAJgxmIgwnJ4M5q9/Cb1p5i\n" +
	"xghOt4uoO4IjPhb208du2/1989iiA/iIOgT7AN3E8TisGZpM9O8EEb5DOKX7dZCr\n" +
	"Emj0Me5iM1MHK66HN3sGr61QeJtMrFxXA4Z0/JVSi945+uChD8bXKR9cDbPOP749\n" +
	"RfPEx3IPyWGoCtRqIW3oKg==\n" +
	"-----END PRIVATE KEY-----";

module.exports = class HttpsTestServer {

	constructor() {
		this._hostname = "localhost";
		this._port = 5030;
		this.reset();
	}

	reset() {
		this._forceRequestError = false;
		this._requests = [];
		this._responses = [];
	}

	hostname() { return this._hostname; }
	port() { return this._port; }
	host() { return this._hostname + ":" + this._port; }
	certificate() { return SELF_SIGNED_LOCALHOST_CERT_FOR_TESTING_ONLY; }

	getRequests() { return this._requests; }

	async startAsync() {
		const options = {
			cert: SELF_SIGNED_LOCALHOST_CERT_FOR_TESTING_ONLY,
			key: CERT_PRIVATE_KEY_FOR_TESTING_ONLY,
			secureProtocol: "TLSv1_method"
		};
		this._server = https.createServer(options);
		this._server.on("request", handleRequest.bind(null, this));

		await promisify(this._server.listen.bind(this._server))(this._port);
	}

	async stopAsync() {
		await promisify(this._server.close.bind(this._server))();
	}

	setResponses(responses) {
		this._responses = responses;
	}
	
	setResponse(response) {
		this._responses = [ response ];
	}

	forceErrorDuringRequest() {
		this._forceRequestError = true;
	}

};

function handleRequest(self, request, response) {
	let responseInfo = self._responses.shift();
	if (responseInfo === undefined) responseInfo = { status: 503, body: "No response defined in HttpsTestServer" };

	const requestInfo = {
		method: request.method,
		url: request.url,
		headers: Object.assign({}, request.headers),
		body: ""
	};
	delete requestInfo.headers.connection;
	self._requests.push(requestInfo);

	if (self._forceRequestError) request.destroy();

	request.on("data", function(data) {
		requestInfo.body += data;
	});
	request.on("end", function() {
		response.statusCode = responseInfo.status;
		response.setHeader("Date", "harness_date_header");
		response.end(responseInfo.body);
	});
}
