'use strict';

module.exports = function() {
	var _this = this;
	var colorDiff, nextColors;

	if (!this.channels[this.activeState]) {
		this.channels[this.activeState] = [];
	}

	// If the actual channel exist, reassign properties and exit
	// (each channel is saved to prevent recomputing it each time)
	if (this.channels[this.activeState][this.channelsIndex] !== undefined) {
		this.activeColors = this.channels[this.activeState][this.channelsIndex].colors;
		this.activeColorDiff = this.channels[this.activeState][this.channelsIndex].colorsDiff;
		return;
	}

	// Set blank properties
	this.channels[this.activeState].push([{}]);
	this.channels[this.activeState][this.channelsIndex].colors = [];
	this.channels[this.activeState][this.channelsIndex].colorsDiff = [];
	this.activeColors = [];
	this.activeColorDiff = [];

	// Go on each gradient of the current state
	this.states[this.activeState].gradients[this.channelsIndex].forEach(function(color, i, arr) {
		// Push the hex color converted to rgb on the channel and the active color properties
		var rgbColor = _this.hexToRgb(color);
		var activeChannel = _this.channels[_this.activeState];

		activeChannel[_this.channelsIndex].colors.push(rgbColor);
		_this.activeColors.push(rgbColor);

		// If it's the first channel to be set, set the currentColors
		if (!_this.iscurrentColorsSet) {
			_this.currentColors.push(_this.hexToRgb(color));
		}

		// If it's the last gradient, compute the color diff between the last gradient and the first one,
		// else between the penultimate one and the last one
		if (_this.channelsIndex === _this.states[_this.activeState].gradients.length - 1) {
			colorDiff = _this.colorDiff(
				activeChannel[_this.channelsIndex].colors[i],
				activeChannel[0].colors[i]
			);
		} else {
			nextColors = _this.hexToRgb(_this.states[_this.activeState].gradients[_this.channelsIndex + 1][i]);
			colorDiff = _this.colorDiff(
				activeChannel[_this.channelsIndex].colors[i], nextColors
			);
		}

		activeChannel[_this.channelsIndex].colorsDiff.push(colorDiff);
		_this.activeColorDiff.push(colorDiff);
	});

	this.activetransitionSpeed = this.states[this.activeState].transitionSpeed || 5000;
	this.iscurrentColorsSet = true;
};
