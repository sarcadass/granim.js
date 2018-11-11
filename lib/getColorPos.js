'use strict';

module.exports = function(gradientColor, i) {
	if (typeof gradientColor === 'object' && gradientColor.pos) {
		return gradientColor.pos;

	} else {
		// Ensure first and last position to be 0 and 100
		return parseFloat(
			!i ? 0 : ((1 / (this.states[this.activeState].gradients[0].length - 1)) * i
		).toFixed(2));
	}
};
