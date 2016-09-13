'use strict';

module.exports = function() {
	var _this = this;
	var timeout;

	window.addEventListener('scroll', pauseWhenNotInView);
	pauseWhenNotInView(true);

	function pauseWhenNotInView(init) {
		if (timeout) clearTimeout(timeout);

		timeout = setTimeout(function() {
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
				if (!_this.isPaused || init === true) {
					_this.isPausedBecauseNotInView = false;
					_this.play('isPausedBecauseNotInView');
				}
			}
		}, 300);
	}
};
