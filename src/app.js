// Copyright Titanium I.T. LLC.
"use strict";

const CommandLine = require("./command_line");
const DiceExpression = require("./dice_expression");
const RandomClient = require("./random_client");

module.exports = class App {

	constructor(cli = CommandLine.create(), randomClient = createRandomClient()) {
		this._cli = cli;
		this._randomClient = randomClient;
	}

	async runAsync() {
		try {
			const input = this._cli.arg();
			if (input === undefined) throw new Error("usage: run dice_expression\nexample: run 3d6");
			const expression = DiceExpression.create(input);

			const randomNumbers = await this._randomClient.getNumbersAsync(expression.numDice());
			const output = expression.value(randomNumbers);

			this._cli.output(output);
		}
		catch (err) {
			this._cli.output(err.message);
		}
	}

};

function createRandomClient() {
	return RandomClient.create({
		hostname: "www.letscodejavascript.com",
		port: 443,
		auth: "tdd_course:password",    // NEVER hardcode credentials in real-world code! This is example code only.
	});
}