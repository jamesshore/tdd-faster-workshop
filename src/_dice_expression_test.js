// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert");
const DiceExpression = require("./dice_expression");

describe("DiceExpression", function() {

	it("determines number of dice to roll based on dice string", function() {
		assert.equal(numDice("d6"), 1);
		assert.equal(numDice("4d8"), 4);
		assert.equal(numDice("3d6+9"), 3);

		function numDice(expression) {
			return DiceExpression.create(expression).numDice();
		}
	});

	it("determines value of expression based on dice string and random numbers", function() {
		assert.equal(value("d6", [ .4 ]), 3);
		assert.equal(value("3d6", [ .4, 0, 0.9 ]), 3 + 1 + 6);
		assert.equal(value("1d4+9", [ 0 ]), 1 + 9);
		assert.equal(value("d8-1", [ 0.3 ]), 3 - 1);

		function value(expression, numbers) {
			return DiceExpression.create(expression).value(numbers);
		}
	});

	it("fails gracefully when expression is invalid", function() {
		assertFails("6", "no 'd'");
		assertFails("1dd6", "too many 'd's");
		assertFails("1d6++10", "too many '+'s");
		assertFails("1d6--10", "too many '-'s");
		assertFails("ed6", "non-numeric count");
		assertFails("1de", "non-numeric die");
		assertFails("1d6+e", "non-numeric addend");
		assertFails("0d6", "zero count");
		assertFails("-1d6", "negative count");
		assertFails("d0", "zero die");
		assertFails("d-3", "negative die");

		function assertFails(expression, message) {
			assert.exception(
				() => DiceExpression.create(expression),
				`Invalid dice expression: ${expression}`,
				message
			);
		}
	});

});