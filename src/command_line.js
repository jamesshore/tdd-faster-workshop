// Copyright Titanium I.T. LLC.
"use strict";

module.exports = class CommandLine {

	static create() {
		return new CommandLine(process);
	}

	static createNull(arg) {
		return new CommandLine(new NullProcess(arg));
	}

	constructor(proc) {
		this._process = proc;
	}

	arg() {
		return this._process.argv[2];
	}

};

class NullProcess {
	constructor(arg) { this._arg = arg; }
	get argv() { return [ undefined, undefined, this._arg ]; }
}