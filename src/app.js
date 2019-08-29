// Copyright Titanium I.T. LLC.
"use strict";

const CommandLine = require("./command_line");
const DiceExpression = require("./dice_expression");

module.exports = class App {

	constructor(cli = CommandLine.create()) {
		this._cli = cli;
	}

	run() {
		const input = this._cli.arg();
		const expression = DiceExpression.create(input);
		const output = expression.value([ 0, 0, 0, 0 ]);
		this._cli.output(output);
	}

};