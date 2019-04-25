// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert.js");
const rot13 = require("./rot13.js");

describe("ROT-13", function() {

	it("rotates letters halfway through alphabet", function() {
		assert.equal(rot13.transform("a"), "n");
		assert.equal(rot13.transform("n"), "a");
		assert.equal(rot13.transform("A"), "N");
		assert.equal(rot13.transform("abc"), "nop");
	});

	it("doesn't modify non letters", function() {
		assert.equal(rot13.transform("1"), "1");
		assert.equal(rot13.transform("_"), "_");
		assert.equal(rot13.transform("!9*)"), "!9*)");
	});

});