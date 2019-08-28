// Copyright Titanium I.T. LLC.
"use strict";

const CommandLine = require("./command_line.js");

module.exports = class App {

	constructor(cli = CommandLine.create()) {
		this._cli = cli;
	}

	run() {
		const input = this._cli.arg();
		const output = 42;
		this._cli.output(output);
	}

};