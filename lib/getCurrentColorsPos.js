'use strict';

module.exports = function() {
	var currentColorsPos = [], i;

	for (i = 0; i < this.currentColorsPos.length; i++) {
		currentColorsPos.push(this.currentColorsPos[i]);
	}

	// Return a deep copy of the current colors
	return currentColorsPos;
};
