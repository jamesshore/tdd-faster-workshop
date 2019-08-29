// Copyright Titanium I.T. LLC.
"use strict";

const CommandLine = require("./command_line");
const DiceExpression = require("./dice_expression");
const Randomizer = require("./randomizer.js");

module.exports = class App {

	constructor(cli = CommandLine.create(), randomizer = Randomizer.create()) {
		this._cli = cli;
		this._randomizer = randomizer;
	}

	run() {
		try {
			const input = this._cli.arg();
			if (input === undefined) throw new Error("usage: run dice_expression\nexample: run 3d6");
			const expression = DiceExpression.create(input);

			const randomNumbers = this._randomizer.generate(expression.numDice());
			const output = expression.value(randomNumbers);

			this._cli.output(output);
		}
		catch (err) {
			this._cli.output(err.message);
		}
	}

};