// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert");
const App = require("./app");
const CommandLine = require("./command_line");
const RandomClient = require("./random_client");

describe("Application", function() {

	it("rolls dice", async function() {
		const cli = CommandLine.createNull("4d12");
		const randomClient = RandomClient.createNull({ numbers: [ 0, 0, 0, 0 ] });
		const app = createApp({ cli, randomClient });

		await app.runAsync();
		assert.equal(cli.getLastOutput(), 4);
	});

	it("fails gracefully when bad dice expression provided", function() {
		const cli = CommandLine.createNull("xxx");
		const app = createApp({ cli });

		app.runAsync();
		assert.equal(cli.getLastOutput(), "Invalid dice expression: xxx");
	});

	it("fails gracefully when no dice expression provided", function() {
		const cli = CommandLine.createNull();
		const app = createApp({ cli });

		app.runAsync();
		assert.equal(cli.getLastOutput(), "usage: run dice_expression\nexample: run 3d6");
	});

});

function createApp({ cli = CommandLine.createNull(), randomClient = RandomClient.createNull() } = {}) {
	return new App(cli, randomClient);
}