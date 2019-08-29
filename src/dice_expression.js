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
	const regex = /^(\d*)d(\d+)([+-]\d+)?$/;

	const groups = regex.exec(expression);
	if (groups === null) fail();

	let [ ignored, count, die, addend ] = groups;
	if (count === "") count = 1;
	if (addend === undefined) addend = 0;

	[ count, die, addend ] = [ +count, +die, +addend ];   // convert strings to numbers
	if (count < 1) fail();
	if (die < 1) fail();

	return [ count, die, addend ];


	function fail() {
		throw new Error(`Invalid dice expression: ${expression}`);
	}
}