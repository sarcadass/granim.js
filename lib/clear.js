'use strict';

module.exports = function() {
	cancelAnimationFrame(this.animation);
	this.context.clearRect(0, 0, this.x1, this.y1);
};