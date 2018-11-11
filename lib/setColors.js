'use strict';

module.exports = function() {
	var _this = this, colorDiff, colorPosDiff, nextColors, nextColorsPos;

	if (!this.channels[this.activeState]) this.channels[this.activeState] = [];

	// If the actual channel exist, reassign properties and exit
	// (each channel is saved to prevent recomputing it each time)
	if (this.channels[this.activeState][this.channelsIndex] !== undefined) {
		this.activeColors = this.channels[this.activeState][this.channelsIndex].colors;
		this.activeColorsDiff = this.channels[this.activeState][this.channelsIndex].colorsDiff;
		this.activeColorsPos = this.channels[this.activeState][this.channelsIndex].colorsPos;
		this.activeColorsPosDiff = this.channels[this.activeState][this.channelsIndex].colorsPosDiff;
		return;
	}

	// Set blank properties
	this.channels[this.activeState].push([{}]);
	this.channels[this.activeState][this.channelsIndex].colors = [];
	this.channels[this.activeState][this.channelsIndex].colorsDiff = [];
	this.channels[this.activeState][this.channelsIndex].colorsPos = [];
	this.channels[this.activeState][this.channelsIndex].colorsPosDiff = [];
	this.activeColors = [];
	this.activeColorsDiff = [];
	this.activeColorsPos = [];
	this.activeColorsPosDiff = [];

	// Go on each gradient of the current state
	this.states[this.activeState].gradients[this.channelsIndex].forEach(function(color, i) {
		// Push the hex color converted to rgba on the channel and the active color properties
		var colorPos = _this.getColorPos(color, i);
		var color = _this.getColor(color);
		var rgbaColor = _this.convertColorToRgba(color);
		var activeChannel = _this.channels[_this.activeState];

		activeChannel[_this.channelsIndex].colors.push(rgbaColor);
		_this.activeColors.push(rgbaColor);
		activeChannel[_this.channelsIndex].colorsPos.push(colorPos);
		_this.activeColorsPos.push(colorPos);

		// If it's the first channel to be set, set the currentColors
		if (!_this.isCurrentColorsSet) {
			_this.currentColors.push(_this.convertColorToRgba(color));
			_this.currentColorsPos.push(colorPos);
		}

		// If it's the last gradient, compute the color diff between the last gradient and the first one,
		// else between the penultimate one and the last one
		if (_this.channelsIndex === _this.states[_this.activeState].gradients.length - 1) {
			colorDiff = _this.getColorDiff(
				activeChannel[_this.channelsIndex].colors[i],
				activeChannel[0].colors[i]
			);
			colorPosDiff = _this.getColorPosDiff(
				activeChannel[_this.channelsIndex].colorsPos[i],
				activeChannel[0].colorsPos[i]
			);

		} else {
			nextColors = _this.convertColorToRgba(_this.getColor(_this.states[_this.activeState].gradients[_this.channelsIndex + 1][i]));
			nextColorsPos = _this.getColorPos(_this.states[_this.activeState].gradients[_this.channelsIndex + 1][i], i);
			colorDiff = _this.getColorDiff(activeChannel[_this.channelsIndex].colors[i], nextColors);
			colorPosDiff = _this.getColorPosDiff(activeChannel[_this.channelsIndex].colorsPos[i], nextColorsPos);
		}

		activeChannel[_this.channelsIndex].colorsDiff.push(colorDiff);
		_this.activeColorsDiff.push(colorDiff);
		activeChannel[_this.channelsIndex].colorsPosDiff.push(colorPosDiff);
		_this.activeColorsPosDiff.push(colorPosDiff);
	});

	this.activetransitionSpeed = this.states[this.activeState].transitionSpeed || 5000;
	this.isCurrentColorsSet = true;
};
