// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert.js");
const App = require("./app.js");

describe("Application", function() {

	it("ROT-13s input", function() {
		const app = new App();
		const response = app.run("hello");
		assert.equal(response, "uryyb");
	});

});