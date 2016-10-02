'use strict';

module.exports = function() {
	if (!this.isPaused) {
		cancelAnimationFrame(this.animation);

	} else {
		this.isPaused = false;
	}
	this.isCleared = true;
	this.context.clearRect(0, 0, this.x1, this.y1);
};
