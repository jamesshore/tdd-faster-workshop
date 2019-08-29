// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert");
const App = require("./app");
const CommandLine = require("./command_line");
const Randomizer = require("./randomizer");
const RandomClient = require("./random_client");

describe("Application", function() {

	it("rolls dice", async function() {
		const cli = CommandLine.createNull("4d12");
		const randomClient = RandomClient.createNull({ numbers: [ 0, 0, 0, 0 ] });
		const app = createApp({ cli, randomClient });

		await app.runAsync();
		assert.equal(cli.getLastOutput(), "4");
	});

	it("falls back to local randomizer when service fails", async function() {
		const cli = CommandLine.createNull("4d12");
		const randomClient = RandomClient.createNull({ error: "my_failure" });
		const randomizer = Randomizer.createNull([ 0, 0, 0, 0 ]);
		const app = createApp({ cli, randomClient, randomizer });

		let expectedErrorMessage;
		try { await randomClient.getNumbersAsync(4); } catch (err) { expectedErrorMessage = err.message; }

		await app.runAsync();
		assert.equal(cli.getLastOutput(), `4\nNote: service failed: ${expectedErrorMessage}`);
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

function createApp({
	cli = CommandLine.createNull(),
	randomClient = RandomClient.createNull(),
	randomizer = Randomizer.createNull(),
} = {}) {
	return new App(cli, randomClient, randomizer);
}