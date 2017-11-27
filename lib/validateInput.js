'use strict';

module.exports = function(inputType) {
	var xPositionValues = ['left', 'center', 'right'];
	var yPositionValues = ['top', 'center', 'bottom'];
	var stretchModeValues = ['stretch', 'stretch-if-smaller', 'stretch-if-bigger'];
	var blendingModeValues = ['multiply', 'screen', 'normal', 'overlay', 'darken',
		'lighten', 'lighter', 'color-dodge', 'color-burn', 'hard-light', 'soft-light',
		'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'];

	switch(inputType) {
		case 'image':
			// Validate image.position
			if ((!Array.isArray(this.image.position) || this.image.position.length !== 2) ||
				xPositionValues.indexOf(this.image.position[0]) === -1 ||
				yPositionValues.indexOf(this.image.position[1]) === -1
			) {this.triggerError('image.position')}
			// Validate image.stretchMode
			if (this.image.stretchMode) {
				if ((!Array.isArray(this.image.stretchMode) || this.image.stretchMode.length !== 2) ||
					stretchModeValues.indexOf(this.image.stretchMode[0]) === -1 ||
					stretchModeValues.indexOf(this.image.stretchMode[1]) === -1
				) {this.triggerError('image.stretchMode')}
			}
			break;
		case 'blendingMode':
			if (blendingModeValues.indexOf(this.image.blendingMode) === -1) {
				this.clear();
				this.triggerError('blendingMode');
			}
	}
};
