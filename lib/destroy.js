'use strict';

module.exports = function() {
	this.onResize('removeListeners');
	this.onScroll('removeListeners');
	this.clear();
};
