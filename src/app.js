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
		const input = this._cli.arg();
		const expression = DiceExpression.create(input);

		const randomNumbers = this._randomizer.generate(expression.numDice());
		const output = expression.value(randomNumbers);

		this._cli.output(output);
	}

};