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
		const app = createApp({ cli, randomizer });

		app.run();
		assert.equal(cli.getLastOutput(), 4);
	});

	it("fails gracefully when bad dice expression provided", function() {
		const cli = CommandLine.createNull("xxx");
		const app = createApp({ cli });

		app.run();
		assert.equal(cli.getLastOutput(), "Invalid dice expression: xxx");
	});

	it("fails gracefully when no dice expression provided", function() {
		const cli = CommandLine.createNull();
		const app = createApp({ cli });

		app.run();
		assert.equal(cli.getLastOutput(), "usage: run dice_expression\nexample: run 3d6");
	});

});

function createApp({ cli = CommandLine.createNull(), randomizer = Randomizer.createNull() } = {}) {
	return new App(cli, randomizer);
}