// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert.js");
const App = require("./app.js");
const CommandLine = require("./command_line.js");
const Randomizer = require("./randomizer.js");

describe("Application", function() {

	it("rolls dice", function() {
		const cli = CommandLine.createNull("4d12");
		const randomizer = Randomizer.createNull([ 0, 0, 0, 0 ]);

		const app = new App(cli, randomizer);
		app.run();
		assert.equal(cli.getLastOutput(), 4);
	});

});