'use strict';

module.exports = function() {
	var currentColors = this.getCurrentColors();
	var colorsAverage = [];
	var gradientAverage = null;
	var lightnessAverage;

	currentColors.forEach(function(el, i, arr) {
		// Compute the average lightness of each color
		// in the current gradient
		colorsAverage.push(
			Math.max(el[0], el[1], el[2])
		)
	});

	colorsAverage.forEach(function(el, i, arr) {
		// Add all the average lightness of each color
		gradientAverage = gradientAverage === null ?
			el :
			gradientAverage + el;

		if (i === colorsAverage.length - 1) {
			// if it's the last lightness average
			// divide it by the total length to
			// have the global average lightness
			lightnessAverage = Math.round(gradientAverage / (i + 1));
		}
	});

	return lightnessAverage >= 128 ? 'light' : 'dark';
};
