'use strict';

module.exports = function(state) {
	var isPausedBecauseNotInView = state === 'isPausedBecauseNotInView';
	if (!isPausedBecauseNotInView) this.isPaused = true;
	cancelAnimationFrame(this.animation);
};
