'use strict';

module.exports = function(newState) {
	var _this = this;

	// Prevent transitioning to the same state
	if (this.activeState === newState) {
		return;
	}

	// Setting the good properties for the transition
	if (!this.isPaused) {
		this.isPaused = true;
		this.pause();
	}

	this.channelsIndex = -1;
	this.activetransitionSpeed = this.stateTransitionSpeed;
	this.activeColorsDiff = [];
	this.activeColorsPosDiff = [];
	this.activeColors = this.getCurrentColors();
	this.activeColorsPos = this.getCurrentColorsPos();
	this.progress = 0;
	this.previousTimeStamp = null;
	this.isChangingState = true;

	// Compute the gradient color and pos diff between the last frame gradient
	// and the first one of the new state
	this.states[newState].gradients[0].forEach(function(gradientColor, i, arr) {
		var nextColors = _this.convertColorToRgba(_this.getColor(gradientColor));
		var nextColorsPos = _this.getColorPos(gradientColor, i);
		var colorDiff = _this.getColorDiff(_this.activeColors[i], nextColors);
		var colorPosDiff = _this.getColorPosDiff(_this.activeColorsPos[i], nextColorsPos);
		_this.activeColorsDiff.push(colorDiff);
		_this.activeColorsPosDiff.push(colorPosDiff);
	});

	// Start the animation
	this.activeState = newState;
	this.play();
};
