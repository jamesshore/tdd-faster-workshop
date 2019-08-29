// Copyright Titanium I.T. LLC.
"use strict";

const NULL_DEFAULT = 0.99;

module.exports = class Randomizer {

	static create() {
		return new Randomizer(Math);
	}

	static createNull(values) {
		return new Randomizer(new NullMath(values));
	}

	constructor(math) {
		this._math = math;
	}

	generate(amount) {
		const result = [];
		for (let i = 0; i < amount; i++) {
			result.push(this._math.random());
		}
		return result;
	}

};


class NullMath {

	constructor(values) {
		if (values !== undefined) failIfValuesOutOfRange(values);

		this._values = values;
	}

	random() {
		if (this._values === undefined) return NULL_DEFAULT;
		if (this._values.length !== 0) return this._values.shift();
		throw new Error("No more values available in null Randomizer");
	}

}

function failIfValuesOutOfRange(values) {
	values.forEach((val) => {
		if (val < 0 || val >= 1) {
			throw new Error(`'${val}' is outside legal range for random numbers (should be between 0 and 1, excluding 1)`);
		}
	});
}