'use strict';

module.exports = function() {
	var ctx = this.context;

	switch(this.direction) {
		case 'diagonal':
			return ctx.createLinearGradient(0, 0, this.x1, this.y1);

		case 'left-right':
			return ctx.createLinearGradient(0, 0, this.x1, 0);

		case 'top-bottom':
			return ctx.createLinearGradient(this.x1 / 2, 0, this.x1 / 2, this.y1);

		case 'radial':
			return ctx.createRadialGradient(this.x1 / 2, this.y1 / 2, this.x1 / 2, this.x1 / 2, this.y1 / 2, 0);

		case 'custom':
			return ctx.createLinearGradient(
				getCustomCoordinateInPixels(this.customDirection.x0, this.x1),
				getCustomCoordinateInPixels(this.customDirection.y0, this.y1),
				getCustomCoordinateInPixels(this.customDirection.x1, this.x1),
				getCustomCoordinateInPixels(this.customDirection.y1, this.y1)
			);
	}
};

function getCustomCoordinateInPixels(coordinate, size) {
	return coordinate.indexOf('%') > -1
		? size / 100 * parseInt(coordinate.split('%')[0], 10)
		: parseInt(coordinate.split('px')[0], 10);
}
