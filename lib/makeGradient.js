'use strict';

module.exports = function() {
	var gradient = this.setDirection();
	var elToSetClassOnClass = document.querySelector(this.elToSetClassOn).classList;
	var i = 0;
	this.context.clearRect(0, 0, this.x1, this.y1);

	if (this.image) {
		this.context.drawImage(
			this.imageNode,
			this.imagePosition.x,
			this.imagePosition.y,
			this.imagePosition.width,
			this.imagePosition.height
		);
	}

	for (i; i < this.currentColors.length; i++) {
		gradient.addColorStop(this.currentColorsPos[i], 'rgba(' +
			this.currentColors[i][0] + ', ' +
			this.currentColors[i][1] + ', ' +
			this.currentColors[i][2] + ', ' +
			this.currentColors[i][3] + ')'
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
