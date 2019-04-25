// Copyright Titanium I.T. LLC.
"use strict";

module.exports = class CommandLine {

	static create() {
		return new CommandLine();
	}

	static createNull(arg) {
		return new CommandLine(arg);
	}

	constructor(nullArg) {
		this._nullArg = nullArg;
	}

	arg() {
		if (this._nullArg !== undefined) return this._nullArg;

		return process.argv[2];
	}

};