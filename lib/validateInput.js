'use strict';

module.exports = function(inputType) {
	var xPositionValues = ['left', 'center', 'right'];
	var yPositionValues = ['top', 'center', 'bottom'];
	var stretchModeValues = ['none', 'stretch', 'stretch-if-smaller', 'stretch-if-bigger'];
	var blendingModeValues = ['multiply', 'screen', 'normal', 'overlay', 'darken',
		'lighten', 'lighter', 'color-dodge', 'color-burn', 'hard-light', 'soft-light',
		'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'];
	var directionValues = ['diagonal', 'left-right', 'top-bottom', 'radial', 'custom'];

	switch(inputType) {
		case 'image':
			// Validate image.position
			if ((!Array.isArray(this.image.position) || this.image.position.length !== 2) ||
				xPositionValues.indexOf(this.image.position[0]) === -1 ||
				yPositionValues.indexOf(this.image.position[1]) === -1
			) { this.triggerError('image.position'); }
			// Validate image.stretchMode
			if (this.image.stretchMode) {
				if ((!Array.isArray(this.image.stretchMode) || this.image.stretchMode.length !== 2) ||
					stretchModeValues.indexOf(this.image.stretchMode[0]) === -1 ||
					stretchModeValues.indexOf(this.image.stretchMode[1]) === -1
				) { this.triggerError('image.stretchMode'); }
			}
			break;

		case 'blendingMode':
			if (blendingModeValues.indexOf(this.image.blendingMode) === -1) {
				this.clear();
				this.triggerError('blendingMode');
			}
			break;

		case 'direction':
			if (directionValues.indexOf(this.direction) === -1) {
				this.triggerError('direction');
			} else {
				if (this.direction === 'custom') {
					if (!areDefinedInPixelsOrPercentage([
						this.customDirection.x0,
						this.customDirection.x1,
						this.customDirection.y0,
						this.customDirection.y1
					])) {
						this.triggerError('customDirection');
					}
				}
			}
			break;
	}
};

function areDefinedInPixelsOrPercentage(array) {
	var definedInPixelsOrPercentage = true, i = 0, value;
	while (definedInPixelsOrPercentage && i < array.length) {
		value = array[i];
		if (typeof value !== 'string') {
			definedInPixelsOrPercentage = false;
		} else {
			var splittedValue = null;
			var unit = null;
			if (value.indexOf('px') !== -1) unit = 'px';
			if (value.indexOf('%') !== -1) unit = '%';
			splittedValue = value.split(unit).filter(function(value) {
				return value.length > 0;
			});
			// Check if there is a unit ('px' or '%'),
			// a char before the unit,
			// no char after the unit,
			// the string without the unit is only composed of digits
			if (
				!unit
				|| splittedValue.length > 2
				|| !splittedValue[0]
				|| splittedValue[1]
				|| !/^-?\d+\.?\d*$/.test(splittedValue[0])
			) {
				definedInPixelsOrPercentage = false;
			}
		}
		i++;
	}
	return definedInPixelsOrPercentage;
}
