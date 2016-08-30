'use strict';

module.exports = function() {
	var granim = this;
	var timeout;

	window.addEventListener('scroll', pauseWhenNotInView);
	pauseWhenNotInView();

	function pauseWhenNotInView() {
		if (timeout) clearTimeout(timeout);

		timeout = setTimeout(function() {
			var elPos = granim.canvas.getBoundingClientRect();
			var isNotInView =
				elPos.bottom < 0 ||
				elPos.right < 0 ||
				elPos.left > window.innerWidth ||
				elPos.top > window.innerHeight;

			if (isNotInView) {
				if (!granim.isPaused && !granim.isPausedBecauseNotInView) {
					granim.isPausedBecauseNotInView = true;
					granim.pause();
				}
			} else {
				if (granim.isPausedBecauseNotInView) {
					granim.isPausedBecauseNotInView = false;
					granim.play();

				}
			}
		}, 300);
	}
};
