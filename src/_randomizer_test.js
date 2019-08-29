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


	describe("Null", function() {

		it("provides hard-coded values", function() {
			const randomizer = Randomizer.createNull([ 0.1, 0.9, 0.42 ]);
			assert.deepEqual(randomizer.generate(3), [ 0.1, 0.9, 0.42 ]);
		});

		it("provides internal default if no values provided at all", function() {
			const randomizer = Randomizer.createNull();
			assert.deepEqual(randomizer.generate(3), [ 0.99, 0.99, 0.99 ]);
		});

		it("fails fast when no more values are available", function() {
			const randomizer = Randomizer.createNull([]);
			assert.exception(
				() => randomizer.generate(1),
				"No more values available in null Randomizer"
			);
		});

		it("fails fast when hard-coded values are outside legal range", function() {
			let expectedMessage = " is outside legal range for random numbers (should be between 0 and 1, excluding 1)";
			assert.exception(
				() => Randomizer.createNull([ 0.1, 1 ]),
				`'1'${expectedMessage}`,
				"too large"
			);
			assert.exception(
				() => Randomizer.createNull([ 0, -1 ]),
				`'-1'${expectedMessage}`,
				"too small"
			);
		});

	});

});