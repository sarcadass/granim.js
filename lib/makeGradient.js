'use strict';

module.exports = function() {
	var i;
	var gradient = this.setDirection();
	var colorPosition;
	var elToSetClassOnClass = document.querySelector(this.elToSetClassOn).classList;
	this.context.clearRect(0, 0, this.x1, this.y1);

	for (i = 0; i < this.currentColors.length; i++) {
		// Ensure first and last position to be 0 and 100
		!i ? colorPosition = 0 : colorPosition = ((1 / (this.currentColors.length - 1)) * i).toFixed(2);

		gradient.addColorStop(colorPosition, 'rgba(' +
			this.currentColors[i][0] + ', ' +
			this.currentColors[i][1] + ', ' +
			this.currentColors[i][2] + ', ' +
			this.opacity[i] + ')'
		);
	}

	if (this.name) {
		if (this.getLightness() === 'light') {
			elToSetClassOnClass.remove(this.name + '-dark');
			elToSetClassOnClass.add(this.name + '-light');

		} else {
			elToSetClassOnClass.remove(this.name + '-light');
			elToSetClassOnClass.add(this.name + '-dark');
		}
	}

	this.context.fillStyle = gradient;
	this.context.fillRect(0, 0, this.x1, this.y1);
};
