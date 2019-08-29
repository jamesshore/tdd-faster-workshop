// Copyright Titanium I.T. LLC.
"use strict";

module.exports = class DiceExpression {

	static create(expression) {
		return new DiceExpression(expression);
	}

	constructor(expression) {
		[ this._count, this._die, this._addend ] = parseExpression(expression);
	}

	numDice() {
		return this._count;
	}

	value(randomNumbers) {
		let total = this._addend;
		for (let i = 0; i < this._count; i++) {
			const number = randomNumbers[i];
			total += Math.trunc(number * this._die + 1);
		}
		return total;
	}

};

function parseExpression(expression) {
	let [ count, rest ] = expression.split("d");
	let [ die, addend ] = rest.split("+");

	if (count === "") count = 1;
	if (!rest.includes("+")) addend = 0;

	return [ +count, +die, +addend ];
}