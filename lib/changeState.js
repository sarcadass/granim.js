'use strict';

module.exports = function(state) {
	var _this = this;
	var nextColors, colorDiff;

	// Prevent transitioning to the same state
	if (this.activeState === state) {
		return;
	}

	// Setting the good properties for the transition
	if (!this.isPaused) {
		this.isPaused = true;
		this.pause();
	}

	this.channelsIndex = -1;
	this.activetransitionSpeed = this.stateTransitionSpeed;
	this.activeColorDiff = [];
	this.activeColors = this.getCurrentColors();
	this.progress = 0;
	this.previousTimeStamp = null;
	this.isChangingState = true;

	// Compute the gradient diff between the last frame gradient
	// and the first one of the new state
	this.states[state].gradients[0].forEach(function(color, i, arr) {
		nextColors = _this.hexToRgb(_this.states[state].gradients[0][i]);
		colorDiff = _this.colorDiff(_this.activeColors[i], nextColors);
		_this.activeColorDiff.push(colorDiff);
	});

	// Start the animation
	this.activeState = state;
	this.play();
};
