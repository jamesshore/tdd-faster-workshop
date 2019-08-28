// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert.js");
const App = require("./app.js");
const CommandLine = require("./command_line.js");

describe("Application", function() {

	it("rolls dice", function() {
		const cli = CommandLine.createNull("4d12");

		const app = new App(cli);
		app.run();
		assert.equal(cli.getLastOutput(), 42);
	});

});