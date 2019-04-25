// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert.js");
const CommandLine = require("./command_line.js");

describe("CommandLine", function() {

	it("provides command-line arguments", function() {
		const oldArgs = process.argv;
		try {
			process.argv = [ "node", "filename.js", "my_arg" ];
			const cli = CommandLine.create();
			assert.equal(cli.arg(), "my_arg");
		}
		finally {
			process.argv = oldArgs;
		}
	});

});