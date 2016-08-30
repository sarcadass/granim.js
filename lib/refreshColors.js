'use strict';

module.exports = function(progressPercent) {
	var activeChannel, j;
	var _this = this;

	this.activeColors.forEach(function(el, i, arr) {
		for (j = 0; j < 3; j++) {
			activeChannel = _this.activeColors[i][j] +
				Math.ceil(_this.activeColorDiff[i][j] /
					100 * progressPercent);

			if (activeChannel <= 255 && activeChannel >= 0) {
				_this.currentColors[i][j] = activeChannel;
			}
		}
	});

	this.makeGradient();
};
