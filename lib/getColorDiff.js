'use strict';

module.exports = function(colorA, colorB) {
	var i = 0;
	var colorDiff = [];

	for (i; i < 4; i++) {
		colorDiff.push(colorB[i] - colorA[i]);
	}

	return colorDiff;
};
