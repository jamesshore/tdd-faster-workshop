// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert.js");
const CommandLine = require("./command_line.js");
const stdout = require("test-console").stdout;

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

	it("outputs to console", function() {
		stdout.inspectSync((output) => {
			const cli = CommandLine.create();
			cli.output("my output");
			assert.deepEqual(output, [ "my output\n" ]);
		});
	});

	it("remembers last console output", function() {
		const cli = CommandLine.createNull();
		assert.equal(cli.getLastOutput(), null);
		cli.output("my output");
		assert.equal(cli.getLastOutput(), "my output");
	});

	it("argument is nullable", function() {
		const cli = CommandLine.createNull("null_arg");
		assert.equal(cli.arg(), "null_arg");
	});

	it("output is nullable", function() {
		stdout.inspectSync((output) => {
			const cli = CommandLine.createNull();
			cli.output("ignore me");
			assert.deepEqual(output, []);
		});
	});

});