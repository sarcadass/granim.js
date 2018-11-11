'use strict';

module.exports = function(gradientColor) {
	if (typeof gradientColor === 'string') {
		return gradientColor;

	} else if (typeof gradientColor === 'object' && gradientColor.color) {
		return gradientColor.color;

	} else {
		this.triggerError('gradient.color');
	}
};
