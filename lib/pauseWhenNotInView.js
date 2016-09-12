'use strict';

module.exports = function() {
	var _this = this;
	var timeout;

	window.addEventListener('scroll', pauseWhenNotInView);
	pauseWhenNotInView();

	function pauseWhenNotInView() {
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
					_this.pause();
				}
			} else {
				if (_this.isPausedBecauseNotInView) {
					_this.isPausedBecauseNotInView = false;
					_this.play();
				}
			}
		}, 300);
	}
};
