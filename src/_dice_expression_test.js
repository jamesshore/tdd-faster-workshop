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

		function value(expression, numbers) {
			return DiceExpression.create(expression).value(numbers);
		}
	});

});