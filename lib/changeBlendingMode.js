'use strict';

module.exports = function(newBlendingMode) {
	this.context.globalCompositeOperation =
		this.image.blendingMode = newBlendingMode;
};
