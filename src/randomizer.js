// Copyright Titanium I.T. LLC.
"use strict";

module.exports = class Randomizer {

	static create() {
		return new Randomizer();
	}

	generate(amount) {
		const result = [];
		for (let i = 0; i < amount; i++) {
			result.push(Math.random());
		}
		return result;
	}

};