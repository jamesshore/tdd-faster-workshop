// Copyright Titanium I.T. LLC.
"use strict";

const CommandLine = require("./command_line");
const DiceExpression = require("./dice_expression");
const Randomizer = require("./randomizer");
const RandomClient = require("./random_client");

module.exports = class App {

	constructor(cli = CommandLine.create(), randomClient = createRandomClient(), randomizer = Randomizer.create()) {
		this._cli = cli;
		this._randomClient = randomClient;
		this._randomizer = randomizer;
	}

	async runAsync() {
		try {
			const input = this._cli.arg();
			if (input === undefined) throw new Error("usage: run dice_expression\nexample: run 3d6");
			const expression = DiceExpression.create(input);

			let randomNumbers;
			let serviceFailure = "";
			try {
				randomNumbers = await this._randomClient.getNumbersAsync(expression.numDice());
			}
			catch (err) {
				randomNumbers = this._randomizer.generate(expression.numDice());
				serviceFailure = `\nNote: service failed: ${err.message}`;
			}
			const output = expression.value(randomNumbers);

			this._cli.output(output + serviceFailure);
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