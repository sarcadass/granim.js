'use strict';

module.exports = function() {
	this.animation = requestAnimationFrame(this.animateColors.bind(this));
};
