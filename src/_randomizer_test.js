// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert");
const Randomizer = require("./randomizer");

describe("Random Number", function() {

	it("generates as many numbers as requested", function() {
		const randomizer = Randomizer.create();
		const numbers = randomizer.generate(13);
		assert.equal(numbers.length, 13);
	});

	it("generates random numbers between 0 and 1 (not including 1)", function() {
		const randomizer = Randomizer.create();

		for (let i = 0; i < 1000; i++) {
			const [ val ] = randomizer.generate(1);
			assert.between(val, 0, 1);
			assert.notEqual(val, 1, "should not equal 1");
		}
	});

});