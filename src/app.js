// Copyright Titanium I.T. LLC.
"use strict";

const rot13 = require("./rot13.js");
const CommandLine = require("./command_line.js");

module.exports = class App {

	constructor(cli = CommandLine.create()) {
		this._cli = cli;
	}

	run() {
		const input = this._cli.arg();
		const output = rot13.transform(input);
		this._cli.output(output);
	}

};