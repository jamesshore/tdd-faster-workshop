// Copyright Titanium I.T. LLC.
"use strict";

const rot13 = require("./rot13.js");
const CommandLine = require("./command_line.js");

module.exports = class App {

	constructor(cli = CommandLine.create()) {
		this._cli = cli;
	}

	run() {
		return rot13.transform(this._cli.arg());
	}

};