'use strict';

module.exports = function(progressPercent) {
	var _this = this;
	var activeChannel, i, j;

	// Loop through each colors of the active gradient
	for (i = 0; i < this.activeColors.length; i++) {

		// Generate RGBA colors
		for (j = 0; j < 4; j++) {
			// If color value [0-255] round to the integer,
			// Else if opacity [0-1] round to 2 decimals
			activeChannel = _this.activeColors[i][j] +
				(j !== 3
					? Math.ceil(_this.activeColorDiff[i][j] / 100 * progressPercent)
					: Math.round((_this.activeColorDiff[i][j] / 100 * progressPercent) * 100) / 100
				)
				Math.ceil(_this.activeColorDiff[i][j] / 100 * progressPercent);

			// Prevent colors values from going < 0 & > 255
			if (activeChannel <= 255 && activeChannel >= 0) {
				_this.currentColors[i][j] = activeChannel;
			}
		}
	}

	this.makeGradient();
};
