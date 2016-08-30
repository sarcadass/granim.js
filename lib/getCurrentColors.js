'use strict';

module.exports = function() {
	var j;
	var currentColors = [];

	this.currentColors.forEach(function(el, i, arr) {
		currentColors.push([]);

		for (j = 0; j < 3; j++) {
			currentColors[i].push(el[j])
		}
	});

	// Return a deep copy
	return currentColors;
};
