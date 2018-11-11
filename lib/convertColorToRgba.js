'use strict';

var regex = {
	hexa: /^#(?:[0-9a-fA-F]{3}){1,2}$/,
	rgba: /^rgba\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3}), ?(.?\d{1,3})\)$/,
	rgb: /^rgb\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)$/,
	hsla: /^hsla\((\d{1,3}), ?(\d{1,3})%, ?(\d{1,3})%, ?(.?\d{1,3})\)$/,
	hsl: /^hsl\((\d{1,3}), ?(\d{1,3})%, ?(\d{1,3})%\)$/
}, match;

module.exports = function(color) {
	switch(identifyColorType(color)) {
		default:
			this.triggerError('colorType');

		case 'hexa':
			return hexToRgba(color);

		case 'rgba':
			return [
				parseInt(match[1], 10),
				parseInt(match[2], 10),
				parseInt(match[3], 10),
				parseFloat(match[4])
			];

		case 'rgb':
			return [
				parseInt(match[1], 10),
				parseInt(match[2], 10),
				parseInt(match[3], 10),
				1
			];

		case 'hsla':
			return hslaToRgb(
				parseInt(match[1], 10) / 360,
				parseInt(match[2], 10) / 100,
				parseInt(match[3], 10) / 100,
				parseFloat(match[4])
			);

		case 'hsl':
			return hslaToRgb(
				parseInt(match[1], 10) / 360,
				parseInt(match[2], 10) / 100,
				parseInt(match[3], 10) / 100,
				1
			);
	}
};

function identifyColorType(color) {
	var colorTypes = Object.keys(regex);
	var i = 0;
	for (i; i < colorTypes.length; i++) {
		match = regex[colorTypes[i]].exec(color);
		if (match) return colorTypes[i];
	}
	return false;
}

function hexToRgba(hex) {
	// Expand shorthand form (e.g. '03F') to full form (e.g. '0033FF')
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		return r + r + g + g + b + b;
	});
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? [
		parseInt(result[1], 16),
		parseInt(result[2], 16),
		parseInt(result[3], 16),
		1
	] : null;
}

function hue2rgb(p, q, t) {
	if (t < 0) t += 1;
	if (t > 1) t -= 1;
	if (t < 1 / 6) return p + (q - p) * 6 * t;
	if (t < 1 / 2) return q;
	if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	return p;
}

function hslaToRgb(h, s, l, a) {
	var r, g, b, q, p;
	if (s === 0) {
		r = g = b = l; // achromatic
	} else {
		q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		p = 2 * l - q;
		r = hue2rgb(p, q, h + 1/3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1/3);
	}
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a];
}
