// Copyright Titanium I.T. LLC.
"use strict";

const rot13 = require("./rot13.js");

module.exports = class App {

	run(input) {
		return rot13.transform(input);
	}

};