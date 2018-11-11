'use strict';

module.exports = function() {
	var i, j;
	var currentColors = [];

	for (i = 0; i < this.currentColors.length; i++) {
		currentColors.push([]);

		for (j = 0; j < 4; j++) {
			currentColors[i].push(this.currentColors[i][j]);
		}
	}

	// Return a deep copy of the current colors
	return currentColors;
};
