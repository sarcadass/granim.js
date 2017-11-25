'use strict';

var firstInit = true;

module.exports = function() {
	var _this = this;
	if (this.scrollDebounceTimeout) clearTimeout(this.scrollDebounceTimeout);

	this.scrollDebounceTimeout = setTimeout(function() {
		var elPos = _this.canvas.getBoundingClientRect();
		var isNotInView =
			elPos.bottom < 0 ||
			elPos.right < 0 ||
			elPos.left > window.innerWidth ||
			elPos.top > window.innerHeight;

		if (isNotInView) {
			if (!_this.isPaused && !_this.isPausedBecauseNotInView) {
				_this.isPausedBecauseNotInView = true;
				_this.pause('isPausedBecauseNotInView');
			}
		} else {
			if (!_this.isPaused || firstInit === true) {
				_this.isPausedBecauseNotInView = false;
				_this.play('isPausedBecauseNotInView');
				firstInit = false;
			}
		}
	}, 300);
};
