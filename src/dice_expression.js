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
	if (!expression.includes("d")) fail();

	let [ count, rest, ...tooManyDees ] = expression.split("d");
	if (tooManyDees.length > 0) fail();
	if (count === "") count = 1;
	if (count < 1) fail();

	let addendSplit = "+";
	if (rest.includes("-")) addendSplit = "-";
	let [ die, addend, ...tooManyAddends ] = rest.split(addendSplit);
	if (tooManyAddends.length > 0) fail();
	if (addend === undefined) addend = 0;
	if (addendSplit === "-") addend *= -1;
	if (die < 1) fail();

	[ count, die, addend ] = [ +count, +die, +addend ];
	if (Number.isNaN(count) || Number.isNaN(die) || Number.isNaN(addend)) fail();
	return [ count, die, addend ];

	function fail() {
		throw new Error(`Invalid dice expression: ${expression}`);
	}
}